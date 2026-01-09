
import { db } from "@/lib/firebase";
import { createHmac, timingSafeEqual } from "crypto";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

// Helper to generate slug
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[ğ]/g, 'g')
        .replace(/[ü]/g, 'u')
        .replace(/[ş]/g, 's')
        .replace(/[ı]/g, 'i')
        .replace(/[ö]/g, 'o')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// HMAC-SHA256 signature verification
function verifyHmacSignature(body: string, signature: string, secret: string): boolean {
    try {
        const expectedSignature = createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        const sigBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expectedSignature);

        if (sigBuffer.length !== expectedBuffer.length) {
            // Perform timing-safe comparison anyway to prevent timing attacks
            timingSafeEqual(sigBuffer, sigBuffer);
            return false;
        }

        return timingSafeEqual(sigBuffer, expectedBuffer);
    } catch {
        return false;
    }
}

export async function POST(req: NextRequest) {
    // 1. Security Check - HMAC Signature Verification
    const signature = req.headers.get("x-webhook-signature");
    // Also support legacy header for backward compatibility
    const legacySecret = req.headers.get("x-webhook-secret");
    const configuredSecret = process.env.N8N_WEBHOOK_SECRET;

    if (!configuredSecret) {
        return NextResponse.json(
            { error: "Server misconfiguration: N8N_WEBHOOK_SECRET not set" },
            { status: 500 }
        );
    }

    // Get raw body for signature verification
    const bodyText = await req.text();

    // Prefer HMAC signature, fall back to legacy secret header
    if (signature) {
        // HMAC signature verification (recommended)
        if (!verifyHmacSignature(bodyText, signature, configuredSecret)) {
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 401 }
            );
        }
    } else if (legacySecret) {
        // Legacy header-based auth (deprecated, for backward compatibility)
        const secretBuffer = Buffer.from(legacySecret);
        const expectedBuffer = Buffer.from(configuredSecret);

        if (secretBuffer.length !== expectedBuffer.length ||
            !timingSafeEqual(secretBuffer, expectedBuffer)) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        console.warn('Warning: Using deprecated x-webhook-secret header. Please migrate to HMAC signature.');
    } else {
        return NextResponse.json(
            { error: "Missing authentication: x-webhook-signature header required" },
            { status: 401 }
        );
    }

    try {
        // Parse body (already read as text for signature verification)
        const body = JSON.parse(bodyText);

        // 2. Minimal Validation
        if (!body.name) {
            return NextResponse.json(
                { error: "Missing required field: name" },
                { status: 400 }
            );
        }

        // 3. Prepare Data
        const slug = body.slug || generateSlug(body.name);

        // Construct the app object. We map the incoming JSON to our AppData structure.
        // We assume n8n sends clean data or we provide defaults.
        const appData = {
            name: body.name,
            slug: slug,
            developer: body.developer || "NexaraTechs Team",
            shortDescription: body.shortDescription || "No description provided.",
            fullDescription: body.fullDescription || body.shortDescription || "No description.",
            logoUrl: body.logoUrl || "", // n8n should send a public URL if available
            screenshots: Array.isArray(body.screenshots) ? body.screenshots : [],
            features: Array.isArray(body.features) ? body.features : [],
            status: body.status || "Beta",
            version: body.version || "1.0.0",
            releaseDate: body.releaseDate || new Date().toLocaleDateString('tr-TR'),
            category: body.category || "General",
            downloadUrl: body.downloadUrl || "#",
            privacyUrl: body.privacyUrl || "/privacy",
            order: typeof body.order === 'number' ? body.order : 999,
            createdAt: serverTimestamp() // Use server timestamp
        };

        // 4. Save to Firestore
        // Note: Using client SDK from server. 
        // If Firestore Security Rules allow public writes or write-if-authorized, 
        // this might fail if the server environment isn't authenticated.
        // However, for many setups, especially if we are in a trusted environment 
        // or rules are open for the 'apps' collection (which might be true if admin is client-side only),
        // we'll try this. If it fails, we need firebase-admin.
        const appsRef = collection(db, "apps");
        const docRef = await addDoc(appsRef, appData);

        return NextResponse.json({
            success: true,
            message: "App created successfully",
            id: docRef.id,
            slug: slug
        });

    } catch (error: any) {
        console.error("Error in n8n webhook:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

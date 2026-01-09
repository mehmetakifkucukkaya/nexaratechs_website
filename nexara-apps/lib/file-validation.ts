import { NextRequest } from 'next/server';

// Server-side file validation utility
// This mirrors the client-side validation but ensures security on the server

export interface FileValidationResult {
    valid: boolean;
    error?: string;
    detectedType?: string;
}

export const ALLOWED_IMAGE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif'
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validates a file's MIME type and size (basic validation)
 * Should be used on file upload API endpoints
 */
export function validateFileServer(
    file: File | Blob,
    allowedTypes: string[] = ALLOWED_IMAGE_TYPES,
    maxSize: number = MAX_FILE_SIZE
): FileValidationResult {
    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`
        };
    }

    // Check file size
    if (file.size > maxSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const maxMB = (maxSize / (1024 * 1024)).toFixed(0);
        return {
            valid: false,
            error: `File too large: ${sizeMB}MB. Maximum size: ${maxMB}MB`
        };
    }

    return { valid: true };
}

/**
 * Secure file validation with magic number detection
 * Reads file content to determine actual file type, preventing MIME spoofing
 */
export async function validateFileServerSecure(
    file: File | Blob,
    allowedTypes: string[] = ALLOWED_IMAGE_TYPES,
    maxSize: number = MAX_FILE_SIZE
): Promise<FileValidationResult> {
    // 1. Size check first (cheap operation)
    if (file.size > maxSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const maxMB = (maxSize / (1024 * 1024)).toFixed(0);
        return {
            valid: false,
            error: `File too large: ${sizeMB}MB. Maximum size: ${maxMB}MB`
        };
    }

    // 2. Magic number detection (read file content)
    try {
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        // Dynamic import for ESM module compatibility
        const { fileTypeFromBuffer } = await import('file-type');
        const fileType = await fileTypeFromBuffer(uint8Array);

        if (!fileType) {
            return {
                valid: false,
                error: 'Unable to determine file type from content. File may be corrupted or invalid.'
            };
        }

        // 3. Check detected MIME matches allowed types
        if (!allowedTypes.includes(fileType.mime)) {
            return {
                valid: false,
                error: `Invalid file type detected: ${fileType.mime}. Allowed: ${allowedTypes.join(', ')}`,
                detectedType: fileType.mime
            };
        }

        // 4. Extension verification (if filename available)
        const filename = (file as File).name || '';
        if (filename) {
            const expectedExt = '.' + fileType.ext;
            const fileExt = filename.toLowerCase().slice(filename.lastIndexOf('.'));

            // Allow common variations (e.g., .jpg vs .jpeg)
            const validExtensions: Record<string, string[]> = {
                'jpg': ['.jpg', '.jpeg'],
                'jpeg': ['.jpg', '.jpeg'],
                'png': ['.png'],
                'webp': ['.webp'],
                'gif': ['.gif'],
            };

            const allowedExts = validExtensions[fileType.ext] || [expectedExt];
            if (!allowedExts.includes(fileExt)) {
                return {
                    valid: false,
                    error: `File extension mismatch. Content is ${fileType.ext}, but filename has ${fileExt}.`,
                    detectedType: fileType.mime
                };
            }
        }

        return { valid: true, detectedType: fileType.mime };
    } catch (error) {
        console.error('File validation error:', error);
        return {
            valid: false,
            error: 'Failed to validate file content'
        };
    }
}

/**
 * Validates file from FormData in API route
 */
export async function validateFormDataFile(
    formData: FormData,
    fieldName: string,
    options?: {
        allowedTypes?: string[];
        maxSize?: number;
        required?: boolean;
        secure?: boolean; // Use magic number detection
    }
): Promise<FileValidationResult & { file?: File }> {
    const file = formData.get(fieldName) as File | null;

    if (!file || file.size === 0) {
        if (options?.required) {
            return { valid: false, error: `${fieldName} is required` };
        }
        return { valid: true }; // No file, but not required
    }

    // Use secure validation if requested
    const validation = options?.secure
        ? await validateFileServerSecure(
            file,
            options?.allowedTypes,
            options?.maxSize
        )
        : validateFileServer(
            file,
            options?.allowedTypes,
            options?.maxSize
        );

    if (!validation.valid) {
        return validation;
    }

    return { valid: true, file, detectedType: validation.detectedType };
}

/**
 * Validates content-type header for file upload requests
 */
export function validateContentType(req: NextRequest): boolean {
    const contentType = req.headers.get('content-type') || '';
    return contentType.includes('multipart/form-data');
}

/**
 * Check if file extension matches MIME type (basic check)
 * Helps prevent extension spoofing
 */
export function validateFileExtension(filename: string, mimeType: string): boolean {
    const extensionMap: Record<string, string[]> = {
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/webp': ['.webp'],
        'image/gif': ['.gif'],
    };

    const allowedExtensions = extensionMap[mimeType];
    if (!allowedExtensions) return false;

    const lowerFilename = filename.toLowerCase();
    return allowedExtensions.some(ext => lowerFilename.endsWith(ext));
}


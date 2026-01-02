import { NextRequest } from 'next/server';

// Server-side file validation utility
// This mirrors the client-side validation but ensures security on the server

export interface FileValidationResult {
    valid: boolean;
    error?: string;
}

export const ALLOWED_IMAGE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif'
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validates a file's MIME type and size
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
 * Validates file from FormData in API route
 */
export async function validateFormDataFile(
    formData: FormData,
    fieldName: string,
    options?: {
        allowedTypes?: string[];
        maxSize?: number;
        required?: boolean;
    }
): Promise<FileValidationResult & { file?: File }> {
    const file = formData.get(fieldName) as File | null;

    if (!file || file.size === 0) {
        if (options?.required) {
            return { valid: false, error: `${fieldName} is required` };
        }
        return { valid: true }; // No file, but not required
    }

    const validation = validateFileServer(
        file,
        options?.allowedTypes,
        options?.maxSize
    );

    if (!validation.valid) {
        return validation;
    }

    return { valid: true, file };
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

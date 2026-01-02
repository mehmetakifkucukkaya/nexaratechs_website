// __tests__/lib/file-validation.test.ts
// Unit tests for file validation utilities

import {
    ALLOWED_IMAGE_TYPES,
    MAX_FILE_SIZE,
    validateFileExtension,
    validateFileServer,
} from '@/lib/file-validation';

describe('File Validation', () => {
    describe('validateFileServer', () => {
        // Create mock file helper
        const createMockFile = (type: string, size: number): File => {
            const blob = new Blob([''], { type });
            Object.defineProperty(blob, 'size', { value: size });
            return blob as File;
        };

        it('should accept valid PNG file', () => {
            const file = createMockFile('image/png', 1024);
            const result = validateFileServer(file);
            expect(result.valid).toBe(true);
        });

        it('should accept valid JPEG file', () => {
            const file = createMockFile('image/jpeg', 1024);
            const result = validateFileServer(file);
            expect(result.valid).toBe(true);
        });

        it('should accept valid WebP file', () => {
            const file = createMockFile('image/webp', 1024);
            const result = validateFileServer(file);
            expect(result.valid).toBe(true);
        });

        it('should accept valid GIF file', () => {
            const file = createMockFile('image/gif', 1024);
            const result = validateFileServer(file);
            expect(result.valid).toBe(true);
        });

        it('should reject PDF file', () => {
            const file = createMockFile('application/pdf', 1024);
            const result = validateFileServer(file);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('Invalid file type');
        });

        it('should reject text file', () => {
            const file = createMockFile('text/plain', 1024);
            const result = validateFileServer(file);
            expect(result.valid).toBe(false);
        });

        it('should reject file exceeding max size', () => {
            const largeFile = createMockFile('image/png', MAX_FILE_SIZE + 1);
            const result = validateFileServer(largeFile);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('File too large');
        });

        it('should accept file at exactly max size', () => {
            const file = createMockFile('image/png', MAX_FILE_SIZE);
            const result = validateFileServer(file);
            expect(result.valid).toBe(true);
        });

        it('should use custom allowed types when provided', () => {
            const file = createMockFile('application/pdf', 1024);
            const result = validateFileServer(file, ['application/pdf']);
            expect(result.valid).toBe(true);
        });

        it('should use custom max size when provided', () => {
            const file = createMockFile('image/png', 100);
            const result = validateFileServer(file, ALLOWED_IMAGE_TYPES, 50);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('File too large');
        });

        it('should accept small files', () => {
            const file = createMockFile('image/png', 1);
            const result = validateFileServer(file);
            expect(result.valid).toBe(true);
        });
    });

    describe('validateFileExtension', () => {
        it('should validate PNG extension with image/png MIME', () => {
            expect(validateFileExtension('image.png', 'image/png')).toBe(true);
        });

        it('should validate JPEG extension with image/jpeg MIME', () => {
            expect(validateFileExtension('photo.jpg', 'image/jpeg')).toBe(true);
            expect(validateFileExtension('photo.jpeg', 'image/jpeg')).toBe(true);
        });

        it('should validate WebP extension with image/webp MIME', () => {
            expect(validateFileExtension('image.webp', 'image/webp')).toBe(true);
        });

        it('should validate GIF extension with image/gif MIME', () => {
            expect(validateFileExtension('animation.gif', 'image/gif')).toBe(true);
        });

        it('should be case insensitive for extensions', () => {
            expect(validateFileExtension('IMAGE.PNG', 'image/png')).toBe(true);
            expect(validateFileExtension('Photo.JPG', 'image/jpeg')).toBe(true);
        });

        it('should reject mismatched extension and MIME type', () => {
            expect(validateFileExtension('image.jpg', 'image/png')).toBe(false);
            expect(validateFileExtension('image.png', 'image/jpeg')).toBe(false);
        });

        it('should reject unknown MIME types', () => {
            expect(validateFileExtension('file.pdf', 'application/pdf')).toBe(false);
        });

        it('should reject files without proper extension', () => {
            expect(validateFileExtension('noextension', 'image/png')).toBe(false);
        });
    });

    describe('Constants', () => {
        it('should have correct allowed image types', () => {
            expect(ALLOWED_IMAGE_TYPES).toContain('image/png');
            expect(ALLOWED_IMAGE_TYPES).toContain('image/jpeg');
            expect(ALLOWED_IMAGE_TYPES).toContain('image/webp');
            expect(ALLOWED_IMAGE_TYPES).toContain('image/gif');
            expect(ALLOWED_IMAGE_TYPES).toHaveLength(4);
        });

        it('should have max file size of 5MB', () => {
            expect(MAX_FILE_SIZE).toBe(5 * 1024 * 1024);
        });
    });
});

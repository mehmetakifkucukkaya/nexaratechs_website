import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
        };
    },
    usePathname() {
        return '/';
    },
    useSearchParams() {
        return new URLSearchParams();
    },
}));

// Mock next-themes
jest.mock('next-themes', () => ({
    useTheme() {
        return {
            theme: 'dark',
            setTheme: jest.fn(),
            resolvedTheme: 'dark',
        };
    },
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
    console.error = (...args: unknown[]) => {
        if (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render')) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});

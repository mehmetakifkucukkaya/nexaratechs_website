import ErrorBoundary from '@/components/ErrorBoundary';
import { render, screen } from '@testing-library/react';

// Component that throws an error
const ThrowError = () => {
    throw new Error('Test error');
};

// Component that renders normally
const NormalComponent = () => <div>Normal content</div>;

describe('ErrorBoundary', () => {
    // Suppress console.error for these tests
    const originalError = console.error;
    beforeAll(() => {
        console.error = jest.fn();
    });
    afterAll(() => {
        console.error = originalError;
    });

    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <NormalComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText('Normal content')).toBeInTheDocument();
    });

    it('renders fallback UI when there is an error', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText('Bir şeyler ters gitti')).toBeInTheDocument();
        expect(screen.getByText('Tekrar Dene')).toBeInTheDocument();
        expect(screen.getByText('Ana Sayfa')).toBeInTheDocument();
    });

    it('renders custom fallback when provided', () => {
        render(
            <ErrorBoundary fallback={<div>Custom error</div>}>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText('Custom error')).toBeInTheDocument();
    });
});

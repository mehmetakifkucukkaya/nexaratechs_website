// __tests__/components/ContactForm.test.tsx
// Unit tests for ContactForm component

import ContactForm from '@/components/home/ContactForm';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the LanguageContext
jest.mock('@/lib/LanguageContext', () => ({
    useLanguage: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'contact.title': 'Join the Beta',
                'contact.subtitle': 'Be among the first to try our apps',
                'contact.emailPlaceholder': 'Enter your email',
                'contact.getEarlyAccess': 'Get Early Access',
                'contact.joining': 'Joining...',
                'contact.welcomeTitle': 'Welcome!',
                'contact.welcomeMessage': 'You are now on the list',
                'contact.registerAnother': 'Register another email',
                'contact.noSpam': 'No spam, we promise',
                'contact.errorMessage': 'An error occurred',
            };
            return translations[key] || key;
        },
    }),
}));

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ContactForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch.mockReset();
    });

    describe('Rendering', () => {
        it('should render the form', () => {
            render(<ContactForm />);
            expect(screen.getByText('Join the Beta')).toBeInTheDocument();
        });

        it('should render email input', () => {
            render(<ContactForm />);
            expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        });

        it('should render submit button', () => {
            render(<ContactForm />);
            expect(screen.getByText('Get Early Access')).toBeInTheDocument();
        });

        it('should render no spam message', () => {
            render(<ContactForm />);
            expect(screen.getByText('No spam, we promise')).toBeInTheDocument();
        });
    });

    describe('Form Validation', () => {
        it('should have email input with required attribute', () => {
            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            expect(emailInput).toHaveAttribute('type', 'email');
            expect(emailInput).toHaveAttribute('required');
        });
    });

    describe('Form Submission', () => {
        it('should call API on valid submission', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockFetch).toHaveBeenCalledWith('/api/join-beta', expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ email: 'test@example.com' })
                }));
            });
        });

        it('should show success state after successful submission', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Welcome!')).toBeInTheDocument();
            });
        });

        it('should show error message on failed submission', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: () => Promise.resolve({ error: 'Server error' })
            });

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Server error')).toBeInTheDocument();
            });
        });

        it('should show loading state during submission', async () => {
            // Make the promise not resolve immediately
            mockFetch.mockImplementation(() => new Promise(() => { }));

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            expect(screen.getByText('Joining...')).toBeInTheDocument();
        });

        it('should disable button during submission', async () => {
            mockFetch.mockImplementation(() => new Promise(() => { }));

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            const loadingButton = screen.getByRole('button');
            expect(loadingButton).toBeDisabled();
        });

        it('should clear email input after successful submission', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Welcome!')).toBeInTheDocument();
            });
        });

        it('should show duplicate email error', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 409,
                json: () => Promise.resolve({ error: 'Bu email adresi zaten kayıtlı' })
            });

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Bu email adresi zaten kayıtlı.')).toBeInTheDocument();
            });
        });

        it('should show rate limit error', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 429,
                json: () => Promise.resolve({ retryAfter: 120 })
            });

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/Çok fazla istek/)).toBeInTheDocument();
            });
        });
    });

    describe('Success State', () => {
        it('should allow registering another email', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Register another email')).toBeInTheDocument();
            });

            await userEvent.click(screen.getByText('Register another email'));

            // Form should be visible again
            expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        });
    });
});


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

// Mock the db module
jest.mock('@/lib/db', () => ({
    subscribeToBeta: jest.fn(),
}));

import { subscribeToBeta } from '@/lib/db';

describe('ContactForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
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
        it('should call subscribeToBeta on valid submission', async () => {
            (subscribeToBeta as jest.Mock).mockResolvedValue({ success: true });

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(subscribeToBeta).toHaveBeenCalledWith('test@example.com');
            });
        });

        it('should show success state after successful submission', async () => {
            (subscribeToBeta as jest.Mock).mockResolvedValue({ success: true });

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
            (subscribeToBeta as jest.Mock).mockRejectedValue(new Error('Network error'));

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('An error occurred')).toBeInTheDocument();
            });
        });

        it('should show loading state during submission', async () => {
            // Make the promise not resolve immediately
            (subscribeToBeta as jest.Mock).mockImplementation(() => new Promise(() => { }));

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            expect(screen.getByText('Joining...')).toBeInTheDocument();
        });

        it('should disable button during submission', async () => {
            (subscribeToBeta as jest.Mock).mockImplementation(() => new Promise(() => { }));

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            const loadingButton = screen.getByRole('button');
            expect(loadingButton).toBeDisabled();
        });

        it('should clear email input after successful submission', async () => {
            (subscribeToBeta as jest.Mock).mockResolvedValue({ success: true });

            render(<ContactForm />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const submitButton = screen.getByText('Get Early Access');

            await userEvent.type(emailInput, 'test@example.com');
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Welcome!')).toBeInTheDocument();
            });
        });
    });

    describe('Success State', () => {
        it('should allow registering another email', async () => {
            (subscribeToBeta as jest.Mock).mockResolvedValue({ success: true });

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

// __tests__/components/Footer.test.tsx
// Unit tests for Footer component

import Footer from '@/components/Footer';
import { render, screen } from '@testing-library/react';

// Mock the LanguageContext
jest.mock('@/lib/LanguageContext', () => ({
    useLanguage: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'footer.description': 'Premium mobile applications',
                'footer.privacy': 'Privacy Policy',
                'footer.newsletterTitle': 'Stay Updated',
                'footer.newsletterDescription': 'Get the latest updates',
                'footer.emailPlaceholder': 'Enter your email',
                'footer.rights': 'All rights reserved.',
                'footer.thanks': 'Thanks for subscribing!',
                'footer.subscribeError': 'Subscription failed',
            };
            return translations[key] || key;
        },
    }),
}));

// Mock the db module
jest.mock('@/lib/db', () => ({
    subscribeToNewsletter: jest.fn().mockResolvedValue({ success: true }),
}));

describe('Footer', () => {
    describe('Rendering', () => {
        it('should render the footer', () => {
            render(<Footer />);
            expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        });

        it('should render the logo', () => {
            render(<Footer />);
            expect(screen.getByAltText('NexaraTechs')).toBeInTheDocument();
        });

        it('should render NexaraTechs brand name', () => {
            render(<Footer />);
            expect(screen.getByText('NexaraTechs')).toBeInTheDocument();
        });

        it('should render description', () => {
            render(<Footer />);
            expect(screen.getByText('Premium mobile applications')).toBeInTheDocument();
        });

        it('should render privacy policy link', () => {
            render(<Footer />);
            expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
        });

        it('should render copyright with current year', () => {
            render(<Footer />);
            const currentYear = new Date().getFullYear();
            expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
        });
    });

    describe('Social Links', () => {
        it('should render X (Twitter) link', () => {
            render(<Footer />);
            // Find the link by href
            const xLink = document.querySelector('a[href="https://x.com/mehmetakifkkaya"]');
            expect(xLink).toBeInTheDocument();
        });

        it('should render email link', () => {
            render(<Footer />);
            const emailLink = document.querySelector('a[href="mailto:nexaratechs@gmail.com"]');
            expect(emailLink).toBeInTheDocument();
        });

        it('should NOT render GitHub link (removed)', () => {
            render(<Footer />);
            const githubLink = document.querySelector('a[href*="github.com"]');
            expect(githubLink).not.toBeInTheDocument();
        });

        it('should NOT render LinkedIn link (removed)', () => {
            render(<Footer />);
            const linkedinLink = document.querySelector('a[href*="linkedin.com"]');
            expect(linkedinLink).not.toBeInTheDocument();
        });
    });

    describe('Newsletter Section', () => {
        it('should render newsletter form', () => {
            render(<Footer />);
            expect(screen.getByText('Stay Updated')).toBeInTheDocument();
        });

        it('should render email input', () => {
            render(<Footer />);
            expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        });

        it('should have email input with correct type', () => {
            render(<Footer />);
            const emailInput = screen.getByPlaceholderText('Enter your email');
            expect(emailInput).toHaveAttribute('type', 'email');
        });
    });

    describe('Links', () => {
        it('should have privacy policy link pointing to /privacy', () => {
            render(<Footer />);
            const privacyLink = screen.getByText('Privacy Policy');
            expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy');
        });

        it('should have logo link pointing to home', () => {
            render(<Footer />);
            const logoLink = document.querySelector('a[href="/"]');
            expect(logoLink).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper footer role', () => {
            render(<Footer />);
            expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        });

        it('should have aria-labels on social links', () => {
            render(<Footer />);
            const socialLinks = document.querySelectorAll('.flex.items-center.gap-3 a');
            socialLinks.forEach(link => {
                expect(link).toHaveAttribute('aria-label');
            });
        });
    });
});

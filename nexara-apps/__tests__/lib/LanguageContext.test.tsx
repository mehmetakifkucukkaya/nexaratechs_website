// __tests__/lib/LanguageContext.test.tsx
// Unit tests for LanguageContext and useLanguage hook

import { LanguageProvider, useLanguage } from '@/lib/LanguageContext';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Test component to access the context
function TestComponent() {
    const { language, setLanguage, t } = useLanguage();

    return (
        <div>
            <span data-testid="current-language">{language}</span>
            <button onClick={() => setLanguage('en')}>Switch to EN</button>
            <button onClick={() => setLanguage('tr')}>Switch to TR</button>
            <span data-testid="translated-text">{t('nav.home')}</span>
            <span data-testid="missing-key">{t('nonexistent.key')}</span>
        </div>
    );
}

describe('LanguageContext', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    describe('LanguageProvider', () => {
        it('should provide default language', () => {
            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            // Default language might be 'en' or 'tr' depending on implementation
            const langElement = screen.getByTestId('current-language');
            expect(['en', 'tr']).toContain(langElement.textContent);
        });

        it('should allow changing language to English', async () => {
            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            await userEvent.click(screen.getByText('Switch to EN'));

            expect(screen.getByTestId('current-language')).toHaveTextContent('en');
        });

        it('should allow changing language to Turkish', async () => {
            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            // First switch to EN
            await userEvent.click(screen.getByText('Switch to EN'));
            // Then switch back to TR
            await userEvent.click(screen.getByText('Switch to TR'));

            expect(screen.getByTestId('current-language')).toHaveTextContent('tr');
        });
    });

    describe('Translation function', () => {
        it('should translate nav.home correctly when in English', async () => {
            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            await userEvent.click(screen.getByText('Switch to EN'));

            expect(screen.getByTestId('translated-text')).toHaveTextContent('Home');
        });

        it('should translate nav.home correctly when in Turkish', async () => {
            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            await userEvent.click(screen.getByText('Switch to TR'));

            expect(screen.getByTestId('translated-text')).toHaveTextContent('Ana Sayfa');
        });

        it('should return key for missing translations', () => {
            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            expect(screen.getByTestId('missing-key')).toHaveTextContent('nonexistent.key');
        });
    });

    describe('Language persistence', () => {
        it('should save language preference to localStorage', async () => {
            render(
                <LanguageProvider>
                    <TestComponent />
                </LanguageProvider>
            );

            await userEvent.click(screen.getByText('Switch to EN'));

            expect(localStorage.getItem('language')).toBe('en');
        });
    });
});

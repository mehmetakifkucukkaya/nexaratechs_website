// __tests__/lib/icon-map.test.ts
// Unit tests for icon mapping functionality

import { getIcon, iconMap } from '@/lib/icon-map';
import { Shield, Sparkles, Stars, Zap } from 'lucide-react';

describe('Icon Map', () => {
    describe('iconMap object', () => {
        it('should contain Zap icon', () => {
            expect(iconMap['Zap']).toBe(Zap);
        });

        it('should contain Stars icon', () => {
            expect(iconMap['Stars']).toBe(Stars);
        });

        it('should contain Shield icon', () => {
            expect(iconMap['Shield']).toBe(Shield);
        });

        it('should have FastIcon alias pointing to Zap', () => {
            expect(iconMap['FastIcon']).toBe(Zap);
        });

        it('should have all expected icons', () => {
            const expectedIcons = [
                'Zap', 'Stars', 'Shield', 'Smartphone', 'Globe',
                'BarChart3', 'Lock', 'MessageSquare', 'Sparkles',
                'Moon', 'Download', 'Share2', 'Rocket', 'FastIcon'
            ];

            expectedIcons.forEach(iconName => {
                expect(iconMap[iconName]).toBeDefined();
            });
        });
    });

    describe('getIcon function', () => {
        it('should return correct icon for valid name', () => {
            expect(getIcon('Zap')).toBe(Zap);
            expect(getIcon('Stars')).toBe(Stars);
            expect(getIcon('Shield')).toBe(Shield);
        });

        it('should return Sparkles as default for invalid name', () => {
            expect(getIcon('NonExistentIcon')).toBe(Sparkles);
        });

        it('should return Sparkles for empty string', () => {
            expect(getIcon('')).toBe(Sparkles);
        });

        it('should be case sensitive', () => {
            // 'zap' should not match 'Zap'
            expect(getIcon('zap')).toBe(Sparkles);
        });

        it('should handle FastIcon alias', () => {
            expect(getIcon('FastIcon')).toBe(Zap);
        });
    });
});

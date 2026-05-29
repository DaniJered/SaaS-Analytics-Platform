import { useEffect } from 'react';
import { useTheme } from './useTheme';

export const useCardGlow = () => {
    const { prefs } = useTheme();

    useEffect(() => {
        if (!prefs.cardLighting) return;

        const handleMouseMove = (e) => {
            const targetCard = e.target.closest('.card');
            if (targetCard) {
                const rect = targetCard.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                targetCard.style.setProperty('--x', `${x}px`);
                targetCard.style.setProperty('--y', `${y}px`);
            }
        };

        // Passive event listener for scrolling performance
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [prefs.cardLighting]);
};

import { useEffect } from 'react';
import gsap from 'gsap';
import { useTheme } from './useTheme';

export const useCursorFollower = (followerRef) => {
    const { prefs, theme } = useTheme();

    useEffect(() => {
        const follower = followerRef.current;
        if (!follower) return;

        if (!prefs.customCursor || prefs.reducedMotion) {
            follower.style.display = 'none';
            return;
        }

        follower.style.display = 'block';
        
        // Reset follower element properties on mount
        gsap.set(follower, { 
            scale: 1, 
            opacity: 1,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        });

        // Setup high-performance GSAP quickTo hooks
        const xTo = gsap.quickTo(follower, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(follower, "y", { duration: 0.6, ease: "power3.out" });

        const handleMouseMove = (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        const interactiveSelectors = 'a, button, input, select, textarea, .card, .btn, [role="button"], .interactive';
        
        const handleMouseOver = (e) => {
            if (e.target.closest(interactiveSelectors)) {
                gsap.to(follower, {
                    scale: 1.4,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        };

        const handleMouseOut = (e) => {
            if (e.target.closest(interactiveSelectors)) {
                gsap.to(follower, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        };

        const handleMouseLeave = () => {
            gsap.to(follower, { opacity: 0, duration: 0.3 });
        };

        const handleMouseEnter = () => {
            gsap.to(follower, { opacity: 1, duration: 0.3 });
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.body.addEventListener('mouseover', handleMouseOver);
        document.body.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseover', handleMouseOver);
            document.body.removeEventListener('mouseout', handleMouseOut);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            if (follower) {
                follower.style.display = 'none';
            }
        };
    }, [prefs.customCursor, prefs.reducedMotion, theme]);
};

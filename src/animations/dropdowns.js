import gsap from 'gsap';

/**
 * Animate dropdown menu opening (Micro interaction: 180ms)
 */
export const animateDropdownOpen = (panelEl) => {
    gsap.killTweensOf(panelEl);
    return gsap.fromTo(panelEl,
        { opacity: 0, scale: 0.95, y: -12 },
        { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.18, 
            ease: 'power3.out' 
        }
    );
};

/**
 * Animate dropdown menu closing (Micro interaction: 180ms)
 */
export const animateDropdownClose = (panelEl) => {
    gsap.killTweensOf(panelEl);
    return gsap.to(panelEl, {
        opacity: 0,
        scale: 0.95,
        y: -12,
        duration: 0.18,
        ease: 'power3.in'
    });
};

import gsap from 'gsap';

/**
 * Animate chart container entrance (Page transition timing: 700ms)
 */
export const animateChartEntrance = (chartContainerEl) => {
    return gsap.fromTo(chartContainerEl,
        { opacity: 0, scale: 0.98, y: 15 },
        { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.7, 
            ease: 'power2.out',
            clearProps: 'all'
        }
    );
};

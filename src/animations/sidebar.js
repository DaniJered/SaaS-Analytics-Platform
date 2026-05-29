import gsap from 'gsap';

/**
 * Animate sidebar expanding (Hover timing: 300ms)
 */
export const animateSidebarExpand = (sidebarEl, titleEl, labelsSelector) => {
    gsap.killTweensOf([sidebarEl, titleEl, labelsSelector]);
    
    const tl = gsap.timeline();
    tl.to(sidebarEl, {
        width: 256, // matches w-64
        duration: 0.3,
        ease: 'power3.out'
    });
    
    tl.fromTo(titleEl, 
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' },
        '-=0.15'
    );

    tl.fromTo(labelsSelector,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.2, stagger: 0.02, ease: 'power2.out' },
        '-=0.18'
    );
    
    return tl;
};

/**
 * Animate sidebar collapsing (Hover timing: 300ms)
 */
export const animateSidebarCollapse = (sidebarEl, titleEl, labelsSelector) => {
    gsap.killTweensOf([sidebarEl, titleEl, labelsSelector]);
    
    const tl = gsap.timeline();
    tl.to([titleEl, labelsSelector], {
        opacity: 0,
        x: -8,
        duration: 0.15,
        ease: 'power2.in'
    });
    
    tl.to(sidebarEl, {
        width: 80, // matches w-20 (w-0 on mobile is handled by css tailwind classes)
        duration: 0.3,
        ease: 'power3.inOut'
    }, '-=0.1');
    
    return tl;
};

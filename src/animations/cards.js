import gsap from 'gsap';

/**
 * Entrance animation for lists of cards (Layout timing: 500ms)
 */
export const animateCardsEntrance = (cardsSelector) => {
    return gsap.fromTo(cardsSelector, 
        { y: 20, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 0.5, 
            stagger: 0.06, 
            ease: 'power2.out',
            clearProps: 'transform'
        }
    );
};

/**
 * Standard card micro hover interaction (Hover timing: 300ms)
 */
export const animateCardHover = (cardEl, isHovered) => {
    return gsap.to(cardEl, {
        y: isHovered ? -2 : 0,
        duration: 0.3,
        ease: 'power2.out'
    });
};

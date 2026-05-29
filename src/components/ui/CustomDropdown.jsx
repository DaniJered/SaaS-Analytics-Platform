import React, { useState, useEffect, useRef } from 'react';
import { animateDropdownOpen, animateDropdownClose } from '../../animations/dropdowns';

export default function CustomDropdown({ value, onChange, options, icon = 'calendar', minWidth = '160px' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const timeoutRef = useRef(null);
    const dropdownRef = useRef(null);
    const panelRef = useRef(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 250); // slight delay for smooth UX
    };

    const handleOptionClick = (val) => {
        onChange(val);
        setIsOpen(false);
    };

    const toggleOpen = () => {
        setIsOpen(prev => !prev);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // GSAP animations for dropdown panels
    useEffect(() => {
        if (!panelRef.current) return;
        if (isOpen) {
            animateDropdownOpen(panelRef.current);
        } else {
            animateDropdownClose(panelRef.current);
        }
    }, [isOpen]);

    // Keyboard navigation support
    useEffect(() => {
        if (!isOpen) {
            setFocusedIndex(-1);
            return;
        }

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex(prev => (prev + 1) % options.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex(prev => (prev - 1 + options.length) % options.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < options.length) {
                    handleOptionClick(options[focusedIndex].value);
                } else {
                    setIsOpen(false);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, focusedIndex, options]);

    const selectedOption = options.find(o => o.value === value) || options[0];

    return (
        <div 
            className="relative z-50 inline-block text-left"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Trigger Button */}
            <button 
                type="button"
                onClick={toggleOpen}
                className={`btn border bg-white/[0.02] backdrop-blur-md text-sm flex items-center gap-3 transition-all duration-300 justify-between group rounded-xl px-4 py-2 hover:bg-white/[0.04] ${isOpen ? 'border-[var(--primary-color)]/40 shadow-[0_0_15px_rgba(255,122,0,0.15)] text-white' : 'border-[var(--border-color)] text-[var(--text-main)]'}`}
                style={{ minWidth }}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-2">
                    <div className={`icon-${icon} w-4 h-4 transition-colors duration-300 ${isOpen ? 'text-[var(--primary-color)]' : 'text-[var(--text-muted)]'}`}></div>
                    <span className="font-medium tracking-wide">{selectedOption.label}</span>
                </div>
                <div className={`icon-chevron-down w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'rotate-180 text-[var(--primary-color)]' : 'text-[var(--text-muted)] group-hover:text-white'}`}></div>
            </button>

            {/* Dropdown Panel */}
            <div 
                ref={panelRef}
                className="absolute top-full right-0 mt-3 w-56 rounded-xl border border-white/10 bg-[var(--surface-color)]/80 backdrop-blur-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] overflow-hidden origin-top-right opacity-0 scale-95 -translate-y-3 pointer-events-none"
                style={{ 
                    boxShadow: isOpen ? '0 0 0 1px rgba(255,255,255,0.05) inset, 0 24px 48px -12px rgba(0,0,0,0.5), 0 0 40px rgba(255,122,0,0.08)' : '',
                    pointerEvents: isOpen ? 'auto' : 'none'
                }}
                role="listbox"
            >
                <div className="p-1.5 flex flex-col gap-0.5">
                    {options.map((option, index) => {
                        const isSelected = value === option.value;
                        const isFocused = index === focusedIndex;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleOptionClick(option.value)}
                                className={`group relative flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-300 overflow-hidden ${isSelected || isFocused ? 'text-white' : 'text-[var(--text-muted)] hover:text-white'}`}
                                role="option"
                                aria-selected={isSelected}
                            >
                                {/* Hover / Active Background Layer */}
                                <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'bg-[var(--primary-color)]/10 opacity-100' : isFocused ? 'bg-white/5 opacity-80' : 'bg-white/5 opacity-0 group-hover:opacity-100'}`}></div>
                                
                                <span className={`relative z-10 font-medium tracking-wide transition-transform duration-300 ${isSelected || isFocused ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                                    {option.label}
                                </span>
                                
                                {/* Selected Indicator */}
                                <div className={`relative z-10 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 ${isSelected ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/20 scale-100 opacity-100' : 'border-transparent scale-50 opacity-0 group-hover:border-white/20 group-hover:scale-100 group-hover:opacity-100'}`}>
                                    {isSelected && <div className="w-1.5 h-1.5 bg-[var(--primary-color)] rounded-full shadow-[0_0_8px_var(--primary-color)]"></div>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

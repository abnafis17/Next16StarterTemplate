'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  className?: string;
  hideScrollbar?: boolean; // hide scrollbar but still allow scroll
  forcePosition?: 'top' | 'bottom'; // 👈 NEW optional prop
}

export const SearchableDropdown = ({
  value = '',
  onChange,
  placeholder = 'Search...',
  options,
  disabled = false,
  className = '',
  hideScrollbar = false,
  forcePosition, // optional manual override
}: SearchableDropdownProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [openUpwards, setOpenUpwards] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const ITEM_HEIGHT = 36;
  const MAX_VISIBLE_ITEMS = 5;

  const selectedOption = options.find((opt) => opt.value === value) || null;

  useEffect(() => {
    if (selectedOption) setSearchQuery(selectedOption.label);
    else setSearchQuery('');
  }, [selectedOption]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const needsScroll = filteredOptions.length > MAX_VISIBLE_ITEMS;

  const handleSelect = (option: Option) => {
    onChange?.(option.value);
    setIsOpen(false);
    setHighlightedIndex(0);
  };

  const handleClear = () => {
    onChange?.('');
    setSearchQuery('');
    setIsOpen(false);
    setHighlightedIndex(0);
  };

  // Close when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    if (!wrapperRef.current?.contains(e.target as Node)) setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle arrow key navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const option = filteredOptions[highlightedIndex];
      if (option) handleSelect(option);
    }
  };

  // Auto-scroll to highlighted item
  useEffect(() => {
    const currentItem = itemsRef.current[highlightedIndex];
    currentItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [highlightedIndex]);

  // Determine dropdown direction (bottom or top)
  useEffect(() => {
    if (isOpen && wrapperRef.current && !forcePosition) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const dropdownHeight = Math.min(filteredOptions.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    } else if (forcePosition === 'top') {
      setOpenUpwards(true);
    } else if (forcePosition === 'bottom') {
      setOpenUpwards(false);
    }
  }, [isOpen, filteredOptions.length, forcePosition]);

  const dropdownClasses = `
    absolute z-50 w-full border rounded-md bg-white shadow
    ${openUpwards ? 'bottom-full mb-1' : 'mt-1'}
    ${needsScroll ? 'overflow-y-auto' : 'overflow-y-hidden'}
    ${hideScrollbar && needsScroll ? 'scrollbar-none' : ''}
  `;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <Input
        disabled={disabled}
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(0);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        readOnly={disabled}
      />

      {selectedOption && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {isOpen && (
        <div
          className={dropdownClasses}
          style={{
            maxHeight: needsScroll ? `${ITEM_HEIGHT * MAX_VISIBLE_ITEMS}px` : 'auto',
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => (
              <div
                key={opt.value}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                className={`px-3 py-2 cursor-pointer text-sm ${
                  value === opt.value
                    ? 'bg-blue-400 text-white'
                    : highlightedIndex === index
                      ? 'bg-gray-200'
                      : 'hover:bg-gray-100'
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-muted-foreground text-sm">No items found</div>
          )}
        </div>
      )}
    </div>
  );
};

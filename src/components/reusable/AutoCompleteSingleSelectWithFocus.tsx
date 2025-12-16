'use client';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect, useRef, useState } from 'react';
import { Control } from 'react-hook-form';
import { X } from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

interface AutoCompleteSingleSelectProps {
  name: string;
  control: Control<any>;
  label?: string;
  description?: string;
  placeholder?: string;
  dataList: Option[];
  defaultValue?: string;
  required?: boolean;
  dropdownOnFocus?: boolean;
  disabled?: boolean;
  forcePosition?: 'top' | 'bottom';
}

export const AutoCompleteSingleSelectWithFocus = ({
  name,
  control,
  label = 'Select',
  description,
  placeholder = 'Search...',
  dataList,
  required = false,
  dropdownOnFocus = false,
  disabled = false,
  forcePosition,
}: AutoCompleteSingleSelectProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const ITEM_HEIGHT = 48;
  const MAX_VISIBLE_ITEMS = 3;

  // Detect available space to open dropdown above or below
  const checkDropdownPosition = () => {
    if (forcePosition) {
      setOpenUpward(forcePosition === 'top');
      return;
    }

    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = ITEM_HEIGHT * MAX_VISIBLE_ITEMS + 20;

    // auto logic: open upward if less space below and enough space above
    setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
  };

  useEffect(() => {
    if (isFocused) checkDropdownPosition();
  }, [isFocused, dataList.length, forcePosition]);

  useEffect(() => {
    const handleResize = () => {
      if (isFocused) checkDropdownPosition();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isFocused, forcePosition]);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        useEffect(() => {
          if (field.value?.id) {
            setSearchQuery(field.value.name);
          } else {
            setSearchQuery('');
          }
        }, [field.value]);

        let filteredData = dataList.filter((item) =>
          item.name?.toLowerCase().includes(searchQuery?.toLowerCase())
        );

        // Keep selected item on top
        if (field.value?.id) {
          const selectedItem = dataList.find((item) => item.id === field.value.id);
          if (selectedItem) {
            filteredData = [
              selectedItem,
              ...filteredData.filter((item) => item.id !== selectedItem.id),
            ];
          }
        }

        const handleSelect = (item: Option) => {
          if (field.value?.id === item.id) {
            field.onChange(null);
          } else {
            field.onChange(item);
          }
        };

        const handleBlur = () => {
          if (dropdownOnFocus) {
            setTimeout(() => setIsFocused(false), 150);
          }
        };

        const handleClear = () => {
          field.onChange(null);
          setSearchQuery('');
        };

        return (
          <FormItem>
            <FormLabel required={required}>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}

            <div className="relative" ref={wrapperRef}>
              <div className="relative">
                <Input
                  disabled={disabled}
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={(e) => {
                    if (!field.value?.id) setSearchQuery(e.target.value);
                  }}
                  readOnly={!!field.value?.id}
                  onFocus={() => {
                    if (dropdownOnFocus) {
                      setIsFocused(true);
                      checkDropdownPosition();
                    }
                  }}
                  onBlur={handleBlur}
                />
                {field.value?.id && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className={`${
                      disabled ? 'hidden' : 'absolute'
                    } right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {(dropdownOnFocus ? isFocused : true) && (
                <div
                  className={`z-50 border rounded-md bg-white shadow transition-all duration-200 ${
                    openUpward
                      ? 'absolute left-0 right-0 bottom-full mb-2'
                      : 'absolute left-0 right-0 top-full mt-1'
                  }`}
                  style={{
                    maxHeight: `${ITEM_HEIGHT * MAX_VISIBLE_ITEMS}px`,
                    overflowY: 'auto',
                  }}
                >
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-2 p-3 border-b last:border-0 ${
                          field.value?.id === item.id ? 'bg-blue-100' : 'hover:bg-gray-50'
                        }`}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <Checkbox
                          className="cursor-pointer"
                          checked={field.value?.id === item.id}
                          onCheckedChange={() => handleSelect(item)}
                        />
                        <div onClick={() => handleSelect(item)}>
                          <p className="text-sm font-medium cursor-pointer">{item.name}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">No items found</div>
                  )}
                </div>
              )}
            </div>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

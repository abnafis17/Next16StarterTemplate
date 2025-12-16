'use client';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect, useRef, useState } from 'react';
import { Control } from 'react-hook-form';
import { X } from 'lucide-react'; // For optional clear icon (or use any)

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
}

export const AutoCompleteSingleSelect = ({
  name,
  control,
  label = 'Select',
  description,
  placeholder = 'Search...',
  dataList,
  required = false,
  dropdownOnFocus = false,
  disabled = false,
}: AutoCompleteSingleSelectProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const ITEM_HEIGHT = 48;
  const MAX_VISIBLE_ITEMS = 3;

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

        // Put selected item at the top for easy access
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
                  onFocus={() => dropdownOnFocus && setIsFocused(true)}
                  onBlur={handleBlur}
                />
                {field.value?.id && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className={`${disabled ? 'hidden' : 'absolute'}   right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {(dropdownOnFocus ? isFocused : true) && (
                <div
                  className={`z-50 border rounded-md bg-white shadow ${
                    dropdownOnFocus ? 'absolute left-0 right-0 mt-1' : 'relative mt-2'
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
                          field.value?.id === item.id ? 'bg-blue-400' : 'hover:bg-gray-50'
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

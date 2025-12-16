'use client';

import { Input } from '@/components/ui/input';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect, useRef, useState } from 'react';
import { Control } from 'react-hook-form';

interface Option {
  id: string;
  name: string;
}

interface AutoSearchCompleteProps {
  name: string;
  control: Control<any>;
  label?: string;
  description?: string;
  placeholder?: string;
  dataList: Option[]; // 🔹 Parent provides filtered list
  required?: boolean;
  dropdownOnFocus?: boolean;
  disabled?: boolean;
  loading?: boolean; // 🔹 Optional loading indicator
  onSearchChange?: (val: string) => void; // 🔹 Callback to trigger fetch
}

export const AutoSearchComplete = ({
  name,
  control,
  label = 'Search',
  description,
  placeholder = 'Type to search...',
  dataList,
  required = false,
  dropdownOnFocus = false,
  disabled = false,
  loading = false,
  onSearchChange,
}: AutoSearchCompleteProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const ITEM_HEIGHT = 48;
  const MAX_VISIBLE_ITEMS = 3;

  return (
    <FormField
      name={name}
      control={control}
      rules={{
        required: required ? `${label} is required` : false,
        validate: (value) => {
          const exists = dataList.some((item) => item.name.toLowerCase() === value?.toLowerCase());
          return exists ? `${label} already exists` : true;
        },
      }}
      render={({ field }) => {
        useEffect(() => {
          if (field.value) {
            setSearchQuery(field.value);
          } else {
            setSearchQuery('');
          }
        }, [field.value]);

        const handleBlur = () => {
          if (dropdownOnFocus) {
            setTimeout(() => setIsFocused(false), 150);
          }
        };

        return (
          <FormItem className="h-fit">
            <FormLabel required={required}>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}

            <div className="relative" ref={wrapperRef}>
              <Input
                disabled={disabled}
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  field.onChange(e.target.value);
                  onSearchChange?.(e.target.value); // 🔹 parent fetch trigger
                }}
                onFocus={() => dropdownOnFocus && setIsFocused(true)}
                onBlur={handleBlur}
              />

              {(dropdownOnFocus ? isFocused : true) && searchQuery && (
                <div
                  className="absolute left-0 right-0 z-50 mt-1 border rounded-md bg-white shadow"
                  style={{
                    maxHeight: `${ITEM_HEIGHT * MAX_VISIBLE_ITEMS}px`,
                    overflowY: 'auto',
                  }}
                >
                  {loading ? (
                    <p className="p-2 text-sm text-gray-500">Loading...</p>
                  ) : dataList.length > 0 ? (
                    dataList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSearchQuery(item.name);
                          field.onChange(item.name);
                          setIsFocused(false);
                        }}
                        className={`px-3 py-1.5 border-b last:border-0 hover:bg-gray-50 ${
                          item.name.toLowerCase() === searchQuery.toLowerCase()
                            ? 'bg-red-100 text-red-600 font-semibold'
                            : ''
                        }`}
                      >
                        <p className="text-sm">{item.name}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-2 text-sm text-gray-500">No results found</p>
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

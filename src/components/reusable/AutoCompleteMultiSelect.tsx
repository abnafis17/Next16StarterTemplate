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

interface AutoCompleteMultiSelectProps {
  name?: string;
  control?: Control<any>;
  label?: string;
  description?: string;
  placeholder?: string;
  dataList: Option[];
  required?: boolean;
  dropdownOnFocus?: boolean;
  disabled?: boolean;
  value: string[];
  onChange: (value: string[]) => void;
}

export const AutoCompleteMultiSelect = ({
  name,
  control,
  label = 'Select',
  description,
  placeholder = 'Search...',
  dataList,
  required = false,
  dropdownOnFocus = false,
  disabled = false,
  value = [],
  onChange,
}: AutoCompleteMultiSelectProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const ITEM_HEIGHT = 48;
  const MAX_VISIBLE_ITEMS = 3;

  // If we're using react-hook-form (with control prop), use that
  // Otherwise use the standalone value/onChange props
  const isControlled = !!control && !!name;

  const selectedValues: string[] = isControlled ? [] : value;

  const filteredData = dataList.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const toggleOption = (optionId: string) => {
    const exists = selectedValues.includes(optionId);
    let newValues: string[];

    if (exists) {
      // remove it
      newValues = selectedValues.filter((id) => id !== optionId);
    } else {
      // add it
      newValues = [...selectedValues, optionId];
    }

    if (isControlled && control && name) {
      // For react-hook-form
      // This would be handled by the form field render
    } else {
      // For standalone usage
      onChange(newValues);
    }
  };

  const handleBlur = () => {
    if (dropdownOnFocus) {
      setTimeout(() => setIsFocused(false), 150);
    }
  };

  const handleClear = () => {
    if (isControlled && control && name) {
      // For react-hook-form
    } else {
      // For standalone usage
      onChange([]);
    }
    setSearchQuery('');
  };

  // If using react-hook-form, return the FormField version
  if (isControlled && control && name) {
    return (
      <FormField
        name={name}
        control={control}
        render={({ field }) => {
          useEffect(() => {
            // If we have selected values, keep the search query empty
            if (field.value && field.value.length > 0) {
              setSearchQuery('');
            }
          }, [field.value]);

          const formSelectedValues: Option[] = Array.isArray(field.value) ? field.value : [];

          const formToggleOption = (option: Option) => {
            const exists = formSelectedValues.find((item) => item.id === option.id);
            if (exists) {
              // remove it
              field.onChange(formSelectedValues.filter((item) => item.id !== option.id));
            } else {
              // add it
              field.onChange([...formSelectedValues, option]);
            }
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => dropdownOnFocus && setIsFocused(true)}
                    onBlur={handleBlur}
                  />
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
                      filteredData.map((item) => {
                        const isSelected = formSelectedValues.some((val) => val.id === item.id);
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center gap-2 p-3 border-b last:border-0 ${
                              isSelected ? 'bg-blue-400' : 'hover:bg-gray-50'
                            }`}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            <Checkbox
                              className="cursor-pointer"
                              checked={isSelected}
                              onCheckedChange={() => formToggleOption(item)}
                            />
                            <div onClick={() => formToggleOption(item)}>
                              <p className="text-sm font-medium cursor-pointer">{item.name}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">No items found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Display selected items as chips */}
              {formSelectedValues.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formSelectedValues.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 rounded-full"
                    >
                      <span>{item.name}</span>
                      <button
                        type="button"
                        onClick={() => formToggleOption(item)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  }

  // Standalone version (without react-hook-form)
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      <div className="relative" ref={wrapperRef}>
        <div className="relative">
          <Input
            disabled={disabled}
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => dropdownOnFocus && setIsFocused(true)}
            onBlur={handleBlur}
          />
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
              filteredData.map((item) => {
                const isSelected = selectedValues.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2 p-3 border-b last:border-0 ${
                      isSelected ? 'bg-blue-400' : 'hover:bg-gray-50'
                    }`}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <Checkbox
                      className="cursor-pointer"
                      checked={isSelected}
                      onCheckedChange={() => toggleOption(item.id)}
                    />
                    <div onClick={() => toggleOption(item.id)}>
                      <p className="text-sm font-medium cursor-pointer">{item.name}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-muted-foreground">No items found</div>
            )}
          </div>
        )}
      </div>

      {/* Display selected items as chips */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedValues.map((id) => {
            const item = dataList.find((i) => i.id === id);
            if (!item) return null;

            return (
              <div
                key={item.id}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 rounded-full"
              >
                <span>{item.name}</span>
                <button
                  type="button"
                  onClick={() => toggleOption(item.id)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

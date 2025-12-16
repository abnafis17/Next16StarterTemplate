'use client';

import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Control } from 'react-hook-form';
import { X, Loader2 } from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

interface PaginatedSingleSelectProps {
  name: string;
  control: Control<any>;
  label?: string;
  description?: string;
  placeholder?: string;
  fetchFn: (params: { skip: number; limit: number; search?: string }) => Promise<any>;
  mapFn: (item: any) => Option;
  required?: boolean;
  height?: number;
  disabled?: boolean;
  pageSize?: number;
  searchDebounceMs?: number;
}

export const PaginatedSingleSelect = ({
  name,
  control,
  label = 'Select',
  description,
  placeholder = 'Search...',
  fetchFn,
  mapFn,
  required = false,
  height = 25,
  disabled = false,
  pageSize = 10,
  searchDebounceMs = 300,
}: PaginatedSingleSelectProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [dataList, setDataList] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentSkip, setCurrentSkip] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const ITEM_HEIGHT = height;
  const MAX_VISIBLE_ITEMS = 6;

  // Fetch data
  const fetchData = useCallback(
    async (skip: number, search: string, isInitial: boolean = false) => {
      try {
        if (isInitial) setIsLoading(true);
        else setIsLoadingMore(true);

        const response = await fetchFn({ skip, limit: pageSize, search: search || undefined });
        const newItems = response?.data?.results?.list.map(mapFn) || [];
        const total = response?.data?.results?.total;

        if (isInitial) {
          setDataList(newItems);
          setCurrentSkip(pageSize);
        } else {
          setDataList((prev) => [...prev, ...newItems]);
          setCurrentSkip((prev) => prev + pageSize);
        }

        if (total !== undefined) {
          setTotalCount(total);
          setHasMore(skip + pageSize < total);
        } else {
          setHasMore(newItems.length === pageSize);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [fetchFn, mapFn, pageSize]
  );

  // Initial load
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchData(0, '', true);
    }
  }, []);

  // Search debounce
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentSkip(0);
      setHasMore(true);
      fetchData(0, searchQuery, true);
    }, searchDebounceMs);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery, fetchData, searchDebounceMs]);

  // Infinite scroll observer
  useEffect(() => {
    if (!dropdownRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          fetchData(currentSkip, searchQuery, false);
        }
      },
      {
        root: dropdownRef.current,
        threshold: 0.1,
      }
    );

    const sentinel = dropdownRef.current.querySelector('[data-sentinel]');
    if (sentinel) observerRef.current.observe(sentinel);

    return () => observerRef.current?.disconnect();
  }, [hasMore, currentSkip, searchQuery, isLoadingMore, isLoading, fetchData]);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        useEffect(() => {
          if (field.value?.id) setSearchQuery(field.value.name);
          else setSearchQuery('');
        }, [field.value]);

        let filteredData = [...dataList];

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
            setSearchQuery('');
          } else {
            field.onChange(item);
            setSearchQuery(item.name);
          }
        };

        const handleClear = () => {
          field.onChange(null);
          setSearchQuery('');
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(e.target.value);
          setIsFocused(true);
        };

        const handleBlur = () => {
          setTimeout(() => setIsFocused(false), 150);
        };

        return (
          <FormItem>
            {label && <FormLabel required={required}>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}

            <div className="relative" ref={wrapperRef}>
              <div className="relative">
                <Input
                  disabled={disabled}
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={handleInputChange}
                  readOnly={!!field.value?.id && !isFocused}
                  onFocus={() => setIsFocused(true)}
                  onBlur={handleBlur}
                />
                {field.value?.id && !disabled && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Dropdown always mounted */}
              <div
                ref={dropdownRef}
                data-dropdown
                className={`z-50 border rounded-md bg-white shadow absolute left-0 right-0 mt-1 transition-all duration-200 ${
                  isFocused ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                style={{
                  maxHeight: `${ITEM_HEIGHT * MAX_VISIBLE_ITEMS}px`,
                  overflowY: 'auto',
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                ) : filteredData.length > 0 ? (
                  <>
                    {filteredData.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-2 p-3 border-b last:border-0 cursor-pointer ${
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
                    ))}

                    {/* Infinite scroll sentinel */}
                    {hasMore && (
                      <div data-sentinel className="p-3 flex items-center justify-center">
                        {isLoadingMore && (
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {searchQuery ? 'No items found' : 'No data available'}
                  </div>
                )}
              </div>
            </div>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

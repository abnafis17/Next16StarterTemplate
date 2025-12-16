"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  RowSelectionState,
  Row,
} from "@tanstack/react-table";

import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

interface InfiniteScrollTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  className?: string;
  loading?: boolean; // initial loading
  loadingMore?: boolean; // append loading
  customRow?: (row: Row<TData>, index: number) => React.ReactNode;
  lastRow?: () => React.ReactNode;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  totalCount?: number;
  stickyHeader?: boolean;
  minTableWidthPx?: number;
  limits?: number;

  isBorderless?: boolean;
  isBorderBottomOnly?: boolean;
}

export function InfiniteScrollTable<TData>({
  data,
  columns,
  className = "",
  loading = false,
  loadingMore = false,
  customRow,
  lastRow,
  onLoadMore,
  hasNextPage = true,
  totalCount = 0,
  stickyHeader = true,
  limits = 10,

  isBorderless = false,
  isBorderBottomOnly = false,
}: InfiniteScrollTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLTableRowElement | null>(null);

  const table = useReactTable<TData>({
    data,
    columns,
    defaultColumn: { enableSorting: false },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  const attachObserver = useCallback(
    (node: Element | null) => {
      observerRef.current?.disconnect();

      if (!node || !onLoadMore || loading || loadingMore || !hasNextPage)
        return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) onLoadMore();
        },
        { rootMargin: "200px", threshold: 0 }
      );
      observerRef.current.observe(node);
    },
    [onLoadMore, loading, loadingMore, hasNextPage]
  );

  useEffect(() => {
    attachObserver(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [attachObserver, data.length, hasNextPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (!loadingMore && hasNextPage) {
        const { scrollTop, clientHeight, scrollHeight } =
          document.documentElement;
        if (scrollHeight - scrollTop - clientHeight < 300) {
          onLoadMore?.();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasNextPage, onLoadMore]);

  const cellBorderClass = isBorderless
    ? "border-none"
    : isBorderBottomOnly
    ? "border-b border-gray-100"
    : "border border-gray-100";

  const headerBorderClass = isBorderless
    ? "border-none"
    : isBorderBottomOnly
    ? "border-b border-gray-100"
    : "border border-gray-100";

  if (loading && data.length === 0) {
    return (
      <Table>
        <TableBody>
          {Array.from({ length: limits }).map((_, index) => (
            <TableRow key={index} className={isBorderless ? "border-none" : ""}>
              {Array.from({ length: columns.length }).map((_, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className={`h-7 bg-gray-200/50 animate-pulse ${cellBorderClass}`}
                >
                  <div className="bg-gray-200 h-6 w-full rounded animate-pulse"></div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <div className="relative overflow-auto">
        <Table className="max-w-full">
          <TableHeader
            className={
              stickyHeader ? "sticky top-0 z-10 bg-white shadow-sm" : ""
            }
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={isBorderless ? "border-none" : ""}
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      style={{ cursor: canSort ? "pointer" : "default" }}
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                          ? "descending"
                          : "none"
                      }
                      className={`whitespace-nowrap text-xs font-medium uppercase ${headerBorderClass}`}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1 select-none">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sorted === "asc" && (
                            <ArrowUp size={14} aria-hidden />
                          )}
                          {sorted === "desc" && (
                            <ArrowDown size={14} aria-hidden />
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              <>
                {table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={
                      isBorderless
                        ? "border-none"
                        : isBorderBottomOnly
                        ? ""
                        : ""
                    }
                  >
                    {customRow
                      ? customRow(row, index)
                      : row.getAllCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={`text-xs ${cellBorderClass}`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                  </TableRow>
                ))}

                {/* invisible sentinel row */}
                <TableRow ref={sentinelRef} className="h-0 invisible">
                  <TableCell colSpan={columns.length} className="p-0" />
                </TableRow>
              </>
            ) : (
              <TableRow className={isBorderless ? "border-none" : ""}>
                <TableCell
                  colSpan={columns.length}
                  className={`h-24 text-center ${cellBorderClass}`}
                >
                  No Data Available
                </TableCell>
              </TableRow>
            )}

            {loadingMore && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className={`h-16 text-center ${cellBorderClass}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-500">Loading more…</span>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {lastRow && lastRow()}
          </TableBody>
        </Table>
      </div>
      <div className="p-2 text-xs text-gray-500">
        {totalCount} client{totalCount !== 1 ? "s" : ""} total
      </div>
    </div>
  );
}

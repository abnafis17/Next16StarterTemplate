import React from 'react';

type ColSpan = {
  default: number;
  lg?: number;
};

type Cell = {
  content: React.ReactNode;
  className?: string;
  colSpan?: ColSpan;
};

type Row = Cell[];

type Props = {
  title?: string;
  columns: number;
  rows: Row[];
  containerClassName?: string;
  gridColsResponsive?: string; // optional custom classes
};

const ReusableTable: React.FC<Props> = ({
  title,
  columns,
  rows,
  containerClassName = '',
  gridColsResponsive,
}) => {
  // Fallback for Tailwind grid-cols, because dynamic class like `grid-cols-${columns}` doesn't work
  const gridStyle = !gridColsResponsive
    ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
    : undefined;

  return (
    <div className={`w-full ${containerClassName}`}>
      <div className={`grid gap-0 ${gridColsResponsive ?? ''}`} style={gridStyle}>
        {/* Title spans full width */}
        {title && (
          <div className="col-span-full p-2 print:p-0 bg-[#282828] print:bg-gray-100 border-b">
            <h1 className="text-white print:text-black font-bold">{title}</h1>
          </div>
        )}

        {rows.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            const baseColSpan = cell.colSpan?.default ?? 1;
            const lgColSpan = cell.colSpan?.lg;

            const colSpanClasses = `col-span-${baseColSpan} ${
              lgColSpan ? `lg:col-span-${lgColSpan}` : ''
            }`;

            return (
              <div
                key={`${rowIndex}-${cellIndex}`}
                className={`${colSpanClasses} ${cell.className ?? ''}`}
              >
                {cell.content}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReusableTable;

"use client";
import React, { createContext, useContext, useState } from "react";
import { z } from "zod";
import { RowSelectionState } from "@tanstack/react-table";
import { schema } from "@/components/sidebar/data-table";

type RowData = z.infer<typeof schema>;

interface TableContextType {
  selectedRows: RowData[];
  setSelectedRows: (rows: RowData[]) => void;
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  clearSelectedRows: () => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export function TableProvider({ children }: { children: React.ReactNode }) {
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const clearSelectedRows = () => {
    setSelectedRows([]);
    setRowSelection({});
  };

  return (
    <TableContext.Provider
      value={{
        selectedRows,
        setSelectedRows,
        rowSelection,
        setRowSelection,
        clearSelectedRows,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTableContext() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
}

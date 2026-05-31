import DataTableSearch from "@/components/datatable/DataTableSearch"
import DataTableColumnVisibility from "@/components/datatable/DataTableColumnVisibility"
import { DataTablePagination } from "@/components/datatable/DataTablePagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type Table as TSTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { useState, type ReactNode } from "react"
import DataTableDeleteAlert from "@/components/datatable/DataTableDeleteAlert"

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalRows: number
  onSearch: (search: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (page: number) => void
  onDelete: (table: TSTable<TData>) => void
  currentPage: number
  pageSize: number
  extraFilters?: ReactNode
}

const DataTable = <TData, TValue>({
  columns,
  data,
  totalRows,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onDelete,
  extraFilters,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    manualFiltering: true,
    manualPagination: true,
    rowCount: totalRows,

    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex: currentPage - 1, pageSize: pageSize })
          : updater
      ;(onPageChange(newPagination.pageIndex + 1),
        onPageSizeChange(newPagination.pageSize))
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
  })

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <DataTableSearch onSearch={onSearch} />
        <div className="flex gap-2">
          {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
            <DataTableDeleteAlert
              trigger={`Delete (${table.getSelectedRowModel().rows.length})`}
              title="Confirm Deletion"
              description={`Are you sure you want to delete these (${table.getSelectedRowModel().rows.length}) Records? This action is permanent and cannot be undone`}
              action={() => onDelete(table)}
            />
          )}
          {extraFilters}
          <DataTableColumnVisibility table={table} />
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="text-center" key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((rows) => (
                <TableRow
                  key={rows.id}
                  data-state={rows.getIsSelected() && "selected"}
                >
                  {rows.getVisibleCells().map((cell) => (
                    <TableCell className="text-center" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Results Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}

export default DataTable

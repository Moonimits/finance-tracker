import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Table } from "@tanstack/react-table"

type DataTableColumnVisibilityProps<TData> = {
  table: Table<TData>
}

const DataTableColumnVisibility = <TData,>({
  table,
}: DataTableColumnVisibilityProps<TData>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Columns</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          className="capitalize"
          checked={
            table.getIsAllColumnsVisible() ||
            (table.getIsSomeColumnsVisible() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllColumnsVisible(!!value)}
        >
          {table.getIsAllColumnsVisible() ? "Hide All" : "Show All"}
        </DropdownMenuCheckboxItem>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DataTableColumnVisibility

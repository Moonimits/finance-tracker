import { Button } from "@/components/ui/button"
import type { Column } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

const DataTableHeaderSort = <TData, TValue>({
  column,
  title,
}: {
  column: Column<TData, TValue>
  title: string
}) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title} <ArrowUpDown />
    </Button>
  )
}

export default DataTableHeaderSort

import DataTable from "@/components/datatable/DataTable"
import DataTableHeaderSort from "@/components/datatable/DataTableHeaderSort"
import CustomBadge from "@/components/shared/CustomBadge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Toggle } from "@/components/ui/toggle"
import useModal from "@/hooks/useModal"
import { debounce } from "@/lib/debounce"
import {
  useDeleteExpenseMutation,
  useGetExpenseQuery,
  useGetExpenseTypeQuery,
} from "@/store/api/supabaseApi"
import { useAppSelector } from "@/store/hook"
import type { Expense, ExpenseFilters } from "@/types/expenseTypes"
import type { ColumnDef, Table } from "@tanstack/react-table"
import { format } from "date-fns"
import { PenBox, PhilippinePeso } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export const ExpenseTypeFilter = ({
  filters,
  handleFilter,
}: {
  filters: string[]
  handleFilter: (type: string) => void
}) => {
  const { data } = useGetExpenseTypeQuery()
  const expenseTypes = data?.expense_types

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Expense Types</Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        {expenseTypes &&
          Object.keys(expenseTypes).map((type) => (
            <Toggle
              key={type}
              variant="outline"
              className="capitalize"
              pressed={filters?.includes(type)}
              onPressedChange={() => handleFilter(type)}
            >
              {type}
            </Toggle>
          ))}
      </PopoverContent>
    </Popover>
  )
}

const ExpensePage = () => {
  const range = useAppSelector((state) => state.daterange)
  const { openEditExpense } = useModal()
  const [filters, setFilters] = useState<ExpenseFilters>({
    page: 1,
    page_size: 10,
    date_from: range?.from && format(range.from, "y-MM-dd"),
    date_to: range?.to && format(range.to, "y-MM-dd"),
    expense_type: [],
  })
  const { data } = useGetExpenseQuery(filters)
  const [deleteExpense] = useDeleteExpenseMutation()

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      date_from: range?.from && format(range.from, "y-MM-dd"),
      date_to: range?.to && format(range.to, "y-MM-dd"),
    }))
  }, [range])

  const handleSearch = debounce((search: string) => {
    setFilters((prev) => ({ ...prev, page: 1, search }))
  })

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handlePageSizeChange = (page_size: number) => {
    setFilters((prev) => ({ ...prev, page_size }))
  }

  const handleFilterType = (type: string) => {
    setFilters((prev) => {
      const selected = prev.expense_type?.includes(type)

      return {
        ...prev,
        expense_type: selected
          ? prev.expense_type?.filter((t) => t !== type)
          : [...prev.expense_type!, type],
      }
    })
  }

  const handleDelete = async (table: Table<Expense>) => {
    const rowIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id)

    try {
      await deleteExpense(rowIds)

      table.toggleAllRowsSelected(false)
      toast.success("Delete Expenses Successful")
    } catch (error) {
      toast.error("Delete Expenses Failed")
    }
  }

  const expenseColumns: ColumnDef<Expense>[] = [
    {
      id: "id",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllRowsSelected() ||
            (table.getIsSomeRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    {
      accessorKey: "expense_name",
      header: ({ column }) => (
        <DataTableHeaderSort column={column} title="Expense Name" />
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableHeaderSort column={column} title="Amount" />
      ),
      cell: ({ getValue }) => {
        const amount = getValue<number>()
        return (
          <span className="flex items-center justify-center">
            <PhilippinePeso className="size-4" />
            {amount}
          </span>
        )
      },
    },
    {
      accessorKey: "expense_type",
      header: ({ column }) => (
        <DataTableHeaderSort column={column} title="Expense Type" />
      ),
      cell: ({ getValue }) => {
        const typeKey = getValue<string>()
        const expenseType = data?.expenseTypeMap!
        const { label, color } = expenseType[typeKey]

        return <CustomBadge label={label} color={color} />
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableHeaderSort column={column} title="Date" />
      ),
      cell: ({ getValue }) => {
        const date = getValue<string>()
        return format(new Date(date), "MMM dd, y")
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const expense = row.original
        return (
          <Button onClick={() => openEditExpense(expense)} size="xs">
            <PenBox /> Edit
          </Button>
        )
      },
    },
  ]

  return (
    <div className="px-2">
      <div className="mb-2">
        <h3 className="text-xl font-bold">Records: {data?.total}</h3>
      </div>
      <DataTable
        columns={expenseColumns}
        data={data?.expenses ?? []}
        totalRows={data?.total ?? 0}
        currentPage={filters.page}
        pageSize={filters.page_size}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onDelete={handleDelete}
        extraFilters={
          <ExpenseTypeFilter
            filters={filters.expense_type ?? []}
            handleFilter={handleFilterType}
          />
        }
      />
    </div>
  )
}

export default ExpensePage

import DataTable from "@/components/datatable/DataTable"
import DataTableHeaderSort from "@/components/datatable/DataTableHeaderSort"
import CustomBadge from "@/components/shared/CustomBadge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import useModal from "@/hooks/useModal"
import { debounce } from "@/lib/debounce"
import { ExpenseTypeFilter } from "@/pages/ExpensePage"
import {
  useDeleteConstantMutation,
  useGetConstantQuery,
} from "@/store/api/supabaseApi"
import { useAppSelector } from "@/store/hook"
import type { Constant, ConstantFilters } from "@/types/constatTypes"
import type { ColumnDef, Table } from "@tanstack/react-table"
import { format } from "date-fns"
import { PenBox, PhilippinePeso, ShieldCheck, ShieldMinus } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const ConstantPage = () => {
  const range = useAppSelector((state) => state.daterange)

  const { openEditConstant } = useModal()
  const [filters, setFilters] = useState<ConstantFilters>({
    page: 1,
    page_size: 10,
    date_from: range?.from && format(range.from, "y-MM-dd"),
    date_to: range?.to && format(range.to, "y-MM-dd"),
    constant_type: [],
  })
  const { data } = useGetConstantQuery(filters)
  const [deleteConstant] = useDeleteConstantMutation()

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
      const selected = prev.constant_type?.includes(type)

      return {
        ...prev,
        constant_type: selected
          ? prev.constant_type?.filter((t) => t !== type)
          : [...prev.constant_type!, type],
      }
    })
  }

  const handleDelete = async (table: Table<Constant>) => {
    const rowIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id)

    try {
      await deleteConstant(rowIds)

      table.toggleAllRowsSelected(false)
      toast.success("Delete Expenses Successful")
    } catch (error) {
      toast.error("Delete Expenses Failed")
    }
  }

  const expenseColumns: ColumnDef<Constant>[] = [
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
      accessorKey: "constant_name",
      header: ({ column }) => (
        <DataTableHeaderSort column={column} title="Constant Name" />
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
      accessorKey: "constant_type",
      header: ({ column }) => (
        <DataTableHeaderSort column={column} title="Constant Type" />
      ),
      cell: ({ getValue }) => {
        const typeKey = getValue<string>()
        const constantType = data?.constantTypeMap!
        const { label, color } = constantType[typeKey]

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
      accessorKey: "active",
      header: ({ column }) => (
        <DataTableHeaderSort column={column} title="Active" />
      ),
      cell: ({ getValue }) => {
        const active = getValue<boolean>()
        return (
          <CustomBadge
            label={active ? "Active" : "Inactive"}
            color={active ? "green" : "red"}
          />
        )
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const constant = row.original
        return (
          <>
            <Button onClick={() => openEditConstant(constant)} size="xs">
              <PenBox /> Edit
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={constant.active ? "destructive" : "default"}
                  size="icon-xs"
                >
                  {constant.active ? <ShieldMinus /> : <ShieldCheck />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {constant.active
                    ? "Deactivate Constant"
                    : "Activate Constant"}
                </p>
              </TooltipContent>
            </Tooltip>
          </>
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
        data={data?.constants ?? []}
        totalRows={data?.total ?? 0}
        currentPage={filters.page}
        pageSize={filters.page_size}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onDelete={handleDelete}
        extraFilters={
          <ExpenseTypeFilter
            filters={filters.constant_type ?? []}
            handleFilter={handleFilterType}
          />
        }
      />
    </div>
  )
}

export default ConstantPage

import DataTable from "@/components/datatable/DataTable"
import DataTableHeaderSort from "@/components/datatable/DataTableHeaderSort"
import CustomBadge from "@/components/shared/CustomBadge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import useModal from "@/hooks/useModal"
import { debounce } from "@/lib/debounce"
import {
  useDeleteSavingsMutation,
  useGetSavingsQuery,
} from "@/store/api/supabaseApi"
import { useAppSelector } from "@/store/hook"
import type { Savings, SavingsFilter } from "@/types/savingsTypes"
import type { ColumnDef, Table } from "@tanstack/react-table"
import { format } from "date-fns"
import { PenBox, PhilippinePeso } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const SavingsPage = () => {
  const range = useAppSelector((state) => state.daterange)

  const [filters, setFilters] = useState<SavingsFilter>({
    page: 1,
    page_size: 10,
    date_from: range?.from && format(range.from, "y-MM-dd"),
    date_to: range?.to && format(range.to, "y-MM-dd"),
    savings_for: [],
  })
  const [deleteSavings] = useDeleteSavingsMutation()
  const { openEditSavings } = useModal()
  const { data } = useGetSavingsQuery(filters)

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      date_from: range?.from && format(range.from, "y-MM-dd"),
      date_to: range?.to && format(range.to, "y-MM-dd"),
    }))
  }, [range])

  const handleSearch = debounce((search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  })

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handlePageSizeChange = (page_size: number) => {
    setFilters((prev) => ({ ...prev, page_size }))
  }
  const handleDelete = async (table: Table<Savings>) => {
    const rowIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id)

    try {
      await deleteSavings(rowIds).unwrap()

      table.toggleAllRowsSelected(false)
      toast.success("Delete Savings Successful")
    } catch (error) {
      toast.error("Delete Savings Failed")
    }
  }

  const savingsColumn: ColumnDef<Savings>[] = [
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
      accessorKey: "savings_for",
      header: ({ column }) => (
        <DataTableHeaderSort column={column} title="Savings For" />
      ),
      cell: ({ getValue }) => {
        const typeKey = getValue<string>()
        const savingsFor = data?.savingsForMap!
        const { label, color } = savingsFor[typeKey]

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
        const savings = row.original
        return (
          <Button onClick={() => openEditSavings(savings)} size="xs">
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
        columns={savingsColumn}
        data={data?.savings ?? []}
        totalRows={data?.total ?? 0}
        currentPage={filters.page}
        pageSize={filters.page_size}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default SavingsPage

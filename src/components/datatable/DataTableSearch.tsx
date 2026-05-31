import { Input } from "@/components/ui/input"

const DataTableSearch = ({
  onSearch,
}: {
  onSearch: (search: string) => void
}) => {
  return (
    <Input
      type="search"
      className="w-100"
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search..."
    />
  )
}

export default DataTableSearch

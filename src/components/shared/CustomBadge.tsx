import { Badge } from "@/components/ui/badge"

type CustomBadgeProps = {
  label: string
  color: string
}

const CustomBadge = ({ label, color }: CustomBadgeProps) => {
  const BadgeColors = {
    green: "bg-green-950 text-green-300",
    red: "bg-red-950 text-red-300",
    blue: "bg-blue-950 text-blue-300",
    sky: "bg-sky-950 text-sky-300",
    violet: "bg-violet-950 text-violet-300",
    indigo: "bg-indigo-950 text-indigo-300",
    yellow: "bg-yellow-950 text-yellow-300",
    orange: "bg-orange-950 text-orange-300",
    slate: "bg-slate-950 text-slate-300",
    pink: "bg-pink-950 text-pink-300",
  }

  return (
    <Badge className={BadgeColors[color as keyof typeof BadgeColors]}>
      {label}
    </Badge>
  )
}

export default CustomBadge

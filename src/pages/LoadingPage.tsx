import { Spinner } from "@/components/ui/spinner"
import { Wallet } from "lucide-react"

const LoadingPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <div className="flex size-20 animate-bounce items-center justify-center rounded-2xl bg-primary">
        <Wallet className="size-15" />
      </div>
      <h1 className="animate-pulse text-5xl font-bold">Finance Tracker</h1>
      <p className="leading-0 text-muted-foreground">
        Keep track of your expenses!
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Spinner /> Page Loading...
      </div>
    </div>
  )
}

export default LoadingPage

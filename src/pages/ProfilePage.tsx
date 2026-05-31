import { Wallet } from "lucide-react"

const ProfilePage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-2">
      <div className="flex size-20 animate-bounce items-center justify-center rounded-2xl bg-primary">
        <Wallet className="size-15" />
      </div>
      <h1 className="text-5xl font-bold">Finance Tracker</h1>
      <p className="mt-4 leading-none text-muted-foreground">
        Profile Page coming soon!
      </p>
    </div>
  )
}

export default ProfilePage

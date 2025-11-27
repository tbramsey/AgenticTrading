import LoginScreen from "@/components/modals/login.tsx"

function AuthPage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">

      {/* Left side — brand */}
      <div className="flex-1 flex items-center justify-center bg-card border-r border-border">
        <h1 className="text-5xl font-bold">
          Barry<span className="text-primary">.</span>
        </h1>
      </div>

      {/* Right side — login/signup form */}
      <div className="flex-1 flex items-center justify-center bg-card">
        <LoginScreen />
      </div>

    </div>
  )
}

export default AuthPage

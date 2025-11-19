import LoginScreen from "@/components/modals/login.tsx"

function AuthPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side — company branding */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center bg-night">
        <h1 className="text-5xl font-bold text-yellow_green">
          Barry<span className="text-blue-500">.</span>
        </h1>
      </div>

      {/* Right side — login/signup form */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <LoginScreen />
      </div>
    </div>
  )
}
export default AuthPage

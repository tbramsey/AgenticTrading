export default function TopBar() {
  return (
    <header className="h-16 w-full bg-white shadow flex items-center px-6 gap-6">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/vite.svg" className="w-7 h-7" />
        <span className="font-semibold text-lg">Barry</span>
      </div>

      {/* Search bar */}
      <div className="flex-1 flex justify-center">
        <input
          className="w-1/2 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Search…"
        />
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        <span className="font-medium">Jack Sparrow</span>
        <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>

    </header>
  )
}

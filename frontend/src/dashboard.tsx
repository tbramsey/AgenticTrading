import berryLogo from "./Berry_Logo.png";

const navigation = [
  { href: "/dashboard", text: "DASHBOARD" }, 
  { href: "#stocks", text: "STOCKS" },
  { href: "#trading", text: "TRADING" },
  { href: "#portfolio", text: "PORTFOLIO" },
];


const COLORS = {
    primaryGreen: "#a5bf7b",
    secondaryGreen: "#748b4fff",
    footerGreen: "#7c844f",
    textDark: "#292929",
    textLight: "#f3f6cd",
    headingColor: "#7c844f",
    backgroundBlock: "var(--green2)",
}

export function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex flex-col w-full py-4 px-8 border-b bg-white shadow-sm" 
              style={{ borderBottomColor: COLORS.secondaryGreen }}>
        
        <div className="flex justify-between items-center w-full">
          
          <div className="logo">
            <img src={berryLogo} alt="Berry Logo" height="60" width="60" />
          </div>

          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg cursor-pointer"
            style={{ backgroundColor: COLORS.primaryGreen, color: COLORS.textDark }}
            title="User Profile"
          >
            👤
          </div>
        </div>

        <nav className="mt-4 w-full"> 
          <ul className="flex space-x-12 text-xl font-medium justify-center">
            {navigation.map((item) => (
              <li key={item.text} 
                  className={item.href === '/dashboard' ? 'border-b-4' : ''} 
                  style={{ borderBottomColor: item.href === '/dashboard' ? COLORS.secondaryGreen : 'transparent' }}>
                <a
                  className="hover:opacity-75 transition-opacity py-1"
                  style={{ color: COLORS.primaryGreen }}
                  href={item.href}>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="flex-grow w-full p-6 flex space-x-6">
        
        <div className="w-1/4 h-full bg-white p-4 rounded-lg shadow-md flex flex-col" style={{border: '1px solid #e0e0e0'}}>
            <h2 className="text-xl font-bold mb-4 border-b pb-2" style={{ color: COLORS.headingColor }}>UPDATES</h2>
            <div className="space-y-3 text-sm flex-1 overflow-y-auto">
                <div className="p-2 bg-gray-50 rounded">Alert: Trade executed successfully on NVDA.</div>
                <div className="p-2 bg-gray-50 rounded">Market closed +0.5% yesterday.</div>
                <div className="p-2 bg-gray-50 rounded">New article: Tech sector outlook review.</div>
                <div className="p-2 bg-gray-50 rounded">Strategy 'Alpha' performance up 1.2%.</div>
                <div className="p-2 bg-gray-50 rounded">System check complete.</div>
            </div>
        </div>

        <div className="w-3/4 flex flex-col space-y-6">
            
            <div className="bg-white p-6 rounded-lg shadow-md flex-1 min-h-[300px]" style={{border: '1px solid #e0e0e0'}}>
                <h1 className="text-3xl font-extrabold mb-4" style={{ color: COLORS.headingColor }}>
                    WELCOME BACK!
                </h1>
                <p className="text-gray-500 text-lg mb-4">
                    random stocks display
                </p>
                <div className="h-4/5 bg-gray-100 mt-4 flex items-center justify-center text-gray-400 border border-dashed">
                    [Stock Charts & Performance Metrics Placeholder]
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md" style={{border: '1px solid #e0e0e0'}}>
                <div className="flex items-center">
                    <input 
                        type="text" 
                        placeholder="chat" 
                        className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-300 focus:border-green-300 focus:outline-none"
                    />
                    <button 
                        className="p-3 rounded-r-lg text-white font-bold transition duration-300 hover:opacity-90"
                        style={{ backgroundColor: COLORS.footerGreen }}
                    >
                        &rarr;
                    </button>
                </div>
            </div>

        </div>
      </div>

        <footer className="p-4 mt-auto" style={{ backgroundColor: COLORS.footerGreen }}>
            <p className="text-sm text-center" style={{ color: COLORS.textDark }}>
            Project by: Lahari, Artin, Tagan, and Navya
            </p>
        </footer>

    </main>
  );
}
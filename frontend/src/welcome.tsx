import berryLogo from "./Berry_Logo.png";
import { Link } from 'react-router-dom';

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

export function Welcome() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex flex-col items-center py-8">
        <div className="logo mb-8">
          <img src={berryLogo} alt="Berry Logo" height="225" width="225" />
        </div>

        <nav
          className="border-b-4"
          style={{
            borderBottomColor: COLORS.secondaryGreen,
          }}
        >
          <ul className="flex space-x-12 text-3xl font-medium">
            {navigation.map((item) => (
              <li key={item.text}>
                <Link
                  className="hover:opacity-75 transition-opacity"
                  style={{ color: COLORS.primaryGreen }}
                  to={item.href}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      
      <div className="flex-grow flex flex-col items-center p-8">
        <div
          className="p-12 md:p-20 text-center shadow-2xl rounded-lg max-w-4xl"
          style={{
            backgroundColor: COLORS.backgroundBlock,
            color: COLORS.textLight,
          }}
        >
          <h1 className="text-5xl font-extrabold pb-4 mb-4" style={{ color: COLORS.headingColor }}>
            Berry. Your personalized trading assistant.
          </h1>
          <p className="text-xl leading-relaxed mb-8">
            Berry is an AI model designed to navigate stock market trading. It analyzes market trends, finds opportunities, and modifies its strategies in real time - all autonomously. Berry thinks, learns, and acts on purpose, making decisions based on data and performance. With Berry, trading becomes more intelligent, faster, and truly autonomous.
          </p>
          <button className="px-8 py-3 text-2xl font-bold rounded-full transition duration-300" style={{ backgroundColor: COLORS.primaryGreen, color: COLORS.textDark }}>
            Get Started
          </button>
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
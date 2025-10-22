import berryLogo from "./Berry_Logo.png";

export function Welcome() { /* HOME/WELCOME page */
  return (
    <main className="flex flex-row items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
        </header>
        <div className="flex flex-row">
          <nav className="rounded-3xl border p-6 dark:border-gray-700" style={{ borderColor: "var(--green2)" }}>
            <ul className="flex space-x-4">
              {navigation.map(({ href, text }) => (
                <li>
                  <a
                    className="flex flex-row gap-2 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}

const navigation = [  /* NavBar - NEED TO FIX LINKS AND ALL */
  {
   
  },
  {
    href: "",
    text: "Dashboard",
  },
  {
    href: "",
    text: "Your Stocks",
  },
  {
    href: "",
    text: "Trading",
  },
  {
    href: "",
    text: "Portfolio"
  },
];

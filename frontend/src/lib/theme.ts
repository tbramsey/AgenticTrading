export type Theme = "light" | "dark"

const THEME_KEY = "theme"

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null
  const value = window.localStorage.getItem(THEME_KEY)
  if (value === "light" || value === "dark") return value
  return null
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme
}

export function initTheme(): Theme {
  const theme = getStoredTheme() ?? getSystemTheme()
  applyTheme(theme)
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_KEY, theme)
  }
  return theme
}

export function setThemePreference(theme: Theme): Theme {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_KEY, theme)
  }
  applyTheme(theme)
  return theme
}

export function toggleThemePreference(current: Theme): Theme {
  const next: Theme = current === "dark" ? "light" : "dark"
  return setThemePreference(next)
}

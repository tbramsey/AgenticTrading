import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes.tsx'
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App

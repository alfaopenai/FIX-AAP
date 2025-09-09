import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/contexts/CartContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Pages />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App 
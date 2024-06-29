import Container from "./components/Container/Container"
import proper, { darkTheme, lightTheme } from "./proper"
import "./App.css"
import { useState } from "react"
import { AppCard, Switcher } from "./App.proped"

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const themeToUse = theme === "light" ? lightTheme : darkTheme

  return (
    <proper.ThemeProvider theme={themeToUse}>
      <Container>
        <AppCard>
          <h1>React Proper</h1>
          <Switcher selected={theme} onChange={setTheme} />
        </AppCard>
      </Container>
    </proper.ThemeProvider>
  )
}

export default App

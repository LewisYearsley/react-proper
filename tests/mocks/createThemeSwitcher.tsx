import React, { useState } from "react"
import { Proper } from "../../index"

type CreateThemeSwitcherArgs<TTheme> = {
  Provider: Proper<TTheme>["ThemeProvider"]
  theme1: TTheme
  theme2: TTheme
}

function createThemeSwitcher<TTheme>(args: CreateThemeSwitcherArgs<TTheme>): React.FC<React.PropsWithChildren> {
  return (props) => {
    const { children } = props
    const [theme, setTheme] = useState(args.theme1)

    return (
      <args.Provider theme={theme}>
        <button
          onClick={() => {
            setTheme((state) => (state === args.theme1 ? args.theme2 : args.theme1))
          }}
        >
          Toggle theme
        </button>
        {children}
      </args.Provider>
    )
  }
}

export default createThemeSwitcher

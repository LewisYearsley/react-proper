import React from "react"
import { describe, it, expect, beforeEach } from "vitest"
import { fireEvent, render, renderHook } from "@testing-library/react"
import { createProper, type Proper } from "../index"
import { type MockTheme, theme1, theme2 } from "./mocks/theme"
import MockComponent from "./mocks/MockComponent"
import createThemeSwitcher from "./mocks/createThemeSwitcher"
import { expectedColor } from "./mocks/MockComponent"

describe("theming", () => {
  let proper: Proper<MockTheme>

  beforeEach(() => {
    proper = createProper(theme1)
  })

  describe("in props", () => {
    it.only("should apply the default theme if not overridden", () => {
      const Component = proper.prop(MockComponent)((_, theme) => ({
        color: theme.colors.color1,
      }))

      const { queryByText } = render(
        <proper.ThemeProvider>
          <Component />
        </proper.ThemeProvider>
      )

      expect(queryByText(expectedColor(theme1.colors.color1))).not.toBeNull()
    })

    it("should continue to apply the default theme if overriden with the default theme", () => {
      const Component = proper.prop(MockComponent)((_, theme) => ({
        color: theme.colors.color1,
      }))

      const { queryByText } = render(
        <proper.ThemeProvider theme={theme1}>
          <Component />
        </proper.ThemeProvider>
      )

      expect(queryByText(expectedColor(theme1.colors.color1))).not.toBeNull()
    })

    it("should apply the override theme if another is provided", () => {
      const Component = proper.prop(MockComponent)((_, theme) => ({
        color: theme.colors.color1,
      }))

      const { queryByText } = render(
        <proper.ThemeProvider theme={theme2}>
          <Component />
        </proper.ThemeProvider>
      )

      expect(queryByText(expectedColor(theme2.colors.color1))).not.toBeNull()
    })

    it("should allow for the theme to be dynamically changed", () => {
      const Component = proper.prop(MockComponent)((_, theme) => ({
        color: theme.colors.color1,
      }))

      const ThemeSwitcher = createThemeSwitcher({
        Provider: proper.ThemeProvider,
        theme1,
        theme2,
      })

      const { getByText, queryByText } = render(
        <ThemeSwitcher>
          <Component />
        </ThemeSwitcher>
      )

      expect(queryByText(expectedColor(theme1.colors.color1))).not.toBeNull()

      const toggleButton = getByText("Toggle theme")

      fireEvent.click(toggleButton)

      expect(queryByText(expectedColor(theme1.colors.color1))).toBeNull()
      expect(queryByText(expectedColor(theme2.colors.color1))).not.toBeNull()
    })
  })

  describe("in useTheme", () => {
    it("should apply the default theme if not overridden", () => {
      const { result } = renderHook(() => proper.useTheme(), {
        wrapper: proper.ThemeProvider,
      })

      expect(result.current.colors.color1).toBe(theme1.colors.color1)
    })

    it("should continue to apply the default theme if overriden with the default theme", () => {
      const { result } = renderHook(() => proper.useTheme(), {
        wrapper: ({ children }) => <proper.ThemeProvider theme={theme1}>{children}</proper.ThemeProvider>,
      })

      expect(result.current.colors.color1).toBe(theme1.colors.color1)
    })

    it("should apply the override theme if another is provided", () => {
      const { result } = renderHook(() => proper.useTheme(), {
        wrapper: ({ children }) => <proper.ThemeProvider theme={theme2}>{children}</proper.ThemeProvider>,
      })

      expect(result.current.colors.color1).toBe(theme2.colors.color1)
    })
  })
})

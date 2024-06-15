import { describe, it, expect } from "vitest"
import { createProper } from "../index"

describe("create proper", () => {
  it("should handle creation without a theme", () => {
    expect(() => createProper(undefined)).not.toThrow()
  })

  it("should handle creation with a theme", () => {
    expect(() =>
      createProper({
        buttons: {
          color: "blue",
        },
        icons: {
          color: "red",
        },
      })
    ).not.toThrow()
  })
})

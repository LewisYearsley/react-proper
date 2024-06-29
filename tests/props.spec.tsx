import React from "react"
import { beforeEach, describe, it, expect } from "vitest"
import { Proper, createProper } from "../index"
import { type MockTheme, theme1 } from "./mocks/theme"
import MockComponent, { expectedArray, expectedColor, expectedOptional } from "./mocks/MockComponent"
import { render } from "@testing-library/react"

describe("props", () => {
  let proper: Proper<MockTheme>

  beforeEach(() => {
    proper = createProper(theme1)
  })

  it("should pass static props", () => {
    const Component = proper.prop(MockComponent)({
      color: "azul",
    })

    const { queryByText } = render(<Component />)

    expect(queryByText(expectedColor("azul"))).not.toBe(null)
    expect(queryByText(expectedOptional(undefined))).not.toBe(null)
  })

  it("should override props with those directly passed in", () => {
    const Component = proper.prop(MockComponent)({
      color: "azul",
    })

    const { queryByText } = render(<Component color="blue" />)

    expect(queryByText(expectedColor("blue"))).not.toBe(null)
    expect(queryByText(expectedOptional(undefined))).not.toBe(null)
  })

  it("should pass dynamic props", () => {
    const Component = proper.prop(MockComponent)((props) => ({
      color: props.optional ? "green" : "red",
    }))

    const { queryByText, rerender } = render(<Component optional />)

    expect(queryByText(expectedColor("green"))).not.toBe(null)
    expect(queryByText(expectedOptional(true))).not.toBe(null)

    rerender(<Component optional={false} />)

    expect(queryByText(expectedColor("red"))).not.toBe(null)
    expect(queryByText(expectedOptional(false))).not.toBe(null)
  })

  it("should be able to take additional props", () => {
    const Component = proper.enableExtraProps<{ fancyColor: string }>().prop(MockComponent)((props) => ({
      color: props.fancyColor,
    }))

    const { queryByText, rerender } = render(<Component fancyColor="purple" />)

    expect(queryByText(expectedColor("purple"))).not.toBe(null)

    rerender(<Component fancyColor="yellow" />)

    expect(queryByText(expectedColor("yellow"))).not.toBe(null)
  })

  it("should give precedence to the most top level wrapped props for static props", () => {
    const Component = proper.prop(MockComponent)({
      color: "blue",
    })

    const ReWrapped = proper.prop(Component)({
      color: "red",
    })

    const { queryByText } = render(<ReWrapped />)

    expect(queryByText(expectedColor("red"))).not.toBe(null)
  })

  it("should give precedence to the most top level wrapped props for dynamic props", () => {
    const Component = proper.prop(MockComponent)(() => ({
      color: "blue",
    }))

    const ReWrapped = proper.prop(Component)(() => ({
      color: "red",
    }))

    const { queryByText } = render(<ReWrapped />)

    expect(queryByText(expectedColor("red"))).not.toBe(null)
  })

  it("should give precedence to the most top level wrapped props for a mix of dynamic and static props where the top level is dynamic", () => {
    const Component = proper.prop(MockComponent)({
      color: "blue",
    })

    const ReWrapped = proper.prop(Component)(() => ({
      color: "red",
    }))

    const { queryByText } = render(<ReWrapped />)

    expect(queryByText(expectedColor("red"))).not.toBe(null)
  })

  it("should give precedence to the most top level wrapped props for a mix of dynamic and static props where the top level is static", () => {
    const Component = proper.prop(MockComponent)(() => ({
      color: "blue",
    }))

    const ReWrapped = proper.prop(Component)({
      color: "red",
    })

    const { queryByText } = render(<ReWrapped />)

    expect(queryByText(expectedColor("red"))).not.toBe(null)
  })

  it("should merge array props", () => {
    const Component = proper.prop(MockComponent)(() => ({
      color: "blue",
      array: ["one"],
    }))

    const ReWrapped = proper.prop(Component)({
      color: "red",
      array: ["two"],
    })

    const { queryByText } = render(<ReWrapped />)

    expect(queryByText(expectedArray(["one", "two"]))).not.toBe(null)
  })

  it("should merge object props", () => {
    const Component = proper.prop(MockComponent)(() => ({
      color: "blue",
      object: {
        foo: "bar",
      },
    }))

    const ReWrapped = proper.prop(Component)({
      color: "red",
      object: {
        bar: "baz",
      },
    })

    const { queryByText } = render(<ReWrapped />)

    expect(queryByText(/"foo":"bar"/)).not.toBe(null)
    expect(queryByText(/"bar":"baz"/)).not.toBe(null)
  })

  it("should cope with the same prop on multiple wrappings", () => {
    const Component = proper.prop(MockComponent)(() => ({
      color: "blue",
    }))

    const ReWrapped = proper.prop(Component)({
      color: "blue",
    })

    const { queryByText } = render(<ReWrapped />)

    expect(queryByText(expectedColor("blue"))).not.toBe(null)
  })

  it("should merge differing props on multiple wrappings", () => {
    const Component = proper.prop(MockComponent)(() => ({
      color: "blue",
    }))

    const ReWrapped = proper.prop(Component)({
      optional: false,
    })

    const { queryByText } = render(<ReWrapped />)

    expect(queryByText(expectedColor("blue"))).not.toBe(null)
    expect(queryByText(expectedOptional(false))).not.toBe(null)
  })

  it("should allow the same propable component to be used over multiple instances", () => {
    const Component = proper.prop(MockComponent)(() => ({
      color: "blue",
    }))

    const Component2 = proper.prop(MockComponent)(() => ({
      color: "red",
    }))

    const { queryByText } = render(
      <>
        <Component />
        <Component2 />
      </>
    )

    expect(queryByText(expectedColor("blue"))).not.toBe(null)
    expect(queryByText(expectedColor("red"))).not.toBe(null)
  })
})

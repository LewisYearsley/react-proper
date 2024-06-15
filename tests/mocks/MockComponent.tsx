import React from "react"

export type MockComponentProps = React.PropsWithChildren<{
  color: string
  optional?: boolean
  array?: string[]
  object?: Record<string, string>
}>

export const expectedColor = (color: string) => `Color: ${color}`
export const expectedOptional = (optional: boolean | undefined) => `Optional: ${optional}`
export const expectedArray = (array: string[] | undefined) => `Array: ${array ? JSON.stringify(array) : undefined}`

const MockComponent: React.FC<MockComponentProps> = (props) => {
  const { color, optional, array, object, children } = props

  return (
    <div>
      <p>{expectedColor(color)}</p>
      <p>{expectedOptional(optional)}</p>
      <p>{expectedArray(array)}</p>
      <p>Object: {JSON.stringify(object)}</p>
      {children}
    </div>
  )
}

export default MockComponent

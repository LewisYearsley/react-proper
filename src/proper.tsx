import React, { useContext, useEffect, useMemo } from "react"

type InferProps<TComponent> = TComponent extends React.ComponentType<infer TProps> ? TProps : never

type PropsCallback<TProps, TTheme, TReturn extends Partial<TProps> = Partial<TProps>> = (
  props: TProps,
  theme: TTheme
) => TReturn

export type PropedComponent<TProps, TTheme> = React.ComponentType<TProps> & {
  props: (PropsCallback<TProps, TTheme> | Partial<TProps>)[]
  isPropped: true
  Component: React.ComponentType<TProps>
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type AppendExtraProps<TComponent extends PropedComponent<any, any>, TExtraProps> = TExtraProps extends undefined
  ? InferProps<TComponent>
  : InferProps<TComponent> & TExtraProps

type ProvidePropCallback<TTheme, TComponent extends PropedComponent<any, TTheme>, TExtraProps> = <
  THandledProps extends Partial<InferProps<TComponent>> = Partial<InferProps<TComponent>>,
>(
  props: THandledProps | PropsCallback<AppendExtraProps<TComponent, TExtraProps>, TTheme, THandledProps>
) => PropedComponent<PartialBy<AppendExtraProps<TComponent, TExtraProps>, keyof THandledProps>, TTheme>

type PropCallback<TTheme, TExtraProps> = <TComponent extends PropedComponent<any, TTheme> | React.ComponentType<any>>(
  Component: TComponent
) => ProvidePropCallback<
  TTheme,
  TComponent extends React.ComponentType<infer TProps> ? PropedComponent<TProps, TTheme> : TComponent,
  TExtraProps
>

export type Proper<TTheme> = {
  useTheme: () => TTheme
  ThemeProvider: React.ComponentType<
    React.PropsWithChildren<{
      theme?: TTheme
    }>
  >
  prop: PropCallback<TTheme, undefined>
  enableExtraProps: <TExtraProps = undefined>() => {
    prop: PropCallback<TTheme, TExtraProps>
  }
}

function mergeProps<TProps extends Record<string, any>>(propsA: TProps, propsB: TProps): TProps {
  return Object.entries(propsA).reduce<TProps>((merged, [key, value]) => {
    const k = key as keyof typeof propsB

    if (!Object.hasOwn(merged, key)) {
      merged[k] = value
    } else if (Array.isArray(value)) {
      const existing = merged[k]
      const incoming = value as typeof existing
      merged[k] = Array.isArray(existing) ? incoming.concat(existing) : incoming
    } else if (typeof value === "object") {
      const existing = merged[k]
      merged[k] = Object.assign({}, existing, value)
    }

    return merged
  }, propsB)
}

function defineTheme<TTheme extends object>(theme: TTheme, namespace = ""): void {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    Object.entries(theme).forEach(([key, value]) => {
      const newNamespace = !namespace ? key : `${namespace}-${key}`

      if (typeof value === "object") {
        defineTheme(value, newNamespace)
      } else {
        document.documentElement.style.setProperty(`--${newNamespace}`, value)
      }
    })
  }
}

export function createProper<TTheme extends object | undefined>(theme: TTheme): Proper<TTheme> {
  const ThemeContext = React.createContext(theme)

  if (theme) {
    defineTheme(theme)
  }

  function isPropable<TProps, TTheme>(
    Component: React.ComponentType<TProps>
  ): Component is PropedComponent<TProps, TTheme> {
    return "isPropped" in Component
  }

  function createPropable<TProps>(Component: React.ComponentType<TProps>): PropedComponent<TProps, TTheme> {
    const Propable: PropedComponent<InferProps<typeof Component>, TTheme> = (props) => {
      const providedTheme = useContext(ThemeContext)
      const resolvedProps = useMemo(() => {
        return Propable.props.reduce<Partial<InferProps<typeof Component>>>((resolved, prop) => {
          return mergeProps(resolved, typeof prop === "function" ? prop(props, providedTheme) : prop)
        }, {})
      }, [props, providedTheme])

      return <Component {...resolvedProps} {...props} />
    }

    Propable.displayName = `Propable(${Component.displayName ?? "Anonymous"})`

    Propable.isPropped = true

    Propable.props = []

    Propable.Component = Component

    return Propable
  }

  const prop: Proper<TTheme>["prop"] = (Component) => {
    return (moreProps) => {
      if (isPropable(Component)) {
        const Propable = createPropable(Component.Component)

        Propable.props = [...Component.props]
        Propable.props.push(moreProps)

        return Propable
      } else {
        const Propable = createPropable(Component)

        Propable.props.push(moreProps)

        return Propable
      }
    }
  }

  return {
    ThemeProvider: ({ theme: providedTheme, children }) => {
      const themeToUse = providedTheme ?? theme

      useEffect(() => {
        if (themeToUse) {
          defineTheme(themeToUse)
        }
      }, [themeToUse])

      return <ThemeContext.Provider value={themeToUse}>{children}</ThemeContext.Provider>
    },
    useTheme: () => useContext(ThemeContext),
    prop: prop,
    enableExtraProps: () => ({
      prop,
    }),
  }
}

import React, { useContext, useMemo } from "react"

type InferProps<TComponent> = TComponent extends React.ComponentType<infer TProps> ? TProps : never

type PropsCallback<TProps, TTheme, TReturn extends Partial<TProps> = Partial<TProps>> = (
  props: TProps,
  theme: TTheme
) => TReturn

export type PropedComponent<TProps, TTheme> = React.ComponentType<TProps> & {
  props: (PropsCallback<TProps, TTheme> | Partial<TProps>)[]
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

type PropCallback<TTheme, TExtraProps> = <TComponent extends PropedComponent<any, TTheme>>(
  Component: TComponent
) => ProvidePropCallback<TTheme, TComponent, TExtraProps>

export type Proper<TTheme> = {
  useTheme: () => TTheme
  ThemeProvider: React.ComponentType<
    React.PropsWithChildren<{
      theme?: TTheme
    }>
  >
  createPropable: <TProps>(Component: React.ComponentType<TProps>) => PropedComponent<TProps, TTheme>
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

export function createProper<TTheme>(theme: TTheme): Proper<TTheme> {
  const ThemeContext = React.createContext(theme)

  const prop: Proper<TTheme>["prop"] = (Component) => {
    return (moreProps) => {
      Component.props.push(moreProps)

      return Component
    }
  }

  return {
    ThemeProvider: ({ theme: providedTheme, children }) => {
      return <ThemeContext.Provider value={providedTheme ?? theme}>{children}</ThemeContext.Provider>
    },
    useTheme: () => useContext(ThemeContext),
    createPropable: (Component) => {
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

      Propable.props = []

      return Propable
    },
    prop: prop,
    enableExtraProps: () => ({
      prop,
    }),
  }
}
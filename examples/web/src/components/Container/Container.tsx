import type { FC, PropsWithChildren } from "react"
import styles from "./Container.module.css"

type ContainerProps = PropsWithChildren

const Container: FC<ContainerProps> = (props) => {
  const { children } = props

  return <div className={styles.container}>{children}</div>
}

export default Container

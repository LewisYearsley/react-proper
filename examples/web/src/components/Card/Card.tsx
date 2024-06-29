import type { FC, PropsWithChildren } from "react"
import classnames from "classnames"
import styles from "./Card.module.css"

type CardProps = PropsWithChildren<{
  className?: string
}>

const Card: FC<CardProps> = (props) => {
  const { className, children } = props

  return <div className={classnames(styles.container, className)}>{children}</div>
}

export default Card

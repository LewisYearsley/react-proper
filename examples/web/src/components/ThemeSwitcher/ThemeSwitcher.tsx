import type { FC } from "react"
import styles from "./ThemeSwitcher.module.css"
import classnames from "classnames"

type ThemeSwitcherProps = {
  selected: "light" | "dark"
  onChange: (theme: "light" | "dark") => void
  label: string
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = (props) => {
  const { label, selected, onChange } = props

  return (
    <>
      <h4>{label}</h4>
      <div
        className={styles.container}
        onClick={() => {
          onChange(selected === "light" ? "dark" : "light")
        }}
      >
        <div
          className={classnames(styles.puck, {
            [styles.puck_light]: selected === "light",
            [styles.puck_dark]: selected === "dark",
          })}
        />
        <h4>Dark</h4>
        <h4>Light</h4>
      </div>
    </>
  )
}

export default ThemeSwitcher

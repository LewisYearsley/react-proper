import styles from "./App.module.css"
import Card from "./components/Card/Card"
import ThemeSwitcher from "./components/ThemeSwitcher/ThemeSwitcher"
import proper from "./proper"

export const AppCard = proper.prop(Card)({
    className: styles.card,
})

export const Switcher = proper.prop(ThemeSwitcher)({
    label: "Switch theme!"
})
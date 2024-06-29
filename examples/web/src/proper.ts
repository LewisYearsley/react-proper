import { createProper } from "react-proper"

export const lightTheme = {
    background: {
        default: "#fefefe",
        secondary: "#ccc6c6",
    },
    text: {
        colors: {
            contrast: "#3b3b3b"
        },
    },
    border: {
        contrast: "#000000"
    }
};

export const darkTheme: typeof lightTheme = {
    background: {
        default: "#3b3b3b",
        secondary: "#1f1e1e"
    },
    text: {
        colors: {
            contrast: "#fefefe",
        },
    },
    border: {
        contrast: "#ffffff"
    }
}

export default createProper(lightTheme);
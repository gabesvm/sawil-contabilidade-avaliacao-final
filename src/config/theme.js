import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const sawilTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,

    primary: "#0B4F6C",     // azul contábil (principal)
    secondary: "#01BAEF",   // azul claro (destaque)
    tertiary: "#0EAD69",    // verde sucesso
    error: "#D32F2F",

    background: "#F5F7FA",
    surface: "#FFFFFF",
    onSurface: "#1F2937",
    onBackground: "#1F2937",
  },
  roundness: 10,
};
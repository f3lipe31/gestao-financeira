import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const globalStyles = StyleSheet.create({
  // Estilos das aulas anteriores
  screenContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  
  // Novos estilos da Aula 06
  line: {
    backgroundColor: colors.secondaryText,
    height: 1,
    opacity: 0.5,
    marginBottom: 4,
  },
  primaryText: {
    fontSize: 16,
    color: colors.primaryText,
  },
  secondaryText: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  positiveText: {
    fontSize: 16,
    color: colors.positiveText,
  },
  negativeText: {
    fontSize: 16,
    color: colors.negativesText,
  },
});
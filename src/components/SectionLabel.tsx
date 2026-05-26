import { Text, StyleSheet } from "react-native";

interface SectionLabelProps {
  children: React.ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#A0A0A8",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});

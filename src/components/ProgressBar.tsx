import { View, StyleSheet } from "react-native";
import { useColors } from "../hooks/useColors";

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
}

export function ProgressBar({ value, max, color }: ProgressBarProps) {
  const colors = useColors();
  const barColor = color || colors.accent;
  const progress = max > 0 ? (value / max) * 100 : 0;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bar,
          {
            width: `${progress}%`,
            backgroundColor: barColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 4,
    backgroundColor: "#2A2A2E",
    borderRadius: 2,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 2,
  },
});

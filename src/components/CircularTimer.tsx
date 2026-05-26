import { View, Text, StyleSheet } from "react-native";
import { useColors } from "../hooks/useColors";
import Svg, { Circle } from "react-native-svg";

interface CircularTimerProps {
  value: number;
  max: number;
  color?: string;
  size?: number;
}

export function CircularTimer({ value, max, color, size = 220 }: CircularTimerProps) {
  const colors = useColors();
  const timerColor = color || colors.accent;
  const strokeW = 12;
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const progress = max > 0 ? (value / max) : 0;
  const offset = circ * (1 - progress);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colors.border}
          strokeWidth={strokeW}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={timerColor}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </Svg>
      <View style={styles.textOverlay}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>SECONDS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  textOverlay: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 56,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -2,
  },
  label: {
    fontSize: 12,
    color: "#A0A0A8",
    marginTop: 2,
  },
});

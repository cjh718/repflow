import { View, Text, StyleSheet } from "react-native";
import { useColors } from "../hooks/useColors";

interface BadgeProps {
  label: string;
  color?: string;
  small?: boolean;
}

export function Badge({ label, color, small }: BadgeProps) {
  const colors = useColors();
  const badgeColor = color || colors.accent;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: badgeColor + "20",
          borderColor: badgeColor + "40",
          paddingVertical: small ? 2 : 4,
          paddingHorizontal: small ? 6 : 10,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: badgeColor,
            fontSize: small ? 9 : 11,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 99,
    borderWidth: 1,
    alignSelf: "center",
  },
  text: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useColors } from "../src/hooks/useColors";
import { useRepFlow } from "../src/context/RepFlowContext";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const colors = useColors();
  const { user, isReady } = useRepFlow();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady || showSplash) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.iconWrap}>
          <Ionicons name="flash" size={48} color={colors.accent} />
        </View>
        <Text style={styles.title}>
          REP<Text style={{ color: colors.accent }}>FLOW</Text>
        </Text>
        <Text style={styles.subtitle}>GUIDED WORKOUT FLOW</Text>
        {!isReady && <ActivityIndicator color={colors.accent} style={{ marginTop: 32 }} />}
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#C8FF00",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 3,
    color: "#A0A0A8",
    marginTop: 4,
    fontWeight: "500",
  },
});

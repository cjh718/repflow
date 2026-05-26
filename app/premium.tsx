import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "../src/hooks/useColors";
import { useRepFlow } from "../src/context/RepFlowContext";
import { Badge } from "../src/components/Badge";
import { apiRequest } from "../src/lib/query-client";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";

const FEATURES = [
  { icon: "flash" as const, label: "Auto-transition between exercises" },
  { icon: "mic" as const, label: "Real-time voice coaching" },
  { icon: "musical-notes" as const, label: "Spotify & Apple Music integration" },
  { icon: "stats-chart" as const, label: "Full workout history & analytics" },
  { icon: "sparkles" as const, label: "AI-generated personalized plans" },
  { icon: "trophy" as const, label: "Exclusive workout programs" },
  { icon: "ban" as const, label: "Zero ads, forever" },
  { icon: "watch" as const, label: "Apple Watch support (coming soon)" },
];

export default function PremiumScreen() {
  const colors = useColors();
  const { token, setIsPremium, user, setUser } = useRepFlow();
  const insets = useSafeAreaInsets();
  const [plan, setPlan] = useState("annual");

  const handleUpgrade = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      if (token) {
        await apiRequest("POST", "/premium/upgrade", undefined, token);
      }
      setIsPremium(true);
      if (user) {
        const updated = { ...user, isPremium: true };
        setUser(updated);
        await SecureStore.setItemAsync("repflow_user", JSON.stringify(updated));
      }
      router.back();
    } catch {
      // silent fail for demo
      setIsPremium(true);
      if (user) {
        const updated = { ...user, isPremium: true };
        setUser(updated);
        await SecureStore.setItemAsync("repflow_user", JSON.stringify(updated));
      }
      router.back();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.grey2} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Ionicons name="star" size={48} color={colors.premium} />
            <Text style={styles.title}>
              REP<Text style={{ color: colors.premium }}>FLOW</Text> PRO
            </Text>
            <Text style={styles.subtitle}>Unlock the full guided experience</Text>
          </View>

          <View style={styles.planList}>
            {[
              { key: "annual", label: "Annual", price: "SGD 39.98", sub: "/ year", save: "SAVE 33%" },
              { key: "monthly", label: "Monthly", price: "SGD 4.98", sub: "/ month", save: null },
            ].map((p) => (
              <TouchableOpacity
                key={p.key}
                onPress={() => { setPlan(p.key); Haptics.selectionAsync(); }}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: plan === p.key ? colors.premium + "15" : colors.card,
                    borderColor: plan === p.key ? colors.premium : colors.border,
                    borderWidth: 2,
                  },
                ]}
                activeOpacity={0.8}
              >
                <View>
                  <Text style={[styles.planLabel, { color: plan === p.key ? colors.premium : "#FFFFFF" }]}>
                    {p.label}
                  </Text>
                  <Text style={styles.planSub}>{p.sub}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[styles.planPrice, { color: plan === p.key ? colors.premium : "#FFFFFF" }]}>
                    {p.price}
                  </Text>
                  {p.save && <Badge label={p.save} color={colors.premium} small />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.featuresCard}>
            {FEATURES.map((f, i) => (
              <View key={i} style={[styles.featureRow, i < FEATURES.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Ionicons name={f.icon} size={18} color={colors.grey2} />
                <Text style={styles.featureText}>{f.label}</Text>
                <Ionicons name="checkmark" size={16} color={colors.green} />
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={handleUpgrade} style={styles.upgradeBtn} activeOpacity={0.8}>
            <Text style={styles.upgradeText}>
              START PRO — {plan === "annual" ? "SGD 39.98/yr" : "SGD 4.98/mo"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.footer}>Cancel anytime &middot; Secure payment &middot; 7-day free trial</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },
  backText: {
    fontSize: 14,
    color: "#A0A0A8",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: "#A0A0A8",
    marginTop: 8,
  },
  planList: {
    gap: 12,
    marginBottom: 28,
  },
  planCard: {
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  planSub: {
    fontSize: 12,
    color: "#A0A0A8",
    marginTop: 2,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: "900",
  },
  featuresCard: {
    backgroundColor: "#1C1C1F",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2A2A2E",
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
  },
  upgradeBtn: {
    backgroundColor: "#FFB800",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },
  upgradeText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 0.5,
  },
  footer: {
    fontSize: 11,
    color: "#505058",
    textAlign: "center",
    marginTop: 12,
  },
});

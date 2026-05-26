import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "../../src/hooks/useColors";
import { useRepFlow } from "../../src/context/RepFlowContext";
import { SectionLabel } from "../../src/components/SectionLabel";
import { Badge } from "../../src/components/Badge";
import * as Haptics from "expo-haptics";

const BADGES = [
  { icon: "flame" as const, label: "First Workout", earned: 1 },
  { icon: "barbell" as const, label: "3 in a Row", earned: 3 },
  { icon: "flash" as const, label: "Week Warrior", earned: 7 },
  { icon: "trophy" as const, label: "10 Workouts", earned: 10 },
  { icon: "star" as const, label: "30-Day Club", earned: 30 },
  { icon: "locate" as const, label: "Consistency", earned: 5 },
];

const SETTINGS = ["Notifications", "Voice Coach", "Units (metric)", "Dark Mode", "Privacy Policy", "About RepFlow"];

export default function ProfileScreen() {
  const colors = useColors();
  const { user, isPremium, streakDays, completedWorkouts, logout } = useRepFlow();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    logout();
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 24 }}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Ionicons name="barbell" size={40} color={colors.bg} />
            </View>
            <Text style={styles.name}>{(user?.name || "ATHLETE").toUpperCase()}</Text>
            <Text style={styles.email}>{user?.email || ""}</Text>
            {isPremium ? (
              <Badge label="PRO MEMBER" color={colors.premium} />
            ) : (
              <TouchableOpacity
                onPress={() => router.push("/premium")}
                style={styles.upgradePill}
                activeOpacity={0.8}
              >
                <Text style={styles.upgradeText}>Upgrade to Pro</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { label: "Streak", value: `${streakDays}`, sub: "days", icon: "flame" as const },
              { label: "Workouts", value: `${completedWorkouts}`, sub: "total", icon: "barbell" as const },
              { label: "Calories", value: `${completedWorkouts * 142}`, sub: "burned", icon: "flash" as const },
            ].map((s) => (
              <View key={s.label} style={styles.statCard}>
                <Ionicons name={s.icon} size={18} color={colors.accent} />
                <Text style={[styles.statValue, { color: colors.accent }]}>{s.value}</Text>
                <Text style={styles.statSub}>{s.sub}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Badges */}
          <View style={{ marginTop: 28 }}>
            <SectionLabel>ACHIEVEMENT BADGES</SectionLabel>
            <View style={styles.badgesGrid}>
              {BADGES.map((b, i) => {
                const earned = b.earned === 1 ? completedWorkouts >= 1 :
                  b.earned === 3 ? streakDays >= 3 :
                  b.earned === 7 ? streakDays >= 7 :
                  b.earned === 10 ? completedWorkouts >= 10 :
                  b.earned === 30 ? streakDays >= 30 :
                  completedWorkouts >= 5;
                return (
                  <View
                    key={i}
                    style={[
                      styles.badgeCard,
                      {
                        backgroundColor: earned ? colors.accent + "12" : colors.card,
                        borderColor: earned ? colors.accent + "40" : colors.border,
                        opacity: earned ? 1 : 0.4,
                      },
                    ]}
                  >
                    <Ionicons name={b.icon} size={28} color={earned ? colors.accent : colors.grey3} />
                    <Text style={[styles.badgeLabel, { color: earned ? "#FFFFFF" : colors.grey3 }]}>
                      {b.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.8}>
            <Text style={styles.logoutText}>LOG OUT</Text>
          </TouchableOpacity>

          {/* Settings */}
          <View style={{ marginTop: 28 }}>
            <SectionLabel>SETTINGS</SectionLabel>
            <View style={styles.settingsList}>
              {SETTINGS.map((s, i) => (
                <TouchableOpacity key={i} style={[
                  styles.settingsRow,
                  i === 0 && { borderTopLeftRadius: 14, borderTopRightRadius: 14 },
                  i === SETTINGS.length - 1 && { borderBottomLeftRadius: 14, borderBottomRightRadius: 14 },
                ]} activeOpacity={0.8}>
                  <Text style={styles.settingsText}>{s}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.grey3} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 26,
    backgroundColor: "#C8FF00",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  email: {
    fontSize: 13,
    color: "#A0A0A8",
    marginTop: 4,
    marginBottom: 12,
  },
  upgradePill: {
    borderWidth: 1,
    borderColor: "#FFB80060",
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  upgradeText: {
    fontSize: 11,
    color: "#FFB800",
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1C1C1F",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2A2A2E",
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
  },
  statSub: {
    fontSize: 10,
    color: "#A0A0A8",
  },
  statLabel: {
    fontSize: 11,
    color: "#505058",
    marginTop: 2,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  badgeCard: {
    width: "30%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 6,
    textAlign: "center",
  },
  logoutBtn: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#FF3B3015",
    borderWidth: 1,
    borderColor: "#FF3B3040",
    borderRadius: 16,
    alignItems: "center",
    marginTop: 28,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF3B30",
    letterSpacing: 0.5,
  },
  settingsList: {
    marginTop: 12,
  },
  settingsRow: {
    backgroundColor: "#1C1C1F",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
});

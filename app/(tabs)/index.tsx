import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "../../src/hooks/useColors";
import { useRepFlow } from "../../src/context/RepFlowContext";
import { SectionLabel } from "../../src/components/SectionLabel";
import { CATEGORIES, WORKOUT_DB } from "../../src/constants/data";
import * as Haptics from "expo-haptics";

const QUICK_WORKOUTS = [
  { label: "5 Min Blast", sub: "High Intensity", dur: 5, cat: "hiit", level: "beginner", color: "#FF5C1A", icon: "flash" as const },
  { label: "Core Focus", sub: "Beginner Friendly", dur: 10, cat: "core", level: "beginner", color: "#C8FF00", icon: "flame" as const },
  { label: "Full Body", sub: "Intermediate", dur: 20, cat: "fullbody", level: "intermediate", color: "#FF2D55", icon: "barbell" as const },
  { label: "Stretch Flow", sub: "Recovery", dur: 10, cat: "stretching", level: "beginner", color: "#5AC8FA", icon: "leaf" as const },
];

export default function HomeScreen() {
  const colors = useColors();
  const { user, streakDays, completedWorkouts } = useRepFlow();
  const insets = useSafeAreaInsets();

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const activeDay = new Date().getDay();

  const handleQuickStart = (w: typeof QUICK_WORKOUTS[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/active-workout",
      params: {
        level: w.level,
        category: w.cat,
        duration: String(w.dur),
      },
    });
  };

  const handleCategory = (cat: typeof CATEGORIES[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/active-workout",
      params: {
        level: "beginner",
        category: cat.key,
        duration: "10",
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{today.toUpperCase()}</Text>
            <Text style={styles.greeting}>LET'S FLOW</Text>
            {user && (
              <Text style={styles.welcome}>Welcome back, {user.name}!</Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            style={styles.avatarBtn}
          >
            <Ionicons name="person" size={20} color={colors.grey2} />
          </TouchableOpacity>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakIcon}>
            <Ionicons name="flame" size={28} color={colors.bg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.streakText, { color: colors.accent }]}>
              {streakDays} DAY STREAK
            </Text>
            <Text style={styles.streakSub}>
              Keep it up! Train today to maintain your streak.
            </Text>
          </View>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.weekRow}>
          {weekDays.map((d, i) => {
            const idx = i === 6 ? 0 : i + 1;
            const isToday = idx === activeDay;
            const done = i < (activeDay - 1 + 7) % 7 && streakDays > i;
            return (
              <View
                key={i}
                style={[
                  styles.dayPill,
                  {
                    backgroundColor: isToday ? colors.accent : done ? colors.accent + "20" : colors.card,
                    borderColor: isToday ? colors.accent : done ? colors.accentDim + "50" : colors.border,
                  },
                ]}
              >
                <Text style={[styles.dayLabel, { color: isToday ? colors.bg : done ? colors.accent : colors.grey3 }]}>
                  {d}
                </Text>
                <Text style={{ fontSize: 14, marginTop: 4, color: isToday ? colors.bg : done ? colors.accent : colors.grey3 }}>
                  {done ? "Done" : isToday ? "Today" : "·"}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Quick Start */}
        <View style={styles.section}>
          <SectionLabel>QUICK START</SectionLabel>
          <View style={styles.quickGrid}>
            {QUICK_WORKOUTS.map((w, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleQuickStart(w)}
                style={styles.quickCard}
                activeOpacity={0.8}
              >
                <Ionicons name={w.icon} size={22} color={w.color} style={{ marginBottom: 8 }} />
                <Text style={styles.quickLabel}>{w.label}</Text>
                <Text style={styles.quickSub}>{w.sub}</Text>
                <Text style={[styles.quickDur, { color: w.color }]}>{w.dur} MIN</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* All Workouts */}
        <View style={styles.section}>
          <SectionLabel>ALL WORKOUTS</SectionLabel>
          <View style={styles.allGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                onPress={() => handleCategory(cat)}
                style={[styles.allCard, { borderLeftColor: cat.color }]}
                activeOpacity={0.8}
              >
                <Ionicons name={cat.icon} size={20} color={cat.color} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.allLabel}>{cat.label}</Text>
                  <Text style={styles.allSub}>
                    {WORKOUT_DB.beginner[cat.key]?.length || 3} exercises
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Progress Stats */}
        <View style={styles.section}>
          <SectionLabel>YOUR PROGRESS</SectionLabel>
          <View style={styles.statsRow}>
            {[
              { label: "Workouts", value: completedWorkouts, unit: "done" },
              { label: "Calories", value: completedWorkouts * 142, unit: "kcal" },
              { label: "Minutes", value: completedWorkouts * 12, unit: "active" },
            ].map((s) => (
              <View key={s.label} style={styles.statCard}>
                <Text style={[styles.statValue, { color: colors.accent }]}>{s.value}</Text>
                <Text style={styles.statUnit}>{s.unit}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  date: {
    fontSize: 12,
    color: "#A0A0A8",
    letterSpacing: 1,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  welcome: {
    fontSize: 12,
    color: "#C8FF00",
    marginTop: 4,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1C1C1F",
    borderWidth: 1,
    borderColor: "#2A2A2E",
    alignItems: "center",
    justifyContent: "center",
  },
  streakCard: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: "#C8FF0018",
    borderWidth: 1,
    borderColor: "#C8FF0030",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  streakIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#C8FF00",
    alignItems: "center",
    justifyContent: "center",
  },
  streakText: {
    fontSize: 24,
    fontWeight: "900",
  },
  streakSub: {
    fontSize: 12,
    color: "#A0A0A8",
    marginTop: 2,
  },
  weekRow: {
    flexDirection: "row",
    gap: 6,
    marginHorizontal: 24,
    marginTop: 20,
  },
  dayPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: "700",
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 24,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  quickCard: {
    width: "47%",
    backgroundColor: "#1C1C1F",
    borderWidth: 1,
    borderColor: "#2A2A2E",
    borderRadius: 18,
    padding: 18,
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  quickSub: {
    fontSize: 11,
    color: "#A0A0A8",
    marginTop: 2,
  },
  quickDur: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 8,
  },
  allGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  allCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1F",
    borderWidth: 1,
    borderColor: "#2A2A2E",
    borderLeftWidth: 3,
    borderRadius: 14,
    padding: 16,
  },
  allLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  allSub: {
    fontSize: 10,
    color: "#A0A0A8",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
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
  },
  statUnit: {
    fontSize: 10,
    color: "#A0A0A8",
  },
  statLabel: {
    fontSize: 11,
    color: "#505058",
    marginTop: 2,
  },
});

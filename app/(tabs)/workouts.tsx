import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "../../src/hooks/useColors";
import { SectionLabel } from "../../src/components/SectionLabel";
import { LEVELS, CATEGORIES, DURATIONS, WORKOUT_DB } from "../../src/constants/data";
import * as Haptics from "expo-haptics";

export default function WorkoutsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [level, setLevel] = useState("beginner");
  const [category, setCategory] = useState("core");
  const [duration, setDuration] = useState(10);

  const exercises = WORKOUT_DB[level]?.[category] || WORKOUT_DB.beginner.core;

  const handleBegin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/active-workout",
      params: {
        level,
        category,
        duration: String(duration),
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={styles.title}>
            CUSTOMIZE{"\n"}
            <Text style={{ color: colors.accent }}>WORKOUT</Text>
          </Text>

          <SectionLabel>DIFFICULTY LEVEL</SectionLabel>
          <View style={styles.levelList}>
            {LEVELS.map((l) => (
              <TouchableOpacity
                key={l.key}
                onPress={() => { setLevel(l.key); Haptics.selectionAsync(); }}
                style={[
                  styles.levelBtn,
                  {
                    backgroundColor: level === l.key ? l.color + "15" : colors.card,
                    borderColor: level === l.key ? l.color : colors.border,
                    borderWidth: 2,
                  },
                ]}
                activeOpacity={0.8}
              >
                <View>
                  <Text style={[styles.levelLabel, { color: level === l.key ? l.color : "#FFFFFF" }]}>
                    {l.label}
                  </Text>
                  <Text style={styles.levelDesc}>{l.desc}</Text>
                </View>
                {level === l.key && <Ionicons name="checkmark" size={18} color={l.color} />}
              </TouchableOpacity>
            ))}
          </View>

          <SectionLabel>WORKOUT TYPE</SectionLabel>
          <View style={styles.catGrid}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c.key}
                onPress={() => { setCategory(c.key); Haptics.selectionAsync(); }}
                style={[
                  styles.catBtn,
                  {
                    backgroundColor: category === c.key ? c.color + "15" : colors.card,
                    borderColor: category === c.key ? c.color : colors.border,
                    borderWidth: 2,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Ionicons name={c.icon} size={20} color={category === c.key ? c.color : "#FFFFFF"} />
                <Text style={[styles.catLabel, { color: category === c.key ? c.color : "#FFFFFF" }]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <SectionLabel>DURATION</SectionLabel>
          <View style={styles.durRow}>
            {DURATIONS.map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => { setDuration(d); Haptics.selectionAsync(); }}
                style={[
                  styles.durBtn,
                  {
                    backgroundColor: duration === d ? colors.accent : colors.card,
                    borderColor: duration === d ? colors.accent : colors.border,
                    borderWidth: 2,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text style={[styles.durValue, { color: duration === d ? colors.bg : "#FFFFFF" }]}>
                  {d}
                </Text>
                <Text style={[styles.durUnit, { color: duration === d ? colors.bg : "#A0A0A8" }]}>
                  MIN
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>WORKOUT PREVIEW</Text>
            {exercises.slice(0, 3).map((ex, i) => (
              <View key={i} style={[styles.previewRow, i < 2 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Ionicons name="barbell" size={16} color={colors.grey2} />
                <Text style={styles.previewName}>{ex.name}</Text>
                <Text style={styles.previewMeta}>
                  {ex.duration ? `${ex.duration}s` : `${ex.reps} reps`} x {ex.rounds}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={handleBegin} style={styles.beginBtn} activeOpacity={0.8}>
            <Text style={styles.beginText}>BEGIN WORKOUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  levelList: {
    gap: 10,
    marginTop: 12,
    marginBottom: 24,
  },
  levelBtn: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  levelDesc: {
    fontSize: 12,
    color: "#A0A0A8",
    marginTop: 2,
  },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    marginBottom: 24,
  },
  catBtn: {
    width: "48%",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  durRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    marginBottom: 32,
  },
  durBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  durValue: {
    fontSize: 18,
    fontWeight: "900",
  },
  durUnit: {
    fontSize: 10,
    fontWeight: "400",
  },
  previewCard: {
    backgroundColor: "#1C1C1F",
    borderWidth: 1,
    borderColor: "#2A2A2E",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 12,
    color: "#A0A0A8",
    marginBottom: 12,
    letterSpacing: 2,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  previewName: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  previewMeta: {
    fontSize: 12,
    color: "#A0A0A8",
  },
  beginBtn: {
    backgroundColor: "#C8FF00",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    marginBottom: 24,
  },
  beginText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0A0A0B",
    letterSpacing: 1,
  },
});

import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "../src/hooks/useColors";
import { useRepFlow } from "../src/context/RepFlowContext";
import { CircularTimer } from "../src/components/CircularTimer";
import { ProgressBar } from "../src/components/ProgressBar";
import { Badge } from "../src/components/Badge";
import { WORKOUT_DB } from "../src/constants/data";
import { apiRequest } from "../src/lib/query-client";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";

export default function ActiveWorkoutScreen() {
  const colors = useColors();
  const { isPremium, streakDays, completedWorkouts, setStreakDays, setCompletedWorkouts, user, setUser, token } = useRepFlow();
  const insets = useSafeAreaInsets();
  const { level, category, duration } = useLocalSearchParams<{ level: string; category: string; duration: string }>();

  const exercises = WORKOUT_DB[level]?.[category] || WORKOUT_DB.beginner.core;

  const [exIdx, setExIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<"countdown" | "work" | "rest" | "manual" | "finished">("countdown");
  const [timeLeft, setTimeLeft] = useState(3);
  const [paused, setPaused] = useState(false);

  const ex = exercises[exIdx];
  const totalExercises = exercises.length;
  const workDuration = ex?.duration || 30;
  const restDuration = ex?.rest || 15;

  useEffect(() => {
    if (paused || phase !== "countdown") return;
    const t = setInterval(() => {
      setTimeLeft((v) => {
        if (v <= 1) {
          clearInterval(t);
          setPhase("work");
          return workDuration;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [paused, phase, workDuration]);

  useEffect(() => {
    if (paused || phase === "countdown" || phase === "finished") return;
    const t = setInterval(() => {
      setTimeLeft((v) => {
        if (v <= 1) {
          clearInterval(t);
          handleTimerEnd();
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [paused, phase, exIdx, round]);

  function handleTimerEnd() {
    if (phase === "work") {
      if (round < ex.rounds) {
        setPhase("rest");
        setTimeLeft(restDuration);
      } else {
        if (exIdx + 1 < totalExercises) {
          if (isPremium) {
            advanceExercise();
          } else {
            setPhase("manual");
          }
        } else {
          finishWorkout();
        }
      }
    } else if (phase === "rest") {
      setPhase("work");
      setRound((r) => r + 1);
      setTimeLeft(workDuration);
    }
  }

  function advanceExercise() {
    const next = exIdx + 1;
    if (next < totalExercises) {
      setExIdx(next);
      setRound(1);
      setPhase("work");
      setTimeLeft(exercises[next].duration || 30);
    } else {
      finishWorkout();
    }
  }

  function finishWorkout() {
    setPhase("finished");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newCompleted = completedWorkouts + 1;
    const newStreak = streakDays + 1;
    setCompletedWorkouts(newCompleted);
    setStreakDays(newStreak);

    if (user) {
      const updated = { ...user, completedWorkouts: newCompleted, streakDays: newStreak };
      setUser(updated);
      SecureStore.setItemAsync("repflow_user", JSON.stringify(updated));
    }

    if (token) {
      apiRequest("POST", "/workouts/complete", undefined, token).catch(() => {});
    }
  }

  const isResting = phase === "rest";
  const isManual = phase === "manual";
  const isCountdown = phase === "countdown";
  const isFinished = phase === "finished";

  const timerMax = isCountdown ? 3 : phase === "work" ? workDuration : phase === "rest" ? restDuration : workDuration;
  const timerColor = isResting ? colors.blue : isManual ? colors.premium : colors.accent;

  if (isFinished) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
        <View style={styles.finishedContent}>
          <Ionicons name="trophy" size={72} color={colors.premium} />
          <Text style={styles.finishedTitle}>
            WORKOUT{"\n"}
            <Text style={{ color: colors.accent }}>COMPLETE!</Text>
          </Text>
          <Text style={styles.finishedSub}>You crushed it! Keep the streak alive tomorrow.</Text>

          <View style={styles.finishedStats}>
            {[
              { icon: "flame" as const, value: `${exercises.length}`, label: "Exercises" },
              { icon: "time" as const, value: duration || "10", label: "Minutes" },
              { icon: "barbell" as const, value: `${exercises.reduce((a, e) => a + e.rounds, 0)}`, label: "Rounds" },
            ].map((s) => (
              <View key={s.label} style={styles.finishedStatCard}>
                <Ionicons name={s.icon} size={20} color={colors.accent} />
                <Text style={[styles.finishedStatValue, { color: colors.accent }]}>{s.value}</Text>
                <Text style={styles.finishedStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={() => router.replace("/")} style={styles.doneBtn} activeOpacity={0.8}>
            <Text style={styles.doneText}>BACK TO HOME</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="close" size={18} color={colors.white} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <ProgressBar value={exIdx} max={totalExercises} color={colors.accent} />
        </View>
        <Text style={styles.countText}>
          {exIdx + 1}/{totalExercises}
        </Text>
      </View>

      {/* Phase Badge */}
      <View style={{ alignItems: "center", marginTop: 8 }}>
        {isCountdown ? (
          <Badge label="GET READY" color={colors.premium} />
        ) : isResting ? (
          <Badge label="REST" color={colors.blue} />
        ) : isManual ? (
          <Badge label="DONE — TAP NEXT" color={colors.premium} />
        ) : (
          <Badge label={`ROUND ${round} / ${ex.rounds}`} color={colors.accent} />
        )}
      </View>

      {/* Exercise Name */}
      <View style={{ alignItems: "center", marginTop: 12, paddingHorizontal: 24 }}>
        <Text style={styles.exerciseName}>
          {isCountdown ? "GET READY" : isResting ? "REST" : ex.name}
        </Text>
        {!isCountdown && !isResting && (
          <Text style={styles.exerciseDesc}>{ex.desc}</Text>
        )}
      </View>

      {/* Timer */}
      <View style={styles.timerArea}>
        <CircularTimer value={timeLeft} max={timerMax} color={timerColor} />
        {ex.reps && !ex.duration && !isCountdown && !isResting && (
          <Text style={styles.repsText}>{ex.reps} reps this round</Text>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => { setPaused((p) => !p); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          style={[styles.controlBtn, { backgroundColor: paused ? colors.accent : colors.card, borderColor: paused ? colors.accent : colors.border }]}
        >
          <Text style={[styles.controlText, { color: paused ? colors.bg : colors.white }]}>
            {paused ? "RESUME" : "PAUSE"}
          </Text>
        </TouchableOpacity>

        {(isManual || isPremium) && (
          <TouchableOpacity
            onPress={() => { advanceExercise(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
            style={styles.nextBtn}
          >
            <Text style={styles.nextText}>NEXT</Text>
          </TouchableOpacity>
        )}

        {!isManual && (
          <TouchableOpacity
            onPress={() => { advanceExercise(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            style={[styles.controlBtn, { width: 54 }]}
          >
            <Text style={[styles.controlText, { color: colors.grey2, fontSize: 12 }]}>SKIP</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Free upgrade banner */}
      {!isPremium && isManual && (
        <View style={styles.upgradeBanner}>
          <Text style={styles.upgradeBannerText}>
            Upgrade to Pro for auto-transitions + voice coaching
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2A2A2E",
    backgroundColor: "#1C1C1F",
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 12,
    color: "#A0A0A8",
    fontFamily: "monospace",
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  exerciseDesc: {
    fontSize: 13,
    color: "#A0A0A8",
    marginTop: 4,
    textAlign: "center",
  },
  timerArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  repsText: {
    fontSize: 13,
    color: "#A0A0A8",
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexDirection: "row",
    gap: 12,
  },
  controlBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2A2A2E",
    backgroundColor: "#1C1C1F",
    alignItems: "center",
  },
  controlText: {
    fontSize: 15,
    fontWeight: "700",
  },
  nextBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#C8FF00",
    alignItems: "center",
  },
  nextText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A0A0B",
  },
  upgradeBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#FFB80015",
    borderWidth: 1,
    borderColor: "#FFB80040",
    borderRadius: 14,
    padding: 12,
  },
  upgradeBannerText: {
    fontSize: 12,
    color: "#FFB800",
    textAlign: "center",
  },
  finishedContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  finishedTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 16,
    letterSpacing: -1,
  },
  finishedSub: {
    fontSize: 14,
    color: "#A0A0A8",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 32,
  },
  finishedStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 40,
  },
  finishedStatCard: {
    alignItems: "center",
    backgroundColor: "#1C1C1F",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2A2A2E",
    minWidth: 90,
  },
  finishedStatValue: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
  },
  finishedStatLabel: {
    fontSize: 10,
    color: "#A0A0A8",
  },
  doneBtn: {
    backgroundColor: "#C8FF00",
    borderRadius: 18,
    padding: 18,
    width: "100%",
    alignItems: "center",
  },
  doneText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0A0A0B",
    letterSpacing: 1,
  },
});

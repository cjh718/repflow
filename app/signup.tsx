import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColors } from "../src/hooks/useColors";
import { useRepFlow } from "../src/context/RepFlowContext";
import { apiRequest } from "../src/lib/query-client";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";

export default function SignupScreen() {
  const colors = useColors();
  const { setUser, setToken, setIsPremium, setStreakDays, setCompletedWorkouts } = useRepFlow();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const data = await apiRequest("POST", "/signup", {
        email,
        password,
        name: name || email.split("@")[0],
      });
      await SecureStore.setItemAsync("repflow_token", data.token);
      await SecureStore.setItemAsync("repflow_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setIsPremium(data.user.isPremium);
      setStreakDays(data.user.streakDays);
      setCompletedWorkouts(data.user.completedWorkouts);
      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.tag}>JOIN THE MOVEMENT</Text>
        <Text style={styles.title}>
          CREATE YOUR{"\n"}
          <Text style={{ color: colors.accent }}>FREE ACCOUNT</Text>
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Display Name (optional)"
            placeholderTextColor={colors.grey3}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.grey3}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.grey3}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={colors.grey3}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            style={[styles.btn, loading && { opacity: 0.7 }]}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={styles.btnText}>GET STARTED</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.switchLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  tag: {
    fontSize: 13,
    letterSpacing: 4,
    color: "#C8FF00",
    marginBottom: 16,
    fontWeight: "700",
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 52,
    marginBottom: 32,
    letterSpacing: -1,
  },
  form: { gap: 16 },
  input: {
    width: "100%",
    padding: 18,
    backgroundColor: "#1C1C1F",
    borderWidth: 1,
    borderColor: "#2A2A2E",
    borderRadius: 14,
    color: "#FFFFFF",
    fontSize: 16,
  },
  error: {
    color: "#FF3B30",
    fontSize: 13,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#C8FF00",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0A0A0B",
    letterSpacing: 1,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  switchText: { fontSize: 14, color: "#A0A0A8" },
  switchLink: { fontSize: 14, color: "#C8FF00", fontWeight: "700" },
});

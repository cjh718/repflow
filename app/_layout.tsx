import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RepFlowProvider } from "../src/context/RepFlowContext";
import { queryClient } from "../src/lib/query-client";
import { colors } from "../src/constants/colors";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <RepFlowProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="premium" />
            <Stack.Screen name="active-workout" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </RepFlowProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

import { Component, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.error}>{this.state.error?.message || "Unknown error"}</Text>
          <Text style={styles.stack}>{this.state.error?.stack?.slice(0, 500)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0B", padding: 24, justifyContent: "center" },
  title: { color: "#FFFFFF", fontSize: 20, fontWeight: "700", marginBottom: 12 },
  error: { color: "#FF5C1A", fontSize: 14, marginBottom: 12 },
  stack: { color: "#A0A0A8", fontSize: 11, fontFamily: "monospace" },
});

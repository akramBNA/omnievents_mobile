import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) setInitialRoute("home");
      else setInitialRoute("login");
    });
  }, []);

  if (!initialRoute) return null;

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack initialRouteName={initialRoute}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

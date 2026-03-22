import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HomeScreen from "./index";

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ userName, logout, navigation }: any) {
  return (
    <View style={styles.drawerContainer}>
      <Text style={styles.greeting}>Bonjour, {userName || "Utilisateur"}</Text>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => logout(navigation)}
      >
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function MainLayout() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    AsyncStorage.getItem("user_name").then((name) => {
      if (name) setUserName(name);
    });
  }, []);

  const logout = async (navigation: any) => {
    await AsyncStorage.clear();
    navigation.replace("/(auth)/login");
  };

  return (
    <ThemeProvider value={DefaultTheme}>
      <Drawer.Navigator
        screenOptions={{ headerShown: true }}
        drawerContent={(props) => (
          <CustomDrawerContent {...props} userName={userName} logout={logout} />
        )}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
      </Drawer.Navigator>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  drawerContainer: { flex: 1, padding: 20, justifyContent: "flex-start" },
  greeting: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});

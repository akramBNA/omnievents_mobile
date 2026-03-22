import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import "react-native-gesture-handler";
import HomeScreen from "./index";

const Drawer = createDrawerNavigator();

// --- Custom Drawer Component ---
interface DrawerProps {
  userName: string;
  logout: (navigation: any) => void;
  navigation: any;
}

function CustomDrawerContent({ userName, logout, navigation }: DrawerProps) {
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

// --- Main Root Layout ---
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    AsyncStorage.getItem("user_name").then((name: string | null) => {
      if (name) setUserName(name);
    });
  }, []);

  const logout = async (navigation: any) => {
    await AsyncStorage.clear();
    navigation.replace("/login"); // send back to login
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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

// --- Styles ---
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HomeScreen from "./index";

const Drawer = createDrawerNavigator();

export default function HomeLayout() {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    AsyncStorage.getItem("user_name").then((name) => {
      if (name) setUserName(name);
    });
  }, []);

  const logout = async (navigation: any) => {
    await AsyncStorage.clear();
    navigation.replace("login");
  };

  function CustomDrawerContent({ navigation }: any) {
    return (
      <View style={styles.drawerContainer}>
        <View style={styles.userContainer}>
          <Text style={styles.hello}>Bonjour!</Text>
          <Text style={styles.userName}>{userName || "Utilisateur"}</Text>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { alignSelf: "center" }]}
          onPress={() => logout(navigation)}
        >
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#2563eb",
        headerTitleStyle: { color: "#2563eb" },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Accueil" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  userContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  hello: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

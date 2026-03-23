import { AppDispatch, RootState } from "@/store";
import { loginThunk } from "@/store/authSlice";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const currentYear = new Date().getFullYear();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Check if the form is valid
  const isFormValid = useMemo(() => {
    return (
      email.trim() !== "" &&
      validateEmail(email) &&
      password.trim() !== "" &&
      password.length >= 6
    );
  }, [email, password]);

  const handleLogin = async () => {
    if (!isFormValid) {
      setLocalError("Veuillez remplir correctement tous les champs");
      return;
    }

    setLocalError("");

    try {
      await dispatch(loginThunk({ email, password })).unwrap();
      router.replace("/home");
    } catch (err: any) {
      Alert.alert("Accès refusé!", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bienvenue au OMNIEVENTS</Text>

        {localError ? (
          <Text style={styles.error}>{localError}</Text>
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Mot de passe"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.disabledButton]}
          onPress={handleLogin}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.secondaryText}>S&apos;inscrire</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footer}>
        Réalisé par{" "}
        <Text
          style={{ textDecorationLine: "underline" }}
          onPress={() => Linking.openURL("https://akram-benaoun.site")}
        >
          Akram Benaoun
        </Text>{" "}
        © {currentYear}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1e3a8a",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#888",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  secondaryButton: {
    backgroundColor: "#dbeafe",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryText: {
    color: "#1e3a8a",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  footer: {
    marginTop: 20,
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
});

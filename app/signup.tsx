import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/store";
import { signupThunk } from "@/store/authSlice";

export default function SignupScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const currentYear = new Date().getFullYear();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async () => {
    dispatch({ type: "auth/clearError" });

    if (!firstName) {
      alert("Prénom requis");
      return;
    }

    if (!lastName) {
      alert("Nom requis");
      return;
    }

    if (!email) {
      alert("Email requis");
      return;
    }

    if (!validateEmail(email)) {
      alert("Email invalide");
      return;
    }

    if (!password) {
      alert("Mot de passe requis");
      return;
    }

    if (password.length < 6) {
      alert("Mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      await dispatch(
        signupThunk({ firstName, lastName, email, password }),
      ).unwrap();

      router.replace("/home");
    } catch (err: any) {
      alert(err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Créer un compte</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TextInput
            placeholder="Prénom"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Nom"
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
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
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>S&apos;inscrire</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.secondaryText}>Retour</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          Réalisé par Akram Benaoun © {currentYear}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./api.service";

export const login = async (email: string, password: string) => {
  const res = await API.post("/users/signIn/", {
    user_email: email,
    user_password: password,
  });

  const { data, token } = res.data;

  if (data.role_type !== "user") {
    throw new Error("Cette application est réservée aux utilisateurs");
  }

  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("user_id", data.user_id.toString());
  await AsyncStorage.setItem("user_name", data.user_name);

  return data;
};

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  const res = await API.post("/users/signUp/", {
    user_name: firstName,
    user_lastname: lastName,
    user_email: email,
    user_password: password,
  });

  const { data, token } = res.data;

  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("user_id", data.user_id.toString());
  await AsyncStorage.setItem("user_name", data.user_name);

  return data;
};

export const logout = async () => {
  await AsyncStorage.clear();
};

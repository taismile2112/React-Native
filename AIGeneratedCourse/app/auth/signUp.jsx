import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import Colors from "../../constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function SignUp() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUserDetail } = useContext(UserDetailContext);

  const togglePassword = () => setShowPassword(!showPassword);

  const CreateNewAccount = () => {
    if (!fullName || !email || !password) {
      Alert.alert("⚠️ Warning", "Please fill all fields!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        const user = resp.user;
        await SaveUser(user);

        Alert.alert("✅ Notification", "Sign up successfully!");

        router.replace("/auth/signIn");
      })
      .catch((e) => {
        console.log(e.message);
        Alert.alert("❌ Failed", "Email already in use or invalid!");
      });
  };

  const SaveUser = async (user) => {
    const isAdmin = email === "aigencourse@gmail.com"; // email admin bạn quy định

    const data = {
      name: fullName,
      email: email,
      uid: user?.uid,
      member: false,
      role: isAdmin ? "admin" : "user",
    };

    await setDoc(doc(db, "users", email), data);
    setUserDetail(data);
  };

  return (
    <View style={styles.container}>
      {/* Top Banner Image */}
      <Image
        source={require("./../../assets/images/Splash-SignIn_Up.png")}
        style={styles.topImage}
      />

      <Text style={styles.header}>Create Account 🔐</Text>

      {/* Full Name Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={22} color={Colors.PRIMARY} />
        <TextInput
          placeholder="Full Name"
          style={styles.textInput}
          onChangeText={(v) => setFullName(v)}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={22} color={Colors.PRIMARY} />
        <TextInput
          placeholder="Email"
          style={styles.textInput}
          onChangeText={(v) => setEmail(v)}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={22} color={Colors.PRIMARY} />
        <TextInput
          placeholder="Password"
          style={[styles.textInput, { flex: 1 }]}
          secureTextEntry={!showPassword}
          onChangeText={(v) => setPassword(v)}
        />
        <Pressable onPress={togglePassword}>
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={22}
            color={Colors.PRIMARY}
          />
        </Pressable>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={CreateNewAccount}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Navigation Footer */}
      <View style={styles.footerText}>
        <Text style={{ fontFamily: "outfit" }}>Already have an account?</Text>
        <Pressable onPress={() => router.push("/auth/signIn")}>
          <Text style={styles.loginLink}> 🔑 Sign In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 25,
    alignItems: "center",
  },
  topImage: {
    width: "100%",
    height: 240,
    resizeMode: "contain",
    marginTop: 20,
  },
  header: {
    fontSize: 26,
    fontFamily: "outfit-bold",
    // color: Colors.PRIMARY,
    marginTop: 15,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 14,
    marginTop: 18,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  textInput: {
    fontSize: 18,
    flex: 1,
  },

  button: {
    width: "100%",
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  buttonText: {
    fontFamily: "outfit",
    fontSize: 20,
    color: Colors.WHITE,
    textAlign: "center",
  },

  footerText: {
    flexDirection: "row",
    marginTop: 20,
  },
  loginLink: {
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
  },
});

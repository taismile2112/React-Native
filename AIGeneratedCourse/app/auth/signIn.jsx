import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setUserDetail } = useContext(UserDetailContext);

  const onSignInClick = () => {
    if (!email) return Alert.alert("⚠️", "Please Enter Your Email!");
    if (!password) return Alert.alert("⚠️", "Please Enter Your Password!");

    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        const user = resp.user;
        await getUserDetails(user);
        setLoading(false);
        Alert.alert("✅", "Logged in successfully!");
        router.replace("/(tabs)/home");
      })
      .catch(() => {
        setLoading(false);
        Alert.alert("❌","Invalid Email or Password");
      });
  };

  const getUserDetails = async (user) => {
    const ref = doc(db, "users", user.email);
    const result = await getDoc(ref);

    if (result.exists()) setUserDetail(result.data());
  };

  return (
    <LinearGradient
      colors={[Colors.PRIMARY, "#9e93f4ff", "#47b8e8ff"]}
      style={styles.container}
    >
      <View style={styles.card}>
        <Image
          source={require("../../assets/images/Splash-SignIn_Up.png")}
          style={styles.image}
        />

        <Text style={styles.title}>Welcome Back 👋</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={22} color={Colors.PRIMARY} />
          <TextInput
            placeholder="Email"
            placeholderTextColor={Colors.GRAY}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={22} color={Colors.PRIMARY} />
          <TextInput
            placeholder="Password"
            placeholderTextColor={Colors.GRAY}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            style={styles.input}
          />

          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={Colors.PRIMARY}
            />
          </Pressable>
        </View>

        {/* Button */}
        <Pressable
          onPress={onSignInClick}
          disabled={loading}
          style={styles.button}
        >
          {!loading ? (
            <Text style={styles.buttonText}>Sign In</Text>
          ) : (
            <ActivityIndicator size="large" color="white" />
          )}
        </Pressable>

        {/* Register */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <Pressable onPress={() => router.push("/auth/signUp")}>
            <Text style={styles.registerButton}> Register Now! </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,

  },

  card: {
    backgroundColor: "white",
    padding:20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
    height: 660,
  },

  image: {
    width: "100%",
    height: 240,
    resizeMode: "contain",
  },

  title: {
    fontSize: 25,
    fontFamily: "outfit-bold",
    color: Colors.PRIMARY,
    textAlign: "center",
    marginBottom: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 8,
    borderRadius: 12,
    marginTop: 15,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "outfit",
  },

  button: {
    marginTop: 25,
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderRadius: 12,
    shadowColor: Colors.PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontFamily: "outfit",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 6,
  },

  registerText: {
    fontFamily: "outfit",
  },

  registerButton: {
    color: Colors.PRIMARY,
    fontFamily: "outfit-bold",
  },
});

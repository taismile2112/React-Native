import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../config/firebaseConfig";
import Colors from "../../constant/Colors";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  function notifyMessage(msg) {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  }

  const onSignInClick = () => {
    if (!email) {
      Alert.alert("Warning", "Please Enter Your Email !");
      return;
    }

    if (!password) {
      Alert.alert("Warning", "Please Enter Your Password !");
      return;
    }

    // Nếu qua 2 cái trên → email & password đều có
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        const user = resp.user;
        console.log("Logged in:", user);
        Alert.alert("Notification", "Logged in successfully!");

        await getUserDetails(user);
        setLoading(false);

        router.replace("/(tabs)/home");
      })
      .catch((e) => {
        console.log(e.message);
        setLoading(false);
        Alert.alert("Invalid Email or Password");
      });
  };

  const getUserDetails = async (user) => {
    const ref = doc(db, "users", email);
    const result = await getDoc(ref);

    if (result.exists()) {
      console.log("User data:", result.data());
      setUserDetail(result.data());
    } else {
      console.log("User document not found");
    }
  };

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        padding: 25,
        flex: 1,
        backgroundColor: Colors.WHITE,
      }}
    >
      <Image
        source={require("./../../assets/images/Splash-SignIn_Up.png")}
        style={{
          width: "100%",
          resizeMode: "contain",
          height: 250,
          marginTop: 20,
        }}
      />

      <Text
        style={{
          fontSize: 25,
          fontFamily: "outfit-bold",
          marginTop: 20,
          color: Colors.PRIMARY,
          textShadowColor: Colors.GRAY,
          textShadowOffset: { width: 1, height: 2 },
          textShadowRadius: 1,
        }}
      >
        Welcome Back
      </Text>

      <TextInput
        placeholder="Email"
        onChangeText={(value) => setEmail(value)}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(value) => setPassword(value)}
        secureTextEntry={true}
        style={styles.textInput}
      />

      <TouchableOpacity
        onPress={onSignInClick}
        disabled={loading}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          width: "100%",
          marginTop: 25,
          borderRadius: 10,
        }}
      >
        {!loading ? (
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 20,
              textAlign: "center",
              color: Colors.WHITE,
            }}
          >
            Sign In
          </Text>
        ) : (
          <ActivityIndicator size={"large"} color={Colors.WHITE} />
        )}
      </TouchableOpacity>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          marginTop: 20,
        }}
      >
        <Text style={{ fontFamily: "outfit" }}>Don't have an account?</Text>

        <Pressable onPress={() => router.push("/auth/signUp")}>
          <Text
            style={{
              color: Colors.PRIMARY,
              fontFamily: "outfit-bold",
            }}
          >
            Register Now!
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    width: "100%",
    padding: 15,
    fontSize: 18,
    marginTop: 20,
    borderRadius: 8,
  },
});

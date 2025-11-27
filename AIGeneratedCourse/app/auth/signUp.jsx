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
import Colors from "./../../constant/Colors";
import { InnerScreen } from "react-native-screens";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { UserDetailContext } from "../../context/UserDetailContext";

export default function signUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const CreateNewAccount = () => {
    if (!fullName || !email || !password) {
      Alert.alert("Warning", "Please fill all fields !");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        const user = resp.user;
        console.log(user);
        await SaveUser(user);
        //Save User to Database
        Alert.alert("Notification", "Sign up successfully!");
        router.replace("/auth/signIn");
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const SaveUser = async (user) => {
    const data = {
      name: fullName,
      email: email,
      member: false,
      uid: user?.uid,
    };
    await setDoc(doc(db, "users", email), data);

    setUserDetail(data);

    //Navigate to New Screen
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
      ></Image>

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
        Create New Account
      </Text>

      <TextInput
        onChangeText={(value) => setFullName(value)}
        placeholder="Enter your full name"
        style={styles.textInput}
      ></TextInput>
      <TextInput
        onChangeText={(value) => setEmail(value)}
        placeholder="Email (eg: abc@gmail.com)"
        style={styles.textInput}
      ></TextInput>
      <TextInput
        onChangeText={(value) => setPassword(value)}
        placeholder="Password"
        secureTextEntry={true}
        style={styles.textInput}
      ></TextInput>

      <TouchableOpacity
        onPress={CreateNewAccount}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          width: "100%",
          marginTop: 25,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
            textAlign: "center",
            color: Colors.WHITE,
          }}
        >
          Sign Up
        </Text>
      </TouchableOpacity>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit",
          }}
        >
          Already have an account?
        </Text>

        <Pressable onPress={() => router.push("/auth/signIn")}>
          <Text
            style={{
              color: Colors.PRIMARY,
              fontFamily: "outfit-bold",
            }}
          >
            Sign In Here
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

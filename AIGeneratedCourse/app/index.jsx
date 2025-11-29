// @ts-nocheck
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constant/Colors";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { UserDetailContext } from "@/context/UserDetailContext";

export default function Index() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const result = await getDoc(doc(db, "users", user.email));
        setUserDetail(result.data());
        router.navigate("/(tabs)/home");
      }
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  if (checkingAuth) return null;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <Image
        source={require("./../assets/images/landing.png")}
        style={{ width: "100%", height: 300, marginTop: 70 }}
      />

      <View
        style={{
          padding: 25,
          backgroundColor: Colors.PRIMARY,
          height: "100%",
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            color: Colors.WHITE,
            fontFamily: "outfit-bold",
          }}
        >
          Welcome to TP Academy
        </Text>

        <Text
          style={{
            fontSize: 20,
            color: Colors.WHITE,
            marginTop: 20,
            textAlign: "center",
            fontFamily: "outfit",
          }}
        >
          Discover smarter learning with Course Generated AI! 🚀✨
        </Text>

        {/* Explore Now */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/signIn")}
        >
          <Text style={[styles.buttonText, { color: Colors.PRIMARY }]}>
            Explore Now
          </Text>
        </TouchableOpacity>

        {/* Sign Up */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: Colors.PRIMARY,
              borderWidth: 1,
              borderColor: Colors.WHITE,
            },
          ]}
          onPress={() => router.push("/auth/signUp")}
        >
          <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
            Don't have an account? Sign up now!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 17,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "outfit",
  },
});

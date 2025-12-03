// @ts-nocheck
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import Colors from "../constant/Colors";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { UserDetailContext } from "@/context/UserDetailContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);

  const [checkingAuth, setCheckingAuth] = useState(true);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (checkingAuth) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Landing Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={require("./../assets/images/landing.png")}
            style={styles.landingImage}
            resizeMode="contain"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.15)", "transparent"]}
            style={styles.imageOverlay}
          />
        </View>

        {/* Content */}
        <LinearGradient
          colors={[Colors.PRIMARY, "#3A7BFF"]}
          start={[0, 0]}
          end={[0, 1]}
          style={styles.contentWrapper}
        >
          <Text style={styles.title}>Welcome to TP Academy</Text>
          <Text style={styles.subtitle}>
            Discover smarter learning with Course Generated AI! 🚀✨
          </Text>

          {/* Explore Now */}
          <TouchableOpacity
            style={styles.buttonWhite}
            onPress={() => router.push("/auth/signIn")}
          >
            <Text style={styles.buttonWhiteText}>Explore Now</Text>
            <Ionicons
              name="arrow-forward-sharp"
              size={40}
              color={Colors.PRIMARY}
            />
          </TouchableOpacity>

          {/* Sign Up */}
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => router.push("/auth/signUp")}
          >
            <Text style={styles.buttonPrimaryText}>
              Don't Have An Account Yet? Sign Up Here
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  imageWrapper: {
    width: width,
    height: height * 0.45,
    position: "relative",
  },
  landingImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  contentWrapper: {
    flex: 1,
    padding: 30,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: Colors.WHITE,
    marginTop: 20,
    lineHeight: 26,
    fontFamily: "outfit",
  },
  buttonWhite: {
    paddingVertical: 17,
    backgroundColor: Colors.WHITE,
    marginTop: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonWhiteText: {
    fontSize: 20,
    textAlign: "center",
    color: Colors.PRIMARY,
    fontFamily: "outfit",
    margin: 7,
  },

  buttonPrimary: {
    paddingVertical: 17,
    backgroundColor: Colors.PRIMARY,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.WHITE,
  },

  buttonPrimaryText: {
    fontSize: 20,
    textAlign: "center",
    color: Colors.WHITE,
    fontFamily: "outfit",
    margin: 5,
  },
});

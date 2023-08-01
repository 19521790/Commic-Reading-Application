import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useState } from "react";

import { Font } from "../../variable/Font";
import Circle from "../AllScreen/Circle";
import NewStatus from "../AllScreen/NewStatus";
import HotStatus from "../AllScreen/HotStatus";
import SaveStatus from "../AllScreen/SaveStatus";
import {
  EXPO_PUBLIC_API_AWS,
  EXPO_PUBLIC_API_URL,
} from "../../variable/constants";
export default function BannerHome({ navigation }) {
  const [data, set_data] = useState([]);
  const server = EXPO_PUBLIC_API_URL;
  const serverAWS = EXPO_PUBLIC_API_AWS;
  useEffect(() => {
    let check = true;
    axios.get(server + "/manga/random").then((res) => {
      if (check) {
        set_data(res.data[0][0]);
      }
    });
    return () => (check = false);
  }, []);
  let Genre = "";
  if (data.Genre) {
    const dataGenre = data.Genre.split(",");
    Genre = dataGenre[dataGenre.length - 1];
  }

  function description() {
    if (data.Save) {
      return <SaveStatus save={data.Save} />;
    }
    if (data.New) {
      return <NewStatus status={data.Status} />;
    }
    if (data.Hot) {
      return <HotStatus />;
    }
  }

  return (
    <Pressable
      style={styles.banner}
      onPress={() =>
        navigation.navigate("MangaScreen", {
          idManga: data.idManga,
        })
      }
    >
      <Image
        style={styles.bannerImg}
        source={{ uri: serverAWS + data.ImageAPI }}
      />
      <LinearGradient
        // Background Linear Gradient
        colors={["rgba(255, 255, 255, 0)", "#403f3f", "#050505"]}
        style={[styles.linear]}
      >
        {description()}
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
        >
          <Text style={Font.base_description}>{Genre}</Text>
          <Circle />
          <Text style={Font.base_description}>{data.Status}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  //banner màn hình chính
  banner: {
    width: "100%",
    height: 400,
    backgroundColor: "white",
  },
  //imgbackground của banner
  bannerImg: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  linear: {
    paddingTop: 60,
    width: "100%",
    height: 150,
    position: "absolute",
    bottom: 0,
    opacity: 0.8,
    zIndex: 2,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

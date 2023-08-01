import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { Color } from "../../variable/Color";

import { Font } from "../../variable/Font";

import { LinearGradient } from "expo-linear-gradient";
import Circle from "../AllScreen/Circle";
import BorderTags from "../AllScreen/BorderTags";
import { EXPO_PUBLIC_API_AWS } from "../../variable/constants";

function BigManga(props) {
  const {
    status,
    count_chapter,
    scroll_Pallax,
    index,
    imageAPI,
    data_status,
    idManga,
    navigation,
  } = props;
  // const { index, scroll_Pallax, status, status, count_chapter } = props;

  const translation = scroll_Pallax.interpolate({
    inputRange: [(index - 1) * 350, index * 350, (index + 1) * 350],
    outputRange: [-60, 0, 60],
    extrapolate: "clamp",
  });
  const serverAWS = EXPO_PUBLIC_API_AWS;
  return (
    <Pressable
      style={styles.viewManga}
      onPress={() =>
        navigation.navigate("MangaScreen", {
          idManga: idManga,
        })
      }
    >
      <View style={styles.cover_manga}>
        <Animated.Image
          style={[styles.manga, { transform: [{ translateX: translation }] }]}
          source={{ uri: serverAWS + imageAPI }}
        />
      </View>

      <LinearGradient
        // Background Linear Gradient
        colors={["rgba(255, 255, 255, 0)", "#403f3f", "#050505"]}
        style={[styles.linear]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={[Font.base_description]}>{count_chapter} Chapters</Text>
          <Circle />
          <Text style={[Font.base_description]}>{status}</Text>
        </View>
        <BorderTags data={data_status} status={status} />
      </LinearGradient>
    </Pressable>
  );
}

//style sheet
const styles = StyleSheet.create({
  linear: {
    paddingTop: 60,
    width: 320,
    height: 150,
    position: "absolute",
    bottom: 0,
    opacity: 0.8,
    zIndex: 2,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  viewManga: {
    height: 450,
    width: 350,
    backgroundColor: Color.defaultColor,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  cover_manga: {
    width: 320,
    height: 450,
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 20,
  },
  manga: {
    height: 450,
    width: 380,
    resizeMode: "cover",
  },
  text_inside: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    height: 100,

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  status_text: {
    marginTop: 8,
    paddingHorizontal: 3,
    borderColor: Color.baseColor,
    borderRadius: 5,
    borderWidth: 1,
    color: "black",
    fontWeight: "700",
  },
});

export default BigManga;

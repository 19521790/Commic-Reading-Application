import React, { useState } from "react";
import { Text, View, Image, Pressable, StyleSheet } from "react-native";
import { Color } from "../../variable/Color";

import { Font } from "../../variable/Font";
import {
  EXPO_PUBLIC_API_AWS,
  EXPO_PUBLIC_API_URL,
} from "../../variable/constants";
const server = EXPO_PUBLIC_API_URL;
const serverAWS = EXPO_PUBLIC_API_AWS;
function TrendingTag({ idManga, image, view, index, navigation }) {
  return (
    <Pressable
      style={styles.viewManga}
      onPress={() => {
        navigation.navigate("MangaScreen", { idManga: idManga });
      }}
    >
      <Image style={styles.manga} source={{ uri: serverAWS + image }}></Image>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={[Font.title]}>{index}</Text>
        <Text style={{ fontSize: 23, color: Color.gray, marginBottom: 3 }}>
          {" "}
          |{" "}
        </Text>
        <Text style={[Font.description]}>
          {Math.round(view / 100) / 10}K reads
        </Text>
      </View>
    </Pressable>
  );
}

//style sheet
const styles = StyleSheet.create({
  //view bọc ngoài thumbnail của manga
  viewManga: {
    height: 200,
    width: 155,
    paddingLeft: 15,

    borderRadius: 10,
    marginTop: 10,
  },
  //thumbnail của manga trong list
  manga: {
    height: 200,
    width: 140,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  //title của manga
  description: {
    marginLeft: 5,
    fontSize: 15,
    fontWeight: "700",
  },
});

export default TrendingTag;

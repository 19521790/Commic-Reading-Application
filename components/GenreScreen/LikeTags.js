import React, { useState } from "react";
import { Text, View, Image, Pressable, StyleSheet } from "react-native";
import { Color } from "../../variable/Color";

import { Font } from "../../variable/Font";

import dateFormat from "dateformat";
import NewStatus from "../AllScreen/NewStatus";
import HotStatus from "../AllScreen/HotStatus";
import SaveStatus from "../AllScreen/SaveStatus";
import Circle from "../AllScreen/Circle";
import { EXPO_PUBLIC_API_AWS } from "../../variable/constants";

function LikeTags({ data, index, navigation }) {
  // Basic usage
  const serverAWS = EXPO_PUBLIC_API_AWS;
  return (
    <Pressable
      style={styles.viewManga}
      onPress={() =>
        navigation.navigate("MangaScreen", {
          idManga: data.idManga,
        })
      }
    >
      <Text style={[Font.baseTitle, { marginTop: 10 }]}>{index}</Text>
      <Image style={styles.manga} source={{ uri: serverAWS + data.ImageAPI }} />

      <View style={{ justifyContent: "center", width: 160 }}>
        <Text style={[Font.baseTitle, { marginTop: 10 }]}>{data.Name}</Text>
        <Text style={[Font.description, { marginTop: 2 }]}>
          {data.Chapter} chapters
        </Text>
        <Text style={[Font.description, { marginTop: 2 }]}>
          {data.Likes >= 0 && data.Likes + " likes"}
          {data.Subscribe >= 0 && data.Subscribe + " subscribes"}
        </Text>
      </View>
    </Pressable>
  );
}

//style sheet
const styles = StyleSheet.create({
  //view bọc ngoài thumbnail của manga
  viewManga: {
    height: 170,
    width: 350,
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
    paddingLeft: 20,
    marginTop: 10,
    backgroundColor: Color.baseColor,
  },
  //thumbnail của manga trong list
  manga: {
    height: 150,
    width: 100,
    resizeMode: "cover",
    borderRadius: 10,
    marginHorizontal: 15,
  },
  //title của manga
  containerDescription: { flexDirection: "row", alignItems: "center" },
});

export default LikeTags;

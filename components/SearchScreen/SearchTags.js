import React, { Component, useEffect } from "react";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import { Color } from "../../variable/Color";
import { Font } from "../../variable/Font";
const server = "http://13.250.45.19:3000";
import Line from "../AllScreen/Line";

function SearchTags({ data, navigation }) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        navigation.navigate("MangaScreen", {
          idManga: data.idManga,
        });
      }}
    >
      <Image
        source={{ uri: server + data.ImageAPI }}
        style={styles.img}
      ></Image>

      <View style={styles.detail}>
        <View>
          <Text style={Font.title}>{data.Name}</Text>
          <Text style={Font.description}>{data.Chapter} chapters</Text>
        </View>
      </View>

      {/* dấu 3 chấm hiện bảng tương tác với manga */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: 380,
    height: 150,

    flexDirection: "row",
    marginLeft: 10,
    marginTop: 10,
  },
  img: {
    height: 120,
    width: 80,
    resizeMode: "cover",
  },
  detail: {
    paddingHorizontal: 15,
    width: 250,
    justifyContent: "center",
    height: "100%",
  },
});

export default SearchTags;

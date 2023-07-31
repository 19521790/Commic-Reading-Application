import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import GenreTag from "./GenreTag";
import axios from "axios";
const server = "http://13.250.45.19:3000";

export default function ExploreCataLog({ data, navigation }) {
  return (
    <View style={styles.genreContainer}>
      {data.map((item) => {
        return (
          <GenreTag
            image={item.ImageAPI}
            name={item.Name}
            key={item.idCategory}
            idCategory={item.idCategory}
            navigation={navigation}
          />
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
});

import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import {
  EXPO_PUBLIC_API_AWS,
  EXPO_PUBLIC_API_URL,
} from "../../variable/constants";
const serverAWS = EXPO_PUBLIC_API_AWS;

function GenreTag({ image, name, navigation, idCategory }) {
  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigation.navigate("GenreScreen", {
          idGenre: idCategory,
          nameGenre: name,
        })
      }
    >
      <Image source={{ uri: serverAWS + image }} style={styles.img}></Image>
      <Text style={styles.genreTitle} adjustsFontSizeToFit={true}>
        {name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "43%",
    marginBottom: 20,
  },
  img: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: "100%",
    resizeMode: "cover",
    height: 120,
  },

  genreTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
    backgroundColor: "#257F7D",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    height: 40,
  },
});

export default GenreTag;

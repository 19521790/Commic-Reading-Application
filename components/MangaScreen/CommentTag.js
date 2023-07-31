import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const server = "http://13.250.45.19:3000";

function CommentTag({ name, avatar, comment }) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={{ uri: avatar }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
      <Text style={styles.comment}>{comment}</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.date}>Oct 23,2021</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <MaterialCommunityIcons
              name="share-all"
              size={16}
              color="#A8A8A8"
            />
            <Text style={{ color: "#A8A8A8", fontSize: 16, marginLeft: 3 }}>
              0
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <AntDesign name="like2" size={16} color="#A8A8A8" />
            <Text style={{ color: "#A8A8A8", fontSize: 16, marginLeft: 3 }}>
              0
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#252525",
    padding: 15,
    marginBottom: 10,
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    height: 50,
    width: 50,
    backgroundColor: "#787878",
    borderRadius: 50,
  },
  name: {
    color: "#E3E3E3",
  },
  chapter: {
    color: "#787878",
  },
  comment: {
    color: "#E3E3E3",
    marginBottom: 10,
  },
  date: {
    color: "#A8A8A8",
  },
});

export default CommentTag;

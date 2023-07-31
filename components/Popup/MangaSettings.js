import React, { useState, useEffect, Component } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
const server = "http://13.250.45.19:3000";
import { Color } from "../../variable/Color";
import Line from "../AllScreen/Line";
import { connect } from "react-redux";
import axios from "axios";

class MangaSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowing: false,
      like: false,
      subscribe: false,
      readlater: false,
      idManga: undefined,
    };
  }
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):

    if (this.props.idManga !== prevProps.idManga) {
      axios
        .get(
          server + "/like/check/" + this.props.idUser + "&" + this.props.idManga
        )
        .then((res) => {
          if (res.data[0].exist > 0) {
            this.setState({ like: true });
          }
        });
      axios
        .get(
          server +
            "/subscribe/check/" +
            this.props.idUser +
            "&" +
            this.props.idManga
        )
        .then((res) => {
          if (res.data[0].exist > 0) {
            this.setState({ subscribe: true });
          }
        });
      axios
        .get(
          server +
            "/read_later/check/" +
            this.props.idUser +
            "&" +
            this.props.idManga
        )
        .then((res) => {
          if (res.data[0].exist > 0) {
            this.setState({ readlater: true });
          }
        });
    }
  }
  likeFunction = () => {
    if (this.props.userlog) {
      if (this.state.like) {
        this.props.confirmManga("Undo Like?");
      } else {
        axios.post(server + "/like/add", {
          idManga: this.props.idManga,
          idUser: this.props.idUser,
        });
        this.props.successLike("Added to Like", "like");
        this.setState({ like: true });
      }

      this.setState({ isShowing: false });
    } else {
      this.setState({ isShowing: false });
      this.props.showLogin();
    }
  };
  subscribeFunction = () => {
    if (this.props.userlog) {
      if (this.state.subscribe) {
        this.props.confirmManga("Unsubscribe?");
      } else {
        axios.post(server + "/subscribe/add", {
          idManga: this.props.idManga,
          idUser: this.props.idUser,
        });
        this.props.successLike("Added to Subscribe", "subscribe");
        this.setState({ subscribe: true });
      }

      this.setState({ isShowing: false });
    } else {
      this.setState({ isShowing: false });
      this.props.showLogin();
    }
  };
  readlaterFunction = () => {
    if (this.props.userlog) {
      if (this.state.readlater) {
        this.props.confirmManga("Remove this title from Read Later?");
      } else {
        axios.post(server + "/read_later/add", {
          idManga: this.props.idManga,
          idUser: this.props.idUser,
        });
        this.props.successLike("Added to Read Later", "readlater");
        this.setState({ readlater: true });
      }

      this.setState({ isShowing: false });
    } else {
      this.setState({ isShowing: false });
      this.props.showLogin();
    }
  };
  render() {
    return (
      <View>
        <Modal visible={this.state.isShowing} animationType="slide" transparent>
          <Pressable
            style={{ flex: 3 }}
            onPress={() => this.setState({ isShowing: false })}
          />

          <View style={styles.container}>
            <Pressable
              onPress={() => this.setState({ isShowing: false })}
              style={{ position: "absolute", top: 20, right: 20 }}
            >
              <AntDesign name="closecircle" size={24} color={Color.gray} />
            </Pressable>
            <View style={styles.headerContainer}>
              <Image
                source={{ uri: server + this.props.image }}
                style={{ height: 50, width: 50, resizeMode: "cover" }}
              />
              <Text style={styles.name}>{this.props.name}</Text>
            </View>
            <Line />
            <View style={styles.bodyContainer}>
              <Pressable
                style={styles.row}
                onPress={() => {
                  const data = this.props.data;
                  this.props.navigation.navigate("ChapterScreen", {
                    dataChapter: data,
                    chapterId: data[0].idChapter,
                    chapterName: data[0].Name
                      ? data[0].Name
                      : "Chapter " + data[0].Order,
                    mangaTitle: this.props.name,
                    chapterOrder: data[0].Order,
                    idManga: data[0].manga_idManga,
                    imageAPI: this.props.image,
                  });
                }}
              >
                <MaterialCommunityIcons
                  name="book-open-variant"
                  size={24}
                  color="white"
                />
                <Text style={styles.title}>Read</Text>
              </Pressable>
              <Line />
              <Pressable style={styles.row}>
                <MaterialCommunityIcons
                  name="share-variant"
                  size={24}
                  color="white"
                />
                <Text style={styles.title}>Share</Text>
              </Pressable>
              <Line />
              <Pressable
                style={styles.row}
                onPress={() => {
                  this.readlaterFunction();
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-plus"
                  size={24}
                  color="white"
                />
                <Text style={styles.title}>
                  {this.state.readlater
                    ? "Remove From Read Later"
                    : "Add to Read Later"}
                </Text>
              </Pressable>
              <Line />
              <Pressable
                style={styles.row}
                onPress={() => {
                  this.likeFunction();
                }}
              >
                <AntDesign name="like1" size={24} color="white" />
                <Text style={styles.title}>
                  {this.state.like ? "Undo Like" : "Like"}
                </Text>
              </Pressable>
              <Line />
              <Pressable style={styles.row}>
                <AntDesign name="dislike1" size={24} color="white" />
                <Text style={styles.title}>Do not Recommend</Text>
              </Pressable>
              <Line />
              <Pressable
                style={styles.row}
                onPress={() => {
                  this.subscribeFunction();
                }}
              >
                <FontAwesome name="bell-o" size={24} color="white" />
                <Text style={styles.title}>
                  {this.state.subscribe ? "Unsubscribe" : "Subscribe"}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    backgroundColor: "#242422",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  row: {
    display: "flex",
    alignContent: "center",
    flexDirection: "row",
    paddingHorizontal: 15,

    marginVertical: 18,
  },
  title: {
    color: "white",
    fontSize: 20,
    marginLeft: 30,
  },
  name: {
    color: "white",
    fontSize: 20,
    marginLeft: 30,
    marginVertical: 20,
  },
  headerContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: Color.onBaseColor,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default MangaSetting;

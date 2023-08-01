import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import CommentTag from "./CommentTag";
import { useRef } from "react";
import axios from "axios";

import { getdata } from "../../InteractServer/GetUserSqlite";
import { EXPO_PUBLIC_API_URL } from "../../variable/constants";
function CommentScreen(props) {
  const server = EXPO_PUBLIC_API_URL;
  const [show, setShow] = useState(false);
  const [comment, set_comment] = useState("");
  const [data, set_data] = useState([]);
  const [userName, set_userName] = useState();
  const [userImage, set_userImage] = useState();
  useEffect(() => {
    axios.get(server + "/comment/get/" + props.idManga).then((res) => {
      set_data(res.data);
    });
  }, [props.idManga]);

  const idUser = useSelector((state) => state.idUser);
  const userlog = useSelector((state) => state.userlog);
  useEffect(() => {
    if (userlog) {
      getdata().then((res) => {
        set_userName(res.UserName);
        set_userImage(res.UserImage);
      });
    }
  }, [userlog]);
  function commentPush() {
    if (userlog) {
      const copy_data = data.slice();
      axios.post(server + "/comment/add", {
        idUser: idUser,
        idManga: props.idManga,
        comment: comment,
      });

      copy_data.push({
        content: comment,
        Name: userName,
        Image: userImage,
      });
      set_data(copy_data);
      set_comment("");
    } else {
      props.showModal();
    }
  }

  return (
    <View>
      <Pressable onPress={() => setShow(true)}>
        <MaterialCommunityIcons
          name="comment-processing-outline"
          size={20}
          color="#e6e6e6"
        />
      </Pressable>
      <Modal visible={show}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={() => setShow(false)}>
              <AntDesign name="closecircle" size={30} color="#8E8E93" />
            </Pressable>
            <Text style={styles.commentCount}>{data.length} comments</Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 15,
            }}
          >
            <Text style={{ color: "#727274" }}>
              Comments ae sorted from newest to oldest
            </Text>
          </View>
          {data.map((item, index) => {
            return (
              <CommentTag
                key={index}
                name={item.Name}
                avatar={item.Image}
                comment={item.content}
                count={data.length}
              />
            );
          })}
        </ScrollView>
        <View style={styles.bottom}>
          <TextInput
            style={styles.addComment}
            placeholder="Add your comment"
            placeholderTextColor="#939393"
            value={comment}
            onChangeText={set_comment}
          />
          <Pressable
            onPress={() => {
              commentPush();
            }}
          >
            <Ionicons name="ios-paper-plane" size={30} color="#686868" />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C1C1E",
  },
  header: {
    backgroundColor: "#272727",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  commentCount: {
    color: "white",
    fontSize: 20,
    marginLeft: 20,
  },
  bottom: {
    backgroundColor: "#272727",
    height: 80,
    display: "flex",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#414141",
  },
  addCommentContainer: {
    display: "flex",
    justifyContent: "center",
  },
  addComment: {
    color: "#939393",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#414141",
    borderRadius: 3,
    width: 300,
    height: 60,
    paddingLeft: 20,
  },
});

export default CommentScreen;

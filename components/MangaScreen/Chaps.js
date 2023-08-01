import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Color } from "../../variable/Color";
import { Font } from "../../variable/Font";

import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { SetPurchase } from "../../redux/actions";
import {
  EXPO_PUBLIC_API_AWS,
  EXPO_PUBLIC_API_URL,
} from "../../variable/constants";

export default function Chaps(props) {
  const {
    navigation,
    reverseBoolean,
    mangaTitle,
    mangaImage,
    showLogin,
    confirmPurchase,
  } = props;
  const server = EXPO_PUBLIC_API_URL;
  const serverAWS = EXPO_PUBLIC_API_AWS;
  const data = props.data[0];
  const [reverse_data, set_reverse_data] = useState([]);
  const [map_data, set_map_data] = useState([]);
  const user_payData = useSelector((state) => state.purchase);

  const idUser = useSelector((state) => state.idUser);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userlog) {
      axios.get(server + "/money/get/" + idUser).then((res) => {
        const final_data = [];
        res.data.map((item) => {
          final_data.push(item.chapter_idChapter);
        });
        dispatch(SetPurchase(final_data));
      });
    }
  }, []);

  useEffect(() => {
    if (data) {
      set_map_data(data);
      set_reverse_data(data.slice().reverse());
    }
  }, [data]);
  const userlog = useSelector((state) => state.userlog);
  useEffect(() => {
    if (reverseBoolean) {
      set_map_data(reverse_data);
    } else {
      set_map_data(data);
    }
  }, [reverseBoolean]);
  function navigate(item) {
    if (item.Free > 0 || user_payData.includes(item.idChapter)) {
      navigation.navigate("ChapterScreen", {
        dataChapter: data,
        chapterId: item.idChapter,
        chapterName: item.Name ? item.Name : "Chapter " + item.Order,
        mangaTitle: mangaTitle,
        chapterOrder: item.Order,
        idManga: item.manga_idManga,
        imageAPI: mangaImage,
      });
    } else {
      if (!userlog) {
        showLogin();
      } else {
        confirmPurchase(
          "Purchase this chapter for " + item.Pay + " coin?",
          item.Pay,
          item.idChapter
        );
      }
    }
  }
  function itemPay(item) {
    if (item.Pay > 0 && !user_payData.includes(item.idChapter)) {
      return <FontAwesome name="lock" size={24} color="white" />;
    }
  }
  return (
    <>
      {map_data &&
        map_data.map((item) => {
          return (
            <Pressable
              key={item.idChapter}
              onPress={() => {
                navigate(item);
              }}
            >
              <View style={styles.container}>
                <Image
                  style={styles.image}
                  source={{ uri: serverAWS + item.ImageAPI }}
                />
                <View style={styles.DetailContainer}>
                  <Text style={Font.baseTitle}>
                    Chapter {item.Order}
                    {item.Name && ": "}
                    {item.Name}
                  </Text>
                  <Text style={Font.baseTitle}>{item.status}</Text>
                </View>
                {item.Free == 1 && (
                  <MaterialIcons name="money-off" size={24} color="white" />
                )}
                {itemPay(item)}
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                }}
              >
                <View style={styles.line}></View>
              </View>
            </Pressable>
          );
        })}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",

    alignItems: "center",
    marginVertical: 10,
  },

  DetailContainer: {
    marginLeft: 15,
    flexDirection: "row",
    alignItems: "center",
    width: 220,
    paddingRight: 20,
    justifyContent: "space-between",
  },
  image: {
    height: 80,
    width: 100,
    marginLeft: 15,
    borderRadius: 10,
  },
  line: {
    width: 280,
    height: 1,
    backgroundColor: Color.white,
    opacity: 0.1,
  },
});

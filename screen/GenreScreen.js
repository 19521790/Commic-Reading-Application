import React, { useRef, useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Button,
  Pressable,
} from "react-native";

import { Color } from "../variable/Color";
import { Ionicons } from "@expo/vector-icons";

import { Font } from "../variable/Font";
import { Entypo } from "@expo/vector-icons";
import SearchSlide from "../components/SearchScreen/SearchSlide";
import GenreSlide from "../components/GenreScreen/GenreSlide";
import axios from "axios";
const server = "http://13.250.45.19:3000";
import images from "../components/SearchScreen/Banner";
import SingleTabNewRelease from "../components/SearchScreen/SingleTabNewRelease";
import TopLikeTitle from "../components/GenreScreen/TopLikeTitle";

export default function GenreScreen({ route, navigation }) {
  const ref = useRef(new Animated.Value(0)).current;
  const { nameGenre, idGenre } = route.params;
  const translation = ref.interpolate({
    inputRange: [0, 400],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const [top_newTitles, set_topNewTitles] = useState();
  const [top_Subscribe, set_topSubscribe] = useState();
  const [dataSlide, set_dataSlide] = useState([
    {
      key: 1,
      bannerImg: images.banner1,
    },
  ]);
  useEffect(() => {
    axios.get(server + "/genre/" + nameGenre).then((res) => {
      const final_arr = [];
      res.data[0].map((item, index) => {
        if (index < 7) {
          item["key"] = index * 2 + 1;
          final_arr.push(item);
        }
      });
      set_dataSlide(final_arr);
    });
    axios
      .get(server + "/genre/" + nameGenre + "/top_like_title")
      .then((res) => {
        set_topNewTitles(res.data[0]);
      });
    axios
      .get(server + "/genre/" + nameGenre + "/top_subscribe_title")
      .then((res) => {
        set_topSubscribe(res.data[0]);
      });
  }, []);

  return (
    <Animated.ScrollView
      style={{ backgroundColor: Color.defaultColor }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: ref } } }],
        { useNativeDriver: true }
      )}
    >
      {/* thanh control chứa comment, điều hướng */}
      <Animated.View
        style={[
          styles.control_background,
          { transform: [{ translateY: ref }], opacity: translation },
        ]}
      />
      <Animated.View
        style={[styles.control, { transform: [{ translateY: ref }] }]}
      >
        <Pressable
          onPress={() => navigation.pop()}
          style={{
            position: "absolute",
            left: 20,
            top: 25,

            zIndex: 10,
          }}
        >
          <Ionicons name="chevron-back" size={24} color={Color.white} />
        </Pressable>
        <Animated.View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            height: 50,
            marginBottom: 10,
          }}
        >
          <Pressable
            style={{
              flexDirection: "row",
              padding: 5,
              borderRadius: 10,
            }}
          >
            <Text style={Font.baseTitle} numberOfLines={1}>
              {nameGenre}
            </Text>
            <Entypo name="chevron-down" size={24} color="white" />
          </Pressable>
        </Animated.View>
      </Animated.View>

      <View style={{ flex: 1 }}>
        <GenreSlide
          data={dataSlide}
          nameGenre={nameGenre}
          navigation={navigation}
        />
        <Text style={[Font.title, { marginTop: 50 }]}>Top Liked Titles</Text>
        <TopLikeTitle data={top_newTitles} navigation={navigation} />
        <Text style={[Font.title, { marginTop: 20 }]}>
          Top Subscribe Titles
        </Text>
        <TopLikeTitle data={top_Subscribe} navigation={navigation} />
      </View>
    </Animated.ScrollView>
  );
}
const styles = StyleSheet.create({
  control: {
    paddingTop: 30,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 0,
    height: 60,
    width: "100%",
    zIndex: 10,
  },
  control_background: {
    height: 60,
    backgroundColor: Color.mangaColor,
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 5,
  },
});

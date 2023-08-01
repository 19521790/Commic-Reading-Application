import React, { Component, useEffect } from "react";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import { Font } from "../../variable/Font";

import dateFormat from "dateformat";
import { useState } from "react";
import { useRef } from "react";
import { useMemo } from "react";
import ConfirmManga from "../Popup/ConfirmManga";
import { EXPO_PUBLIC_API_AWS } from "../../variable/constants";
function ResumeList({ data_resume, navigation, hideReadingHistory }) {
  const serverAWS = EXPO_PUBLIC_API_AWS;
  const [distance_time, set_distance_time] = useState();

  useEffect(() => {
    getday();
  }, [data_resume]);

  const refMinutes = useRef(1);

  const refSecond = useRef();
  function getday() {
    const date_now = new Date(Date.now());
    const date_last_read = new Date(data_resume.time_read);

    if (date_now.getDate() - date_last_read.getDate() > 0) {
      set_distance_time(date_now.getDate() - date_last_read.getDate() + " day");
    } else if (date_now.getHours() - date_last_read.getHours() > 0) {
      set_distance_time(
        date_now.getHours() - date_last_read.getHours() + " hr"
      );
    } else {
      const now_minutes = date_now.getMinutes();
      const last_minutes = date_last_read.getMinutes();
      const now_second = date_now.getSeconds();
      const last_second = date_last_read.getSeconds();
      const distance_second =
        now_minutes * 60 + now_second - (last_minutes * 60 + last_second);
      if (distance_second > 60) {
        refMinutes.current = now_minutes - last_minutes;

        set_distance_time(refMinutes.current + " min");
      } else {
        refSecond.current = distance_second;
        set_distance_time(refSecond.current + " sec");
      }
    }
  }

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        hideReadingHistory();
        navigation.navigate("ChapterScreen", {
          // dataChapter: data,
          chapterId: data_resume.chapterId,
          chapterName: data_resume.chapterName
            ? data_resume.chapterName
            : "Chapter " + data_resume.chapterOrder,
          mangaTitle: data_resume.mangaTitle,
          chapterOrder: data_resume.chapterOrder,
          idManga: data_resume.idManga,
          imageAPI: data_resume.image_chapter,
          percent_read: data_resume.percent_read,
          total_height: data_resume.total_height,
        });
      }}
    >
      <Image
        source={{ uri: serverAWS + data_resume.image_chapter }}
        style={styles.img}
      ></Image>

      <View style={styles.detail}>
        <View>
          <Text style={Font.title}>{data_resume.mangaTitle}</Text>
          <Text style={Font.description} numberOfLines={1}>
            {data_resume.chapterName
              ? data_resume.chapterName
              : "Chapter " + data_resume.chapterOrder}
          </Text>
        </View>

        <Text style={[Font.description, { marginTop: 10 }]}>
          Last read {distance_time} ago
        </Text>
      </View>

      {/* dấu 3 chấm hiện bảng tương tác với manga */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 10,
    width: 350,
    height: 150,
    paddingHorizontal: 15,
    flexDirection: "row",
    marginLeft: 10,
  },
  img: {
    height: 120,
    width: 80,
    resizeMode: "cover",
  },
  detail: {
    paddingHorizontal: 15,
    width: 250,
    justifyContent: "space-between",
    height: 110,
  },
});

export default ResumeList;

import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { View, Text, Animated } from "react-native";
import { Font } from "../../variable/Font";

import BigManga from "./BigManga";
import { EXPO_PUBLIC_API_URL } from "../../variable/constants";

export default function ParallaxSlide({ navigation }) {
  const server = EXPO_PUBLIC_API_URL;
  const scroll_Pallax = useRef(new Animated.Value(0)).current;
  const [data, set_data] = useState([]);

  useEffect(() => {
    let check = true;
    axios.get(server + "/list/" + "new_noteworthy").then((res) => {
      if (check) {
        set_data(res.data[0]);
      }
    });
    return () => (check = false);
  }, []);

  return (
    <View>
      <Text style={[Font.title, { marginTop: 20, marginLeft: 20 }]}>
        New & Noteworthy
      </Text>

      <Animated.ScrollView
        horizontal
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scroll_Pallax } } }],
          { useNativeDriver: true }
        )}
      >
        {data.map((item, index) => {
          const { Save, Hot, New } = item;

          let data_status = [];
          if (Save) {
            data_status.push(Save);
          } else if (Hot && New) {
            if (Hot) {
              data_status.push("New");
              data_status.push("Hot");
            } else {
              data_status.push("New");
            }
          } else if (Hot) {
            data_status.push("Hot");
          }

          return (
            <BigManga
              key={item.idManga}
              imageAPI={item.ImageAPI}
              count_chapter={item.Chapter}
              status={item.Status}
              idManga={item.idManga}
              data_status={data_status}
              scroll_Pallax={scroll_Pallax}
              index={index}
              navigation={navigation}
            />
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

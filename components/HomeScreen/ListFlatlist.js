import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { View, Text, ScrollView } from "react-native";

import MangaTag from "../MangaList/MangaTag";
import {
  EXPO_PUBLIC_API_AWS,
  EXPO_PUBLIC_API_URL,
} from "../../variable/constants";

export default function ListFlatlist({ navigation, type }) {
  const server = EXPO_PUBLIC_API_URL;
  const [data, set_data] = useState([]);
  useEffect(() => {
    let check = true;
    axios.get(server + "/list/" + type).then((res) => {
      if (check) {
        set_data(res.data[0].slice(0, 8));
      }
    });
    return () => (check = false);
  }, []);

  return (
    <ScrollView horizontal={true}>
      {data.map((item) => {
        return (
          <MangaTag
            key={item.idManga}
            idManga={item.idManga}
            image_api={item.ImageAPI}
            first_line={item.New ? item.New + " new chapters" : null}
            second_line={item.Status}
            new={item.New}
            hot={item.Hot}
            save={item.Save}
            navigation={navigation}
          />
        );
      })}
    </ScrollView>
  );
}

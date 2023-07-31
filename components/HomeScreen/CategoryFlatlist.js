import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
const server = "http://13.250.45.19:3000";
import MangaTag from "../MangaList/MangaTag";

export default function CategoryFlatlist({ navigation, type, other }) {
  const [data, set_data] = useState([]);
  useEffect(() => {
    let check = true;
    axios.get(server + "/genre/" + type + "/" + other).then((res) => {
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
            first_line={item.Chapter + " chapters"}
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

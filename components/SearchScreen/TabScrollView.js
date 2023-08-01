import axios from "axios";
import * as React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { View, useWindowDimensions, ScrollView, Text } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import { Color } from "../../variable/Color";

import SingleTabScrollView from "./SingleTabScrollView";
import {
  EXPO_PUBLIC_API_AWS,
  EXPO_PUBLIC_API_URL,
} from "../../variable/constants";
const serverAWS = EXPO_PUBLIC_API_AWS;
const server = EXPO_PUBLIC_API_URL;
export default function TabScrollView({ navigation }) {
  const layout = useWindowDimensions();
  const [data, set_data] = useState(new Object());

  useEffect(() => {
    let check = true;
    axios.get(server + "/genre").then((res) => {
      if (check) {
        const temp = new Object();
        res.data.map((item) => {
          axios
            .get(server + "/genre/" + item.Name + "/highlight_title")
            .then((response) => {
              if (check) {
                temp[item.Name] = response.data[0];
                if (Object.keys(temp).length == 6) {
                  set_data(temp);
                }
              }
            });
        });
      }
    });
    return () => (check = false);
  }, []);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "Action", title: "Action" },
    { key: "Comedy", title: "Comedy" },
    { key: "Romance", title: "Romance" },
    { key: "Horror", title: "Horror" },
    { key: "Fantasy", title: "Fantasy" },
    { key: "Slice of life", title: "Slice of life" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "Action":
        return (
          <SingleTabScrollView data={data.Action} navigation={navigation} />
        );
      case "Comedy":
        return (
          <SingleTabScrollView data={data.Comedy} navigation={navigation} />
        );
      case "Romance":
        return (
          <SingleTabScrollView data={data.Romance} navigation={navigation} />
        );
      case "Horror":
        return (
          <SingleTabScrollView data={data.Horror} navigation={navigation} />
        );
      case "Fantasy":
        return (
          <SingleTabScrollView data={data.Fantasy} navigation={navigation} />
        );
      case "Slice of life":
        return (
          <SingleTabScrollView
            data={data["Slice of life"]}
            navigation={navigation}
          />
        );
      default:
        return null;
    }
  };
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color, fontSize: 16 }}>{route.title}</Text>
      )}
      scrollEnabled
      tabStyle={{ width: 100 }}
      style={{
        backgroundColor: Color.baseColor,
        borderBottomColor: "#aba7a7",
        borderBottomWidth: 0.5,
      }}
      indicatorStyle={{ backgroundColor: "white" }}
    />
  );
  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

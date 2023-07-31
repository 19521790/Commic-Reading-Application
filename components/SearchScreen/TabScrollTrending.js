import axios from "axios";
import * as React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { View, useWindowDimensions, ScrollView, Text } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import { Color } from "../../variable/Color";
const server = "http://13.250.45.19:3000";
import SingleTabTrending from "./SingleTabTrending";

export default function TabScrollTrending({ navigation }) {
  const layout = useWindowDimensions();
  const [data, set_data] = useState(new Object());

  useEffect(() => {
    let check = true;
    axios.get(server + "/genre").then((res) => {
      if (check) {
        const temp = new Object();
        res.data.map((item) => {
          axios
            .get(server + "/genre/" + item.Name + "/trending_today")
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
        return <SingleTabTrending data={data.Action} navigation={navigation} />;
      case "Comedy":
        return <SingleTabTrending data={data.Comedy} navigation={navigation} />;
      case "Romance":
        return (
          <SingleTabTrending data={data.Romance} navigation={navigation} />
        );
      case "Horror":
        return <SingleTabTrending data={data.Horror} navigation={navigation} />;
      case "Fantasy":
        return (
          <SingleTabTrending data={data.Fantasy} navigation={navigation} />
        );
      case "Slice of life":
        return (
          <SingleTabTrending
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

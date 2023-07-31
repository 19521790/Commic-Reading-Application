import React, { useRef, useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Animated,
  Pressable,
} from "react-native";

import { Color } from "../variable/Color";
import { Font } from "../variable/Font";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import ExploreCataLog from "../components/HomeScreen/ExploreCataLog";
import CategoryFlatlist from "../components/HomeScreen/CategoryFlatlist";
import ListFlatlist from "../components/HomeScreen/ListFlatlist";
import { useEffect } from "react";
import axios from "axios";
const server = "http://13.250.45.19:3000";
import BannerHome from "../components/HomeScreen/BannerHome";
import ResumeTag from "../components/MangaList/ResumeTag";
import { useSelector, useDispatch } from "react-redux";
import ResumeReading from "../components/HomeScreen/ResumeReading";
import { getResume } from "../InteractServer/ResumeSave";
import {
  InitialResume,
  Login,
  SetIdUser,
  SetResumeReading,
} from "../redux/actions";
import { getdata } from "../InteractServer/GetUserSqlite";
import { Entypo } from "@expo/vector-icons";
import ReadingHistory from "../components/Popup/ReadingHistory";
//màn hình HomeScreen
export default function HomeScreen({ navigation }) {
  const opacity_head = useRef(new Animated.Value(0)).current;
  const translation = opacity_head.interpolate({
    inputRange: [50, 300],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const [data, set_data] = useState([]);
  const dispatch = useDispatch();
  const refReadingHistory = useRef();

  useEffect(() => {
    let break_get = true;
    axios.get(server + "/genre").then((res) => {
      if (break_get) {
        set_data(res.data);
      }
    });

    getdata().then((res) => {
      if (break_get) {
        if (res) {
          dispatch(SetIdUser(res.UserId));

          dispatch(Login());
          axios
            .get(server + "/resume_reading/user/" + res.UserId)
            .then((res) => {
              if (break_get) {
                dispatch(InitialResume(res.data[0]));
              }
            });
        } else {
          getResume().then((res) => {
            if (break_get) {
              dispatch(InitialResume(res));
            }
          });
        }
      }
    });

    return () => (break_get = false);
  }, []);
  const data_resume = useSelector((state) => state.resume);
  const userlog = useSelector((state) => state.userlog);
  const idUser = useSelector((state) => state.idUser);
  const setDataResumePopup = () => {
    refReadingHistory.current.setModalVisible(true, "Reading History");
    if (userlog) {
      axios.get(server + "/resume_reading/user/" + idUser).then((res) => {
        refReadingHistory.current.setState({ data: res.data[0] });
      });
    } else {
      getResume().then((res) => {
        refReadingHistory.current.setState({ data: res });
      });
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.header, { opacity: translation }]}
      ></Animated.View>

      <Text
        style={[
          Font.homeTitle,
          { position: "absolute", top: 25, left: 20, zIndex: 10 },
        ]}
      >
        IKNR
      </Text>

      <Animated.ScrollView
        style={styles.container}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: opacity_head } } }],
          { useNativeDriver: true }
        )}
      >
        {/*banner to trên cùng*/}
        <BannerHome navigation={navigation} />

        {/*resume reading*/}
        {data_resume.length > 0 && (
          <View style={[styles.list]}>
            <View style={styles.titleResume}>
              <Text style={[Font.homeTitle, { padding: 20 }]}>
                Resume Reading
              </Text>
              <Pressable onPress={() => setDataResumePopup()}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={Font.baseTitle}>See All</Text>
                  <Entypo
                    name="chevron-right"
                    size={18}
                    color="white"
                    style={{ marginTop: 2 }}
                  />
                </View>
              </Pressable>
            </View>
            <ResumeReading navigation={navigation} />
          </View>
        )}
        {/* New titles for you */}
        <View style={styles.action_list}>
          <Text style={[Font.homeTitle, { padding: 15, marginTop: 15 }]}>
            New Titles For You
          </Text>
          <ListFlatlist navigation={navigation} type="new_title" />
        </View>
        {/* Top pick for you */}
        <View style={styles.action_list}>
          <Text style={[Font.homeTitle, { padding: 15 }]}>
            Top Picks For You
          </Text>
          <ListFlatlist navigation={navigation} type="top_pick" />
        </View>
        {data.map((item, index) => {
          return (
            <View key={index} style={styles.action_list}>
              <Text style={[Font.homeTitle, { padding: 15 }]}>
                {item.Name} Titles
              </Text>
              <CategoryFlatlist
                navigation={navigation}
                type={item.Name}
                other=""
              />
            </View>
          );
        })}
        {data.map((item, index) => {
          return (
            <View key={index} style={styles.action_list}>
              <Text style={[Font.homeTitle, { padding: 15 }]}>
                Trending In {item.Name}
              </Text>
              <CategoryFlatlist
                navigation={navigation}
                type={item.Name}
                other="trending"
              />
            </View>
          );
        })}

        <View>
          <Text style={[Font.homeTitle, { padding: 15 }]}>
            Explore INKR Catalog
          </Text>
          <ExploreCataLog data={data} navigation={navigation} />
        </View>
        <ReadingHistory
          ref={refReadingHistory}
          navigation={navigation}
          userlog={userlog}
        />
        <Pressable
          onPress={() => navigation.jumpTo("Search")}
          style={styles.jumpExplore}
        >
          <Text style={Font.title}>Explore More</Text>
        </Pressable>
      </Animated.ScrollView>
    </View>
  );
}

//style sheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.defaultColor,
    marginTop: 0,
    flex: 1,
  },
  header: {
    backgroundColor: Color.baseColor,
    height: 80,
    width: "100%",

    position: "absolute",
    top: 0,
    zIndex: 1,
  },

  //list của một mục truyện tranh
  list: {
    height: 250,
    width: "100%",

    backgroundColor: "black",
  },
  action_list: {
    height: 380,
    width: "100%",
  },
  titleResume: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  jumpExplore: {
    padding: 10,
    marginHorizontal: 20,
    backgroundColor: Color.onBaseColor,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});

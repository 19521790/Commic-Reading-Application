import React, { useRef } from "react";
import { useEffect } from "react";
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  Text,
  Pressable,
} from "react-native";
import { Color } from "../../variable/Color";
const server = "http://13.250.45.19:3000";
import images from "../SearchScreen/Banner";
import { LinearGradient } from "expo-linear-gradient";
import SaveStatus from "../AllScreen/SaveStatus";
import NewStatus from "../AllScreen/NewStatus";
import HotStatus from "../AllScreen/HotStatus";
import { Font } from "../../variable/Font";
import Circle from "../AllScreen/Circle";

const data = [
  {
    key: 1,
    ImageAPI: images.banner1,
  },
  { key: 3, ImageAPI: images.banner2 },
  {
    key: 5,
    ImageAPI: images.banner3,
  },
];

export default function GenreSlide({ data, nameGenre, navigation }) {
  const width = Dimensions.get("window").width;
  const half_width = width / 2;
  const length_data = data.length;
  const first_key = data[0].key;
  const last_key = data[length_data - 1].key;

  const refScrollView = useRef();
  const refAnimatedScroll = useRef(new Animated.Value(width)).current;
  function description(item) {
    if (item.Save) {
      return <SaveStatus save={item.Save} />;
    }
    if (item.New) {
      return <NewStatus status={item.Status} />;
    }
    if (item.Hot) {
      return <HotStatus />;
    }
  }

  function animatedSlide(item, refAnimatedScroll) {
    let translation = null;
    if (item.key == first_key) {
      translation = refAnimatedScroll.interpolate({
        inputRange: [
          half_width * item.key,
          half_width * (item.key + 1),
          half_width * (item.key + 2),
          half_width * (last_key + 2),
          half_width * (last_key + 3),
        ],
        outputRange: [8, 16, 8, 8, 16],
        extrapolate: "clamp",
      });
    } else if (item.key == last_key) {
      translation = refAnimatedScroll.interpolate({
        inputRange: [
          0,
          half_width,
          half_width * item.key,
          half_width * (item.key + 1),
          half_width * (item.key + 2),
        ],
        outputRange: [16, 8, 8, 16, 8],
        extrapolate: "clamp",
      });
    } else {
      translation = refAnimatedScroll.interpolate({
        inputRange: [
          half_width * item.key,
          half_width * (item.key + 1),
          half_width * (item.key + 2),
        ],
        outputRange: [8, 16, 8],
        extrapolate: "clamp",
      });
    }
    const backgroundref = translation.interpolate({
      inputRange: [8, 16],
      outputRange: [Color.gray, "black"],
    });
    return (
      <Animated.View
        key={item.key}
        style={[
          styles.circle,
          { width: translation, backgroundColor: backgroundref },
        ]}
      ></Animated.View>
    );
  }

  return (
    <View>
      <Animated.ScrollView
        ref={refScrollView}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: width, y: 0 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: refAnimatedScroll } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          if (
            e.nativeEvent.contentOffset.x >
            half_width * (length_data * 2 + 1)
          ) {
            refScrollView.current.scrollTo({
              x: half_width * 2,
              animated: false,
            });
          } else if (e.nativeEvent.contentOffset.x < half_width) {
            refScrollView.current.scrollTo({
              x: half_width * length_data * 2,
              animated: false,
            });
          }
        }}
      >
        <Image
          style={[styles.BannerImage, { width: width }]}
          source={{ uri: server + data[length_data - 1].ImageAPI }}
        />
        {data.map((item) => {
          return (
            <Pressable
              key={item.key}
              onPress={() =>
                navigation.navigate("MangaScreen", {
                  idManga: item.idManga,
                })
              }
            >
              <Image
                style={[styles.BannerImage, { width: width }]}
                source={{ uri: server + item.ImageAPI }}
              />
              <LinearGradient
                // Background Linear Gradient
                colors={["rgba(255, 255, 255, 0)", "#403f3f", "#050505"]}
                style={[styles.linear]}
              >
                {description(item)}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <Text style={Font.base_description}>{nameGenre}</Text>
                  <Circle />
                  <Text style={Font.base_description}>
                    {Math.round(item.TotalView / 100) / 10}K reads
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          );
        })}
        <Image
          style={[styles.BannerImage, { width: width }]}
          source={{ uri: server + data[0].ImageAPI }}
        />
      </Animated.ScrollView>
      <View
        style={{
          position: "absolute",
          width: "100%",
          bottom: 10,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {data.map((item) => animatedSlide(item, refAnimatedScroll))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  circle: {
    height: 8,

    backgroundColor: Color.gray,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  BannerImage: { height: 450, resizeMode: "cover" },
  linear: {
    paddingTop: 40,
    width: "100%",
    height: 150,
    position: "absolute",
    bottom: 0,
    opacity: 0.8,
    zIndex: 2,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

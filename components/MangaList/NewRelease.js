import React, { useState } from "react";
import { Text, View, Image, Pressable, StyleSheet } from "react-native";
import { Color } from "../../variable/Color";

import { Font } from "../../variable/Font";

import dateFormat from "dateformat";
import NewStatus from "../AllScreen/NewStatus";
import HotStatus from "../AllScreen/HotStatus";
import SaveStatus from "../AllScreen/SaveStatus";
import Circle from "../AllScreen/Circle";
import { EXPO_PUBLIC_API_AWS } from "../../variable/constants";

function NewRelease({ dataRelease, index, navigation }) {
  const serverAWS = EXPO_PUBLIC_API_AWS;
  const {
    Name,
    DateAdded,
    TotalView,
    ImageAPI,
    idManga,
    Save,
    Hot,
    New,
    Status,
  } = dataRelease;

  // Basic usage
  function description() {
    if (Save) {
      return <SaveStatus save={Save} />;
    } else if (New) {
      if (Hot) {
        return (
          <View style={styles.containerDescription}>
            <NewStatus status={Status} />
            <Circle />
            <HotStatus />
          </View>
        );
      } else {
        return <NewStatus status={Status} />;
      }
    } else if (Hot) {
      return <HotStatus />;
    }
  }
  return (
    <Pressable
      style={styles.viewManga}
      onPress={() =>
        navigation.navigate("MangaScreen", {
          idManga: idManga,
        })
      }
    >
      <Text style={[Font.baseTitle, { marginTop: 10 }]}>{index}</Text>
      <Image style={styles.manga} source={{ uri: serverAWS + ImageAPI }} />

      <View style={{ justifyContent: "center", width: 160 }}>
        <Text style={[Font.baseTitle, { marginTop: 10 }]}>{Name}</Text>
        <Text style={[Font.description, { marginTop: 2 }]}>
          {Math.round(TotalView / 100) / 10}K reads
        </Text>
        <Text style={[Font.description, { marginTop: 2 }]}>
          Released {dateFormat(DateAdded, "dd mmm yyyy")}
        </Text>
        <View style={{ marginTop: 10 }}>{description()}</View>
      </View>
    </Pressable>
  );
}

//style sheet
const styles = StyleSheet.create({
  //view bọc ngoài thumbnail của manga
  viewManga: {
    height: 170,
    width: 350,
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "center",
    paddingLeft: 20,
    marginTop: 10,
    backgroundColor: Color.baseColor,
  },
  //thumbnail của manga trong list
  manga: {
    height: 150,
    width: 100,
    resizeMode: "cover",
    borderRadius: 10,
    marginHorizontal: 15,
  },
  //title của manga
  containerDescription: { flexDirection: "row", alignItems: "center" },
});

export default NewRelease;

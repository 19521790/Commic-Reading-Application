import React, { Component, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Color } from "../../variable/Color";
import { Font } from "../../variable/Font";
import { useSelector } from "react-redux";
import Stats from "../AllScreen/Stats";
import axios from "axios";
import {
  EXPO_PUBLIC_API_AWS,
  EXPO_PUBLIC_API_URL,
} from "../../variable/constants";
const serverAWS = EXPO_PUBLIC_API_AWS;
const server = EXPO_PUBLIC_API_URL;

export default function ReadingList(props) {
  return (
    <Pressable style={styles.press} onPress={() => props.setReadingListPopUp()}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Stats
          color={props.color}
          iconName={props.iconName}
          source={props.source}
        />
      </View>
      <View style={{ flex: 2 }}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text style={Font.baseTitle}>{props.title}</Text>
        </View>
        <View style={{ flex: 1, paddingTop: 2 }}>
          <Text style={Font.description}>{props.count_title} titles</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: 10,
    backgroundColor: Color.baseColor,
    height: "85%",
    width: "45%",

    flexDirection: "row",
  },
});

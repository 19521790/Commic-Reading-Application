import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Color } from "../../variable/Color";
import { Font } from "../../variable/Font";

import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import SuccessLike from "../Popup/SuccessLike";
import { useRef } from "react";
import { EXPO_PUBLIC_API_AWS } from "../../variable/constants";
export default function ChapsNavigate({
  data,
  changeData,
  hidePopup,
  changeImage,
}) {
  const serverAWS = EXPO_PUBLIC_API_AWS;
  const user_payData = useSelector((state) => state.purchase);
  const refPopup = useRef();
  function itemPay(item) {
    if (item.Pay > 0 && !user_payData.includes(item.idChapter)) {
      return <FontAwesome name="lock" size={24} color="white" />;
    }
  }
  return (
    <>
      {data &&
        data.map((item) => {
          return (
            <Pressable
              key={item.idChapter}
              onPress={() => {
                if (
                  item.Pay == 0 ||
                  user_payData.includes(item.idChapter) ||
                  item.Free > 0
                ) {
                  changeData(
                    item.idChapter,
                    item.Name ? item.Name : "Chapter " + item.Order,
                    item.Order
                  );

                  hidePopup();
                } else {
                  refPopup.current.setModalVisible(
                    "Please Purchase to read this chapter!",
                    "purchase"
                  );
                }
              }}
            >
              <View style={styles.container}>
                <Image
                  style={styles.image}
                  source={{ uri: serverAWS + item.ImageAPI }}
                />
                <View style={styles.DetailContainer}>
                  <Text style={Font.baseTitle}>
                    Chapter {item.Order}
                    {item.Name && ": "}
                    {item.Name}
                  </Text>
                  <Text style={Font.baseTitle}>{item.status}</Text>
                </View>
                {item.Free == 1 && (
                  <MaterialIcons name="money-off" size={24} color="white" />
                )}
                {itemPay(item)}
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                }}
              >
                <View style={styles.line}></View>
              </View>
              <SuccessLike ref={refPopup} />
            </Pressable>
          );
        })}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",

    alignItems: "center",
    marginVertical: 10,
  },

  DetailContainer: {
    marginLeft: 15,
    flexDirection: "row",
    alignItems: "center",
    width: 220,
    paddingRight: 20,
    justifyContent: "space-between",
  },
  image: {
    height: 80,
    width: 100,
    marginLeft: 15,
  },
  line: {
    width: 280,
    height: 1,
    backgroundColor: Color.white,
    opacity: 0.1,
  },
});

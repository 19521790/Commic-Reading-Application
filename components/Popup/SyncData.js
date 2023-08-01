import React, { Component } from "react";
import { Text, View, StyleSheet, Modal, Button, Pressable } from "react-native";

import { Color } from "../../variable/Color";
import { Ionicons } from "@expo/vector-icons";
import { Font } from "../../variable/Font";
import { InitialResume } from "../../redux/actions";
import { getResume } from "../../InteractServer/ResumeSave";
import axios from "axios";
import {
  EXPO_PUBLIC_API_AWS,
  EXPO_PUBLIC_API_URL,
} from "../../variable/constants";
const serverAWS = EXPO_PUBLIC_API_AWS;
const server = EXPO_PUBLIC_API_URL;

//pop up login
class SyncData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      idUser: "",
    };
  }

  setModalVisible = (visible, idUser) => {
    this.setState({
      modalVisible: visible,
      idUser: idUser,
    });
  };

  render() {
    const { modalVisible } = this.state;
    return (
      <Modal animationType={"none"} transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.container}>
            <Text
              style={[
                Font.baseTitle,
                {
                  textAlign: "center",
                  paddingLeft: 25,
                  paddingRight: 25,
                  paddingBottom: 17,
                  paddingTop: 0,
                  marginTop: 20,
                },
              ]}
            >
              Sync device data
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: Color.white,
                lineHeight: 22,
                padding: 15,
                paddingTop: 0,
              }}
            >
              You have reading progress on this device. Do you want to sync it?
            </Text>
            <View
              style={{
                backgroundColor: "white",
                height: 0.5,
                width: "100%",
                marginTop: 10,
              }}
            ></View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Pressable
                onPress={() => {
                  this.setState({ modalVisible: false });
                  this.props.changeLoginInfo(true);
                  getResume().then((res) => {
                    res.map((item) => {
                      item["idUser"] = this.state.idUser;
                      axios.post(server + "/resume_reading/add", item);
                    });
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    color: "white",
                  }}
                >
                  Yes
                </Text>
              </Pressable>
              <View
                style={{ backgroundColor: "white", height: 40, width: 0.5 }}
              ></View>
              <Pressable
                onPress={() => {
                  this.props.Sync_data(this.state.idUser);
                  this.setState({ modalVisible: false });
                  this.props.changeLoginInfo(true);
                }}
              >
                <Text style={{ fontSize: 17, color: "red" }}>Clear All</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Color.baseColor,
    height: 175,
    width: 270,
    borderRadius: 10,
  },
  successText: {
    color: Color.white,
    fontSize: 19,
    marginTop: 20,
    paddingHorizontal: 20,
    textAlign: "center",
    lineHeight: 28,
  },
});

export default SyncData;

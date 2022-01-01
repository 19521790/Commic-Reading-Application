import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Color } from "../variable/Color";

import { MaterialIcons } from "@expo/vector-icons";
import { Font } from "../variable/Font";
import { Ionicons } from "@expo/vector-icons";

import ReadingList from "../components/ProfileScreen/ReadingList";
import { baseThing } from "../variable/BaseThing";
import ModelPopup from "../components/Popup/ModelPopup";
import { deleteUser, getdata } from "../InteractServer/GetUserSqlite";
import OnSuccessPopUp from "../components/Popup/OnSuccessPopUp";
import AwesomeAlert from "react-native-awesome-alerts";
import LogoutPopup from "../components/Popup/LogoutPopup";
import ReadingListPopup from "../components/Popup/ReadingListPopup";
import SearchTitle from "../components/ProfileScreen/SearchTitle";
import SearchTabBar from "../components/SearchScreen/SearchTabBar";

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.successRef = React.createRef();
    this.LogoutRef = React.createRef();
    this.ReadingListRef = React.createRef();
    this.state = {
      userLogin: false,
      userInfo: {},
    };
  }
  componentDidMount() {
    this.props.navigation.addListener("tabPress", (e) => {
      this.getUserInfo();
    });
    this.getUserInfo();
  }
  getUserInfo = () => {
    getdata().then((res) => {
      if (res) {
        this.setState({ userLogin: true, userInfo: res });
      } else {
        this.setState({ userLogin: false });
      }
    });
  };
  changeLoginInfo = (login) => {
    this.setState({ userLogin: login });
    this.successRef.current.setModalVisible(true);
  };
  logoutUser = () => {
    this.LogoutRef.current.setModalVisible(true);
  };
  onLogout = () => {
    deleteUser().then((res) => {
      this.setState({ userLogin: false });
      this.successRef.current.setModalVisible(false);
    });
  };
  refreshScreenUser = () => {
    if (this.state.userLogin) {
      return (
        <View
          style={{
            alignItems: "center",
            width: "100%",
          }}
        >
          <Image
            style={{ width: 70, height: 70, borderRadius: 35 }}
            source={{ uri: this.state.userInfo.UserImage }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 17,
              paddingBottom: 20,
              paddingTop: 15,
            }}
          >
            {this.state.userInfo.UserName}
          </Text>
          <Pressable
            style={[baseThing.button, { backgroundColor: Color.button }]}
            onPress={this.logoutUser}
          >
            <Text style={{ fontWeight: "700" }}>Logout</Text>
          </Pressable>
        </View>
      );
    } else {
      return (
        <View style={{ alignItems: "center", width: "100%" }}>
          <MaterialIcons name='account-circle' size={70} color='#595959' />
          <Text
            style={{
              color: "white",
              fontSize: 17,
              paddingBottom: 20,
              paddingTop: 15,
            }}
          >
            No Account
          </Text>
          <Pressable
            style={[baseThing.button, { backgroundColor: Color.button }]}
            onPress={() => this.myRef.current.setModalVisible(true)}
          >
            <Text style={{ fontWeight: "700" }}>Sign In</Text>
          </Pressable>
        </View>
      );
    }
  };
  changeUserProfile = (data) => {
    this.setState({ userInfo: data });
  };
  setReadingListPopup = (title) => {
    this.ReadingListRef.current.setModalVisible(true, title);
  };
  render() {
    return (
      <View>
        <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
          <View style={styles.account}>
            {this.refreshScreenUser()}
            <Ionicons
              style={styles.setting}
              name='settings-outline'
              size={24}
              color='white'
            />
          </View>
          <View style={styles.list}>
            <Text style={[Font.title, { marginBottom: 20 }]}>Reading List</Text>
            <View style={styles.reading}>
              <ReadingList
                iconName='readme'
                source='awesome5'
                title='Read Later'
                color='#e65c00'
                setReadingListPopUp={this.setReadingListPopup}
              />
              <ReadingList
                iconName='bell'
                source='awesome5'
                title='Subscribed'
                color='#cc00ff'
                setReadingListPopUp={this.setReadingListPopup}
              />
            </View>
            <View style={styles.reading}>
              <ReadingList
                iconName='like2'
                source='ant'
                title='Liked'
                color='#008ae6'
                setReadingListPopUp={this.setReadingListPopup}
              />
              <ReadingList
                iconName='clouddownload'
                source='ant'
                title='Downloaded'
                color='#009933'
                setReadingListPopUp={this.setReadingListPopup}
              />
            </View>
          </View>
          <View style={styles.resume}>
            <Text style={[Font.title, { marginBottom: 20 }]}>
              Resume Reading
            </Text>
            <View style={{ width: "100%", height: 200, alignItems: "center" }}>
              <Image
                source={require("../assets/Resume.png")}
                style={{
                  resizeMode: "contain",
                  height: 200,
                  width: "80%",
                }}
              />
            </View>

            <Text
              style={[Font.baseTitle, { marginTop: 20, alignSelf: "center" }]}
            >
              There is nothing in recently read
            </Text>
            <Text
              style={[
                Font.description,
                { marginTop: 10, paddingHorizontal: 40, textAlign: "center" },
              ]}
            >
              Just start reading. Recently read titles will be shown here.
            </Text>
          </View>

          <ModelPopup
            ref={this.myRef}
            onLoginSuccess={this.changeLoginInfo}
            changeUserProfile={this.changeUserProfile}
          />
          <OnSuccessPopUp ref={this.successRef} />
          <LogoutPopup ref={this.LogoutRef} onLogout={this.onLogout} />

          <ReadingListPopup ref={this.ReadingListRef} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.defaultColor,
  },
  account: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.baseColor,

    width: "100%",
    height: 250,
  },
  setting: {
    position: "absolute",
    top: 50,
    right: 15,
  },
  list: {
    padding: 15,
    height: 230,
  },
  resume: {
    padding: 15,
    height: 400,
  },

  reading: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
  },
});

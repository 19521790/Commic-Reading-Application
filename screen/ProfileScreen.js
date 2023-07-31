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
import { connect, useDispatch } from "react-redux";
import ReadingList from "../components/ProfileScreen/ReadingList";
import { baseThing } from "../variable/BaseThing";
import ModelPopup from "../components/Popup/ModelPopup";
import { deleteUser, getdata } from "../InteractServer/GetUserSqlite";
import OnSuccessPopUp from "../components/Popup/OnSuccessPopUp";
import LogoutPopup from "../components/Popup/LogoutPopup";
import ReadingListPopup from "../components/Popup/ReadingListPopup";
import LogoutResume from "../components/Popup/LogoutResume";
import { deleteResume, insertResume } from "../InteractServer/ResumeSave";
import { InitialResume, Login, Logout, SetIdUser } from "../redux/actions";
import SyncData from "../components/Popup/SyncData";
import axios from "axios";
const server = "http://13.250.45.19:3000";
import ResumeReading from "../components/HomeScreen/ResumeReading";
import Stripe from "../components/Stripe/Stripe";
import { AntDesign } from "@expo/vector-icons";

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.successRef = React.createRef();
    this.LogoutRef = React.createRef();
    this.ReadingListRef = React.createRef();
    this.LogoutResumeRef = React.createRef();
    this.SyncDataRef = React.createRef();
    this.innerRef = React.createRef(false);
    this.state = {
      userLogin: false,
      userInfo: {},
      like: [],
      readlater: [],
      subscribe: [],
      coin: 0,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("tabPress", (e) => {
      this.getUserInfo();
      this.getDataLike();
      this.getCoin();
    });

    this.getUserInfo();
    this.getDataLike();
    this.getCoin();
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

  getDataLike = () => {
    if (this.props.userlog) {
      axios.get(server + "/like/user/" + this.props.idUser).then((res) => {
        this.setState({ like: res.data });
      });
      axios.get(server + "/subscribe/user/" + this.props.idUser).then((res) => {
        this.setState({ subscribe: res.data });
      });
      axios
        .get(server + "/read_later/user/" + this.props.idUser)
        .then((res) => {
          this.setState({ readlater: res.data });
        });
    }
  };
  componentDidUpdate(prevProps) {
    if (prevProps.userlog !== this.props.userlog) {
      if (this.props.userlog) {
        this.getDataLike();
        this.getCoin();
      } else {
        this.setState({ like: [], readlater: [], subscribe: [] });
      }
    }
  }
  getCoin() {
    if (this.props.userlog) {
      axios.get(server + "/users/get/" + this.props.idUser).then((res) => {
        this.setState({ coin: res.data[0].Coin });
      });
    }
  }
  changeLoginInfo = (login) => {
    console.log("hrllo");
    this.setState({ userLogin: login });
    this.successRef.current.setModalVisible(true);
    this.props.dispatch(Login());
  };
  logoutUser = () => {
    this.LogoutRef.current.setModalVisible(true);
  };
  onLogout = () => {
    this.LogoutResumeRef.current.setModalVisible(true);
  };

  acceptLogout = (type) => {
    if (type == 0) {
      this.LogoutResumeRef.current.setModalVisible(false);
      this.props.resume.map((item) => {
        insertResume(item);
      });
    } else if (type == 1) {
      deleteResume();
      this.props.dispatch(InitialResume([]));
      this.LogoutResumeRef.current.setModalVisible(false);
    }
    deleteUser().then((res) => {
      this.setState({ userLogin: false });
      this.successRef.current.setModalVisible(false);
    });
    this.props.dispatch(Logout());
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
          {/* coin */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <View>
              <Image
                source={require("../assets/icons8_coin_125px_1.png")}
                style={{ height: 50, width: 50 }}
              />
            </View>
            <Text style={[Font.baseTitle, { marginRight: 10 }]}>
              {this.state.coin} coins
            </Text>
            <Pressable onPress={() => this.innerRef.current(true)}>
              <AntDesign name="pluscircleo" size={30} color="white" />
            </Pressable>
          </View>

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
          <MaterialIcons name="account-circle" size={70} color="#595959" />
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
    this.props.dispatch(SetIdUser(data.UserId));

    this.SyncDataRef.current.setModalVisible(true, data.UserId);
  };
  Sync_data = (idUser) => {
    axios.get(server + "/resume_reading/user/" + idUser).then((res) => {
      this.props.dispatch(InitialResume(res.data[0]));
    });
  };
  setReadingListPopup = (title, data) => {
    this.ReadingListRef.current.setModalVisible(true, title, data);
  };
  render() {
    return (
      <View>
        <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
          <View
            style={[
              styles.account,
              { height: this.state.userLogin ? 320 : 250 },
            ]}
          >
            {this.refreshScreenUser()}
          </View>

          <View style={styles.list}>
            <Text style={[Font.title, { marginBottom: 20 }]}>Reading List</Text>
            <View style={styles.reading}>
              <ReadingList
                iconName="readme"
                source="awesome5"
                title="Read Later"
                color="#e65c00"
                type="readlater"
                count_title={this.state.readlater.length}
                setReadingListPopUp={() =>
                  this.setReadingListPopup("Read Later", this.state.readlater)
                }
              />
              <ReadingList
                iconName="bell"
                source="awesome5"
                title="Subscribed"
                color="#cc00ff"
                type="subscribe"
                count_title={this.state.subscribe.length}
                setReadingListPopUp={() =>
                  this.setReadingListPopup("Subscribed", this.state.subscribe)
                }
              />
            </View>
            <View style={styles.reading}>
              <ReadingList
                iconName="like2"
                source="ant"
                title="Liked"
                color="#008ae6"
                type="like"
                count_title={this.state.like.length}
                setReadingListPopUp={() =>
                  this.setReadingListPopup("Liked", this.state.like)
                }
              />
              <ReadingList
                iconName="clouddownload"
                source="ant"
                title="Downloaded"
                color="#009933"
                count_title={0}
                setReadingListPopUp={() => {}}
              />
            </View>
          </View>
          <View style={styles.resume}>
            <Text style={[Font.title, { marginBottom: 20 }]}>
              Resume Reading
            </Text>
            {this.props.resume.length == 0 ? (
              <View>
                <View
                  style={{ width: "100%", height: 200, alignItems: "center" }}
                >
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
                  style={[
                    Font.baseTitle,
                    { marginTop: 20, alignSelf: "center" },
                  ]}
                >
                  There is nothing in recently read
                </Text>
                <Text
                  style={[
                    Font.description,
                    {
                      marginTop: 10,
                      paddingHorizontal: 40,
                      textAlign: "center",
                    },
                  ]}
                >
                  Just start reading. Recently read titles will be shown here.
                </Text>
              </View>
            ) : (
              <ResumeReading navigation={this.props.navigation} />
            )}
          </View>

          <ModelPopup
            ref={this.myRef}
            changeUserProfile={this.changeUserProfile}
          />
          <OnSuccessPopUp ref={this.successRef} />
          <LogoutPopup ref={this.LogoutRef} onLogout={this.onLogout} />
          <ReadingListPopup
            ref={this.ReadingListRef}
            userlog={this.state.userLogin}
            signIn={() => this.myRef.current.setModalVisible(true)}
            navigation={this.props.navigation}
          />
          <LogoutResume
            ref={this.LogoutResumeRef}
            acceptLogout={this.acceptLogout}
          />
          <SyncData
            ref={this.SyncDataRef}
            Sync_data={this.Sync_data}
            changeLoginInfo={this.changeLoginInfo}
          />
          <Stripe innerRef={this.innerRef} />
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
    flex: 1,
  },

  reading: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
  },
});
const mapStateToProps = (state) => ({
  resume: state.resume,
  userlog: state.userlog,
  idUser: state.idUser,
});
export default connect(mapStateToProps)(ProfileScreen);

import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Color } from "../../variable/Color";
import { Font } from "../../variable/Font";
import { baseThing } from "../../variable/BaseThing";
import { MaterialIcons } from "@expo/vector-icons";
import LoginGoogle from "../../InteractServer/LoginGoogle";
import PostUser from "../../InteractServer/PostUser";
import { insertUser } from "../../InteractServer/GetUserSqlite";
import LottieView from "lottie-react-native";
//pop up login
class ModelPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      login: false,
    };
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible, login: false });
  };
  getUserInfo = async () => {
    this.setState({ login: true });

    await setTimeout(() => {
      LoginGoogle().then((result) => {
        console.log(result);
        if (result) {
          const data = {
            UserId: result.id,
            UserName: result.name,
            UserEmail: result.email,
            UserImage: result.photoUrl,
          };

          //post userdata to database server if not exist

          PostUser(data);
          //insert data user to sqlite
          insertUser(data).then((res) => {
            if (this.props.changeUserProfile) {
              this.props.changeUserProfile(data);
            }
            //truyen tham so onloginsuccess vao parent
          });

          this.setState({ modalVisible: false });
        } else {
          this.setState({ login: false });
        }
      });
    }, 200);
  };
  render() {
    const { modalVisible } = this.state;
    return (
      <Modal animationType={"slide"} transparent={true} visible={modalVisible}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View style={styles.container}>
            <Pressable
              onPress={() => this.setModalVisible(false)}
              style={styles.closeButton}
            >
              <AntDesign name="closecircle" size={24} color="white" />
            </Pressable>
            <MaterialCommunityIcons
              name="account-arrow-left"
              size={200}
              color="#b366ff"
              style={{ marginTop: 20 }}
            />
            <Text style={Font.baseTitle}>Sign in or create a new account</Text>
            <Pressable
              style={[
                baseThing.button,
                {
                  backgroundColor: Color.white,
                  marginVertical: 20,
                  flexDirection: "row",
                },
              ]}
              onPress={this.getUserInfo}
            >
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  display: this.state.login ? "flex" : "none",
                }}
              >
                <LottieView
                  source={require("../../assets/loading.json")}
                  autoPlay
                  loop
                />
              </View>
              {!this.state.login && (
                <View style={{ flexDirection: "row" }}>
                  <MaterialIcons name="email" size={24} color="black" />
                  <Text
                    style={[Font.baseTitle, { color: "black", marginLeft: 10 }]}
                  >
                    Login with Google
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "60%",
    backgroundColor: Color.baseColor,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default ModelPopup;

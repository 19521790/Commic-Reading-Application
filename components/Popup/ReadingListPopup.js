import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Font } from "../../variable/Font";
import { Color } from "../../variable/Color";

import MangaSearch from "../MangaList/MangaSearch";
import { Ionicons } from "@expo/vector-icons";
import ResumeList from "../MangaList/ResumeList";
import LikeTag from "../ProfileScreen/LikeTag";
import Line from "../AllScreen/Line";
//pop up login
class ReadingListPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      title: "",
      hideOnSearch: true,
      data: [],
    };

    this.height = Dimensions.get("window").height;
  }

  setModalVisible = (visible, title, data) => {
    this.setState({
      modalVisible: visible,
      title: title,
      data: data,
    });
  };
  hideOnSearch = (visible) => {
    this.setState({
      hideOnSearch: visible,
    });
  };
  render() {
    const { modalVisible } = this.state;
    return (
      <Modal
        animationType={"slide"}
        visible={modalVisible}
        statusBarTranslucent
      >
        <View style={[styles.header]}>
          {this.props.userlog ? (
            <View>
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 25,
                  height: 50,
                }}
              >
                <Pressable
                  style={{ position: "absolute", left: 15, paddingTop: 25 }}
                  onPress={() => this.setState({ modalVisible: false })}
                >
                  <Entypo name="chevron-down" size={24} color="white" />
                </Pressable>

                <Text style={Font.title}>{this.state.title}</Text>
              </View>

              <View
                style={{
                  marginTop: 20,

                  height: this.height - 75,
                }}
              >
                <FlatList
                  data={this.state.data}
                  keyExtractor={(item) => item.chapterId}
                  renderItem={({ item, index }) => {
                    return (
                      <View>
                        <LikeTag
                          key={index}
                          data={item}
                          navigation={this.props.navigation}
                          hideModel={() =>
                            this.setState({ modalVisible: false })
                          }
                        />
                        <Line />
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          ) : (
            <View
              style={{ height: "100%", width: "100%", alignItems: "center" }}
            >
              <Pressable
                style={{ position: "absolute", left: 15, paddingTop: 25 }}
                onPress={() => this.setState({ modalVisible: false })}
              >
                <Entypo name="chevron-down" size={24} color="white" />
              </Pressable>

              <Text style={[Font.title, { marginTop: 25 }]}>
                {this.state.title}
              </Text>
              <View
                style={{
                  height: "90%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="person-add-outline" size={70} color="white" />
                <Text style={[Font.baseTitle, { marginVertical: 20 }]}>
                  Please Sign in to have more features
                </Text>
                <Pressable
                  style={{
                    alignItems: "center",
                    width: "90%",
                    backgroundColor: Color.onBaseColor,
                    padding: 10,
                    borderRadius: 10,
                  }}
                  onPress={() => this.props.signIn()}
                >
                  <Text style={Font.baseTitle}>+ Sign in</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    width: "100%",
    height: "100%",
    backgroundColor: Color.baseColor,
  },
});

export default ReadingListPopup;

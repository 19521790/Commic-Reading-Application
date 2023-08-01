import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
  ScrollView,
} from "react-native";

import { Color } from "../../variable/Color";
import { Ionicons } from "@expo/vector-icons";
import { Font } from "../../variable/Font";
import { Entypo } from "@expo/vector-icons";
import ChapsNavigate from "../ChapterScreen/ChapsNavigate";

//pop up login

class ChapterPopup extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   modalVisible: props.visible,
    // };
  }

  // setModalVisible = (visible) => {
  //   this.setState({
  //     modalVisible: visible,
  //   });
  // };

  render() {
    // const { modalVisible } = this.props.visible;
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.props.visible}
      >
        <TouchableOpacity
          style={{
            justifyContent: "flex-end",
            flex: 1,
          }}
          activeOpacity={1}
          onPressOut={() => {
            this.props.setModalVisible(false);
          }}
        >
          <TouchableWithoutFeedback>
            <View style={styles.outsideContainer}>
              <View style={styles.container}>
                <Text style={Font.title}>Jump to Chapter</Text>
                <Pressable
                  style={styles.circle}
                  onPress={() => this.props.setModalVisible(false)}
                >
                  <Entypo name="chevron-down" size={24} color="white" />
                </Pressable>
              </View>
              <View style={styles.line} />
              <ScrollView>
                <ChapsNavigate
                  data={this.props.dataChapter}
                  changeData={this.props.changeData}
                  hidePopup={() => this.props.setModalVisible(false)}
                />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  outsideContainer: {
    height: "80%",
    width: "100%",
    backgroundColor: Color.baseColor,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  container: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circle: {
    backgroundColor: Color.mangaColor,
    borderRadius: 15,
    padding: 3,
  },
  line: {
    width: "100%",
    height: 0.8,
    backgroundColor: "white",
    opacity: 0.2,
  },
});

export default ChapterPopup;

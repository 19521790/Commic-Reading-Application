import axios from "axios";
import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { connect } from "react-redux";
import { deleteResume } from "../../InteractServer/ResumeSave";
import { InitialResume, PushPurchase, SetPurchase } from "../../redux/actions";

import { Color } from "../../variable/Color";
import { Font } from "../../variable/Font";
import { EXPO_PUBLIC_API_URL } from "../../variable/constants";
const server = EXPO_PUBLIC_API_URL;

//pop up login
class ConfirmManga extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      kind_action: "",
      coin: 0,
      idChapter: -1,
    };
  }

  setModalVisible = (visible, kind_action, coin, idChapter) => {
    this.setState({ modalVisible: visible, kind_action: kind_action });
    if (coin) {
      this.setState({ coin: coin, idChapter: idChapter });
    }
  };
  kind_actionFunction(kind_action) {
    this.setState({ modalVisible: false });
    if (kind_action == "Remove this title from Read Later?") {
      axios.delete(server + "/read_later/delete", {
        data: {
          idUser: this.props.idUser,
          idManga: this.props.idManga,
        },
      });
      this.props.unreadlater();
      this.props.successLike("Remove from Read Later", "unreadlater");
    } else if (kind_action == "Undo Like?") {
      axios.delete(server + "/like/delete", {
        data: {
          idUser: this.props.idUser,
          idManga: this.props.idManga,
        },
      });
      this.props.unlike();
      this.props.successLike("Remove from Liked", "unlike");
    } else if (kind_action == "Unsubscribe?") {
      axios.delete(server + "/subscribe/delete", {
        data: {
          idUser: this.props.idUser,
          idManga: this.props.idManga,
        },
      });
      this.props.unsubscribe();
      this.props.successLike("Remove from Subscribe", "unsubscribe");
    } else if (kind_action == "Remove All Recently Read") {
      if (this.props.userlog) {
        axios.delete(
          server + "/resume_reading/delete_all/user/" + this.props.idUser
        );
      } else {
        deleteResume();
      }
      this.props.initialResume();
      this.props.successLike();
      this.props.hideResume();
    } else if (
      kind_action ==
      "Purchase this chapter for " + this.state.coin + " coin?"
    ) {
      axios.post(server + "/money/buy", {
        idChapter: this.state.idChapter,
        idUser: this.props.idUser,
        pay: this.state.coin,
      });
      this.props.successLike("Purchase Success", "purchase");
      this.props.purchase(this.state.idChapter);
    }
  }
  render() {
    const { modalVisible } = this.state;
    return (
      <Modal animationType={"slide"} transparent={true} visible={modalVisible}>
        <TouchableOpacity
          style={{
            justifyContent: "flex-end",
            flex: 1,
          }}
          activeOpacity={1}
          onPressOut={() => {
            this.setModalVisible(false);
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                flex: 1,
                backgroundColor: Color.baseColor,
                position: "absolute",
                width: "100%",
                bottom: 0,
                paddingHorizontal: 10,
              }}
            >
              <Pressable
                style={styles.container}
                onPress={() => this.kind_actionFunction(this.state.kind_action)}
              >
                <Text style={[Font.baseTitle, { color: "red" }]}>
                  {this.state.kind_action}
                </Text>
              </Pressable>
              <Pressable
                style={styles.container}
                onPress={() => this.setModalVisible(false)}
              >
                <Text style={Font.baseTitle}>Cancel</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.onBaseColor,
    width: "100%",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 14,
    borderRadius: 10,
    marginBottom: 5,
  },
});
const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    initialResume: () => dispatch(InitialResume([])),
    purchase: (data) => dispatch(PushPurchase(data)),
  };
};
const mapStateToProps = (state) => {
  return {
    // dispatching plain actions
    idUser: state.idUser,
  };
};
export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(ConfirmManga);

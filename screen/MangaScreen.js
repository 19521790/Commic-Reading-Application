import React, { useRef, useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Button,
  Pressable,
} from "react-native";

import Header from "../components/MangaScreen/Header";
import { Color } from "../variable/Color";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Font } from "../variable/Font";
import axios from "axios";
const server = "http://13.250.45.19:3000";
import ContainerBody from "../components/MangaScreen/ContainerBody";
import MangaSetting from "../components/Popup/MangaSettings";
import ModelPopup from "../components/Popup/ModelPopup";
import SyncData from "../components/Popup/SyncData";
import OnSuccessPopUp from "../components/Popup/OnSuccessPopUp";
import { useSelector, useDispatch } from "react-redux";
import { InitialResume, Login, SetIdUser } from "../redux/actions";
import ConfirmManga from "../components/Popup/ConfirmManga";
import SuccessLike from "../components/Popup/SuccessLike";
import CommentScreen from "../components/MangaScreen/CommentScreen";

export default function MangaScreen({ route, navigation }) {
  const [dataHeader, set_dataHeader] = useState([]);
  const [dataBody, set_dataBody] = useState([]);
  useEffect(() => {
    let check = true;
    axios.get(server + "/manga/" + route.params.idManga).then((res) => {
      if (check) {
        set_dataHeader(res.data[0][0]);
      }
    });
    axios
      .get(server + "/manga/" + route.params.idManga + "/chapter")
      .then((res) => {
        if (check) {
          set_dataBody(res.data);
        }
      });
    return () => (check = false);
  }, []);
  const userlog = useSelector((state) => state.userlog);
  const ref = useRef(new Animated.Value(0)).current;
  const successRef = useRef();
  const modelPopupRef = useRef();
  const SyncDataRef = useRef();
  const refMangaSettings = useRef();
  const refConfirmManga = useRef();
  const refSuccessLike = useRef();
  const translation = ref.interpolate({
    inputRange: [0, 232],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const translateTitle = ref.interpolate({
    inputRange: [230, 232, 9999],
    outputRange: [0, 1, 1],
    extrapolate: "clamp",
  });
  const translateTab = ref.interpolate({
    inputRange: [232, 5000],
    outputRange: [0, 4770],
    extrapolate: "clamp",
  });
  const resume = useSelector((state) => state.resume);
  const idUser = useSelector((state) => state.idUser);
  const dispatch = useDispatch();
  const changeUserProfile = (data) => {
    dispatch(SetIdUser(data.UserId));
    if (resume.length == 0) {
      dispatch(Login());
      Sync_data(data.UserId);
    } else {
      SyncDataRef.current.setModalVisible(true, data.UserId);
    }
  };

  const Sync_data = (idUser) => {
    axios.get(server + "/resume_reading/user/" + idUser).then((res) => {
      dispatch(InitialResume(res.data[0]));
    });
  };
  const changeLoginInfo = (login) => {
    successRef.current.setModalVisible(true);
    dispatch(Login());
  };

  return (
    <Animated.ScrollView
      style={{ backgroundColor: Color.baseColor }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: ref } } }],
        { useNativeDriver: true }
      )}
    >
      {/* thanh control chứa comment, điều hướng */}
      <Animated.View
        style={[
          styles.control_background,
          { transform: [{ translateY: ref }], opacity: translation },
        ]}
      ></Animated.View>
      <Animated.View
        style={[styles.control, { transform: [{ translateY: ref }] }]}
      >
        <Pressable onPress={() => navigation.pop()}>
          <Ionicons name="chevron-back" size={24} color={Color.white} />
        </Pressable>
        <Animated.View
          style={{
            width: 270,
            alignItems: "center",
            opacity: translateTitle,
          }}
        >
          <Text style={Font.baseTitle} numberOfLines={1}>
            {dataHeader.Name}
          </Text>
        </Animated.View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CommentScreen
            idManga={dataHeader.idManga}
            showModal={() => modelPopupRef.current.setModalVisible(true)}
          />
          <Pressable
            onPress={() =>
              refMangaSettings.current.setState({ isShowing: true })
            }
          >
            <Entypo
              name="dots-three-horizontal"
              size={20}
              color={Color.white}
              style={{ marginHorizontal: 15 }}
            />
          </Pressable>
        </View>
      </Animated.View>

      <Header data={dataHeader} count_chapter={dataBody.length} />
      <ContainerBody
        data={dataBody}
        dataHeader={dataHeader}
        translate={translateTab}
        navigation={navigation}
        showLogin={() => modelPopupRef.current.setModalVisible(true)}
        confirmPurchase={(value, coin, idChapter) =>
          refConfirmManga.current.setModalVisible(true, value, coin, idChapter)
        }
      />
      <MangaSetting
        ref={refMangaSettings}
        name={dataHeader.Name}
        image={dataHeader.ImageAPI}
        navigation={navigation}
        data={dataBody}
        showLogin={() => modelPopupRef.current.setModalVisible(true)}
        userlog={userlog}
        confirmManga={(value) =>
          refConfirmManga.current.setModalVisible(true, value)
        }
        idManga={dataHeader.idManga}
        idUser={idUser}
        successLike={(text, type) =>
          refSuccessLike.current.setModalVisible(text, type)
        }
      />
      <ModelPopup ref={modelPopupRef} changeUserProfile={changeUserProfile} />
      <SyncData
        ref={SyncDataRef}
        Sync_data={Sync_data}
        changeLoginInfo={changeLoginInfo}
      />
      <OnSuccessPopUp ref={successRef} />
      <ConfirmManga
        ref={refConfirmManga}
        idManga={dataHeader.idManga}
        idUser={idUser}
        successLike={(text, type) =>
          refSuccessLike.current.setModalVisible(text, type)
        }
        unlike={() => refMangaSettings.current.setState({ like: false })}
        unsubscribe={() =>
          refMangaSettings.current.setState({ subscribe: false })
        }
        unreadlater={() =>
          refMangaSettings.current.setState({ readlater: false })
        }
      />
      <SuccessLike ref={refSuccessLike} />
    </Animated.ScrollView>
  );
}
const styles = StyleSheet.create({
  control: {
    paddingTop: 30,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 0,
    height: 80,
    width: "100%",
    zIndex: 10,
  },
  control_background: {
    height: 80,
    backgroundColor: Color.mangaColor,
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 5,
  },
});

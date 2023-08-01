import React, { useState } from "react";

import { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  Pressable,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";

import { Color } from "../../variable/Color";
import { Font } from "../../variable/Font";
import SearchPopup from "../Popup/SearchPopup";
import { useEffect } from "react";
import axios from "axios";
import {
  EXPO_PUBLIC_API_AWS,
  EXPO_PUBLIC_API_URL,
} from "../../variable/constants";

export default function SearchTabBar({ navigation }) {
  const serverAWS = EXPO_PUBLIC_API_AWS;
  const server = EXPO_PUBLIC_API_URL;
  const loose_focus = useRef();
  const seach_modal = React.createRef(null);
  const transform_search = useRef(new Animated.Value(0)).current;
  const transf = transform_search.interpolate({
    inputRange: [0, 1],
    outputRange: ["120%", "100%"],
  });
  function transform() {
    Animated.timing(transform_search, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
    seach_modal.current.setModalVisible(1);
  }
  function back_transfrom() {
    Animated.timing(transform_search, {
      toValue: 0,

      useNativeDriver: false,
    }).start();

    loose_focus.current.blur();
  }
  const [searchContent, set_searchContent] = useState("");
  const [loading, set_loading] = useState(false);
  const [data, set_data] = useState([]);
  const cur_search = useRef(0);
  useEffect(() => {
    if (searchContent.length > 2) {
      set_loading(true);
      cur_search.current += 1;
      const cur = cur_search.current;
      axios.get(server + "/search/" + searchContent).then((res) => {
        if (cur == cur_search.current) {
          set_loading(false);
          set_data(res.data);
        }
      });
    } else {
      cur_search.current += 1;
      set_loading(false);
    }
  }, [searchContent]);

  return (
    <View>
      <View style={[styles.search_container]}>
        <Animated.View
          style={[styles.search_inside_container, { width: transf }]}
        >
          <TextInput
            ref={loose_focus}
            style={styles.input}
            onFocus={() => transform()}
            placeholder="Search"
            placeholderTextColor={Color.white}
            value={searchContent}
            onChangeText={set_searchContent}
          />
          <AntDesign
            name="search1"
            style={styles.searchButton}
            size={24}
            color="white"
          />
          <Pressable
            style={styles.cancel_button}
            onPress={() => {
              back_transfrom();
              seach_modal.current.setModalVisible(0);
              set_searchContent("");
              set_data([]);
            }}
          >
            <Text style={[Font.baseTitle, { fontSize: 16 }]}>Cancel</Text>
          </Pressable>
        </Animated.View>
      </View>

      <SearchPopup
        ref={seach_modal}
        remove_focus={() => loose_focus.current.blur()}
        loading={loading}
        data={data}
        navigation={navigation}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  search_container: {
    backgroundColor: Color.baseColor,
    height: 100,
    width: "100%",
    justifyContent: "center",
    paddingTop: 20,
  },
  search_inside_container: {
    backgroundColor: Color.baseColor,
    height: 50,
    alignItems: "center",
    opacity: 0.5,
    flexDirection: "row",
  },
  input: {
    marginLeft: 15,
    height: 40,
    width: "78%",
    backgroundColor: "#595959",
    borderRadius: 10,
    paddingLeft: 40,
    paddingRight: 20,
    color: Color.white,
  },
  searchButton: {
    position: "absolute",
    top: 12,
    left: 25,
  },
  cancel_button: {
    marginLeft: 13,
    zIndex: 10,
    height: 50,
    width: 80,

    justifyContent: "center",
  },
  search_background: {
    width: "100%",
    height: 700,
    backgroundColor: Color.defaultColor,
    position: "absolute",
    top: 100,
    padding: 15,
  },
});

import axios from "axios";
import React from "react";
import { useRef } from "react";

import { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from "react-native";
import { Color } from "../variable/Color";

import Linear from "../components/ChapterScreen/Linear";
import SliderScroll from "../components/ChapterScreen/SliderScroll";
import NavigateButton from "../components/ChapterScreen/NavigateButton";
import LoadingChapter from "../components/ChapterScreen/LoadingChapter";
import { useDispatch, useSelector } from "react-redux";
import { SetResumeReading } from "../redux/actions";
import { insertResume } from "../InteractServer/ResumeSave";
import {
  EXPO_PUBLIC_API_AWS,
  EXPO_PUBLIC_API_URL,
} from "../variable/constants";
// import ImageSize from "react-native-image-size";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const top = windowHeight / 3;
const bottom = (windowHeight / 3) * 2;
const serverAWS = EXPO_PUBLIC_API_AWS;
const server = EXPO_PUBLIC_API_URL;
export default function ChapterScreen({ route, navigation }) {
  const {
    chapterId,
    mangaTitle,
    dataChapter,
    chapterOrder,
    idManga,
    imageAPI,
    percent_read,
    total_height,
  } = route.params;

  const [cur_dataChapter, set_cur_dataChapter] = useState();
  const [chapterName, setChapterName] = useState();
  const [data, setdata] = useState([]);
  const [itemHeights, set_itemHeights] = useState([]);
  const [saveOrder, set_saveOrder] = useState();
  const [cur_posY, set_cur_posY] = useState(0);
  const image_resume = useRef("");
  let flag = useRef(0);

  const refLinear = useRef();
  const refSlider = useRef();
  const refNavigationButton = useRef();
  const refLoading = useRef();
  const scrollItem = useRef();
  const refPercent = useRef(0);
  const refTotalHeight = useRef(0);
  const refChapterName = useRef("");

  const chapterNameRoute = route.params.chapterName;
  const length = itemHeights.length - 1;
  const dispatch = useDispatch();
  const idUser = useSelector((state) => state.idUser);
  const userlog = useSelector((state) => state.userlog);

  useEffect(() => {
    const didBlurSubscription = navigation.addListener("blur", (e) => {
      const resume_data = {
        idManga: idManga,
        mangaTitle: mangaTitle,
        chapterName: refChapterName.current,
        chapterId: chapterId,
        percent_read: (refPercent.current / refTotalHeight.current) * 100,
        time_read: Date.now(),
        chapterOrder: chapterOrder,
        image_chapter: image_resume.current,
        total_height: refTotalHeight.current,
      };
      dispatch(SetResumeReading(resume_data));
      if (userlog) {
        resume_data["idUser"] = idUser;
        axios.post(server + "/resume_reading/add", resume_data);
      } else {
        insertResume(resume_data);
      }
    });
    return () => didBlurSubscription;
  }, [navigation]);

  useEffect(() => {
    let check = true;
    if (dataChapter) {
      set_cur_dataChapter(dataChapter);
    } else {
      axios.get(server + "/manga/" + idManga + "/chapter").then((res) => {
        if (check) {
          set_cur_dataChapter(res.data);
        }
      });
    }
    return () => (check = false);
  }, [dataChapter]);
  useEffect(() => {
    changeData(chapterId, chapterNameRoute, chapterOrder);
    image_resume.current = imageAPI;

    if (percent_read) {
      scrollItem.current.scrollToOffset({
        animated: false,
        offset: (percent_read / 100) * total_height,
      });
    }
  }, []);

  const getImageDimensionsFromUrl = (imageUrl) => {
    return new Promise((resolve, reject) => {
      Image.getSize(
        imageUrl,
        (width, height) => {
          resolve({ width, height });
        },
        (error) => {
          console.error("Error loading image:", error);
          reject(error);
        }
      );
    });
  };
  const processImageData = (data) => {
    let final_height = 0;
    const array = [];
    const promises = [];

    for (const element of data) {
      const promise = getImageDimensionsFromUrl(serverAWS + element.imgUrl)
        .then((dimensions) => {
          if (dimensions) {
            let height =
              Math.floor(
                (windowWidth * parseInt(dimensions.height)) /
                  parseInt(dimensions.width)
              ) + 15;
            final_height += height;
            array.push(height);
          } else {
            console.log("Failed to get image dimensions.");
          }
        })
        .catch((error) => {
          console.error("Error processing image data:", error);
        });

      promises.push(promise);
    }

    Promise.all(promises).then(() => {
      set_itemHeights(array);
      refTotalHeight.current = final_height - windowHeight;
      refSlider.current.setState({
        actual_height: final_height - windowHeight,
      });
      refLoading.current.setState({ show: false });
      // callback(data); // Call the callback function with the modified data
    });
  };
  const changeData = (_chapterId, _chapterName, _order = 0) => {
    const cur_flag = flag.current + 1;
    flag.current = cur_flag;
    refLoading.current.setState({ show: true });
    axios.get(server + "/chapter/" + _chapterId).then((res) => {
      if (flag.current == cur_flag) {
        setdata(res.data);

        processImageData(res.data);
      }
    });

    setChapterName(_chapterName);
    refChapterName.current = _chapterName;
    set_saveOrder(_order);
  };

  const renderItem = ({ item, index }) => {
    const _height = itemHeights[index] - 15;

    return (
      <TouchableWithoutFeedback
        onPress={(evt) => {
          scrollFlatlist(evt.nativeEvent.pageY, index);
        }}
      >
        <Image
          source={{ uri: serverAWS + item.imgUrl }}
          style={{
            width: windowWidth,
            height: _height ? _height : 0,
          }}
          fadeDuration={0}
        />
      </TouchableWithoutFeedback>
    );
  };
  const renderSeparator = () => <View style={styles.separator} />;
  const getItemLayout = (data, index) => {
    let length = itemHeights[index];
    const offset = itemHeights.slice(0, index).reduce((a, c) => a + c, 0);
    if (!length) {
      length = 0;
    }
    return { length, offset, index };
  };
  const scrollFlatlist = (press_pos, index) => {
    if (press_pos < top && index > 0) {
      scrollItem.current.scrollToIndex({
        index: index - 1,
        viewPosition: 0.5,
      });
    } else if (press_pos > bottom && index < length) {
      scrollItem.current.scrollToIndex({
        index: index + 1,
        viewPosition: 0.5,
      });
    } else {
      refLinear.current.setLinear();
      refSlider.current.setLinear();
      refNavigationButton.current.setLinear();
    }
  };
  const scrollToFlatlist = (posY) => {
    scrollItem.current.scrollToOffset({ animated: true, offset: posY });
  };

  return (
    <View>
      <LoadingChapter ref={refLoading} />

      <FlatList
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        ref={scrollItem}
        data={data}
        onScrollBeginDrag={() => {
          refLinear.current.hideLinear();
          refSlider.current.hideLinear();
          refNavigationButton.current.hideLinear();
        }}
        keyExtractor={(item) => item.imgUrl}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        maxToRenderPerBatch={60} // Reduce number in each render batch
        style={{ zIndex: 1 }}
        onScroll={(e) => {
          refSlider.current.setState({ value: e.nativeEvent.contentOffset.y });
          refPercent.current = e.nativeEvent.contentOffset.y;
        }}
      />

      <Linear
        ref={refLinear}
        navigation={navigation}
        mangaTitle={mangaTitle}
        chapterName={chapterName}
        dataChapter={cur_dataChapter}
        changeData={changeData}
      />
      <SliderScroll
        ref={refSlider}
        value={cur_posY}
        scrollOffset={scrollToFlatlist}
      />

      <NavigateButton
        ref={refNavigationButton}
        changeData={changeData}
        dataChapter={cur_dataChapter}
        saveOrder={saveOrder}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  separator: {
    backgroundColor: Color.defaultColor,
    height: 15,
  },
});

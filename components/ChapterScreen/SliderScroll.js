import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import { Color } from "../../variable/Color";

export default class SliderScroll extends Component {
  constructor(props) {
    super(props);
    this.refChapter = React.createRef();
    this.state = {
      linearVisible: false,
      timeout: null,
      value: 0,
      actual_height: 0,
    };
    this.windowHeight = Dimensions.get("window").height;
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  setLinear = () => {
    this.setState({ linearVisible: !this.state.linearVisible }, () => {
      if (this.state.linearVisible) {
        const timeout = setTimeout(this.hideAfter, 2500);
        this.setState({ timeout: timeout });
      } else {
        clearTimeout(this.state.timeout);
      }
    });
  };
  hideAfter = () => {
    this.setState({ linearVisible: false });
  };
  hideLinear = () => {
    if (this.state.linearVisible) {
      this.setState({ linearVisible: false });
      clearTimeout(this.state.timeout);
    }
  };

  render() {
    console.log(this.state.actual_height);
    return (
      <View
        style={[
          styles.containerSlider,
          this.state.linearVisible && { opacity: 0.95, zIndex: 4 },
        ]}
      >
        <Slider
          minimumTrackTintColor={Color.onBaseColor}
          containerStyle={{
            width: 300,
            zIndex: 2,
          }}
          value={1 - this.state.value / this.state.actual_height}
          vertical
          animateTransitions
          minimumValue={0}
          maximumValue={1}
          thumbStyle={{
            backgroundColor: "white",
            borderRadius: 9,
            height: 18,
            width: 18,
          }}
          trackStyle={{
            backgroundColor: Color.white,
            borderRadius: 10,
            height: 5,
          }}
          onValueChange={(e) => {
            console.log(this.state.actual_height);
            this.props.scrollOffset(
              this.state.actual_height - e[0] * this.state.actual_height
            );
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerSlider: {
    backgroundColor: Color.defaultColor,
    height: 320,
    width: 30,
    position: "absolute",
    top: 200,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    zIndex: 0,
    opacity: 0,
    elevation: 2,
  },
});

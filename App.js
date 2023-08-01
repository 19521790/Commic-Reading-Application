import React, { Component } from "react";

import Test from "./screen/Test";
import { NavigationContainer } from "@react-navigation/native";

import TabNavigation from "./components/TabNavigation";

import { createStore } from "redux";
import { Provider } from "react-redux";
import allReducer from "./redux/reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import { LogBox, StatusBar } from "react-native";
// LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
// LogBox.ignoreAllLogs(); //Ignore all log notifications

//test clone branch
const store = createStore(allReducer, composeWithDevTools());
//checkout

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar style="auto" backgroundColor="gray" />
          <TabNavigation />
        </NavigationContainer>
      </Provider>
      // <Test />
    );
  }
}

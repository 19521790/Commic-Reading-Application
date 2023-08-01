import React, { Component } from "react";
import { Text, View } from "react-native";
import axios from "axios";
import {
  EXPO_PUBLIC_API_AWS,
  EXPO_PUBLIC_API_URL,
} from "../variable/constants";
const serverAWS = EXPO_PUBLIC_API_AWS;
const server = EXPO_PUBLIC_API_URL;
//insert user if not exist
export default function PostUser(data) {
  axios.get(server + "/users/" + data.UserEmail).then((response) => {
    // console.log(response);
    if (!response.data) {
      //function post user to server
      axios.post(server + "/users/", data).then((response) => {
        // console.log(response.data);
      });
    }
  });
}

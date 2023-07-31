import React, { Component } from "react";
import { Text, View } from "react-native";
import axios from "axios";
const server = "http://13.250.45.19:3000";
//insert user if not exist
export default function PostUser(data) {
  axios.get(server + "/users/" + data.UserEmail).then((response) => {
    console.log(response);
    if (!response.data) {
      //function post user to server
      axios.post(server + "/users/", data).then((response) => {
        console.log(response.data);
      });
    }
  });
}

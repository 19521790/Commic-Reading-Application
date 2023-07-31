import { StripeProvider } from "@stripe/stripe-react-native";
import React, { useState, useEffect, useRef } from "react";
import { Platform, Alert } from "react-native";
const server = "http://13.250.45.19:3000";
import Card from "./Card";

export const publish =
  "pk_test_51KFt1gF2EZ3ThaNawwPxRUmGLA4U5dM8EsJylkm4FsSLOaF12kMNknwGcr3PkIhDgfQWmPkeN6L06UlYODn5xQAb00EHXtzkKZ";

export const API_URL = server;
// Platform.OS === 'android' ? 'http://192.168.1.3:3000' : 'http://192.168.1.3:3000'

// export async function fetchPublishableKey() {
//     try {
//         const response = await fetch(`${API_URL}/key`)
//         const { publishableKey } = await response.json()
//         console.log(publishableKey)
//         return publishableKey
//     } catch (e) {
//         console.log(e)
//         console.warn('Unable to fetch publishable key. Is your server running?')
//         Alert.alert('Error', 'Unable to fetch publishable key. Is your server running?')
//     }
// }

function Stripe({ innerRef }) {
  const [publishableKey, setPublishableKey] = useState(publish);

  // useEffect(() => {
  //     async function init() {
  //         const publishableKey = await fetchPublishableKey()
  //         if (publishableKey) {
  //             setPublishableKey(publishableKey)
  //         }
  //     }
  //     init()
  // })

  return (
    <StripeProvider publishableKey={publishableKey}>
      <Card innerRef={innerRef} />
    </StripeProvider>
  );
}

export default Stripe;

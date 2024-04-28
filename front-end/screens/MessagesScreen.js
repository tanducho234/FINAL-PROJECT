import firestore from "../config/firebase";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  onSnapshot,
  doc,
} from "firebase/firestore";

import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { Tab, ButtonGroup } from "@rneui/themed";
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from "../styles/MessageStyles";
import axios from "axios"; // Assuming you'll make API requests to fetch borrow requests
import AsyncStorage from "@react-native-async-storage/async-storage";
const MessagesScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderId] = useState("");
  const [senderName, setSenderName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("aaa", response.data);
        setSenderId(response.data._id);
        setSenderName(response.data.firstName + " " + response.data.lastName);
        const oneUserToManyUsers = collection(firestore, response.data._id);
        const unsub = onSnapshot(oneUserToManyUsers, (snapshot) => {
          console.log("Snapshot received: from message screen");
          const data = snapshot.docs.map((doc) => ({
            receiverId: doc.id,
            ...doc.data(),
          }));
          setMessages(data);
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();

    console.log("useEffect");
  }, []);

  return (
    <Container>
      <ScrollView horizontal={false}>
        {messages.map((item) => (
          <Card
            key={item.receiverId}
            onPress={() =>
              navigation.navigate("Chat", {
                receiverName: item.receiverName,
                senderId: senderId,
                senderName: senderName,
                receiverId: item.receiverId,
                senderAvatarViewLink: item.senderAvatarViewLink,
                receiverAvatarViewLink: item.receiverAvatarViewLink,
              })
            }
          >
            <UserInfo>
              <UserImgWrapper>
                <UserImg
                  source={
                    item.receiverAvatarViewLink
                      ? { uri: item.receiverAvatarViewLink }
                      : require("../image/gray-profile.png")
                  }
                />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.receiverName}</UserName>
                  {/* <PostTime>{item.messageTime}</PostTime> */}
                </UserInfoText>
                <MessageText>{item.latestMessage}</MessageText>
              </TextSection>
            </UserInfo>
          </Card>
        ))}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  requestContainer: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 8,
  },
  requestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "start",
    marginBottom: 8,
  },
  requestInfo: {
    flex: 1,
  },
});

export default MessagesScreen;

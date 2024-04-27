import React, { useEffect, useState, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";

import { Text, View } from "react-native";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  onSnapshot,
  doc,
  addDoc,
  setDoc,
  where,
} from "firebase/firestore";
import firestore from "../config/firebase";
import { getDoc } from "firebase/firestore";
const ChatScreen = ({ route, navigation }) => {
  const senderId = route.params.senderId;
  const receiverId = route.params.receiverId;
  const viewLink = route.params.viewLink;
  const senderAvatarViewLink = route.params.senderAvatarViewLink;
  const receiverAvatarViewLink = route.params.receiverAvatarViewLink;
  const senderName = route.params.senderName;
  const receiverName = route.params.receiverName;

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("fetchUserData", senderId, receiverId);
      const sent = collection(firestore, senderId, receiverId, `messages`);
      const sortedQuery = query(sent, orderBy("createdAt", "desc"));

      const unsub = onSnapshot(sortedQuery, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt,
          user: {
            _id: doc.data().senderId,
            avatar: receiverAvatarViewLink,
          },
        }));
        // console.log(data);
        setMessages(data);
      });
    };

    fetchUserData();
  }, []); // Empty dependency array to run the effect only once on component mount
  const onSend = useCallback((message) => {
    const initialMessageSent = {
      text: message[0].text,
      createdAt: message[0].createdAt.getTime(),
      senderId: senderId,
    };
    // const initialMessageReceived = {
    //   text: message[0].text,
    //   createdAt: message[0].createdAt.getTime(),
    //   senderId: receiverId,
    // };

    const messageRef = collection(firestore, "messages");
    addDoc(
      collection(firestore, senderId, receiverId, "messages"),
      initialMessageSent
    );
    addDoc(
      collection(firestore, receiverId, senderId, "messages"),

      initialMessageSent
    );

    //update latestmessage
    setDoc(
      doc(firestore, senderId, receiverId),
      {
        latestMessage: message[0].text,
        senderAvatarViewLink: senderAvatarViewLink,
        receiverAvatarViewLink: receiverAvatarViewLink,
        receiverName: receiverName,
      },
      { merge: true }
    );
    setDoc(
      doc(firestore, receiverId, senderId),
      {
        latestMessage: message[0].text,
        senderAvatarViewLink: receiverAvatarViewLink,
        receiverAvatarViewLink: senderAvatarViewLink,
        receiverName: senderName,
      },
      { merge: true }
    );
    // setMessages((previousMessages) =>
    // setMessages(...messages, message);
    // );
  }, []);
  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => {
        onSend(messages);
      }}
      user={{
        _id: senderId,
      }}
    />
  );
};

export default ChatScreen;

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
      const sent = collection(firestore, `${senderId}/${receiverId}/message`);
      const sortedQuery = query(sent, orderBy("createdAt", "desc"));
      onSnapshot(sortedQuery, (snapshot) => {
        const uniqueMessages = [];
        snapshot.docs.forEach((doc) => {
          const message = {
            _id: doc.id,
            text: doc.data().text,
            createdAt: doc.data().createdAt,
            user: {
              _id: senderId,
              // avatar:receiverViewLink
            },
          };
          // Check if the message already exists in uniqueMessages array based on its _id
          const existingMessageIndex = uniqueMessages.findIndex((m) => m._id === message._id);
          if (existingMessageIndex === -1) {
            // If not found, add the message to the array
            uniqueMessages.push(message);
          } else {
            // If found, update the message in the array
            uniqueMessages[existingMessageIndex] = message;
          }
        });
      
        // Sort messages from the latest to the oldest based on createdAt timestamp
        const sortedMessages = [...messages, ...uniqueMessages].sort((a, b) => b.createdAt - a.createdAt);
        setMessages(sortedMessages);
      });
      const received = collection(firestore, `${receiverId}/${senderId}/message`);
      const sortedQuery2 = query(received, orderBy("createdAt", "desc"));
      onSnapshot(sortedQuery2, (snapshot) => {
        
        const uniqueMessages = [];
        snapshot.docs.forEach((doc) => {
          const message = {
            _id: doc.id,
            text: doc.data().text,
            createdAt: doc.data().createdAt,
            user: {
              _id: receiverId,
              // avatar:receiverViewLink
            },
          };
          // Check if the message already exists in uniqueMessages array based on its _id
          const existingMessageIndex = uniqueMessages.findIndex((m) => m._id === message._id);
          if (existingMessageIndex === -1) {
            // If not found, add the message to the array
            uniqueMessages.push(message);
          } else {
            // If found, update the message in the array
            uniqueMessages[existingMessageIndex] = message;
          }
        });

        // Sort messages from the latest to the oldest based on createdAt timestamp
        const sortedMessages = [...messages, ...uniqueMessages].sort((a, b) => b.createdAt - a.createdAt);
setMessages(sortedMessages);
      }
      );
    };

    fetchUserData();

  }, []); // Empty dependency array to run the effect only once on component mount
  const onSend = useCallback((message) => {
    const initialMessage = {
      text: message[0].text,
      createdAt: message[0].createdAt.getTime(),
    };

    const messageRef = collection(firestore, senderId, receiverId, "message");
    addDoc(messageRef, initialMessage);

    //update latestmessage
    setDoc(
      doc(firestore, senderId, receiverId),
      {
        latestMessage: message[0].text,
        senderAvatarViewLink: senderAvatarViewLink,
        receiverAvatarViewLink: receiverAvatarViewLink,
        receiverName:receiverName
      },
      { merge: true }
    );
    setDoc(
      doc(firestore, receiverId, senderId),
      {
        latestMessage: message[0].text,
        senderAvatarViewLink: receiverAvatarViewLink,
        receiverAvatarViewLink: senderAvatarViewLink,
        receiverName:senderName
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

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Settings = ({ navigation, route }) => {
  const { handleLogoutSuccess } = route.params;

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const navigateToSecurity = () => {
    console.log("Security function");
  };

  const navigateToNotifications = () => {
    console.log("Notifications function");
  };

  const navigateToPrivacy = () => {
    console.log("Privacy function");
  };

  const navigateToAccountBalance = () => {
    navigation.navigate("AccountBalance");
  };

  const navigateToSupport = () => {
    console.log("Support function");
  };

  const navigateToTermsAndPolicies = () => {
    console.log("Terms and Policies function");
  };

  const navigateToFreeSpace = () => {
    console.log("Free Space function");
  };

  const navigateToDateSaver = () => {
    console.log("Date saver");
  };

  const navigateToReportProblem = () => {
    console.log("Report a problem");
  };

  const addAccount = () => {
    console.log("Add account");
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    // Update the state to indicate that the user is no longer authenticated
    handleLogoutSuccess();
    console.log("Logout successful");
  };

  const accountItems = [
    {
      icon: "person-outline",
      text: "Edit Profile",
      action: navigateToEditProfile,
    },
    { icon: "security", text: "Security", action: navigateToSecurity },
    {
      icon: "notifications-none",
      text: "Notifications",
      action: navigateToNotifications,
    },
    { icon: "lock-outline", text: "Privacy", action: navigateToPrivacy },
    {
      icon: "credit-card",
      text: "Account Balance",
      action: navigateToAccountBalance,
    },
  ];

  const supportItems = [
    {
      icon: "credit-card",
      text: "My Subscription",
      action: navigateToAccountBalance,
    },
    { icon: "help-outline", text: "Help & Support", action: navigateToSupport },
    {
      icon: "info-outline",
      text: "Terms and Policies",
      action: navigateToTermsAndPolicies,
    },
  ];

  const cacheAndCellularItems = [
    {
      icon: "delete-outline",
      text: "Free up space",
      action: navigateToFreeSpace,
    },
    { icon: "save-alt", text: "Date Saver", action: navigateToDateSaver },
  ];

  const actionsItems = [
    {
      icon: "outlined-flag",
      text: "Report a problem",
      action: navigateToReportProblem,
    },
    { icon: "people-outline", text: "Add Account", action: addAccount },
    { icon: "logout", text: "Log out", action: logout },
  ];

  const renderSettingsItem = ({ icon, text, action }) => (
    <TouchableOpacity
      onPress={action}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingLeft: 12,
        backgroundColor: "rgba(36, 39, 96, 0.05)",
        borderRadius: 12,
        marginBottom: 8,
      }}
    >
      <MaterialIcons name={icon} size={24} color="black" />
      <Text
        style={{
          marginLeft: 12,
          fontWeight: "600",
          fontSize: 16,
          color: "black",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: "red" }}>
    <View style={{ marginHorizontal: 24, marginVertical: 5 }}>
      {/* <Pressable
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            left: 0,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
        </Pressable>
          
        <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 8 }}>
          Settings
        </Text> */}

      <ScrollView>
        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
            Account
          </Text>
          {accountItems.map((item, index) => (
            <React.Fragment key={index}>
              {renderSettingsItem(item)}
            </React.Fragment>
          ))}
        </View>

        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
            Support & About
          </Text>
          {supportItems.map((item, index) => (
            <React.Fragment key={index}>
              {renderSettingsItem(item)}
            </React.Fragment>
          ))}
        </View>

        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
            Cache & Cellular
          </Text>
          {cacheAndCellularItems.map((item, index) => (
            <React.Fragment key={index}>
              {renderSettingsItem(item)}
            </React.Fragment>
          ))}
        </View>

        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
            Actions
          </Text>
          {actionsItems.map((item, index) => (
            <React.Fragment key={index}>
              {renderSettingsItem(item)}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
    // </SafeAreaView>
  );
};

export default Settings;

import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../utils/theme";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("PROFILE");
        }}
      >
        <Card>
          <View style={styles.card}>
            <Ionicons name="md-person" size={30} color={theme.colors.primary} />
            <Text style={styles.text}>MANAGE PROFILE</Text>
          </View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("MANAGE METERS");
        }}
      >
        <Card>
          <View style={styles.card}>
            <Ionicons
              name="md-speedometer"
              size={30}
              color={theme.colors.primary}
            />
            <Text style={styles.text}>MANAGE METERS</Text>
          </View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("PAYMENT FLOW");
        }}
      >
        <Card>
          <View style={styles.card}>
            <Ionicons
              name="ios-list-box"
              size={30}
              color={theme.colors.primary}
            />
            <Text style={styles.text}>MANAGE PAYMENT FLOW</Text>
          </View>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("MANAGE COMPLAINTS");
        }}
      >
        <Card>
          <View style={styles.card}>
            <Ionicons
              name="ios-people"
              size={30}
              color={theme.colors.primary}
            />
            <Text style={styles.text}>MANAGE COMPLAINTS</Text>
          </View>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 10,
    color: "#8d7f3e",
    fontWeight: "bold",
  },
});

export default HomeScreen;

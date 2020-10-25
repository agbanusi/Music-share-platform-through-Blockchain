import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Card } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import CardComponent from "../components/Card";
import historyData from "../DummyData/data";
import Loading from "../components/Loading";
import { theme } from "../utils/theme";

const TransactionHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [availableUnit, setAvailableUnit] = useState(333);
  const isFocused = useIsFocused();

  useEffect(() => {
    setIsLoading(true);
  }, [isFocused]);

  setTimeout(() => {
    setIsLoading(false);
  }, 5000);

  const meterOptions = [
    {
      label: "HOME",
      value: "home",
    },
    {
      label: "OFFICE",
      value: "office",
    },
  ];

    // function to filter energy usage for different meter
    const handleMeter = (text) => {
      if (text.value === "home") {
        setAvailableUnit(333)
      };
      if (text.value === "office") {
        setAvailableUnit(207)
      };
    }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <View style={styles.componentView}>
            <Text
              style={{
                color: theme.colors.secondary,
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              METER
            </Text>
            <DropDownPicker
              items={meterOptions}
              defaultValue="home"
              defaultIndex={5}
              activeLabelStyle={{ color: theme.colors.primary }}
              containerStyle={styles.dropdown}
              style={{ paddingHorizontal: 10 }}
              onChangeItem={(text) => handleMeter(text)}
            />
          </View>
          <View style={styles.container}>
            <ScrollView>
              <Card
                containerStyle={{ backgroundColor: "#FFF", borderRadius: 5 }}
              >
                <Card.Title>AVAILABLE UNIT</Card.Title>
                <Text style={styles.text}>{availableUnit}</Text>
              </Card>
              <View style={styles.divider}></View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.recentText}>MOST RECENT</Text>
                <Card containerStyle={styles.card}>
                  <View style={styles.history}>
                    <View>
                      <Text
                        style={{
                          color: theme.colors.secondary,
                          fontWeight: "bold",
                        }}
                      >
                        UNIT LOADED
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: theme.colors.secondary,
                          fontWeight: "bold",
                        }}
                      >
                        DATE TIME
                      </Text>
                    </View>
                  </View>
                </Card>
                {historyData.map((data, index) => {
                  return (
                    <CardComponent
                      key={index}
                      date={data.date}
                      unitLoaded={data.unitLoaded}
                    />
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F8F9",
  },
  componentView: {
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    height: 40,
    width: 100,
    marginLeft: 18,
  },
  text: {
    textAlign: "center",
    fontSize: 35,
    color: theme.colors.accent,
    fontWeight: "bold",
  },
  recentText: {
    color: theme.colors.secondary,

    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 2,
    marginTop: 25,
    borderBottomColor: "#D3D3D3",
  },
  card: {
    justifyContent: "flex-start",
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.5,
    marginVertical: 0,
  },
  history: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 18,
  },
});

export default TransactionHistory;

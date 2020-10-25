import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import ToggleSwitch from "toggle-switch-react-native";
import { useIsFocused } from "@react-navigation/native";
import Loading from "../components/Loading";
import { theme } from "../utils/theme";

const SmartAssistant = () => {
  const [consumptionSwitch, setConsumptionSwitch] = useState(false);
  const [rechargeSwitch, setRechargeSwitch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alarmMinThreshold, setAlarmMinThreshold] = useState("");
  const [alarmMinThresholdError, setAlarmMinThresholdError] = useState("");
  const [rechargeMinThreshold, setRechargeMinThreshold] = useState("");
  const [rechargeMinThresholdError, setRechargeMinThresholdError] = useState(
    ""
  );
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [rechargeAmountError, setRechargeAmountError] = useState("");
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

  // toggle switch to set alarm for minimum threshold
  const handleAlarmToggler = () => {
    if (!alarmMinThreshold.length) {
      setAlarmMinThresholdError("This field cannot be empty");
      setTimeout(() => {
        setAlarmMinThresholdError("");
      }, 2000);
      return;
    }
    if (alarmMinThreshold.length) {
      setConsumptionSwitch(true);
    }
    setConsumptionSwitch(!consumptionSwitch);
  };

  // toggle switch to set minimum recharge threshold and amount to recharge
  const handleRechargeToggler = () => {
    if (!rechargeMinThreshold.length) {
      setRechargeMinThresholdError("This field cannot be empty");
      setTimeout(() => {
        setRechargeMinThresholdError("");
      }, 2000);
      return;
    }
    if (!rechargeAmount.length) {
      setRechargeAmountError("This field cannot be empty");
      setTimeout(() => {
        setRechargeAmountError("");
      }, 2000);
      return;
    }
    if (rechargeMinThreshold.length && rechargeAmount.length) {
      setRechargeSwitch(true);
    }
    setRechargeSwitch(!rechargeSwitch);
  };

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
              onChangeItem={(item) => console.log(item.value)}
            />
          </View>
          <View style={styles.container}>
            <View style={{ paddingHorizontal: 10, marginTop: 15 }}>
              <ToggleSwitch
                isOn={consumptionSwitch}
                onColor={theme.colors.primary}
                offColor="grey"
                label="SET CONSUMPTION ALARM"
                labelStyle={{
                  color: theme.colors.secondary,
                  fontWeight: "bold",
                }}
                onToggle={handleAlarmToggler}
              />
            </View>
            <View style={{ paddingHorizontal: 18, marginTop: 15 }}>
              <Text style={styles.grey}>MINIMUM THRESHOLD (UNITS)</Text>
              <TextInput
                style={
                  !consumptionSwitch
                    ? styles.textInput
                    : { ...styles.textInput, backgroundColor: "#D3D3D3" }
                }
                value={alarmMinThreshold}
                editable={!consumptionSwitch}
                onChangeText={(text) => setAlarmMinThreshold(text)}
              />
              {!alarmMinThresholdError.length ? null : (
                <Text style={styles.error}>{alarmMinThresholdError}</Text>
              )}
            </View>
            <View style={{ paddingHorizontal: 10, marginTop: 40 }}>
              <ToggleSwitch
                isOn={rechargeSwitch}
                onColor={theme.colors.primary}
                offColor="grey"
                label="SET AUTO RECHARGE"
                labelStyle={{
                  color: theme.colors.secondary,
                  fontWeight: "bold",
                }}
                onToggle={handleRechargeToggler}
              />
            </View>
            <View style={{ paddingHorizontal: 18, marginTop: 15 }}>
              <Text style={styles.grey}>MINIMUM THRESHOLD (UNITS)</Text>
              <TextInput
                style={
                  !rechargeSwitch
                    ? styles.textInput
                    : { ...styles.textInput, backgroundColor: "#D3D3D3" }
                }
                value={rechargeMinThreshold}
                editable={!rechargeSwitch}
                onChangeText={(text) => setRechargeMinThreshold(text)}
              />
              {!rechargeMinThresholdError.length ? null : (
                <Text style={styles.error}>{rechargeMinThresholdError}</Text>
              )}
            </View>
            <View style={{ paddingHorizontal: 18, marginTop: 15 }}>
              <Text style={styles.grey}>AMOUNT TO RECHARGE (UNITS)</Text>
              <TextInput
                style={
                  !rechargeSwitch
                    ? styles.textInput
                    : { ...styles.textInput, backgroundColor: "#D3D3D3" }
                }
                value={rechargeAmount}
                editable={!rechargeSwitch}
                onChangeText={(text) => setRechargeAmount(text)}
              />
              {!rechargeAmountError.length ? null : (
                <Text style={styles.error}>{rechargeAmountError}</Text>
              )}
            </View>
            <View style={{ paddingHorizontal: 18, marginTop: 15 }}>
              <Text style={{ fontWeight: "normal" }}>
                ** Current pricing will be used
              </Text>
            </View>
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
  textInput: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 10,
    marginTop: 5,
    borderRadius: 5,
    borderWidth: 0.4,
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
  grey: { color: "grey" },
  error: { color: theme.colors.error },
});

export default SmartAssistant;

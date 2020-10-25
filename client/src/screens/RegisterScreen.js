import React, { useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, Text, View, TouchableOpacity, Keyboard } from "react-native";
import { registerAgentAction } from "../store/modules/auth/index";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { theme } from "../utils/theme";
import Logo from "../components/Logo";

const RegisterScreen = ({ navigation, registerUser, isLoading }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const { payload } = await registerUser({ email, username, password });
    if (payload.status === "success") {
      navigation.navigate("Login");
    }
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <Logo />

      <Text style={styles.header}>REGISTER</Text>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Username"
        returnKeyType="next"
        value={username}
        onChangeText={(text) => setUsername(text)}
        autoCapitalize="none"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      <Button mode="contained" loading={isLoading} onPress={handleSubmit}>
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.accent,
    paddingVertical: 14,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});

const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  registerUser: (payload) => dispatch(registerAgentAction(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);

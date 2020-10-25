import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { connect } from "react-redux";
import { loginAction } from "../store/modules/auth/index";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { theme } from "../utils/theme";
import Logo from "../components/Logo";

const LoginScreen = ({ navigation, logUserIn, isLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: null, password: null });

  const handleSubmit = async () => {
    const { payload } = await logUserIn({ email, password });

    if (payload.status === "Failed") {
      setError({
        email: "Invalid email/password",
        password: "Invalid email/password",
      });

      setTimeout(() => {
        setError({
          email: null,
          password: null,
        });
      }, 2000);
    }

    if (payload.status === "success") {
      navigation.reset({
        index: 0,
        routes: [{ name: "ACCOUNT" }],
      });
    }
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <Logo />

      <Text style={styles.header}>LOGIN</Text>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        errorText={error.email}
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password}
        onChangeText={(text) => {setPassword(text)}}
        secureTextEntry
        errorText={error.password}
      />

      <Button mode="contained" loading={isLoading} onPress={handleSubmit}>
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Sign up</Text>
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
  logUserIn: (payload) => dispatch(loginAction(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

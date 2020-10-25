import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./src/store/index";
import { AppNavigator } from "./AppNavigator";
import { startSocketIO } from "./src/services/index";

const App = (props) => {
  useEffect(() => {
    startSocketIO();
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator {...props} />
    </Provider>
  );
};

export default App;

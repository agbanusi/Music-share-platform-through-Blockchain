import AsyncStorage from "@react-native-community/async-storage";
import Axios from "axios";
import socketIO from "socket.io-client";

export const request = Axios.create({});
request.defaults.baseURL = "http://localhost:8082";
request.defaults.timeout = 1000;

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {
    console.error(error);
    return error;
  }
};

/**
 * @description - This function returns data from all post requests that will be made by the client
 * @param {Object} data - The payload the clients wants to create
 * @param {String} URL - The backend endpoint to access
 * @param {Object} config - The configuration object of the request
 * @returns {Object} - returns the response data of the request from the server
 */
export const post = async (URL, data) => {
  try {
    const token = await getToken();
    const res = await request.post(URL, data, {
      headers: {
        Authorization: token,
      },
    });
    return { errorStatus: false, ...res };
  } catch (err) {
    return err;
  }
};

/**
 * @description - This function returns data from all get requests that will be made by the client
 * @param {String} URL - The backend endpoint to access
 * @param {Object} config - The configuration object of the request
 * @returns {Object} - returns the response data of the request from the server
 */
export const get = async (URL) => {
  try {
    const token = await getToken();
    const res = await request.get(URL, {
      headers: {
        Authorization: token,
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

/**
 * @description - This function returns data from all put requests that will be made by the client
 * @param {Object} data - The payload the clients wants to update with
 * @param {String} URL - The backend endpoint to access
 * @param {Object} config - The configuration object of the request
 * @returns {Object} - returns the response data of the request from the server
 */
export const put = async (data, URL) => {
  try {
    const token = await getToken();
    const res = await request.put(URL, data, {
      headers: {
        Authorization: token,
      },
    });
    return res;
  } catch (err) {
    return err;
  }
};

// Initialize Socket IO
const socket = socketIO("http://localhost:8082");

export const startSocketIO = () => {
  socket.connect();
  socket.on("connecting", (socket) => {
    console.log("connected to socket server", socket);
  });

  socket.on('accepted', (meters) => {
    console.log(meters)
  });

  socket.on('update', (data) => {
    console.log(data)
  });
};

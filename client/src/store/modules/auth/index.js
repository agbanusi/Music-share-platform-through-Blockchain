import AsyncStorage from "@react-native-community/async-storage";
import {
  REQUEST_ACTION,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  GET_DETAILS_SUCCESS,
  GET_DETAILS_FAILURE,
} from "./actionTypes";
import { post, get } from "../../../services/index";

export const requestAction = () => ({
  type: REQUEST_ACTION,
});

export const loginUser = (login) => ({
  type: LOGIN_SUCCESS,
  payload: login,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const registerUser = (register) => ({
  type: REGISTER_SUCCESS,
  payload: register,
});

export const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  payload: error,
});

export const detailsSuccess = (payload) => ({
  type: GET_DETAILS_SUCCESS,
  payload,
});

export const detailsFailure = (error) => ({
  type: GET_DETAILS_FAILURE,
  payload: error,
});

export const loginAction = (payload) => async (dispatch) => {
  dispatch(requestAction());
  try {
    const { data } = await post("/login", payload);
    const { token } = data;
    if (token) {
      await AsyncStorage.setItem("token", token);
    }
    return dispatch(loginUser(data));
  } catch (error) {
    return dispatch(loginFailure(error.response.data));
  }
};

export const registerAgentAction = (payload) => async (dispatch) => {
  dispatch(requestAction());
  try {
    const { data } = await post("/register", payload);
    return dispatch(registerUser(data));
  } catch ({ response = null }) {
    return dispatch(registerFailure(response && response.data));
  }
};

export const getDetailsAction = (userId) => async (dispatch) => {
  dispatch(requestAction());
  try {
    const { data } = await get(`/details/${26}`);
    return dispatch(detailsSuccess(data));
  } catch ({ response = null }) {
    return dispatch(detailsFailure(response && response.data));
  }
};

export const initialState = {
  data: {},
  isLoading: false,
  error: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_ACTION:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
      };
    case REGISTER_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case GET_DETAILS_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
      };
    case GET_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default reducer;

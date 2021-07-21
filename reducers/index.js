import AppTypes from '../constants/AppTypes';
import CallTypes from '../constants/CallTypes';
import UserTypes from '../constants/UserTypes';

const initialState = {
  token: null,
  userId: null,
  accountId: null,
  phoneNumber: null,
  isActive: false,
  isInitialized: false,
  messages: [],
  calls: [],
  activationToken: '',
  activePhoneNumber: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UserTypes.SET_USER_ID:
    {
      const { userId } = action.payload;
      return {
        ...state,
        userId,
      };
    }
    case UserTypes.SET_TOKEN:
    {
      const { token } = action.payload;
      return {
        ...state,
        token,
      };
    }
    case UserTypes.SET_PHONE_NUMBER:
    {
      const { phoneNumber } = action.payload;
      return {
        ...state,
        phoneNumber,
      };
    }
    case UserTypes.SET_ACCOUNT_ID:
    {
      const { accountId } = action.payload;
      return {
        ...state,
        accountId,
      };
    }
    case UserTypes.SET_IS_ACTIVE:
    {
      const { isActive } = action.payload;
      return {
        ...state,
        isActive,
      };
    }
    case UserTypes.SET_MESSAGES:
    {
      const { messages } = action.payload;
      return {
        ...state,
        messages,
      };
    }
    case UserTypes.ADD_MESSAGE:
    {
      const { message } = action.payload;
      return {
        ...state,
        messages: [
          message,
          ...state.messages,
        ],
      };
    }
    case UserTypes.SET_CALLS:
    {
      const { calls } = action.payload;
      return {
        ...state,
        calls,
      };
    }
    case UserTypes.SET_ACTIVATION_TOKEN:
    {
      const { activationToken } = action.payload;
      return {
        ...state,
        activationToken,
      };
    }
    case CallTypes.SET_ACTIVE_PHONE_NUMBER:
    {
      const { activePhoneNumber } = action.payload;
      return {
        ...state,
        activePhoneNumber,
      };
    }
    case AppTypes.SET_IS_INITIALIZED:
    {
      const { isInitialized } = action.payload;
      return {
        ...state,
        isInitialized,
      };
    }
    default:
      return state;
  }
};

export const getUserId = state => (state.userId < 1) ? null : state.userId;
export const getToken = state => state.token;
export const getPhoneNumber = state => state.phoneNumber;
export const getAccountId = state => state.accountId;
export const getMessages = state => state.messages;
export const getCalls = state => state.calls;
export const getActivePhoneNumber = state => state.activePhoneNumber;
export const getActivationToken = state => state.activationToken;
export const getIsInitialized = state => state.isInitialized;
export const getIsActiveUser = state => (state.isActive && state.token && state.phoneNumber && state.accountId && state.token.length > 0 && state.phoneNumber.length > 0 && state.accountId.length > 0) ? true : false;
export const getIsLoggedIn = state => (state.token && state.phoneNumber && state.token.length > 0 && state.phoneNumber.length > 0) ? true : false;

export default reducer;

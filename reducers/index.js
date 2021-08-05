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
  isAccountCallInProgress: false,
  callState: '',
  isCallInProgress: false,
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
    case CallTypes.SET_CALL:
    {
      const { callState } = action.payload;
      return {
        ...state,
        callState,
      };
    }
    case CallTypes.SET_IS_ACCOUNT_CALL_IN_PROGRESS:
    {
      const { isAccountCallInProgress } = action.payload;
      return {
        ...state,
        isAccountCallInProgress,
      };
    }
    case CallTypes.SET_IS_CALL_IN_PROGRESS:
    {
      const { isCallInProgress } = action.payload;
      return {
        ...state,
        isCallInProgress,
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

export const getUserId = state => (state.default.userId < 1) ? null : state.default.userId;
export const getToken = state => state.default.token;
export const getPhoneNumber = state => state.default.phoneNumber;
export const getAccountId = state => state.default.accountId;
export const getMessages = state => state.default.messages;
export const getCalls = state => state.default.calls;
export const getActivePhoneNumber = state => state.default.activePhoneNumber;
export const getCallState = state => state.default.callState;
export const getIsAccountCallActive = state => state.default.isAccountCallInProgress;
export const getIsCallInProgress = state => state.default.isCallInProgress;
export const getActivationToken = state => state.default.activationToken;
export const getIsInitialized = state => state.default.isInitialized;
export const getIsActiveUser = state => (state.default.isActive && state.default.token && state.default.phoneNumber && state.default.accountId && state.default.token.length > 0 && state.default.phoneNumber.length > 0 && state.default.accountId.length > 0) ? true : false;
export const getIsLoggedIn = state => (state.default.token && state.default.phoneNumber && state.default.token.length > 0 && state.default.phoneNumber.length > 0) ? true : false;

export default reducer;

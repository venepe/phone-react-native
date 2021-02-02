import UserTypes from '../constants/UserTypes';

const initialState = {
  token: null,
  userId: null,
  phoneNumber: '+13128151992',
  isActive: false,
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
    case UserTypes.SET_IS_ACTIVE:
    {
      const { isActive } = action.payload;
      return {
        ...state,
        isActive,
      };
    }
    default:
      return state;
  }
};

export const getUserId = state => (state.userId < 1) ? null : state.userId;
export const getToken = state => state.token;
export const getPhoneNumber = state => state.phoneNumber;
export const getIsActiveUser = state => (state.isActive && state.token && state.phoneNumber && state.token.length > 0 && state.phoneNumber.length > 0) ? true : false;
export const getIsLoggedIn = state => (state.token && state.phoneNumber && state.token.length > 0 && state.phoneNumber.length > 0) ? true : false;

export default reducer;

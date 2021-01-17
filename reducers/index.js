import UserTypes from '../constants/UserTypes';

const initialState = {
  token: null,
  userId: null,
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
    default:
      return state;
  }
};

export const getUserId = state => (state.userId < 1) ? null : state.userId;
export const getToken = state => state.token;

export default reducer;

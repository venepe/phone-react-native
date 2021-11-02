import _ from 'lodash';
import EssentialTypes from '../constants/EssentialTypes';

const initialState = {
  essentials: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case EssentialTypes.SET_ESSENTIALS:
    {
      const essentials = action.payload.essentials || [];
      return {
        ...state,
        essentials,
      };
    }
    case EssentialTypes.ADD_ESSENTIAL:
    {
      const { essentials } = state;
      const { essential } = action.payload;
      const didFindEssentialById = essentials.find(elm => elm.id === essential.id);
      if (didFindEssentialById) {
        return {
          ...state,
        };
      } else {
        return {
          ...state,
          essentials: [ ...state.essentials, essential ],
        };
      }
    }
    case EssentialTypes.DELETE_ESSENTIAL:
    {
      const { essentials } = state;
      const { essentialId } = action.payload;
      _.remove(essentials, (essential) => essential.id === essentialId);
      return {
        ...state,
        essentials: [ ...essentials ],
      };
    }
    default:
      return state;
  }
};

export const getEssentials = state => state.essentialApp.essentials;

export default reducer;

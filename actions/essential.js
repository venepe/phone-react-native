import moment from 'moment';
import uuid from 'react-native-uuid';
import EssentialTypes from '../constants/EssentialTypes';
import { getStore } from '../store';
import { getEssentials, postEssentials, putEssential, delEssential } from '../fetches';
import analytics from '../analytics';
import R from '../resources';

export const requestEssentials = () =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    const data = await getEssentials({ token, accountId }) || {};
    let { essentials } = data;
    dispatch(setEssentials({ payload: { essentials } }));
  }

export const requestCreateEssential = ({ name }) =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    const id = uuid.v4();
    const now = moment.utc();
    postEssentials({ token, accountId, id, name });
    const essential = { id, name, createdAt: now, updateAt: now };
    dispatch(addEssential({ payload: { essential } }));
  }

export const requestUpdateEssential = ({ essentialId }) =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    putEssential({ token, accountId, essentialId });
    dispatch(deleteEssential({ payload: { essentialId } }));
  }

export const requestDeleteEssential = ({ essentialId }) =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    delEssential({ token, accountId, essentialId });
    dispatch(deleteEssential({ payload: { essentialId } }));
  }

export const setEssentials = payload => ({
  type: EssentialTypes.SET_ESSENTIALS,
  ...payload,
});

export const addEssential = payload => ({
  type: EssentialTypes.ADD_ESSENTIAL,
  ...payload,
});

export const deleteEssential = payload => ({
  type: EssentialTypes.DELETE_ESSENTIAL,
  ...payload,
});

const actions = {
  setEssentials,
  addEssential,
};

export default actions;

import moment from 'moment';
import uuid from 'react-native-uuid';
import TodoTypes from '../constants/TodoTypes';
import { getStore } from '../store';
import { getTodos, postTodos, putTodo, delTodo } from '../fetches';
import analytics from '../analytics';
import R from '../resources';

export const requestTodos = () =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    const data = await getTodos({ token, accountId }) || {};
    let { todos } = data;
    dispatch(setTodos({ payload: { todos } }));
  }

export const requestCreateTodo = ({ name }) =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    const id = uuid.v4();
    const now = moment.utc();
    postTodos({ token, accountId, id, name });
    const todo = { id, name, createdAt: now, updateAt: now };
    dispatch(addTodo({ payload: { todo } }));
  }

export const requestUpdateTodo = ({ todoId }) =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    putTodo({ token, accountId, todoId });
    dispatch(deleteTodo({ payload: { todoId } }));
  }

export const requestDeleteTodo = ({ todoId }) =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    delTodo({ token, accountId, todoId });
    dispatch(deleteTodo({ payload: { todoId } }));
  }

export const setTodos = payload => ({
  type: TodoTypes.SET_TODOS,
  ...payload,
});

export const addTodo = payload => ({
  type: TodoTypes.ADD_TODO,
  ...payload,
});

export const deleteTodo = payload => ({
  type: TodoTypes.DELETE_TODO,
  ...payload,
});

const actions = {
  setTodos,
  addTodo,
};

export default actions;

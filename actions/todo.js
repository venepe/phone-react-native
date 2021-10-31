import moment from 'moment';
import uuid from 'react-native-uuid';
import TodoTypes from '../constants/TodoTypes';
import { getStore } from '../store';
import { getTodos, postTodos, delTodo } from '../fetches';
import analytics from '../analytics';
import R from '../resources';

export const requestTodos = () =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    const data = await getTodos({ token, accountId }) || {};
    let { todos } = data;
    console.log(todos);
    dispatch(setTodos({ payload: { todos } }));
  }

export const createTodo = ({ name }) =>
  async (dispatch, getState) => {
    const { token, accountId } = getState().default;
    const id = uuid.v4();
    const now = moment.utc();
    postTodos({ token, accountId, id, name });
    const todo = { id, name, createdAt: now, updateAt: now };
    dispatch(addTodo({ payload: { todo } }));
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

export const updateTodo = payload => ({
  type: TodoTypes.UPDATE_TODO,
  ...payload,
});

export const deleteTodo = payload => ({
  type: TodoTypes.DELETE_TODO,
  ...payload,
});

export const addTodoItem = payload => ({
  type: TodoTypes.ADD_TODO_ITEM,
  ...payload,
});

export const updateTodoItem = payload => ({
  type: TodoTypes.UPDATE_TODO_ITEM,
  ...payload,
});

export const deleteTodoItem = payload => ({
  type: TodoTypes.DELETE_TODO_ITEM,
  ...payload,
});

export const setSelectedTodoId = payload => ({
  type: TodoTypes.SET_SELECTED_TODO_ID,
  ...payload,
});

const actions = {
  setTodos,
  addTodo,
};

export default actions;

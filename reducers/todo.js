import _ from 'lodash';
import TodoTypes from '../constants/TodoTypes';

const initialState = {
  todos: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TodoTypes.SET_TODOS:
    {
      const todos = action.payload.todos || [];
      return {
        ...state,
        todos,
      };
    }
    case TodoTypes.ADD_TODO:
    {
      const { todo } = action.payload;

      return {
        ...state,
        todos: [ ...state.todos, todo ],
      };
    }
    case TodoTypes.DELETE_TODO:
    {
      const { todos } = state;
      const { todoId } = action.payload;
      _.remove(todos, (todo) => todo.id === todoId);
      return {
        ...state,
        todos: [ ...todos ],
      };
    }
    default:
      return state;
  }
};

export const getTodos = state => state.todoApp.todos;

export default reducer;

import _ from 'lodash';
import TodoTypes from '../constants/TodoTypes';

const initialState = {
  todos: [],
  selectedTodoId: '',
  selectedTodoTitle: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TodoTypes.SET_TODOS:
    {
      const { todos } = action.payload;
      return {
        ...state,
        todos,
      };
    }
    case TodoTypes.SET_SELECTED_TODO_ID:
    {
      const { selectedTodoId } = action.payload;
      const { todos } = state;
      const selectedTodoTitle = _.find(todos, todo => todo.id === selectedTodoId).title;
      return {
        ...state,
        selectedTodoId,
        selectedTodoTitle,
      };
    }
    case TodoTypes.ADD_TODO:
    {
      const { todo } = action.payload;

      return {
        ...state,
        todos: [ todo, ...state.todos ],
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
export const getSelectedTodoId = state => state.todoApp.selectedTodoId;
export const getSelectedTodoTitle = state => state.todoApp.selectedTodoTitle;

export default reducer;

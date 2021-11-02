import io from 'socket.io-client';
import { SOCKET_URL } from '../config';
import { getStore } from '../store';
import { addMessage, storeAndSetIsActive, displayCallStatus,
  setIsAccountCallInProgress, setActivePhoneNumber } from '../actions';
import { addTodo, deleteTodo } from '../actions/todo';
import { addEssential, deleteEssential } from '../actions/essential';
import { showCongratulationsAlert } from './alert';
import { showCompletedTodo, showCompletedEssential } from './flash-message';

let socket = {};

export const initSocket = async ({ accountId }) => {
  if (!socket.connected) {
    socket = io(SOCKET_URL, {
      forceNode: false,
      transports: ['websocket'],
      jsonp: false,
    });

    socket.on('connect', () => {
      socket.emit('set-account-id', {
        accountId,
      });
      socket.emit('get-is-account-call-in-progress', {
        accountId,
      });
    });
  }

  socket.on('did-propose', () => {
    getStore().dispatch(storeAndSetIsActive({ payload: { isActive: true } }));
    showCongratulationsAlert();
    socket.disconnect();
  });

  socket.on('did-receive-message', ({ message }) => {
    getStore().dispatch(addMessage({ payload: { message } }));
  });

  socket.on('did-create-todo', ({ todo }) => {
    getStore().dispatch(addTodo({ payload: { todo } }));
  });

  socket.on('did-complete-todo', ({ todo }) => {
    showCompletedTodo(todo);
    getStore().dispatch(deleteTodo({ payload: { todoId: todo.id } }));
  });

  socket.on('did-delete-todo', ({ todo }) => {
    getStore().dispatch(deleteTodo({ payload: { todoId: todo.id } }));
  });

  socket.on('did-create-essential', ({ essential }) => {
    getStore().dispatch(addEssential({ payload: { essential } }));
  });

  socket.on('did-complete-essential', ({ essential }) => {
    showCompletedEssential(essential);
    getStore().dispatch(deleteEssential({ payload: { essentialId: essential.id } }));
  });

  socket.on('did-delete-essential', ({ essential }) => {
    getStore().dispatch(deleteEssential({ payload: { essentialId: essential.id } }));
  });

  socket.on('set-is-account-call-in-progress', ({ isAccountCallInProgress, activePhoneNumber = '' }) => {
    getStore().dispatch(setIsAccountCallInProgress({ payload: { isAccountCallInProgress } }));
    getStore().dispatch(setActivePhoneNumber({ payload: { activePhoneNumber } }));
    getStore().dispatch(displayCallStatus());
  });
}

export const closeSocket = () => {
  socket.disconnect();
}

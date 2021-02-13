import io from 'socket.io-client';
import { SOCKET_URL } from '../config';
import { getStore } from '../store';
import { storeAndSetIsActive } from '../actions';
import { showCongratulationsAlert } from './alert';

let socket;

export const initSocket = async ({ accountId }) => {
  socket = io(SOCKET_URL, {
    forceNode:false,
    transports: ['websocket'],
    jsonp: false,
  });

  socket.on('connect', () => {
    socket.emit('set-account-id', {
      accountId,
    });
  });

  socket.on('did-propose', () => {
    getStore().dispatch(storeAndSetIsActive({ payload: { isActive: true } }));
    showCongratulationsAlert();
    socket.disconnect();
  });
}

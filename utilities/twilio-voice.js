import { Platform } from 'react-native';
import TwilioVoice from 'react-native-twilio-programmable-voice';
import * as RootNavigation from '../components/App/RootNavigation';
import { getStore } from '../store';
import { setActivePhoneNumber, setCallState } from '../actions';

export const registerTwilioVoiceEvents = () => {
  TwilioVoice.addEventListener('deviceReady', () => {
      console.log('Twilio ready');
  });

  TwilioVoice.addEventListener('deviceNotReady', (data) => {
      console.log('Twilio error', data);
  });

  TwilioVoice.addEventListener('connectionDidConnect', (data) => {
      // {
      //     call_sid: string,  // Twilio call sid
      //     call_state: 'CONNECTED' | 'ACCEPTED' | 'CONNECTING' | 'RINGING' | 'DISCONNECTED' | 'CANCELLED',
      //     call_from: string, // "+441234567890"
      //     call_to: string,   // "client:bob"
      // }
      console.log('connectionDidConnect', data);
      const { call_sid, call_from, call_to, call_state } = data;
      getStore().dispatch(setCallState({ payload: { callState: call_state } }));
  });

  TwilioVoice.addEventListener('connectionIsReconnecting', (data) => {
      // {
      //     call_sid: string,  // Twilio call sid
      //     call_from: string, // "+441234567890"
      //     call_to: string,   // "client:bob"
      // }
      console.log('connectionIsReconnecting', data);
  });

  TwilioVoice.addEventListener('connectionDidReconnect', (data) => {
      // {
      //     call_sid: string,  // Twilio call sid
      //     call_from: string, // "+441234567890"
      //     call_to: string,   // "client:bob"
      // }
      console.log('connectionDidReconnect', data);
  });

  TwilioVoice.addEventListener('connectionDidDisconnect', (data) => {
      //   |
      //   | {
      //       err: string
      //     }
      //   | {
      //         call_sid: string,  // Twilio call sid
      //         call_state: 'CONNECTED' | 'ACCEPTED' | 'CONNECTING' | 'RINGING' | 'DISCONNECTED' | 'CANCELLED',
      //         call_from: string, // "+441234567890"
      //         call_to: string,   // "client:bob"
      //         err?: string,
      //     }
      console.log('connectionDidDisconnect', data);
      const { call_sid, call_from, call_to, call_state } = data;
      getStore().dispatch(setCallState({ payload: { callState: call_state } }));

  });

  TwilioVoice.addEventListener('callStateRinging', (data) => {
      //   {
      //       call_sid: string,  // Twilio call sid
      //       call_state: 'CONNECTED' | 'ACCEPTED' | 'CONNECTING' | 'RINGING' | 'DISCONNECTED' | 'CANCELLED',
      //       call_from: string, // "+441234567890"
      //       call_to: string,   // "client:bob"
      //   }
      const { call_sid, call_from, call_to, call_state } = data;
      console.log('callStateRinging', data);
      getStore().dispatch(setCallState({ payload: { callState: call_state } }));
  });

  TwilioVoice.addEventListener('callInviteCancelled', (data) => {
      //   {
      //       call_sid: string,  // Twilio call sid
      //       call_from: string, // "+441234567890"
      //       call_to: string,   // "client:bob"
      //   }
      console.log('callInviteCancelled', data);
      getStore().dispatch(setActivePhoneNumber({ payload: { activePhoneNumber: '' } }));
      if (RootNavigation.canGoBack()) {
        console.log('here');
        RootNavigation.canGoBack();
      } else {
        RootNavigation.navigate('ANumberForUs', {
          screen: 'Home',
          params: { },
        });
      }
  });
};

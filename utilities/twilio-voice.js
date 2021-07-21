import { Platform } from 'react-native';
import TwilioVoice from 'react-native-twilio-programmable-voice';
import { getStore } from '../store';

export const registerTwilioVoiceEvents = () => {
  TwilioVoice.addEventListener('deviceReady', () => {
      console.log('Twilio ready');
  });

  TwilioVoice.addEventListener('deviceNotReady', (data) => {
      console.log('Twilio erroe', data);
  });

  TwilioVoice.addEventListener('connectionDidConnect', (data) => {
      // {
      //     call_sid: string,  // Twilio call sid
      //     call_state: 'CONNECTED' | 'ACCEPTED' | 'CONNECTING' | 'RINGING' | 'DISCONNECTED' | 'CANCELLED',
      //     call_from: string, // "+441234567890"
      //     call_to: string,   // "client:bob"
      // }
      console.log('connectionDidConnect', data);
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
      const { call_sid, call_from, call_to } = data;

  });

  TwilioVoice.addEventListener('callStateRinging', (data) => {
      //   {
      //       call_sid: string,  // Twilio call sid
      //       call_state: 'CONNECTED' | 'ACCEPTED' | 'CONNECTING' | 'RINGING' | 'DISCONNECTED' | 'CANCELLED',
      //       call_from: string, // "+441234567890"
      //       call_to: string,   // "client:bob"
      //   }
      const { call_sid, call_from, call_to } = data;
      console.log('callStateRinging', data);
  });

  TwilioVoice.addEventListener('callInviteCancelled', (data) => {
      //   {
      //       call_sid: string,  // Twilio call sid
      //       call_from: string, // "+441234567890"
      //       call_to: string,   // "client:bob"
      //   }
      console.log('callInviteCancelled', data);
  });
};

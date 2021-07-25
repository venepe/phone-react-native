import { Platform } from 'react-native';
import TwilioVoice from 'react-native-twilio-programmable-voice';
import * as RootNavigation from '../components/App/RootNavigation';
import { getStore } from '../store';
import { setActivePhoneNumber } from '../actions';

export const registerTwilioVoiceEvents = () => {
  TwilioVoice.addEventListener('deviceReady', () => {
      console.log('Twilio ready');
  });

  TwilioVoice.addEventListener('deviceNotReady', (data) => {
      console.log('Twilio error', data);
  });

  TwilioVoice.addEventListener('connectionDidConnect', (data) => {
      const { call_from: activePhoneNumber } = data;
      getStore().dispatch(setActivePhoneNumber({ payload: { activePhoneNumber } }));
      RootNavigation.navigate('CallStates', {
        screen: 'ActiveCall',
        params: { },
      });
  });

  TwilioVoice.addEventListener('connectionIsReconnecting', (data) => {

  });

  TwilioVoice.addEventListener('connectionDidReconnect', (data) => {

  });

  TwilioVoice.addEventListener('connectionDidDisconnect', (data) => {

  });

  TwilioVoice.addEventListener('callStateRinging', (data) => {
      const { call_from: activePhoneNumber } = data;
      getStore().dispatch(setActivePhoneNumber({ payload: { activePhoneNumber } }));
      RootNavigation.navigate('CallStates', {
        screen: 'ActiveCall',
        params: { },
      });
  });

  TwilioVoice.addEventListener('deviceDidReceiveIncoming', (data) => {
    const { call_from: activePhoneNumber } = data;
    getStore().dispatch(setActivePhoneNumber({ payload: { activePhoneNumber } }));
    RootNavigation.navigate('CallStates', {
      screen: 'IncomingCall',
      params: { },
    });
  });

  TwilioVoice.addEventListener('callInviteCancelled', (data) => {
      //   {
      //       call_sid: string,  // Twilio call sid
      //       call_from: string, // "+441234567890"
      //       call_to: string,   // "client:bob"
      //   }
      console.log('callInviteCancelled', data);
      // getStore().dispatch(setActivePhoneNumber({ payload: { activePhoneNumber: '' } }));
      // if (RootNavigation.canGoBack()) {
      //   console.log('here');
      //   RootNavigation.canGoBack();
      // } else {
      //   RootNavigation.navigate('ANumberForUs', {
      //     screen: 'Home',
      //     params: { },
      //   });
      // }
  });
};

export const checkActiveOrIncomingCalls = async () => {
  const activeCall = await TwilioVoice.getActiveCall();
  if (activeCall) {
    console.log('activeCall', activeCall);
    const { call_from: activePhoneNumber } = activeCall;
    getStore().dispatch(setActivePhoneNumber({ payload: { activePhoneNumber } }));
    RootNavigation.navigate('CallStates', {
      screen: 'ActiveCall',
      params: { },
    });
  } else {
    const callInvite = await TwilioVoice.getCallInvite();
    console.log('callInvite', callInvite);
    if (callInvite) {
      const { call_from: activePhoneNumber } = callInvite;
      getStore().dispatch(setActivePhoneNumber({ payload: { activePhoneNumber } }));
      RootNavigation.navigate('CallStates', {
        screen: 'IncomingCall',
        params: { },
      });
    }
  }
};

package com.venepe.anumberforus;

import com.facebook.react.bridge.ReadableMap;

public interface LockScreenActivityInterface {
    public void onConnected();

    public void onConnectFailure();

    public void onIncoming(ReadableMap params);
}

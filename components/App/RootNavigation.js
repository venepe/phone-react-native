import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function canGoBack() {
  navigationRef.current?.canGoBack();
}

export function goBack() {
  navigationRef.current?.goBack();
}

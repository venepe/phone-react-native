import React from 'react';
import { Platform } from 'react-native';
import Share from 'react-native-share';
import R from '../resources';

export const openShare =  ({ url }) => {
  const title = R.strings.LABEL_ACTIVITY_SHARE_TITLE;
  const message = R.strings.LABEL_JOIN_ME;
  const icon = `data:image/png;base64,${R.images.APP_ICON_BASE_64}`;
  const options = Platform.select({
    ios: {
      activityItemSources: [
        { // For sharing url with custom title.
          placeholderItem: { type: 'url', content: url },
          item: {
            default: { type: 'url', content: url },
          },
          subject: {
            default: title,
          },
          linkMetadata: { originalUrl: url, url, title },
        },
        { // For sharing text.
          placeholderItem: { type: 'text', content: message },
          item: {
            default: { type: 'text', content: message },
            message: null, // Specify no text to share via Messages app.
          },
          linkMetadata: { // For showing app icon on share preview.
             title: message
          },
        },
      ],
    },
    default: {
      title,
      subject: title,
      message: `${R.strings.LABEL_JOIN_ME}: ${url}`,
    },
  });

  Share.open(options);
}

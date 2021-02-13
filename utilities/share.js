import React from 'react';
import { Platform } from 'react-native';
import Share from 'react-native-share';
import R from '../resources';

export const openShare =  ({ url }) => {
  const title = R.strings.APP_NAME;
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
        { // For using custom icon instead of default text icon at share preview when sharing with message.
          placeholderItem: {
            type: 'url',
            content: icon
          },
          item: {
            default: {
              type: 'text',
              content: `${url}`
            },
          },
          linkMetadata: {
             title: message,
             icon: icon
          }
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

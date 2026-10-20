/**
 * @format
 */

import { AppRegistry } from 'react-native';
import Apichyikowrdfpagthmsp from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Apichyikowrdfpagthmsp);

setImmediate(() => {
  const { getMessaging, setBackgroundMessageHandler } = require('@react-native-firebase/messaging');
  const { ichyikowrdfpagthmsOnMessageRecieved } = require('./services/initializichyikowrdfpagthmsationShared');
  const messaging = getMessaging();
  setBackgroundMessageHandler(messaging, async remoteMessage => {
    await ichyikowrdfpagthmsOnMessageRecieved(remoteMessage);
  });
});

/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import React from 'react'
import messaging from '@react-native-firebase/messaging';
messaging()?.setBackgroundMessageHandler(async (remoteMessage) => {
});
function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        // App has been launched in the background by iOS, ignore
        return null;
    }
    return <App />;
}
AppRegistry.registerComponent(appName, () => HeadlessCheck);

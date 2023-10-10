import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { FCM_TOKEN } from '../constants/constants';


class FCMService {
    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister);
        this.createNotificationListeners(
            onRegister,
            onNotification,
            onOpenNotification,
        );
    };

    registerAppWithFCM = async () => {
        if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true);
        }
    };

    checkPermission = onRegister => {
        messaging()
            .hasPermission()
            .then(enabled => {
                if (enabled) {
                    // user has permissions
                    this.getToken(onRegister);
                } else {
                    // user doens't have permission
                    this.requestPermission(onRegister);
                }
            })
            .catch(error => {
                console.log('[FCMService] Permission rejected ', error);
            });
    };

    getToken = async onRegister => {
        const alreadyExistedFCMToken = await AsyncStorage.getItem(FCM_TOKEN);
        // console.log("alreadyExistedFCMToken", alreadyExistedFCMToken)
        if (alreadyExistedFCMToken) {
            onRegister(alreadyExistedFCMToken);
            return
        }
        else {
            messaging()
                .getToken()
                .then(async fcmToken => {
                    if (fcmToken) {
                        const res = await AsyncStorage.setItem(FCM_TOKEN, fcmToken);
                        onRegister(fcmToken);
                        messaging().subscribeToTopic('all');
                    } else {
                        console.log('[FCMService] user does not have a device token');
                    }
                })
                .catch(error => {
                    console.log('[FCMService] getToken rejected ', error);
                });
        }

    };

    requestPermission = onRegister => {
        messaging()
            .requestPermission()
            .then(() => {
                this.getToken(onRegister);
            })
            .catch(error => {
                console.log('[FCMService] request permission rejected ', error);
            });
    };

    deleteToken = () => {
        messaging()
            .deleteToken()
            .catch(error => {
                console.log('[FCMService] delete token error ', error);
            });
    };

    createNotificationListeners = (
        onRegister,
        onNotification,
        onOpenNotification,
    ) => {
        // when the app is running, but in the backgroud
        messaging().onNotificationOpenedApp(remoteMessage => {
            if (remoteMessage) {
                const notification = remoteMessage.notification;
                onOpenNotification(notification, "messaging().onNotificationOpenedApp(remoteMessage");
                // this.removeDeliveredNotification(notification.notificationId)
            }
        });

        // when the app is opened from a quit state.
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {

                if (remoteMessage) {
                    const notification = remoteMessage.notification;
                    onOpenNotification(notification, ".getInitialNotification()");
                    // this.removeDeliveredNotification(notification.notificationId)
                }
            });

        // foreground state messages
        this.messageListener = messaging().onMessage(async remoteMessage => {
            if (remoteMessage) {
                let notification = null;
                if (Platform.OS === 'ios') {
                    notification = remoteMessage.notification;
                } else {
                    notification = remoteMessage.notification;
                }
                onNotification(notification, remoteMessage.data);
            }
        });
        // For setting up background handler

        // triggered when have new token
        messaging().onTokenRefresh(fcmToken => {
            onRegister(fcmToken);
        });
    };

    unRegister = () => {
        this?.messageListener();
    };
}

export const fcmService = new FCMService();
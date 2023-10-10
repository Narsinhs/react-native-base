import { Platform } from 'react-native';
import PushNotification, { Importance } from 'react-native-push-notification';
import { primaryColor } from '../constants/Styles';
// import { primaryColor } from '../constant/styles';

class LocalNotificationService {
    configure = onOpenNotification => {
        PushNotification.configure({
            onRegister: function (token) {
                // console.log('[LocalNotificationService] onRegister: ', token);
            },
            onNotification: function (notification) {
                if (!notification?.data) {
                    return;
                }
                const clicked = notification.userInteraction;
                if (clicked) {
                    onOpenNotification(notification?.data, " PushNotification.configure({");
                }
            },

            // ios only (optional): default: all - permission to register
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            //
            popInitialNotification: true,

            //
            requestPermissions: true,
        });
        PushNotification.channelExists('fcm_fallback_notification_channel', async (exists) => {
            if (!exists) {
                PushNotification.createChannel(
                    {
                        channelId: 'fcm_fallback_notification_channel', // (required)
                        channelName: 'Channel', // (required),
                        soundName: "default",
                    },
                    (created) => null,
                );
            }

        })

    };

    unregister = () => {
        PushNotification.unregister();
    };

    showNotification = (id, title, message, data = {}, options = {}) => {
        if (Platform.OS === 'android') {
            PushNotification.localNotification({
                ...this.buildAndroidNotification(id, title, message, data, options),
                title: title || '',
                message: message || '',
                playSound: options.playSound || true,
                soundName: options.soundName || 'default',
                userInteraction: false,
                color: primaryColor,
                data,
                channelId: 'fcm_fallback_notification_channel'
            });
        } else {
            PushNotification.localNotification({
                ...this.buildIOSNotification(id, title, message, data, options),
                title: title || '',
                message: message || '',
                playSound: options.playSound || true,
                soundName: options.soundName || 'default',
                userInteraction: false,
                color: primaryColor,
                data,
                channelId: 'fcm_fallback_notification_channel'
            });
        }

    };

    buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
        return {
            id: id,
            autoCancel: true,
            largeIcon: options.largeIcon || 'ic_launcher_round',
            smallIcon: options.smallIcon || 'ic_launcher_transparent',
            bigText: message || '',
            sebText: title || '',
            vibrate: options.vibrate || 300,
            priority: options.priority | 'high',
            importance: options.importance || 'high',
            data: data,
        };
    };

    buildIOSNotification = (id, title, message, data = {}, options = {}) => {
        return {
            alertAction: options.alertAction || 'view',
            category: options.category || '',
            isCritical: true,
            userInfo: {
                id: id,
                item: data,
            },
        };
    };

    cancleAllLocalNotifications = () => {
        PushNotification.cancelAllLocalNotifications();
    };

    removeDeliveredNotificationByID = notificationId => {
        PushNotification.cancelAllLocalNotifications({ id: `${notificationId}` });
    };
}

export const localNotificationService = new LocalNotificationService();
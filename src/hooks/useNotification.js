import React, { useEffect, useState } from 'react'
import { fcmService } from '../service/FirebaseService';
import { localNotificationService } from '../service/LocalNotificationService';
import { saveFCMToken } from '../utils/TokenUtil';
export default useNotification = (navigationRef) => {
    // const navigate = (route, params) => {
    //     navigationRef.current.navigate(route, { ...params })
    // }
    useEffect(() => {
        fcmService.registerAppWithFCM();
        fcmService.register(onRegister, onNotification, onOpenNotification);
        localNotificationService.configure(onOpenNotification);
        return () => {
            fcmService.unRegister()
        };
    }, []);
    async function onRegister(token) {
        await saveFCMToken(token)
    }
    function onNotification(notify, notficationData) {
        const options = {
            sound: 'default',
            playSound: true,
        };
        localNotificationService.showNotification(
            0,
            notify.title,
            notify.body,
            notficationData,
            options,
        );
    }
    function onOpenNotification(notify) {
    }
}


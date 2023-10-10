import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
const useAndroidResize = () => {
    useEffect(() => {
        if (Platform.OS === 'android') {
            AndroidKeyboardAdjust.setAdjustPan();
        }
        return () => {
            if (Platform.OS === 'android') {
                AndroidKeyboardAdjust.setAdjustResize();
            }
        }
    }, [])
}

export default useAndroidResize


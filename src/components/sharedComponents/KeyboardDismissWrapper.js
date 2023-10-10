import React, { useCallback } from 'react'
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'

const KeyboardDismissWrapper = ({ children }) => {

    const handlePress = useCallback(() => {
        Keyboard.dismiss()
    }, [])

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            {children}
        </TouchableWithoutFeedback>
    )
}

export default KeyboardDismissWrapper


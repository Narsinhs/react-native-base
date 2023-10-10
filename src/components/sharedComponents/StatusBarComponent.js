import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { primaryColor } from '../../constants/Styles'

// dark-content prop for Black content on StatusBar
// light-content prop for White content

export default StatusBarComponent = ({ backgroundColor = primaryColor, barStyle = "dark-content" }) => (
    <SafeAreaView style={{ backgroundColor: backgroundColor, padding: 0, margin: 0, height: StatusBar.currentHeight }}>
        <StatusBar translucent={true} backgroundColor={backgroundColor} barStyle={barStyle} />
    </SafeAreaView>
)
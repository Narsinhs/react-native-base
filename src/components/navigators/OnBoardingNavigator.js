import React from 'react';
import { View } from 'react-native'
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { fontFamily, fontH2V2, primaryColor } from '../../constants/Styles'
import { RouteNames } from "../../constants/RouteNames"

import GetStartedScreen from '../../view/authViews/GetStartedScreen';

const Stack = createStackNavigator();
const OnBoardingNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                ...TransitionPresets.SlideFromRightIOS,
                cardOverlay: () => (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: primaryColor,
                        }}
                    />),
                cardStyle: {
                    backgroundColor: primaryColor
                },
                headerStyle: {
                    backgroundColor: primaryColor,

                },
                headerTitleStyle: { fontFamily: fontFamily.Primary.Regular, fontSize: fontH2V2 },
            }}>

            <Stack.Screen
                name={RouteNames.AuthRoutes.GetStarted}
                component={GetStartedScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}



export default OnBoardingNavigator
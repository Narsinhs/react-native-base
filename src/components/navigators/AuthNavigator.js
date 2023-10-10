import React from 'react';
import { View } from 'react-native'
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { fontFamily, fontH2V2, primaryColor, whiteColor } from '../../constants/Styles'
import { RouteNames } from "../../constants/RouteNames"
import Login from '../../view/authViews/Login';
import Register from '../../view/authViews/Register';
import Forgot from '../../view/authViews/Forgot';
import GetStartedScreen from '../../view/authViews/GetStartedScreen';
import Otp from '../../view/authViews/Otp';
import ChangePassword from '../../view/authViews/ChangePassword';
import Subscription from '../../view/authViews/Subscription';
import ResetCode from '../../view/authViews/ResetCode';
const Stack = createStackNavigator();
const AuthNavigator = (props) => {
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
                name={RouteNames.AuthRoutes.Login}
                component={Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={RouteNames.AuthRoutes.Subscription}
                component={Subscription}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name={RouteNames.AuthRoutes.Otp}
                component={Otp}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={RouteNames.AuthRoutes.ResetCode}
                component={ResetCode}
                options={{ headerShown: false }}
            />


            <Stack.Screen
                name={RouteNames.AuthRoutes.SignUp}
                component={Register}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={RouteNames.AuthRoutes.Forgot}
                component={Forgot}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={RouteNames.AuthRoutes.ChangePassword}
                component={ChangePassword}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}



export default AuthNavigator
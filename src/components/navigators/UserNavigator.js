import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { RouteNames } from "../../constants/RouteNames"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { normalizeHeight, normalizeWidth } from "../../utils/FontUtil";
import Animated from "react-native-reanimated";
import TabNavigator from "./BottomNavigator";
import Contact from "../../view/drawerView/Contact";
import { primaryColor, whiteColor } from "../../constants/Styles";
import HuntingJournal from "../../view/userViews/journal/HuntingJournal";
import Header from "../../view/shared/Header";
import SubscriptionDrawer from "../../view/drawerView/SubscriptionDrawer";
import FAQ from "../../view/drawerView/FAQ";
import ChangePasswordDrawer from "../../view/drawerView/ChangePasswordDrawer";
import Register from "../../view/authViews/Register";
import CardDetails from "../../view/userViews/subscription/CardDetails";
import TermsAndCondition from "../../view/drawerView/TermsAndCondition";
import MyProfile from "../../view/userViews/profile/MyProfile";
import Today from "../../view/userViews/dashboard/Today";
import AddToCart from "../../view/drawerView/AddToCart";
import PrivacyPolicy from "../../view/drawerView/PrivacyPolicy";
import CalenderDate from "../../view/userViews/monthView/CalenderDate";
import AddLocation from "../../view/userViews/location/AddLocation";
import CurrentWeather from "../../view/userViews/currentWeather/CurrentWeather";
const Stack = createStackNavigator();
const UserNavigator = (props) => {
    return (
        <>
            <Animated.View style={StyleSheet.flatten([styles.stack, props.style])}>
                <Stack.Navigator
                    screenOptions={{
                        headerMode: 'screen',
                        // animationEnabled: true,
                        ...TransitionPresets.SlideFromRightIOS,
                        cardStyle: { backgroundColor: primaryColor },
                        headerStyle: {
                            backgroundColor: whiteColor,
                        },
                        header: (props) => {
                            let state = props.navigation.getState();
                            return (
                                <Header routeName={state.routes[state.index].name}  {...props} />
                            )
                        },
                    }}
                >
                    <Stack.Screen
                        name={RouteNames.User.TabNavigator}
                        component={TabNavigator}
                        options={{ headerShown: true }}
                        {...props}
                    />
                    <Stack.Screen
                        name={RouteNames.User.Contact}
                        component={Contact}
                        options={{ headerShown: true }}
                        {...props}
                    />
                    <Stack.Screen
                        name={RouteNames.User.FAQ}
                        component={FAQ}
                        options={{ headerShown: true }}
                        {...props}
                    />
                    <Stack.Screen
                        name={RouteNames.User.PrivacyPolicy}
                        component={PrivacyPolicy}
                        options={{ headerShown: true }}
                        {...props}
                    />

                    <Stack.Screen
                        name={RouteNames.User.HuntingJournal}
                        component={HuntingJournal}
                        options={{ headerShown: true }}
                        {...props}
                    />
                    <Stack.Screen
                        name={RouteNames.User.SubscriptionDrawer}
                        component={SubscriptionDrawer}
                        options={{ headerShown: true }}
                        {...props}
                    />
                    <Stack.Screen
                        name={RouteNames.User.ChangePasswordDrawer}
                        component={ChangePasswordDrawer}
                        options={{ headerShown: false }}
                        {...props}
                    />
                    <Stack.Screen
                        name={RouteNames.User.MyProfile}
                        component={MyProfile}
                        options={{ headerShown: false }}
                        {...props}
                    />
                    <Stack.Screen
                        name={RouteNames.User.CardDetails}
                        component={CardDetails}
                        options={{ headerShown: false }}
                        {...props}
                    />
                    <Stack.Screen
                        name={RouteNames.User.TermsAndConditions}
                        component={TermsAndCondition}
                        options={{ headerShown: true }}
                        {...props}
                    />
                    <Stack.Screen
                        name={RouteNames.User.Today}
                        component={Today}
                        options={{ headerShown: true }}
                        {...props}
                    />
                    <Stack.Screen
                        name={RouteNames.User.AddToCart}
                        component={AddToCart}
                        options={{ headerShown: false }}
                        {...props}
                    />
                    <Stack.Screen
                        name={RouteNames.User.CalenderDate}
                        component={CalenderDate}
                        options={{ headerShown: true }}
                        {...props}
                    />
                    <Stack.Screen
                        name={RouteNames.User.CurrentWeather}
                        component={CurrentWeather}
                        options={{ headerShown: true }}
                        {...props}
                    />
                    <Stack.Screen
                        name={RouteNames.User.AddLocation}
                        component={AddLocation}
                        options={{ headerShown: false }}
                        {...props}
                    />
                </Stack.Navigator>
            </Animated.View>

        </>
    )
}
const styles = StyleSheet.create({
    stack: {
        flex: 2,
        backgroundColor: whiteColor,
        shadowColor: whiteColor,
        shadowOffset: {
            width: normalizeWidth(0),
            height: normalizeHeight(8),
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 50,
        color: whiteColor,
    },

});

export default UserNavigator
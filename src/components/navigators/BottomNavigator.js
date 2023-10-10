import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import { StyleSheet, Platform, View } from 'react-native'
import { RouteNames } from '../../constants/RouteNames';
import DashboardNavigator from './DashboardNavigator';
import JournalView from '../../view/userViews/profile/Journal';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabbar } from '../customBottomTabBar/BottomTabbar';
import { faBars, faCalendar, faCalendarAlt, faGlassWhiskey, faHome, faInfo, faInfoCircle, faLocationArrow, faUser } from '@fortawesome/free-solid-svg-icons';
import Location from '../../view/userViews/location/Location';
import Info from '../../view/userViews/info/Info';
import Header from '../../view/shared/Header';
import { primaryColor, whiteColor } from '../../constants/Styles';
import { deviceWidth, normalizeHeight } from '../../utils/FontUtil';
import MonthCalendar from '../../view/userViews/monthView/MonthCalendar';
import { activeCalendarIcon, activeHomeIcon, activeInfoIcon, activeJournalIcon, activeLocationIcon, calendarIcon, calendarTabIcon, homeIcon, infoIcon, journalIcon, locationIcon } from '../../assets/images';

const Tab = createBottomTabNavigator();
const TabNavigator = (props) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ flex: 1, position: "relative", backgroundColor: whiteColor }}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                tabBar={(props) => <BottomTabbar {...props}

                />
                }
            >
                <Tab.Screen name={RouteNames.User.Home} component={DashboardNavigator} options={{ activeIcon: activeHomeIcon, inActiveIcon: homeIcon }} />
                <Tab.Screen name={RouteNames.User.Info} component={Info} options={{ activeIcon: activeInfoIcon, inActiveIcon: infoIcon }} />
                <Tab.Screen name={RouteNames.User.Location} component={Location} options={{ activeIcon: activeLocationIcon, inActiveIcon: locationIcon }} />
                <Tab.Screen name={RouteNames.User.Month} component={MonthCalendar} options={{ activeIcon: activeCalendarIcon, inActiveIcon: calendarTabIcon }} />
                <Tab.Screen name={RouteNames.User.Journal} component={JournalView} options={{ activeIcon: activeJournalIcon, inActiveIcon: journalIcon }} />
            </Tab.Navigator>
            {insets.bottom > 0 && (
                <View
                    style={{
                        height: Platform.OS === 'android' ? insets.bottom - normalizeHeight(5) : insets.bottom - normalizeHeight(15),
                        backgroundColor: primaryColor
                    }}
                />
            )}
        </View>
    )
}

export default TabNavigator

const styles = StyleSheet.create({})

import React from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Days from '../../view/userViews/dashboard/Days';
import Today from '../../view/userViews/dashboard/Today';
import Tommorow from '../../view/userViews/dashboard/Tommorow';
import { fontFamily, fontH3, fontH3V3, primaryColor } from '../../constants/Styles';
import { normalizeHeight } from '../../utils/FontUtil';
import { RouteNames } from '../../constants/RouteNames';
import Days12 from '../../view/userViews/dashboard/Days12';
import Days8 from '../../view/userViews/dashboard/Days8';
const Tab = createMaterialTopTabNavigator();

const DashboardNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        lazyPreloadDistance: true,
        lazy: true,
        tabBarPressColor: "transparent",
        tabBarActiveTintColor: primaryColor,
        tabBarIndicatorStyle: { backgroundColor: primaryColor, height: normalizeHeight(5) },
        tabBarLabelStyle: { fontSize: fontH3V3, fontFamily: fontFamily.Primary.SemiBold, textTransform: 'none' }

      }}

    >
      <Tab.Screen name={RouteNames.Dashboard.Today} component={Today} />
      <Tab.Screen name={RouteNames.Dashboard.Tomorrow} component={Tommorow} />
      <Tab.Screen name={RouteNames.Dashboard['4-Days']} component={Days} />
      <Tab.Screen name={RouteNames.Dashboard['8-Days']} component={Days8} />
      <Tab.Screen name={RouteNames.Dashboard['12-Days']} component={Days12} />
    </Tab.Navigator>
  );
}
export default DashboardNavigator
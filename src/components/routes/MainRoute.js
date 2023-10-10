
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import DrawerNavigator from '../drawer/DrawerNavigator';
import AuthNavigator from '../navigators/AuthNavigator';
import { navigationRef } from '../../../RootNavigation';
import NetInfo from "@react-native-community/netinfo";
import { setInternetStatus, DeviceInformation, GetSlugPages } from '../../redux/actions';
import DeviceInfo from 'react-native-device-info';
import useNotification from '../../hooks/useNotification';
import OnBoardingNavigator from '../navigators/OnBoardingNavigator';
const MainRoute = ({ authorize, setInternetStatus, DeviceInformation, GetSlugPages, isOneBoardSuccess, InternetConnected }) => {
    const navigationRef = useRef()
    useNotification(navigationRef)
    useEffect(() => {
        handleDeviceInfo()
        handleGetAllSlug()
        const unSubscribe = NetInfo.addEventListener(state => {
            setInternetStatus(state.isConnected)
        })
        return () => unSubscribe()
    }, [])

    const handleGetAllSlug = () => {
        console.log('sluggggggggggggggg')
        GetSlugPages().then((val) => {

        }).catch((e) => {
            console.log(e, "error in slug api")
        })
    }
    const handleDeviceInfo = () => {
        let deviceId = DeviceInfo.getUniqueId();
        let deviceName = DeviceInfo.getSystemName();

        DeviceInformation(deviceId, deviceName.toLowerCase())
    }
    return (
        <NavigationContainer ref={navigationRef}>
            {
                !isOneBoardSuccess ? <OnBoardingNavigator />
                    :
                    authorize ?
                        <DrawerNavigator /> : <AuthNavigator />
            }
        </NavigationContainer>
    )
}
const mapDispatchToProps = {
    setInternetStatus,
    DeviceInformation,
    GetSlugPages
};
const mapStateToProps = state => {
    return {
        authorize: state.auth.authorize,
        isOneBoardSuccess: state.onBoard.isOneBoardSuccess,
        InternetConnected: state?.InternetConnection?.internetConnected,
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(MainRoute)


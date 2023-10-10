import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { arrow_up, fullMoonIcon, locationIcon } from '../../../assets/images'
import { Date_Arrow_Icon_Type, weatherIconAndBackgroundDetails } from '../../../constants/constants'
import { RouteNames } from '../../../constants/RouteNames'
import { blackColor, fontFamily, fontH1, fontH2, fontH2V2, fontH2V3, fontH3, primaryColor, whiteColor } from '../../../constants/Styles'
import { addDaysToDate } from '../../../utils/DateUtil'
import { normalizeFont, normalizeHeight, normalizeWidth, normalizeWithScale } from '../../../utils/FontUtil'
import DashboardModal from '../../shared/DashboardModal'
import DateComponent from '../../shared/DateComponent'
import { connect, useSelector } from 'react-redux';
import { HUNTING_DETAIL_SPLIT_ASCII } from '../../../constants/Enum'
import CustomButton from '../../shared/CustomButton'
import NonHuntingMonthBox from '../../shared/NonHuntingMonthBox'
import { registerToastMessage } from '../../../utils/RegisterToast'
const Tommorow = ({ navigation, geoLocation, headerArrowPressed, selectedLocation, InternetConnected, allLocations, indexTime, isDay }) => {
    const huntingDetails = useSelector(state => state.hunt.huntingDetails)
    const [huntingForTomorrow, setHuntingForTomorrow] = useState({})
    const [fetching, setFetching] = useState(false)
    useEffect(() => {
        setFetching(true)
        if (Object.keys(huntingDetails).length !== 0) {
            setHuntingForTomorrow(huntingDetails[`${geoLocation?.city},${geoLocation?.state}`]?.[1] || {})
        }
        setTimeout(() => {
            setFetching(false)
        }, 1500);
    }, [huntingDetails, (geoLocation?.state || geoLocation?.city)])

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        if (huntingForTomorrow?.weather) {
            setModalVisible(!isModalVisible);
        }
    };
    const RenderTemperature = ({ temperature, level }) => {
        return (
            <>
                <Text style={{ fontSize: fontH2V2, color: 'black', fontFamily: fontFamily.Primary.SemiBold }}>{level}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'black', fontFamily: fontFamily.Primary.SemiBold, fontSize: normalizeFont(45), lineHeight: normalizeHeight(55) }}>{temperature}</Text>
                    <Text style={{ color: 'black', fontFamily: fontFamily.Primary.Bold, fontSize: fontH2, position: 'absolute', right: normalizeWidth(-15) }}>&#8457;</Text>
                </View>
            </>
        )
    }

    const handlePressIcon = (iconType) => {
        if (iconType === Date_Arrow_Icon_Type.RIGHT) {
            navigation.navigate(RouteNames.Dashboard['4-Days'])
        }
        else if (iconType === Date_Arrow_Icon_Type.LEFT) {
            navigation.navigate(RouteNames.Dashboard.Today)
        }
    }
    const handleAddLocationNavigation = () => {
        if (!InternetConnected) {
            registerToastMessage("This feature is not available in offline mode.", false)
            return
        }
        else {
            navigation.navigate(RouteNames.User.AddLocation)
        }

    }

    const getWeatherContainerBorderRadius = () => {
        return Platform.OS === 'ios' ? normalizeWidth(25) : 0
    }


    let location = huntingForTomorrow && huntingForTomorrow?.hunting_location?.split(HUNTING_DETAIL_SPLIT_ASCII)
    // let dayFlag = huntingForTomorrow?.weather_day_night?.length && huntingForTomorrow?.weather[0]?.isDay
    if (!allLocations.length) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center', fontFamily: fontFamily.Primary.SemiBold, fontSize: fontH2, color: primaryColor, marginBottom: normalizeHeight(10) }}>To view hunting and weather details</Text>
                <CustomButton onPress={handleAddLocationNavigation} ImgSource={locationIcon} height={normalizeHeight(42)} buttonText={'Please add location'} buttonColor={primaryColor} buttonTextColor={whiteColor} borderRadius={normalizeWidth(10)} bordercolor={primaryColor} />
            </View>
        )
    }
    if (selectedLocation && Object.values(huntingForTomorrow)?.length === 0 && allLocations.length && !headerArrowPressed && !fetching) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <CustomButton onPress={() => console.log("hello")} height={normalizeHeight(42)} buttonText={'No data is found on the selected location'} buttonColor={primaryColor} buttonTextColor={whiteColor} borderRadius={normalizeWidth(10)} bordercolor={primaryColor} disabled={true} />
            </View>
        )
    }
    return (
        Object.keys(huntingForTomorrow).length !== 0 && selectedLocation && !headerArrowPressed ?
            <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={{ flex: 1, backgroundColor: primaryColor }}>
                <View style={{ flex: 1.7, backgroundColor: 'white' }}>
                    <View style={{ flex: 1 }}>
                        <DateComponent onPressIcon={handlePressIcon} date={huntingForTomorrow?.original_date} />
                        <View style={{ flex: 1, marginHorizontal: normalizeWidth(50), borderWidth: normalizeWidth(3), borderRadius: normalizeWidth(10), justifyContent: 'space-evenly' }}>
                            {
                                huntingForTomorrow?.is_non_hunting_month ?
                                    <NonHuntingMonthBox text={huntingForTomorrow?.non_hunting_month_note} />
                                    : <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: huntingForTomorrow?.color, fontSize: normalizeFont(21), fontFamily: fontFamily.Primary.SemiBold, textAlign: 'center', lineHeight: normalizeHeight(30) }}>{huntingForTomorrow?.hunting_location_type}</Text>
                                        <Text style={{ color: huntingForTomorrow?.color, fontFamily: fontFamily.Primary.SemiBold, fontSize: normalizeFont(35), lineHeight: normalizeHeight(50), textAlign: 'center' }}>{location && location[0].trim() || 'N/A'}</Text>
                                        <Text style={{ color: huntingForTomorrow?.color, fontSize: normalizeFont(21), lineHeight: normalizeHeight(26), fontFamily: fontFamily.Primary.SemiBold, textAlign: 'center' }}>{location && location[1].trim() || 'N/A'}</Text>
                                    </View>
                            }
                        </View>
                    </View>
                    <View style={{ flex: 2 }}>
                        <DashboardModal handleModal={toggleModal} isModalVisible={isModalVisible} item={huntingForTomorrow} />
                        <TouchableOpacity
                            onPress={toggleModal}
                            activeOpacity={1}
                        >
                            {
                                huntingForTomorrow?.weather ?
                                    <>
                                        <View style={{
                                            ...styles.weatherContainer
                                        }}>
                                            <View style={{ flex: 1.5, backgroundColor: 'white', flexDirection: 'row', borderTopLeftRadius: getWeatherContainerBorderRadius(), borderBottomLeftRadius: getWeatherContainerBorderRadius() }}>
                                                <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                                                    <RenderTemperature temperature={huntingForTomorrow?.weather?.maxTempF || 0} level="High" />
                                                </View>
                                                <View style={{ height: '60%', width: StyleSheet.hairlineWidth, backgroundColor: '#BFBFBF', alignSelf: 'center' }}>
                                                </View>
                                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                    <RenderTemperature temperature={huntingForTomorrow?.weather?.minTempF || 0} level="Low" />
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, backgroundColor: weatherIconAndBackgroundDetails.Sunny.backgroundColor, borderTopRightRadius: getWeatherContainerBorderRadius(), borderBottomRightRadius: getWeatherContainerBorderRadius() }}>
                                                <Image source={{ uri: huntingForTomorrow?.weather?.icon }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                            </View>
                                        </View>
                                    </>
                                    :
                                    <View style={{ flex: 1, alignItems: 'center', height: normalizeHeight(100), justifyContent: 'center', borderWidth: 0.1, borderColor: whiteColor, marginHorizontal: normalizeWidth(10), padding: normalizeHeight(10), marginVertical: normalizeHeight(10), marginTop: normalizeHeight(10), borderRadius: normalizeWidth(10) }}>
                                        <Text style={{ color: primaryColor, fontFamily: fontFamily.Primary.Bold, fontSize: fontH2, textAlign: 'center' }}>{'Weather Details are not available at this time.'}</Text>
                                    </View>
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: normalizeWidth(15), marginVertical: normalizeHeight(5), paddingVertical: normalizeHeight(10) }}>
                        <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                            <Text style={styles.timingDetails}>Twilight Start: {huntingForTomorrow?.twilight_start}</Text>
                            <Text style={styles.timingDetails}>Sun Rise: {huntingForTomorrow?.sun_rise}</Text>
                            <Text style={styles.timingDetails}>Sun Set: {huntingForTomorrow?.sun_set}</Text>
                            <Text style={styles.timingDetails}>Twilight End: {huntingForTomorrow?.twilight_end}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            {
                                huntingForTomorrow?.weather ?
                                    <>
                                        <Text style={styles.weatherDetails}>{huntingForTomorrow?.weather?.weather}</Text>
                                        <Text style={styles.weatherDetails}>Wind</Text>
                                        <Text style={styles.weatherDetails}>{huntingForTomorrow?.weather?.windDir} - {huntingForTomorrow?.weather?.windSpeedMPH}</Text>
                                    </>
                                    :
                                    <></>
                            }
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: primaryColor, height: normalizeHeight(250), paddingHorizontal: normalizeWidth(15) }}>
                    <View style={{ flex: 1.2, justifyContent: 'space-evenly', paddingBottom: normalizeHeight(60), }}>
                        <View >
                            <Text style={styles.moonDetailText}>Moon Phase: {huntingForTomorrow?.moon_phase_illumination}</Text>
                            <Text style={styles.moonDetailText}>Moon Rise: {huntingForTomorrow?.moon_rise}</Text>
                            <Text style={styles.moonDetailText}>Moon Set: {huntingForTomorrow?.moon_set}</Text>
                            <Text style={styles.moonDetailText}>Moon Transit: {huntingForTomorrow?.moon_transit_api}</Text>
                        </View>
                        <View>
                            {
                                huntingForTomorrow?.weather ?
                                    <>
                                        <View style={{
                                            flexDirection: "row",
                                        }}>
                                            <View style={{ flexDirection: "column", }} >
                                                <Text style={styles.moonDetailText}>Barometric Pressure</Text>
                                                <Text style={styles.moonDetailText} >{`(inHg) ${huntingForTomorrow?.weather?.pressureIN} ${huntingForTomorrow?.weather?.weather}`}</Text>
                                            </View>
                                            <Image source={arrow_up} style={{ marginStart: normalizeWidth(5) }} resizeMode="contain" />
                                        </View>
                                    </>
                                    :
                                    <>
                                    </>
                            }
                        </View>

                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingBottom: normalizeHeight(60) }}>
                        <Text style={styles.moonText}>{huntingForTomorrow?.moon_phase_name}</Text>
                        <Image source={{ uri: huntingForTomorrow?.moon_image }} style={{ width: '70%', height: '70%' }} resizeMode="contain" />
                    </View>
                </View>
            </ScrollView >
            :
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size={'large'} color={primaryColor} />
            </View>
    )
}

const mapStateToProps = state => {
    return {
        selectedLocation: state.favoriteLocation.selectedLocation,
        allLocations: state?.favoriteLocation?.allLocations,
        indexTime: state.home.indexTime,
        isDay: state.home.isDay,
        headerArrowPressed: state.home.headerArrowPressed,
        geoLocation: state.favoriteLocation.geoLocation,
        InternetConnected: state?.InternetConnection?.internetConnected,
    }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Tommorow)
const styles = StyleSheet.create({
    moonText: {
        color: 'white',
        fontFamily: fontFamily.Primary.Medium,
        fontSize: fontH2V2,
        marginRight: normalizeWidth(5)
    },
    moonDetailText: {
        color: 'white',
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH3,
        textAlign: 'left'
    },
    weatherContainer: {
        flex: 1,
        marginHorizontal: normalizeWidth(10),
        marginVertical: normalizeHeight(10),
        flexDirection: 'row',
        borderRadius: normalizeWidth(20),
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        height: normalizeHeight(140),
        elevation: 5,
    },
    timingDetails: {
        color: '#112128',
        fontFamily: fontFamily.Primary.SemiBold,
        fontSize: fontH2V3,
        textAlign: 'left'
    },
    weatherDetails: {
        color: '#112128',
        fontFamily: fontFamily.Primary.SemiBold,
        fontSize: fontH2,
        textAlign: 'right'
    }
})

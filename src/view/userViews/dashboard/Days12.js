import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, FlatList, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { arrow_up, fullMoonIcon, locationIcon } from '../../../assets/images'
import { Date_Arrow_Icon_Type, dummy4DaysData, dummy4DaysWeather, weatherIconAndBackgroundDetails } from '../../../constants/constants'
import { RouteNames } from '../../../constants/RouteNames'
import { fontFamily, fontH1, fontH2, fontH2V2, fontH2V3, fontH3, greyedSchemeColor, primaryColor, whiteColor } from '../../../constants/Styles'
import { addDaysToDate } from '../../../utils/DateUtil'
import { deviceWidth, normalizeFont, normalizeHeight, normalizeWidth, normalizeWithScale } from '../../../utils/FontUtil'
import DateComponent from '../../shared/DateComponent'
import RoutineBox from '../../shared/RoutineBox'
import WeatherRoutineBox from '../../shared/WeatherRoutineBox'
import { connect, useSelector } from 'react-redux';
import { HUNTING_DETAIL_SPLIT_ASCII } from '../../../constants/Enum'
import CustomButton from '../../shared/CustomButton'
import DashboardModal from '../../shared/DashboardModal'
import { registerToastMessage } from '../../../utils/RegisterToast'
const Days12 = ({ navigation, geoLocation, headerArrowPressed, selectedLocation, InternetConnected, allLocations, indexTime, isDay }) => {

    const huntingDetails = useSelector(state => state.hunt.huntingDetails)
    const [isModalVisible, setModalVisible] = useState(false);
    const [huntingFor12Day, setHuntingFor12Day] = useState({})
    const [fetching, setFetching] = useState(false)
    useEffect(() => {
        setFetching(true)
        if (Object.keys(huntingDetails).length !== 0) {
            setHuntingFor12Day(huntingDetails[`${geoLocation?.city},${geoLocation?.state}`]?.slice(10, 14) || {})
        }
        setTimeout(() => {
            setFetching(false)
        }, 1500);
    }, [huntingDetails, (geoLocation?.state || geoLocation?.city)])

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

    const [index, setIndex] = useState(false)
    const handlePressIcon = (iconType) => {
        if (iconType === Date_Arrow_Icon_Type.LEFT) {
            navigation.navigate(RouteNames.Dashboard['8-Days'])
        }
    }
    const RenderRoutineBox = ({ item }) => {
        let location = item && item?.hunting_location?.split(HUNTING_DETAIL_SPLIT_ASCII)
        return (
            <RoutineBox
                date={item?.original_date}
                backgroundColor={item?.color || 'grey'}
                dayName={item?.day}
                dayPhase={item?.hunting_location_type}
                actionTime={location?.length && location[0].trim() || 'N/A'}
                action={location?.length && location[1].trim() || 'N/A'}
                detailsFound={item?.is_hunting_details_found}
                moonIcon={item?.moon_image}
                showMoon={item?.show_moon_image}
            />
        )
    }
    const RenderWeatherBox = ({ item, index, toggleModal }) => {
        // let dayFlag = item?.weather_day_night?.length && item?.weather_day_night[0]?.isDay
        return (
            <WeatherRoutineBox index={index} toggleModal={toggleModal} dayName={item?.day} lowerBound={item?.weather?.minTempF} upperBound={item?.weather?.maxTempF} sunPhase={item?.weather?.weather} image={item?.weather?.icon} />
        )
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

    if (!allLocations.length) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center', fontFamily: fontFamily.Primary.SemiBold, fontSize: fontH2, color: primaryColor, marginBottom: normalizeHeight(10) }}>To view hunting and weather details</Text>
                <CustomButton onPress={handleAddLocationNavigation} ImgSource={locationIcon} height={normalizeHeight(42)} buttonText={'Please add location'} buttonColor={primaryColor} buttonTextColor={whiteColor} borderRadius={normalizeWidth(10)} bordercolor={primaryColor} />
            </View>
        )
    }
    if (selectedLocation && Object.values(huntingFor12Day)?.length === 0 && allLocations.length && !headerArrowPressed && !fetching) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <CustomButton onPress={() => console.log("hello")} height={normalizeHeight(42)} buttonText={'No data is found on the selected location'} buttonColor={primaryColor} buttonTextColor={whiteColor} borderRadius={normalizeWidth(10)} bordercolor={primaryColor} disabled={true} />
            </View>
        )
    }

    const toggleModal = (index) => {
        if (huntingFor12Day[index]?.weather) {
            setIndex(index)
            setModalVisible(!isModalVisible);
        }
        else {
            setIndex(false)
            setModalVisible(false);
        }
    };
    // let dayFlag = huntingFor12Day[0]?.weather_day_night?.length && huntingFor12Day[0]?.weather_day_night[0]?.isDay
    return (
        huntingFor12Day && huntingFor12Day.length && !headerArrowPressed && selectedLocation ?
            <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={{ flex: 1, backgroundColor: primaryColor }}>
                <View style={{ flex: 1.7, backgroundColor: 'white' }}>
                    <View style={{ flex: 1 }}>
                        <DateComponent onPressIcon={handlePressIcon} date={huntingFor12Day[0]?.original_date} rightIconDisabled={true} />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: normalizeWidth(5) }}>
                        {
                            huntingFor12Day.map((each) => {
                                return <RenderRoutineBox item={each} key={each.original_date} />
                            })
                        }
                    </View>
                    <DashboardModal handleModal={toggleModal} isModalVisible={isModalVisible} item={huntingFor12Day[index]} />
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginBottom: normalizeHeight(15), paddingHorizontal: normalizeWidth(5) }}>
                        {
                            huntingFor12Day.map((each, index) => {
                                return <RenderWeatherBox index={index} item={each} key={each.original_date} toggleModal={toggleModal} />
                            })
                        }
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: primaryColor, height: normalizeHeight(270), paddingHorizontal: normalizeWidth(15) }}>
                    <View style={{ flex: 1.2, justifyContent: 'space-evenly', paddingBottom: normalizeHeight(60) }}>
                        <View >
                            <Text style={styles.moonDetailText}>Moon Phase: {huntingFor12Day[0]?.moon_phase_illumination}</Text>
                            <Text style={styles.moonDetailText}>Moon Rise: {huntingFor12Day[0]?.moon_rise}</Text>
                            <Text style={styles.moonDetailText}>Moon Set: {huntingFor12Day[0]?.moon_set}</Text>
                            <Text style={styles.moonDetailText}>Moon Transit: {huntingFor12Day[0]?.moon_transit_api}</Text>
                        </View>
                        <View>

                            <View style={{
                                flexDirection: "row",
                            }}>
                                <View style={{ flexDirection: "column", }} >
                                    <Text style={styles.moonDetailText}>Barometric Pressure</Text>
                                    <Text style={styles.moonDetailText} >{`(inHg) ${huntingFor12Day[0]?.weather?.pressureIN} ${huntingFor12Day[0]?.weather?.weather}`}</Text>
                                </View>
                                <Image source={arrow_up} style={{ marginStart: normalizeWidth(5) }} resizeMode="contain" />
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingBottom: normalizeHeight(60) }}>
                        <Text style={styles.moonText}>{huntingFor12Day[0]?.moon_phase_name}</Text>
                        <Image source={{ uri: huntingFor12Day[0]?.moon_image }} style={{ width: '70%', height: '70%' }} resizeMode="contain" />
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
        headerArrowPressed: state.home.headerArrowPressed,
        selectedLocation: state.favoriteLocation.selectedLocation,
        allLocations: state?.favoriteLocation?.allLocations,
        indexTime: state.home.indexTime,
        isDay: state.home.isDay,
        geoLocation: state.favoriteLocation.geoLocation,
        InternetConnected: state?.InternetConnection?.internetConnected,
    }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Days12)
const styles = StyleSheet.create({
    moonText: {
        color: 'white',
        fontFamily: fontFamily.Primary.Medium,
        fontSize: fontH2V2,
        marginRight: normalizeWidth(15)
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

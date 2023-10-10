import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { arrow_up, fullMoonIcon } from '../../../assets/images'
import { Date_Arrow_Icon_Type, weatherIconAndBackgroundDetails } from '../../../constants/constants'
import { RouteNames } from '../../../constants/RouteNames'
import { blackColor, fontFamily, fontH1, fontH2, fontH2V2, fontH2V3, fontH3, primaryColor, whiteColor } from '../../../constants/Styles'
import { addDaysToDate, formatDate } from '../../../utils/DateUtil'
import { normalizeFont, normalizeHeight, normalizeWidth, normalizeWithScale } from '../../../utils/FontUtil'
import DashboardModal from '../../shared/DashboardModal'
import DateComponent from '../../shared/DateComponent'
import { connect } from 'react-redux';
import { HUNTING_DETAIL_SPLIT_ASCII } from '../../../constants/Enum'
import NonHuntingMonthBox from '../../shared/NonHuntingMonthBox'
import { Loading } from '../../shared/Loading'
const CalenderDate = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function filterData() {
            // console.log(route?.params?.currentMonth, "route?.params?.currentMonth")
            await handleMonthData()
        }
        filterData()
    }, [])
    const [isModalVisible, setModalVisible] = useState(false);
    const [huntingDetail, setHuntingDetail] = useState(false);
    const handleMonthData = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                route?.params?.currentMonth.filter(function (detail) {
                    if (detail.original_date === route?.params?.date) {
                        setHuntingDetail(detail)
                        resolve(true)
                        setLoading(false)
                    }
                });
            }, 200)

        })
    }
    const toggleModal = () => {
        if (huntingDetail?.weather) {
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
            navigation.navigate(RouteNames.Dashboard.Tomorrow)
        }
    }

    const getWeatherContainerBorderRadius = () => {
        return Platform.OS === 'ios' ? normalizeWidth(25) : 0
    }
    let location = huntingDetail && huntingDetail?.hunting_location?.split(HUNTING_DETAIL_SPLIT_ASCII);
    // let dayFlag = huntingDetail?.weather?.length && huntingDetail?.weather_day_night[0]?.isDay
    return (
        !loading ?
            <ScrollView style={{ flex: 1, backgroundColor: primaryColor }}>
                <View style={{ flex: 1.7, backgroundColor: 'white' }}>
                    <View style={{ flex: 1 }}>
                        <DateComponent showNavigationIcons={route?.params?.showNavigationIcons} onPressIcon={handlePressIcon} date={route?.params?.date} leftIconDisabled={true} />
                        <View style={{ flex: 1, marginHorizontal: normalizeWidth(50), borderWidth: normalizeWidth(3), borderRadius: normalizeWidth(10), justifyContent: 'space-evenly' }}>
                            {
                                huntingDetail?.is_non_hunting_month ?
                                    <NonHuntingMonthBox text={huntingDetail?.non_hunting_month_note} /> :
                                    <>
                                        <Text style={{ color: huntingDetail?.color, fontSize: normalizeFont(21), fontFamily: fontFamily.Primary.SemiBold, textAlign: 'center', lineHeight: normalizeHeight(30) }}>{huntingDetail?.hunting_location_type}</Text>
                                        <Text style={{ color: huntingDetail?.color, fontFamily: fontFamily.Primary.SemiBold, fontSize: normalizeFont(35), lineHeight: normalizeHeight(50), textAlign: 'center' }}>{location && location[0].trim() || 'N/A'}</Text>
                                        <Text style={{ color: huntingDetail?.color, fontSize: normalizeFont(21), lineHeight: normalizeHeight(26), fontFamily: fontFamily.Primary.SemiBold, textAlign: 'center', lineHeight: normalizeHeight(30) }}>{location && location[1].trim() || 'N/A'}</Text>
                                    </>
                            }
                        </View>
                    </View>
                    <DashboardModal handleModal={toggleModal} isModalVisible={isModalVisible} item={huntingDetail} />
                    <TouchableOpacity style={{ flex: 2 }} onPress={toggleModal} activeOpacity={1}>
                        {
                            huntingDetail?.weather ?
                                <>
                                    <View style={{
                                        ...styles.weatherContainer
                                    }}>
                                        <View style={{ flex: 1.5, backgroundColor: 'white', flexDirection: 'row', borderTopLeftRadius: getWeatherContainerBorderRadius(), borderBottomLeftRadius: getWeatherContainerBorderRadius() }}>
                                            <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                                                <RenderTemperature temperature={huntingDetail?.weather?.maxTempF || 0} level="Day" />
                                            </View>
                                            <View style={{ height: '60%', width: StyleSheet.hairlineWidth, backgroundColor: '#BFBFBF', alignSelf: 'center' }}>
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                <RenderTemperature temperature={huntingDetail?.weather?.minTempF || 0} level="Night" />
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, backgroundColor: weatherIconAndBackgroundDetails.Sunny.backgroundColor, borderTopRightRadius: getWeatherContainerBorderRadius(), borderBottomRightRadius: getWeatherContainerBorderRadius() }}>
                                            <Image source={{ uri: huntingDetail?.weather?.icon }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                        </View>
                                    </View>

                                </>
                                :
                                <View style={{ flex: 1, alignItems: 'center', height: normalizeHeight(100), justifyContent: 'center', borderWidth: 0.1, borderColor: whiteColor, marginHorizontal: normalizeWidth(10), padding: normalizeHeight(10), marginVertical: normalizeHeight(10), marginTop: normalizeHeight(10), borderRadius: normalizeWidth(10) }}>
                                    <Text style={{ color: primaryColor, fontFamily: fontFamily.Primary.Bold, fontSize: fontH2, textAlign: 'center' }}>{'Weather Details are not available at this time.'}</Text>
                                </View>
                        }
                    </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: normalizeWidth(15), marginVertical: normalizeHeight(5), paddingVertical: normalizeHeight(10) }}>
                        <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                            <Text style={styles.timingDetails}>Twilight Start: {huntingDetail?.twilight_start}</Text>
                            <Text style={styles.timingDetails}>Sun Rise: {huntingDetail?.sun_rise}</Text>
                            <Text style={styles.timingDetails}>Sun Set: {huntingDetail?.sun_set}</Text>
                            <Text style={styles.timingDetails}>Twilight End: {huntingDetail?.twilight_end}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            {
                                huntingDetail?.weather ?
                                    <>
                                        <Text style={styles.weatherDetails}>{huntingDetail?.weather?.weather}</Text>
                                        <Text style={styles.weatherDetails}>Wind</Text>
                                        <Text style={styles.weatherDetails}>{huntingDetail?.weather?.windDir} - {huntingDetail?.weather?.windSpeedMPH}</Text>
                                    </>
                                    :
                                    <></>
                            }
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: primaryColor, height: normalizeHeight(250), paddingHorizontal: normalizeWidth(15) }}>
                    <View style={{ flex: 1.2, justifyContent: 'space-evenly', paddingBottom: normalizeHeight(60), }}>
                        <View>
                            <Text style={styles.moonDetailText}>Moon Phase: {huntingDetail?.moon_phase_illumination}</Text>
                            <Text style={styles.moonDetailText}>Moon Rise: {huntingDetail?.moon_rise}</Text>
                            <Text style={styles.moonDetailText}>Moon Set: {huntingDetail?.moon_set}</Text>
                            <Text style={styles.moonDetailText}>Moon Transit: {huntingDetail?.moon_transit_api}</Text>
                        </View>
                        <View>
                            {
                                huntingDetail?.weather ?
                                    <>
                                        <View style={{
                                            flexDirection: "row",
                                        }}>
                                            <View style={{ flexDirection: "column", }} >
                                                <Text style={styles.moonDetailText}>Barometric Pressure</Text>
                                                <Text style={styles.moonDetailText} >{`(inHg) ${huntingDetail?.weather?.pressureIN} ${huntingDetail?.weather?.weather}`}</Text>
                                            </View>
                                            <Image source={arrow_up} style={{ marginStart: normalizeWidth(5) }} resizeMode="contain" />
                                        </View>
                                    </>
                                    :
                                    <></>
                            }
                        </View>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingBottom: normalizeHeight(60) }}>
                        <Text style={{ ...styles.moonText, marginRight: huntingDetail?.moon_phase_name === "full moon" ? normalizeWidth(15) : normalizeWidth(5) }}>{huntingDetail?.moon_phase_name}</Text>
                        <Image source={{ uri: huntingDetail?.moon_image }} style={{ width: '65%', height: '65%' }} resizeMode="contain" />
                    </View>
                </View>
            </ScrollView >
            :
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: whiteColor }}>
                <Loading size='large' color={primaryColor} />
            </View>
    )
}

const mapStateToProps = state => {
    return {
        Coordinate: state.favoriteLocation.Coordinate,
        huntingForMonth: state.home.huntingForMonth,
        indexTime: state.home.indexTime,
        isDay: state.home.isDay
    }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(CalenderDate)
const styles = StyleSheet.create({
    moonText: {
        color: 'white',
        fontFamily: fontFamily.Primary.Medium,
        fontSize: fontH2V2,
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

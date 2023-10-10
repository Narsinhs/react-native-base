import React, { useMemo, useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Calendar } from 'react-native-calendars'
import { alignLeftMoon, alignRightMoon, blackDear, fullDarkMoon, fullMoon, greenDear, redDear } from '../../../assets/images';
import { addDaysToDate, addYearToDate, formatDate, getDifferenceOfYearsInDates, isToday } from '../../../utils/DateUtil';
import { deviceHeight, normalizeFont, normalizeHeight, normalizeWidth, normalizeWithScale } from "../../../utils/FontUtil";
import { blackColor, fontFamily, fontH2, fontH2V2, fontH2V3, fontH3, fontH3V3, greyedSchemeColor, headingTextBlackColor, primaryColor, redColor, whiteColor } from "../../../constants/Styles"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import FadeInView from '../../../hoc/FadeInHoc';
import { useCalendarUtil } from '../../../utils/CalendarUtil';
import { RouteNames } from '../../../constants/RouteNames';
import { connect, useSelector } from 'react-redux';
import { GetHuntingDetailsForMonth, NullHuntingMonthData } from '../../../redux/actions/index';
import ReversedFlatList from 'react-native-reversed-flat-list';
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import moment from 'moment';
import { getToken } from '../../../utils/TokenUtil';
import { API_RESPONSE_STATUS } from '../../../constants/Enum';
import { setCalenderDetails } from '../../../redux/actions/HuntingDetailAction'
import { registerToastMessage } from '../../../utils/RegisterToast';
import { fetchUtil } from '../../../utils/FetchUtils';
import { CheckMonthForNonHunting } from '../../../utils/CommonUtil';
const initYear = Number((new Date()).getFullYear());

const MonthCalendar = (props) => {
    const { user, geoLocation, GetHuntingDetailsForMonth, selectedLocation, setCalenderDetails, InternetConnected, Coordinate, headerArrowPressed, NullHuntingMonthData } = props
    const [yearList, setYearList] = useState([])
    const calenderDetails = useSelector(state => state.hunt.calenderDetails)
    useEffect(() => {
        let yearDiffArray = getDifferenceOfYearsInDates(new Date(user?.personal?.created_date), new Date(addYearToDate(new Date(user?.personal?.created_date), 1)))
        setYearList(yearDiffArray)
    }, [])

    useCalendarUtil()
    const [markedDate, setMarkedDate] = useState({})
    const [yearListVisible, setYearListVisible] = useState(false);
    const [month, setMonth] = useState(null)
    const [current, setCurrent] = useState()
    const [fetching, setFetching] = useState(false)
    useEffect(() => {
        if (headerArrowPressed && (geoLocation?.city || geoLocation?.state) && Object.keys(selectedLocation).length !== 0) {
            if (InternetConnected && current) {
                let obj = {
                    dateString: current
                }
                handleMonthApi(obj)
            }
        }
    }, [Coordinate, (geoLocation && headerArrowPressed), InternetConnected])

    useEffect(() => {
        let obj = {
            dateString: formatDate(new Date(), "YYYY-MM-DD")
        }
        if (InternetConnected && (geoLocation?.city || geoLocation?.state) && Object.keys(selectedLocation).length !== 0) {
            handleMonthApi(obj)
        }
    }, [])

    useEffect(() => {
        if (headerArrowPressed && !InternetConnected && Object.keys(selectedLocation).length !== 0) {
            setFetching(true)
        }
        setTimeout(() => {
            if (Object.keys(calenderDetails).length !== 0 && current && calenderDetails[`${geoLocation?.city},${geoLocation?.state}`] && calenderDetails[`${geoLocation?.city},${geoLocation?.state}`][current]) {
                handleMarkedDate(calenderDetails[`${geoLocation?.city},${geoLocation?.state}`][current])
            }
            else {
                setMarkedDate({})
                if (headerArrowPressed && !InternetConnected) {
                    setFetching(false)
                }
            }
        }, 500);



    }, [calenderDetails, current, (geoLocation && headerArrowPressed), InternetConnected])



    const handleMonthApi = (val, loading = false) => {
        console.log("11111111111111111")
        setFetching(true)
        if (Object.keys(selectedLocation).length === 0) {
            setTimeout(() => {
                setFetching(false)
            }, 500);
            return
        }
        let date = moment(val.dateString).format("YYYY-MM") + "-01"
        setCurrent(date)
        if (calenderDetails && calenderDetails[`${geoLocation?.city},${geoLocation?.state}`] && calenderDetails[`${geoLocation?.city},${geoLocation?.state}`][date]) {
            if (loading) {
                setTimeout(() => {
                    setFetching(false)
                }, 500);
            }
            return;
        }
        let location = geoLocation?.city + "," + geoLocation?.state
        fetchUtil({
            url: `/monthly-hunting-details/get/${location}/${date}`,
            method: `GET`,
            token: getToken()
        }).then((response) => {
            if (response.status === API_RESPONSE_STATUS.SUCCESS) {
                console.log("11111111111111")
                const temp = { ...calenderDetails }
                temp[location] = { ...temp[location] };
                temp[location][date] = response?.data?.detail
                setCalenderDetails(temp);
            }
            else {
                if (response?.description && !response?.message) {
                    console.log(response, "response")
                    // registerToastMessage(response?.description, false)
                }
                setTimeout(() => {
                    setFetching(false)
                }, 200);
            }
        }).catch((e) => {
            setMarkedDate({})
            setTimeout(() => {
                setFetching(false)
            }, 100);
        });
    }
    const handleMarkedDate = (value) => {
        let object = {}
        if (value) {
            value.map((val) => {
                object[val.original_date] = { isRed: val?.color === 'red' ? true : false, moonIcon: val?.moon_image, showMoonImage: val?.show_moon_image, hunting: val?.is_hunting_details_found, isNotHuntingMonth: val?.is_non_hunting_month }
            })
        } else {
            // console.log("//////////")
            // huntingForMonth && huntingForMonth.map((val) => {
            //     object[val.original_date] = { isRed: val?.color === 'red' ? true : false, moonIcon: val?.moon_image, hunting: val?.is_hunting_details_found }
            // })
        }
        setMarkedDate(object)
        setTimeout(() => {
            setFetching(false)
        }, 500);
    }
    const RenderArrow = (arrowDirection) => {
        return (
            <FontAwesomeIcon icon={arrowDirection === 'left' ? faAngleLeft : faAngleRight} size={normalizeWithScale(20)} />
        )
    }
    const RenderYear = ({ item }) => {
        const year = item;
        return (
            <TouchableOpacity
                onPress={() => onSelectYear(year)}
                style={{ alignItems: 'center', marginBottom: normalizeHeight(2) }}>
                <Text style={{ color: blackColor, fontFamily: fontFamily.Primary.Medium, fontSize: fontH2 }}>{year}</Text>
            </TouchableOpacity>
        )
    }

    const onSelectYear = (year) => {
        const transformedMonth = month.setFullYear(year);
        const transformedCurrent = month.toString('yyyy-MM-dd');
        handleMonthApi({ dateString: transformedCurrent }, true)
        setMonth(transformedMonth)
        setYearListVisible(prev => !prev)
    }


    const onPressYear = (date) => {
        const current = date.toString('yyyy-MM-dd');
        setMonth(date)
        setYearListVisible(prev => !prev)
        // setCurrent(current)
    }

    const RenderHeader = (date) => {
        return (
            <View>
                <TouchableOpacity onPress={() => onPressYear(date)}>
                    <Text style={{ color: headingTextBlackColor, fontFamily: fontFamily.Primary.SemiBold, fontSize: fontH2 }}>{formatDate(new Date(date), "MMMM, YYYY")}</Text>
                </TouchableOpacity>
                <Collapsible collapsed={!yearListVisible} >
                    {
                        yearList.map(each => {
                            return (
                                <RenderYear key={each} item={each} />
                            )
                        })
                    }

                </Collapsible>
            </View>
        )
    }
    const RenderInfo = React.memo(({ image, text, textColor }) => {
        return (
            <View style={styles.infoContainer}>
                <View style={{ borderWidth: StyleSheet.hairlineWidth, padding: normalizeWidth(2) }} >
                    <Image source={image} style={{ width: normalizeWidth(25), height: normalizeWidth(25) }} />
                </View>
                <View style={{ flex: 8, marginLeft: normalizeWidth(10) }}>
                    <Text style={{ ...styles.infoText, color: textColor }}>{text}</Text>
                </View>
            </View>
        )
    })
    const handleDateInfo = (isCurrentDay) => {
        if (isCurrentDay && calenderDetails && calenderDetails[`${geoLocation?.city},${geoLocation?.state}`] && calenderDetails[`${geoLocation?.city},${geoLocation?.state}`][current]) {
            return props.navigation.navigate(RouteNames.User.CalenderDate, { showNavigationIcons: false, date: isCurrentDay?.dateString, currentMonth: calenderDetails[`${geoLocation?.city},${geoLocation?.state}`][current] })
        }

    }
    return (
        <ScrollView nestedScrollEnabled style={{ flex: 1, backgroundColor: whiteColor, marginBottom: normalizeHeight(40) }}>
            <Calendar
                current={current}
                enableSwipeMonths={true}
                hideExtraDays={true}
                hideArrows={yearListVisible}
                dayComponent={({ date, state: dateStatus, marking, markingType }) => {
                    const isCurrentDay = isToday(date.dateString)

                    return (
                        fetching ?
                            <>
                                <View style={{ alignItems: 'center', justifyContent: 'center', height: normalizeHeight(70) }}>
                                    <ActivityIndicator size={'small'} color={primaryColor} />
                                </View>
                            </>
                            :
                            <>
                                <TouchableOpacity disabled={dateStatus === 'disabled' || (!marking?.hunting && !marking?.isNotHuntingMonth)} onPress={() => handleDateInfo(date)} style={{ flex: 1, backgroundColor: isCurrentDay ? "#0079361A" : 'white', borderColor: isCurrentDay ? primaryColor : '#00000020', borderWidth: isCurrentDay ? normalizeWidth(0.6) : StyleSheet.hairlineWidth, }}>
                                    <View style={{ flex: 1, paddingHorizontal: normalizeWidth(10), paddingTop: normalizeHeight(5), opacity: dateStatus === 'disabled' || (!marking?.hunting && !marking?.isNotHuntingMonth) ? 0.5 : 1 }}>
                                        <Image source={marking?.isNotHuntingMonth ? blackDear : marking?.isRed ? redDear : CheckMonthForNonHunting(date.dateString) ? blackDear : greenDear} style={{ width: normalizeWidth(30), height: normalizeWidth(30) }} />
                                        <Text style={{ textAlign: 'center', color: dateStatus === 'disabled' ? greyedSchemeColor : headingTextBlackColor, fontFamily: isCurrentDay ? fontFamily.Primary.SemiBold : fontFamily.Primary.Regular, fontSize: fontH3 }}>
                                            {date.day}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: normalizeWidth(2), paddingBottom: normalizeHeight(2) }}>
                                        {
                                            marking?.moonIcon && marking?.showMoonImage ?
                                                <Image source={{ uri: marking?.moonIcon }} style={{ width: normalizeWidth(10), height: normalizeWidth(10), resizeMode: 'contain', opacity: dateStatus === 'disabled' ? 0.5 : 1 }} />
                                                : <View style={{ width: normalizeWidth(5), height: normalizeWidth(5), borderRadius: normalizeWidth(5) }}></View>
                                        }
                                    </View>
                                </TouchableOpacity>
                            </>
                    );
                }}
                markingType={'multi-dot'}
                markedDates={fetching ? {} : markedDate}
                onMonthChange={handleMonthApi}
                maxDate={new Date(addYearToDate(new Date(user?.personal?.created_date), 1))}
                minDate={new Date(user?.personal?.created_date)}
                theme={{
                    textDayHeaderFontSize: fontH3,
                    textDayHeaderFontFamily: fontFamily.Primary.SemiBold,
                    'stylesheet.calendar.main': {
                        dayContainer: {
                            borderColor: greyedSchemeColor,
                            borderWidth: StyleSheet.hairlineWidth,
                            flex: 1,

                        },
                        emptyDayContainer: {
                            borderColor: greyedSchemeColor,
                            borderWidth: StyleSheet.hairlineWidth,
                            flex: 1,
                        },
                        week: {
                            marginTop: 0,
                            marginBottom: 0,
                            flexDirection: 'row',
                            justifyContent: 'space-around',

                        },
                        today: {
                            backgroundColor: 'green'
                        }
                    },
                    'stylesheet.calendar.header': {
                        week: {
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            borderTopWidth: StyleSheet.hairlineWidth,
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            borderColor: greyedSchemeColor,
                            paddingTop: normalizeHeight(7)
                        }
                    },

                }}
                renderHeader={RenderHeader}
                renderArrow={RenderArrow}

            />

            <View style={{ flex: 1, justifyContent: 'center', height: normalizeHeight(150), marginBottom: normalizeHeight(20) }}>
                <RenderInfo image={greenDear} text={"Green Days Indicate Morning and Afternoon Hunts"} textColor={primaryColor} />
                <RenderInfo image={redDear} text={"Red Days Indicate Hunting in or Around Resting Places"} textColor={redColor} />
                <RenderInfo image={blackDear} text={"Black Days Indicate Non Hunting Months"} textColor={blackColor} />
            </View>
        </ScrollView >
    )
}



const mapStateToProps = state => {
    return {
        headerArrowPressed: state.home.headerArrowPressed,
        Coordinate: state.favoriteLocation.Coordinate,
        huntingForMonth: state.home.huntingForMonth,
        geoLocation: state.favoriteLocation.geoLocation,
        user: state?.auth?.user,
        InternetConnected: state?.InternetConnection?.internetConnected,
        selectedLocation: state.favoriteLocation.selectedLocation,
    }
}
const mapDispatchToProps = {
    GetHuntingDetailsForMonth,
    NullHuntingMonthData,
    setCalenderDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthCalendar)

const styles = StyleSheet.create({
    infoText: {
        color: primaryColor,
        fontFamily: fontFamily.Primary.Regular,
        fontSize: normalizeFont(11)
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: normalizeWidth(10),
        marginTop: normalizeHeight(10)
    }
})

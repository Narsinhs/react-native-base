
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { arrow_up, fullMoonIcon, locationIcon } from '../../../assets/images'
import { Date_Arrow_Icon_Type, weatherIconAndBackgroundDetails } from '../../../constants/constants'
import { RouteNames } from '../../../constants/RouteNames'
import { blackColor, fontFamily, fontH1, fontH2, fontH2V2, fontH2V3, fontH3, fontH3V3, fontSmallSize, primaryColor, whiteColor } from '../../../constants/Styles'
import { addDaysToDate, formatDate, getComparasionOfDayNight } from '../../../utils/DateUtil'
import { normalizeFont, normalizeHeight, normalizeWidth, normalizeWithScale } from '../../../utils/FontUtil'
import DashboardModal from '../../shared/DashboardModal'
import DateComponent from '../../shared/DateComponent'
import { GetHuntingDetailsForDay, GetHuntingDetailsForMonth, GetCurrentWeather, CoordinateSet, IsArrowPressedFromHeader, LocationSuccessFirstTime, NullHuntingTodayData, SetIndexTime, getMe } from '../../../redux/actions/index';
import { connect, useSelector } from 'react-redux';
import { API_RESPONSE_STATUS, HUNTING_DETAIL_SPLIT_ASCII } from '../../../constants/Enum'
import CustomButton from '../../shared/CustomButton'
import NonHuntingMonthBox from '../../shared/NonHuntingMonthBox'
import moment from 'moment'
import { fetchUtil } from '../../../utils/FetchUtils'
import { registerToastMessage } from '../../../utils/RegisterToast'
import { setHuntingDetails } from '../../../redux/actions/HuntingDetailAction'
import { getToken } from '../../../utils/TokenUtil'
import { Loading } from '../../shared/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export const REFRESH_FROM = {
  "PULL_TO_REFRESH": "PULL_TO_REFRESH",
  "FIRST_TIME": "FIRST_TIME"
}

const Today = ({ GetCurrentWeather, getMe, user, navigation, geoLocation, allLocations, setHuntingDetails, CoordinateSet, indexTime, InternetConnected, SetIndexTime, locationFetchFirstTime, isDay, LocationSuccessFirstTime, selectedLocation, NullHuntingTodayData, GetHuntingDetailsForDay, Coordinate, GetHuntingDetailsForMonth, huntingForMonth, IsArrowPressedFromHeader, headerArrowPressed }) => {
  const [isPullToRefreshLoading, setIsPullToRefreshLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [huntingForToday, setHuntingForToday] = useState({})
  const [internetCheck, setInternetCheck] = useState(true);
  const [fetchingCurrentWeather, setCurrentWeather] = useState(false);

  // Navigating the user to subscription screen if not subscribed or plan is expired;

  useEffect(() => {
    getMe()
  }, [])
  useEffect(() => {
    if (user?.personal?.subscription_expired) {
      setTimeout(() => {
        navigation.navigate(RouteNames.User.SubscriptionDrawer)
      }, 0)
    }
  }, [user.personal.subscription_expired, navigation])

  useEffect(() => {
    if (headerArrowPressed && (geoLocation?.city || geoLocation?.state) && Object.keys(selectedLocation).length !== 0 && allLocations) {
      {
        if (locationFetchFirstTime) {
          setTimeout(() => {
            LocationSuccessFirstTime()
          }, 1000);
        }
        else {
          if (InternetConnected) {
            handleHuntingApi()
            setTimeout(() => {
              IsArrowPressedFromHeader(false)
            }, 500);
          }
          else {
            setTimeout(() => {
              setFetching(false)
              IsArrowPressedFromHeader(false)

            }, 500);
          }
        }
      }
    }
    else {
      if (locationFetchFirstTime) {
        setTimeout(() => {
          LocationSuccessFirstTime()
        }, 1000);
      }
    }
  }, [Coordinate, geoLocation, headerArrowPressed, locationFetchFirstTime, selectedLocation?.latitude, InternetConnected])


  const huntingDetails = useSelector(state => state.hunt.huntingDetails)

  useEffect(() => {
    setFetching(true)
    let location = geoLocation?.city + "," + geoLocation?.state
    let currentlocationData = huntingDetails && huntingDetails[location]
    if (!currentlocationData) {
      setHuntingForToday({})
      if (Object.values(huntingDetails)?.length !== 0 && !headerArrowPressed) {
        setTimeout(() => {
          setFetching(false)
        }, 2000);
      }
      return;
    }
    let huntingallDetails = currentlocationData?.filter(val => moment(val?.original_date, "YYYY-MM-DD").isSameOrAfter(moment().format("YYYY-MM-DD")))
    if (huntingallDetails?.length !== currentlocationData?.length) {
      let temp = { ...huntingDetails }
      temp[location] = huntingallDetails
      setHuntingDetails(temp);
    }
    setHuntingForToday(huntingallDetails[0] || {})
    setTimeout(() => {
      setFetching(false)
    }, 1000);
  }, [huntingDetails, geoLocation])
  useEffect(() => {
    setInternetCheck(InternetConnected)
    if (!internetCheck && !headerArrowPressed && InternetConnected) {
      IsArrowPressedFromHeader(true)
    }
  }, [InternetConnected])
  const handleHuntingApi = (forced = false) => {
    let location = geoLocation?.city + "," + geoLocation?.state
    if ((!geoLocation?.state || huntingDetails[location]?.length === 14) && !forced && !location) {
      setHuntingForToday({})
      return
    }
    let date = formatDate(new Date(), "YYYY-MM-DD")
    let noOfDays = 13;
    fetchUtil({
      url: `/hunting-details/get/${location}/${date}/${noOfDays}`,
      method: `GET`,
      token: getToken()
    }).then((response) => {
      if (response.status === API_RESPONSE_STATUS.SUCCESS) {
        const temp = { ...huntingDetails }
        temp[location] = response?.data?.detail;
        setHuntingDetails(temp);

      }
      else {
        if (response?.description && !response?.message) {
          console.log(response?.description, "////////")
          // registerToastMessage(response?.description, false)
        }
      }
    });
  }
  const onPullToRefresh = () => {
    handleHuntingApi(true)
  }
  const currentWeather = () => {
    if (fetchingCurrentWeather) {
      return;
    }
    setCurrentWeather(true);
    GetCurrentWeather(Coordinate?.latitude, Coordinate?.longitude, user?.personal?.email).then((res) => {
      navigation.navigate(RouteNames.User.CurrentWeather, { url: res?.data?.page_url, InternetConnected })
      setCurrentWeather(false);
    }).catch(err => {
      setCurrentWeather(false);
    })
  }
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    if (huntingForToday?.weather) {
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

  // const HandleTime = () => {
  //   return new Promise((resolve, reject) => {
  //     let CurrentTime = moment()
  //     let index;
  //     huntingForToday?.weather_day_night?.length && huntingForToday?.weather_day_night.filter((each, i) => {
  //       if (each.isDay === 0) {
  //         return index = i
  //       }
  //     })
  //     let isDay = getComparasionOfDayNight(CurrentTime, '7:00:00', '19:00:00')
  //     if (isDay) {
  //       SetIndexTime(index, isDay)
  //       setTimeout(() => {
  //         resolve(true)
  //       }, 100);

  //     }
  //     else if (!isDay) {
  //       SetIndexTime(index ? 0 : 1, isDay)
  //       setTimeout(() => {
  //         resolve(true)
  //       }, 100);
  //     }
  //   })

  // }
  let location = huntingForToday && huntingForToday?.hunting_location?.split(HUNTING_DETAIL_SPLIT_ASCII);
  // let dayFlag = huntingForToday?.weather?.length && huntingForToday?.weather[0]?.isDay
  const handleAddLocationNavigation = () => {
    if (!InternetConnected) {
      registerToastMessage("This feature is not available in offline mode.", false)
      return
    }
    else {
      navigation.navigate(RouteNames.User.AddLocation)
    }
  }
  if (!allLocations.length && !locationFetchFirstTime) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ textAlign: 'center', fontFamily: fontFamily.Primary.SemiBold, fontSize: fontH2, color: primaryColor, marginBottom: normalizeHeight(10) }}>To view hunting and weather details</Text>
        <CustomButton onPress={handleAddLocationNavigation} ImgSource={locationIcon} height={normalizeHeight(42)} buttonText={'Please add location'} buttonColor={primaryColor} buttonTextColor={whiteColor} borderRadius={normalizeWidth(10)} bordercolor={primaryColor} />
      </View>
    )
  }
  if (selectedLocation && Object.values(huntingForToday)?.length === 0 && allLocations.length && !headerArrowPressed && !locationFetchFirstTime && !fetching) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <CustomButton onPress={() => console.log("hello")} height={normalizeHeight(42)} buttonText={'No data is found on the selected location'} buttonColor={primaryColor} buttonTextColor={whiteColor} borderRadius={normalizeWidth(10)} bordercolor={primaryColor} disabled={true} />
      </View>
    )
  }
  return (
    (Object.keys(huntingForToday)?.length !== 0 && selectedLocation) && !locationFetchFirstTime && !headerArrowPressed ?
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isPullToRefreshLoading}
            onRefresh={onPullToRefresh}
          />
        }
        style={{ flex: 1, backgroundColor: 'white' }} >
        <View style={{ flex: 1.7, backgroundColor: 'white' }}>
          <View style={{ flex: 1 }}>
            <DateComponent onPressIcon={handlePressIcon} date={huntingForToday?.original_date} leftIconDisabled={true} />
            <View style={{ flex: 1, marginHorizontal: normalizeWidth(50), borderWidth: normalizeWidth(3), borderRadius: normalizeWidth(10), justifyContent: 'space-evenly' }}>
              {
                huntingForToday?.is_non_hunting_month ?
                  <NonHuntingMonthBox text={huntingForToday?.non_hunting_month_note} />
                  :
                  <>
                    <Text style={{ color: huntingForToday?.color, fontSize: normalizeFont(21), fontFamily: fontFamily.Primary.SemiBold, textAlign: 'center', lineHeight: normalizeHeight(30) }}>{huntingForToday?.hunting_location_type}</Text>
                    <Text style={{ color: huntingForToday?.color, fontFamily: fontFamily.Primary.SemiBold, fontSize: normalizeFont(35), lineHeight: normalizeHeight(50), textAlign: 'center' }}>{location && location[0].trim() || 'N/A'}</Text>
                    <Text style={{ color: huntingForToday?.color, fontSize: normalizeFont(21), lineHeight: normalizeHeight(26), fontFamily: fontFamily.Primary.SemiBold, textAlign: 'center', lineHeight: normalizeHeight(30) }}>{location && location[1].trim() || 'N/A'}</Text>
                  </>
              }

            </View>
          </View>
          <DashboardModal handleModal={toggleModal} isModalVisible={isModalVisible} item={huntingForToday} />
          <TouchableOpacity style={{ flex: 2 }} onPress={toggleModal} activeOpacity={1}>
            {
              huntingForToday?.weather || true ?
                <>
                  <View style={{
                    ...styles.weatherContainer
                  }}>
                    <View style={{ flex: 1.5, backgroundColor: 'white', flexDirection: 'row', borderTopLeftRadius: getWeatherContainerBorderRadius(), borderBottomLeftRadius: getWeatherContainerBorderRadius() }}>
                      <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                        <RenderTemperature temperature={huntingForToday?.weather?.maxTempF || 0} level="High" />
                      </View>
                      <View style={{ height: '60%', width: StyleSheet.hairlineWidth, backgroundColor: '#BFBFBF', alignSelf: 'center' }}>
                      </View>
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <RenderTemperature temperature={huntingForToday?.weather?.minTempF || 0} level="Low" />
                      </View>
                    </View>
                    <View style={{ flex: 1, backgroundColor: weatherIconAndBackgroundDetails.Sunny.backgroundColor, borderTopRightRadius: getWeatherContainerBorderRadius(), borderBottomRightRadius: getWeatherContainerBorderRadius() }}>
                      <Image source={{ uri: huntingForToday?.weather?.icon }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                    </View>
                  </View>
                  {InternetConnected ? <TouchableOpacity onPress={currentWeather} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginHorizontal: normalizeWidth(10) }}>
                    <Text style={{ fontSize: fontH2V2, fontFamily: fontFamily.Primary.SemiBold, textDecorationLine: 'underline', color: primaryColor }}> Current Temperature </Text>
                    {fetchingCurrentWeather ? < Loading /> : <FontAwesomeIcon icon={faInfoCircle} color={primaryColor} />}
                  </TouchableOpacity> : null}

                </>
                :
                <View style={{ flex: 1, alignItems: 'center', height: normalizeHeight(100), justifyContent: 'center', borderWidth: 0.1, borderColor: whiteColor, marginHorizontal: normalizeWidth(10), padding: normalizeHeight(10), marginVertical: normalizeHeight(10), borderRadius: normalizeWidth(10) }}>
                  <Text style={{
                    color: primaryColor, fontFamily: fontFamily.Primary.Bold, fontSize: fontH2, textAlign: 'center'
                  }}>{'Weather Details are not available at this time.'}</Text>
                </View>
            }
          </TouchableOpacity>
          <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: normalizeWidth(15), marginVertical: normalizeHeight(5), paddingVertical: normalizeHeight(10) }}>
            <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
              <Text style={styles.timingDetails}>Twilight Start: {huntingForToday?.twilight_start}</Text>
              <Text style={styles.timingDetails}>Sun Rise: {huntingForToday?.sun_rise}</Text>
              <Text style={styles.timingDetails}>Sun Set: {huntingForToday?.sun_set}</Text>
              <Text style={styles.timingDetails}>Twilight End: {huntingForToday?.twilight_end}</Text>
            </View>
            <View style={{ flex: 1 }}>
              {
                huntingForToday?.weather ?
                  <>
                    <Text style={styles.weatherDetails}>{huntingForToday?.weather?.weather}</Text>
                    <Text style={styles.weatherDetails}>Wind</Text>
                    <Text style={styles.weatherDetails}>{huntingForToday?.weather?.windDir} - {huntingForToday?.weather?.windSpeedMPH}</Text>
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
              <Text style={styles.moonDetailText}>Moon Phase: {huntingForToday?.moon_phase_illumination}</Text>
              <Text style={styles.moonDetailText}>Moon Rise: {huntingForToday?.moon_rise}</Text>
              <Text style={styles.moonDetailText}>Moon Set: {huntingForToday?.moon_set}</Text>
              <Text style={styles.moonDetailText}>Moon Transit: {huntingForToday?.moon_transit_api}</Text>
            </View>
            <View>
              {
                huntingForToday?.weather ?
                  <>
                    <View style={{
                      flexDirection: "row",
                    }}>
                      <View style={{ flexDirection: "column", }} >
                        <Text style={styles.moonDetailText}>Barometric Pressure</Text>
                        <Text style={styles.moonDetailText} >{`(inHg) ${huntingForToday?.weather?.pressureIN} ${huntingForToday?.weather?.weather}`}</Text>
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
            <Text style={styles.moonText}>{huntingForToday?.moon_phase_name}</Text>
            <Image source={{ uri: huntingForToday?.moon_image }} style={{ width: '70%', height: '70%' }} resizeMode="contain" />
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
    Coordinate: state.favoriteLocation.Coordinate,
    headerArrowPressed: state.home.headerArrowPressed,
    huntingForMonth: state.home.huntingForMonth,
    geoLocation: state.favoriteLocation.geoLocation,
    selectedLocation: state.favoriteLocation.selectedLocation,
    locationFetchFirstTime: state.general.locationFetchFirstTime,
    allLocations: state?.favoriteLocation?.allLocations,
    InternetConnected: state?.InternetConnection?.internetConnected,
    indexTime: state.home.indexTime,
    user: state?.auth.user
  }
}

const mapDispatchToProps = {
  GetHuntingDetailsForDay,
  GetHuntingDetailsForMonth,
  IsArrowPressedFromHeader,
  LocationSuccessFirstTime,
  NullHuntingTodayData,
  SetIndexTime,
  setHuntingDetails,
  CoordinateSet,
  GetCurrentWeather,
  getMe
}

export default connect(mapStateToProps, mapDispatchToProps)(Today)
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

import React from "react";
import { Button, Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { modalcancelIcon } from "../../assets/images";
import { dummyModalWeather, weatherIconAndBackgroundDetails } from "../../constants/constants";
import { dividerBlackColor, fontFamily, fontH2, fontH2V2, fontH3, fontH3V3, headingTextBlackColor, weatherBackgroundColor, whiteColor } from "../../constants/Styles";
import { deviceHeight, normalizeFont, normalizeHeight, normalizeWidth } from "../../utils/FontUtil";
const hitSlop = normalizeWidth(20)
const DashboardModal = ({ handleModal, isModalVisible, item }) => {
    let array = Array.from(Array(4).keys());

    return (
        <Modal animationType='fade' isVisible={isModalVisible} transparent={true} onBackdropPress={handleModal} onBackButtonPress={handleModal}>
            <View style={{ height: deviceHeight * 0.53, marginHorizontal: normalizeWidth(20), }}>
                <View style={{ borderRadius: normalizeWidth(10), overflow: 'hidden', borderColor: 'transparent' }}>
                    <View style={{ height: '50%', backgroundColor: weatherIconAndBackgroundDetails.Sunny.backgroundColor, justifyContent: 'space-between', padding: normalizeHeight(10) }}>
                        <TouchableOpacity onPress={handleModal} style={{ alignItems: 'flex-end' }} hitSlop={{ right: hitSlop, top: hitSlop, left: hitSlop, bottom: hitSlop }}>
                            <Image source={modalcancelIcon} resizeMode={'contain'} style={{ width: normalizeWidth(20), height: normalizeWidth(20) }} />
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center', fontSize: fontH2, fontFamily: fontFamily.Primary.Bold, color: headingTextBlackColor, lineHeight: 30 }}>{item?.full_date}</Text>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={{ uri: item?.weather?.icon }} style={{ width: normalizeWidth(90), height: normalizeHeight(90) }} resizeMode={'contain'} />
                        </View>
                        <Text style={{ textAlign: 'center', fontFamily: fontFamily.Primary.SemiBold, fontSize: fontH2V2, color: headingTextBlackColor }}>{item?.weather?.weather} Wind {item?.weather?.windDir} - {item?.weather?.windSpeedMPH}</Text>
                    </View>
                    <View style={{ height: '50%', backgroundColor: whiteColor, padding: normalizeWidth(10), paddingTop: normalizeHeight(10) }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ width: '45%', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', fontSize: fontH2, fontFamily: fontFamily.Primary.SemiBold, color: headingTextBlackColor, lineHeight: 30 }}>High</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center', fontSize: normalizeFont(65), fontFamily: fontFamily.Primary.SemiBold, color: headingTextBlackColor, lineHeight: 80 }}>{item?.weather?.maxTempF}</Text>
                                    <Text style={{ bottom: normalizeHeight(15), textAlign: 'center', fontSize: normalizeFont(20), fontFamily: fontFamily.Primary.SemiBold, color: headingTextBlackColor }}>&#8457;</Text>
                                </View>
                                {/* <Text style={{ textAlign: 'center', fontFamily: fontFamily.Primary.Regular, fontSize: fontH3V3, color: headingTextBlackColor }}>{item?.weather?.weather} Wind {item?.weather?.windDir} - {item?.weather?.windSpeedMPH}</Text> */}
                            </View>
                            <View style={{ ...styles.verticleLine, backgroundColor: dividerBlackColor }}></View>
                            <View style={{ width: '45%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center', fontSize: fontH2, fontFamily: fontFamily.Primary.SemiBold, color: headingTextBlackColor, lineHeight: 30 }}>Low</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center', fontSize: normalizeFont(65), fontFamily: fontFamily.Primary.SemiBold, color: headingTextBlackColor, lineHeight: 80 }}>{item?.weather?.minTempF}</Text>
                                    <Text style={{ bottom: normalizeHeight(15), textAlign: 'center', fontSize: normalizeFont(20), fontFamily: fontFamily.Primary.SemiBold, color: headingTextBlackColor }}>&#8457;</Text>
                                </View>
                                {/* <Text style={{ textAlign: 'center', fontFamily: fontFamily.Primary.Regular, fontSize: fontH3V3, color: headingTextBlackColor }}>{item?.weather?.weather} Wind {item?.weather?.windDir} - {item?.weather?.windSpeedMPH}</Text> */}
                            </View>
                        </View>
                        <View style={{ ...styles.horizontalLine, borderBottomColor: dividerBlackColor, marginTop: normalizeHeight(10) }} />
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', marginTop: normalizeHeight(10) }}>
                                <Text style={{ textAlign: 'center', fontFamily: fontFamily.Primary.Medium, color: headingTextBlackColor, fontSize: fontH3 }}>Twilight Start {item?.twilight_start}</Text>
                            </View>
                            <View style={{ ...styles.verticleLine, backgroundColor: dividerBlackColor }}></View>
                            <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', marginTop: normalizeHeight(10) }}>
                                <Text style={{ textAlign: 'center', fontFamily: fontFamily.Primary.Medium, color: headingTextBlackColor, fontSize: fontH3 }}>Sun Rise {item?.sun_rise}</Text>
                            </View>
                            <View style={{ ...styles.verticleLine, backgroundColor: dividerBlackColor }}></View>
                            <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', marginTop: normalizeHeight(10) }}>
                                <Text style={{ textAlign: 'center', fontFamily: fontFamily.Primary.Medium, color: headingTextBlackColor, fontSize: fontH3 }}>Sun Set {item?.sun_set}</Text>
                            </View>
                            <View style={{ ...styles.verticleLine, backgroundColor: dividerBlackColor }}></View>
                            <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', marginTop: normalizeHeight(10) }}>
                                <Text style={{ textAlign: 'center', fontFamily: fontFamily.Primary.Medium, color: headingTextBlackColor, fontSize: fontH3 }}>Twilight End {item?.twilight_end}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default DashboardModal;
const styles = StyleSheet.create({
    verticleLine: {
        height: '100%',
        width: StyleSheet.hairlineWidth,
        opacity: 0.5
    },
    horizontalLine: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        opacity: 0.5
    },
})

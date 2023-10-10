import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { DrawerContentScrollView } from '@react-navigation/drawer';
import UserDrawerContent from "./UserDrawerContent";
import { connect } from "react-redux";
import { normalizeHeight, normalizeWithScale, normalizeWidth } from "../../utils/FontUtil";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import ImageContainer from "../sharedComponents/ImageContainer";
import { fontFamily, fontH3, greyedSchemeColor, primaryColor, fontH3V3, whiteColor, headingTextBlackColor, fontH2 } from "../../constants/Styles";
import { SignOutApi } from "../../redux/actions";
import { RouteNames } from "../../constants/RouteNames";
import { Loading } from "../../view/shared/Loading";
const DrawerContent = (props) => {

    const handleSignout = async () => {
        const { SignOutApi } = props
        await props.navigation.closeDrawer();
        SignOutApi()
    }

    const { user } = props;
    return (
        <>
            <View style={styles.mainContainer}>
                <View style={styles.container}>
                    <View style={{ width: normalizeWidth(100), height: normalizeWidth(100) }}>
                        <Image source={{ uri: user?.personal?.image_url || "" }} style={{ width: '100%', height: '100%', borderRadius: normalizeWidth(100 / 2) }} resizeMode='cover' />
                    </View>
                    <View>
                        <Text style={{ ...styles.profileContentText, fontSize: fontH2, fontFamily: fontFamily.Primary.Bold, color: whiteColor }}>{user?.personal?.first_name || "Dummy User"}</Text>
                        <Text style={{ ...styles.profileContentText, fontSize: fontH3, color: greyedSchemeColor, fontFamily: fontFamily.Primary.Medium, color: whiteColor }}>{"Hunter"}</Text>
                    </View>
                </View>
            </View>
            <View style={{ backgroundColor: whiteColor }}>
                <UserDrawerContent {...props} />
                <TouchableOpacity style={styles.navigateScreen} onPress={handleSignout}>
                    <View style={styles.flexContainer}>
                        <View style={styles.iconSignout}>
                            <View style={{ width: '20%' }}>
                                {/* <Image color={'#9A4B9F'} source={logout} style={{ width: normalizeWidth(25), height: normalizeWidth(25) }} resizeMode={'contain'} /> */}
                                <FontAwesomeIcon
                                    icon={faSignOutAlt}
                                    color={headingTextBlackColor}
                                    size={normalizeWithScale(25)}
                                />
                            </View>
                            <View style={styles.headingView}>
                                <Text style={{ ...styles.heading, color: headingTextBlackColor }}>{"Logout"}</Text>
                            </View>
                        </View>
                        <View style={styles.iconRight}>
                            <FontAwesomeIcon icon={faAngleRight} color={headingTextBlackColor} size={normalizeWithScale(15)} />
                        </View>
                    </View>
                    <View
                        style={styles.line}
                    />
                </TouchableOpacity>
            </View>
        </>
        // </DrawerContentScrollView >
    )
}
const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    }
}

const mapDispatchToProps = {
    SignOutApi
}
export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
const styles = StyleSheet.create({
    mainContainer: { backgroundColor: primaryColor, marginBottom: normalizeWidth(20) },
    container: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-evenly', marginBottom: normalizeWidth(20), marginTop: normalizeWidth(20) },

    profileContentText: {
        // textAlign: 'center',
    },
    headingView: { width: '60%', left: normalizeWidth(4) },
    heading: { fontSize: fontH3, textAlign: 'left', color: headingTextBlackColor, fontFamily: fontFamily.Primary.Regular },
    line: {
        borderBottomColor: headingTextBlackColor,
        borderBottomWidth: 1,
        marginBottom: normalizeHeight(5),
        opacity: 0.2
    },

    flexContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: normalizeWidth(20), marginBottom: normalizeWidth(10) },

    navigateScreen: { paddingVertical: normalizeHeight(5), marginLeft: normalizeWidth(3), marginBottom: normalizeWidth(10) },
    iconSignout: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start' },
    iconRight: { width: '20%', alignItems: 'flex-end' },
});
import * as React from "react"
import { connect } from "react-redux"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { normalizeHeight, normalizeWidth, normalizeWithScale } from "../../utils/FontUtil";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { fontH3 ,fontFamily, fontH2, primaryColor, headingTextBlackColor} from "../../constants/Styles";
const DashboardMenu = (props) => {
    const { navigationScreenName, iconName, navigation, heading, params, hide, showIcon, isOwner = null, iconColor = headingTextBlackColor } = props;
    const handleRedirection = () => {
        if (params) {
            navigation.navigate(navigationScreenName, params)
        } else {
            navigation.navigate(navigationScreenName)
        }
    }
    return (
        <>
            {
                !hide &&
                <TouchableOpacity style={styles.navigateScreen} onPress={() => handleRedirection()}>
                    <View style={styles.flexContainer}>
                        <View style={styles.iconConatiner}>
                            <View style={{ width: '20%' }}>
                                <FontAwesomeIcon
                                    icon={iconName}
                                    color={iconColor}
                                    size={normalizeWithScale(25)}
                                />
                            </View>
                            <View style={styles.headingView}>

                                <Text style={{ ...styles.heading, color:  headingTextBlackColor }}>{heading}</Text>

                            </View>
                        </View>
                        {
                            showIcon &&
                            <View style={{ width: '5%', alignItems: 'flex-end' }}>
                                <View style={{ width: normalizeWidth(5), height: normalizeHeight(5), backgroundColor: primaryColor, marginRight: normalizeWidth(10), borderRadius: normalizeWithScale(20) }}>
                                </View>
                            </View>
                        }
                        <View style={{ width: '10%', alignItems: 'flex-end' }}>
                            <FontAwesomeIcon icon={faAngleRight} size={normalizeWithScale(15)} color={ headingTextBlackColor} />
                        </View>
                    </View>
                    <View
                        style={styles.line}
                    />
                </TouchableOpacity>
            }
        </>


    )
}
const styles = StyleSheet.create({
    flexContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: normalizeHeight(15),paddingHorizontal:normalizeWidth(20) },
    line: {
        borderBottomColor: headingTextBlackColor,
        borderBottomWidth: 1,
        marginBottom: normalizeHeight(5),
        opacity: 0.2
    },

    headingView: { width: '65%' },
    heading: { fontSize: fontH3, textAlign: 'left', color: headingTextBlackColor, fontFamily: fontFamily.Primary.Regular },
    navigateScreen: { paddingVertical: normalizeHeight(5) },
    iconConatiner:{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start' },

})
const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}
export default connect(mapStateToProps, null)(DashboardMenu);
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native'
import { buttonColorYellow, fontFamily, fontH2V3, whiteColor } from '../../constants/Styles';
import { normalizeHeight, normalizeWidth } from '../../utils/FontUtil';
const ToggleSwitchComponent = ({ handleChange, toggle, onColor = "#029242", circleColor = buttonColorYellow, textColor = whiteColor, border = false }) => {

    return (
        <View style={styles.mainContainer}>
            <View style={styles.flexContainer}>
                <Text style={{ ...styles.monthContainer, color: textColor }}>Monthly</Text>
                <ToggleSwitch
                    isOn={toggle}
                    onColor={onColor}
                    offColor={onColor}
                    size="medium"
                    trackOnStyle={{ ...styles.thumbStyle, borderColor: circleColor, borderWidth: border ? 0.5 : 0 }}
                    thumbOnStyle={styles.thumbOn}
                    trackOffStyle={{ ...styles.thumbStyle, borderColor: circleColor, borderWidth: border ? 0.5 : 0 }}
                    thumbOffStyle={styles.thumbOff}
                    circleColor={circleColor}
                    onToggle={isOn => handleChange(isOn)}
                />
                <Text style={{ ...styles.yearlyContainer, color: textColor }}>Yearly</Text>
            </View>

        </View>
    )
}
export default ToggleSwitchComponent


const styles = StyleSheet.create({
    mainContainer: { alignItems: 'center', justifyContent: 'center' },
    flexContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
    monthContainer: { marginRight: normalizeWidth(5), fontFamily: fontFamily.Primary.Regular, fontSize: fontH2V3 },
    thumbStyle: { width: normalizeWidth(60), height: normalizeHeight(20), elevation: normalizeWidth(10) },
    thumbOn: { marginLeft: normalizeWidth(20) },
    thumbOff: { marginRight: normalizeWidth(20) },
    yearlyContainer: { marginLeft: normalizeWidth(5), color: whiteColor, fontFamily: fontFamily.Primary.Regular, fontSize: fontH2V3 },

})

import React, { useCallback } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { connect } from 'react-redux'
import { steps, whiteTailLogo } from '../../assets/images'
import { RouteNames } from '../../constants/RouteNames'
import { buttonColorYellow, fontFamily, fontH2, fontH2V2, fontH3, headingTextBlackColor, whiteColor } from '../../constants/Styles'
import { handleOnBoardSuccess } from '../../redux/actions'
import { normalizeHeight, normalizeWidth } from '../../utils/FontUtil'
import CustomButton from '../shared/CustomButton'


const GetStartedScreen = (props) => {

    const { handleOnBoardSuccess } = props;

    const handleButtonPress = useCallback(() => {
        handleOnBoardSuccess()
    }, [handleOnBoardSuccess])

    return (
        <View style={{ flex: 1, padding: normalizeHeight(40) }}>
            <View style={{ alignItems: 'center' }}>
                <Image source={whiteTailLogo} resizeMode={'contain'} style={styles.logo} />
                <Text style={styles.textContainer}>Reveals daily feeding and travel patterns of the white-tailed deer</Text>
            </View>
            <View style={styles.stepContainer}>
                <Image source={steps} resizeMode={'contain'} style={{ width: normalizeWidth(250), height: normalizeHeight(300) }} />
            </View>
            <View style={{ marginHorizontal: normalizeWidth(30), marginTop: normalizeHeight(30) }}>
                <CustomButton onPress={handleButtonPress} buttonText={'Enter Site'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(30)} bordercolor={buttonColorYellow} />
            </View>
        </View>
    )
}
const mapDispatchToProps = {
    handleOnBoardSuccess
}


export default connect(null, mapDispatchToProps)(GetStartedScreen)

const styles = StyleSheet.create({
    logo: { width: normalizeWidth(220), height: normalizeHeight(100) },
    stepContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(60), marginTop: normalizeHeight(10) },
    textContainer: { textAlign: 'center', fontSize: fontH2V2, fontFamily: fontFamily.Primary.Regular, color: whiteColor, marginBottom: normalizeHeight(30), marginHorizontal: normalizeHeight(25) }
})

import React from 'react';
import { Image, TouchableOpacity, View,StyleSheet } from 'react-native';
import { backIcon, logo } from '../assets/images';
import {  primaryColor } from '../constants/Styles';
import { normalizeHeight, normalizeWidth, normalizeWithScale } from '../utils/FontUtil';

const DrawerHoc = (HocComponent) => {
    return (props) => {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()} style={styles.iconContainer}>
                    <Image source={backIcon} style={styles.img} resizeMode={'contain'}/>
                    </TouchableOpacity>
                    <View style={styles.imgContainer}>
                        <Image source={logo} resizeMode={'contain'} style={{ width: normalizeWidth(150), height: normalizeHeight(150) }} />
                    </View>
                    <View style={styles.gap}>
                    </View>
                </View>
                <HocComponent {...props} />
            </View>
        )
    }
}

export default DrawerHoc
const styles = StyleSheet.create({
mainContainer:{ flex: 1, backgroundColor: primaryColor,padding:normalizeWidth(20) },
headerContainer:{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' },
imgContainer:{ width:'80%',alignItems:'center' },
iconContainer:{ width:'10%'},
gap:{width:'10%' },
img: { width: normalizeWidth(25), height: normalizeWidth(25) },
})
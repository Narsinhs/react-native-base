import React, { useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import Collapsible from 'react-native-collapsible';
import { arrowDownIcon, arrowUpIcon } from '../../assets/images';
import { FAQContainerShadow, fontFamily, fontH3, primaryColor } from '../../constants/Styles';
import { normalizeFont, normalizeHeight, normalizeWidth } from '../../utils/FontUtil';
const CollapseListView = React.memo(({ title, description, index, id, expandedId, handleToggle }) => {

    const isCurrentActive = () => {
        return expandedId === id
    }

    return (
        <View style={{ flex: 1, marginHorizontal: normalizeWidth(10), marginBottom: normalizeHeight(10), marginTop: normalizeHeight(2), borderColor: '#00000020', borderWidth: StyleSheet.hairlineWidth }}>
            <Pressable onPress={() => handleToggle(id)} style={{ ...styles.header, ...FAQContainerShadow }} >
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerText}>{`Q${index + 1}: ${title}`}</Text>
                </View>
                <View>
                    <Image resizeMode="contain" source={isCurrentActive() ? arrowUpIcon : arrowDownIcon} style={{ width: normalizeWidth(15), height: normalizeHeight(15) }} />
                </View>
            </Pressable>
            <Collapsible collapsed={!isCurrentActive()} >
                <Text style={styles.contentText}>
                    {description}
                </Text>
            </Collapsible>
        </View>
    )

})

export default CollapseListView

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: normalizeHeight(7),
        borderRadius: normalizeWidth(2),
        paddingHorizontal: normalizeWidth(10)
    },
    headerText: {
        color: primaryColor,
        fontFamily: fontFamily.Primary.Medium,
        fontSize: normalizeFont(15)
    },
    content: {
    },
    contentText: {
        color: 'black',
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH3,
        marginHorizontal: normalizeWidth(4),
        marginVertical: normalizeWidth(10)
    }
})

import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { blackColor, fontFamily, whiteColor } from '../../constants/Styles';
import { normalizeHeight } from '../../utils/FontUtil';
let data = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
];
const CustomInputScrollPicker = ({ dataSource = data, selected = 0, setSelected }) => {
    const [isScrollTo, setIsScrollTo] = useState(false);
    const [dragStarted, setDragStarted] = useState(false);
    const [momentumStarted, setMomentumStarted] = useState(false);
    let itemHeight = 30
    const ItemToRender = (item, index) => {
        // console.log(item, index)
        if (selected === index) {
            return (
                <View style={{ width: 150, height: itemHeight, borderColor: blackColor, marginVertical: normalizeHeight(10), alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16, fontFamily: fontFamily.Primary.Bold, color: blackColor, textAlign: 'center' }}>{item}</Text>
                </View>
            )
        }
        else {
            return (
                <View style={{ width: 150, height: itemHeight, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 12, textAlign: 'center' }}>{item}</Text>
                </View>
            )
        }

    };
    const scrollFix = useCallback(
        (e) => {
            let y = 0;
            const h = itemHeight;
            if (e.nativeEvent.contentOffset) {
                y = e.nativeEvent.contentOffset.y;
            }
            const _selectedIndex = Math.round(y / h);
            const _y = _selectedIndex * h;
            if (_y !== y) {
                // using scrollTo in ios, onMomentumScrollEnd will be invoked
                if (Platform.OS === "ios") {
                    setIsScrollTo(true);
                }
            }
            if (selected === _selectedIndex) {
                return;
            }
            setSelected(_selectedIndex);
        },
        [selected]
    );
    const onMomentumScrollBegin = () => {
        setMomentumStarted(true);
    };
    const onMomentumScrollEnd = (e) => {
        setMomentumStarted(false);
        if (!isScrollTo && !dragStarted) {
            scrollFix(e);
        }
    };
    const renderPlaceHolder = () => {
        const h = itemHeight;
        const header = <View style={{ height: h, flex: 1 }} />;
        const footer = <View style={{ height: h, flex: 1 }} />;
        return { header, footer };
    };
    const { header, footer } = renderPlaceHolder();
    return (
        <View style={styles.container}>
            <View style={styles.wrapperVertical}>
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{alignItems:'center',justifyContent:'center'}}
                    onMomentumScrollBegin={(_e) => onMomentumScrollBegin()}
                    onMomentumScrollEnd={(e) => onMomentumScrollEnd(e)}
                    nestedScrollEnabled={true}
                >
                    {/* {header} */}
                    {dataSource.map((item, index) => { return ItemToRender(item, index) })}
                    {footer}
                </ScrollView>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    wrapperVertical: {
        width: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        margin: 'auto',
        color: 'black',
    },
});
export default CustomInputScrollPicker;
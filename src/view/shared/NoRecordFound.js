import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { fontFamily, fontH2, primaryColor } from '../../constants/Styles';

const NoRecordFound = ({ text = "No Record found" }) => {
    return (
        <View>
            <Text style={{ color: primaryColor, fontFamily: fontFamily.Primary.SemiBold, textAlign: 'center', fontSize: fontH2 }}>{text}</Text>
        </View>
    );
};

export default NoRecordFound;

const styles = StyleSheet.create({});

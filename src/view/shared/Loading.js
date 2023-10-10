import React from 'react';
import { View ,ActivityIndicator} from 'react-native';
import { primaryColor } from '../../constants/Styles';
export const Loading = ({size="small", color=primaryColor}) => {
    return (
        <View>
            <ActivityIndicator  size={size} color={color}/>
        </View>
    )
}
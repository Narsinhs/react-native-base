import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import CustomWebView from '../../shared/CustomWebView';

const CurrentWeather = ({ route }) => {
  const { InternetConnected, url } = route?.params;

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {
        InternetConnected ?
          <CustomWebView webViewURL={{ uri: url }} />
          :
          <View>
            <Text >
              Internet is not Connected
            </Text>
          </View>
      }
    </View>
  )
}

export default CurrentWeather;
const styles = StyleSheet.create({})

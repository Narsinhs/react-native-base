import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { normalizeHeight } from '../../utils/FontUtil'
import { WebView } from 'react-native-webview';
import { Slug_Enum, Slug_Enum_Offline } from '../../constants/constants';
import { connect } from 'react-redux';
import CustomWebView from '../shared/CustomWebView';

const TermsAndCondition = ({ allSlug, InternetConnected }) => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {
                InternetConnected ?
                    <CustomWebView webViewURL={{ uri: allSlug[Slug_Enum['terms-and-conditions']]?.page_url }} />
                    :
                    <CustomWebView webViewURL={Platform.OS === "android" ? { uri: Slug_Enum_Offline['terms-and-conditions'] } : Slug_Enum_Offline['terms-and-conditions']} />
            }
        </View>
    )
}
const mapStateToProps = state => {
    return {
        allSlug: state.slug.allSlug,
        InternetConnected: state?.InternetConnection?.internetConnected,
    }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(TermsAndCondition)
const styles = StyleSheet.create({})

import React, { useEffect } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { normalizeHeight } from '../../../utils/FontUtil'
import { AboutUsHtml, Slug_Enum, Slug_Enum_Offline } from '../../../constants/constants';
import { connect } from 'react-redux';
import FadeInView from '../../../hoc/FadeInHoc'
import CustomWebView from '../../shared/CustomWebView';
import { GetSlugPages } from '../../../redux/actions/index';
import WebView from 'react-native-webview'
import { htmlAboutUs } from './testingHtml';
const Info = ({ allSlug, InternetConnected, GetSlugPages }) => {
    useEffect(() => {
        if (InternetConnected && Object.values(allSlug).length === 0) {
            GetSlugPages().then((val) => {
                console.log("/////////")
            }).catch((e) => {
                console.log(e, "eeeee")
            })
        }
    }, [InternetConnected, allSlug])
    return (
        <View style={{ flex: 1, backgroundColor: 'white', marginBottom: normalizeHeight(50) }}>
            {
                InternetConnected ?
                    <CustomWebView webViewURL={{ uri: allSlug[Slug_Enum['about-us']]?.page_url }} />
                    :
                    <CustomWebView webViewURL={Platform.OS === "android" ? { uri: Slug_Enum_Offline['about-us'] } : Slug_Enum_Offline['about-us']} />
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
    GetSlugPages
}

export default connect(mapStateToProps, mapDispatchToProps)(FadeInView(Info))
const styles = StyleSheet.create({})

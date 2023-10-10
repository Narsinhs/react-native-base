import React, { useState } from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import WebView from 'react-native-webview'
import { Loading } from './Loading'
import { connect } from 'react-redux';
const CustomWebView = ({ webViewURL }) => {
    const [webViewLoading, setWebLoading] = useState(true)
    const handleLoadEnd = () => {
        setWebLoading(false);
    }
    let injected = ` document.querySelector(document).ready(function () {
    document.querySelector(".lsting .boxes:not(:first-of-type)").css("display", "none");
    document.querySelector(".lsting h5:first-of-type").classList.add("open");


})

document.querySelector(document).addEventListener('click', ".lsting h5", function () {
    document.querySelector(".open").not(this).removeClass("open").nextElementSibling.slideUp(300);
    document.querySelector(this).classList.toggle("open").nextElementSibling.slideToggle(300);

});

document.querySelector(window).addEventListener('load', function () {
    document.querySelector('img').each(function (e) {
        $img_src = document.querySelector(this).attr('src');
        $img_html = document.querySelector(this).clone().get(0);
        document.querySelector('<a></a>', {
            "data-fancybox": 'gallery',
            "href": $img_src,
        }).html($img_html).appendTo(document.querySelector(this).parent());
        document.querySelector(this).remove()
    });
})`
    return (
        <View style={{ flex: 1 }}>
            {
                webViewLoading ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Loading size={40} />
                    </View>
                    : <></>
            }
            <WebView originWhitelist={['*']} onLoad={handleLoadEnd} source={webViewURL} style={{ flex: 1 }} javaScriptEnabled={true} mixedContentMode="always" allowUniversalAccessFromFileURLs={true} injectedJavaScript={injected} />
        </View>
    )
}


export default CustomWebView



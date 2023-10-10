import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { fontFamily, headingTextBlackColor, primaryColor, whiteColor } from '../../constants/Styles';
import { normalizeWidth } from '../../utils/FontUtil';
import { getImageURIFromServer } from '../../utils/ImageUploadUtil';
import { Loading } from '../../view/shared/Loading';
const ImageContainer = ({ image, circleHeight = normalizeWidth(100), circleWidth = normalizeWidth(100), backgroundColor = whiteColor, loaderColor = primaryColor, loaderSize = "large", borderRadius = normalizeWidth(0), borderColor = headingTextBlackColor, borderWidth = 0, styles = {} }) => {
    const [imageLoading, setImageLoading] = useState(false)
    return (
        <View style={styless.mainContainer}>
            <View style={{
                width: normalizeWidth(circleWidth),
                backgroundColor: backgroundColor,
                height: normalizeWidth(circleHeight),
                borderRadius: borderRadius ? normalizeWidth(borderRadius) : normalizeWidth(circleWidth / 2),
                borderColor: borderColor,
                borderWidth: borderWidth,
                overflow: "hidden",
                ...styles
            }}>
                {
                    imageLoading ?
                        <View style={{ ...StyleSheet.absoluteFill, justifyContent: 'center' }}>
                            <Loading loading={true} size={loaderSize} color={loaderColor} />
                        </View> : null

                }
                <Image
                    source={getImageURIFromServer(image)}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode={'cover'}
                    onLoadStart={e => setImageLoading(true)}
                    onLoad={e => setImageLoading(false)}
                    onLoadEnd={e => setImageLoading(false)}
                />
            </View>
        </View>
    )
}

export default ImageContainer
const styless = StyleSheet.create({

    mainContainer: { alignItems: 'center', position: 'relative' },
})
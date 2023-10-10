import { Platform } from "react-native";
import { normalizeFont, normalizeHeight, normalizeWidth } from "../utils/FontUtil";

// FontFamily throughout the applications
export const fontFamily = {
    "Primary": {
        "Medium": "Poppins-Medium",
        "Regular": "Poppins-Regular",
        "Light": "Poppins-Light",
        "Bold": "Poppins-Bold",
        "SemiBold": "Poppins-SemiBold",
        "Thin": "Poppins-Thin",
        "Italic": "Poppins-Italic"
    },
    "Secondary": {
        "Regular": Platform.OS === "android" ? "FritzRegular" : "Fritz-Regular",
        "Bold": Platform.OS === "android" ? "FritzBold" : "Fritz-Bold"
    }
}
// Standard Colors throughout the application must be used from here.

export const primaryColor = "#007936";
export const inActiveColor = "#707070";
export const greyedSchemeColor = "#00000050";
export const errorColor = "#FF6347";
export const headingTextBlackColor = "#112128";
export const whiteColor = "#FFFFFF";
export const whiteColoralpha40 = "#FFFFFF80";
export const blackColor = "#112128";
export const dividerBlackColor = "#000000";
export const transparentColor = 'transparent'
export const buttonColorYellow = "#FFEE00";
export const textBlueColor = "#00AFD4";
export const draftColor = "#F47E52"
export const greylight = "#989898"
export const weatherBackgroundColor = "#91DDFF"
export const grey = "#0000001A"
export const redColor = '#FF0000'
// Standard Font Sizes throughout the application must be used from here

export const fontH1 = normalizeFont(24);
export const fontH2 = normalizeFont(18);
export const fontH20 = normalizeFont(20);
export const fontH2V2 = normalizeFont(15);
export const fontH2V3 = normalizeFont(13)
export const fontH3 = normalizeFont(12);
export const fontH3V3 = normalizeFont(10);
export const fontH4 = normalizeFont(8);
export const fontSmallSize = normalizeFont(6);


// Generalized styles shall be listed here.
export const mainContainer = {
    flex: 1,
    padding: normalizeWidth(10),
    justifyContent: 'center',
    alignItems: 'center'
}

export const quoteStyles = {
    fontFamily: fontFamily.Primary.Regular,
    fontSize: fontH2
}

export const FAQContainerShadow = {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
}
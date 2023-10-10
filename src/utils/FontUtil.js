import { Dimensions, Platform, PixelRatio } from 'react-native';

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');
import {
    widthPercentageToDP as wp2dp,
    heightPercentageToDP as hp2dp,
} from 'react-native-responsive-screen';
const devHeight = 640; //Phone height during development
const devWidth = 360; //width

export const deviceHeight = Dimensions.get('window').height; //Device height
export const deviceWidth = Dimensions.get('window').width; //device width
export const deviceScale = Dimensions.get('window').scale;
export const defaultWindowMultiplier = 0.50;
export const defaultNavBarHeight = 65;



const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];

//Default guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export const scalef = size => shortDimension / guidelineBaseWidth * size;
export const verticalScale = size => longDimension / guidelineBaseHeight * size;
export const moderateScale = (size, factor = 0.5) => size + (scalef(size) - size) * factor;
export const moderateVerticalScale = (size, factor = 0.5) => size + (verticalScale(size) - size) * factor;

//gain
export const RNHeight = deviceHeight / devHeight;
export const RNWidth = deviceWidth / devWidth;

// based on iphone 5s's scale
export const scale = SCREEN_WIDTH / 320;

export const normalizeFont = (size) => {            // For Normalizing the font size for all type of screens, Including iPad, iPhone, Tablet, Android
    const newSize = moderateScale(size)
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) -2
    }
}

// Use this function to normalize image size
export const normalizeWithScale = (size) => {    // For Normalizing the Icon size for different screens
    return moderateScale(size, 0.40);
}

export const normalizeHeight = (size) => {      // For Normalizing the Height for different screens
    // return moderateScale(size, 0.25);
    return hp2dp((size / 760) * 100 + '%');
}

export const normalizeWidth = (size) => {       // For Normalizing the Width for different screens
    // return moderateScale(size, 0.25)
    return wp2dp((size / 360) * 100 + '%');
    // return RNWidth * size;
}
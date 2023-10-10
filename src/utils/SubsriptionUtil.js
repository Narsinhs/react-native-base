import { Linking, Platform } from "react-native"
import { ANDROID_SUBSCRIPTIONS, IOS_SUBSCRIPTIONS } from "../constants/Enum"
import { getAppPackageBundleId } from "./CommonUtil"

export const getSubscriptionsItems = () => {
    return Platform.select({
        ios: IOS_SUBSCRIPTIONS,
        android: ANDROID_SUBSCRIPTIONS
    })
}

// REFER TO THIS DOC
// https://github.com/dooboolab/react-native-iap/blob/c0481d3344057ff54c9da2aa70f34dea412a9460/docs/docs/faq.md#how-can-a-user-cancel-a-subscription-in-my-app

// productId is the id of the product you want to cancel
export const manageAppStoreSubscriptionCancel = (productId) => {
    if (Platform.OS === 'ios') {
        Linking.openURL('https://apps.apple.com/account/subscriptions')
    }
    else {
        Linking.openURL(`https://play.google.com/store/account/subscriptions?package=${getAppPackageBundleId()}&sku=${productId}`)
    }
}
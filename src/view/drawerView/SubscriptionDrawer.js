import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { rightArrow, visaCard } from '../../assets/images'
import { DummySubscriptionData } from '../../constants/constants'
import { RouteNames } from '../../constants/RouteNames'
import { fontFamily, greyedSchemeColor, headingTextBlackColor, primaryColor, whiteColor } from '../../constants/Styles'
import useInAppPurchase from '../../hooks/useInAppPurchase'
import { acknowledgeSubscription } from '../../redux/actions'
import { getAppPackageBundleId } from '../../utils/CommonUtil'
import { normalizeFont, normalizeWidth } from '../../utils/FontUtil'
import { getSubscriptionsItems, manageAppStoreSubscriptionCancel } from '../../utils/SubsriptionUtil'
import CancelSubscriptionBox from '../shared/CancelSubscriptionBox'
import CustomButton from '../shared/CustomButton'
import { Loading } from '../shared/Loading'
import SubscriptionBoxComponent from '../shared/SubscriptionBoxComponent'
import ToggleSwitchComponent from '../shared/ToggleSwitchComponent'

const SubscriptionDrawer = (props) => {

    // REDUX INJECTED PROPS************************
    const { acknowledgeSubscription, subAcknowledgeLoading, userInfoLoading, user } = props;


    const { storeSubscriptions, getSubscriptions, requestSubscription, reciept, error } = useInAppPurchase();


    // GETTING THE SUBSCRIPTIONS FROM THE STORE*************
    useEffect(() => {
        if (storeSubscriptions.isConnectedToStore) {
            const subsIds = getSubscriptionsItems();
            getSubscriptions(subsIds)
        }
    }, [storeSubscriptions.isConnectedToStore]);


    const [toggle, setToggle] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    useEffect(() => {
        if (!storeSubscriptions?.subscriptionsFetching && !storeSubscriptions.connectStoreLoading) {
            if (toggle) {
                setSelectedPlan(storeSubscriptions.subscriptions[1])
            }
            else {
                setSelectedPlan(storeSubscriptions.subscriptions[0])
            }
        }
    }, [toggle, storeSubscriptions.subscriptions]);


    const handleChange = (active) => {
        setToggle(active);
    }

    const handleSubscriptionBuy = async () => {
        try {
            const reciept = await requestSubscription(selectedPlan?.productId);
            console.log("reciept*******************************", JSON.stringify(reciept))
            if (reciept) {
                acknowledgeSubscription(reciept).then(res => {
                    console.log("THIS IS RES*********************", res)
                })
            }
        } catch (e) {
            console.log("THIS IS ERROR", e)
        }
    }

    const handleSubscriptionCancel = (productId) => {
        manageAppStoreSubscriptionCancel(productId)
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.margin30Container}>
                <Text style={{ textAlign: 'center', color: primaryColor, fontSize: normalizeFont(19), fontFamily: fontFamily.Primary.SemiBold }}>Choose your package</Text>
            </View>

            <View style={styles.margin30Container}>
                {
                    storeSubscriptions?.connectStoreLoading ? <Loading /> :
                        !storeSubscriptions.connectStoreLoading && storeSubscriptions.isConnectedToStore ?
                            storeSubscriptions.subscriptionsFetching ? <Loading /> :
                                !storeSubscriptions.subscriptionsFetching && storeSubscriptions.subscriptions.length ?
                                    <>

                                        <View style={styles.margin30Container}>
                                            <ToggleSwitchComponent textColor={primaryColor} toggle={toggle} handleChange={handleChange} />
                                        </View>
                                        <View style={styles.margin30Container}>
                                            <SubscriptionBoxComponent
                                                subType={selectedPlan?.title}
                                                loading={subAcknowledgeLoading || userInfoLoading}
                                                subValue={selectedPlan?.localizedPrice}
                                                subDescription={selectedPlan?.description}
                                                onPress={handleSubscriptionBuy} />
                                        </View>
                                        {
                                            !user?.personal?.subscription_expired && user?.personal?.is_subscribed ?
                                                <>
                                                    <View
                                                        style={styles.lines}
                                                    />
                                                    <View style={styles.margin30Container}>
                                                        <CancelSubscriptionBox plan="Plan Details" planDetail={user?.personal?.subscription_details} planButtonText="Cancel Subscription" onPress={() => handleSubscriptionCancel(user?.personal?.subscription_sku)} />
                                                    </View>
                                                </>
                                                : <></>
                                        }


                                    </> :
                                    <Text>No subscriptions found</Text>

                            :
                            <Text>Cannot Connect to App Store</Text>
                }
            </View>

        </View>
    )
}

const mapStateToProps = state => {
    return {
        userInfoLoading: state?.auth?.userInfoLoading,
        subAcknowledgeLoading: state?.acknowledgeSubscription?.subAcknowledgeLoading,
        user: state?.auth?.user
    }
}

const mapDispatchToProps = {
    acknowledgeSubscription
}


export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionDrawer)

const styles = StyleSheet.create({
    margin30Container: { marginBottom: normalizeWidth(20), },
    lines: {
        borderBottomColor: greyedSchemeColor,
        borderWidth: 0.5,
        marginBottom: normalizeWidth(30)

    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: normalizeWidth(30),
    },
    mainContainer: { flex: 1, padding: normalizeWidth(20), backgroundColor: 'white' },
})

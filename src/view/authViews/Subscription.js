import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native'

import { fontFamily, fontH1, greyedSchemeColor, primaryColor, whiteColor } from '../../constants/Styles';
import { normalizeFont, normalizeHeight, normalizeWidth } from '../../utils/FontUtil';
import FadeInView from '../../hoc/FadeInHoc';
import SubscriptionBoxComponent from '../shared/SubscriptionBoxComponent';
import ToggleSwitchComponent from '../shared/ToggleSwitchComponent';
import { DummySubscriptionData } from '../../constants/constants';
import { connect } from 'react-redux';
import BackButtonHeader from '../shared/BackButtonHeader';
import { RouteNames } from '../../constants/RouteNames';
import useInAppPurchase from '../../hooks/useInAppPurchase';
import { getSubscriptionsItems } from '../../utils/SubsriptionUtil';
import { FreeSubscription } from '../../redux/actions/index'
import { Loading } from '../shared/Loading';
import { getToken } from '../../utils/TokenUtil';
import { acknowledgeSubscription } from '../../redux/actions'

const Subscription = (props) => {
    const { acknowledgeSubscription, subAcknowledgeLoading, userInfoLoading } = props;
    const { storeSubscriptions, getSubscriptions, requestSubscription, reciept, error } = useInAppPurchase()

    useEffect(() => {
        if (storeSubscriptions.isConnectedToStore) {
            const subsIds = getSubscriptionsItems();
            getSubscriptions(subsIds)
        }
    }, [storeSubscriptions.isConnectedToStore]);
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
    const [toggle, setToggle] = useState(false)
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
    }, [toggle, storeSubscriptions.subscriptions])
    const handleChange = (active) => {
        setToggle(active)
    }
    const handleFreeSubscription = () => {
        const { FreeSubscription } = props
        FreeSubscription()
    }
    const handleBackButtonPress = () => {
        return props.navigation.navigate(RouteNames.AuthRoutes.Login)
    }


    return (
        <ScrollView style={styles.mainContainer}>
            <BackButtonHeader handleBackButtonPress={handleBackButtonPress} />
            <View style={styles.margin30Container}>
                <Text style={{ textAlign: 'center', color: whiteColor, fontSize: normalizeFont(19), fontFamily: fontFamily.Primary.Regular }}>Choose your package</Text>
            </View>
            <View
                style={styles.lines}
            />
            {
                storeSubscriptions?.connectStoreLoading ? <Loading color='white' /> :
                    !storeSubscriptions.connectStoreLoading && storeSubscriptions.isConnectedToStore ?
                        storeSubscriptions.subscriptionsFetching ? <Loading color='white' /> :
                            !storeSubscriptions.subscriptionsFetching && storeSubscriptions.subscriptions.length ?
                                <>

                                    <View style={styles.margin30Container}>
                                        <ToggleSwitchComponent toggle={toggle} handleChange={handleChange} />
                                    </View>
                                    <View style={styles.margin30Container}>
                                        <SubscriptionBoxComponent
                                            subType={selectedPlan?.title}
                                            loading={subAcknowledgeLoading || userInfoLoading}
                                            subValue={selectedPlan?.localizedPrice}
                                            subDescription={selectedPlan?.description}
                                            onPress={handleSubscriptionBuy} />
                                    </View>

                                </> :
                                <Text>No subscriptions found</Text>

                        :
                        <Text>Cannot Connect to App Store</Text>
            }
        </ScrollView>
    )
}


const mapStateToProps = state => {
    return {
        userInfoLoading: state?.auth?.userInfoLoading,
        subAcknowledgeLoading: state?.acknowledgeSubscription?.subAcknowledgeLoading
    }
}

const mapDispatchToProps = {
    FreeSubscription,
    acknowledgeSubscription
}

export default connect(mapStateToProps, mapDispatchToProps)(FadeInView(Subscription))
const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: primaryColor, paddingHorizontal: normalizeWidth(20), marginBottom: normalizeHeight(20) },
    logo: { width: normalizeWidth(250), height: normalizeHeight(100) },
    logoContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: normalizeWidth(10) },
    iconContainer: { width: '10%' },
    img: { width: normalizeWidth(25), height: normalizeWidth(25) },
    lines: {
        borderBottomColor: greyedSchemeColor,
        borderWidth: 0.5,
        marginBottom: normalizeWidth(30),
    },
    headerComponent: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' },
    margin30Container: {
        marginBottom: normalizeWidth(30),
        paddingHorizontal: Platform.OS === 'android' ? normalizeWidth(5) : 0
    },

})

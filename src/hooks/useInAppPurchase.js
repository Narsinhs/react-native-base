import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native';
import IAP, { finishTransaction, purchaseErrorListener, purchaseUpdatedListener } from 'react-native-iap'
import { registerToastMessage } from '../utils/RegisterToast';

let purchaseUpdateSubscription;
let purchaseErrorSubscription;


const useInAppPurchase = () => {
    const [storeSubscriptions, setStoreSubscriptions] = useState({
        subscriptions: [],
        connectStoreLoading: false,
        isConnectedToStore: false,
        subscriptionsFetching: false
    });
    const [error, setError] = useState(null)
    const [reciept, setReciept] = useState(null);

    useEffect(() => {
        // Connecting to Store.
        connectToStore()
        // Purchase update reciept listners
        purchaseUpdateSubscription = purchaseUpdatedListener((async (purchase) => {
            const receipt = purchase
            if (receipt) {
                try {
                    const ackResult = await finishTransaction(purchase);

                } catch (err) {
                    setError(err)
                }
                setReciept(receipt);
            }

        }))

        // Purchase Error listener
        purchaseErrorSubscription = purchaseErrorListener(err => {
            setError(err.message);
            registerToastMessage(err.message, false)
        })


        return () => {
            if (purchaseUpdateSubscription) {
                purchaseUpdateSubscription.remove();
                purchaseUpdateSubscription = null;
            }

            if (purchaseErrorSubscription) {
                purchaseErrorSubscription.remove();
                purchaseErrorSubscription = null;
            }

            IAP.endConnection();
        }


    }, [])

    const connectToStore = async () => {
        try {
            setConnectedToStoreLoading(true);
            await IAP.initConnection();
            if (Platform.OS === 'android') {
                await IAP.flushFailedPurchasesCachedAsPendingAndroid();
            } else {
                await IAP.clearTransactionIOS();
            }
            setConnectedToStoreLoading(false);
            setStoreSubscriptions(prev => ({
                ...prev,
                isConnectedToStore: true
            }))
        }
        catch (err) {
            console.warn(err.code, err.message);
            setConnectedToStoreLoading(false);
            setError(err.message);
            setStoreSubscriptions(prev => ({
                ...prev,
                isConnectedToStore: false
            }))
        }
    }

    const getSubscriptions = async (subscriptionsIds) => {
        try {
            setSubscriptionFetching(true)
            const subscriptions = await IAP.getSubscriptions(subscriptionsIds);
            setStoreSubscriptions((prev) => ({
                ...prev,
                subscriptions,
                subscriptionsFetching: false
            }))
        } catch (err) {
            setError(err.message)
            registerToastMessage(err.message, false)
        }
    }

    const requestSubscription = (subscriptionId) => {
        return new Promise((resolve, reject) => {
            try {
                IAP.requestSubscription(subscriptionId).then(res => {
                    resolve(res)
                })
            } catch (err) {
                console.log(err, "REQUEST PURCHASE ERROR");
                reject(err.message)
                setError(err.message)
            }
        })
    }

    const setConnectedToStoreLoading = (flag) => {
        setStoreSubscriptions(prev => ({
            ...prev,
            connectStoreLoading: flag
        }))
    }

    const setSubscriptionFetching = (flag) => {
        setStoreSubscriptions(prev => ({
            ...prev,
            subscriptionsFetching: flag
        }))
    }


    return {
        storeSubscriptions,
        error,
        reciept,
        getSubscriptions,
        requestSubscription
    }
}

export default useInAppPurchase


import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Platform, TouchableOpacity, ActivityIndicator, Image, RefreshControl } from 'react-native'

import { RouteNames } from '../../../constants/RouteNames'
import { fontFamily, fontH2, blackColor, whiteColor, primaryColor, fontH3, fontH2V2, fontH2V3, draftColor, buttonColorYellow, headingTextBlackColor } from '../../../constants/Styles'
import { deviceHeight, deviceWidth, normalizeHeight, normalizeWidth, normalizeWithScale } from '../../../utils/FontUtil'
import FloatingButton from '../../shared/FloatingButton'
import JournalListItem from './JournalListItem'
import LottieView from 'lottie-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { IS_OFFLINE_FORM, journalDummyData } from '../../../constants/constants'
import EntriesFilter from "./EntriesFilter";
import { GetJournalListApi, DeleteJournalByApi, GetJournalFormApi, deleteOfflineJournalForm, deleteOnlineJournalForm, saveFilterOptions } from '../../../redux/actions/index';
import { connect } from 'react-redux';
import CustomButton from "../../shared/CustomButton";
import { getToken } from "../../../utils/TokenUtil";
import { downloadPDF, getFileDownloadName } from "../../../utils/DownloadUtils";
import { useIsFocused } from "@react-navigation/native";
import ModalLoading from "../../shared/ModalLoading";
import { Loading } from "../../shared/Loading";
import { JournalLogo } from "../../../assets/images";
const JournalView = (props) => {
    const { paginationData, GetJournalListApi, listData, DeleteJournalByApi, navigation, GetJournalFormApi, formData, offlineForms, isInternetConnected, deleteOnlineJournalForm, deleteOfflineJournalForm, formUploadingStatus, saveFilterOptions, filterOptions, filteredListData } = props
    const [isFormFetching, setIsFormFetching] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [filter, setFilter] = useState(false);
    const [isPullToRefreshLoading, setIsPullToRefreshLoading] = useState(false);

    const isFocused = useIsFocused()

    useEffect(() => {
        handleJournalList(1);
        handleFetchForm();
    }, [isFocused === true])

    const handleFetchForm = () => {
        setIsFormFetching(true)
        GetJournalFormApi().then(() => {
            setIsFormFetching(false)
        }).catch(() => {
            setIsFormFetching(false)
        })
    }

    const handleJournalList = (page) => {
        if (page) {
            setFetching(true)
            GetJournalListApi(page).then((val) => {
                setFilter(false)
                setFetching(false)
            }).catch((e) => {
                setFetching(false)
                setFilter(false)
                console.log(e, "eeee")
            })
        }
    }
    const handleDeleteById = (id, isDraft) => {
        if (isInternetConnected) {
            DeleteJournalByApi(id).then((val) => {
            }).catch((e) => {
                console.log(e, "eeeeeDeleteJournalByApi")
            })
        }
        else {
            if (isDraft) {
                // DISPATCH ACTION TO DELETE FROM OFFLINE LIST
                console.log("deleteOnlineJournalForm FROM JOURNAL SIDEEE",)
                deleteOfflineJournalForm(id)
            }
            else {
                // DISPATCH ACTION TO DELETE FROM ONLINE LIST
                console.log("deleteOnlineJournalForm*** FROM JOURNAL SIDEEE",)
                deleteOnlineJournalForm(id)
            }
        }
    }

    const handleDownloadPDF = async (pdfURL, journalSubmissionDate) => {
        const fileName = getFileDownloadName(journalSubmissionDate);

        await downloadPDF(pdfURL, null, fileName, fileName)


    }


    const renderItem = ({ item, index }) => {
        // console.log("item", item?.submission_date)
        return (
            <JournalListItem
                item={item}
                date={item?.submission_date}
                isDraft={item?.type === IS_OFFLINE_FORM}
                handleDeleteById={handleDeleteById}
                handleJournalListItemClick={handleJournalListItemClick}
                handleDownloadPDF={handleDownloadPDF}
                loading={item?.type === IS_OFFLINE_FORM && formUploadingStatus.journal_submitted_id === item?.journal_submitted_id ? formUploadingStatus.loadingStatus : false}
            />
        )
    }

    const handleJournalListItemClick = (item) => {
        const paramObject = {
            journalForm: { ...item.form, journal_submitted_id: item?.journal_submitted_id }
        }
        navigation.navigate(RouteNames.User.HuntingJournal, { ...paramObject })
    }



    const RenderLottie = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <LottieView source={require('../../../assets/lottie/noData.json')} autoPlay loop style={{ height: 'auto', width: '100%' }} />
            </View>
        )
    }

    const RenderBadge = ({ text, color }) => {
        return (
            <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', marginBottom: 5, }}>
                <View style={{ flex: 0.6, backgroundColor: color, height: '90%' }}>
                </View>
                <View style={{ flex: 3, marginLeft: normalizeWidth(5) }}>
                    <Text style={{ color: 'black', fontSize: fontH3, fontFamily: fontFamily.Primary.SemiBold }}>{text}</Text>
                </View>
            </View>
        )
    }

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleRedirection = (route, formData) => {
        let paramForm = {
            "journalForm": formData[0],
        }
        const { navigation } = props;
        navigation.navigate(route, paramForm)
    }
    const handleLoadMore = () => {
        console.log('GOING TO FETCH NEW DATA*****************************')
        handleJournalList(paginationData?.next_page);
    }

    const handleOnReachedEnd = (e) => {
        let paddingToBottom = normalizeHeight(10);
        paddingToBottom +=
            e.nativeEvent.layoutMeasurement.height;
        var currentOffset =
            e.nativeEvent.contentOffset.y;
        var direction =
            currentOffset > e.offset ? 'down' : 'up';
        if (direction === 'up') {
            if (
                e.nativeEvent.contentOffset.y >=
                e.nativeEvent.contentSize.height -
                paddingToBottom && paginationData.next_page
            ) {
                handleLoadMore()

            }
        }
    }

    const handleClearFilter = () => {
        handleJournalList(1);
        saveFilterOptions({})
    }
    const onPullToRefresh = () => {
        console.log("🚀 ~ file: Journal.js ~ line 178 ~ onPullToRefresh ~ isPullToRefreshLoading", isPullToRefreshLoading);
        handleJournalList(1);
        handleFetchForm();
    }
    const flatListData = () => {
        if (Object.keys(filterOptions)?.length) {
            return filteredListData;
        }
        else {
            return [...offlineForms, ...listData]
        }
    }

    return (
        <>
            {
                fetching && !listData.length ?
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Loading size={50} />
                    </View> :
                    <>
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                            <Image source={JournalLogo} style={{ width: '75%', height: normalizeHeight(150) }} resizeMode="cover" />

                        </View>
                        <View style={styles.journalMain}>
                            {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: normalizeWidth(10), marginTop: normalizeHeight(30) }}>
                            </View> */}
                            <EntriesFilter onModalClick={toggleModal} isModalVisible={isModalVisible} setFilter={setFilter} />
                            <View style={{ ...styles.journalTitle }}>
                                <View style={{ flex: 2 }}>
                                    <TouchableOpacity style={{ flex: 1, flexWrap: 'wrap' }} onPress={toggleModal}>
                                        <View style={{ flex: 1, justifyContent: 'center', paddingRight: normalizeWidth(10) }}>
                                            <View style={styles.filterContainerStyle} >
                                                <Text style={styles.filterTextStyle}>Previous Entries</Text>
                                                <FontAwesomeIcon icon={faFilter} color="white" size={normalizeWithScale(15)} />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, }}>
                                    {
                                        filter ?
                                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                                <CustomButton onPress={handleClearFilter} height={normalizeHeight(42)} buttonText={'Clear'} buttonColor={buttonColorYellow} buttonTextColor={headingTextBlackColor} borderRadius={normalizeWidth(10)} bordercolor={buttonColorYellow} />
                                            </View>
                                            :
                                            <></>
                                    }
                                </View>

                                <View style={{ flex: 1, justifyContent: 'center', marginLeft: normalizeWidth(10) }}>
                                    <View style={{ height: '50%', flexDirection: 'row' }}>

                                        <View style={{ flex: 1 }}>
                                            <RenderBadge text={"Submitted"} color={primaryColor} />
                                            <RenderBadge text={"Draft"} color={draftColor} />
                                        </View>
                                    </View>

                                </View>
                            </View>
                            {
                                !listData?.length && !offlineForms.length && !fetching ? <RenderLottie /> :
                                    <View style={styles.journalListContainer}>
                                        <FlatList
                                            style={{ flex: 1, height: '100%' }}
                                            contentContainerStyle={{ paddingBottom: normalizeHeight(70) }}
                                            data={flatListData()}
                                            renderItem={renderItem}
                                            keyExtractor={(item, index) => `${item.journal_submitted_id}-${index}`}
                                            onScroll={handleOnReachedEnd}
                                            refreshControl={
                                                <RefreshControl
                                                    refreshing={isPullToRefreshLoading}
                                                    onRefresh={onPullToRefresh}
                                                />
                                            }
                                        />
                                    </View>

                            }
                            {
                                fetching ? <Loading size={'large'} /> : <></>
                            }
                            <FloatingButton
                                disabled={!formData.length}
                                onPress={() => handleRedirection(RouteNames.User.HuntingJournal, formData)} />
                        </View >
                    </>

            }
        </>
    )
}
const mapStateToProps = state => {
    return {
        listData: state.journal.listData,
        formData: state.journal.formData,
        offlineForms: state.journal.offlineForms,
        isInternetConnected: state.InternetConnection.internetConnected,
        formUploadingStatus: state.journal.formUploadingStatus,
        paginationData: state.journal.paginationData,
        filterOptions: state.journal.filterOptions,
        filteredListData: state.journal.filteredListData
    }
}

const mapDispatchToProps = {
    GetJournalListApi,
    DeleteJournalByApi,
    GetJournalFormApi,
    deleteOfflineJournalForm,
    deleteOnlineJournalForm,
    saveFilterOptions
}
export default connect(mapStateToProps, mapDispatchToProps)(JournalView)
const styles = StyleSheet.create({
    journalMain: {
        backgroundColor: whiteColor,
        flex: 1,
        marginBottom: normalizeHeight(60),
    },
    journalTitle: {
        // flex: 1,
        flexDirection: 'row',
        height: deviceHeight * 0.11,
        // width: deviceWidth,
        width: "100%",
        paddingHorizontal: normalizeWidth(10)
    },
    journalTitleText: {
        color: blackColor,
        fontSize: fontH2,
        fontFamily: fontFamily.Primary.Regular,

    },
    journalListContainer: {
        marginTop: normalizeWithScale(15),
        backgroundColor: whiteColor,
        flex: 6,
        paddingHorizontal: normalizeWidth(10)
    },
    filterTextStyle: {
        color: 'white',
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH2V2,
        marginRight: normalizeWidth(5)
    },
    filterContainerStyle: {
        height: "50%",
        // width: Platform.OS === 'android' ? '58%' : '60%',
        backgroundColor: primaryColor,
        borderRadius: normalizeWidth(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: normalizeWidth(10)
    }
})

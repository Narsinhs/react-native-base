import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { deleteGreenIcon, linkOpenIcon, pdfFileIcon } from '../../../assets/images';
import { fontFamily, fontH2V2, whiteColor, primaryColor, dividerBlackColor, draftColor, buttonColorYellow } from '../../../constants/Styles';
import { normalizeHeight, normalizeWidth } from '../../../utils/FontUtil';
import Swipeout from 'react-native-swipeout';
import { formatDate } from '../../../utils/DateUtil';
import { registerToastMessage } from '../../../utils/RegisterToast';
import { Loading } from '../../shared/Loading';

const JournalListItem = ({ item, date, isDraft, handleDeleteById, handleJournalListItemClick, handleDownloadPDF, loading }) => {
    const DeleteButton = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: normalizeHeight(10) }}>
                <Image source={deleteGreenIcon} style={{ width: normalizeWidth(25), height: normalizeHeight(25) }} resizeMode="contain" />
            </View>
        )
    }

    const handleButtonPress = (id) => {
        // TODO DELETE LOGIC
        handleDeleteById(id, isDraft)
    }

    const swipeoutBtns = [
        {
            backgroundColor: 'white',
            component: <DeleteButton />,
            onPress: () => handleButtonPress(item?.journal_submitted_id)
        }
    ]

    const onPressFormEdit = () => {
        if (handleJournalListItemClick) {
            handleJournalListItemClick(item)
        }
    }

    const handlePDFDownload = () => {
        if (handleDownloadPDF && item?.pdf_file && item?.submission_date) {
            handleDownloadPDF(item?.pdf_file, item?.submission_date)
        }
        else {
            registerToastMessage('Not available for download')
        }
    }


    return (
        <Swipeout right={swipeoutBtns} backgroundColor={"white"} autoClose={true}>
            <View style={{ ...styles.listItem, backgroundColor: isDraft ? draftColor : primaryColor }}>
                <Text style={{ ...styles.journalDate }}>{formatDate(date, 'DD MMMM YYYY')}</Text>
                <View style={{ alignItems: "center", flex: 1 }}>
                </View>
                <View style={styles.imgContainer}>
                    {
                        loading ? <Loading color='white' /> :
                            <TouchableOpacity onPress={onPressFormEdit}>
                                <Image source={linkOpenIcon} resizeMode={'contain'} style={{ width: normalizeWidth(28), height: normalizeHeight(28) }} />
                            </TouchableOpacity>
                    }

                    <View style={styles.verticleLine}></View>
                    <TouchableOpacity disabled={loading} onPress={handlePDFDownload}>
                        <Image source={pdfFileIcon} resizeMode={'contain'} style={{ width: normalizeWidth(30), height: normalizeHeight(30) }} />
                    </TouchableOpacity>
                </View>
            </View>
        </Swipeout>
    );
}
export default React.memo(JournalListItem)
const styles = StyleSheet.create({
    listItem: {
        paddingVertical: normalizeWidth(20),
        paddingHorizontal: normalizeWidth(20),
        marginBottom: normalizeHeight(10),
        height: '100%',
        flex: 1,
        alignSelf: "center",
        flexDirection: "row",
        borderRadius: normalizeWidth(10),
    },
    journalDate: {
        alignSelf: "center",
        color: whiteColor,
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH2V2
    },

    verticleLine: {
        margin: normalizeWidth(10),
        height: '120%',
        opacity: 0.8,
        width: normalizeWidth(0.5),
        backgroundColor: dividerBlackColor,
    },
    imgContainer: {
        height: '100%',
        alignItems: 'center',
        flexDirection: 'row',
    },

})

import * as React from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View } from "react-native";
import DrawerContent from "./DrawerContent";
import { primaryColor, whiteColor } from "../../constants/Styles";
import MainNavigator from "./MainNavigator";
import { connect } from "react-redux";
import useJournalFormSubmit from "../../hooks/useJournalFormSubmit";
import { DeleteJournalByApi, handleManageOfflineForms, handleOfflineUploadLoading, submitJournalForm, UploadImage } from "../../redux/actions";
import { useEffect } from "react";
const Drawer = createDrawerNavigator();
const DrawerNavigator = ({ UploadImage, submitJournalForm, isInternetConnected, DeleteJournalByApi, allOfflineForms, handleOfflineUploadLoading, handleManageOfflineForms, journalOfflineDeleteIds }) => {
    const { handleSubmitJournalForm } = useJournalFormSubmit(UploadImage, submitJournalForm);
    useEffect(() => {
        if (isInternetConnected && allOfflineForms.length) {
            handleUploadOfflineForms(allOfflineForms)
        }
        if (isInternetConnected && journalOfflineDeleteIds.length) {
            handleDeleteOfflineForms(journalOfflineDeleteIds)   // delete offline forms
        }
    }, [isInternetConnected])

    const handleUploadOfflineForms = async (allOfflineForms) => {
        for (let i = 0; i < allOfflineForms.length; i++) {
            const eachForm = { ...allOfflineForms[i].form };
            // deleting form type as backend returns same form as I post.
            delete eachForm.type;
            try {
                handleOfflineUploadLoading(true, eachForm.journal_submitted_id);
                await handleSubmitJournalForm(eachForm);
                await handleManageOfflineForms(eachForm);
                handleOfflineUploadLoading(false, eachForm.journal_submitted_id);

            } catch (e) {
                console.log("THIS IS ERROR", e)
                handleOfflineUploadLoading(false, eachForm.journal_submitted_id);
            }
        }
    }


    const handleDeleteOfflineForms = async (journalOfflineDeleteIds) => {
        for (let i = 0; i < journalOfflineDeleteIds.length; i++) {
            let eachId = journalOfflineDeleteIds[i];
            try {
                await DeleteJournalByApi(eachId);
            }
            catch (e) {
                console.log("THIS IS ERROR", e)

            }
        }
    }


    return (
        <Drawer.Navigator
            drawerType="slide"
            overlayColor="transparent"
            drawerStyle={styles.drawerStyles}
            contentContainerStyle={{ flex: 1 }}

            screenOptions={{
                activeBackgroundColor: primaryColor,
                activeTintColor: primaryColor,
                inactiveTintColor: primaryColor,
                headerShown: false
            }}
            backBehavior={true}
            sceneContainerStyle={{ backgroundColor: primaryColor }}
            drawerContent={props => {
                return <DrawerContent {...props} />;
            }}
        >
            <Drawer.Screen name="DrawerNavigator">
                {props => <MainNavigator {...props} />}
            </Drawer.Screen>
        </Drawer.Navigator>

    )
}
const mapStateToProps = state => {
    return {
        allOfflineForms: state.journal.offlineForms,
        isInternetConnected: state.InternetConnection.internetConnected,
        journalOfflineDeleteIds: state.journal.journalOfflineDeleteIds
    };
};
const mapDispatchToProps = {
    submitJournalForm,
    UploadImage,
    handleOfflineUploadLoading,
    handleManageOfflineForms,
    DeleteJournalByApi
}


export default connect(mapStateToProps, mapDispatchToProps)(DrawerNavigator)

const styles = StyleSheet.create({
    drawerStyles: { flex: 1, backgroundColor: whiteColor, width: '100%' },
});
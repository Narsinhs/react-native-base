import { API_RESPONSE_STATUS, FORM_FILTER_KEYS } from "../../constants/Enum";
import { fetchUtil } from "../../utils/FetchUtils";
import { registerToastMessage } from "../../utils/RegisterToast";
import { getToken } from "../../utils/TokenUtil";
import { appendQueryParams, appendRouteParams } from "../../utils/UrlUtils";

export const JOURNAL_FORM_SUCCESS = "JOURNAL_FORM_SUCCESS";
export const JOURNAL_LIST_SUCCESS = "JOURNAL_LIST_SUCCESS";

export const SAVE_OFFLINE_JOURNAL_FORM = "SAVE_OFFLINE_JOURNAL_FORM"
export const SAVE_EDIT_OFFLINE_JOURNAL_FORM = "SAVE_EDIT_OFFLINE_JOURNAL_FORM"

export const DELETE_OFFLINE_FORM_AND_FILTER = "DELETE_OFFLINE_FORM_AND_FILTER"
export const DELETE_ONLINE_FORM_AND_FILTER = "DELETE_ONLINE_FORM_AND_FILTER"

export const HANDLE_OFFLINE_FORM_UPDATE_LOADING = "HANDLE_OFFLINE_FORM_UPDATE_LOADING";

export const MANAGE_DELETE_IDS_OFFLINE = "MANAGE_DELETE_IDS_OFFLINE"
export const MUTATE_AND_FILTER_DELETE_IDS_OFFLINE = "MUTATE_AND_FILTER_DELETE_IDS_OFFLINE"

export const SAVE_FILTER_OPTIONS = "SAVE_FILTER_OPTIONS";

export const SAVE_FILTER_ONLINE_FORMS = "SAVE_FILTER_ONLINE_FORMS"

export const JournalSubmitApi = (obj) => (dispatch, getState) => {
    let body = JSON.stringify(obj)
    return fetchUtil({
        url: "/my/journal/query/submit",
        method: `POST`,
        body,
        token: getToken(),
        showToast: true
    }).then((response) => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response.error);
        }
    }).catch((err) => {
        console.log(err, "errJournalSubmitApiJournalSubmitApi")
        return Promise.reject(err);
    })
}

export const GetJournalFormApi = (body) => (dispatch, getState) => {
    const internetStatus = getState()?.InternetConnection?.internetConnected;
    if (internetStatus) {
        return fetchUtil({
            url: `/journal/form`,
            method: `GET`,
            token: getToken()
        }).then((response) => {
            if (response.status === 200) {
                let data = response?.data;
                dispatch({ type: JOURNAL_FORM_SUCCESS, payload: data })
                return Promise.resolve(data);
            }
            else {
                return Promise.reject(response.message);
            }
        }).catch((err) => {
            return Promise.reject(err);
        })
    }
    else {
        const persistedFormData = getState()?.journal?.formData || [];
        return Promise.resolve(persistedFormData);
    }

}
export const filteringDataForms = (forms, state, township, time_in, time_out, submission_date) => {
    let filteredOnlineForms = forms.filter(each => {
        let formFields = each?.form?.form_options_list;
        let isReturningObject = {
            isStateReturning: state ? false : true,
            isTownShipReturning: township ? false : true,
            isTimeinReturning: time_in ? false : true,
            isTimeoutReturning: time_out ? false : true,
            isSubmissiondateReturning: submission_date ? false : true
        }
        for (let i = 0; i < formFields.length; i++) {
            let eachField = formFields[i];
            if (FORM_FILTER_KEYS[eachField.lable]) {
                console.log(FORM_FILTER_KEYS[eachField.lable], "Date", eachField.option_answer, submission_date)
                if (FORM_FILTER_KEYS[eachField.lable] == "Date" && eachField.option_answer.split("T")[0] == submission_date) {
                    isReturningObject.isSubmissiondateReturning = true;
                }
                if (FORM_FILTER_KEYS[eachField.lable] == "State" && eachField.option_answer == state) {
                    isReturningObject.isStateReturning = true;
                }
                if (FORM_FILTER_KEYS[eachField.lable] == "Time In" && eachField.option_answer == time_in) {
                    isReturningObject.isTimeinReturning = true;
                }
                if (FORM_FILTER_KEYS[eachField.lable] == "Time Out" && eachField.option_answer == time_out) {
                    isReturningObject.isTimeoutReturning = true;
                }
                if (FORM_FILTER_KEYS[eachField.lable] == "County/Township" && eachField.option_answer == township) {
                    isReturningObject.isTownShipReturning = true;
                }
                // let eachOptionAnswer = eachField.option_answer
                // if (eachOptionAnswer.includes(state) &&  eachOptionAnswer.includes(township) && eachOptionAnswer.includes(time_out) || )
            }
        }
        if (isReturningObject.isStateReturning && isReturningObject.isSubmissiondateReturning && isReturningObject.isTimeinReturning && isReturningObject.isTimeoutReturning) {
            return each;
        } else {
            return false;
        }
        // console.log(formFields[0], " formFields ")
    });
    return filteredOnlineForms;
}

export const GetJournalListApi = (page = 1, limit = 10, state = "", township = "", time_in = "", time_out = "", submission_date = "") => (dispatch, getState) => {
    const storeState = getState()?.InternetConnection?.internetConnected;
    console.log("FILTERS FOR SEARCHING ", state, "State", township, "township", time_in, "time_in", time_out, "time_out", submission_date, "submission_date")
    if (storeState) {
        console.log("*****************************************", { state, township, time_in, time_out, submission_date, page, limit })
        return fetchUtil({
            url: appendQueryParams(`/journal/search/lists/offline`, { state, township, time_in, time_out, submission_date, page, limit }),
            method: `GET`,
            token: getToken()
        }).then((response) => {
            if (response.status === 200) {
                // get reponse and dispatch to reducer
                let data = response?.data?.list;
                let paginationData = response?.data?.pagination
                if (state || township || time_in || time_out || submission_date) {
                    dispatch({ type: SAVE_FILTER_ONLINE_FORMS, payload: { data, paginationData: paginationData, page } })
                }
                else {
                    dispatch({ type: JOURNAL_LIST_SUCCESS, payload: { data, paginationData: paginationData, page } })
                }
                return Promise.resolve(response);
            }
            else {
                return Promise.reject(response.message);
            }
        }).catch((err) => {
            return Promise.reject(err);
        })
    }
    else {
        console.log("INTERNET DISCONNECTED ARRAY *********************************************")
        if (state || township || time_in || time_out || submission_date) {
            // LOGIC FOR FILTERING THE DATA IN OFFLINE MODE;
            let allOfflineForms = getState()?.journal?.offlineForms;
            let allOnlineForms = getState()?.journal?.listData;

            console.log(allOfflineForms)
            console.log("###### LENGTH #########", allOnlineForms.length, allOfflineForms.length);
            console.log("formField", state, township, time_in, time_out, submission_date);
            // let filteredOnlineForms = allOfflineForms
            let filteredOnlineForms = filteringDataForms(allOnlineForms, state, township, time_in, time_out, submission_date);
            let filteredOfflineForms = filteringDataForms(allOfflineForms, state, township, time_in, time_out, submission_date);
            let filteredformResponse = filteredOfflineForms.concat(filteredOnlineForms);
            console.log(filteredOfflineForms.length, "filteredOnlineForms.length")
            // const persistedJournalList = filteredOnlineForms || [];
            dispatch({ type: SAVE_FILTER_ONLINE_FORMS, payload: { data: filteredformResponse, paginationData: {}, page } })
            return Promise.resolve(true);
        }
        else {
            const persistedJournalList = getState()?.journal?.listData || [];
            return Promise.resolve(persistedJournalList);
        }
    }
}


export const DeleteJournalByApi = (journal_submitted_id) => (dispatch, getState) => {

    return fetchUtil({
        url: `/journal/form/delete/${journal_submitted_id}`,
        method: `DELETE`,
        token: getToken(),
        showToast: true
    }).then((response) => {
        if (response.status === 200) {
            //dispatch and pop from reducer state
            const listData = getState().journal.listData
            const finalList = listData.filter(function (list) {
                return list.journal_submitted_id != journal_submitted_id;
            });
            dispatch({ type: JOURNAL_LIST_SUCCESS, payload: finalList })
            dispatch(manageDeleteJournalIdFromOffline(journal_submitted_id))
            return Promise.resolve(finalList);
        }
        else {
            return Promise.reject(response.message);
        }
    }).catch((err) => {
        console.log(err, "errerrerr")
        return Promise.reject(err);
    })
}

export const manageDeleteJournalIdFromOffline = (journal_submitted_id) => (dispatch, getState) => {
    const journalOfflineDeleteIds = getState().journal.journalOfflineDeleteIds;
    let filteredDeleteIds = journalOfflineDeleteIds.filter(eachId => eachId !== journal_submitted_id);
    dispatch({
        type: MUTATE_AND_FILTER_DELETE_IDS_OFFLINE,
        payload: filteredDeleteIds
    })

}


export const UploadImage = (body) => (dispatch, getState) => {
    return fetchUtil({
        url: `/journal/image/upload`,
        body: JSON.stringify(body),
        token: getToken(),
        method: `POST`,
    }).then(res => {
        if (res.status === 200) {
            return Promise.resolve(res.data);
        }
        else {
            return Promise.resolve(res.message)
        }
    }).catch(e => {
        return Promise.reject(e)
    })
}

export const submitJournalForm = (formBody) => (dispatch, getState) => {
    return fetchUtil({
        url: `/journal/query/submit`,
        body: JSON.stringify(formBody),
        token: getToken(),
        method: `POST`,
    }).then(res => {
        if (res.status === API_RESPONSE_STATUS.SUCCESS) {
            registerToastMessage(res.message, true)
            return Promise.resolve(res.message);
        }
        else {
            registerToastMessage(res.message, false)
            return Promise.reject(res.message)
        }
    }).catch(e => {
        registerToastMessage(JSON.stringify(e), false)
        return Promise.reject(e)
    })
}

export const deleteJournalFormImage = (image_id) => (dispatch, getState) => {
    return fetchUtil({
        url: `/journal/delete/image/${image_id}`,
        token: getToken(),
        method: `DELETE`,
    }).then(res => {
        if (res.status === API_RESPONSE_STATUS.SUCCESS) {
            registerToastMessage(res.message, true)
            return Promise.resolve(res.message);
        }
        else {
            return Promise.resolve(res.message)
        }
    }).catch(e => {
        return Promise.reject(e)
    })
}


export const saveOfflineForm = (formObject) => (dispatch, getState) => {
    let formObjectSubmittedId = formObject.journal_submitted_id;
    let allOfflineForms = getState().journal.offlineForms;
    let allOnlineForms = getState().journal.listData;
    let existedOfflineFormIndex = allOfflineForms.findIndex(form => form.journal_submitted_id === formObjectSubmittedId);
    let existedOnlineFormIndex = allOnlineForms.findIndex(form => form.journal_submitted_id === formObjectSubmittedId);

    if (existedOnlineFormIndex > -1) {
        allOnlineForms.splice(existedOnlineFormIndex, 1);
        dispatch({
            type: DELETE_ONLINE_FORM_AND_FILTER,
            payload: allOnlineForms
        })
    }

    if (existedOfflineFormIndex >= 0) {
        // changing the form object at the existing index in the array mutation, then dispatch to reducer

        allOfflineForms[existedOfflineFormIndex] = formObject;
        dispatch({
            type: SAVE_EDIT_OFFLINE_JOURNAL_FORM,
            payload: allOfflineForms
        })
    }
    else {
        dispatch({
            type: SAVE_OFFLINE_JOURNAL_FORM,
            payload: formObject
        })
    }
    return Promise.resolve(true)
}

export const deleteOfflineJournalForm = (journal_submitted_id, addIdToDeleteArray = true) => (dispatch, getState) => {
    let allOfflineForms = getState().journal.offlineForms;
    // Filter the offline form based on the journal_submitted_id
    let filteredOfflineForms = allOfflineForms.filter(form => {
        if (form.journal_submitted_id !== journal_submitted_id) {
            return form;
        }
    });
    if (addIdToDeleteArray) {
        dispatch(manageDeleteJournalFormOffline(journal_submitted_id))
    }
    dispatch({
        type: DELETE_OFFLINE_FORM_AND_FILTER,
        payload: filteredOfflineForms
    })
}

// Filtering the data from the online data list, based on the journal_submitted_id, if device is offline.
export const deleteOnlineJournalForm = (journal_submitted_id) => (dispatch, getState) => {
    let allOnlineForms = getState().journal.listData;
    let filteredOnlineForms = allOnlineForms.filter(form => {
        if (form.journal_submitted_id !== journal_submitted_id)
            return form;
    });
    dispatch(manageDeleteJournalFormOffline(journal_submitted_id))
    dispatch({ type: JOURNAL_LIST_SUCCESS, payload: filteredOnlineForms })
}

export const manageDeleteJournalFormOffline = (journal_submitted_id) => (dispatch, getState) => {
    dispatch({
        type: MANAGE_DELETE_IDS_OFFLINE,
        payload: journal_submitted_id
    })
}

export const handleOfflineUploadLoading = (loadingStatus, journal_submitted_id) => (dispatch, getState) => {
    dispatch({
        type: HANDLE_OFFLINE_FORM_UPDATE_LOADING,
        payload: {
            loadingStatus,
            journal_submitted_id
        }
    })
}

export const handleManageOfflineForms = (formObject) => (dispatch, getState) => {
    dispatch(deleteOfflineJournalForm(formObject.journal_submitted_id, false));
    const allOnlineForms = getState().journal.listData;
    // THE NEW FORM IS NOT IN THE LIST OF ONLINE FORM, SO ADD IT, The key for each form in listing is form: formData, mapping it in local.
    const mutatedOnlineForms = [{ form: formObject }, ...allOnlineForms];
    dispatch({ type: JOURNAL_LIST_SUCCESS, payload: mutatedOnlineForms })
    return Promise.resolve(true)
}

export const saveFilterOptions = (filterObject) => (dispatch, getState) => {
    dispatch({
        type: SAVE_FILTER_OPTIONS,
        payload: filterObject
    })
}
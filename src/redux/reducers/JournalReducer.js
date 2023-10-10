import { SAVE_FILTER_OPTIONS, SAVE_FILTER_ONLINE_FORMS, JOURNAL_FORM_SUCCESS, LOGOUT_SUCCESS, JOURNAL_LIST_SUCCESS, MUTATE_AND_FILTER_DELETE_IDS_OFFLINE, MANAGE_DELETE_IDS_OFFLINE, SAVE_OFFLINE_JOURNAL_FORM, SAVE_EDIT_OFFLINE_JOURNAL_FORM, DELETE_OFFLINE_FORM_AND_FILTER, HANDLE_OFFLINE_FORM_UPDATE_LOADING } from "../actions/index"

const initialState = {
    formData: [],
    listData: [],
    offlineForms: [],
    formUploadingStatus: {},
    journalOfflineDeleteIds: [],
    paginationData: {},
    filterOptions: {},
    filteredListData: [],
    filteredOfflineForms: []
}

const JournalReducer = (state = initialState, action) => {
    switch (action.type) {
        case JOURNAL_FORM_SUCCESS: {
            return {
                ...state,
                formData: action.payload
            }
        }
        case JOURNAL_LIST_SUCCESS: {
            return {
                ...state,
                listData: action?.payload?.paginationData ? Number(action?.payload?.page) === 1 ? action.payload.data : [...state.listData, ...action?.payload?.data] : action.payload,
                formUploadingStatus: {},
                paginationData: action?.payload?.paginationData ? { ...action?.payload?.paginationData } : {}
            }
        }
        case SAVE_FILTER_ONLINE_FORMS: {
            return {
                ...state,
                filteredListData: action?.payload?.paginationData ? Number(action?.payload?.page) === 1 ? action.payload.data : [...state.filteredListData, ...action?.payload?.data] : action.payload,
                formUploadingStatus: {},
                paginationData: action?.payload?.paginationData ? { ...action?.payload?.paginationData } : {}
            }
        }

        case SAVE_OFFLINE_JOURNAL_FORM: {
            return {
                ...state,
                offlineForms: [action.payload, ...state.offlineForms]
            }
        }
        case SAVE_EDIT_OFFLINE_JOURNAL_FORM: {
            return {
                ...state,
                offlineForms: [...action.payload]
            }
        }
        case DELETE_OFFLINE_FORM_AND_FILTER: {
            return {
                ...state,
                offlineForms: [...action.payload]
            }
        }
        case HANDLE_OFFLINE_FORM_UPDATE_LOADING: {
            return {
                ...state,
                formUploadingStatus: action.payload
            }
        }
        case MANAGE_DELETE_IDS_OFFLINE: {
            return {
                ...state,
                journalOfflineDeleteIds: [action.payload, ...state.journalOfflineDeleteIds]
            }
        }
        case MUTATE_AND_FILTER_DELETE_IDS_OFFLINE: {
            return {
                ...state,
                journalOfflineDeleteIds: [...action.payload]
            }
        }
        case LOGOUT_SUCCESS: {
            return initialState
        }
        case SAVE_FILTER_OPTIONS: {
            return {
                ...state,
                filterOptions: action.payload
            }
        }
        default:
            return state
    }
}

export default JournalReducer
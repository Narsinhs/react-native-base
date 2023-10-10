// All enums of the applications shall be listed here *********

export const GOOGLE_WEB_CLIENT_ID = "765506783197-r4llu1rsi0pvadsulv76fub84rtoiv4p.apps.googleusercontent.com" // Get this key either from firebase or google.services.json file with client_type = 3 ==> client Id


export const IOS_SUBSCRIPTIONS = ["wt_monthly", "wt_yearly"];
export const ANDROID_SUBSCRIPTIONS = ["wt_monthly", "wt_yearly"];


export const FORM_ITEM_TYPE = {
    "text": "text",
    "date": "date",
    "time": "time",
    "checkbox": "checkbox",
    "radio": "radio",
    "textarea": "textarea",
    "number": "number",
    "select": "select",
    "file": "file",
    "api": "api",
    "range": "range"
}
export const LOCATION_TYPES = {
    "country": "country",
    "state": "state",
    "county": "county"
}
export const FORM_VALIDATION_TYPES = {
    "required": "isRequired"
}

export const DATE_TIME_PICKER_TYPES = {
    "time": "time",
    "date": "date"
}

export const API_RESPONSE_STATUS = {
    'SUCCESS': 200
}

export const DEFAULT_COORDINATE = {
    latitude: 30.902316952879538,
    longitude: -84.56582445271479
}

export const HUNTING_DETAIL_SPLIT_ASCII = "&#8722; "

export const SOCIALITE_PROVIDERS = {
    "google": "google"
}

export const FORM_FILTER_OPTIONS_LABEL_KEYS = {
    "Date": "submission_date",  // key refers to filterObject key, value refers to form fields label;
    "State": "state",
    "Time In": "time_in",
    "Time Out": "time_out",
    "County/Township": "township",
}

export const FORM_FILTER_KEYS = {
    "Date": "Date",
    "State": "State",
    "Time In": "Time In",
    "Time Out": "Time Out",
    "County/Township": "County/Township"
}
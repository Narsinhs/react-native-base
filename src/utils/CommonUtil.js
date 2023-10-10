import { PermissionsAndroid, Platform } from 'react-native';
import { HUNTING_JOURNAL_API_PHOTO, Non_Hunting_Month, OTHER_SLUG, RANGE_SLUG } from "../constants/constants";
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
import DeviceInfo from "react-native-device-info";

export const getRandomUUID = () => {
    return Math.random().toString(36).substr(2, 10);
};

export const getAppPackageBundleId = () => {
    return DeviceInfo.getBundleId();
}

export const isObject = (val) => {
    return typeof val === 'object' && val !== null
}

export const getFormattedLocation = (mapBoxContextArray) => {
    let result = {
        country: "",
        state: "",
        city: ""
    }
    for (let i = 0; i < mapBoxContextArray.length; i++) {
        let each = mapBoxContextArray[i];
        if (each?.id?.includes("place")) {
            result.city = each.text;
        }
        else if (each?.id?.includes("region")) {
            result.state = each.text;
        }
        else if (each?.id?.includes("country")) {
            result.country = each.text
        }
    }
    return result
}

export const getKeyValueObject = (key, value) => {
    let obj = {};
    obj[key] = value;

    return obj;
}

export const transformArrayToObjectWithKeys = (array, objectOfAlreadySelectedKeys) => {
    return [...array].map((each, index) => {
        let eachResult = each.includes('|') ? getResultLabel(each, objectOfAlreadySelectedKeys) : null
        return {
            id: index + 1,
            label: each.includes('|') ? eachResult.label : each,
            selected: objectOfAlreadySelectedKeys[each] ? true : each.includes('|') ? eachResult.flag : false
        }
    })
}


const getResultLabel = (label, object) => {
    let objectKeys = Object.keys(object);
    for (let i = 0; i < objectKeys.length; i++) {
        let eachKey = objectKeys[i];
        if (eachKey.includes(label)) {
            return {
                flag: true,
                label: eachKey
            };
        }
    }
    return {
        flag: false,
        label
    }
}

export const transformLocationArrayToObjectWithKeys = (array, objectOfAlreadySelectedKeys) => {
    return [...array].map((each, index) => ({
        id: each.id,
        label: each.name,
        selected: objectOfAlreadySelectedKeys[each.name] ? true : false
    }))
}

export const getObjectOfValues = (array) => {
    let preparedObject = {};
    if (array) {
        for (let i = 0; i < array.length; i++) {
            preparedObject[array[i]] = array[i];
        }
    }
    return preparedObject;
}


export const transformJournalImageArray = (array, ids) => {
    let arr = [];
    if (array.length && ids.length) {
        for (let i = 0; i < array.length; i++) {
            let eachObject = {
                id: ids[i],
                uri: array[i],
                type: HUNTING_JOURNAL_API_PHOTO
            };
            arr.push(eachObject)
        }
    }
    return arr;
}

export const transferArrayOfObjectsIntoString = (array) => {
    let transformedArray = []
    for (let i = 0; i < array.length; i++) {
        let each = array[i];
        if (each.selected) {
            transformedArray.push(each.label);
        }
    }
    return transformedArray.join(',')
}

export const transformArrayOfObjectForTextInput = (array) => {
    let transformedArray = []
    for (let i = 0; i < array.length; i++) {
        let each = array[i];
        if (each.selected) {
            if (each.label.includes(RANGE_SLUG)) {
                let transformedText = ""
                let firstLevel = each.label.split('=').reverse();
                // console.log("firstLevel", firstLevel)
                let labelText = firstLevel[0].split('|').reverse();
                transformedText += labelText[1];

                const labelCount = firstLevel[1].split('_').reverse()
                transformedText += `(${labelCount[0]})`
                transformedArray.push(transformedText);
            }
            else {
                transformedArray.push(each.label);
            }
        }
    }
    return transformedArray.join(',')
}


export const requestLocationPermission = async () => {
    try {
        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization('whenInUse');
            Geolocation.setRNConfiguration({
                skipPermissionRequests: false,

            });
        }
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Location Permission',
                    'message': 'This App needs access to your location.'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log(granted, "granted")
            } else {
                console.log(granted, "un granted")
            }
        }
    } catch (err) {
        console.log("eeee")
        console.warn(err)
    }
}

export const getArrayOfRange = (lowerBound, upperBound) => {
    let array = [];
    for (let i = Number(lowerBound); i <= Number(upperBound); i++) {
        array.push(`${i}`)
    }
    return array;
}

export const CheckMonthForNonHunting = (date) => {
    let check = moment(date).format("MM")
    if (Non_Hunting_Month[check]) {
        return true
    } else {
        return false
    }

}
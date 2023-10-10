import moment from "moment";
import { Platform } from "react-native";
import { alignLeftMoon, alignRightMoon, cloudRainIcon, fullDarkMoon, fullMoon, sunnyCloudIcon, sunnyIcon, weatherSunnyIcon } from "../assets/images";
import { addDaysToDate, formatDate } from "../utils/DateUtil";
import { primaryColor } from "./Styles";

export const locationItemPressType = {
    "RADIO": 1,
    "FAVORITE": 2
}
export const MapBoxApiKeyToken = "pk.eyJ1Ijoia29kZXJsYWJzIiwiYSI6ImNreHE0Mms2azB5a2oyb29laDB2NGM2YXoifQ.feMKQcK6M5-21elFBSnhGw"

export const FAQText = [
    {
        id: 1,
        title: "Lorem Ipsum is simply dummy text",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
    {
        id: 2,
        title: "Lorem Ipsum is simply dummy text",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
    {
        id: 3,
        title: "Lorem Ipsum is simply dummy text",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
    {
        id: 4,
        title: "Lorem Ipsum is simply dummy text",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
    {
        id: 5,
        title: "Lorem Ipsum is simply dummy text",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
    },
]

export const journalDummyData = [
    {
        id: 1,
        "date": "02 Oct, 2021",
        "isDraft": false,
    },
    {
        id: 2,
        "date": "01 Aug, 2021",
        "isDraft": true,
    },
    {
        id: 3,
        "date": "25 Sep, 2021",
        "isDraft": false,
    },
    {
        id: 4,
        "name": "Renee Sims",
        "date": "02 Oct, 2021",
        "isDraft": false,
    },
    {
        id: 5,
        "date": "02 Oct, 2021",
        "isDraft": false,
    },
    {
        id: 6,
        "date": "01 Aug, 2021",
        "isDraft": true,
    },
    {
        id: 7,
        "date": "25 Sep, 2021",
        "isDraft": false,
    },
    {
        id: 8,
        "name": "Renee Sims",
        "date": "02 Oct, 2021",
        "isDraft": false,
    },
    {
        id: 9,
        "date": "02 Oct, 2021",
        "isDraft": false,
    },
    {
        id: 10,
        "date": "01 Aug, 2021",
        "isDraft": true,
    },
    {
        id: 11,
        "date": "25 Sep, 2021",
        "isDraft": false,
    },
    {
        id: 12,
        "name": "Renee Sims",
        "date": "02 Oct, 2021",
        "isDraft": false,
    },

]

export const weatherIconAndBackgroundDetails = {
    Sunny: {
        backgroundColor: "#91DDFF",
        backgroundImage: weatherSunnyIcon
    },
    Night: {
        backgroundColor: "#1d1f2f",
        backgroundImage: weatherSunnyIcon
    }
}
export const dummyCountryData = [
    {
        id: 1,
        "date": "Egypt",
        "isDraft": false,

    },
    {
        id: 2,
        "date": "Australia",
        "isDraft": false,
    },
    {
        id: 3,
        "date": "Ireland",
        "isDraft": false,
    },
    {
        id: 4,
        "date": "Canada",
        "isDraft": false,
    },


]

export const dummyiOSCountry = [
    {
        id: 1,
        "name": "Egypt",
    },
    {
        id: 2,
        "name": "Australia",
    },
    {
        id: 3,
        "name": "Ireland",
    },
    {
        id: 4,
        "name": "Canada",
    },


]

export const countries = ["Egypt", "Canada", "Australia", "Ireland"];


export const Date_Arrow_Icon_Type = {
    "LEFT": 1,
    "RIGHT": 2
}
export const Slug_Enum = {
    "about-us": 0,
    "faqs": 1,
    "terms-and-conditions": 2,
    "privacy-policy": 3
}
export const Slug_Enum_Offline = {
    "about-us": Platform.OS == "android" ? "file:///android_asset/www/AboutUs.html" : require("../html/AboutUs.html"),
    "faqs": Platform.OS == "android" ? "file:///android_asset/www/FAQs.html" : require("../html/FAQs.html"),
    "terms-and-conditions": Platform.OS == "android" ? "file:///android_asset/www/TermsConditions.html" : require("../html/TermsConditions.html"),
    "privacy-policy": Platform.OS == "android" ? "file:///android_asset/www/PrivacyPolicy.html" : require("../html/PrivacyPolicy.html"),
}
export const Non_Hunting_Month = {
    "03": "03",
    "04": "04",
    "05": "05",
    "06": "06",
    "07": "07"
}
export const dummy4DaysData = [
    {
        id: 1,
        date: addDaysToDate(moment(), 2),
        dayPhase: "Afternoon",
        actionTime: "2:30 - Dark",
        action: "Food Supply",
        dayName: formatDate(addDaysToDate(moment(), 2), "dddd"),
        backgroundColor: '#008F1D',
        moonIcon: fullMoon
    },
    {
        id: 2,
        date: addDaysToDate(moment(), 3),
        dayPhase: "Afternoon",
        actionTime: "3:00 - Dark",
        action: "Travel Route",
        dayName: formatDate(addDaysToDate(moment(), 3), "dddd"),
        backgroundColor: '#008F1D',
        moonIcon: fullDarkMoon
    },
    {
        id: 3,
        date: addDaysToDate(moment(), 4),
        dayPhase: "Morning",
        actionTime: "9:30 - Sunrise",
        action: "Travel Route",
        dayName: formatDate(addDaysToDate(moment(), 4), "dddd"),
        backgroundColor: '#FF0000',
        moonIcon: alignRightMoon
    },
    {
        id: 4,
        date: addDaysToDate(moment(), 5),
        dayPhase: "Morning",
        actionTime: "10:30 - Sunrise",
        action: "Food Supply",
        dayName: formatDate(addDaysToDate(moment(), 5), "dddd"),
        backgroundColor: '#008F1D',
        moonIcon: alignLeftMoon
    },
]

export const dummy4DaysWeather = [
    {
        id: 1,
        sunPhase: "Sunny",
        dayName: formatDate(moment(), "dddd"),
        upperBound: 45,
        lowerBound: 23,
        image: sunnyIcon
    },
    {
        id: 2,
        sunPhase: "Mostly Sunny",
        dayName: formatDate(addDaysToDate(moment(), 1), "dddd"),
        upperBound: 52,
        lowerBound: 30,
        image: sunnyIcon
    },
    {
        id: 3,
        sunPhase: "Partial Cloudy",
        dayName: formatDate(addDaysToDate(moment(), 2), "dddd"),
        upperBound: 59,
        lowerBound: 35,
        image: sunnyCloudIcon
    },
    {
        id: 4,
        sunPhase: "Chance Shower",
        dayName: formatDate(addDaysToDate(moment(), 3), "dddd"),
        upperBound: 62,
        lowerBound: 40,
        image: cloudRainIcon
    },
]
export const dummyModalWeather =
{
    id: 1,
    date: formatDate(moment(), "dddd d MMM, YYYY"),
    image: sunnyIcon,
    sunPhase: "Cloudy Wind SW - 10",
    upperBound: 45,
    lowerBound: 23,
    phases: [
        { id: 1, phaseName: "Twilight Start 6:18 AM" },
        { id: 2, phaseName: "Sun Rise 6:49 AM" },
        { id: 3, phaseName: "Sun Set 4:55 PM" },
        { id: 4, phaseName: "Twilight End 5:23 PM" }
    ]

}
export const DummySubscriptionData = {
    monthlyPlan: {
        id: 1,
        subType: "Paid Subscription",
        subValue: "9.99",
        subDescription: "Unlock the Whitetail Almanac's Daily Feeding & Travel Patterns with a Monthly or Yearly Subscription.",
    },
    yearlyPlan: {
        id: 2,
        subType: "Paid Subscription",
        subValue: "49.99",
        subDescription: "Unlock the Whitetail Almanac's Daily Feeding & Travel Patterns with a Monthly or Yearly Subscription.",
    }

}

export const DummyAddToCartData = {
    cart: {
        id: 1,
        monthlyPaidSubscription: "Monthly Paid Subscription",
        monthlyPaidSubscriptionAmount: "$ 9.99",
        subTotal: "$ 9.99",
        promoCodeDiscount: "Promo Code Discount",
        promoCodeDiscountAmount: "-$ 2.00",
        total: "$ 7.99",
    },
}

export const ADD_NEW_PHOTO = "ADD_NEW_PHOTO";
export const HUNTING_JOURNAL_API_PHOTO = "HUNTING_JOURNAL_API_PHOTO"
export const IS_OFFLINE_FORM = "IS_OFFLINE_FORM"

export const FCM_TOKEN = "FCM_TOKEN"

export const AUTH_STATUS = {
    "NOT_VERIFIED": 0,
    "VERIFIED": 1
}

export const OTHER_SLUG = "Other"
export const RANGE_SLUG = "range"

export const COUNTRY = [
    {
        "id": "240",
        "name": "United States"
    }
]
export const STATES = [
    {
        "id": "105",
        "country_id": "240",
        "name": "Alabama"
    },
    {
        "id": "111",
        "country_id": "240",
        "name": "Alaska"
    },
    {
        "id": "218",
        "country_id": "240",
        "name": "Arizona"
    },
    {
        "id": "219",
        "country_id": "240",
        "name": "Arkansas"
    },
    {
        "id": "585",
        "country_id": "240",
        "name": "California"
    },
    {
        "id": "790",
        "country_id": "240",
        "name": "Colorado"
    },
    {
        "id": "800",
        "country_id": "240",
        "name": "Connecticut"
    },
    {
        "id": "877",
        "country_id": "240",
        "name": "Delaware"
    },
    {
        "id": "1079",
        "country_id": "240",
        "name": "Florida"
    },
    {
        "id": "1132",
        "country_id": "240",
        "name": "Georgia"
    },
    {
        "id": "1299",
        "country_id": "240",
        "name": "Hawaii"
    },
    {
        "id": "1367",
        "country_id": "240",
        "name": "Idaho"
    },
    {
        "id": "1400",
        "country_id": "240",
        "name": "Illinois"
    },
    {
        "id": "1416",
        "country_id": "240",
        "name": "Indiana"
    },
    {
        "id": "1423",
        "country_id": "240",
        "name": "Iowa"
    },
    {
        "id": "1560",
        "country_id": "240",
        "name": "Kansas"
    },
    {
        "id": "1606",
        "country_id": "240",
        "name": "Kentucky"
    },
    {
        "id": "1903",
        "country_id": "240",
        "name": "Louisiana"
    },
    {
        "id": "1958",
        "country_id": "240",
        "name": "Maine"
    },
    {
        "id": "2034",
        "country_id": "240",
        "name": "Maryland"
    },
    {
        "id": "2042",
        "country_id": "240",
        "name": "Massachusetts"
    },
    {
        "id": "2098",
        "country_id": "240",
        "name": "Michigan"
    },
    {
        "id": "2117",
        "country_id": "240",
        "name": "Minnesota"
    },
    {
        "id": "2130",
        "country_id": "240",
        "name": "Mississippi"
    },
    {
        "id": "2131",
        "country_id": "240",
        "name": "Missouri"
    },
    {
        "id": "2159",
        "country_id": "240",
        "name": "Montana"
    },
    {
        "id": "2269",
        "country_id": "240",
        "name": "Nebraska"
    },
    {
        "id": "2280",
        "country_id": "240",
        "name": "Nevada"
    },
    {
        "id": "2283",
        "country_id": "240",
        "name": "New Hampshire"
    },
    {
        "id": "2285",
        "country_id": "240",
        "name": "New Jersey"
    },
    {
        "id": "2286",
        "country_id": "240",
        "name": "New Mexico"
    },
    {
        "id": "2290",
        "country_id": "240",
        "name": "New York"
    },
    {
        "id": "2351",
        "country_id": "240",
        "name": "North Carolina"
    },
    {
        "id": "2354",
        "country_id": "240",
        "name": "North Dakota"
    },
    {
        "id": "2452",
        "country_id": "240",
        "name": "Ohio"
    },
    {
        "id": "2458",
        "country_id": "240",
        "name": "Oklahoma"
    },
    {
        "id": "2489",
        "country_id": "240",
        "name": "Oregon"
    },
    {
        "id": "2586",
        "country_id": "240",
        "name": "Pennsylvania"
    },
    {
        "id": "2796",
        "country_id": "240",
        "name": "Rhode Island"
    },
    {
        "id": "3234",
        "country_id": "240",
        "name": "South Carolina"
    },
    {
        "id": "3235",
        "country_id": "240",
        "name": "South Dakota"
    },
    {
        "id": "3430",
        "country_id": "240",
        "name": "Tennessee"
    },
    {
        "id": "3437",
        "country_id": "240",
        "name": "Texas"
    },
    {
        "id": "3586",
        "country_id": "240",
        "name": "Utah"
    },
    {
        "id": "3655",
        "country_id": "240",
        "name": "Vermont"
    },
    {
        "id": "3688",
        "country_id": "240",
        "name": "Virginia"
    },
    {
        "id": "3727",
        "country_id": "240",
        "name": "Washington"
    },
    {
        "id": "3728",
        "country_id": "240",
        "name": "Washington, D.C."
    },
    {
        "id": "3752",
        "country_id": "240",
        "name": "West Virginia"
    },
    {
        "id": "3776",
        "country_id": "240",
        "name": "Wisconsin"
    },
    {
        "id": "3783",
        "country_id": "240",
        "name": "Wyoming"
    }
]

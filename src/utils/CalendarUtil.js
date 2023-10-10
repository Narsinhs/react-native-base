import { LocaleConfig } from "react-native-calendars"

export const useCalendarUtil = () => {
    LocaleConfig.locales[''] = {
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        amDesignator: 'AM',
        pmDesignator: 'PM'
    }
}
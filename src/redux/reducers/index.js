import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import UserProfileReducer from "./UserProfileReducer";
import ToastReducer from "./ToastReducer";
import TabBarReducer from './TabBarReducer'
import FavoriteLocationReducer from "./FavoriteLocationReducer";
import InternetReducer from "./InternetReducer";
import DeviceReducer from "./DeviceReducer";
import CountryStateCityReducer from "./CountryStateCityReducer"
import HomeReducer from "./HomeReducer"
import SlugReducer from "./SlugReducer"
import JournalReducer from "./JournalReducer"
import OnBoardingReducer from "./OnBoardingReducer";
import HuntingDetailReducer from './HuntingDetailReducer';
import GeneralReducer from './GeneralReducer';
import SubscriptionReducer from "./SubscriptionReducer";
const appReducer = combineReducers({
    TabBar: TabBarReducer,
    auth: AuthReducer,
    profile: UserProfileReducer,
    toast: ToastReducer,
    favoriteLocation: FavoriteLocationReducer,
    InternetConnection: InternetReducer,
    device: DeviceReducer,
    country: CountryStateCityReducer,
    home: HomeReducer,
    hunt: HuntingDetailReducer,
    slug: SlugReducer,
    journal: JournalReducer,
    onBoard: OnBoardingReducer,
    general: GeneralReducer,
    acknowledgeSubscription: SubscriptionReducer
})

export default appReducer;
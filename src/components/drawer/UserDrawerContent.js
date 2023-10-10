import * as React from "react"
import DashboardMenu from "../../view/shared/DashboardMenu"
import { FlatList } from "react-native"
import { connect } from 'react-redux'
import { faClipboard, faHeadphonesAlt, faHome, faInfoCircle, faLock, faQuestionCircle, faUser, faUserShield } from "@fortawesome/free-solid-svg-icons"
import { RouteNames } from "../../constants/RouteNames"
import { SOCIALITE_PROVIDERS } from "../../constants/Enum"


const UserDrawerContent = (props) => {
    const { user } = props;
    const data = [
        {
            index: 1,
            navigationScreenName: RouteNames.User.TabNavigator,
            heading: "Home",
            iconName: faHome,
        },
        {
            index: 2,
            navigationScreenName: RouteNames.User.MyProfile,
            heading: "My Profile",
            iconName: faUser,
        },
        {
            index: 3,
            navigationScreenName: RouteNames.User.TermsAndConditions,
            heading: "Terms & Condition",
            iconName: faInfoCircle,
        },
        {
            index: 4,
            navigationScreenName: RouteNames.User.Contact,
            heading: "Contact Us",
            iconName: faHeadphonesAlt,
        },
        {
            index: 5,
            navigationScreenName: RouteNames.User.ChangePasswordDrawer,
            heading: "Change Password",
            iconName: faLock,
            hide: SOCIALITE_PROVIDERS[user?.personal?.socialite_provider_name]
        },
        {
            index: 6,
            navigationScreenName: RouteNames.User.FAQ,
            heading: "FAQs",
            iconName: faQuestionCircle,
        },
        {
            index: 7,
            navigationScreenName: RouteNames.User.SubscriptionDrawer,
            heading: "Subscription",
            iconName: faClipboard,
        },
        {
            index: 8,
            navigationScreenName: RouteNames.User.PrivacyPolicy,
            heading: "Privacy Policy",
            iconName: faUserShield,
        },


    ]
    const renderItem = ({ item }) => {
        let val = item;
        return (
            <DashboardMenu
                index={val.index}
                navigationScreenName={val.navigationScreenName}
                iconName={val.iconName}
                heading={val.heading}
                navigation={props.navigation}
                params={val.params}
                iconColor={val.iconColor}
                hide={val.hide}
            />
        )
    }
    return (
        <>
            <FlatList
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                data={data}
                renderItem={renderItem}
                nestedScrollEnabled={true}
            />
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        user: state.auth.user,

    }
}
export default connect(mapStateToProps, null)(UserDrawerContent)
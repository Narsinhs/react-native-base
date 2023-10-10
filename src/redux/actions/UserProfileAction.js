import { LOGIN_SUCCESS } from ".";
import { fetchUtil } from "../../utils/FetchUtils";
import { getToken } from "../../utils/TokenUtil";

export const UPDATE_USER_INFO_SUCCESS = "UPDATE_USER_INFO_SUCCESS";
export const GET_USER_INFO_SUCCESS = "GET_USER_INFO_SUCCESS";
export const UPDATE_USER_INFO_FAIL = "UPDATE_USER_INFO_FAIL";

export const  UserProfileSaveApi = (obj) => (dispatch, getState) => {
    let body=JSON.stringify(obj)
     return fetchUtil({
         url: "/user/setting/save",
         method: `POST`,
         body,
         token:getToken(),
         showToast: true
     }).then((response) => {
         if (response.status===200) {
            let user = response.data.user
            let token = response.data.token
            dispatch({ type: LOGIN_SUCCESS, payload: { user, token } });
             return Promise.resolve(response.message);
         } else {
             return Promise.reject(response.error);
         }
     }).catch((err) => {
         console.log(err,"errUserProfileSaveApi")
         return Promise.reject(err);
     })
 }


 export const  UserChangePassword = (obj) => (dispatch, getState) => {
    let body=JSON.stringify(obj)
     return fetchUtil({
         url: "/user/change-password",
         method: `POST`,
         body,
         token:getToken(),
         showToast: true
     }).then((response) => {
         if (response.status===200) {
             return Promise.resolve(response.message);
         } else {
             return Promise.reject(response.error);
         }
     }).catch((err) => {
         console.log(err,"errUserChangePassword")
         return Promise.reject(err);
     })
 }



                 //ME API 
//  export const  userProfileInfoApi = (obj) => (dispatch, getState) => {
//     let body=JSON.stringify(obj)
//      return fetchUtil({
//          url: "/user/info",
//          method: `GET`,
//          body,
//          showToast: true
//      }).then((response) => {
//          if (response.success) {
//              let user = response?.data?.user;
//              let token = response?.data?.access_token;
//              // dispatch({ type: LOGIN_SUCCESS, payload: { role, user, token } });
//              return Promise.resolve(response.data.user);
//          } else {
//              return Promise.reject(response.error);
//          }
//      }).catch((err) => {
//          console.log(err,"err")
//          return Promise.reject(err);
//      })
//  }
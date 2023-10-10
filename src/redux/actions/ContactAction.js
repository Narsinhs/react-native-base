import { fetchUtil } from "../../utils/FetchUtils";
import { getToken } from "../../utils/TokenUtil";


export const CONTACT_SUCCESS = "CONTACT_SUCCESS";

export const ContactFormApi = (obj) => (dispatch, getState) => {
    let body=JSON.stringify(obj)
     return fetchUtil({
         url: "/contact-form/save",
         method: `POST`,
         body,
         showToast: true,
         token:getToken()
     }).then((response) => {
        if (response.status===200) {
             return Promise.resolve(response);
         } else {
             return Promise.reject(response.error);
         }
     }).catch((err) => {
         console.log(err,"errContactFormApi")
         return Promise.reject(err);
     })
}
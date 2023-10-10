import { fetchUtil } from "../../utils/FetchUtils";
import { getToken } from "../../utils/TokenUtil";

export const SLUG_SUCCESS="SLUG_SUCCESS"
export const GetSlugPages = () => (dispatch, getState) => {
    return fetchUtil({
        url: `/global/settings/`,
        method: `GET`
    }).then((response) => {
        if (response.status === 200) {
            let allSlug = response?.data?.site_pages
            dispatch({ type: SLUG_SUCCESS, payload: allSlug });
            return Promise.resolve(allSlug);
        }
        else {
            return Promise.reject(response.message);
        }
    }).catch((err) => {
        return Promise.reject(err);
    })
}
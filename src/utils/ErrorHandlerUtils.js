import { registerToastMessage } from "./RegisterToast";
export const handleFetchError = async (res, showToast) => {
    let data = (await res.json());
    if (data.status != 200 && showToast) {
        let error = data?.error;

        if (typeof (error) === 'string' && error) {
            registerToastMessage(error, false)
        }
        else if (!error && data?.message) {
            registerToastMessage(data?.message, false)
        }
        else {
            for (const item in error) {
                registerToastMessage(error[item], false)
            }
        }
        return data;
    } else if (data.status === 200 && showToast) {
        if (data?.message && typeof data?.message === 'string') {
            registerToastMessage(data?.message, true)
        }
        return data
    } else if (showToast) {
        registerToastMessage("Something went wrong!", false)
        throw data
    }
    return data
};

import { showToastWithMessage } from "../redux/actions";
import { store } from "../redux/Store"
export const registerToastMessage = (message,success) => {
    setTimeout(() =>  {
        try {
            store.dispatch(showToastWithMessage({
                visible: true,
                message: message,
                success:success
            
            }))
        }catch(e) {
            console.log("toast error", e)
        }
    },100)
}
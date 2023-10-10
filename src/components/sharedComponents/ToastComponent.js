import React, { useEffect, useRef } from 'react';
import { connect } from "react-redux"
import { showToastWithMessage } from '../../redux/actions';
import Toast,{SuccessToast,ErrorToast} from 'react-native-toast-message';
import { store } from '../../redux/Store';
import { fontFamily, fontH2, fontH2V2 } from '../../constants/Styles';
const ToastComponent = (props) => {
    const toastRef = useRef(null)
    let { toast } = props;
    useEffect(() => {
        if (toast?.visible) {
            store.dispatch(showToastWithMessage({
                visible: false,
                message: '',
                success:null
            }))
            toastRef.current.show({text2:toast.message,type:toast.success===true?"success":"error"});
        }
    }, [toast?.visible])
    const toastConfig = {
        success: (props) => (
          <SuccessToast
            {...props}
            style={{ borderLeftColor: 'green' }}
            text2Style={{
              fontSize: fontH2V2,
              fontWeight:'bold',color:'black'
            }}
            onTrailingIconPress={() => toastRef.current.hide()}
          />
        ),
        
        error: (props) => (
            <ErrorToast
              {...props}
              style={{ borderLeftColor: 'red' }}
              text2Style={{
                fontSize: fontH2V2,
                fontWeight:'bold',color:'black'
              }}
              onTrailingIconPress={() => toastRef.current.hide()}
            />
          ),
      
      };
    return (
        <Toast
            ref={toastRef}
            position={"top"}
            config={toastConfig}
        />
    )
}
const mapStateToProps = (state) => {
    return {
        toast: state.toast.toastData
    }
}
export default connect(mapStateToProps, null)(ToastComponent)

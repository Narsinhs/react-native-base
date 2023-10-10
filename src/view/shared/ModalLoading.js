import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Modal from 'react-native-modal'
import { primaryColor } from '../../constants/Styles';
const ModalLoading = ({ loading }) => {
  return (
    <Modal isVisible={loading} animationIn={'fadeIn'} animationOut={'fadeOut'}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} color={primaryColor} />
      </View>
    </Modal>
  )
}

export default ModalLoading
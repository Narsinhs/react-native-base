/**
 * @prettier
 * @flow
 * */

import React from 'react'
import { requireNativeComponent, Text } from 'react-native'
import { Picker } from '@react-native-picker/picker';




export default class WheelPicker extends React.Component {
  static defaultProps = {
    style: {
      width: 200,
      height: 150,
    },
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedItem: props.selectedItem
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedItem !== this.props.selectedItem) {
      this.setState({ selectedItem: this.props.selectedItem })
    }
  }

  onItemSelected = (value, index) => {
    if (this.props.onItemSelected) {
      this.props.onItemSelected(index)
    }
    this.setState({ selectedItem: index })
  }

  render() {
    const data = this.props.data
    if (!data || !data.length < 0) return null
    return (
      <Picker
        {...this.props}
        selectedValue={data[this.state.selectedItem]}
        onValueChange={this.onItemSelected}>
        {this.props.data.map((i, index) => <Picker.Item key={index} label={i} value={i} />)}

      </Picker>
    )
  }
}

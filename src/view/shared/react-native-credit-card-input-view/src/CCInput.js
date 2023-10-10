import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewPropTypes,
  Animated,
  Platform,
  Image,
  StatusBar,
} from "react-native";
import { normalizeFont, normalizeHeight, normalizeWidth, normalizeWithScale } from "../../../../utils/FontUtil";
import { errorColor, fontFamily, fontH2V3, fontH3, fontH3V3, greyedSchemeColor, whiteColor } from "../../../../constants/Styles";
import PropTypes, { string, func, object, number } from 'prop-types';
import Tooltip from "react-native-walkthrough-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
const s = StyleSheet.create({
  baseInputStyle: {
    color: "black",
  },
});

export default class CCInput extends Component {
  static propTypes = {
    field: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,

    status: PropTypes.oneOf(["valid", "invalid", "incomplete"]),

    containerStyle: ViewPropTypes.style,
    inputStyle: Text.propTypes.style,
    labelStyle: Text.propTypes.style,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBecomeEmpty: PropTypes.func,
    onBecomeValid: PropTypes.func,
    additionalInputProps: PropTypes.shape(TextInput.propTypes),

    attrName: string,
    title: string,
    value: string,
    updateMasterState: func,
    keyboardType: string,
    titleActiveSize: number, // to control size of title when field is active
    titleInActiveSize: number, // to control size of title when field is inactive
    titleActiveColor: string, // to control color of title when field is active
    titleInactiveColor: string, // to control color of title when field is active
    textInputStyles: object,
    otherTextInputProps: object,
    autoCapitalize: string,
    readOnlyColor: string
  };

  static defaultProps = {
    label: "",
    value: "",
    status: "incomplete",
    containerStyle: {},
    inputStyle: {},
    labelStyle: {},
    onFocus: () => { },
    onChange: () => { },
    onBecomeEmpty: () => { },
    onBecomeValid: () => { },
    additionalInputProps: {},
    keyboardType: 'default',
    titleActiveSize: normalizeFont(9),
    titleInActiveSize: normalizeFont(12),
    titleActiveColor: '#1A1A1A',
    titleInactiveColor: '#1A1A1A',
    textInputStyles: {},
    otherTextInputAttributes: {},
    borderBottomWidth: normalizeWidth(0.2),
    borderBottomColor: greyedSchemeColor,
    opacity: 0.5,
    readOnlyColor: "#00000005"

  };
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.position = new Animated.Value(value ? 1 : 0);
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
    this.state = {
      isFieldActive: false,
      isSecure: true,
      isInComplete: false,
      toolTipVisible: false
    }
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }
  componentDidMount() {
    if (this?.props?.value?.length) {
      this.setState({
        ...this.state,
        isFieldActive: true
      })
    }
  }
  componentDidUpdate(prevProps) {
    const { status, value, onBecomeEmpty, onBecomeValid, field } = prevProps;
    const { status: newStatus, value: newValue } = this.props;

    if (value !== "" && newValue === "") onBecomeEmpty(field);
    if (status !== "valid" && newStatus === "valid") onBecomeValid(field);

  }

  focus = () => {
    this.refs.input.focus();
  }

  _onFocus = () => {
    this.setState({
      isInComplete: false
    })
    this.props.onFocus(this.props.field);
    if (!this.state.isFieldActive) {
      this.setState({ isFieldActive: true });
      Animated.timing(this.position, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false
      }).start();
    }
  }


  _onChange = value => {
    this.props.onChange(this.props.field, value);
  }



  _returnAnimatedTitleStyles = () => {
    const { isFieldActive } = this.state;
    const {
      titleActiveColor, titleInactiveColor, titleActiveSize, titleInActiveSize, error
    } = this.props;
    return {
      top: this.position.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 0],
      }),
      fontSize: isFieldActive ? titleActiveSize : titleInActiveSize,
      color: isFieldActive ? titleActiveColor : titleInactiveColor,
      opacity: this.props.opacity
    }
  }
  _handleBlur = () => {
    if (this.props.status === 'incomplete') {
      this.setState({
        isInComplete: true
      })
    }
    if (this.state.isFieldActive && !this.props.value) {
      this.setState({ isFieldActive: false });
      Animated.timing(this.position, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false
      }).start();
    }
  }
  hasError = () => {
    return ((this.props.status !== "incomplete" && this.props.status === "invalid") || this.state.isInComplete) || this.props.error
  }

  handlePress = () => {
    this.setState({
      ...this.state,
      toolTipVisible: true
    })
  }

  render() {
    const { label, value, placeholder, status, keyboardType,
      containerStyle, inputStyle, labelStyle,
      validColor, invalidColor, placeholderColor,
      additionalInputProps, customStyles = {} } = this.props;
    return (
      <View style={{ ...Styles.container, justifyContent: 'center', borderColor: ((status !== "incomplete" && status === "invalid") || this.state.isInComplete || this.props.error) ? errorColor : 'white' }} onPress={this.focus}>
        <View style={{ ...Styles.textInputContainer, flexDirection: 'row', alignItems: 'center', paddingRight: normalizeWidth(5) }}>
          <TouchableOpacity style={{ width: "80%", ...{ backgroundColor: this.props.readOnly ? this.props.readOnlyColor : null } }}>
            <TextInput
              ref="input"
              name={this.props.attrName}
              placeholder={placeholder}
              value={value}
              style={{ ...Styles.inputContainer, color: 'white' }}
              placeholderStyle={{ fontFamily: fontFamily.Primary.Italic }}
              placeholderTextColor={((status !== "incomplete" && status === "invalid") || this.state.isInComplete || this.props.error) ? errorColor : whiteColor}
              autoCapitalise="words"
              autoCorrect={false}
              underlineColorAndroid="transparent"
              onFocus={this.props.simpleInput ? this._handleSimpleInputFocus : this._handleFocus}
              onBlur={this._handleBlur}
              editable={this.props.readOnly ? false : true}
              onChangeText={this._onChange}
              keyboardType={this.props.keyboardType}
              selectionColor={whiteColor}
              {...this.props.otherTextInputProps}
              onFocus={this._onFocus}
              maxLength={this.props.maxLength}
              multiline={this.props.multiline}
            />
          </TouchableOpacity>


          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            {((status !== "incomplete" && status === "invalid") || this.state.isInComplete || this.props.error) ?
              <View style={{ ...Styles.toolTipContainer }}>
                <Tooltip
                  isVisible={this.state.toolTipVisible}
                  content={<Text style={Styles.errorText}>{((status !== "incomplete" && status === "invalid") || this.state.isInComplete) ? `Invalid ${placeholder}` : this.props.error}</Text>}
                  placement="top"
                  onClose={() => {
                    this.setState({
                      ...this.state,
                      toolTipVisible: false
                    })
                  }}
                  topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                  backgroundColor={'transparent'}
                >
                  <TouchableOpacity onPress={this.handlePress}>
                    <FontAwesomeIcon size={normalizeWithScale(20)} color={errorColor} icon={faExclamationTriangle} />
                  </TouchableOpacity>
                </Tooltip>

              </View>
              : <></>
            }
          </View>
          {
            this.props.source &&
            <Image source={this.props.source} resizeMode="contain" style={{ marginRight: normalizeWidth(10), width: normalizeWidth(25), height: normalizeHeight(25), justifyContent: 'center', ...customStyles }} />

          }
        </View>
      </View>



    );
  }
}

const Styles = StyleSheet.create({
  container: {
    borderWidth: normalizeWidth(1),
    // padding: normalizeWidth(5),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: normalizeWidth(25),
    height: normalizeHeight(50),
    marginBottom: normalizeHeight(20)
  },
  inputContainer: {
    marginLeft: normalizeWidth(10),
    borderWidth: 0,
    borderColor: 'white',
    fontFamily: fontFamily.Primary.Regular,
    fontSize: fontH2V3,
  },
  toolTipContainer: {
    alignItems: 'center',
    marginRight: normalizeWidth(5)
  },
  errorText: {
    textAlign: 'center',
    fontSize: fontH3V3,
    color: errorColor,
    fontFamily: fontFamily.Primary.Regular,
  },
  textInputContainer: {
    borderRadius: normalizeWidth(3),
    borderStyle: 'solid',
    marginVertical: normalizeHeight(0),
  },
  textInput: {
    fontSize: fontH3,
    textAlignVertical: 'bottom',
    paddingVertical: normalizeHeight(5),
    paddingTop: normalizeHeight(15),
    // marginTop: Platform.OS === "ios" ? normalizeWidth(12) : null,
    fontFamily: fontFamily.Primary.Medium,
    color: '#1A1A1A',
    borderBottomWidth: normalizeWidth(0.2),
    borderBottomColor: greyedSchemeColor,
    textDecorationLine: 'none',
    color: "white"
  },
  titleStyles: {
    position: 'absolute',
    fontFamily: fontFamily.Primary.SemiBold,
    left: Platform.OS === 'android' ? normalizeWidth(4) : null,
    color: greyedSchemeColor
  }
})
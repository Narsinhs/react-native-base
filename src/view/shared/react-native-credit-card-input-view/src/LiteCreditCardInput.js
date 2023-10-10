import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

import Icons from "./Icons";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";
import { normalizeHeight, normalizeWidth } from "../../../../utils/FontUtil";

const INFINITE_WIDTH = 1000;

const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: normalizeWidth(35),
    height: normalizeHeight(35)
  },
  expanded: {
    flex: 1,
  },
  hidden: {
    width: 0,
  },
  leftPart: {
  },
  rightPart: {
    overflow: "hidden",
    flexDirection: "row",
  },
  last4: {
    flex: 1,
    justifyContent: "center",
  },
  numberInput: {
    width: INFINITE_WIDTH,
  },
  expiryInput: {
    width: 80,
  },
  cvcInput: {
    width: 80,
  },
  last4Input: {
    width: 60,
    marginLeft: 20,
  },
  last4InputHiddenView: {
    width: 20,
  },
  input: {
    height: 40,
    color: "black",
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class LiteCreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,

    placeholders: PropTypes.object,

    inputStyle: Text.propTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,
    showLast4: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    placeholders: {
      number: "Card Number",
      expiry: "Valid till MM/YY",
      cvc: "CVV",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    showLast4: true,
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentDidUpdate(prevProps) {
    if (prevProps.focused !== this.props.focused) this._focus(this.props.focused);
  }

  _focusNumber = () => this._focus("number");
  _focusExpiry = () => this._focus("expiry");

  _focus = field => {
    if (!field) return;
    this.refs[field].focus();
    LayoutAnimation.easeInEaseOut();
  }

  _inputProps = field => {
    const {
      inputStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputProps: additionalInputsProps[field],
    };
  };

  _iconToShow = () => {
    const { focused, values: { type } } = this.props;
    if (focused === "cvc" && type === "american-express") {
      return "cvc_amex";
    }
    if (type) {
      return type
    }
    return "placeholder";
  }

  _cvciconToShow = () => {
    const { focused, values: { type } } = this.props;
    if (focused === "cvc" && type === "american-express") {
      return "cvc_amex";
    }
    return "cvc"
  }

  render() {
    const {
      focused,
      values: { number },
      inputStyle,
      showLast4,
      status: {
        number: numberStatus
      },
      errors,
      touched
    } = this.props;
    const showRightPart = focused && focused !== "number";
    return (
      <ScrollView scrollEnabled={false}>
        <View style={s.container}>
          <View style={[
            // s.leftPart,
            s.expanded,
          ]}>
            <CCInput
              {...this._inputProps("number")}
              keyboardType="numeric"
              containerStyle={s.numberInput}
              source={Icons[this._iconToShow()]}
              error={touched?.CardNumber && errors?.CardNumber ? errors?.CardNumber : null}
            />
            <CCInput
              {...this._inputProps("expiry")}
              keyboardType="numeric"
              error={touched?.Expiry && errors?.Expiry ? errors?.Expiry : null}
              source={Icons['cardBack']}
            />
            <CCInput
              {...this._inputProps("cvc")}
              keyboardType="numeric"
              error={touched?.CVV && errors?.CVV ? errors?.CVV : null}
              source={Icons[this._cvciconToShow()]}
            />
          </View>
        </View >
      </ScrollView>
    );
  }
}

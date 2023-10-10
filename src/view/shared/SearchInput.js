import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { normalizeHeight, normalizeWidth } from '../../utils/FontUtil';
import { blackColor, fontFamily, fontH2, fontH2V2, fontH3, grey, primaryColor } from '../../constants/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const SearchInput = ({
    handleTextChange,
    searchInputValue,
    placeholder = 'Search'
}) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInputContainer}
                onChangeText={handleTextChange}
                value={searchInputValue}
                placeholder={placeholder}
                placeholderTextColor={grey}
                selectionColor={primaryColor}

            />
            <View style={{ flex: 1 }}>
                {
                    searchInputValue && searchInputValue.length > 0 ?
                        <TouchableOpacity >
                            <FontAwesomeIcon icon={faTimes} color={primaryColor} style={{ padding: normalizeWidth(7) }} />
                        </TouchableOpacity>
                        :
                        <FontAwesomeIcon icon={faSearch} color={primaryColor} style={{ padding: normalizeWidth(7) }} />
                }
            </View>
        </View>
    );
};

export default SearchInput;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: normalizeWidth(10),
        borderWidth: normalizeWidth(1),
        borderColor: grey,
        marginBottom: normalizeHeight(10)
    },
    textInputContainer: {
        flex: 9,
        paddingHorizontal: normalizeWidth(10),
        paddingVertical: normalizeHeight(10),
        fontFamily: fontFamily.Primary.Regular,
        fontSize: fontH2V2,
        color: blackColor,
        justifyContent: 'center',
        alignItems: 'center',
        includeFontPadding: false
    }
});

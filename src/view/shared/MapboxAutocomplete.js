import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    TextInput,
    View,
    FlatList,
    Image,
    Text,
    StyleSheet,
    Dimensions,
    Platform,
    ActivityIndicator,
    PixelRatio,
    TouchableOpacity
} from 'react-native';
import Qs from 'qs';
import debounce from 'lodash.debounce';
import { MapBoxApiKeyToken } from '../../constants/constants';
import { blackColor, fontFamily, primaryColor, whiteColor } from '../../constants/Styles';
import { cross } from '../../assets/images';
import { normalizeHeight, normalizeWidth } from '../../utils/FontUtil';
import { Loading } from './Loading';

const WINDOW = Dimensions.get('window');

const defaultStyles = {
    container: {
        marginTop: 2,
    },
    textInputContainer: {
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: normalizeWidth(10),
        borderColor: blackColor,
    },
    textInput: {
        backgroundColor: primaryColor,
        paddingTop: 4.5,
        paddingBottom: 4.5,
        // paddingLeft: 15,
        paddingRight: 10,
        marginLeft: 8,
        marginRight: 8,
        width: '80%',
        fontSize: 14,
        fontFamily: fontFamily.Primary.Regular,
        flex: 1,
        color: whiteColor
    },
    poweredContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    powered: {},
    listView: {
        backgroundColor: whiteColor,
        borderRadius: 10,
        height: normalizeHeight(100),
        width: '93%',
        marginLeft: normalizeWidth(25),
        marginRight: normalizeWidth(15),
        marginTop: normalizeHeight(5),
        zIndex: 1,
    },
    row: {
        padding: 13,
        height: 44,
        flexDirection: 'row',
        borderRadius: 10,
        flex: 1
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#c8c7cc',
    },
    administrative: {},
    loader: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 20,
    },
    androidLoader: {
        marginRight: -15,
    },
};

class MapboxAutocomplete extends Component {
    _isMounted = false;
    _results = [];
    _requests = [];

    constructor(props) {
        super(props);
        this.state = this.getInitialState.call(this);
    }

    getInitialState = () => ({
        text: '',
        textStatus: 'untouched',
        dataSource: this.buildRowsFromResults([]),
        listViewDisplayed: this.props.listViewDisplayed === 'auto' ? false : this.props.listViewDisplayed,
        isFetching: false
    })

    setAddressText = address => this.setState({ text: address })

    getAddressText = () => this.state.text

    buildRowsFromResults = (results) => {
        let res = [];
        if (results.length === 0 || this.props.predefinedPlacesAlwaysVisible === true) {
            res = [...this.props.predefinedPlaces];

            if (this.props.currentLocation === true) {
                res.unshift({
                    administrative: this.props.currentLocationLabel,
                    isCurrentLocation: true,
                });
            }
        }

        res = res.map(place => ({
            ...place,
            isPredefinedPlace: true
        }));

        return [...res, ...results];
    }

    componentWillMount() {
        this._request = this.props.debounce
            ? debounce(this._request, this.props.debounce)
            : this._request;
    }

    componentDidMount() {
        // This will load the default value's search results after the view has
        // been rendered
        this._isMounted = true;
        this._onChangeText(this.state.text);
    }

    componentWillReceiveProps(props) {
        const { isSelectedFromMap, selectedMapLocation } = props;
        if (isSelectedFromMap) {
            this.setState({
                text: selectedMapLocation,
                listViewDisplayed: false
            })
        }
        // if (nextProps.listViewDisplayed !== 'auto') {
        //     this.setState({
        //         listViewDisplayed: nextProps.listViewDisplayed,
        //     });
        // }

        // if (typeof (nextProps.text) !== "undefined" && this.state.text !== nextProps.text) {
        //     this.setState({
        //         listViewDisplayed: true
        //     }, this._handleChangeText(nextProps.text));
        // }
    }

    componentWillUnmount() {
        this._abortRequests();
        this._isMounted = false;
    }

    _abortRequests = () => {
        this._requests.map(i => i.abort());
        this._requests = [];
    }

    /**
     * This method is exposed to parent components to focus on textInput manually.
     * @public
     */
    triggerFocus = () => {
        if (this.refs.textInput) this.refs.textInput.focus();
    }

    /**
     * This method is exposed to parent components to blur textInput manually.
     * @public
     */
    triggerBlur = () => {
        if (this.refs.textInput) this.refs.textInput.blur();
    }

    getCurrentLocation = () => {
        let options = {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 1000
        };

        if (this.props.enableHighAccuracyLocation && Platform.OS === 'android') {
            options = {
                enableHighAccuracy: true,
                timeout: 20000
            }
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (this.props.nearbyPlacesAPI === 'None') {
                    let currentLocation = {
                        administrative: this.props.currentLocationLabel,
                        geometry: {
                            location: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }
                        }
                    };

                    this._disableRowLoaders();
                    this.props.onPress(currentLocation, currentLocation);
                } else {
                    this._requestNearby(position.coords.latitude, position.coords.longitude);
                }
            },
            (error) => {
                this._disableRowLoaders();
                alert(error.message);
            },
            options
        );
    }

    _onPress = (rowData) => {
        // this.props.geo_loc(rowData.center);
        // this.props.stringLoc(rowData.text);

        let firstRowLine = rowData.text;
        if (rowData.address) {
            firstRowLine = `${rowData.address} ${rowData.text}`
        }
        this.setState({
            text: firstRowLine,
            listViewDisplayed: false,
        });
        this.triggerBlur();
        this.props.onMapPress(rowData)

        // hamara custom function chalegha
        // if (rowData.isPredefinedPlace !== true && this.props.fetchDetails === true) {
        //     if (rowData.isLoading === true) {
        //         // already requesting
        //         return;
        //     }

        //     this._abortRequests();

        //     // display loader
        //     // this._enableRowLoader(rowData);


        //     // fetch details
        //     const request = new XMLHttpRequest();
        //     this._requests.push(request);
        //     request.timeout = this.props.timeout;
        //     request.ontimeout = this.props.onTimeout;
        //     request.onreadystatechange = () => {
        //         if (request.readyState !== 4) return;

        //         if (request.status === 200) {
        //             const responseJSON = JSON.parse(request.responseText);

        //             if (responseJSON.status === 'OK') {
        //                 if (this._isMounted === true) {
        //                     const details = responseJSON.result;
        //                     this._disableRowLoaders();
        //                     this._onBlur();

        //                     this.setState({
        //                         text: this._renderDescription(rowData.text),
        //                     });

        //                     delete rowData.isLoading;
        //                     this.props.onPress(rowData, details);
        //                 }
        //             } else {
        //                 this._disableRowLoaders();

        //                 if (this.props.autoFillOnNotFound) {
        //                     this.setState({
        //                         text: this._renderDescription(rowData.text)
        //                     });
        //                     delete rowData.isLoading;
        //                 }

        //                 if (!this.props.onNotFound) {
        //                     console.warn('google places autocomplete: ' + responseJSON.status);
        //                 } else {
        //                     this.props.onNotFound(responseJSON);
        //                 }
        //             }
        //         } else {
        //             this._disableRowLoaders();

        //             if (!this.props.onFail) {
        //                 console.warn(
        //                     'google places autocomplete: request could not be completed or has been aborted'
        //                 );
        //             } else {
        //                 this.props.onFail();
        //             }
        //         }
        //     };

        //     request.open('GET', 'https://maps.googleapis.com/maps/api/place/details/json?' + Qs.stringify({
        //         key: this.props.query.key,
        //         placeid: rowData.place_id,
        //         language: this.props.query.language,
        //     }));

        //     if (this.props.query.origin !== null) {
        //         request.setRequestHeader('Referer', this.props.query.origin)
        //     }

        //     request.send();
        // } else if (rowData.isCurrentLocation === true) {
        //     // display loader
        //     this._enableRowLoader(rowData);

        //     this.setState({
        //         text: this._renderDescription(rowData),
        //     });

        //     this.triggerBlur(); // hide keyboard but not the results
        //     delete rowData.isLoading;
        //     this.getCurrentLocation();

        // } else {
        //     this.setState({
        //         text: this._renderDescription(rowData),
        //     });

        //     this._onBlur();
        //     delete rowData.isLoading;
        //     let predefinedPlace = this._getPredefinedPlace(rowData);

        //     // sending predefinedPlace as details for predefined places
        //     this.props.onPress(predefinedPlace, predefinedPlace);
        // }
    }

    _enableRowLoader = (rowData) => {
        let rows = this.buildRowsFromResults(this._results);
        for (let i = 0; i < rows.length; i++) {
            if ((rows[i].place_id === rowData.place_id) || (rows[i].isCurrentLocation === true && rowData.isCurrentLocation === true)) {
                rows[i].isLoading = true;
                this.setState({
                    dataSource: rows,
                });
                break;
            }
        }
    }

    _disableRowLoaders = () => {
        if (this._isMounted === true) {
            for (let i = 0; i < this._results.length; i++) {
                if (this._results[i].isLoading === true) {
                    this._results[i].isLoading = false;
                }
            }

            this.setState({
                dataSource: this.buildRowsFromResults(this._results),
            });
        }
    }

    _getPredefinedPlace = (rowData) => {
        if (rowData.isPredefinedPlace !== true) {
            return rowData;
        }

        for (let i = 0; i < this.props.predefinedPlaces.length; i++) {
            if (this.props.predefinedPlaces[i].locale_names.default === rowData.locale_names.default) {
                return this.props.predefinedPlaces[i];
            }
        }

        return rowData;
    }

    _filterResultsByTypes = (responseJSON, types) => {
        if (types.length === 0) return responseJSON.results;

        var results = [];
        for (let i = 0; i < responseJSON.results.length; i++) {
            let found = false;

            for (let j = 0; j < types.length; j++) {
                if (responseJSON.results[i].types.indexOf(types[j]) !== -1) {
                    found = true;
                    break;
                }
            }

            if (found === true) {
                results.push(responseJSON.results[i]);
            }
        }
        return results;
    }

    _requestNearby = (latitude, longitude) => {
        this._abortRequests();

        if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }

                if (request.status === 200) {
                    const responseJSON = JSON.parse(request.responseText);

                    this._disableRowLoaders();

                    if (typeof responseJSON.results !== 'undefined') {
                        if (this._isMounted === true) {
                            var results = [];
                            if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                                results = this._filterResultsByTypes(responseJSON, this.props.filterReverseGeocodingByTypes);
                            } else {
                                results = responseJSON.results;
                            }

                            this.setState({
                                dataSource: this.buildRowsFromResults(results),
                            });
                        }
                    }
                    if (typeof responseJSON.error_message !== 'undefined') {
                        console.warn('google places autocomplete: ' + responseJSON.error_message);
                    }
                } else {
                    // console.warn("google places autocomplete: request could not be completed or has been aborted");
                }
            };

            let url = '';
            if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                // your key must be allowed to use Google Maps Geocoding API
                url = 'https://maps.googleapis.com/maps/api/geocode/json?' + Qs.stringify({
                    latlng: latitude + ',' + longitude,
                    key: this.props.query.key,
                    ...this.props.GoogleReverseGeocodingQuery,
                });
            } else {
                url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' + Qs.stringify({
                    location: latitude + ',' + longitude,
                    key: this.props.query.key,
                    ...this.props.GooglePlacesSearchQuery,
                });
            }

            request.open('GET', url);
            if (this.props.query.origin !== null) {
                request.setRequestHeader('Referer', this.props.query.origin)
            }

            request.send();
        } else {
            this._results = [];
            this.setState({
                dataSource: this.buildRowsFromResults([]),
            });
        }
    }

    _request = (text) => {
        this._abortRequests();
        if (text.length >= this.props.minLength) {
            this.setState({
                ...this.state,
                isFetching: true,
            })
            const request = new XMLHttpRequest();
            this._requests.push(request);
            request.timeout = this.props.timeout;
            request.ontimeout = this.props.onTimeout;
            request.onreadystatechange = () => {
                if (request.readyState !== 4) {
                    return;
                }

                if (request.status === 200) {
                    this.setState({
                        ...this.state,
                        isFetching: false,
                    })
                    const responseJSON = JSON.parse(request.responseText);
                    if (typeof responseJSON.features !== 'undefined') {
                        if (this._isMounted === true) {
                            this._results = responseJSON.features;
                            this.setState({
                                dataSource: this.buildRowsFromResults(responseJSON.features),
                            });
                        }
                    }
                    if (typeof responseJSON.error_message !== 'undefined') {
                        console.warn('google places autocomplete: ' + responseJSON.error_message);
                    }
                } else {
                    this.setState({
                        ...this.state,
                        isFetching: false,
                    })
                    //console.warn("mapBox places autocomplete: request could not be completed or has been aborted");
                }
            };
            let url = '';
            url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + text.split(' ').join('+') + '.json' + '?' + Qs.stringify({
                limit: 5,
                access_token: MapBoxApiKeyToken,
                bbox: this.props.bbox
            })
            request.open('GET', url);
            request.send();

        } else {
            this._results = [];
            this.setState({
                dataSource: this.buildRowsFromResults([]),

            });
        }
    }

    _onChangeText = (text) => {
        const { setIsSelectedFromMap } = this.props;
        setIsSelectedFromMap(false)
        this._request(text);
        this.setState({
            text: text,
            textStatus: 'touched',
            listViewDisplayed: true,
        });
    }

    _handleChangeText = (text) => {
        this._onChangeText(text);

        const onChangeText = this.props
            && this.props.textInputProps
            && this.props.textInputProps.onChangeText;

        if (onChangeText) {
            onChangeText(text);
        }
    }

    _getRowLoader() {
        return (
            <ActivityIndicator
                animating={true}
                size="small"
            />
        );
    }

    _renderRowData = (rowData) => {
        if (this.props.renderRow) {
            return this.props.renderRow(rowData);
        }

        let firstRowLine = rowData?.text;
        if (rowData.address) {
            firstRowLine = `${rowData?.address} ${rowData?.text}`
        }
        const secondRowLine = rowData?.context?.length ? `${rowData?.context[0]?.text}, ${rowData?.context[1]?.text}, ${rowData?.context[2]?.text}` : ''

        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>

                <Text style={[defaultStyles.administrative, this.props.styles.RowFirstLine, rowData.isPredefinedPlace ? this.props.styles.predefinedPlacesDescription : {}]}
                    numberOfLines={1}
                >
                    {this._renderDescription(firstRowLine)}
                </Text>


                <Text style={[defaultStyles.administrative, this.props.styles.RowSecondLine, rowData.isPredefinedPlace ? this.props.styles.predefinedPlacesDescription : {}]}
                    numberOfLines={1}
                >
                    {this._renderDescription(secondRowLine)}
                </Text>

            </View>
        );
    }

    _renderDescription = (rowData) => {
        if (this.props.renderDescription) {
            return this.props.renderDescription(rowData);
        }
        return rowData;
    }

    _renderLoader = (rowData) => {
        if (rowData.isLoading === true) {
            return (
                <View style={[defaultStyles.loader, this.props.styles.loader]}>
                    {this._getRowLoader()}
                </View>
            );
        }

        return null;
    }

    _renderRow = (rowData = {}, sectionID, rowID) => {
        return (
            <TouchableOpacity
                style={{ width: WINDOW.width, borderRadius: 10 }}
                onPress={() => this._onPress(rowData)}
                underlayColor={this.props.listUnderlayColor || "#c8c7cc"}
            >
                <View style={[defaultStyles.row, this.props.styles.row, rowData.isPredefinedPlace ? this.props.styles.specialItemRow : {}]}>
                    {this._renderRowData(rowData)}
                    {this._renderLoader(rowData)}
                </View>
            </TouchableOpacity>
        );
    }

    _renderSeparator = (sectionID, rowID) => {
        if (rowID == this.state.dataSource.length - 1) {
            return null
        }

        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={[defaultStyles.separator, this.props.styles.separator]} />
        );
    }

    _onBlur = () => {
        this.triggerBlur();

        this.setState({
            listViewDisplayed: false
        });
    }

    // _onFocus = () => this.setState({ listViewDisplayed: true })


    _renderLeftButton = () => {
        if (this.props.renderLeftButton) {
            return this.props.renderLeftButton()
        }
    }
    clearText = () => {
        const { setIsSelectedFromMap } = this.props;
        setIsSelectedFromMap(false)
        this.props.setConfirmButton(false)
        this.setState({
            textStatus: 'untouched',
            text: this._renderDescription(""),
        });
    }
    _renderCurrentLocation = () => {
        if (this.props.renderCurrentLocation) {
            return this.props.renderCurrentLocation()
        }
    }
    _renderClearButton = () => {
        if (this.state.text !== '') {
            return (
                <TouchableOpacity hitSlop={{ right: 20, top: 20, left: 20, bottom: 20 }} style={{ alignItems: 'center', justifyContent: 'center', marginRight: normalizeWidth(15) }} onPress={this.clearText}>
                    <Image source={cross} style={{ width: normalizeWidth(20), height: normalizeWidth(20), resizeMode: 'contain' }} />
                </TouchableOpacity>
            )
        }
        else {
            return (<></>)
        }
    }

    RenderLoading = () => {
        return (
            <>
                {
                    this.state.isFetching ?
                        <View style={{ marginTop: normalizeHeight(5) }}>
                            <Loading />
                        </View>
                        : <></>
                }
            </>
        )
    }

    _getFlatList = () => {
        const keyGenerator = () => (
            Math.random().toString(36).substr(2, 10)
        );

        if ((this.state.text !== '' || this.props.predefinedPlaces.length || this.props.currentLocation === true) && this.state.listViewDisplayed === true) {
            return (
                //I added code here
                <FlatList
                    style={[defaultStyles.listView, this.props.styles.listView]}
                    data={this.state.dataSource}
                    keyExtractor={keyGenerator}
                    extraData={[this.state.dataSource, this.props]}
                    ListHeaderComponent={this.RenderLoading}
                    ItemSeparatorComponent={this._renderSeparator}
                    renderItem={({ item }) => this._renderRow(item)}
                    {...this.props}
                />
            );
        }

        return null;
    }

    render() {
        let {
            onFocus,
            ...userProps
        } = this.props.textInputProps;
        return (
            <>
                <View
                    style={[defaultStyles.container, this.props.styles.container]}
                >
                    {!this.props.textInputHide &&
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            {this._renderLeftButton()}
                            <View
                                style={[defaultStyles.textInputContainer, this.props.styles.textInputContainer]}
                            >

                                <TextInput
                                    ref="textInput"
                                    returnKeyType={this.props.returnKeyType}
                                    autoFocus={this.props.autoFocus}
                                    style={[defaultStyles.textInput, this.props.styles.textInput]}
                                    value={this.state.text}
                                    placeholder={this.props.placeholder}
                                    autoCorrect={false}
                                    placeholderTextColor={this.props.placeholderTextColor}
                                    onFocus={onFocus ? () => { this._onFocus(); onFocus() } : this._onFocus}
                                    underlineColorAndroid={this.props.underlineColorAndroid}
                                    {...userProps}
                                    onChangeText={this._handleChangeText}
                                    selectionColor={whiteColor}
                                />
                                {this._renderClearButton()}
                                {this._renderCurrentLocation()}
                            </View>
                        </View>
                    }
                    {this._getFlatList()}
                    {this.props.children}
                </View>
            </>
        );
    }
}

MapboxAutocomplete.propTypes = {
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    underlineColorAndroid: PropTypes.string,
    returnKeyType: PropTypes.string,
    onPress: PropTypes.func,
    onMapPress: PropTypes.func,
    onNotFound: PropTypes.func,
    onFail: PropTypes.func,
    minLength: PropTypes.number,
    fetchDetails: PropTypes.bool,
    autoFocus: PropTypes.bool,
    autoFillOnNotFound: PropTypes.bool,
    setConfirmButton: PropTypes.func,
    getDefaultValue: PropTypes.func,
    timeout: PropTypes.number,
    onTimeout: PropTypes.func,
    query: PropTypes.object,
    GoogleReverseGeocodingQuery: PropTypes.object,
    GooglePlacesSearchQuery: PropTypes.object,
    styles: PropTypes.object,
    textInputProps: PropTypes.object,
    enablePoweredByContainer: PropTypes.bool,
    predefinedPlaces: PropTypes.array,
    currentLocation: PropTypes.bool,
    currentLocationLabel: PropTypes.string,
    nearbyPlacesAPI: PropTypes.string,
    enableHighAccuracyLocation: PropTypes.bool,
    filterReverseGeocodingByTypes: PropTypes.array,
    predefinedPlacesAlwaysVisible: PropTypes.bool,
    enableEmptySections: PropTypes.bool,
    renderDescription: PropTypes.func,
    renderRow: PropTypes.func,
    renderLeftButton: PropTypes.func,
    renderCurrentLocation: PropTypes.func,
    listUnderlayColor: PropTypes.string,
    debounce: PropTypes.number,
    isRowScrollable: PropTypes.bool,
    text: PropTypes.string,
    textInputHide: PropTypes.bool,
    accessToken: PropTypes.string
}
MapboxAutocomplete.defaultProps = {
    placeholder: 'Search',
    placeholderTextColor: 'white',
    isRowScrollable: true,
    underlineColorAndroid: 'transparent',
    returnKeyType: 'default',
    onPress: () => { },
    onMapPress: () => { },
    onNotFound: () => { },
    onFail: () => { },
    minLength: 0,
    fetchDetails: false,
    autoFocus: false,
    autoFillOnNotFound: false,
    setConfirmButton: () => { },
    keyboardShouldPersistTaps: 'always',
    getDefaultValue: () => '',
    timeout: 20000,
    onTimeout: () => console.warn('google places autocomplete: request timeout'),
    query: {
        key: 'missing api key',
        language: 'en',
        types: 'geocode',
    },
    GoogleReverseGeocodingQuery: {},
    GooglePlacesSearchQuery: {

    },
    styles: {},
    textInputProps: {},
    enablePoweredByContainer: true,
    predefinedPlaces: [],
    currentLocation: false,
    currentLocationLabel: 'Current location',
    nearbyPlacesAPI: 'GooglePlacesSearch',
    enableHighAccuracyLocation: true,
    filterReverseGeocodingByTypes: [],
    predefinedPlacesAlwaysVisible: false,
    enableEmptySections: true,
    listViewDisplayed: 'auto',
    debounce: 0,
    textInputHide: false
}

export { MapboxAutocomplete }
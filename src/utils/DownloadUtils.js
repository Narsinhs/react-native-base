import {
    Platform,
    PermissionsAndroid,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import AppConfig from "../../app.json"
import { DATE_FORMATS, formatDate } from './DateUtil';
import { registerToastMessage } from './RegisterToast';

export const downloadPDF = (pdfUri, token = null, key = 'File', downloadFileName) => {
    return new Promise(async (resolve, reject) => {
        if (Platform.OS === 'ios') {
            let downloadResponse = await downloadFile(pdfUri, token, key, downloadFileName);
            return resolve(downloadResponse)
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message: `${AppConfig.displayName} needs access to your storage to download File`
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                    let downloadResponse = await downloadFile(pdfUri, token, key, downloadFileName);
                    return resolve(downloadResponse)
                } else {
                    registerToastMessage("Storage Permission Not Granted", false)
                    return reject(false);
                }
            } catch (err) {
                registerToastMessage(`${key} Failed To Download`, false)
                return reject(false);
            }
        }
    })

}
const getFileExtention = fileUrl => {
    return /[.]/.exec(fileUrl) ?
        /[^.]+$/.exec(fileUrl) : undefined;
};
const downloadFile = (pdfUri, token, fileName, downloadFileName = Date.now()) => {
    return new Promise((resolve, reject) => {
        try {
            let FILE_URL = pdfUri;
            // let file_ext = '.pdf';
            let file_ext = getFileExtention(pdfUri);
            file_ext = '.' + file_ext[0];
            const { config, fs } = RNFetchBlob;
            let RootDir = Platform.OS === 'android' ? fs.dirs.PictureDir : fs.dirs.DocumentDir;
            let options = {}
            if (Platform.OS === 'ios') {
                options = {
                    fileCache: true,
                    path: RootDir + '/' + downloadFileName + file_ext,
                    notification: true,
                }
            }
            else {
                options = {
                    fileCache: true,
                    addAndroidDownloads: {
                        path:
                            RootDir + `/` +
                            downloadFileName +
                            file_ext,
                        description: 'downloading file...',
                        notification: true,
                        // useDownloadManager works with Android only
                        useDownloadManager: true,
                    },
                };
            }

            let headers = {}
            if (token) {
                headers = { Authorization: token };
            }
            config(options)
                .fetch('GET', FILE_URL, headers)
                .then(res => {
                    registerToastMessage(`${fileName} download successfully`, true)
                    if (Platform.OS === 'ios') {
                        RNFetchBlob.ios.openDocument(res.data);
                    }
                    return resolve(true);

                }).catch((e) => {
                    registerToastMessage(`${fileName} Failed To Download`, false)
                    return reject(false);
                })
        } catch (e) {
            registerToastMessage(`${fileName} Failed To Download`, false)
            return reject(false);
        }
    })


};
export const getFileDownloadName = (date) => {
    try {
        let fileName = `Journal Form`;
        fileName = `${fileName}-${formatDate(new Date(date), DATE_FORMATS.JOURNAL_FORMAT)}`
        return fileName
    } catch (e) {
        console.log(e)
    }
}
export const generalDownloadWithPermission = (url, format, fileName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let FILE_URL = url;
            let file_ext = format;
            const { config, fs } = RNFetchBlob;
            let RootDir = fs.dirs.PictureDir;
            let options = {
                fileCache: true,
                addAndroidDownloads: {
                    path:
                        RootDir + `/` +
                        fileName +
                        file_ext,
                    description: 'downloading file...',
                    notification: true,
                    // useDownloadManager works with Android only
                    useDownloadManager: true,
                },
            };
            let headers = {}
            config(options)
                .fetch('GET', FILE_URL, headers)
                .then(res => {
                    registerToastMessage(`${fileName} download successfully.`, true)
                    return resolve(true);
                }).catch((e) => {
                    registerToastMessage(`${fileName} Failed To Download`, false)
                    return reject(false);
                })
        } catch (e) {
            registerToastMessage(`${fileName} Failed To Download`, false)
            return reject(false);
        }
    })
}
export const generalDownload = (url, format, fileName) => {
    return new Promise(async (resolve, reject) => {
        if (Platform.OS === 'ios') {
            let downloadResponse = await generalDownloadWithPermission(url, format, fileName);
            return resolve(downloadResponse)
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message:
                            'Application needs access to your storage to download File',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                    let downloadResponse = await generalDownloadWithPermission(url, format, fileName);
                    return resolve(downloadResponse)
                } else {
                    registerToastMessage("Storage Permission Not Granted", false)
                    return reject(false);
                }
            } catch (err) {
                registerToastMessage(`${key} Failed To Download`, false)
                return reject(false);
            }
        }

    })
}
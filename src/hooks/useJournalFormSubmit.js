import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FORM_ITEM_TYPE } from "../constants/Enum";
import { DATE_FORMATS, formatDate } from "../utils/DateUtil";

const useJournalFormSubmit = (UploadImage, submitJournalForm) => {
    const navigation = useNavigation()
    const [formSubmitLoading, setFormSubmitLoading] = useState(false); // 0 , 1 , 2

    const handleSubmitJournalForm = async (apiFormObject, formSubmitCallBack) => {
        setFormSubmitLoading(1);
        const apiBody = {
            "journal_id": apiFormObject?.id,
            "journal_submitted_id": apiFormObject?.journal_submitted_id,
            "submission_date": apiFormObject?.submission_date
        }

        const transformedJournalPayload = await prepareJournalPayload(apiFormObject?.form_options_list, apiFormObject?.id);
        apiBody[`journals`] = transformedJournalPayload

        // console.log("THIS IS API BODY*********************************", apiBody)
        if (formSubmitLoading < 1) {
            setFormSubmitLoading(2);

            submitJournalForm(apiBody).then(res => {
                setTimeout(() => {
                    setFormSubmitLoading(0);
                }, 200)

                if (formSubmitCallBack) {
                    formSubmitCallBack();
                }
                return Promise.resolve(true)
            }).catch((e) => {
                setFormSubmitLoading(0);
            })
        }

    }

    const prepareJournalPayload = async (formFieldData, apiFormId) => {
        const responseArray = [];
        for (let i = 0; i < formFieldData.length; i++) {
            let eachJournalObject = await prepareSingleJournalObject(formFieldData[i], apiFormId);

            responseArray.push(eachJournalObject)

            if (formFieldData[i].childs) {
                let allChilds = [...formFieldData[i].childs];
                for (let j = 0; j < allChilds.length; j++) {

                    let eachNestedJournalObject = await prepareSingleJournalObject(allChilds[j], apiFormId);
                    responseArray.push(eachNestedJournalObject);

                }
            }
        }

        return responseArray;

    }

    const prepareSingleJournalObject = async (journalField, apiFormId) => {
        if (journalField.option_type) {
            let responseObject = {
                "journal_option_id": journalField?.id,
                "journal_option_answer_id": journalField?.journal_option_answer_id || "",
            };
            if (journalField.option_type === FORM_ITEM_TYPE.time) {
                responseObject[`option_answer`] = formatDate(journalField?.option_answer, DATE_FORMATS.TIME)
            }
            else if (journalField.option_type === FORM_ITEM_TYPE.date) {
                responseObject[`option_answer`] = formatDate(journalField?.option_answer, DATE_FORMATS.DATE)
            }
            else if (journalField.option_type !== FORM_ITEM_TYPE.file) {
                responseObject[`option_answer`] = journalField?.option_answer
            }
            else {
                // IMAGE UPLOAD LOGIC******************;
                let responseArray = [];

                await Promise.all([...journalField?.localImages].map(async each => {
                    if (each.base64) {
                        let imageUploadApiObject = {
                            journal_id: apiFormId,
                            journal_optional_id: journalField.id,
                            journal_image: each.base64
                        }
                        const apiResponse = await UploadImage(imageUploadApiObject);

                        responseArray.push(apiResponse.image_id);
                    }
                    else {
                        responseArray.push(each.id);
                    }
                })).then(() => {
                    responseArray = responseArray.join(',');
                })
                responseObject[`option_answer`] = responseArray
            }
            return responseObject
        }

    }

    return {
        handleSubmitJournalForm,
        formSubmitLoading
    }

}

export default useJournalFormSubmit


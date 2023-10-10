import { FORM_ITEM_TYPE } from "../constants/Enum";
import { transferArrayOfObjectsIntoString } from "./CommonUtil";

export const prepareJournalApiPayload = (apiFormObject, values) => {
  const deepCloneApiFormObject = { ...apiFormObject };

  const deepCloneValues = { ...values };

  const cloneFormOptionList = [...deepCloneApiFormObject.form_options_list];

  const mapFormFields = [];

  for (let i = 0; i < cloneFormOptionList.length; i++) {

    // eachFormField
    let eachFormField = { ...cloneFormOptionList[i] };
    if (eachFormField.option_type) {

      // get Value for that option type

      const eachFieldValue = deepCloneValues[`${eachFormField.id}`]
      const eachMappedParentField = getMappedValues(eachFormField, eachFieldValue);


      const mapChilds = [];
      if (eachMappedParentField?.childs?.length) {
        for (let j = 0; j < eachMappedParentField.childs.length; j++) {
          let eachChild = { ...eachMappedParentField.childs[j] };
          if (eachChild.option_type) {
            const eachChildFieldValue = deepCloneValues[`${eachChild.id}`];

            const mappedChildValue = getMappedValues(eachChild, eachChildFieldValue);

            mapChilds.push(mappedChildValue)

          }

        }
      }

      eachMappedParentField[`childs`] = mapChilds;

      mapFormFields.push(eachMappedParentField);

    }

  }
  deepCloneApiFormObject[`form_options_list`] = mapFormFields

  return Promise.resolve(deepCloneApiFormObject)
}

const getMappedValues = (field, value) => {
  let clone = { ...field };

  // text type
  if (clone.option_type === FORM_ITEM_TYPE.text || clone.option_type === FORM_ITEM_TYPE.textarea || clone.option_type === FORM_ITEM_TYPE.range) {

    clone = { ...clone, option_answer: value }

  }

  // date/ time
  else if (clone.option_type === FORM_ITEM_TYPE.date || clone.option_type === FORM_ITEM_TYPE.time) {

    clone = { ...clone, option_answer: new Date(value).toISOString() }

  }

  // checkbox / radio button
  else if (clone.option_type === FORM_ITEM_TYPE.checkbox || clone.option_type === FORM_ITEM_TYPE.radio || clone.option_type === FORM_ITEM_TYPE.api) {
    const arrayToString = transferArrayOfObjectsIntoString([...value]);
    clone = { ...clone, option_answer: arrayToString }
  }

  else if (clone.option_type === FORM_ITEM_TYPE.file) {
    clone = { ...clone, localImages: [...value] }
  }
  return clone;
}
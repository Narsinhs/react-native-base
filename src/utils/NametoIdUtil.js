export const filterNametoId = (array, value) => {
    let finalObj=0;
    array && array.filter(item => {
      if (item.name === value) {
        finalObj=item.id
      } 
    });
    return finalObj
  }

  export const filterIdtoName = (array, value) => {
    let finalObj;
    array && array.filter(item => {
      if (item.id === value) {
        finalObj=item.name
      } 
    });
    return finalObj
  }
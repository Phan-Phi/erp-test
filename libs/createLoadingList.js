export default (data) => {
  let trueLoadingList = {};
  let falseLoadingList = {};
  let list = [];

  data.forEach((el) => {
    falseLoadingList[el.original.id] = false;
    trueLoadingList[el.original.id] = true;
    list.push(el.original.id);
  });

  return {
    trueLoadingList,
    falseLoadingList,
    list,
  };
};

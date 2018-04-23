const CalcGet_isFirst = (state) => {
  return state.View.isFirst;
};

const CalcGet_dataList = (state) => {
  return state.View.dataList;
};

const CalcGet_dialogList = (state) => {
  return state.View.dialogList;
};

const CalcGet_inIds = (state) => {
  return state.View.inIds;
};

const CalcGet_notInIds = (state) => {
  return state.View.notInIds;
};

const CalcGet_sumStockinNum = (state) => {
  return state.View.sumStockinNum;
};

export default {
  CalcGet_isFirst,
  CalcGet_dataList,
  CalcGet_dialogList,
  CalcGet_inIds,
  CalcGet_notInIds,
  CalcGet_sumStockinNum,
};

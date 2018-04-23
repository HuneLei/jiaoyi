// 公共下拉选项

//  药品类别下拉
const drugCategory = [
  {
    value: 1,
    label: '西药',
  },
  {
    value: 2,
    label: '中成药',
  },
];

//  单据状态
const status = [
  {
    value: 0,
    label: '待提交',
  },
  {
    value: 1,
    label: '已提交',
  },
];

//  isTrue
const isTrue = [
  {
    value: 1,
    label: '是',
  },
  {
    value: 0,
    label: '否',
  },
];

export default {
  drugCategory, //  药品类别下拉
  status, //  单据状态
  isTrue, //  isTrue
};

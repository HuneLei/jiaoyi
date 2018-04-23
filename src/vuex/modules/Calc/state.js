export default {
  View: {
    // 公共数据管理
    isFirst: true, // 是否第一次进入
    dataList: [], //  明细表格数据
    dialogList: [], //  添加明细弹框表格数据
    baseId: 'baseId', //  唯一表示id的key
    basePrice: 'basePrice', //  单价
    baseAmount: 'baseAmount', //  总价格
    baseAllNum: 'baseAllNum', //  总数量
    baseMapNum: 'baseMapNum', //  未入库总数量
    baseStockinNum: 'baseStockinNum', //  入库数量
    baseRefusedNum: 'baseRefusedNum', //  拒收数量
    baseRefusedType: 'baseRefusedType', //  拒收类型
    dataAllNum: {}, //  数量存储器
    inIds: [],
    notInIds: [],
    sumStockinNum: 0, //  总入库数量
  },
};

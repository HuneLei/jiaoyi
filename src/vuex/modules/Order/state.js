export default {
  Order: {                // 采购计划数据管理
    PlanShow: true,       // 采购计划页面控制是否显示
    OperateShow: false,   // 操作页面控制是否显示
    isOrderCreate: false, // 生成订单按钮是否显示
    PlanItemDate: [],     // 弹出框选择信息
    PlanDateList: [],     // 新增页面的列表信息
    PlanItemList: [],     // 详情页面的列表信息
    DetailItemList: [],   // 合同明细的列表信息
    OrderCreate: [],      // 订单的列表信息
    tradeRow: [],         // 表格数据获取
    purchaseNum: 0,       // 数量
    purchaseAmount: 0,    // 总金额
    noTaxAmount: 0,       // 不含税总金额
    isTradeShow: true,    // 订单底部按钮是否显示
    PlanfromEdit: {},     // 列表信息
    GetDelivery: [],      // 配送单信息
    GetOrderLog: [],      // 订单日志信息
    DeliveryShow: false,  // 弹出框显示隐藏
    NotDeliveryShow: false, // 弹出框显示隐藏
    NotDeliveryList: [],  // 非货票同行时备份原数据
    BatchNoNum: 0,        // 查看数量是否大于发货
    GrugsList: [],         // 药品下拉
    NewGrugsList: [],      // 药品下拉初始
    isRemoveShow: true,    // 删除按钮
    isAgreeShow: true,     // 同意按钮
    isNoAgreeShow: true,   // 不同意按钮
    PrintShow: false,      // 打印页面的显示隐藏
    ReturnHint: false,     // 返回是否被提示
    tradeBtn: {
      orderExport: false, // 导出模板
      orderImport: false, // 导入数据
      orderCreat: false,  // 添加明细
      orderDelete: true,  // 删除明细
      orderCplan: true,   // 生成采购计划模板
      orderLplan: false,   // 导入采购计划
      orderDebi: true,    // 新增
      orderProjectSub: false,    // 新增
    },                    // 表格选择后按钮控制
    ShowBtn: {            // 按钮显示控制
      destory: false,
      create: true,
      pwnolock: false,
      onDrugs: false,
      offDrugs: false,
      exportData: false,
      importData: false,
      saveChange: false,
    },
  }
}

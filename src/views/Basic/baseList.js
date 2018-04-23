/** 左侧栏总菜单
 * type
 * 1，生产企业
 * 2，经营企业
 * 3，医疗机构
 * 4，GPO
 * 5，管理员
 * */
const menuList = [
  {
    path: '/index',
    name: '主页',
    icon: 'fa fa-home',
  },
  {
    path: '/BasicInfo',
    name: '基础信息',
    icon: 'fa fa-cogs',
    children: [
      {
        path: '/BasicInfo/Project',
        name: '集采项目表',
        type: [4, 5],
      },
      {
        path: '/BasicInfo/Address',
        name: '地址管理',
        type: [2, 3, 4, 5],
      },
      {
        path: '/BasicInfo/Hospital',
        name: '医疗机构',
        type: [4, 5],
      },
      {
        path: '/BasicInfo/Delivery',
        name: '经营企业',
        type: [4, 5],
      },
      {
        path: '/BasicInfo/Producer',
        name: '生产企业',
        type: [4, 5],
      },
      {
        path: '/BasicInfo/ContractValid',
        name: '合同有效期设置',
        type: [4, 5],
      },
      {
        path: '/BasicInfo/DeliverTime',
        name: '点配送时间设置',
        type: [4, 5],
      },
      {
        path: '/BasicInfo/ChooseDeliverTime',
        name: '卖方补充配送时间设置',
        type: [4, 5],
      },
      {
        path: '/BasicInfo/CoverRate',
        name: '覆盖率管理',
        type: [2, 5],
      },
      {
        path: '/BasicInfo/Notice',
        name: '公告管理',
        type: [4, 5],
      },
      {
        path: '/BasicInfo/NoticeList',
        name: '公告列表',
        type: [1, 2, 3, 4, 5],
      },
      {
        path: '/BasicInfo/Signature',
        name: '印章管理',
        type: [5],
      },
    ],
  },
  {
    path: '/Drugs',
    name: '药品管理',
    icon: 'fa fa-cube',
    children: [
      {
        path: '/Drugs/DrugsUp',
        name: '药品上架管理',
        type: [3, 4, 5],
      },
      {
        path: '/Drugs/DrugsCode',
        name: '药品编码对照',
        type: [3, 4, 5],
      },
      {
        path: '/Drugs/DrugsSuperviseCode',
        name: '药品卫监码对照',
        type: [4, 5],
      },
      {
        path: '/Drugs/DrugsReportsList',
        name: '药检报告列表',
        type: [1, 2, 4, 5],
      },
      {
        path: '/Drugs/DrugsBatchNo',
        name: '药品批号管理',
        type: [2, 4, 5],
      },
    ],
  },
  {
    path: '/Deliverrelation',
    name: '配送关系管理',
    icon: 'fa fa-users',
    children: [
      {
        path: '/Deliverrelation/ProducerChoseDelivery',
        name: '卖方选配送',
        type: [1, 2, 4, 5],
      },
      {
        path: '/Deliverrelation/ProducerContinueChoseDelivery',
        name: '卖方补充配送',
        type: [1, 2, 4, 5],
      },
      {
        path: '/Deliverrelation/ProducerContinueChoseDeliveryItem',
        name: '卖方补充配送明细',
        type: [1, 2, 4, 5],
      },
      {
        path: '/Deliverrelation/DeliveryAffirm',
        name: '配送企业确认',
        type: [2, 4, 5],
      },
      {
        path: '/Deliverrelation/HospitalChoseDelivery',
        name: '买方选配送',
        type: [3, 4, 5],
      },
      {
        path: '/Deliverrelation/HospitalChangeDelivery',
        name: '买方更换配送',
        type: [3, 4, 5],
      },
      {
        path: '/Deliverrelation/DrugsUsable',
        name: '可采药品目录',
        type: [1, 2, 3, 4, 5],
      },
      {
        path: '/Deliverrelation/DrugsUsablePrice',
        name: '协议价维护',
        type: [4, 5],
      },
    ],
  },
  {
    path: '/Reportnum',
    name: '医疗机构报量管理',
    icon: 'fa fa-window-restore',
    children: [
      {
        path: '/Reportnum/ReportNumSets',
        name: '报量期间设置',
        type: [4, 5],
      },
      {
        path: '/Reportnum/HospitalReportNum',
        name: '医疗机构报量',
        type: [3, 4, 5],
      },
      {
        path: '/Reportnum/ReportNumList',
        name: '报量清单',
        type: [3, 4, 5],
      },
      {
        path: '/Reportnum/ReportNumSum',
        name: '报量汇总',
        type: [3, 4, 5],
      },
    ],
  },
  {
    path: '/Contract',
    name: '合同管理',
    icon: 'fa fa-sticky-note',
    children: [
      {
        path: '/Contract/TriContractList',
        name: '三方合同列表',
        type: [1, 2, 3, 4, 5],
      },
      {
        path: '/Contract/HonestContract',
        name: '廉洁合同列表',
        type: [1, 2, 3, 4, 5],
      },
      {
        path: '/Contract/ContractClose',
        name: '合同结案申请单',
        type: [1, 2, 3, 4, 5],
      },
      {
        path: '/Contract/ContractItem',
        name: '合同明细',
        type: [1, 2, 3, 4, 5],
      },
      {
        path: '/Contract/ContractDrugsSum',
        name: '合同药品统计',
        type: [2, 4, 5],
      },
    ],
  },
  {
    path: '/Order',
    name: '订单管理',
    icon: 'fa fa-tags',
    children: [
      {
        path: '/Order/PurchasePlan',
        name: '采购计划',
        type: [3, 4, 5],
      },
      {
        path: '/Order/ShoppingCart',
        name: '订单购物车',
        type: [3, 4, 5],
      },
      {
        path: '/Order/HospitalOrdersList',
        name: '订单列表（医疗机构）',
        type: [3, 4, 5],
      },
      {
        path: '/Order/DeliveryOrdersList',
        name: '订单列表（配送企业）',
        type: [2, 4, 5],
      },
      {
        path: '/Order/OrdersClose',
        name: '订单结案申请单',
        type: [2, 3, 4, 5],
      },
      {
        path: '/Order/ordersCloseItem',
        name: '订单结案申请明细',
        type: [2, 3, 4, 5],
      },
      {
        path: '/Order/OrdersItem',
        name: '订单明细',
        type: [1, 2, 3, 4, 5],
      },
    ],
  },
  {
    path: '/Deliverbill',
    name: '配送单管理',
    icon: 'fa fa-clipboard',
    children: [
      {
        path: '/Deliverbill/DeliverBillList',
        name: '配送单列表',
        type: [2, 3, 4, 5],
      },
      {
        path: '/Deliverbill/DeliverBillItem',
        name: '配送单明细',
        type: [1, 2, 3, 4, 5],
      },
    ],
  },
  {
    path: '/Stockinbill',
    name: '入库单管理',
    icon: 'fa fa-folder-open-o',
    children: [
      {
        path: '/Stockinbill/StockinBillList',
        name: '入库单列表',
        type: [3, 4, 5],
      },
      {
        path: '/Stockinbill/StockinBillItem',
        name: '入库单明细',
        type: [1, 2, 3, 4, 5],
      },
    ],
  },
  {
    path: '/Return',
    name: '退货管理',
    icon: 'fa fa-share',
    children: [
      {
        path: '/Return/ReturnBillsList',
        name: '退货单列表',
        type: [2, 3, 4, 5],
      },
      {
        path: '/Return/ReturnBillsItem',
        name: '退货单明细',
        type: [2, 3, 4, 5],
      },
    ],
  },
  {
    path: '/Invoice',
    name: '发票管理',
    icon: 'fa fa-map-o',
    children: [
      {
        path: '/Invoice/InvoiceList',
        name: '发票列表',
        type: [2, 3, 4, 5],
      },
      {
        path: '/Invoice/InvoiceItem',
        name: '发票明细',
        type: [2, 3, 4, 5],
      },
      {
        path: '/Invoice/InvoiceGather',
        name: '发票汇总',
        type: [2, 3, 4, 5],
      },
      {
        path: '/Invoice/InvoiceQuery',
        name: '发票查询',
        type: [3, 4, 5],
      },
    ],
  },
  {
    path: '/Deliverypurchase',
    name: '配送企业采购管理',
    icon: 'fa fa-indent',
    children: [
      {
        path: '/Deliverypurchase/DeliveryPurchaseList',
        name: '采购单列表',
        type: [2, 4, 5],
      },
      {
        path: '/Deliverypurchase/DeliveryPurchaseItem',
        name: '采购单明细',
        type: [2, 4, 5],
      },
    ],
  },
  {
    path: '/Gpopurchase',
    name: 'GPO采购管理',
    icon: 'fa fa-dropbox',
    children: [
      {
        path: '/Gpopurchase/GpoPurchaseList',
        name: 'GPO采购单列表',
        type: [1, 2, 4, 5],
      },
      {
        path: '/Gpopurchase/GpoPurchaseItem',
        name: 'GPO采购单明细',
        type: [1, 2, 4, 5],
      },
      {
        path: '/Gpopurchase/GpoStockinList',
        name: 'GPO入库单列表',
        type: [1, 2, 4, 5],
      },
      {
        path: '/Gpopurchase/GpoStockinItem',
        name: 'GPO入库单明细',
        type: [1, 2, 4, 5],
      },
    ],
  },
  {
    path: '/Gpostockout',
    name: 'GPO出库管理',
    icon: 'fa fa-ambulance',
    children: [
      {
        path: '/Gpostockout/GpoStockoutList',
        name: '出库单列表',
        type: [4, 5],
      },
      {
        path: '/Gpostockout/GpoStockoutItem',
        name: '出库单明细',
        type: [2, 4, 5],
      },
    ],
  },
  {
    path: '/Deliverystock',
    name: '配送企业库存管理',
    icon: 'fa fa-archive',
    children: [
      {
        path: '/Deliverystock/StockList',
        name: '库存列表',
        type: [2, 4, 5],
      },
      {
        path: '/Deliverystock/StockItemList',
        name: '库存明细列表',
        type: [2, 4, 5],
      },
      {
        path: '/Deliverystock/Stock',
        name: '期间库存',
        type: [2, 4, 5],
      },
    ],
  },
  {
    path: '/SurveyReport',
    name: '调查报告',
    icon: 'fa fa-question-circle',
    children: [
      {
        path: '/SurveyReport/DrugsHarmfulResponse',
        name: '药品不良反应报告表',
        type: [3, 4, 5],
      },
      {
        path: '/SurveyReport/HarmfulResponseTest',
        name: '不良反应监测调查表',
        type: [3, 4, 5],
      },
    ],
  },
  {
    path: '/General',
    name: '通用报表',
    icon: 'fa fa-line-chart',
    children: [
      {
        path: '/General/HospitalRegulations',
        name: '医院品规报表',
        type: [4, 5],
      },
      {
        path: '/General/MonthlySales',
        name: '月度销售报表',
        type: [4, 5],
      },
      {
        path: '/General/MonthlyCollect',
        name: '月度汇总报表',
        type: [4, 5],
      },
      {
        path: '/General/ComponentAnalysis',
        name: '构成分析',
        type: [4, 5],
      },
      {
        path: '/General/PurchaseAnalysis',
        name: '医院采购分析',
        type: [4, 5],
      },
      {
        path: '/General/DeliveryStock',
        name: '配送企业库存分析',
        type: [4, 5],
      },
    ],
  },
];

const indexList = {
  contractNum: {
    name: '待签章合同',
    functionName: '三方合同列表',
    memberType: [2, 3, 4],
    icon: 'icon-seal',
    class: 'circle-s',
    value: 0,
    path: '/Contract/TriContractList',
  },
  incorruptibleNum: {
    name: '待签章廉洁合同',
    functionName: '廉洁合同列表',
    memberType: [2, 3, 4],
    icon: 'icon-shenqing',
    class: 'circle-a',
    value: 0,
    path: '/Contract/HonestContract',
  },
  ordersNumd: {
    name: '待确认订单',
    functionName: '订单列表（配送企业）',
    memberType: [2],
    icon: 'icon-faqijiezhang',
    class: 'circle-d',
    value: 0,
    path: '/Order/DeliveryOrdersList',
  },
  ordersNum: {
    name: '待发货订单',
    functionName: '订单列表（配送企业）',
    memberType: [2],
    icon: 'icon-huoche',
    class: 'circle-g',
    value: 0,
    path: '/Order/DeliveryOrdersList',
  },
  ordersCloseNum: {
    name: '待审核订单结案',
    functionName: '订单结案申请单',
    memberType: [2],
    icon: 'icon-shenhetongguo',
    class: 'circle-xy',
    value: 0,
    path: '/Order/OrdersClose',
  },
  returnBillsNum: {
    name: '待审核退货单',
    functionName: '退货单列表',
    memberType: [2, 4],
    icon: 'icon-icon-dahui',
    class: 'circle-q',
    value: 0,
    path: '/Return/ReturnBillsList',
  },
  contractCloseNum: {
    name: '待审核合同结案',
    functionName: '合同结案申请单',
    memberType: [2, 4],
    icon: 'icon-hetong',
    class: 'circle-zy',
    value: 0,
    path: '/Contract/ContractClose',
  },
  deliverNum: {
    name: '待收货配送单',
    functionName: '配送单列表',
    memberType: [3],
    icon: 'icon-shenhetongguo',
    class: 'circle-xy',
    value: 0,
    path: '/Deliverbill/DeliverBillList',
  },
  invoiceNum: {
    name: '待确认发票',
    functionName: '发票列表',
    memberType: [3],
    icon: 'icon-fapiao',
    class: 'circle-m',
    value: 0,
    path: '/Invoice/InvoiceList',
  },
  warningNum: {
    name: '预警合同明细',
    functionName: '合同明细',
    memberType: [3],
    icon: 'icon-duibifenxi',
    class: 'circle-a',
    value: 0,
    path: '/Contract/ContractItem',
  },
  drugsNum: {
    name: '上架药品',
    functionName: '药品上架管理',
    memberType: [4],
    icon: 'icon-yaopin',
    class: 'circle-xy',
    value: 0,
    path: '/Drugs/DrugsUp',
  },
  hospitalNum: {
    name: '医疗机构',
    functionName: '医疗机构',
    memberType: [4],
    icon: 'icon-yiliao',
    class: 'circle-m',
    value: 0,
    path: '/BasicInfo/Hospital',
  },
  enterpriseNum: {
    name: '配送企业',
    functionName: '经营企业',
    memberType: [4],
    icon: 'icon-daishouhuo',
    class: 'circle-a',
    value: 0,
    path: '/BasicInfo/Delivery',
  },
};

export default {
  menuList,
  indexList,
};

import * as types from './types.js'

export default{
  showCheck: ({
    commit
  }) => {
    commit(types.SHOWCHECK);
    commit(types.INITIALAZE)
  },
  showPlan: ({
    commit
    }) => {
    commit(types.SHOWPLAN);
  },
  showCreat: ({
    commit
    }) => {
    commit(types.SHOWCREAT);
    commit(types.INITIALAZE)
  },
  GetPlanDate: ({
    commit
    }, date) => {
    commit(types.GETPLANDATE, date)
  },
  GetItemDate: ({
    commit
    }, date) => {
    commit(types.GETITEMDATE, date)
  },
  TradeSelect: ({
    commit
    }, data) => {
    commit(types.TRADESELECT, data)
  },
  Initialize: ({
    commit
    }) => {
    commit(types.INITIALAZE)
  },
  CountNum: ({
    commit
    }, data) => {
    commit(types.COUNTNUM, data)
  },
  DeleteItem: ({
    commit
    }, data) => {
    commit(types.DELETEITEM, data)
  },
  ChangeTrade: ({
    commit
    }) => {
    commit(types.CHANGETRADE)
  },
  ItemList: ({
    commit
    }, data) => {
    commit(types.ITEMLIST, data)
  },
  GetDetailDate: ({
    commit
    }, data) => {
    commit(types.GETDETAILDATA, data)
  },
  GetInputDate: ({
    commit
    }, data) => {
    commit(types.GETINPUTDATE, data)
  },
  OrderCreate: ({
    commit
    }, data) => {
    commit(types.ORDERCREATE, data)
  },
  GetDelivery: ({
    commit
    }, data) => {
    commit(types.GETDELIVERY, data)
  },
  GetOrderLog: ({
    commit
    }, data) => {
    commit(types.GETORDERLOG, data)
  },
  DeliveryShow: ({
    commit
    }, data) => {
    commit(types.DLIVERYSHOW, data)
  },
  BatchNoPart: ({
    commit
    }, data) => {
    commit(types.BATCHNOPART, data)
  },
  BatchNoDelete: ({
    commit
    }, data) => {
    commit(types.BATCHNODELETE, data)
  },
  RowDisabled: ({
    commit
    }, data) => {
    commit(types.ROWDISABLED, data)
  },
  GetGrugsList: ({
    commit
    }, data) => {
    commit(types.GETGRUGSLIST, data)
  },
  NewGrugsList: ({
    commit
    }, data) => {
    commit(types.NEWGRUGSLIST, data)
  },
  GetAuditStatus: ({
    commit
    }, data) => {
    commit(types.GETAUDITSTATUS, data)
  },
  CheckDebi: ({
    commit
    }, data) => {
    commit(types.CHECKDEBI, data)
  },
  ControltradeBtn: ({
    commit
    }, data) => {
    commit(types.CONTROLTRADEBTN, data)
  },
  PlanListClear: ({
    commit
    }, data) => {
    commit(types.PLANLISTCLEAR, data)
  },
  BatchNoDeletes: ({
    commit
  }, data) => {
    commit(types.BATCHNODELETES, data)
  },
  PrintShow: ({
    commit
    }, data) => {
    commit(types.PRINTSHOW, data)
  },
  ReturnHint: ({
    commit
    }, data) => {
    commit(types.RETUENHINT, data)
  },
  GetPlanDates: ({
    commit
    }, data) => {
    commit(types.GETPLANDATES, data)
  },
  Getitemdates: ({
    commit
    }, data) => {
    commit(types.GETITEMDATES, data)
  },
  setTablePlanDates: ({
    commit
  }, data) => {
    commit(types.SETTABLEPLANDATES, data)
  },
  setTableItemList: ({
    commit
  }, data) => {
    commit(types.SETTABLEITEMLIST, data)
  }
}

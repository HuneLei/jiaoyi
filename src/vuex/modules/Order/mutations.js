import {
  SHOWCHECK,
  SHOWPLAN,
  SHOWCREAT,
  GETPLANDATE,
  GETITEMDATE,
  INITIALAZE,
  TRADESELECT,
  COUNTNUM,
  DELETEITEM,
  CHANGETRADE,
  ITEMLIST,
  GETDETAILDATA,
  GETINPUTDATE,
  ORDERCREATE,
  GETDELIVERY,
  GETORDERLOG,
  DLIVERYSHOW,
  BATCHNOPART,
  BATCHNODELETE,
  ROWDISABLED,
  GETGRUGSLIST,
  NEWGRUGSLIST,
  GETAUDITSTATUS,
  CHECKDEBI,
  CONTROLTRADEBTN,
  PLANLISTCLEAR,
  BATCHNODELETES,
  PRINTSHOW,
  RETUENHINT,
  GETPLANDATES,
  GETITEMDATES,
  SETTABLEPLANDATES,
  SETTABLEITEMLIST,
} from './types'

export default {
  // 显示采购系统的主页面
  [SHOWPLAN](state) {
    state.Order.OperateShow = false;
    state.Order.PlanShow = true;
  },
  // 显示采购系统详情页面
  [SHOWCHECK](state) {
    state.Order.OperateShow = true;
    state.Order.PlanShow = false;
  },
  // 显示采购系统新增页面
  [SHOWCREAT](state) {
    state.Order.OperateShow = true;
    state.Order.PlanShow = false;
  },
  // 获取弹出框信息
  [GETPLANDATE](state, date) {
    for (let i = 0; i < date.length; i += 1) {
      state.Order.purchaseNum = Number(state.Order.purchaseNum) + Number(date[i].purchaseNum);
      state.Order.purchaseAmount = Number(state.Order.purchaseAmount) + Number(date[i].purchaseNum) * Number(date[i].hospitalUnitPrice);
      // state.Order.noTaxAmount = Number(state.Order.noTaxAmount) + Number(date[i].purchaseNum) * Number(date[i].noTaxAmountPrice);
      date[i].num = i + 1;
      date[i].id = 0;
    }
    state.Order.PlanItemDate = [...date];
    state.Order.PlanDateList = [...state.Order.PlanDateList, ...date];
    for (let i = 0; i < state.Order.PlanDateList.length; i += 1) {
      state.Order.PlanDateList[i].num = i + 1;
    }
    // 计算不含税金额小数问题，把之前的先注释掉
    state.Order.noTaxAmount = 0.00;
    for (let m = 0; m < state.Order.PlanItemList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanItemList[m].noTaxAmount);
    }
    for (let m = 0; m < state.Order.PlanDateList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanDateList[m].noTaxAmount);
    }
  },
  // 导入采购计划数据
  [GETINPUTDATE](state, date) {
    let datalist = [];
    let datapass = 0;
    if (date) {
      for (let m = 0; m < date.length; m += 1) {
        datapass = 0;
        date[m].purchaseAmount = Number(date[m].purchaseNum) * Number(date[m].hospitalUnitPrice);
        for (let n = 0; n < state.Order.PlanItemList.length; n += 1) {
          const ItemList = state.Order.PlanItemList[n];
          if (ItemList.drugsCode === date[m].drugsCode && Number(ItemList.hospitalUnitPrice).toFixed(2) === Number(date[m].hospitalUnitPrice).toFixed(2) && ItemList.deliveryMemberId === date[m].deliveryMemberId) {
            state.Order.PlanItemList[n] = Object.assign(date[m]);
            datapass = 1;
          }
        }
        if (datapass === 0) {
          datalist.push(date[m]);
        }
      }
    }
    state.Order.PlanItemDate = [...datalist];
    state.Order.PlanItemList = [...state.Order.PlanItemList, ...datalist];
    for (let i = 0; i < state.Order.PlanItemList.length; i += 1) {
      state.Order.PlanItemList[i].num = i + 1;
    }
    state.Order.purchaseNum = 0;
    state.Order.purchaseAmount = 0;
    state.Order.noTaxAmount = 0;
    for (let i = 0; i < state.Order.PlanItemList.length; i += 1) {
      state.Order.purchaseNum = Number(state.Order.purchaseNum) + Number(state.Order.PlanItemList[i].purchaseNum);
      state.Order.purchaseAmount = Number(state.Order.purchaseAmount) + Number(state.Order.PlanItemList[i].purchaseNum) * Number(state.Order.PlanItemList[i].hospitalUnitPrice);
      // state.Order.noTaxAmount = Number(state.Order.noTaxAmount) + Number(state.Order.PlanItemList[i].purchaseNum) * Number(state.Order.PlanItemList[i].noTaxAmountPrice);
      state.Order.PlanItemList[i].num = i + 1;
      if (state.Order.PlanItemList.item !== 0) {
        state.Order.PlanItemList[i].id = 0;
      }
    }
    // 计算不含税金额小数问题，把之前的先注释掉
    state.Order.noTaxAmount = 0.00;
    for (let m = 0; m < state.Order.PlanItemList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanItemList[m].noTaxAmount);
    }
    for (let m = 0; m < state.Order.PlanDateList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanDateList[m].noTaxAmount);
    }
  },
  // 获取弹出框信息
  [GETITEMDATE](state, date) {
    for (let i = 0; i < date.length; i += 1) {
      state.Order.purchaseNum = Number(state.Order.purchaseNum) + Number(date[i].purchaseNum);
      state.Order.purchaseAmount = Number(state.Order.purchaseAmount) + Number(date[i].purchaseNum) * Number(date[i].hospitalUnitPrice);
      // state.Order.noTaxAmount = Number(state.Order.noTaxAmount) + Number(date[i].purchaseNum) * Number(date[i].noTaxAmountPrice);
      date[i].num = i + 1;
      if (date.item !== 0) {
        date[i].id = 0;
      }
    }
    state.Order.PlanItemDate = [...date];
    state.Order.PlanItemList = [...state.Order.PlanItemList, ...date];
    for (let i = 0; i < state.Order.PlanItemList.length; i += 1) {
      state.Order.PlanItemList[i].num = i + 1;
    }
    // 计算不含税金额小数问题，把之前的先注释掉
    state.Order.noTaxAmount = 0.00;
    for (let m = 0; m < state.Order.PlanItemList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanItemList[m].noTaxAmount);
    }
    for (let m = 0; m < state.Order.PlanDateList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanDateList[m].noTaxAmount);
    }
  },
  // 初始化数据
  [INITIALAZE](state) {
    state.Order.PlanDateList = [];
    state.Order.PlanItemList = [];
    state.Order.PlanItemDate = [];
    state.Order.DetailItemList = [];
    state.Order.OrderCreate = [];
    state.Order.GetDelivery = [];
    state.Order.NotDeliveryList = [];
    state.Order.GrugsList = [];
    state.Order.NewGrugsList = [];
    state.Order.purchaseNum = 0;
    state.Order.purchaseAmount = 0;
    state.Order.noTaxAmount = 0;
    state.Order.BatchNoNum = 0;
    state.Order.tradeBtn.orderDelete = true;
    state.Order.tradeBtn.orderCplan = true;
    state.Order.tradeBtn.orderDebi = true;
    state.Order.PlanfromEdit = {};
    state.Order.ReturnHint = false;
  },
  // 保存列表选择数据
  [TRADESELECT](state, data) {
    if (data) {
      state.Order.tradeRow = [...data.tradeRow];
      state.Order.tradeBtn = Object.assign(data.tradeBtn);
    } else {
      state.Order.tradeRow = [];
      state.Order.tradeBtn.orderCreat = false;
      state.Order.tradeBtn.orderDelete = true;
      state.Order.tradeBtn.orderCplan = true;
    }
  },
  // 重新计算总数和金额
  [COUNTNUM](state, data) {
    state.Order.purchaseNum = (Number(state.Order.purchaseNum) - Number(data.Num) + Number(data.Count));
    state.Order.purchaseAmount = Number(state.Order.purchaseAmount) + (Number(data.Count) - Number(data.Num)) * Number(data.Price);
    // state.Order.noTaxAmount = Number(state.Order.noTaxAmount) + (Number(data.Count) - Number(data.Num)) * Number(data.noTaxPrice);
    // 计算不含税金额小数问题，把之前的注释掉
    state.Order.noTaxAmount = 0.00;
    for (let m = 0; m < state.Order.PlanItemList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanItemList[m].noTaxAmount);
    }
    for (let m = 0; m < state.Order.PlanDateList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanDateList[m].noTaxAmount);
    }
  },
  // 删除后重新计算总数和金额
  [DELETEITEM](state, data) {
    for (let i = 0; i < data.length; i += 1) {
      for (let n = 0; n < state.Order.PlanItemList.length; n += 1) {
        if (data[i].num === state.Order.PlanItemList[n].num) {
          state.Order.PlanItemList.splice(n, 1);
          state.Order.purchaseNum = Number(state.Order.purchaseNum) - Number(data[i].purchaseNum);
          state.Order.purchaseAmount = Number(state.Order.purchaseAmount) - Number(data[i].purchaseAmount);
          // state.Order.noTaxAmount += Number(state.Order.PlanItemList[n].noTaxAmount);
        }
      }
      for (let m = 0; m < state.Order.PlanDateList.length; m += 1) {
        if (data[i].num === state.Order.PlanDateList[m].num) {
          state.Order.PlanDateList.splice(m, 1);
          state.Order.purchaseNum = Number(state.Order.purchaseNum) - Number(data[i].purchaseNum);
          state.Order.purchaseAmount = Number(state.Order.purchaseAmount) - Number(data[i].purchaseAmount);
          // state.Order.noTaxAmount += Number(state.Order.PlanDateList[m].noTaxAmount);
        }
      }
    }
    // 计算不含税金额小数问题，把之前的注释掉
    state.Order.noTaxAmount = 0.00;
    for (let m = 0; m < state.Order.PlanItemList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanItemList[m].noTaxAmount);
    }
    for (let m = 0; m < state.Order.PlanDateList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanDateList[m].noTaxAmount);
    }
  },
  // 控制底部按钮
  [CHANGETRADE](state) {
    state.Order.isTradeShow = !state.Order.isTradeShow
  },
  // 获取信息
  [ITEMLIST](state, data) {
    state.Order.PlanfromEdit = Object.assign(data);
  },
  // 获取信息
  [GETDETAILDATA](state, data) {
    state.Order.DetailItemList = [];
    state.Order.DetailItemList = [...state.Order.DetailItemList, ...data];
  },
  // 获取生成的订单信息
  [ORDERCREATE](state, data) {
    state.Order.OrderCreate = [...data];
  },
  // 获取配送单信息
  [GETDELIVERY](state, data) {
    state.Order.GetDelivery = [...data];
  },
  // 获取订单日志信息
  [GETORDERLOG](state, data) {
    state.Order.GetOrderLog = [...data];
  },
  // 弹出框显示隐藏
  [DLIVERYSHOW](state, data) {
    if (data[1] === 'DeliveryShow') {
      state.Order.DeliveryShow = data[0];
    } else if (data[1] === 'NotDeliveryShow' || data[1] === 'NoAgreeRetureShow') {
      state.Order.NotDeliveryShow = data[0];
    }
    if (data[1] !== 'NoAgreeRetureShow') {
      state.Order.NotDeliveryList = [];
      let y = 0;
      for (let i = 0; i < state.Order.PlanItemList.length; i += 1) {
        if (Number(state.Order.PlanItemList[i].closeStatus) === 0) {
          const purchaseNum = Number(state.Order.PlanItemList[i].purchaseNum) - Number(state.Order.PlanItemList[i].sendNum);
          if (purchaseNum !== 0) {
            state.Order.NotDeliveryList[y] = Object.assign({}, state.Order.PlanItemList[i]);
            state.Order.NotDeliveryList[y].purchaseNum = Number(state.Order.PlanItemList[i].purchaseNum) - Number(state.Order.PlanItemList[i].sendNum);
            state.Order.NotDeliveryList[y].drugsNum = state.Order.NotDeliveryList[y].purchaseNum;
            state.Order.NotDeliveryList[y].ordersItemId = state.Order.NotDeliveryList[y].id;
            let num = y + 1;
            state.Order.NotDeliveryList[y].BatchNum = num;
            state.Order.NotDeliveryList[y].num = num;
            state.Order.NotDeliveryList[y].RowDisabled = true;
            state.Order.NotDeliveryList[y].OutStyle = '';
            state.Order.NotDeliveryList[y].batchNo = '';
            state.Order.NotDeliveryList[y].validDate = '';
            state.Order.NotDeliveryList[y].makeDate = '';
            state.Order.NotDeliveryList[y].drugsReportFile = '';
            y += 1;
          }
        }
      }
    } else {
      state.Order.NotDeliveryList = [];
      for (let i = 0; i < state.Order.PlanItemList.length; i += 1) {
        state.Order.NotDeliveryList[i] = Object.assign({}, state.Order.PlanItemList[i]);
        state.Order.NotDeliveryList[i].returnNum = state.Order.NotDeliveryList[i].purchaseNum
      }
    }
  },
  // 拆分批号处理
  [BATCHNOPART](state, data) {
    const BatchList = Object.assign({}, state.Order.NotDeliveryList[data]);
    let BatchNumAll = 0;
    let num = 0;
    for (let i = 0; i < state.Order.NotDeliveryList.length; i += 1) {
      if (Number(state.Order.NotDeliveryList[i].BatchNum) === Number(state.Order.NotDeliveryList[data].num)) {
        BatchNumAll = Number(BatchNumAll) + Number(state.Order.NotDeliveryList[i].drugsNum);
        num++;
      }
    }
    BatchList.drugsNum = Number(BatchList.purchaseNum) - Number(BatchNumAll);
    BatchList.BatchNum = Number(BatchList.num);
    BatchList.num = '';
    BatchList.batchNo = '';
    BatchList.makeDate = '';
    BatchList.validDate = '';
    BatchList.drugsReportFile = '';
    BatchList.operate = true;
    state.Order.NotDeliveryList.splice(num + data, 0, BatchList);
    const GrugsOne = Object.assign({}, state.Order.GrugsList[data]);
    state.Order.GrugsList.splice(num + data, 0, GrugsOne);
  },
  // 删除主批号处理
  [BATCHNODELETES](state, data) {
    const BatchNum = Number(data);
    let Nwei = -1;
    let Snum = 0;
    for (let i = 0; i < state.Order.NotDeliveryList.length; i += 1) {
      if (Number(state.Order.NotDeliveryList[i].BatchNum) === BatchNum || Number(state.Order.NotDeliveryList[i].num) === BatchNum) {
        if (Nwei === -1) {
          Nwei = i;
        }
        Snum += 1;
      }
    }
    state.Order.NotDeliveryList.splice(Nwei, Snum);
    state.Order.GrugsList.splice(Nwei, Snum);
  },
  // 删除批号处理
  [BATCHNODELETE](state, data) {
    const BatchNum = Number(state.Order.NotDeliveryList[data].BatchNum);
    const purchaseNum = Number(state.Order.NotDeliveryList[data].purchaseNum);
    state.Order.NotDeliveryList.splice(data, 1);
    state.Order.GrugsList.splice(data, 1);
    let num = 0;
    let pasce = 0;
    for (let i = 0; i < state.Order.NotDeliveryList.length; i += 1) {
      if (Number(state.Order.NotDeliveryList[i].BatchNum) === BatchNum) {
        pasce = Number(pasce) + Number(state.Order.NotDeliveryList[i].drugsNum);
        if (BatchNum === Number(state.Order.NotDeliveryList[i].num)) {
          num = i;
        }
      }
    }
    pasce < purchaseNum ? state.Order.NotDeliveryList[num].RowDisabled = false : state.Order.NotDeliveryList[num].RowDisabled = true;
  },
  // 控制是否可以拆分
  [ROWDISABLED](state, data) {
    let num = 0;
    for (let i = 0; i <= data[0]; i += 1) {
      if (Number(state.Order.NotDeliveryList[i].BatchNum) === Number(state.Order.NotDeliveryList[data[0]].BatchNum)) {
        num++;
      }
    }
    state.Order.NotDeliveryList[data[0] + 1 - num].RowDisabled = data[1];
    const BatchNum = Number(state.Order.NotDeliveryList[data[0]].BatchNum);
    const purchaseNum = Number(state.Order.NotDeliveryList[data[0]].purchaseNum);
    let key = 0;
    let pasce = 0;
    for (let i = 0; i < state.Order.NotDeliveryList.length; i += 1) {
      if (Number(state.Order.NotDeliveryList[i].BatchNum) === BatchNum) {
        pasce = Number(pasce) + Number(state.Order.NotDeliveryList[i].drugsNum);
        if (BatchNum === Number(state.Order.NotDeliveryList[i].num)) {
          key = i;
        }
      }
    }
  },
  [GETGRUGSLIST](state, data) {
    // state.Order.NewGrugsList = [];
    for (let i = 0; i < data.length; i += 1) {
      data[i].value = `${data[i].id}$${data[i].batchNo}`;
      data[i].label = data[i].batchNo;
      data[i].index = i;
    }
    state.Order.NewGrugsList.push(data);
  },
  [NEWGRUGSLIST](state) {
    state.Order.GrugsList.length = state.Order.NewGrugsList.length;
    for (let i = 0; i < state.Order.NotDeliveryList.length; i += 1) {
      for (let n = 0; n < state.Order.NewGrugsList.length; n += 1) {
        if (state.Order.NotDeliveryList[i].drugsCode === state.Order.NewGrugsList[n].drugsCode) {
          state.Order.GrugsList[i] = state.Order.NewGrugsList[n];
        }
      }
    }
  },
  [GETAUDITSTATUS](state, data) {
    if (data === 3 || data === 4) {
      state.Order.isRemoveShow = false;
      state.Order.isAgreeShow = false;
      state.Order.isNoAgreeShow = false;
    } else {
      state.Order.isRemoveShow = true;
      state.Order.isAgreeShow = true;
      state.Order.isNoAgreeShow = true;
    }
  },
  [CHECKDEBI](state, data) {
    state.Order.tradeBtn.orderDebi = data;
  },
  [CONTROLTRADEBTN](state, data) {
    state.Order.tradeBtn = data;
    // state.Order.PlanDateList = [];
    // state.Order.PlanItemList = [];
  },
  [PLANLISTCLEAR](state, data) {
    if (!data) {
      state.Order.PlanDateList = [];
      state.Order.PlanItemDate = [];
      state.Order.PlanItemList = [];
      state.Order.purchaseAmount = 0;
      state.Order.noTaxAmount = 0;
      state.Order.purchaseNum = 0;
    }
  },
  [PRINTSHOW](state, data) {
    state.Order.PrintShow = data;
  },
  [RETUENHINT](state, data) {
    data === 0 ? state.Order.ReturnHint = false : state.Order.ReturnHint = true;
  },
  // 获取信息并计算总数量
  [GETPLANDATES](state, date) {
    state.Order.PlanItemDate = [...date];
    state.Order.PlanDateList = [...state.Order.PlanDateList, ...date];
    for (let i = 0; i < state.Order.PlanDateList.length; i += 1) {
      state.Order.PlanDateList[i].num = i + 1;
    }
    state.Order.purchaseNum = 0;
    state.Order.purchaseAmount = 0;
    state.Order.noTaxAmount = 0;
    for (let i = 0; i < state.Order.PlanDateList.length; i += 1) {
      state.Order.purchaseNum = Number(state.Order.purchaseNum) + Number(state.Order.PlanDateList[i].purchaseNum);
      state.Order.purchaseAmount = Number(state.Order.purchaseAmount) + Number(state.Order.PlanDateList[i].purchaseNum) * Number(state.Order.PlanDateList[i].hospitalUnitPrice);
      state.Order.PlanDateList[i].num = i + 1;
      state.Order.PlanDateList[i].id = 0;
    }
    // 计算不含税金额小数问题，把之前的注释掉
    state.Order.noTaxAmount = 0.00;
    for (let m = 0; m < state.Order.PlanItemList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanItemList[m].noTaxAmount);
    }
    for (let m = 0; m < state.Order.PlanDateList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanDateList[m].noTaxAmount);
    }
  },
  // 获取信息并计算总数量
  [GETITEMDATES](state, date) {
    state.Order.PlanItemDate = [...date];
    state.Order.PlanItemList = [...state.Order.PlanItemList, ...date];
    for (let i = 0; i < state.Order.PlanItemList.length; i += 1) {
      state.Order.PlanItemList[i].num = i + 1;
    }
    state.Order.purchaseNum = 0;
    state.Order.purchaseAmount = 0;
    state.Order.noTaxAmount = 0;
    for (let i = 0; i < state.Order.PlanItemList.length; i += 1) {
      state.Order.purchaseNum = Number(state.Order.purchaseNum) + Number(state.Order.PlanItemList[i].purchaseNum);
      state.Order.purchaseAmount = Number(state.Order.purchaseAmount) + Number(state.Order.PlanItemList[i].purchaseNum) * Number(state.Order.PlanItemList[i].hospitalUnitPrice);
      state.Order.PlanItemList[i].num = i + 1;
      state.Order.PlanItemList[i].id = 0;
    }
    // 计算不含税金额小数问题，把之前的注释掉
    state.Order.noTaxAmount = 0.00;
    for (let m = 0; m < state.Order.PlanItemList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanItemList[m].noTaxAmount);
    }
    for (let m = 0; m < state.Order.PlanDateList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanDateList[m].noTaxAmount);
    }
  },
  // 重新设置PLANDATES的表格
  [SETTABLEPLANDATES](state, date) {
    state.Order.PlanItemDate = [...date];
    state.Order.PlanDateList = [...date];
    for (let i = 0; i < state.Order.PlanDateList.length; i += 1) {
      state.Order.PlanDateList[i].num = i + 1;
    }
    state.Order.purchaseNum = 0;
    state.Order.purchaseAmount = 0;
    state.Order.noTaxAmount = 0;
    for (let i = 0; i < state.Order.PlanDateList.length; i += 1) {
      state.Order.purchaseNum = Number(state.Order.purchaseNum) + Number(state.Order.PlanDateList[i].purchaseNum);
      state.Order.purchaseAmount = Number(state.Order.purchaseAmount) + Number(state.Order.PlanDateList[i].purchaseNum) * Number(state.Order.PlanDateList[i].hospitalUnitPrice);
      state.Order.PlanDateList[i].num = i + 1;
      state.Order.PlanDateList[i].id = 0;
    }
    // 计算不含税金额小数问题，把之前的注释掉
    state.Order.noTaxAmount = 0.00;
    for (let m = 0; m < state.Order.PlanItemList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanItemList[m].noTaxAmount);
    }
    for (let m = 0; m < state.Order.PlanDateList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanDateList[m].noTaxAmount);
    }
  },
  //  重新设置ITEMLIST的表格
  [SETTABLEITEMLIST](state, date) {
    state.Order.PlanItemDate = [...date];
    state.Order.PlanItemList = [...date];
    for (let i = 0; i < state.Order.PlanItemList.length; i += 1) {
      state.Order.PlanItemList[i].num = i + 1;
    }
    state.Order.purchaseNum = 0;
    state.Order.purchaseAmount = 0;
    state.Order.noTaxAmount = 0;
    for (let i = 0; i < state.Order.PlanItemList.length; i += 1) {
      state.Order.purchaseNum = Number(state.Order.purchaseNum) + Number(state.Order.PlanItemList[i].purchaseNum);
      state.Order.purchaseAmount = Number(state.Order.purchaseAmount) + Number(state.Order.PlanItemList[i].purchaseNum) * Number(state.Order.PlanItemList[i].hospitalUnitPrice);
      state.Order.PlanItemList[i].num = i + 1;
      state.Order.PlanItemList[i].id = 0;
    }
    // 计算不含税金额小数问题，把之前的注释掉
    state.Order.noTaxAmount = 0.00;
    for (let m = 0; m < state.Order.PlanItemList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanItemList[m].noTaxAmount);
    }
    for (let m = 0; m < state.Order.PlanDateList.length; m += 1) {
        state.Order.noTaxAmount += Number(state.Order.PlanDateList[m].noTaxAmount);
    }
  },
}

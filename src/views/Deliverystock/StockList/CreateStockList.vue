<template>
  <div>
    <Percent v-show="isupload" :percentage="percentage"></Percent>
    <div v-loading="loading">
      <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
        <TradeEditsFormI :authbtn="authbtn" :from-edit="totalForm" ref="changeBtnStatus" :isCreatShow="middleBtnShow.isCreatShow" :isDeleteItem="middleBtnShow.isDeleteItem" :tradeEditBtn="tradeEditBtn" :message="editMessage" :isGoBackShow="false" :isExportShow="middleBtnShow.isExportShow" :isImportShow="middleBtnShow.isImportShow" :arrow-num=4 :arrow-down="true" @data-creat="dataCreat" @data-export="dataExport" @data-import="dataImport" @delete-item="deleteItem" @show-more="tableHeightRun">
          <el-form-item label="创建人" prop="stockAll" slot='stockAll'>
            <el-input v-model="totalForm.stockAll" readonly disabled size="small" style="width: 100%; min-width: 120px;"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="deliveryAll" slot='deliveryAll'>
            <el-input v-model="totalForm.deliveryAll" readonly disabled size="small" style="width: 100%; min-width: 120px;"></el-input>
          </el-form-item>
        </TradeEditsFormI>
      </el-form>
      <div>
        <el-table :data="totalForm.stockItemFormList" @selection-change="dataSelect" stripe border fit :height="tableHeight">
          <el-table-column type="selection" width="40" fixed="left" align="center">
          </el-table-column>
          <el-table-column prop="drugsCode" min-width="80" label="药品编码" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="drugsName" min-width="80" label="通用名" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="formName" min-width="80" label="剂型" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="specName" min-width="80" label="规格" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="packSpecName" min-width="80" label="包装规格" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="batchNo" min-width="80" label="批号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="unitName" min-width="80" label="单位" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="stockNum" min-width="100" label="库存数量" sortable show-overflow-tooltip>
            <template scope="scope">
              <el-input class="input-right close-clear" style="width: 98%" slot="reference" size="small" placeholder="请输入内容" @focus="creatFocus(scope.row.stockNum)" @keyup.native="keydown(scope)" @blur="keydown(scope)" v-model.number="scope.row.stockNum">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="producerName" min-width="90" label="生产企业" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="approvalNumber" min-width="80" label="批准文号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="makeDate" min-width="80" label="生产日期" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="validDate" min-width="80" label="有效日期" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="salerMemberName" min-width="110" label="卖方会员" sortable show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div style="float: left;padding-right: 15px;padding-left: 63%">
            <span>总数量：</span>{{totalForm.totalNum}}</div>
        </div>
      </div>
    </div>
    <TradeFooterI :authbtn="authbtn" :btnDisabled="btnDisabled" :isSaveShow="isSaveShow" :isDeleteShow="isDeleteShow" :isSubmitShow="isSubmitShow" :isBackShow="isBackShow" @data-submit="submit" @order-save="orderSave" @order-back="orderBack"></TradeFooterI>
    <EditDialog :options="dialogOptions" @dialog-hide="dialogHide" @dialogSelect="dialogSelectDrugs"></EditDialog>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/19.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert';
import TradeEditsFormI from '../../../components/TradeEditsFormI'; //  引订单目录表单
import TradeFooterI from '../../../components/TradeFooterI'; // 引入订单底部
import EditDialog from './EditDialog';                     // 引入明细弹出窗
import common from '../../../api/common';   // api -- project[集采项目]
import StockList from '../../../api/Deliverystock/StockList';   // 配送单列表接口

export default {
  activated() {
    this.authbtn = StockList.authbtn();
    if (!this.status) {
      this.$router.push({ path: '/Deliverystock/StockList' });
    }
    this.init();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Deliverystock',
        name: '配送企业库存管理',
        noLink: true,
      },
      {
        path: '/Deliverystock/StockList',
        name: '库存列表',
        noLink: false,
      },
      {
        path: '/Deliverystock/StockList/CreateStockList',
        name: '库存创建',
        noLink: true,
      },
    ]);
  },
  watch: {
    authList() {
      this.authbtn = StockList.authbtn();
    },
    getGpoId() {
      // 当切换gpo时，重定向到列表页
      this.$router.push({ path: '/Deliverystock/StockList' });
    },
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  computed: {
    ...mapGetters([
      'getGpoId',
      'gpoOptions',
      'View_UserInfo',
      'status',
      'View_UserInfor',
    ]),
    authList() {
      return this.$store.state.view.authList;
    },
  },
  components: {
    EditDialog,
    TradeEditsFormI,
    TradeFooterI,
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      nowNum: null,
      // 中间的按钮显示隐藏
      middleBtnShow: {
        isCreatShow: true,
        isDeleteItem: true,
        isExportShow: true,
        isImportShow: true,
      },
      tableHeight: 280,
      // 底部按钮显示隐藏
      isSaveShow: true, // 保存按钮
      isBackShow: true, // 返回按钮
      isDeleteShow: false, // 删除按钮
      isSubmitShow: true,  // 提交按钮
      num: 4, // 总数量
      // 新增明细传值 [药品]
      dialogOptions: {
        msgBase: '', //  没什么卵用，有需要可以看看
        isShowDialog: false, //  显示弹框
        tableSelected: null, //  默认表格选中
        tableType: 1, //  0 单选，1 多选 默认单选
        dialogForm: {
          drugsIds: 0,
          gpoMemberId: null,
        },
      },
      // 默认的按钮样式  --  中间的按钮
      tradeEditBtn: {
        createBtn: false,    // 新增
        deleteBtn: true,    // 删除
        exportBtn: false,    // 导出
        importBtn: false,    // 导入
      },
      // 底部按钮状态
      btnDisabled: {
        planSave: false,
        planSubmit: false,
        planDelete: true,
      },
      // 上部分表单字段
      editMessage: {
        tabTitle: '',
        selects: [
          { label: '库存单状态', key: 'statusName', type: 'el-input', isReadonly: true, span: 5 },
          { label: '库存日期', key: 'stockDate', type: 'el-input', isReadonly: true, span: 5 },
          { label: '库存单编号', key: 'code', type: 'el-input', isReadonly: true, span: 5 },
          { value: 'stockAll', type: 'custom', span: 5 },
          // { label: '创建人', key: 'createBy', type: 'el-input', isReadonly: true, span: 6 },
          // { label: '创建时间', key: 'createTime', type: 'el-input', isReadonly: true, span: 12 },
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', isReadonly: true, span: 5 },
          { value: 'deliveryAll', type: 'custom', span: 5 },
          // { label: '联系人', key: 'deliveryPerson', type: 'el-input', isReadonly: true, span: 6 },
          // { label: '联系电话', key: 'deliveryPhone', type: 'el-input', isReadonly: true, span: 6 },
          { label: '备注', key: 'remarks', type: 'el-input', fromType: 'textarea', span: 5, rows: 1, placeholder: '请输入备注' },
        ],
        styleObject: {
          style1: {
            width: '66%',
          },
        },
        parameters: {},
        options: {
          salerOptions: [],
        },
        radios: {},
        rules: {},
      },
      loading: false,
      // 需要提交的全部数据
      totalForm: {
        totalNum: null,
        // top
        statusName: null,
        stockTime: null,
        code: null,
        createBy: null,
        createTime: null,
        // other 提交
        deliveryMemberCode: null,
        deliveryMemberId: null,
        deliveryMemberName: null,
        deliveryPerson: null,
        deliveryPhone: null,
        gpoMemberId: null,
        gpoMemberName: null,
        gpoPerson: null,
        gpoPhone: null,
        remarks: null,
        status: null,
        stockId: null,
        stockItemFormList: [],
        deliveryAll: null,
        stockAll: null,
      },
      // 勾选的列表项 [药品ID]
      selectedDrugs: [],
      percentage: 0,
      isupload: false,
    };
  },
  methods: {
    // 初始化
    init() {
      this.loading = true;
      // 初始化清空数据
      this.emptyData();
      // 获取表头信息
      if (this.getGpoId) {
        this.getTopbarItem();
      }
      // 匹配当前gpoName
      this.getGpoData();
    },
    // 获取头部信息
    getTopbarItem() {
      let contacter = null;
      let phone = null;
      this.totalForm.deliveryMemberCode = this.View_UserInfor.code;
      this.totalForm.deliveryMemberId = this.View_UserInfor.id;
      this.totalForm.deliveryMemberName = this.View_UserInfor.name;
      this.totalForm.gpoMemberId = this.getGpoId;
      this.dialogOptions.dialogForm.gpoMemberId = this.getGpoId;
      this.loading = false;
      if (this.View_UserInfor.contacter === null || this.View_UserInfor.contacter === 'null') {
        contacter = '';
      } else {
        contacter = this.View_UserInfor.contacter;
      }
      if (this.View_UserInfor.phone === null || this.View_UserInfor.phone === 'null') {
        phone = '';
      } else {
        phone = this.View_UserInfor.phone;
      }
      this.totalForm.deliveryPerson = contacter;
      this.totalForm.deliveryPhone = phone;
      this.totalForm.deliveryAll = `${contacter} ${phone}`;
      // this.totalForm.stockAll = `${data[0].gpoContacter} ${data[0].gpoContacterPhone}`;
    },
    // 获取gpo数据
    getGpoData() {
      // gpoID赋值
      this.totalForm.gpoMemberId = this.getGpoId;
      for (let i = 0; i < this.gpoOptions.length; i += 1) {
        if (this.gpoOptions[i].id === this.getGpoId) {
          this.totalForm.gpoMemberName = this.gpoOptions[i].name;
        }
      }
    },
    // 添加明细
    dataCreat() {
      this.dialogOptions.isShowDialog = true;
    },
    dataExport() {
      const form = {
        gpoMemberId: this.getGpoId,
        // deliveryMemberId: this.View_UserInfor.id,
      };
      const url = StockList.output(form);
      window.open(url);
    },
    dataImport(e) {
      const file = e.target.files[0];
      console.log('file.type', file);
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' || file.name.indexOf('.xls') > -1) {
        this.isupload = true;
        const formData = new FormData();
        formData.append('file', file);
        StockList.upload(formData, this.progress).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.percentage = 100;
            setTimeout(() => {
              this.isupload = false;
              this.percentage = 0;
            }, 500);
            this.$message({
              type: 'success',
              message: res.data.message,
            });
            // 导入数据
            const arr = [];
            const arr2 = [];
            let totalNum = 0;
            // console.log('this.totalForm.stockItemFormList', this.totalForm.stockItemFormList);
            for (let i = 0; i < this.totalForm.stockItemFormList.length; i += 1) {
              arr2.push(this.totalForm.stockItemFormList[i].drugsIdBatchNo);
            }
            // console.log('arr2', arr2);
            for (let i = 0; i < data.length; i += 1) {
              data[i].drugsIdBatchNo = `${JSON.stringify(data[i].drugsId)}${data[i].batchNo || ''}`;
              if (Number(data[i].stockoutNum) > 0) {
                if (arr2.indexOf(data[i].drugsIdBatchNo) >= 0) {
                  for (let j = 0;
                    j < this.totalForm.stockItemFormList.length; j += 1) {
                    if (data[i].drugsIdBatchNo
                      === this.totalForm.stockItemFormList[j].drugsIdBatchNo) {
                      // 相同
                      // console.log(22);
                      this.totalForm.stockItemFormList[j].stockNum =
                        data[i].stockoutNum;
                    }
                  }
                } else {
                  // console.log(33);
                  this.totalForm.stockItemFormList.push({
                    approvalNumber: data[i].approvalNumber,
                    batchNo: data[i].batchNo,
                    drugsCode: data[i].drugsCode,
                    drugsId: data[i].drugsId,
                    drugsName: data[i].drugsName,
                    drugsNo: data[i].drugsNo,
                    formName: data[i].formName,
                    makeDate: convert.convertDate(data[i].makeDate),
                    stockoutItemNo: data[i].stockoutItemNo,
                    packSpecName: data[i].packSpecName,
                    producerCode: data[i].producerCode,
                    producerId: data[i].producerId,
                    producerName: data[i].producerName,
                    specName: data[i].specName,
                    salerMemberCode: data[i].salerMemberCode,
                    salerMemberId: data[i].salerMemberId,
                    salerMemberName: data[i].salerMemberName,
                    stockItemId: data[i].stockItemId,
                    stockNum: data[i].stockoutNum,
                    stockoutItemId: data[i].id,
                    tradeName: data[i].tradeName,
                    unitName: data[i].unitName,
                    validDate: convert.convertDate(data[i].validDate),
                    drugsIdBatchNo: `${JSON.stringify(data[i].drugsId)}${data[i].batchNo || ''}`,
                  });
                  arr.push(`${JSON.stringify(data[i].drugsId)}${data[i].batchNo || ''}`);
                }
                // console.log();
              }
            }
            for (let i = 0; i < this.totalForm.stockItemFormList.length; i += 1) {
              totalNum += this.totalForm.stockItemFormList[i].stockNum;
            }
            this.totalForm.totalNum = totalNum;
            this.dialogOptions.dialogForm.drugsIds =
              `${this.dialogOptions.dialogForm.drugsIds},${arr}`;
          } else {
            setTimeout(() => {
              this.isupload = false;
              this.percentage = 0;
            }, 500);
            this.$message({
              type: 'error',
              message: res.data.message,
            });
          }
          this.$bus.$emit('clear/file');
        });
      } else {
        this.$message({
          type: 'error',
          message: '文件格式出错，请导入excel',
        });
      }
    },
    //  进度条
    progress(e) {
      const d = parseInt((100 * e.loaded) / e.total, 0);
      if (d >= 90) {
        this.percentage = 90;
      } else {
        this.percentage = d;
      }
    },
    // 改变药品数量
    //      numChange(data) {  // 数量发生变化的时候触发
    //        let totalNum = 0;
    //        for (let i = 0; i < this.totalForm.stockItemFormList.length; i += 1) {
    //          totalNum += Number(this.totalForm.stockItemFormList[i].stockNum);
    //        }
    //        this.totalForm.totalNum = totalNum;
    //      },
    // 获取当前的数值
    creatFocus(data) {
      // console.log();
      this.nowNum = data;
    },
    // 键盘按钮触发方法
    keydown(data) {
      // console.log();
      if ((data.row.stockNum.toString().search(/\D/) !== -1 || Number(data.row.stockNum) === 0) && data.row.stockNum !== '') {
        // console.log();
        // console.log();
        this.totalForm.stockItemFormList[data.$index].stockNum = this.nowNum;
      } else {
        // console.log();
        let totalNum = 0;
        for (let i = 0; i < this.totalForm.stockItemFormList.length; i += 1) {
          totalNum += Number(this.totalForm.stockItemFormList[i].stockNum);
        }
        this.totalForm.totalNum = totalNum;
        this.nowNum = data.row.stockNum;
      }
      return false;
    },
    // 删除明细操作
    deleteItem() {
      let totalNum = 0;
      const arr = [];
      for (let i = 0; i < this.totalForm.stockItemFormList.length; i += 1) {
        for (let j = 0; j < this.selectedDrugs.length; j += 1) {
          if (this.totalForm.stockItemFormList[i].drugsIdBatchNo === this.selectedDrugs[j]) {
            this.totalForm.stockItemFormList.splice(i, 1);
          }
        }
      }
      if (this.totalForm.stockItemFormList.length > 0) {
        for (let i = 0; i < this.totalForm.stockItemFormList.length; i += 1) {
          const item = this.totalForm.stockItemFormList[i];
          arr.push(`${JSON.stringify(item.drugsId)}${item.batchNo || ''}`);
          totalNum += Number(this.totalForm.stockItemFormList[i].purchaseNum);
        }
      } else {
        this.totalForm.totalNum = 0;
      }
      this.totalForm.totalNum = totalNum;
      if (arr.length > 0) {
        this.dialogOptions.dialogForm.drugsIds = arr;
      } else {
        this.dialogOptions.dialogForm.drugsIds = 0;
      }
    },
    // 关闭弹出框  -- 明细
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    //  判断下部分表格是否有选项，删除明细按钮是否disabled。
    dataSelect(row) {
      this.selectedDrugs = [];
      let first = 0;
      for (let i = 0; i < row.length; i += 1) {
        const item = row[i];
        first += 1;
        this.selectedDrugs.push(`${JSON.stringify(item.drugsId)}${item.batchNo || ''}`);
      }
      if (first > 0) {
        this.tradeEditBtn.deleteBtn = false;
      } else {
        this.tradeEditBtn.deleteBtn = true;
      }
    },
    // 保存操作
    orderSave() {
      this.totalForm.status = 0;    // 保存
      this.toAjax();
    },
    // 提交
    submit() {
      this.totalForm.status = 1;    // 提交
      this.toAjax();
    },
    // 请求
    toAjax() {
      let goCreate = true;
      if (this.totalForm.stockItemFormList.length <= 0) {
        this.$message.error('请输入报量单明细');
        goCreate = false;
      } else {
        const int = /^[0-9]*[1-9][0-9]*$/;         // int
        for (let i = 0; i < this.totalForm.stockItemFormList.length; i += 1) {
          // 数量
          const stockNum = int.test(this.totalForm.stockItemFormList[i].stockNum);
          if (!stockNum) {
            this.$message.error('药品数量格式有误，请重试');
            goCreate = false;
          }
          if (!this.totalForm.stockItemFormList[i].stockNum) {
            this.$message.error('请输入药品数量');
            goCreate = false;
          }
        }
      }
      if (goCreate) {
        this.loading = true;
        StockList.saveorupdate(this.totalForm).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '保存成功',
            });
            this.loading = false;
            history.back();
          }
        });
      }
    },
    // 返回上一页
    orderBack() { // 返回按钮触发事件
      history.back();
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['#from-item', '.TradeFooter', 200]);
      };
      setTimeout(tableHeightFun, 0);
    },
    //  弹出框选择之后确定事件  -- 药品
    dialogSelectDrugs(rows, msgBase, msgCom) {
      const arr = [];
      if (rows[0]) {
        for (let i = 0; i < rows.length; i += 1) {
          this.totalForm.stockItemFormList.push({
            approvalNumber: rows[i].approvalNumber,
            batchNo: rows[i].batchNo,
            drugsCode: rows[i].drugsCode,
            drugsId: rows[i].drugsId,
            drugsName: rows[i].drugsName,
            drugsNo: rows[i].drugsNo,
            formName: rows[i].formName,
            makeDate: rows[i].makeDate,
            packSpecName: rows[i].packSpecName,
            producerCode: rows[i].producerCode,
            stockoutItemNo: rows[i].stockoutItemNo,
            producerId: rows[i].producerId,
            producerName: rows[i].producerName,
            salerMemberCode: rows[i].salerMemberCode,
            salerMemberId: rows[i].salerMemberId,
            salerMemberName: rows[i].salerMemberName,
            specName: rows[i].specName,
            stockItemId: rows[i].stockItemId,
            stockNum: null,
            stockoutItemId: rows[i].id,
            tradeName: rows[i].tradeName,
            unitName: rows[i].unitName,
            validDate: rows[i].validDate,
            drugsIdBatchNo: `${JSON.stringify(rows[i].drugsId)}${rows[i].batchNo || ''}`,
          });
          const drugsIdBatchNo = `${JSON.stringify(rows[i].drugsId)}${rows[i].batchNo || ''}`;
          arr.push(drugsIdBatchNo);
        }
        // console.log();
        this.dialogOptions.dialogForm.drugsIds =
          `${this.dialogOptions.dialogForm.drugsIds},${arr}`;
      }
    },
    // 清空数据
    emptyData() {
      this.editMessage.options.salerOptions = [];
      this.dialogOptions.dialogForm.drugsIds = 0;
      this.totalForm = {
        totalNum: null,
        // top
        statusName: null,
        stockTime: null,
        code: null,
        createBy: null,
        createTime: null,
        // other 提交
        deliveryMemberCode: null,
        deliveryMemberId: null,
        deliveryMemberName: null,
        deliveryPerson: null,
        deliveryPhone: null,
        gpoMemberId: null,
        gpoMemberName: null,
        gpoPerson: null,
        gpoPhone: null,
        remarks: null,
        status: null,
        stockId: null,
        stockItemFormList: [],
        deliveryAll: null,
        stockAll: null,
      };
      this.tradeEditBtn = {
        createBtn: false,        // 新增
        deleteBtn: true,        // 删除
        exportBtn: false,        // 导出
        importBtn: false,        // 导入
      };
      this.btnDisabled.planSave = false;
      this.btnDisabled.planSubmit = false;
    },
  },
};
</script>

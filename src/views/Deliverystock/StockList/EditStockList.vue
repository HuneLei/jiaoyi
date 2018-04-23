<template>
  <div>
    <Percent v-show="isupload" :percentage="percentage"></Percent>
    <div v-loading="loading">
      <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
        <TradeEditsFormI :authbtn="authbtn" :from-edit="totalForm" ref="changeBtnStatus" :isCreatShow="middleBtnShow.isCreatShow" :isDeleteItem="middleBtnShow.isDeleteItem" :tradeEditBtn="tradeEditBtn" :message="editMessage" :isGoBackShow="false" :isExportShow="middleBtnShow.isExportShow" :isImportShow="middleBtnShow.isImportShow" :arrow-num=2 :arrow-down="true" @data-creat="dataCreat" @data-export="dataExport" @data-import="dataImport" @delete-item="deleteItem" @show-more="tableHeightRun">
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
          <el-table-column prop="stockNum" min-width="80" label="库存数量" sortable show-overflow-tooltip>
            <template scope="scope">
              <el-input class="input-right close-clear" style="width: 98%" slot="reference" size="small" placeholder="请输入内容" @focus="creatFocus(scope.row.stockNum)" @keyup.native="keydown(scope)" @blur="keydown(scope)" v-model="scope.row.stockNum">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="producerName" min-width="90" label="生产企业" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="approvalNumber" min-width="80" label="批准文号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="makeDate" min-width="140" label="生产日期" sortable show-overflow-tooltip>
            <template scope="scope">
              <span>{{convertDate(scope.row.makeDate)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="validDate" min-width="140" label="有效日期" sortable show-overflow-tooltip>
            <template scope="scope">
              <span>{{convertDate(scope.row.validDate)}}</span>
            </template>
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
    <TradeFooterI :authbtn="authbtn" :btnDisabled="btnDisabled" :isSaveShow="isSaveShow" :isDeleteShow="isDeleteShow" :isSubmitShow="isSubmitShow" :isBackShow="isBackShow" @data-submit="submit" @order-save="orderSave" @order-delete="orderDelete" @order-back="orderBack"></TradeFooterI>
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
import TradeEditsFormI from '../../../components/TradeEditsFormI';        // 引表单
import TradeFooterI from '../../../components/TradeFooterI';              // 引入底部
import EditDialog from './EditDialog';                                    // 引入明细弹出窗
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
        path: '/Deliverystock/StockList/EditStockList',
        name: '库存编辑',
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
      'View_UserInfor',
      'status',
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
      nowNum: null,
      // 中间的按钮显示隐藏
      middleBtnShow: {
        isCreatShow: false,
        isDeleteItem: true,
        isExportShow: false,
        isImportShow: false,
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
      // 表头获取
      topbarForm: {
        id: null,
      },
      // 默认的按钮样式  --  中间的按钮
      tradeEditBtn: {
        createBtn: true,    // 新增
        deleteBtn: true,    // 删除
        exportBtn: true,    // 导出
        importBtn: true,    // 导入
      },
      // 底部按钮状态
      btnDisabled: {
        planSave: true,
        planSubmit: true,
        planDelete: true,
      },
      // 权限控制
      authbtn: {},
      // 上部分表单字段
      editMessage: {
        tabTitle: '',
        selects: [
          { label: '库存单状态', key: 'statusName', type: 'el-input', isReadonly: true, span: 5 },
          { label: '库存日期', key: 'stockDate', type: 'el-input', isReadonly: true, span: 5 },
          { label: '库存单编号', key: 'code', type: 'el-input', isReadonly: true, span: 5 },
          { value: 'stockAll', type: 'custom', span: 5 },
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', isReadonly: true, span: 5 },
          { value: 'deliveryAll', type: 'custom', span: 5 },
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
        // 存储
        salerMemberCode: null,
        salerMemberId: null,
        salerMemberName: null,
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
        stockItemFormList: null,
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
      // 初始化清空数据
      this.emptyData();
      // 获取已选药品列表
      this.getSelectedDrugs();
      // 获取表头信息
      if (this.getGpoId) {
        this.getTopbarItem();
      }
      this.loading = true;
      this.middleBtnShow = {
        isCreatShow: true,
        isDeleteItem: true,
        isExportShow: true,
        isImportShow: true,
      };
      this.isSaveShow = true;   // 保存按钮
      this.isBackShow = true;   // 返回按钮
      this.isDeleteShow = true; // 删除按钮
      this.isSubmitShow = true;  // 提交按钮
      this.tradeEditBtn = {
        createBtn: false,    // 新增
        deleteBtn: true,    // 删除
        exportBtn: false,    // 导出
        importBtn: false,    // 导入
      };
      // 底部按钮状态
      this.btnDisabled = {
        planSave: false,
        planSubmit: false,
        planDelete: false,
      };
    },
    // 获取头部信息
    getTopbarItem() {
      this.topbarForm.id = this.$route.query.id;
      StockList.item(this.topbarForm).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          let deliveryPerson = null;
          let deliveryPhone = null;
          let createBy = null;
          let createTime = null;
          if (data.deliveryPerson === null || data.deliveryPerson === 'null') {
            deliveryPerson = '';
          } else {
            deliveryPerson = data.deliveryPerson;
          }
          if (data.deliveryPhone === null || data.deliveryPhone === 'null') {
            deliveryPhone = '';
          } else {
            deliveryPhone = data.deliveryPhone;
          }
          if (data.createBy === null || data.createBy === 'null') {
            createBy = '';
          } else {
            createBy = data.createBy;
          }
          if (data.createTime === null || data.createTime === 'null') {
            createTime = '';
          } else {
            createTime = data.createTime;
          }
          this.totalForm.deliveryAll = `${deliveryPerson} ${deliveryPhone}`;
          this.totalForm.stockAll = `${createBy} ${createTime}`;
          // 存储
          this.totalForm.salerMemberCode = data.salerMemberCode;
          this.totalForm.salerMemberId = data.salerMemberId;
          this.totalForm.salerMemberName = data.salerMemberName;
          // 表头
          this.totalForm.statusName = '待提交';
          this.totalForm.status = data.status;
          this.totalForm.stockDate = convert.convertDate(data.stockDate);
          this.totalForm.code = data.code;
          this.totalForm.createBy = data.createBy;
          this.totalForm.createTime = data.createTime;
          this.totalForm.deliveryMemberName = data.deliveryMemberName;
          this.totalForm.deliveryPerson = data.deliveryPerson;
          this.totalForm.deliveryPhone = data.deliveryPhone;
          this.totalForm.remarks = data.remarks;
          // 提交
          this.totalForm.deliveryMemberCode = data.deliveryMemberCode;
          this.totalForm.deliveryMemberId = data.deliveryMemberId;
          this.totalForm.gpoMemberId = data.gpoMemberId;
          this.totalForm.gpoMemberName = data.gpoMemberName;
          this.totalForm.gpoPerson = data.gpoPerson;
          this.totalForm.gpoPhone = data.gpoPhone;
          this.totalForm.stockId = Number(data.stockId);
          // this.totalForm.stockItemFormList = data.stockItemFormList;
          // 弹窗药品
          this.dialogOptions.dialogForm.gpoMemberId = data.gpoMemberId;
          this.loading = false;
        }
      });
    },
    // 获取已选药品列表
    getSelectedDrugs() {
      const stockId = Number(this.$route.query.id);
      StockList.itemAll(stockId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          const arr = [];
          this.totalForm.stockItemFormList = data;
          for (let i = 0; i < data.length; i += 1) {
            this.totalForm.totalNum += data[i].stockNum;
            data[i].drugsIdBatchNo = `${JSON.stringify(data[i].drugsId)}${data[i].batchNo || ''}`;
            arr.push(`${JSON.stringify(data[i].drugsId)}${data[i].batchNo || ''}`);
          }
          this.dialogOptions.dialogForm.drugsIds = arr;
          this.loading = false;
        }
      });
    },
    // 添加明细
    dataCreat() {
      this.dialogOptions.isShowDialog = true;
    },
    dataExport() {
      const form = {
        gpoMemberId: this.getGpoId,
        deliveryMemberId: this.View_UserInfor.id,
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
            for (let i = 0; i < this.totalForm.stockItemFormList.length; i += 1) {
              arr2.push(this.totalForm.stockItemFormList[i].drugsIdBatchNo);
            }
            for (let i = 0; i < data.length; i += 1) {
              data[i].drugsIdBatchNo = `${JSON.stringify(data[i].drugsId)}${data[i].batchNo || ''}`;
              if (Number(data[i].stockoutNum) > 0) {
                if (arr2.indexOf(data[i].drugsIdBatchNo) >= 0) {
                  for (let j = 0;
                    j < this.totalForm.stockItemFormList.length; j += 1) {
                    if (data[i].drugsIdBatchNo
                      === this.totalForm.stockItemFormList[j].drugsIdBatchNo) {
                      // 相同
                      this.totalForm.stockItemFormList[j].stockNum =
                        data[i].stockoutNum;
                    }
                  }
                } else {
                  this.totalForm.stockItemFormList.push({
                    approvalNumber: data[i].approvalNumber,
                    batchNo: data[i].batchNo,
                    drugsCode: data[i].drugsCode,
                    drugsId: data[i].drugsId,
                    drugsName: data[i].drugsName,
                    drugsNo: data[i].drugsNo,
                    formName: data[i].formName,
                    makeDate: data[i].makeDate,
                    packSpecName: data[i].packSpecName,
                    producerCode: data[i].producerCode,
                    producerId: data[i].producerId,
                    producerName: data[i].producerName,
                    specName: data[i].producerName,
                    stockItemId: data[i].stockItemId,
                    stockNum: data[i].stockoutNum,
                    salerMemberCode: data[i].salerMemberCode,
                    salerMemberId: data[i].salerMemberId,
                    salerMemberName: data[i].salerMemberName,
                    stockoutItemId: data[i].id,
                    tradeName: data[i].tradeName,
                    unitName: data[i].unitName,
                    validDate: data[i].validDate,
                    drugsIdBatchNo: `${JSON.stringify(data[i].drugsId)}${data[i].batchNo || ''}`,
                  });
                  arr.push(`${JSON.stringify(data[i].drugsId)}${data[i].batchNo || ''}`);
                }
              }
            }
            for (let i = 0; i < this.totalForm.stockItemFormList.length; i += 1) {
              totalNum += Number(this.totalForm.stockItemFormList[i].stockoutNum);
            }
            this.totalForm.totalNum = totalNum;
            this.dialogOptions.dialogForm.drugsId =
              `${this.dialogOptions.dialogForm.drugsId},${arr}`;
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
    orderSave() { // 保存按钮触发事件
      this.totalForm.id = this.$route.query.id;
      this.totalForm.status = 0;            // 保存
      this.toAjax();
    },
    // 提交
    submit() {
      this.totalForm.id = this.$route.query.id;
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
    // 删除单
    orderDelete() { // 删除按钮触发事件
      this.loading = true;
      const arrId = [];
      arrId.push(Number(this.$route.query.id));  // 将获取的id值转化为数组类型
      StockList.deleteP(arrId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.$message({
            type: 'success',
            message: '删除成功',
          });
          this.loading = false;
          history.back();
        }
      });
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
          arr.push(`${JSON.stringify(rows[i].drugsId)}${rows[i].batchNo || ''}`);
        }
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
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>

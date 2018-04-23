<template>
  <div class="notdelivery-table">
    <el-dialog title="配送单（非货票同行）" :visible.sync="dialogFormShow" @close="closeDialog" @open="dialogOpen" size="large" :close-on-click-modal="false">
      <div v-loading="loading">
        <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
          <TradeEditsForm :from-edit="Order_PlanfromEdit" :message="editMessage" :isGoBackShow="false" :purchase="Order_purchaseAmount">
            <el-form-item label="随货同行单" slot="scanFile">
              <y-upload-edit :image="true" :pdf="false" :fileList="uploadScanFile" @upload-result="uploadFile"></y-upload-edit>
            </el-form-item>
          </TradeEditsForm>
        </el-form>
        <div>
          <el-table :data="NotDeliveryListAll" stripe border fit :height="300">
            <el-table-column prop="num" label="#" width="40" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="code" min-width="100" label="订单编号" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="hospitalMemberName" min-width="180" label="医疗机构" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="drugsName" min-width="120" label="通用名" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="specName" min-width="90" label="规格" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="packSpecName" min-width="90" label="包装规格" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="formName" min-width="90" label="剂型" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="unitName" min-width="60" label="单位" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="right" prop="hospitalUnitPrice" min-width="70" label="单价" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="right" prop="purchaseAmount" min-width="90" label="发货金额" sortable show-overflow-tooltip>
              <template scope="scope">
                <span>{{scope.row.purchaseAmount.toFixed(2)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="producerName" min-width="180" label="生产企业" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="right" prop="purchaseNum" min-width="80" label="未发货数量" show-overflow-tooltip fixed="right">
            </el-table-column>
            <el-table-column align="right" min-width="80" label="发货数量" show-overflow-tooltip fixed="right">
              <template scope="scope">
                <el-input :class="scope.row.OutStyle" class="input-right close-clear" style="width: 98%" slot="reference" size="small" placeholder="请输入内容" @focus="creatFocus(scope.row.drugsNum)" @keyup.native="keydown(scope.row.drugsNum, scope.row.hospitalUnitPrice, scope.$index, scope.row.purchaseNum, scope.row.BatchNum)" @blur="keydown(scope.row.drugsNum, scope.row.hospitalUnitPrice, scope.$index, scope.row.purchaseNum, scope.row.BatchNum)" v-model="scope.row.drugsNum">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column min-width="130" label="批号" fixed="right">
              <template scope="scope">
                <el-select filterable v-model="batchNo[scope.$index]" placeholder="请选择" size="small" style="width: 98%" @change="BatchChange(batchNo[scope.$index], scope.$index, scope.row.drugsCode)" @visible-change="(value) => visibleChange(value, scope.row.drugsCode, scope.$index)" clearable>
                  <el-option v-for="item in GrugsListAll[scope.$index]" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="药检报告" align="center" min-width="100" max-width="200">
              <template scope="scope">
                <YuploadFiles :data="convert.getJSON(drugsReportFile[scope.$index])"></YuploadFiles>
              </template>
            </el-table-column>
            <el-table-column min-width="100" label="生产日期" sortable show-overflow-tooltip>
              <template scope="scope">
                <span>{{makeDate[scope.$index]==''?'':convertDate(makeDate[scope.$index])}}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="100" label="有效日期" sortable show-overflow-tooltip>
              <template scope="scope">
                <span>{{validDate[scope.$index]==''?'':convertDate(validDate[scope.$index])}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="contractItemNo" min-width="135" label="合同明细编号" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" min-width="130" fixed="right" align="center">
              <template scope="scope">
                <el-button type="text" @click="batchNoPart(scope.$index)" v-if="!scope.row.operate" :disabled="scope.row.RowDisabled">
                  拆分批号
                </el-button>
                <el-button type="text" @click="batchNoDeletes(scope.row.num)" v-if="scope.row.num">
                  删除
                </el-button>
                <el-button type="text" @click="batchNoDelete(scope.$index)" v-if="scope.row.operate">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <div style="float: left;padding-right: 15px;padding-left: 63%">
              <span>总发货金额:</span>
              {{purchaseAmountAll.toFixed(2)}}
              <span>元</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dataSubmit" :disabled='!NotDeliveryListAll.length' :loading="loading">确定发货</el-button>
        <el-button @click="dialogClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * Created by yaoling on 2017/9/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import application from '../../../api/BasicInfo/Project';
import TradeEditsForm from '../../../components/TradeEditsForm';          //  引订单目录表单
import StepsFrom from '../../../components/StepsFrom';                    // 引入加载条组件
import DeliveryOrdersList from '../../../api/Order/DeliveryOrdersList';   // 订单(配送企业api)
import convert from '../../../utils/convert';

export default {
  watch: {
    Order_NotDeliveryShow(val) {     // 监听dialogFormVisible值变化组件显示隐藏
      this.dialogFormShow = val;
    },
  },
  computed: mapGetters([
    'Order_purchaseAmount',
    'Order_NotDeliveryList',
    'Order_purchaseNum',
    'View_TableHeight',
    'Order_PlanfromEdit',
    'Order_NotDeliveryShow',
    'Order_purchaseAmount',
    'Order_BatchNoNum',
    'Order_GrugsList',
    'getGpoId',
  ]),
  components: {
    TradeEditsForm,
    StepsFrom,
  },
  data() {
    return {
      purchaseAmountAll: 0, // 总发货金额
      batchNo: [],
      makeDate: [],
      validDate: [],
      drugsReportFile: [],
      uploadScanFile: [],
      BatchNoLists: [],
      NotDeliveryListAll: [],
      GrugsListAll: [],
      OutStyle: '',
      dialogFormShow: false,
      editMessage: {
        tabTitle: '',
        selects: [
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', placeholder: '请输入配送企业', isReadonly: true, span: 6, fromStyle: 'style1' },
          { label: '发货联系人', key: 'sendPerson', type: 'el-input', placeholder: '请输入联系人', span: 6, fromStyle: 'style1' },
          { label: '联系人电话', key: 'sendPhone', type: 'el-input', placeholder: '请输入联系人电话', span: 6, fromStyle: 'style1' },
          { label: '条码号', key: 'sendNoOut', type: 'el-input', placeholder: '请输入条码号', span: 6, fromStyle: 'style1' },
          { label: '配送单编号', key: 'ordersId', type: 'el-input', placeholder: '自动生成', isReadonly: true, span: 6, fromStyle: 'style1' },
          { value: 'scanFile', type: 'custom', isReadonly: true, span: 18 },
        ],
        styleObject: {
          style1: {
            width: '85%',
          },
        },
        parameters: {},
        options: {
          typeOption: [],
          addressOption: [],
        },
        radios: {},
        rules: {
          sendPerson: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
          sendPhone: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
        },
      },
      loading: false,
    };
  },
  methods: {
    // 下拉框出现的时候触发
    visibleChange(event, drugsCode, index) {
      if (event) {
        const deliveryMemberId = this.Order_PlanfromEdit.deliveryMemberId;
        DeliveryOrdersList.drugslist(drugsCode, deliveryMemberId).then((res) => {
          if (res.data.code === 0) {
            const drugslist = res.data.result;
            drugslist.drugsCode = drugsCode;
            for (let i = 0; i < drugslist.length; i += 1) {
              drugslist[i].value = `${drugslist[i].id}$${drugslist[i].batchNo}`;
              drugslist[i].label = drugslist[i].batchNo;
              drugslist[i].index = i;
            }
            this.$set(this.GrugsListAll, index, drugslist);
          }
        });
      }
    },
    uploadFile(res) {
      this.Order_PlanfromEdit.scanFile = res;
      this.uploadScanFile = this.convert.getJSON(this.Order_PlanfromEdit.scanFile);
    },
    // 当批号改变的时候触发
    BatchChange(index, key, code) {
      if (index) {
        for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
          if (this.NotDeliveryListAll[i].batchNo === index && (i !== key)) {
            this.$message({
              type: 'error',
              message: '批号不能重复',
            });
            this.$set(this.batchNo, key, '');
            return;
          }
        }
        if (this.GrugsListAll.length) {
          for (let i = 0; i < this.GrugsListAll.length; i += 1) {
            if (this.GrugsListAll[i]) {
              for (let n = 0; n < this.GrugsListAll[i].length; n += 1) {
                const GrugsOne = this.GrugsListAll[i][n];
                let info = [];
                info = index.split('$');
                if (GrugsOne.drugsCode === code && GrugsOne.batchNo === info[1]) {
                  this.$set(this.makeDate, key, GrugsOne.makeDate);
                  this.$set(this.validDate, key, GrugsOne.validDate);
                  this.$set(this.drugsReportFile, key, GrugsOne.drugsReportFile);
                  this.NotDeliveryListAll[key].makeDate = GrugsOne.makeDate;
                  this.NotDeliveryListAll[key].validDate = GrugsOne.validDate;
                  this.NotDeliveryListAll[key].drugsReportFile = GrugsOne.drugsReportFile;
                }
              }
            }
          }
        }
        this.NotDeliveryListAll[key].batchNo = index;
      } else {
        this.NotDeliveryListAll[key].batchNo = index;
        this.NotDeliveryListAll[key].makeDate = '';
        this.NotDeliveryListAll[key].validDate = '';
        this.NotDeliveryListAll[key].drugsReportFile = '';
        this.$set(this.makeDate, key, '');
        this.$set(this.validDate, key, '');
        this.$set(this.drugsReportFile, key, '');
      }
    },
    // 获取当前的数值
    creatFocus(data) {
      this.nowNum = data;
    },
    // 键盘按钮触发方法
    keydown(data, res, index, key, num) {
      if ((data.toString().search(/\D/) !== -1 || Number(data) === 0) && data !== '') {
        this.NotDeliveryListAll[index].drugsNum = this.nowNum;
        this.$set(this.NotDeliveryListAll[index], 'drugsNum', this.nowNum);
      } else {
        const ItemListNum = this.NotDeliveryListAll[index].drugsNum;
        const ItemListPrice = this.NotDeliveryListAll[index].hospitalUnitPrice;
        this.NotDeliveryListAll[index].purchaseAmount = ItemListNum * ItemListPrice;
        this.nowNum = data;
      }
      const NotList = this.NotDeliveryListAll;
      let BatchNumAll = 0;
      this.purchaseAmountAll = 0;
      for (let i = 0; i < NotList.length; i += 1) {
        this.purchaseAmountAll += NotList[i].purchaseAmount;
      }
      for (let i = 0; i < NotList.length; i += 1) {
        if (Number(NotList[i].BatchNum) === num) {
          BatchNumAll = Number(BatchNumAll) + Number(NotList[i].drugsNum);
        }
      }
      if (key <= BatchNumAll) {
        this.RowDisabled([index, true, key, BatchNumAll]);
        this.OutStyle = this.OutStyle === 'in-num' ? 'nn-num' : 'in-num';
      } else {
        this.RowDisabled([index, false]);
        this.OutStyle = this.OutStyle === 'in-num' ? 'nn-num' : 'in-num';
      }
      this.$set(this.NotDeliveryListAll, 0, this.NotDeliveryListAll[0]);
      return false;
    },
    // 打开弹出框时调用
    dialogOpen() {
      this.batchNo.length = 0;
      this.makeDate.length = 0;
      this.validDate.length = 0;
      this.drugsReportFile.length = 0;
      this.purchaseAmountAll = 0;
      this.NotDeliveryListAll = [];
      this.uploadScanFile = [];
      this.GrugsListAll = [];
      this.NewGrugsList();
      const NotDeliveryList = Object.assign([], this.Order_NotDeliveryList);
      const GrugsList = Object.assign([], this.Order_GrugsList);
      for (let i = 0; i < this.Order_NotDeliveryList.length; i += 1) {
        NotDeliveryList[i] = Object.assign({}, this.Order_NotDeliveryList[i]);
        NotDeliveryList[i].purchaseNumAll = this.Order_NotDeliveryList[i].purchaseNum;
        GrugsList[i] = {};
      }
      this.NotDeliveryListAll = NotDeliveryList;
      this.GrugsListAll = GrugsList;
      for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
        this.batchNo[i] = '';
        this.makeDate[i] = '';
        this.validDate[i] = '';
        this.drugsReportFile[i] = '';
        this.NotDeliveryListAll[i].batchNo = this.batchNo[i];
        this.NotDeliveryListAll[i].makeDate = this.makeDate[i];
        this.NotDeliveryListAll[i].validDate = this.validDate[i];
        this.NotDeliveryListAll[i].drugsReportFile = this.drugsReportFile[i];
        this.NotDeliveryListAll[i].purchaseAmount =
          this.NotDeliveryListAll[i].hospitalUnitPrice * this.NotDeliveryListAll[i].drugsNum;
        this.purchaseAmountAll += this.NotDeliveryListAll[i].purchaseAmount;
      }
      this.Order_PlanfromEdit.sendPerson = this.NotDeliveryListAll[0].deliverPersons || '';
      this.Order_PlanfromEdit.sendPhone = this.NotDeliveryListAll[0].deliverPhones || '';
    },
    // 拆分批号
    batchNoPart(index) {
      this.purchaseAmountAll = 0;
      this.batchNoParts(index);
      this.RowDisabled([index, true]);
      for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
        this.batchNo[i] = this.NotDeliveryListAll[i].batchNo;
        this.makeDate[i] = this.NotDeliveryListAll[i].makeDate;
        this.validDate[i] = this.NotDeliveryListAll[i].validDate;
        this.drugsReportFile[i] = this.NotDeliveryListAll[i].drugsReportFile;
        this.NotDeliveryListAll[i].purchaseAmount =
          this.NotDeliveryListAll[i].hospitalUnitPrice * this.NotDeliveryListAll[i].drugsNum;
        this.purchaseAmountAll += this.NotDeliveryListAll[i].purchaseAmount;
      }
    },
    // 拆分批号
    batchNoParts(data) {
      const BatchList = Object.assign({}, this.NotDeliveryListAll[data]);
      let BatchNumAll = 0;
      let num = 0;
      for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
        const BatchNum = Number(this.NotDeliveryListAll[i].BatchNum);
        const nums = Number(this.NotDeliveryListAll[data].num);
        if (BatchNum === nums) {
          BatchNumAll = Number(BatchNumAll) + Number(this.NotDeliveryListAll[i].drugsNum);
          num += 1;
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
      this.NotDeliveryListAll.splice(num + data, 0, BatchList);
      const GrugsOne = Object.assign({}, this.GrugsListAll[data]);
      this.GrugsListAll.splice(num + data, 0, GrugsOne);
    },
    // 删除拆分的批号
    batchNoDelete(index) {
      this.purchaseAmountAll = 0;
      this.BatchNoDelete(index);
      for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
        this.batchNo[i] = this.NotDeliveryListAll[i].batchNo;
        this.makeDate[i] = this.NotDeliveryListAll[i].makeDate;
        this.validDate[i] = this.NotDeliveryListAll[i].validDate;
        this.drugsReportFile[i] = this.NotDeliveryListAll[i].drugsReportFile;
        this.NotDeliveryListAll[i].purchaseAmount =
          this.NotDeliveryListAll[i].hospitalUnitPrice * this.NotDeliveryListAll[i].drugsNum;
        this.purchaseAmountAll += this.NotDeliveryListAll[i].purchaseAmount;
      }
    },
    // 删除拆分的批号
    BatchNoDelete(data) {
      const BatchNum = Number(this.NotDeliveryListAll[data].BatchNum);
      const purchaseNum = Number(this.NotDeliveryListAll[data].purchaseNum);
      this.NotDeliveryListAll.splice(data, 1);
      this.GrugsListAll.splice(data, 1);
      let num = 0;
      let pasce = 0;
      for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
        if (Number(this.NotDeliveryListAll[i].BatchNum) === BatchNum) {
          pasce = Number(pasce) + Number(this.NotDeliveryListAll[i].drugsNum);
          if (BatchNum === Number(this.NotDeliveryListAll[i].num)) {
            num = i;
          }
        }
      }
      if (pasce < purchaseNum) {
        this.NotDeliveryListAll[num].RowDisabled = false;
      } else {
        this.NotDeliveryListAll[num].RowDisabled = true;
      }
    },
    // 删除主拆分的批号
    batchNoDeletes(num) {
      const ret = '确定删除吗?';
      this.$confirm(ret, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.purchaseAmountAll = 0;
        this.BatchNoDeletes(num);
        for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
          this.batchNo[i] = this.NotDeliveryListAll[i].batchNo;
          this.makeDate[i] = this.NotDeliveryListAll[i].makeDate;
          this.validDate[i] = this.NotDeliveryListAll[i].validDate;
          this.drugsReportFile[i] = this.NotDeliveryListAll[i].drugsReportFile;
          this.NotDeliveryListAll[i].purchaseAmount =
            this.NotDeliveryListAll[i].hospitalUnitPrice * this.NotDeliveryListAll[i].drugsNum;
          this.purchaseAmountAll += this.NotDeliveryListAll[i].purchaseAmount;
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 删除主拆分的批号
    BatchNoDeletes(data) {
      const BatchNum = Number(data);
      let Nwei = -1;
      let Snum = 0;
      for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
        const BatchNums = Number(this.NotDeliveryListAll[i].BatchNum);
        const nums = Number(this.NotDeliveryListAll[i].num);
        if (BatchNums === BatchNum || nums === BatchNum) {
          if (Nwei === -1) {
            Nwei = i;
          }
          Snum += 1;
        }
      }
      this.NotDeliveryListAll.splice(Nwei, Snum);
      this.GrugsListAll.splice(Nwei, Snum);
    },
    // 控制是否可以拆分
    RowDisabled(data) {
      let num = 0;
      for (let i = 0; i <= data[0]; i += 1) {
        const BatchNums = Number(this.NotDeliveryListAll[i].BatchNum);
        const BatchNumtwo = Number(this.NotDeliveryListAll[data[0]].BatchNum);
        if (BatchNums === BatchNumtwo) {
          num += 1;
        }
      }
      this.NotDeliveryListAll[(data[0] + 1) - num].RowDisabled = data[1];
      const BatchNum = Number(this.NotDeliveryListAll[data[0]].BatchNum);
      const purchaseNum = Number(this.NotDeliveryListAll[data[0]].purchaseNum);
      let key = 0;
      let pasce = 0;
      for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
        if (Number(this.NotDeliveryListAll[i].BatchNum) === BatchNum) {
          pasce = Number(pasce) + Number(this.NotDeliveryListAll[i].drugsNum);
          if (BatchNum === Number(this.NotDeliveryListAll[i].num)) {
            key = i;
          }
        }
      }
    },
    // 取消按钮
    dialogClose() {
      this.closeDialog();
    },
    // 确认发货按钮
    dataSubmit() {
      let preces = 0;
      let num = 0;
      let purchase = 0;
      let batchNoNum = 0;
      let drugsNumNum = 0;
      for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
        if (this.NotDeliveryListAll[i].batchNo) {
          batchNoNum += 1;
        }
        if (this.NotDeliveryListAll[i].drugsNum) {
          drugsNumNum += 1;
        }
      }
      for (let i = 0; i < this.NotDeliveryListAll.length; i += 1) {
        num = 0;
        preces = 0;
        if (this.NotDeliveryListAll[i].num) {
          preces = Number(this.NotDeliveryListAll[i].purchaseNum);
          for (let n = 0; n < this.NotDeliveryListAll.length; n += 1) {
            if (this.NotDeliveryListAll[i].num === this.NotDeliveryListAll[n].BatchNum) {
              const Delivery = this.NotDeliveryListAll[n];
              purchase += (Number(Delivery.drugsNum) * Number(Delivery.hospitalUnitPrice));
              num += Number(this.NotDeliveryListAll[n].drugsNum);
              // if (!Number(this.NotDeliveryListAll[n].drugsNum)) {
              //   this.$message({
              //     type: 'error',
              //     message: '发货数量不能为0或者为空',
              //   });
              //   return;
              // }
              if (drugsNumNum === 0) {
                this.$message({
                  type: 'error',
                  message: '至少有一条发货数量不能为空',
                });
                return;
              }
              // if (!this.NotDeliveryListAll[n].batchNo) {
              //   this.$message({
              //     type: 'error',
              //     message: '批号不能为空',
              //   });
              //   return;
              // }
              if (batchNoNum === 0) {
                this.$message({
                  type: 'error',
                  message: '至少有一条批号不能为空',
                });
                return;
              }
            }
          }
          if (preces < num) {
            this.$message({
              type: 'error',
              message: '可发货数量不足',
            });
            return;
          }
        }
      }
      const sendPerson = this.Order_PlanfromEdit.sendPerson;
      const sendPhone = this.Order_PlanfromEdit.sendPhone;
      if ((sendPerson === '' || sendPerson === null || !sendPerson) && (sendPhone === '' || sendPhone === null || !sendPhone)) {
        this.$message({
          type: 'error',
          message: '联系人和联系电话不能为空',
        });
        return;
      }
      if (sendPerson === '' || sendPerson === null || !sendPerson) {
        this.$message({
          type: 'error',
          message: '联系人不能为空',
        });
        return;
      }
      if (sendPhone === '' || sendPhone === null || !sendPhone) {
        this.$message({
          type: 'error',
          message: '联系电话不能为空',
        });
        return;
      }
      const datelist = [];
      for (let y = 0; y < this.NotDeliveryListAll.length; y += 1) {
        datelist[y] = Object.assign({}, this.NotDeliveryListAll[y]);
        let info = [];
        info = datelist[y].batchNo.split('$');
        datelist[y].batchId = Number(info[0]);
        datelist[y].batchNo = info[1];
      }
      const dataListChoose = [];
      for (let m = 0; m < datelist.length; m += 1) {
        if (datelist[m].batchNo && datelist[m].drugsNum) {
          dataListChoose.push(datelist[m]);
        }
      }
      if (this.Order_PlanfromEdit.sendNoOut === ' ') {
        this.Order_PlanfromEdit.sendNoOut = '';
      }
      const from = {
        amount: purchase,
        deliveryAddress: this.Order_PlanfromEdit.receiveAddress,
        deliveryPerson: this.Order_PlanfromEdit.sendPerson,
        deliveryPhone: this.Order_PlanfromEdit.sendPhone,
        gpoMemberId: this.getGpoId,
        ordersId: this.$route.query.id,
        sendNoOut: this.Order_PlanfromEdit.sendNoOut,
        billAccessories: this.Order_PlanfromEdit.scanFile,
        tmsInvoiceItemFormList: dataListChoose,
      };
      this.loading = true;
      DeliveryOrdersList.notdelivery(from).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '发货成功',
          });
          history.back();
          this.$bus.$emit('data/list');
          this.closeDialog();
        }
        this.loading = false;
      });
    },
    // 关闭窗口
    closeDialog() {
      this.DeliveryShow([false, 'NotDeliveryShow']);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    ...mapActions([
      'TableHeightRun',
      'DeliveryShow',
      'NewGrugsList',
    ]),
  },
};
</script>
<style>
.notdelivery-table .file-list-preview .el-loading-spinner .el-loading-text {
  margin-top: -23px !important;
}
</style>

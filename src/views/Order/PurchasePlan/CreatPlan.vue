<template>
  <div>
    <Percent v-show="isupload" :percentage="percentage"></Percent>
    <el-form :rules="editMessage.rules" label-width="100px">
      <TradeEditsForm :from-edit="Order_PlanfromEdit" :isCreatShow="true" :isDeleteItem="true" :message="editMessage" :isGoBackShow="false" :arrow-num=2 :arrow-down="true" @delete-item="deleteItem" @data-creat="dataCreat" @show-more="showMore" :purchase="Order_purchaseAmount" :is-export-show="true" :is-import-show="true" @data-import="dataImport" @data-export="dataExport"></TradeEditsForm>
    </el-form>
    <div>
      <el-table :data="Order_PlanDateList" v-loading="loading" @selection-change="dataSelect" stripe border fit :height="View_TableHeight">
        <el-table-column type="selection" width="40" fixed="left">
        </el-table-column>
        <el-table-column prop="num" label="#" width="40" fixed="left" class-name="table_right_fixed"></el-table-column>
        <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" min-width="120" label="通用名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
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
        <el-table-column align="right" prop="purchasableNum" min-width="80" label="可采数量" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" min-width="80" label="数量" sortable show-overflow-tooltip>
          <template scope="scope">
            <el-input class="input-right close-clear" style="width: 98%" slot="reference" size="small" placeholder="请输入内容" @focus="creatFocus(scope.row.purchaseNum)" @keyup.native="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index )" @blur="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index )" v-model="scope.row.purchaseNum">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column align="right" min-width="90" label="金额" sortable show-overflow-tooltip>
          <template scope="scope">
            <p>{{Number(scope.row.purchaseAmount).toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="middlePack" min-width="70" label="中包装" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="bigPack" min-width="70" label="大包装" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="removeFactor" min-width="70" label="拆零系数" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="deliveryMemberName" min-width="180" label="配送企业" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="producerName" min-width="180" label="生产企业" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总数量：</span>{{Order_purchaseNum}} </div>
      <div style="float: left">
        <span>总金额：</span>{{Number(Order_purchaseAmount) ? Number(Order_purchaseAmount).toFixed(2) : '0.00'}}
        <span>元</span>
      </div>
    </div>
    <PurchasePlanTable :options="dialogOptions" @dialog-hide="dialogHide"></PurchasePlanTable>
  </div>
</template>

<script>
/**
 * Created by dingyiming on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import TradeEditsForm from '../../../components/TradeEditsForm';        //  引订单目录表单
import PurchasePlanTable from './PurchasePlanTable';                    //  引订单目录表单
import PurchasePlan from '../../../api/Order/PurchasePlan';             //  采购计划api

export default {
  computed: {
    ...mapGetters([
      'View_TableHeight',
      'Order_purchaseNum',
      'Order_PlanDateList',
      'Order_purchaseAmount',
      'Order_PlanfromEdit',
      'getGpoId',
    ]),
  },
  components: {
    PurchasePlanTable,
    TradeEditsForm,
  },
  data() {
    return {
      percentage: 0,
      isupload: false,
      returnAllow: false,
      tableTitle: '添加明细',
      editMessage: {
        selects: [
          { label: '采购计划编号', key: 'code', type: 'el-input', placeholder: '自动生成', isReadonly: true },
          { label: '采购计划名称', key: 'name', type: 'el-input', placeholder: '请输入采购计划名称' },
          { key: 'type', type: 'el-form-item', span: 14, md: 0, sm: 0, xs: 0 },
          { label: '创建人', key: 'createBy', type: 'el-input', placeholder: '自动生成', isReadonly: true },
          { label: '医疗机构', key: 'hospitalName', type: 'el-input', placeholder: '请输入医疗机构', isReadonly: true },
          { label: '联系人', key: 'hospitalPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true },
        ],
        tabTitle: '',
        styleObject: {},
        options: {
          enabledOption: [],
          categoryOption: [],
        },
        radios: {},
        parameters: {},
        rules: {
          name: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
        },
      },
      authbtn: {
        create: true,
      },
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
      },
      loading: false,
      selectData: [],
      nowNum: 0,                            // 当前数量
      page: 0,
      size: 15,
    };
  },
  methods: {
    ...mapActions([
      'TableHeightRun',
      'TradeSelect',
      'CountNum',
      'DeleteItem',
      'ReturnHint',
      'PlanListClear',
      'GetPlanDate',
    ]),
    // 导入模板
    dataImport(e) {
      const file = e.target.files[0];
      console.log('file.type', file);
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' || file.name.indexOf('.xls') > -1) {
        this.isupload = true;
        const formData = new FormData();
        formData.append('file', file);
        PurchasePlan.uploadItem(formData, this.progress, this.Order_PlanfromEdit.projectId,
          this.Order_PlanfromEdit.projectSubId)
          .then((res) => {
            if (res.data.code === 0) {
              const datalist = [];
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
              // console.log();
              for (let i = 0; i < data.length; i += 1) {
                const numX = (res.data.result.number * res.data.result.size) + i + 1;
                const content = data[i];
                data[i].num = numX;
                data[i].purchaseAmount = content.hospitalUnitPrice * content.purchaseNum;
                // for (let j = 0; j < this.Order_PlanDateList.length; j += 1) {
                //   if (Number(this.Order_PlanDateList[j].drugsId) === Number(data[i].drugsId)) {
                //     data[i].purchaseNum = this.Order_PlanDateList[j].purchaseNum;
                //   }
                // }
                if (Number(data[i].purchaseNum) !== 0) {
                  datalist.push(data[i]);
                }
              }
              this.PlanListClear();
              this.GetPlanDate(datalist);
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
    // 导出模板
    dataExport() {
      const url = PurchasePlan.outputItem(this.getGpoId);
      window.open(url);
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
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['.el-form', '.TradeFooter', 200]);
      });
    },
    // 获取当前的数值
    creatFocus(data) {
      this.nowNum = data;
    },
    // 键盘按钮触发方法
    keydown(data, res, index) {
      if ((data.toString().search(/\D/) !== -1 || Number(data) === 0) && data !== '') {
        this.Order_PlanDateList[index].purchaseNum = this.nowNum;
      } else {
        const ItemListNum = this.Order_PlanDateList[index].purchaseNum;
        const ItemListPrice = this.Order_PlanDateList[index].hospitalUnitPrice;
        this.Order_PlanDateList[index].purchaseAmount = ItemListNum * ItemListPrice;
        this.CountNum({ Num: this.nowNum, Count: data, Price: res });
        this.nowNum = data;
      }
      return false;
    },
    // 删除明细操作
    deleteItem(res) {
      this.$confirm('确定要删除该明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.DeleteItem(res);
        if (this.Order_PlanDateList.length === 0) {
          this.ReturnHint(0);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 添加明细
    dataCreat() {
      this.dialogOptions.isShowDialog = true;
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    //  选择触发事件，根据审核状态判断右下角btn是否禁用
    dataSelect(row) {
      let booldelete = false;
      let first = 0;
      for (let i = 0; i < row.length; i += 1) {
        first += 1;
      }
      if (first > 0) {
        booldelete = false;
      } else {
        booldelete = true;
      }
      const btn = {
        orderDelete: booldelete,
      };
      this.TradeSelect({ tradeRow: row, tradeBtn: btn });
    },
  },
};
</script>

<template>
  <div v-loading="loading">
    <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
      <TradeEditsForm :from-edit="Order_PlanfromEdit" :isCreatShow="true" :isDeleteItem="true" :message="editMessage" :isGoBackShow="false" :arrow-num=2 :arrow-down="true" @data-creat="dataCreat" @delete-item="deleteItem" @show-more="showMore" :purchase="Order_purchaseAmount"></TradeEditsForm>
    </el-form>
    <div>
      <el-table :data="Order_PlanItemList" @selection-change="dataSelect" stripe border fit :height="View_TableHeight">
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
        <el-table-column align="right" prop="hospitalUnitPrice" min-width="70" label="单价" show-overflow-tooltip>
        </el-table-column>
        <!--<el-table-column align="right" prop="purchasableNum" min-width="80" label="可采数量" sortable show-overflow-tooltip>
          </el-table-column>-->
        <el-table-column align="right" min-width="80" label="数量" sortable show-overflow-tooltip>
          <template scope="scope">
            <qyw-number-input v-model="scope.row.purchaseNum" placeholder="请输入数量" :index="scope.$index" :data="scope.row" @change="inputChange" :min="0" :decimal="0"></qyw-number-input>
            <!-- <el-input class="input-right close-clear" style="width: 98%;" slot="reference" size="small" placeholder="请输入数量" @focus="creatFocus(scope.row.purchaseNum)" @keyup.native="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index )" @blur="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index )" v-model="scope.row.purchaseNum">
            </el-input> -->
          </template>
        </el-table-column>
        <el-table-column align="right" min-width="90" label="金额" show-overflow-tooltip>
          <template scope="scope">
            <p>{{scope.row.purchaseAmount.toFixed(2)}}</p>
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
 * Created by yaoling on 2017/9/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import TradeEditsForm from '../../../components/TradeEditsForm';        //  引入订单目录表单
import PurchasePlanTable from './PurchasePlanTable';                    //  引入弹出框
import PurchasePlan from '../../../api/Order/PurchasePlan';             //  引入采购计划api

export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.dataList();
    });
  },
  computed: mapGetters([
    'Order_purchaseAmount',
    'Order_PlanItemList',
    'Order_purchaseNum',
    'View_TableHeight',
    'Order_PlanfromEdit',
  ]),
  components: {
    PurchasePlanTable,
    TradeEditsForm,
  },
  data() {
    return {
      tableTitle: '添加明细',
      editMessage: {
        tabTitle: '',
        selects: [
          { label: '采购计划编号', key: 'code', type: 'el-input', placeholder: '请输入采购计划编号', isReadonly: true },
          { label: '采购计划名称', key: 'name', type: 'el-input', placeholder: '请输入采购计划名称', isReadonly: true },
          { key: 'type', type: 'el-form-item', span: 14, md: 0, sm: 0, xs: 0 },
          { label: '创建人', key: 'createBy', type: 'el-input', placeholder: '请输入创建人', isReadonly: true },
          { label: '医疗机构', key: 'hospitalName', type: 'el-input', placeholder: '请输入医疗机构', isReadonly: true },
          { label: '联系人', key: 'hospitalPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true },
        ],
        styleObject: {},
        parameters: {},
        options: {},
        radios: {},
        rules: {},
      },
      nowNum: 0, // 当前数量
      loading: false,
      authbtn: {
        create: true,
      },
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                  //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
      },
    };
  },
  methods: {
    ...mapActions([
      'TableHeightRun',
      'GetItemDate',
      'TradeSelect',
      'CountNum',
      'DeleteItem',
      'ItemList',
      'ReturnHint',
    ]),
    // 键盘按钮触发方法
    keydown(data, res, index) {
      if ((data.toString().search(/\D/) !== -1 || Number(data) === 0) && data !== '') {
        this.Order_PlanItemList[index].purchaseNum = this.nowNum;
      } else {
        const ItemListNum = this.Order_PlanItemList[index].purchaseNum;
        const ItemListPrice = this.Order_PlanItemList[index].hospitalUnitPrice;
        this.Order_PlanItemList[index].purchaseAmount = ItemListNum * ItemListPrice;
        this.CountNum({ Num: this.nowNum, Count: data, Price: res });
        this.nowNum = data;
        this.ReturnHint();
      }
      return false;
    },
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
      });
    },
    // 获取当前的数值
    creatFocus(data) {
      this.nowNum = data;
    },
    // 添加明细
    dataCreat() {
      this.dialogOptions.isShowDialog = true;
    },
    // 删除明细操作
    deleteItem(res) {
      this.$confirm('确定要删除该明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.DeleteItem(res);
        this.ReturnHint();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    // 获取数据列表
    dataList() {
      this.loading = true;
      PurchasePlan.item(this.$route.query.id)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            const itemList = {
              code: data.code,
              createBy: `${data.createBy || ''} ${data.createTime || ''}`,
              createTime: data.createTime,
              hospitalName: data.hospitalName,
              hospitalPerson: `${data.hospitalPerson || ''} ${data.hospitalPhone || ''}`,
              hospitalPhone: data.hospitalPhone,
              id: data.id,
              name: data.name,
            };
            this.ItemList(itemList);
            data.tmsPurchasePlanItemOutputList.item = 0;
            const content = data.tmsPurchasePlanItemOutputList;
            for (let i = 0; i < data.tmsPurchasePlanItemOutputList.length; i += 1) {
              content[i].purchaseAmount = content[i].purchaseNum * content[i].hospitalUnitPrice;
            }
            this.GetItemDate(content);
          }
          this.loading = false;
        });
    },
    //  选择触发事件，根据所选数据判断btn是否禁用
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
    //  文本输入
    inputChange(value, index, data) {
      if (/^([1-9]\d*|0{1})$/.test(value)) {
        const oldNum = this.Order_PlanItemList[index].purchaseNum;

        this.Order_PlanItemList[index].purchaseNum = value;
        const ItemListPrice = this.Order_PlanItemList[index].hospitalUnitPrice;
        this.Order_PlanItemList[index].purchaseAmount = value * ItemListPrice;
        this.CountNum({ Num: oldNum, Count: value, Price: ItemListPrice });

        this.ReturnHint();
      }
    },
  },
};
</script>

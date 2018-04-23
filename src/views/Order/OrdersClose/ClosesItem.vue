<template>
  <div v-loading="loading">
    <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
      <TradeEditsForm :from-edit="Order_PlanfromEdit" :message="editMessage" :isGoBackShow="false" :arrow-num=4 :arrow-down="true" @show-more="showMore" :purchase="Order_purchaseAmount">
        <el-form-item label="" slot="StepsFrom" label-width="120px">
          <StepsFrom :steplist="steplist" :active='active' :process="process"></StepsFrom>
        </el-form-item>
      </TradeEditsForm>
    </el-form>
    <div>
      <el-table :data="Order_PlanItemList" stripe border fit :height="View_TableHeight">
        <el-table-column prop="num" label="#" width="40" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ordersCode" min-width="135" label="订单编号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" min-width="120" label="通用名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="formName" min-width="90" label="剂型" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="specName" min-width="90" label="规格" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packSpecName" min-width="90" label="包装规格" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="unitName" min-width="60" label="单位" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="hospitalUnitPrice" min-width="70" label="单价" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="ordersNum" min-width="80" label="订单数量" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="sendNum" min-width="80" label="发货数量" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" min-width="90" label="金额" sortable show-overflow-tooltip>
          <template scope="scope">
            <p>{{scope.row.purchaseAmount.toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="producerName" min-width="180" label="生产企业" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="salerMemberName" min-width="180" label="卖方会员" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="contractItemNo" min-width="135" label="合同明细编号" sortable show-overflow-tooltip>
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
import OrdersClose from '../../../api/Order/OrdersClose';             //  引入采购计划api
import StepsFrom from '../../../components/StepsFrom';                    // 引入加载条组件
import convert from '../../../utils/convert';                         //  自定义转换js

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
    'Order_ItemID',
    'Order_PlanfromEdit',
  ]),
  components: {
    TradeEditsForm,
    StepsFrom,
  },
  data() {
    return {
      tableTitle: '',
      editMessage: {
        tabTitle: '',
        selects: [
          { value: 'StepsFrom', type: 'custom', span: 24, isReadonly: true },
          { label: '订单结案编号', key: 'code', type: 'el-input', placeholder: '请输入采购计划名称', isReadonly: true },
          { label: '创建人', key: 'createBy', type: 'el-input', placeholder: '请输入创建人', isReadonly: true },
          { label: '', key: 'auditStatus', type: 'el-input', placeholder: '请输入订单状态', isReadonly: true, noborder: 'true', span: 14, belWidth: '35px', fromclass: '' },
          { label: '医疗机构', key: 'hospitalMemberName', type: 'el-input', placeholder: '请输入医疗机构名称', isReadonly: true },
          { label: '联系人', key: 'hospitalPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true },
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', placeholder: '请输入配送企业', isReadonly: true },
          { label: '联系人', key: 'deliveryPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true },
          { label: '备注', key: 'reason', type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', rows: 1, isReadonly: true },
          { label: '答复日期', key: 'deliveryReplyTime', type: 'el-input', placeholder: '请输入备注', rows: 1, isReadonly: true },
          { label: '配送企业答复', key: 'deliveryReplyContent', span: 10, type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', rows: 1, isReadonly: true },
        ],
        styleObject: {},
        parameters: {},
        options: {},
        radios: {},
        rules: {},
      },
      loading: false,
      authbtn: {
        create: true,
      },
      active: 0,   // 订单状态
      process: 'process',  // 步骤条样式
      steplist: [{
        title: '创建结案单',
        description: '',
      }, {
        title: '配送企业审核',
        description: '',
      }, {
        title: '结案审核结束',
        description: '',
      }],
    };
  },
  methods: {
    ...mapActions([
      'GetAuditStatus',
      'TableHeightRun',
      'GetItemDate',
      'Initialize',
      'ItemList',
    ]),
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['#from-item', '.TradeFooter', 250]);
      });
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    // 获取数据列表
    dataList() {
      this.loading = true;
      OrdersClose.item(this.$route.query.id)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            let Status = '';
            switch (data.auditStatus) {
              case 1:
                Status = '待审核';
                this.active = 1;
                this.process = 'process';
                this.editMessage.selects[3].fromclass = 'from-green no-border';
                break;
              case 3:
                Status = '审核通过';
                this.active = 3;
                this.editMessage.selects[3].fromclass = 'from-blue no-border';
                this.process = 'process';
                break;
              default:
                Status = '审核不通过';
                this.active = 1;
                this.editMessage.selects[3].fromclass = 'from-red no-border';
                this.process = 'error';
                break;
            }
            this.GetAuditStatus(data.auditStatus);
            const itemList = {
              auditStatus: Status,
              code: data.code,
              createBy: `${data.createBy || ''} ${data.createTime || ''}`,
              createTime: data.createTime,
              deliveryMemberName: data.deliveryMemberName,
              deliveryPerson: `${data.deliveryPerson || ''} ${data.deliveryPhone || ''}`,
              deliveryPhone: data.deliveryPhone,
              hospitalMemberName: data.hospitalMemberName,
              hospitalPerson: `${data.hospitalPerson || ''} ${data.hospitalPhone || ''}`,
              hospitalPhone: data.hospitalPhone,
              deliveryReplyContent: data.deliveryReplyContent,
              deliveryReplyTime: data.deliveryReplyTime,
              id: data.id,
              reason: data.reason,
            };
            this.ItemList(itemList);
            data.tmsOrdersCloseItemOutputList.item = 0;
            const content = data.tmsOrdersCloseItemOutputList;
            for (let i = 0; i < data.tmsOrdersCloseItemOutputList.length; i += 1) {
              const purchaseNum = content[i].purchaseNum;
              const ordersNum = content[i].ordersNum;
              content[i].purchaseNum = ordersNum;
              content[i].purchasableNum = purchaseNum;
              content[i].purchaseAmount = content[i].purchaseNum * content[i].hospitalUnitPrice;
            }
            this.GetItemDate(content);
          }
          this.loading = false;
        });
    },
  },
};
</script>

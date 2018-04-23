  <template>
  <div v-loading="loading">
    <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
      <TradeEditsForm :from-edit="Order_PlanfromEdit" :message="editMessage" :isGoBackShow="false" :bility-show="false" :arrow-num=5 :arrow-down="true" @show-more="showMore" :purchase="Order_purchaseAmount">
        <el-form-item label="" slot="StepsFrom" label-width="120px">
          <StepsFrom :steplist="steplist" :active='active'></StepsFrom>
        </el-form-item>
      </TradeEditsForm>
    </el-form>
    <div>
      <el-table :data="Order_PlanItemList" stripe border fit :height="View_TableHeight">
        <el-table-column prop="num" label="#" width="40" show-overflow-tooltip></el-table-column>
        <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" min-width="120" label="通用名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="formName" min-width="90" label="剂型" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="specName" min-width="90" label="规格" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packSpecName" min-width="90" label="包装规格" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="unitName" min-width="60" label="单位" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packagesName" min-width="90" label="包装材质" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="hospitalUnitPrice" min-width="70" label="单价" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="ordersNum" min-width="80" label="订单数量" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="sendNum" min-width="80" label="发货数量" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" min-width="90" label="未发货数量" sortable show-overflow-tooltip>
          <template scope="scope">
            <p>{{Number(scope.row.ordersNum) - Number(scope.row.sendNum)}}</p>
          </template>
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
        <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="deliveryMemberName" min-width="180" label="配送企业" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="contractItemNo" min-width="135" label="合同明细编号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="itemNo" min-width="160" label="订单明细编号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="closeStatus" min-width="160" height="20px" label="订单明细结案状态" sortable show-overflow-tooltip>
          <template scope="scope">
            <span v-if="scope.row.closeStatus == 0">无</span>
            <span class="order-green" v-if="scope.row.closeStatus == 1">结案中</span>
            <span class="order-green" v-if="scope.row.closeStatus == 2">部分结案</span>
            <span class="order-blue" v-if="scope.row.closeStatus == 3">已结案</span>
          </template>
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
    <DeliveryTable></DeliveryTable>
    <NotDeliveryTable></NotDeliveryTable>
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
import convert from '../../../utils/convert';                             // 引入js公共方法
import DeliveryTable from './DeliveryTable';                              // 货票同行弹出框
import NotDeliveryTable from './NotDeliveryTable';                              // 货票同行弹出框

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
    'Order_DeliveryShow',
    'Order_NotDeliveryShow',
  ]),
  components: {
    NotDeliveryTable,
    TradeEditsForm,
    DeliveryTable,
    StepsFrom,
  },
  data() {
    return {
      tableTitle: '添加明细',
      editMessage: {
        tabTitle: '',
        selects: [
          { value: 'StepsFrom', type: 'custom', span: 24, md: 20, sm: 24, isReadonly: true },
          { label: '订单编号', key: 'code', type: 'el-input', placeholder: '请输入采购计划编号', isReadonly: true },
          { label: '创建人', key: 'createBy', type: 'el-input', placeholder: '请输入创建人', isReadonly: true },
          { label: '订单类型', key: 'type', type: 'el-select', placeholder: '请选择订单状态', option: 'typeOption', isReadonly: true },
          { label: '', key: 'status', type: 'el-input', isReadonly: true, fromclass: '', noborder: 'true', span: 6, belWidth: '35px' },
          { label: '医疗机构', key: 'hospitalMemberName', type: 'el-input', placeholder: '请输入医疗机构名称', isReadonly: true },
          { label: '联系人', key: 'hospitalPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true },
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', placeholder: '请输入配送企业', isReadonly: true },
          { label: '联系人', key: 'deliveryPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true },
          { label: '收货地址', key: 'receiveAddress', type: 'el-select', placeholder: '请输入收货地址', option: 'addressOption', span: 10, isReadonly: true },
          { label: '备注', key: 'remarks', type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', rows: 1, span: 5, isReadonly: true },
          { label: '配送商备注', key: 'deliveryRemarks', type: 'el-input', placeholder: '请输入配送商备注', fromType: 'textarea', rows: 1, span: 5, isReadonly: true },
        ],
        styleObject: {
          style1: {
            width: '90%',
          },
          style2: {
            width: '70%',
          },
        },
        parameters: {},
        options: {
          typeOption: [],
          addressOption: [],
        },
        radios: {},
        rules: {},
      },
      loading: false,
      active: 1,   // 订单状态
      steplist: [{
        title: '创建订单',
        description: '',
      }, {
        title: '确定订单',
        description: '',
      }, {
        title: '订单发货',
        description: '',
      }, {
        title: '订单完成',
        description: '',
      }],
    };
  },
  methods: {
    // 关闭窗口后的触发事件
    CloseDialog() {
      // 关闭弹出表单
      this.orderDelivery(false);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['#from-item', '.TradeFooter', 250]);
      });
    },
    // 获取数据列表
    dataList() {
      this.loading = true;
      DeliveryOrdersList.item(this.$route.query.id)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            const itemList = {
              id: data.id,
              code: data.code,
              type: data.type === 0 ? '普通订单' : '加急订单',
              status: data.status,
              remarks: data.remarks,
              deliveryRemarks: data.deliveryRemarks,
              createBy: data.createBy,
              createTime: this.convertDate(data.createTime),
              hospitalMemberName: data.hospitalMemberName,
              hospitalPerson: `${data.hospitalPerson || ''} ${data.hospitalPhone || ''}`,
              hospitalPhone: data.hospitalPhone,
              deliveryMemberName: data.deliveryMemberName,
              dPerson: data.deliveryPerson,
              deliveryPerson: `${data.deliveryPerson || ''} ${data.deliveryPhone || ''}`,
              deliveryPhone: data.deliveryPhone,
              deliveryMemberId: data.deliveryMemberId,
              sendPerson: data.deliverPerson,
              sendPhone: data.deliverPhone,
              amount: 0,
              receiveAddress: data.receiveAddress,
            };
            switch (itemList.status) {
              case 1:
                itemList.status = '待确认';
                this.active = 1;
                this.editMessage.selects[4].fromclass = 'from-green no-border';
                this.steplist[0].description = data.submitTime;
                break;
              case 2:
                itemList.status = '待发货';
                this.active = 2;
                this.editMessage.selects[4].fromclass = 'from-green no-border';
                this.steplist[0].description = data.submitTime;
                this.steplist[1].description = data.confirmTime;
                break;
              case 3:
                itemList.status = '部分发货';
                this.active = 3;
                this.editMessage.selects[4].fromclass = 'from-green no-border';
                this.steplist[0].description = data.submitTime;
                this.steplist[1].description = data.confirmTime;
                this.steplist[2].description = data.sendTime;
                break;
              case 4:
                itemList.status = '已发货';
                this.active = 3;
                this.editMessage.selects[4].fromclass = 'from-blue no-border';
                this.steplist[0].description = data.submitTime;
                this.steplist[1].description = data.confirmTime;
                this.steplist[2].description = data.sendTime;
                break;
              case 5:
                itemList.status = '已完成';
                this.active = 4;
                this.editMessage.selects[4].fromclass = 'from-blue no-border';
                this.steplist[0].description = data.submitTime;
                this.steplist[1].description = data.confirmTime;
                this.steplist[2].description = data.sendTime;
                this.steplist[3].description = data.finishTime;
                break;
              case 6:
                itemList.status = '已取消';
                this.editMessage.selects[4].fromclass = 'from-red no-border';
                this.active = 0;
                break;
              default:
                itemList.status = '';
                break;
            }
            this.ItemList(itemList);
            data.tmsOrdersItemOutputList.item = 0;
            const content = data.tmsOrdersItemOutputList;
            for (let i = 0; i < data.tmsOrdersItemOutputList.length; i += 1) {
              const purchaseNum = content[i].purchaseNum;
              const ordersNum = content[i].ordersNum;
              content[i].code = this.Order_PlanfromEdit.code;
              content[i].hospitalMemberName = this.Order_PlanfromEdit.hospitalMemberName;
              content[i].purchaseNum = ordersNum;
              content[i].purchasableNum = purchaseNum;
              content[i].purchaseAmount = content[i].ordersNum * content[i].hospitalUnitPrice;
              const drugsCode = content[i].drugsCode;
              const deliveryMemberId = this.Order_PlanfromEdit.deliveryMemberId;
              // DeliveryOrdersList.drugslist(drugsCode, deliveryMemberId).then((datas) => {
              // if (datas.data.code === 0) {
              // const drugslist = datas.data.result;
              // drugslist.drugsCode = drugsCode;
              // this.GetGrugsList(drugslist);
              // }
              // });
            }
            this.GetItemDate(content);
          }
          this.loading = false;
        });
    },
    ...mapActions([
      'TableHeightRun',
      'GetItemDate',
      'TradeSelect',
      'Initialize',
      'CountNum',
      'DeleteItem',
      'ItemList',
      'GetDetailDate',
      'orderDelivery',
      'GetGrugsList',
    ]),
  },
};
</script>

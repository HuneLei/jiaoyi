<template>
  <div v-loading="loading">
    <el-form :rules="editMessage.rules" label-width="160px" id="from-item">
      <TradeEditsForm :from-edit="fromEdit" :message="editMessage" :isGoBackShow="false" :arrow-num=5 :arrow-down="true" @show-more="showMore">
        <el-form-item label="" slot="StepsFrom" label-width="160px">
          <StepsFrom :steplist="steplist" :active='active' :space="160" :process="process"></StepsFrom>
        </el-form-item>
      </TradeEditsForm>
    </el-form>
    <div>
      <el-table :data="tableData" @selection-change="dataSelect" stripe border fit :height="View_TableHeight">
        <el-table-column prop="num1" label="#" width="40" show-overflow-tooltip></el-table-column>
        <el-table-column prop="itemNo" min-width="140" label="合同明细编号" sortable show-overflow-tooltip>
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
        <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="producerName" min-width="180" label="生产企业" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="salerMemberName" min-width="180" label="卖方会员" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="hospitalUnitPrice" min-width="70" label="单价" align="right" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="purchasableNum" min-width="80" label="数量" align="right" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="purchaseAmount" min-width="90" label="金额" align="right" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <TradeFooter :isRemoveShow="isRemoveShow" :isAgreeShow="isAgreeShow" :isNoAgreeShow="isNoAgreeShow" :isBackShow="isBackShow" @order-remove="orderRemove" @order-agree="orderAgree" @order-noagree="orderNoAgree" @order-back="orderBack"></TradeFooter>
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
import ContractClose from '../../../api/Contract/ContractClose';             //  引入采购计划api
import StepsFrom from '../../../components/StepsFrom';                    // 引入加载条组件
import TradeFooter from '../../../components/TradeFooter';           // 引入底部组件

export default {
  activated() {
    // 获取添加的明细
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Contract',
        name: '合同管理',
        noLink: true,
      },
      {
        path: '/Contract/ContractClose',
        name: '合同结案申请单',
        noLink: true,
      },
    ]);
    this.dataInit();
    this.dataList();
  },
  deactivated() {
  },
  computed: mapGetters([
    'Order_purchaseAmount',
    'Order_PlanItemList',
    'Order_purchaseNum',
    'View_TableHeight',
    'Order_ItemID',
    'Order_PlanfromEdit',
    'View_UserInfo',
  ]),
  components: {
    TradeEditsForm,
    TradeFooter,
    StepsFrom,
  },
  created() {
  },
  data() {
    return {
      tableData: [],
      tableTitle: '添加明细',
      editMessage: {
        tabTitle: '',
        selects: [
          { value: 'StepsFrom', type: 'custom', span: 24, isReadonly: true },
          { label: '结案申请单号', key: 'code', type: 'el-input', placeholder: '请输入采购计划编号', isReadonly: true, span: 5 },
          { label: '结案类型', key: 'closeType', type: 'el-input', placeholder: '请输入合同状态', isReadonly: true, span: 5 },
          { label: '申请时间', key: 'createTime', type: 'el-input', placeholder: '请输入采购计划名称', isReadonly: true, span: 5 },
          { label: '', key: 'auditStatusName', type: 'el-input', fromStyle: 'style2', noborder: 'true', span: 5, belWidth: '85px', fromclass: '' },
          { label: '医疗机构', key: 'hospitalMemberName', type: 'el-input', placeholder: '请输入医疗机构', isReadonly: true, span: 5 },
          { label: '联系人', key: 'hospitalPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true, span: 5 },
          { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', placeholder: '请输入医疗机构', isReadonly: true, span: 5 },
          { label: '联系人', key: 'deliveryPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true, span: 5 },
          { label: '结案申请原因', key: 'applyReason', span: 5, type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', rows: 1, isReadonly: true },
          // { key: 'type', type: 'el-form-item', span: 13, md: 0, sm: 0, xs: 0 },
          { label: '配送企业答复时间', key: 'deliveryReplyTime', type: 'el-input', placeholder: '请输入采购计划名称', isReadonly: true },
          { label: '配送企业答复', key: 'deliveryReplyContent', type: 'el-input', placeholder: '请输入采购计划名称', isReadonly: true, span: 5 },
          { key: 'type', type: 'el-form-item', span: 5, md: 0, sm: 0, xs: 0 },
          { label: 'GPO答复时间', key: 'gpoReplyTime', type: 'el-input', placeholder: '请输入采购计划名称', isReadonly: true },
          { label: 'GPO答复', key: 'gpoReplyContent', type: 'el-input', placeholder: '请输入采购计划名称', isReadonly: true, span: 5 },
        ],
        styleObject: {
          style1: {
            width: '79%',
          },
        },
        parameters: {},
        options: {},
        radios: {},
        rules: {},
      },
      nowNum: 0, // 当前数量
      loading: false,
      isRemoveShow: false,            // 删除结案按钮
      isAgreeShow: false,            // 同意按钮
      isNoAgreeShow: false,        // 不同意按钮
      isBackShow: true,           // 返回按钮
      auditform: {},
      authbtn: {
        create: true,
      },
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
      },
      fromEdit: {},
      active: 1,   // 订单状态
      process: 'process',  // 步骤条样式
      steplist: [{
        title: '提交结案申请',
        description: '',
      }, {
        title: '待审核(配送企业)',
        description: '',
      }, {
        title: '待审核(GPO)',
        description: '',
      }, {
        title: '结案完成',
        description: '',
      }],
    };
  },
  methods: {
    ...mapActions([
      'TableHeightRun',
    ]),
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
      });
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    //  初始化按钮
    setBtnFalse() {
      this.isRemoveShow = false;            // 删除结案按钮
      this.isAgreeShow = false;            // 同意按钮
      this.isNoAgreeShow = false;        // 不同意按钮
    },
    //  数据初始化
    dataInit() {
      this.loading = true;
      this.setBtnFalse();
      this.active = null;
      this.process = 'process';
      if (!this.$route.query.id) {
        this.loading = false;
        return false;
      }
      // 将进度条的时间初始化
      for (let i = 0; i < this.steplist.length; i += 1) {
        this.steplist[i].description = '';
      }
      ContractClose.item(this.$route.query.id).then((res) => {
        this.loading = false;
        if (res.data.code === 0) {
          if (res.data.code === 0) {
            const data = res.data.result;
            switch (data.auditStatus) {
              case 0:
                this.active = 1;
                this.steplist[0].description = data.createTime;
                this.editMessage.selects[4].fromclass = 'from-green no-border';
                this.process = 'process';
                break;
              case 1:
                this.active = 1;
                this.steplist[0].description = data.createTime;
                this.editMessage.selects[4].fromclass = 'from-green no-border';
                this.process = 'process';
                break;
              case 2:
                this.active = 2;
                this.steplist[0].description = data.createTime;
                this.steplist[1].description = data.deliveryReplyTime;
                this.editMessage.selects[4].fromclass = 'from-green no-border';
                this.process = 'process';
                break;
              case 3:
                this.active = 4;
                this.editMessage.selects[4].fromclass = 'from-blue no-border';
                this.steplist[0].description = data.createTime;
                this.steplist[1].description = data.deliveryReplyTime;
                this.steplist[2].description = data.gpoReplyTime;
                this.steplist[3].description = data.gpoReplyTime;
                this.process = 'process';
                break;
              case 4:
                this.active = 1;
                this.steplist[0].description = data.createTime;
                this.steplist[1].description = data.deliveryReplyTime;
                this.editMessage.selects[4].fromclass = 'from-red no-border';
                this.process = 'error';
                break;
              case 5:
                this.active = 2;
                this.steplist[0].description = data.createTime;
                this.steplist[1].description = data.deliveryReplyTime;
                this.steplist[2].description = data.gpoReplyTime;
                this.editMessage.selects[4].fromclass = 'from-red no-border';
                this.process = 'error';
                break;
              default:
                break;
            }
            if (this.View_UserInfo.memberType === 2) {
              switch (data.auditStatus) {
                case 1:
                  data.auditStatusName = '待审核（配送企业）';
                  this.isAgreeShow = true;            // 同意按钮
                  this.isNoAgreeShow = true;        // 不同意按钮
                  break;
                case 2:
                  data.auditStatusName = '待审核（GPO）';
                  break;
                case 3:
                  data.auditStatusName = '已结案';
                  break;
                case 4:
                  data.auditStatusName = '已拒绝（配送企业）';
                  break;
                case 5:
                  data.auditStatusName = '已拒绝（GPO）';
                  break;
                default:
                  data.auditStatusName = '';
                  break;
              }
            } else if (this.View_UserInfo.memberType === 3) {
              switch (data.auditStatus) {
                case 1:
                  data.auditStatusName = '待审核（配送企业）';
                  this.isRemoveShow = true;
                  break;
                case 2:
                  data.auditStatusName = '待审核（GPO）';
                  break;
                case 3:
                  data.auditStatusName = '已结案';
                  break;
                case 4:
                  data.auditStatusName = '已拒绝（配送企业）';
                  break;
                case 5:
                  data.auditStatusName = '已拒绝（GPO）';
                  break;
                default:
                  data.auditStatusName = '';
                  break;
              }
            } else if (this.View_UserInfo.memberType === 4) {
              switch (data.auditStatus) {
                case 1:
                  data.auditStatusName = '待审核（配送企业）';
                  break;
                case 2:
                  data.auditStatusName = '待审核（GPO）';
                  this.isAgreeShow = true;            // 同意按钮
                  this.isNoAgreeShow = true;        // 不同意按钮
                  break;
                case 3:
                  data.auditStatusName = '已结案';
                  break;
                case 4:
                  data.auditStatusName = '已拒绝（配送企业）';
                  break;
                case 5:
                  data.auditStatusName = '已拒绝（GPO）';
                  break;
                default:
                  data.auditStatusName = '';
                  break;
              }
            }
            this.fromEdit = Object.assign({}, data);
            this.fromEdit = Object.assign({}, this.fromEdit, {
              hospitalPerson: `${data.hospitalPerson || ''} ${data.hospitalPhone || ''}`,
              deliveryPerson: `${data.deliveryPerson || ''} ${data.deliveryPhone || ''}`,
              validBtime: `${data.validBtime || ''} ${data.validEtime || ''}`,
              closeType: this.$route.query.closeType === 0 ? '合同结案' : '合同明细结案',
            });
          }
        }
        setTimeout(() => {
          this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
        }, 0);
        this.loading = false;
      });
      return true;
    },
    // 获取数据列表
    dataList() {
      this.loading = true;
      ContractClose.itemInfo(this.$route.query.id)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableData = [];
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              // data.content[i].num = (i + 1) + (cpage * cpageSizes);
              // const numX = (i + 1) + (data.number * data.size);
              // data[i].num = numX;
              // data.content[i].totalElements = 0;
              // this.tableNum.push(numX);
              data.content[i].num1 = i + 1;
            }
            this.tableData = data.content;
            this.page = data.number;
            this.size = data.size;
            this.$emit('page', data.number + 1, data.size, data.totalElements);
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
    // 同意结案
    orderAgree(rows, value) {
      const form = {
        id: this.$route.query.id,
        remark: value,
        status: 3,
      };
      ContractClose.audit(form).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功',
          });
          this.$bus.$emit('data/list');
          this.orderBack();  // 返回主页面
        }
      });
    },
    // 不同意结案
    orderNoAgree(rows, value) {
      const form1 = {
        id: this.$route.query.id,
        remark: value,
        status: 4,
      };
      ContractClose.audit(form1).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功',
          });
          this.$bus.$emit('data/list');
          this.orderBack();  // 返回主页面
        }
      });
    },
    // 删除结案
    orderRemove() {
      ContractClose.remove(this.$route.query.id).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除结案成功',
          });
          this.$bus.$emit('data/list');
          this.orderBack();  // 返回主页面
        }
      });
    },
    // 返回
    orderBack() { // 返回按钮触发事件
      this.$router.go(-1);
    },
  },
};
</script>

<template>
  <div>
    <Find :showNum="8" :message="message" :defaultAjax="defaultAjax" :isShowFilter="true" :filterField="filterField" @filter-field="emitFilterField"></Find>
    <Show :authbtn="authbtn" @page="dataPage" :filter="filterFieldResult"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
    <ChangeEditDialog></ChangeEditDialog>
  </div>
</template>


<script>
/**
 * Created by dingyiming on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import Show from './Show';
import ChangeEditDialog from './ChangeEditDialog';
import ContractItem from '../../../api/Contract/ContractItem';

export default {
  activated() {
    if (this.$route.query.from === 'index') {
      this.$set(this.message[6], 'defaults', ['7']);
      this.$set(this.message[8], 'defaults', '0');
      this.$set(this.message[10], 'defaults', ['4']);
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    }
    if (this.View_UserInfo.memberType === 2) {
      this.message[6].selects.splice(0, 1);
    }
    this.authbtn = ContractItem.authbtn();
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.getProjectAll();
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
        path: '/Contract/ContractItem',
        name: '合同明细',
        noLink: true,
      },
    ]);
    if (this.View_UserInfo.memberType !== 3) {
      this.showBtn.applyClosure = false;
    }

    const fields = window.localStorage.getItem('fields_ContractItem');
    if (fields) {
      const fieldsJson = JSON.parse(fields);
      this.filterFieldResult = fieldsJson;
      for (let i = 0; i < this.filterField.length; i += 1) {
        if (!fieldsJson[this.filterField[i].key]) {
          this.filterField[i].show = false;
        }
      }
    }
  },
  deactivated() {
    this.$bus.$off('project/getAll', this.getProjectAll);
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
    ...mapGetters([
      'getGpoId',
      'projectOptions',
      'getProjectId',
      'View_UserInfo',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = ContractItem.authbtn();
    },
  },
  components: {
    Show,
    ChangeEditDialog,
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      size: 20,
      total: 0,
      defaultAjax: 0,
      showBtn: {
        exportData: true,
        applyClosure: true,
      },
      message: [
        {
          key: 'drugsCode',
          label: '药品编码',
          placeholder: '请输入药品编码',
          type: 0,
          selects: [],
        },
        {
          key: 'drugsName',
          label: '通用名',
          placeholder: '请输入通用名',
          type: 0,
          selects: [],
        },
        {
          key: 'hospitalMemberName',
          label: '医疗机构',
          placeholder: '请输入医疗机构',
          type: 0,
          selects: [],
        },
        {
          type: 9,  // 类型
          key: 'createTime',
          label: '创建日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'createTime',
        //   label: '创建日期',
        //   convertdate: 2,
        //   type: 5,
        //   placeholder: '请选择日期',
        //   selects: [],
        //   defaultDate: true,
        //   pickerOptions: {
        //     shortcuts: [{
        //       text: '最近三个月',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }, {
        //       text: '最近半年',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 182));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }, {
        //       text: '最近一年',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 365));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }],
        //   },
        // },
        {
          key: 'deliveryMemberName',
          label: '配送企业',
          placeholder: '请输入配送企业',
          type: 0,
          selects: [],
        },
        {
          key: 'contractCode',
          label: '合同编号',
          placeholder: '请输入合同编号',
          type: 0,
          selects: [],
        },
        {
          key: 'contractStatus',
          label: '合同状态',
          placeholder: '请选择合同状态',
          type: 2,
          selects: [
            {
              label: '待签章(医疗机构)',
              value: '2',
            },
            {
              label: '待签章(配送企业)',
              value: '3',
            },
            {
              label: '待签章(GPO)',
              value: '4',
            },
            {
              label: '已生效',
              value: '7',
            },
            {
              label: '已作废',
              value: '5',
            },
            {
              label: '已过期',
              value: '6',
            },
            {
              label: '已结案',
              value: '8',
            },
          ],
        },
        {
          key: 'projectId',
          label: '集采项目',
          type: 1,
          selects: [],
        },
        {
          key: 'closeStatus',
          label: '明细结案状态',
          placeholder: '请选择明细结案状态',
          type: 1,
          selects: [
            {
              label: '无',
              value: '0',
            },
            {
              label: '结案中',
              value: '1',
            },
            {
              label: '已结案',
              value: '2',
            },
          ],
        },
        {
          key: 'purchaseStatus',
          label: '采购状态',
          type: 2,
          placeholder: '请选择采购状态',
          selects: [
            {
              label: '从未下单',
              value: '1',
            },
            {
              label: '未超一半',
              value: '2',
            },
            {
              label: '超过一半',
              value: '3',
            },
            {
              label: '未完成采购',
              value: '4',
            },
            {
              label: '完成采购',
              value: '5',
            },
          ],
        },
        {
          key: 'executeStatus',
          label: '执行状态',
          type: 2,
          placeholder: '请选择执行状态',
          selects: [
            {
              label: '从未下单',
              value: '1',
            },
            {
              label: '未超一半',
              value: '2',
            },
            {
              label: '超过一半',
              value: '3',
            },
            {
              label: '超过70%',
              value: '4',
            },
            {
              label: '未完成采购',
              value: '5',
            },
            {
              label: '完成执行',
              value: '6',
            },
          ],
        },
        {
          type: 9,  // 类型
          key: 'validtime',
          label: '合同有效期',
          shortcuts: true,  // 是否开启快捷选择
          // defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'validtime',
        //   label: '合同有效期',
        //   placeholder: '请输入合同有效期',
        //   type: 5,
        //   selects: [],
        // },
        {
          key: 'specName',
          label: '规格',
          placeholder: '请输入规格',
          type: 0,
          selects: [],
        },
        {
          key: 'formName',
          label: '剂型',
          placeholder: '请输入剂型',
          type: 0,
          selects: [],
        },
        {
          key: 'tradeName',
          label: '商品名',
          placeholder: '请输入商品名',
          type: 0,
          selects: [],
        },
        {
          key: 'approvalNumber',
          label: '批准文号',
          placeholder: '请输入批准文号',
          type: 0,
          selects: [],
        },
        {
          key: 'producerName',
          label: '生产企业',
          placeholder: '请输入生产企业',
          type: 0,
          selects: [],
        },
        {
          key: 'salerMemberName',
          label: '卖方会员',
          placeholder: '请输入卖方会员',
          type: 0,
          selects: [],
        },
        {
          key: 'drugStandardCode',
          label: '本位码',
          placeholder: '请输入本位码',
          type: 0,
          selects: [],
        },
        {
          key: 'hospitalUnitOldPrice',
          label: '价格变动',
          type: 1,
          selects: [
            {
              label: '降价',
              value: '3',
            },
            {
              label: '持平',
              value: '2',
            },
            {
              label: '涨价',
              value: '1',
            },
          ],
        },
        {
          key: 'outNo',
          label: '外部合同编号',
          placeholder: '请输入外部合同编号',
          type: 0,
          selects: [],
        },
      ],
      filterFieldResult: {
        code: true,
        hospitalMemberName: true,
        drugsCode: true,
        drugsName: true,
        tradeName: true,
        formName: true,
        specName: true,
        packSpecName: true,
        unitName: true,
        hospitalUnitPrice: true,
        purchaseNum: true,
        purchaseAmount: true,
        purchasableNum: true,
        purchasedNum: true,
        sendNum: true,
        prepareNum: true,
        stockinNum: true,
        refusedNum: true,
        returnNum: true,
        closeNum: true,
        producerName: true,
        deliveryMemberName: true,
        salerMemberName: true,
        attributeName: true,
        packagesName: true,
        approvalNumber: true,
        drugStandardCode: true,
        contractStatus: true,
        closeStatus: true,
        itemNo: true,
        createTime: true,
        validBtime: true,
        projectName: true,
        outNo: true,
      },
      filterField: [
        {
          key: 'code',
          label: '合同编号',
          show: true,
        },
        {
          key: 'hospitalMemberName',
          label: '医疗机构',
          show: true,
        },
        {
          key: 'drugsCode',
          label: '药品编码',
          show: true,
        },
        {
          key: 'drugsName',
          label: '通用名',
          show: true,
        },
        {
          key: 'tradeName',
          label: '商品名',
          show: true,
        },
        {
          key: 'formName',
          label: '剂型',
          show: true,
        },
        {
          key: 'specName',
          label: '规格',
          show: true,
        },
        {
          key: 'packSpecName',
          label: '包装规格',
          show: true,
        },
        {
          key: 'unitName',
          label: '单位',
          show: true,
        },
        {
          key: 'hospitalUnitPrice',
          label: '单价',
          show: true,
        },
        {
          key: 'purchaseNum',
          label: '合同数量',
          show: true,
        },
        {
          key: 'purchaseAmount',
          label: '金额',
          show: true,
        },
        {
          key: 'purchasableNum',
          label: '可采数量',
          show: true,
        },
        {
          key: 'purchasedNum',
          label: '已采数量',
          show: true,
        },
        {
          key: 'sendNum',
          label: '发货数量',
          show: true,
        },
        {
          key: 'prepareNum',
          label: '待发货数量',
          show: true,
        },
        {
          key: 'stockinNum',
          label: '入库数量',
          show: true,
        },
        {
          key: 'refusedNum',
          label: '拒收数量',
          show: true,
        },
        {
          key: 'returnNum',
          label: '退货数量',
          show: true,
        },
        {
          key: 'closeNum',
          label: '结案数量',
          show: true,
        },
        {
          key: 'producerName',
          label: '生产企业',
          show: true,
        },
        {
          key: 'deliveryMemberName',
          label: '配送企业',
          show: true,
        },
        {
          key: 'salerMemberName',
          label: '卖方会员',
          show: true,
        },
        {
          key: 'attributeName',
          label: '规格属性',
          show: true,
        },
        {
          key: 'packagesName',
          label: '包装材质',
          show: true,
        },
        {
          key: 'approvalNumber',
          label: '批准文号',
          show: true,
        },
        {
          key: 'drugStandardCode',
          label: '本位码',
          show: true,
        },
        {
          key: 'contractStatus',
          label: '合同状态',
          show: true,
        },
        {
          key: 'closeStatus',
          label: '明细结案状态',
          show: true,
        },
        {
          key: 'itemNo',
          label: '合同明细编号',
          show: true,
        },
        {
          key: 'createTime',
          label: '合同创建日期',
          show: true,
        },
        {
          key: 'validBtime',
          label: '合同有效期',
          show: true,
        },
        {
          key: 'projectName',
          label: '集采项目',
          show: true,
        },
        {
          key: 'outNo',
          label: '外部合同编号',
          show: true,
        },
      ],
    };
  },
  methods: {
    // 获取集采项目下拉
    getProjectAll() {
      this.message[7].selects = this.projectOptions; // 给项目集采名称options赋值
      if (this.$route.query.from === 'index') {
        this.$set(this.message[7], 'defaults', '');
      } else {
        this.message[7].defaults = this.getProjectId; // 给项目集采名称options赋值
      }
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    },
    dataPage(page, size, total) {
      this.page = page;
      this.size = size;
      this.total = total;
    },
    // 筛选表格显示列
    emitFilterField(map) {
      // 存入 localStorage
      window.localStorage.setItem('fields_ContractItem', JSON.stringify(map));
      this.filterFieldResult = map;
      // 利用子组件传过来的选中的值与之前[filterField][渲染子组件选中]的值对比，判断子组件的选中状态
      for (let i = 0; i < this.filterField.length; i += 1) {
        if (!map[this.filterField[i].key]) {
          this.filterField[i].show = false;
        } else {
          this.filterField[i].show = true;
        }
      }
    },
  },
};
</script>


<template>
  <div>
    <Find :showNum="8" :message="message" :isShowFilter="true" :filterField="filterField" @filter-field="emitFilterField"></Find>
    <Show @page="dataPage" :filter="filterFieldResult"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/9/20.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import Show from './Show';
import GpoStockoutItem from '../../../api/Gpostockout/GpoStockoutItem';

export default {
  activated() {
    this.authbtn = GpoStockoutItem.authbtn();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Gpostockout',
        name: 'GPO出库管理',
        noLink: true,
      },
      {
        path: '/Gpostockout/GpoStockoutItem',
        name: '出库单明细',
        noLink: true,
      },
    ]);

    const fields = window.localStorage.getItem('fields_GpoStockoutItem');
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
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
  },
  watch: {
    authList() {
      this.authbtn = GpoStockoutItem.authbtn();
      // console.log();
    },
  },
  components: {
    Show,
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      size: 20,
      total: 0,
      showBtn: {
        exportData: true,
      },
      message: [
        {
          key: 'purchaseCode',
          label: '采购单编号',
          placeholder: '请输入采购单编号',
          type: 0,
          selects: [],
        },
        {
          key: 'stockoutCode',
          label: '出库单号',
          placeholder: '请输入出库单号',
          type: 0,
          selects: [],
        },
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
          key: 'tradeName',
          label: '商品名',
          placeholder: '请输入商品名',
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
          key: 'specName',
          label: '规格',
          placeholder: '请输入规格',
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
          key: 'deliveryMemberName',
          label: '配送企业',
          placeholder: '请输入配送企业',
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
          key: 'enrollName',
          label: '卖方会员',
          placeholder: '请输入卖方会员',
          type: 0,
          selects: [],
        },
        {
          key: 'stockoutType',
          label: '出库类型',
          type: 1,
          selects: [
            {
              value: 0,
              label: '销售',
            },
            {
              value: 1,
              label: '销退',
            },
          ],
        },
        {
          type: 9,  // 类型
          key: 'stockoutDate',
          label: '出库日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'stockoutDate',
        //   label: '出库日期',
        //   placeholder: '请选择出库日期',
        //   type: 5,
        //   defaultDate: true,
        //   selects: [],
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
      ],
      filterFieldResult: {
        stockoutCode: true,
        purchaseCode: true,
        drugsCode: true,
        drugsName: true,
        formName: true,
        specName: true,
        packSpecName: true,
        unitName: true,
        batchNo: true,
        minUnitPrice: true,
        stockoutNum: true,
        amount: true,
        producerName: true,
        enrollName: true,
        deliveryMemberName: true,
        approvalNumber: true,
        tradeName: true,
        stockoutItemNo: true,
        purchaseItemNo: true,
        maker: true,
        addressFull: true,
        stockoutType: true,
        stockoutDate: true,
        code: true,
      },
      filterField: [
        {
          key: 'stockoutCode',
          label: '出库单号',
          show: true,
        },
        {
          key: 'purchaseCode',
          label: '采购单编号',
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
          key: 'batchNo',
          label: '批号',
          show: true,
        },
        {
          key: 'minUnitPrice',
          label: '单价',
          show: true,
        },
        {
          key: 'stockoutNum',
          label: '数量',
          show: true,
        },
        {
          key: 'amount',
          label: '金额',
          show: true,
        },
        {
          key: 'producerName',
          label: '生产企业',
          show: true,
        },
        {
          key: 'enrollName',
          label: '卖方会员',
          show: true,
        },
        {
          key: 'deliveryMemberName',
          label: '配送企业',
          show: true,
        },
        {
          key: 'approvalNumber',
          label: '批准文号',
          show: true,
        },
        {
          key: 'tradeName',
          label: '商品名',
          show: true,
        },
        {
          key: 'stockoutItemNo',
          label: '出库单明细号',
          show: true,
        },
        {
          key: 'purchaseItemNo',
          label: '采购单明细编号',
          show: true,
        },
        {
          key: 'maker',
          label: '制单人',
          show: true,
        },
        {
          key: 'addressFull',
          label: '配送地址',
          show: true,
        },
        {
          key: 'stockoutType',
          label: '出库类型',
          show: true,
        },
        {
          key: 'stockoutDate',
          label: '出库时间',
          show: true,
        },
        {
          key: 'code',
          label: '外部GPO出库单号',
          show: true,
        },
      ],
    };
  },
  methods: {
    dataPage(page, size, total) {
      this.page = page;
      this.size = size;
      this.total = total;
    },
    // 筛选表格显示列
    emitFilterField(map) {
      // 存入 localStorage
      window.localStorage.setItem('fields_GpoStockoutItem', JSON.stringify(map));
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

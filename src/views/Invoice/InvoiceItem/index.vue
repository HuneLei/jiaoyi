<template>
  <div>
    <Find :showNum="8" :message="message"></Find>
    <Show :authbtn="authbtn" @page="dataPage" @table-select="tableSelectOne"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import Show from './Show';
import InvoiceItem from '../../../api/Invoice/InvoiceItem';

export default {
  activated() {
    this.authbtn = InvoiceItem.authbtn();
    // console.log();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Invoice',
        name: '发票管理',
        noLink: true,
      },
      {
        path: '/Invoice/InvoiceItem',
        name: '发票明细',
        noLink: true,
      },
    ]);
    if (this.View_UserInfo.memberType === 3) {
      this.message[13].selects = [
        {
          value: 3,
          label: '待确认',
        },
        {
          value: 1,
          label: '已确认',
        },
        {
          value: 4,
          label: '已作废(医疗机构)',
        },
      ];
    }
    this.$bus.$on('data/upInvoiceSubmit', this.dataSubmit);
  },
  deactivated() {
    this.$bus.$off('data/upInvoiceSubmit', this.dataSubmit);
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
    ...mapGetters([
      'View_UserInfo',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = InvoiceItem.authbtn();
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
        submit: true,
      },
      message: [
        {
          key: 'ordersCode',
          label: '订单编号',
          placeholder: '请输入订单编号',
          type: 0,
          selects: [],
        },
        {
          key: 'batchNo',
          label: '批号',
          placeholder: '请输入批号',
          type: 0,
          selects: [],
        },
        {
          key: 'deliverCode',
          label: '配送单编号',
          placeholder: '请输入配送单编号',
          type: 0,
          selects: [],
        },
        {
          type: 9,  // 类型
          key: 'invoiceDate',
          label: '开票日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'invoiceDate',
        //   label: '开票日期',
        //   placeholder: '请选择开票日期',
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
        // {
        //   key: 'stockinCode',
        //   label: '入库单编号',
        //   placeholder: '请输入入库单编号',
        //   type: 0,
        //   selects: [],
        // },
        {
          key: 'returnCode',
          label: '退货单编号',
          placeholder: '请输入退货单编号',
          type: 0,
          selects: [],
        },
        {
          key: 'number',
          label: '发票号',
          placeholder: '请输入发票号',
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
          key: 'code',
          label: '发票代码',
          placeholder: '请输入发票代码',
          type: 0,
          selects: [],
        },
        {
          key: 'invoiceType',
          label: '发票类型',
          type: 1,
          selects: [
            {
              value: 1,
              label: '普通发票',
            },
            {
              value: 0,
              label: '冲红发票',
            },
            {
              value: 2,
              label: '冲红发票(拒收)',
            },
          ],
        },
        {
          key: 'invoiceStatus',
          label: '发票状态',
          type: 1,
          selects: [
            {
              value: 0,
              label: '待提交',
            },
            {
              value: 3,
              label: '待确认',
            },
            {
              value: 1,
              label: '已确认',
            },
            {
              value: 2,
              label: '已作废(配送企业)',
            },
            {
              value: 4,
              label: '已作废(医疗机构)',
            },
          ],
        },
        {
          key: 'salerMemberName',
          label: '卖方会员',
          placeholder: '请输入卖方会员',
          type: 0,
          selects: [],
        },
      ],
    };
  },
  methods: {
    tableSelectOne(ids) {
      this.deliverinvoiceItemIds = [];
      this.deliverinvoiceItemIds = ids;
    },
    // 提交
    dataSubmit() {
      const form = {
        deliverinvoiceItemId: this.deliverinvoiceItemIds,
      };
      InvoiceItem.submit(form).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
          this.$bus.$emit('data/list');
        }
      });
    },
    dataPage(page, size, total) {
      this.page = page;
      this.size = size;
      this.total = total;
    },
  },
};
</script>

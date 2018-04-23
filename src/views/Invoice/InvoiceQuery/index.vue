<template>
  <div>
    <Find :showNum="8" :message="message"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
  </div>
</template>

<script>
import Show from './Show';
import InvoiceQuery from '../../../api/Invoice/InvoiceQuery';

export default {
  activated() {
    this.authbtn = InvoiceQuery.authbtn();
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
        path: '/Invoice/InvoiceQuery',
        name: '发票查询',
        noLink: true,
      },
    ]);
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
  },
  watch: {
    authList() {
      this.authbtn = InvoiceQuery.authbtn();
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
        exportData: false,
      },
      message: [
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
          key: 'number',
          label: '发票号',
          placeholder: '请输入发票号',
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
          key: 'batchNo',
          label: '批号',
          placeholder: '请输入批号',
          type: 0,
          selects: [],
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
  },
};
</script>

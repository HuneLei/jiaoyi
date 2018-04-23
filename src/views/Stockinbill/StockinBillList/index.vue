<template>
  <div>

    <div id="StockinBillList">

      <Find :showNum="8" :message="message"></Find>
      <Show :authbtn="authbtn" @page="dataPage"></Show>
      <Paging :authbtn="authbtn" :show-btn="ShowBtn" :page="page" :size="size" :total="total"></Paging>

    </div>

  </div>
</template>

<script>
/**
 * 入库单管理
 * ----------------------------
 * 入库单列表
 */
import { mapActions, mapGetters } from 'vuex';
import Show from './StockinShow';                                         // 引用列表显示组件
import StockinBillList from '../../../api/Stockinbill/StockinBillList';       // 引入入库列表api

export default {
  components: {
    Show,
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
    ...mapGetters([
      'View_UserInfo',
      'View_UserInfor',
      'getGpoId',
    ]),
  },
  methods: {
    // 获取页码数据
    dataPage(page, size, total) {
      this.page = page;
      this.size = size;
      this.total = total;
    },
    //  初始化新增按钮
    dataInitBtn() {
      if (this.View_UserInfo.memberType === 3) {
        this.ShowBtn = {
          ...this.ShowBtn,
          create: true,
        };
      } else {
        this.ShowBtn = {
          ...this.ShowBtn,
          create: false,
        };
      }
    },
    ...mapActions([
      'ItemList',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = StockinBillList.authbtn();
      this.dataInitBtn();
    },
  },
  activated() {
    this.authbtn = StockinBillList.authbtn();
    this.dataInitBtn();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Stockinbill',
        name: '入库单管理',
        noLink: true,
      },
      {
        path: '/StockinBillList',
        name: '入库单列表',
        noLink: true,
      },
    ]);
  },
  data() {
    return {
      page: 1,              // 当前页数
      size: 20,             // 一页显示多少列
      total: 0,             // 一共多少页
      ShowBtn: {            // 按钮显示控制
        create: false,
      },
      authbtn: {},
      message: [
        {
          key: 'code',
          label: '入库单编码',
          placeholder: '请输入编号',
          type: 0,
        },
        {
          key: 'hospitalMemberName',
          label: '医疗机构',
          placeholder: '请输入名称',
          type: 0,
        },
        {
          key: 'deliveryMemberName',
          label: '配送企业',
          placeholder: '请输入名称',
          type: 0,
        },
        {
          type: 9,  // 类型
          key: 'createTime',
          label: '创建日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        {
          key: 'status',
          label: '状态',
          placeholder: '请选择状态',
          type: 1,
          selects: window.baseSelect.status,
        },
        {
          key: 'noOut',
          label: '外部入库单号',
          placeholder: '请输入编号',
          type: 0,
        },
        {
          type: 9,  // 类型
          key: 'sendTime',
          label: '入库日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: false,  // 是否进来默认为一个月
        },
      ],
    };
  },
};
</script>

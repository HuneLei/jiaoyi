<template>
  <div>
    <Find :showNum="5" :moreShow="0" :message="message" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
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
import HospitalChangeDelivery from '../../../api/Deliverrelation/HospitalChangeDelivery';
import Show from './Show';

export default {
  activated() {
    this.authbtn = HospitalChangeDelivery.authbtn();
    this.$bus.$on('table/height', this.tableHeightRun);  //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.getProjectAll();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Deliverrelation',
        name: '配送关系管理',
        noLink: true,
      },
      {
        path: '/Deliverrelation/HospitalChangeDelivery',
        name: '买方更换配送',
        noLink: true,
      },
    ]);
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$off('project/getAll', this.getProjectAll);
  },
  components: {
    Show,
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
      this.authbtn = HospitalChangeDelivery.authbtn();
    },
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      page: 1,
      size: 20,
      total: 0,
      defaultAjax: 0,
      showBtn: {
        create: true,
      },
      // 搜索字段
      message: [
        {
          key: 'applicationNo',
          label: '申请单号',
          placeholder: '请输入申请单号',
          type: 0,
          selects: [],
        },
        {
          key: 'projectId',
          label: '集采项目',
          placeholder: '请输入集采项目',
          type: 1,
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
          key: 'salerStatic',
          label: '状态',
          type: 1,
          selects: [
            {
              label: '待提交',
              value: '0',
            },
            {
              label: '待审核',
              value: '1',
            },
            {
              label: '审核通过',
              value: '2',
            },
            {
              label: '审核不通过',
              value: '3',
            },
          ],
        },
        {
          key: 'createTime',
          label: '创建日期',
          convertdate: 2,
          type: 5,
          placeholder: '请选择日期',
          selects: [],
          defaultDate: true,
          pickerOptions: {
            shortcuts: [{
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
                picker.$emit('pick', [start, end]);
              },
            }, {
              text: '最近半年',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - (3600 * 1000 * 24 * 182));
                picker.$emit('pick', [start, end]);
              },
            }, {
              text: '最近一年',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - (3600 * 1000 * 24 * 365));
                picker.$emit('pick', [start, end]);
              },
            }],
          },
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.TableHeightRun();
    });
    window.onresize = () => {
      if (this.$route.path === '/Deliverrelation/HospitalChangeDelivery') {
        this.TableHeightRun();
      } else if (this.$route.path === '/Deliverrelation/HospitalChangeDelivery/Create') {
        this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
      } else if (this.$route.path === '/Deliverrelation/HospitalChangeDelivery/Edit') {
        this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
      }
    };
  },
  methods: {
    dataPage(page, size, total) {
      this.page = page;
      this.size = size;
      this.total = total;
    },
    // 获取集采项目下拉
    getProjectAll() {
      this.message[1].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[1].defaults = this.getProjectId; // 给项目集采名称options赋值
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    },
    //  计算表格高度
    tableHeightRun() {
      this.$nextTick(() => {
        this.TableHeightRun();
      });
    },
    ...mapActions([
      'TableHeightRun',
    ]),
  },
};
</script>

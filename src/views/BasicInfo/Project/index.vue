<template>
  <div>
    <Find :showNum="showNum" :message="message"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :totalPages="totalPages"></Paging>
    <Edit></Edit>
  </div>
</template>


<script>
  /**
   * Created by dingyiming on 2017/6/2.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */
  import Show from './Show';
  import { Paging } from '../../../components/index';
  import project from '../../../api/BasicInfo/Project';   // api
  import Edit from './Edit';

  export default {
    activated() {
      this.authbtn = project.authbtn();
      // 面包屑
      this.$store.commit('BreadCrumb_Update', [
        {
          path: '/index',
          name: this.$store.state.view.resourcesNow.name,
        },
        {
          path: '/BasicInfo',
          name: '基础信息',
          noLink: true,
        },
        {
          path: '/Project',
          name: '集采项目表',
          noLink: true,
        },
      ]);
    },
    watch: {
      authList() {
        this.authbtn = project.authbtn();
      },
    },
    components: {
      Paging,
      Show,
      Edit,
    },
    data() {
      return {
        authbtn: {},              //  识别用户拥有的权限
        page: 1,
        size: 50,
        total: 0,
        totalPages: 0,
        showNum: 4,       // 搜索框显示表单的个数
        // 搜索字段
        message: [
          {
            key: 'projectName',
            label: '集采项目',
            placeholder: '请输入集采项目名称',
            hasOp: false,
            type: 0,
          },
          {
            key: 'pattern',
            label: '采购模式',
            placeholder: '请选择采购模式',
            hasOp: false,
            type: 1,
            selects: [
              {
                value: 0,
                label: 'GPO模式',
              },
              {
                value: 1,
                label: '第三方模式',
              },
            ],
          },
          {
            key: 'releaseStatus',
            label: '集采项目状态',
            placeholder: '请选择集采项目公布状态',
            hasOp: false,
            type: 1,
            selects: [
              {
                value: 0,
                label: '未公布',
              },
              {
                value: 1,
                label: '公布',
              },
            ],
          },
          {
            type: 9,  // 类型
            key: 'dateRange',
            label: '项目起止日期',
            shortcuts: true,  // 是否开启快捷选择
            // defaultDate: true,  // 是否进来默认为一个月
          },
          // {
          //   key: 'dateRange',
          //   label: '项目起止日期',
          //   placeholder: '请选择集采项目起止日期',
          //   type: 5,
          // },
        ],
      };
    },
    methods: {
      dataPage(page, size, total, totalPages) {
        this.page = page;
        this.size = size;
        this.total = total;
        this.totalPages = totalPages;
      },
    },
  };
</script>


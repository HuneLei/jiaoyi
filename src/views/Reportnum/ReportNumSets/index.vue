<template>
  <div>
    <Find :showNum="4" :message="message" @selectValue="getSelectValue" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
    <ChangeEditDialog></ChangeEditDialog>
    <ChangeCreateDialog></ChangeCreateDialog>
  </div>
</template>

<script>
  /**
   * Created by wuqian on 2017/9/20.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */
  import { mapActions, mapGetters } from 'vuex';
  import Show from './Show';
  import ChangeEditDialog from './ChangeEditDialog';
  import ChangeCreateDialog from './ChangeCreateDialog';
  import ReportNumSets from '../../../api/Reportnum/ReportNumSets';
  import gpo from '../../../api/gpo'; // gpo API

  export default {
    activated() {
      this.authbtn = ReportNumSets.authbtn();
      this.$bus.$on('project/getAll', this.getProjectAll);
      this.getProjectAll();
      this.$store.commit('BreadCrumb_Update', [
        {
          path: '/index',
          name: this.$store.state.view.resourcesNow.name,
        },
        {
          path: '/Reportnum',
          name: '医疗机构报量管理',
          noLink: true,
        },
        {
          path: '/Reportnum/ReportNumSets',
          name: '报量期间设置',
          noLink: true,
        },
      ]);
    },
    deactivated() {
      this.$bus.$off('project/getAll', this.getProjectAll);
    },
    components: {
      Show,
      ChangeEditDialog,
      ChangeCreateDialog,
    },
    computed: {
      authList() {
        return this.$store.state.view.authList;
      },
      ...mapGetters([
        'getGpoId',
        'projectOptions',
        'getProjectId',
      ]),
    },
    watch: {
      authList() {
        this.authbtn = ReportNumSets.authbtn();
        // console.log();
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
          destory: true,
        },
        message: [
          {
            key: 'timeName',
            label: '期间名称',
            placeholder: '请输入期间名称',
            type: 0,
            selects: [],
          },
          {
            key: 'projectId',
            label: '集采项目',
            type: 8,
            selects: [],
          },
          {
            key: 'projectSubId',
            label: '集采子项目',
            type: 1,
            filterable: true,
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
      // 得到集采项目改变值
      getSelectValue(val) {
        // console.log();
        this.subProjectAll(val);
      },
      // 获取集采项目下拉
      getProjectAll() {
        // console.log();
        this.message[1].selects = this.projectOptions; // 给项目集采名称options赋值
        this.message[1].defaults = this.getProjectId;  // 给项目集采名称options赋值
        this.defaultAjax += 1;                         // 控制defaultAjax变化监听
      },
      subProjectAll(val) {
        //  集采子项目
        // console.log();
        if (this.getGpoId) {
          ReportNumSets.all(this.getGpoId, val || null).then((res) => {
            if (res.data.code === 0) {
              const data = res.data.result;
              const subProjectOption = [];
              for (let i = 0; i < data.length; i += 1) {
                subProjectOption.push({
                  value: data[i].id,
                  label: data[i].name,
                });
              }
              this.message[2].selects = subProjectOption;
            }
          });
        }
      },
    },
  };
</script>

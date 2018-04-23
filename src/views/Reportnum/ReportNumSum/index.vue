<template>
  <div>
    <Find :showNum="8" :message="message" @selectValue="getSelectValue" :defaultAjax="defaultAjax"></Find>
    <Show @page="dataPage"></Show>
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
  import { mapState, mapGetters } from 'vuex';
  import Show from './Show';
  import gpo from '../../../api/gpo'; // gpo API
  import ReportNumSum from '../../../api/Reportnum/ReportNumSum';

  export default {
    activated() {
      this.authbtn = ReportNumSum.authbtn();
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
          path: '/Reportnum/ReportNumSum',
          name: '报量汇总',
          noLink: true,
        },
      ]);
    },
    deactivated() {
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
      ]),
    },
    watch: {
      authList() {
        this.authbtn = ReportNumSum.authbtn();
        // console.log();
      },
    },
    data() {
      return {
        authbtn: {},              //  识别用户拥有的权限
        page: 1,
        size: 20,
        total: 0,
        defaultAjax: 0,   // 控制下拉框默认
        showBtn: {
          exportData: true,
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
          { key: 'qualityLevel', label: '质量层次', placeholder: '请输入质量层次', type: 0, selects: [] },
          {
            key: 'producerName',
            label: '生产企业',
            placeholder: '请输入生产企业',
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
            key: 'timeId',
            label: '期间名称',
            type: 1,
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
        // this.subProjectAll(val);
        this.timeNameAll(val);
      },
      // 获取集采项目下拉
      getProjectAll() {
        this.message[4].selects = this.projectOptions; // 给项目集采名称options赋值
        this.message[4].defaults = this.getProjectId;  // 给项目集采名称options赋值
        this.defaultAjax += 1;                         // 控制defaultAjax变化监听
      },
      //  集采子项目
      // subProjectAll(val) {
      //   if (this.getGpoId) {
      //     gpo.ProjectSubCommonAll(this.getGpoId, val || null).then((res) => {
      //       if (res.data.code === 0) {
      //         const data = res.data.result;
      //         const subProjectOption = [];
      //         for (let i = 0; i < data.length; i += 1) {
      //           subProjectOption.push({
      //             value: data[i].id,
      //             label: data[i].name,
      //           });
      //         }
      //         this.message[0].selects = subProjectOption;
      //       }
      //     });
      //   }
      // },
      //  期间名称
      timeNameAll(val) {
        if (this.getGpoId) {
          ReportNumSum.timeNameAll(val).then((res) => {
            if (res.data.code === 0) {
              const data = res.data.result;
              const timeNameOption = [];
              for (let i = 0; i < data.length; i += 1) {
                timeNameOption.push({
                  value: data[i].id,
                  label: data[i].name,
                });
              }
              this.message[5].selects = timeNameOption;
            }
          });
        }
      },
    },
  };
</script>


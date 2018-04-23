<template>
  <div>
    <Find :showNum="8" :moreShow="0" :message="message" @selectValue="getSelectValue" :defaultAjax="defaultAjax"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
    <ChangeMoreDialog></ChangeMoreDialog>
    <ChangeLessDialog></ChangeLessDialog>
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/9/5.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import Show from './Show';
import ChangeMoreDialog from './ChangeMoreDialog';
import ChangeLessDialog from './ChangeLessDialog';
import gpo from '../../../api/gpo'; // gpo 公共API
import DrugsUp from '../../../api/Drugs/DrugsUp'; // 药品上架管理APi

export default {
  activated() {
    this.authbtn = DrugsUp.authbtn();
    // console.log();
    if (this.getPrincipal.memberType === 4 || this.getPrincipal.memberType === 5) {
      this.showBtn = {
        create: true,
        onDrugs: true,
        offDrugs: true,
        exportData: true,
      };
    }
    if (this.getPrincipal.memberType !== 5) {
      this.message[11].selects.splice(1, 1);
    }
    if (this.getPrincipal.memberType === 3) {
      this.message.splice(12, 1);
    }
    // console.log();
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.getProjectAll();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Drugs',
        name: '药品管理',
        noLink: true,
      },
      {
        path: '/Drugs/DrugsUp',
        name: '药品上架管理',
        noLink: true,
      },
    ]);
    // document.onselectstart = (evt) => {
    //   evt.preventDefault();
    // };
  },
  deactivated() {
    this.$bus.$off('project/getAll', this.getProjectAll);
    // document.onselectstart = null;
  },
  computed: {
    getPrincipal() {
      return this.$store.state.view.principal;
    },
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
      this.authbtn = DrugsUp.authbtn();
      // console.log();
    },
  },
  components: {
    Show,
    ChangeMoreDialog,
    ChangeLessDialog,
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
        create: false,
        onDrugs: false,
        offDrugs: false,
      },
      message: [
        { key: 'projectSubId', label: '集采子项目', type: 1, filterable: true, selects: [] },
        { key: 'drugsCode', label: '药品编码', placeholder: '请输入药品编码', type: 0, selects: [] },
        { key: 'drugsName', label: '通用名', placeholder: '请输入通用名', type: 0, selects: [] },
        { key: 'formName', label: '剂型', placeholder: '请输入剂型', type: 0, selects: [] },
        { key: 'specName', label: '规格', placeholder: '请输入规格', type: 0, selects: [] },
        { key: 'qualityLevel', label: '质量层次', placeholder: '请输入质量层次', type: 0, selects: [] },
        { key: 'producerName', label: '生产企业', placeholder: '请输入生产企业', type: 0, selects: [] },
        { key: 'tradeName', label: '商品名', placeholder: '请输入商品名', type: 0, selects: [] },
        { key: 'approvalNumber', label: '批准文号', placeholder: '请输入批准文号', type: 0, selects: [] },
        { key: 'drugStandardCode', label: '药品本位码', placeholder: '请输入药品本位码', type: 0, selects: [] },
        { key: 'medicalInsuranceDirectory', label: '医保目录', placeholder: '请输入医保目录', type: 0, selects: [] },
        {
          key: 'upStatus',
          label: '上架状态',
          type: 1,
          defaults: 1,
          selects: [
            { value: 1, label: '已上架' },
            { value: 0, label: '未上架' },
          ],
        },
        {
          key: 'isChangeDelivery',
          label: '可变更配送',
          type: 1,
          selects: [
            { value: 1, label: '是' },
            { value: 0, label: '否' },
          ],
        },
        {
          key: 'basicType',
          label: '基药属性',
          type: 1,
          selects: [
            { value: 1, label: '国基' },
            { value: 2, label: '省基' },
            { value: 0, label: '空' },
          ],
        },
        { key: 'projectId', label: '集采项目', type: 8, selects: [] },
        { key: 'enrollName', label: '卖方会员', placeholder: '请输入卖方会员', type: 0, selects: [] },
        { key: 'remarks', label: '备注', placeholder: '请输入备注', type: 0, selects: [] },
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
      this.subProjectAll(val);
    },
    // 获取集采项目下拉
    getProjectAll() {
      this.message[this.message.length - 3].selects = this.projectOptions; // 给项目集采名称options赋值
      this.message[this.message.length - 3].defaults = this.getProjectId; // 给项目集采名称options赋值
      this.defaultAjax += 1; // 控制defaultAjax变化监听
    },
    subProjectAll(val) {
      if (this.getGpoId) {
        gpo.ProjectSubCommonAll(this.getGpoId, val || null).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            const subProjectOption = [];
            for (let i = 0; i < data.length; i += 1) {
              subProjectOption.push({
                value: data[i].id,
                label: data[i].name,
              });
            }
            this.message[0].selects = subProjectOption;
          }
        });
      }
    },
  },
};
</script>

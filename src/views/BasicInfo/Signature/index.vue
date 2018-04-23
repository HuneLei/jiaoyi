<template>
  <div>
    <Find :showNum="4" :message="message"></Find>
    <Show :authbtn="authbtn" @page="dataPage"></Show>
    <Paging :authbtn="authbtn" :page="page" :size="size" :total="total" :showBtn="showBtn"></Paging>
    <CreateDialog></CreateDialog>
    <UpdateDialog></UpdateDialog>
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
  import CreateDialog from './CreateDialog';
  import UpdateDialog from './UpdateDialog';
  import Signature from '../../../api/BasicInfo/Signature'; // 公告管理APi

  export default {
    activated() {
      this.SignatureAll();
      this.authbtn = Signature.authbtn();
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
          path: '/BasicInfo/Signature',
          name: '印章管理',
          noLink: true,
        },
      ]);
    },
    computed: {
      getPrincipal() {
        return this.$store.state.view.principal;
      },
      authList() {
        return this.$store.state.view.authList;
      },
    },
    watch: {
      authList() {
        this.authbtn = Signature.authbtn();
      },
    },
    components: {
      Show,
      CreateDialog,
      UpdateDialog,
    },
    data() {
      return {
        authbtn: {},              //  识别用户拥有的权限
        page: 1,
        size: 20,
        total: 0,
        showBtn: {
          create: true,
          destory: true,
        },
        message: [
          {
            key: 'memberNo',
            label: '会员编码',
            placeholder: '请输入会员编码',
            type: 0,
            selects: [],
          },
          {
            key: 'memberName',
            label: '会员名称',
            placeholder: '请输入会员名称',
            type: 0,
            selects: [],
          },
          {
            key: 'memberType',
            label: '会员类型',
            type: 1,
            selects: [
              {
                value: 1,
                label: '生产企业',
              },
              {
                value: 3,
                label: '医疗机构',
              },
              {
                value: 2,
                label: '经营企业',
              },
              {
                value: 4,
                label: 'GPO',
              },
              {
                value: 5,
                label: '平台',
              },
            ],
          },
          {
            key: 'typeId',
            label: '印章类别',
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
      SignatureAll() {
        Signature.commonReason('sealType').then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            const SignatureOption = [];
            for (let i = 0; i < data.length; i += 1) {
              SignatureOption.push({
                value: data[i].id,
                label: data[i].paramValue,
              });
            }
            this.message[3].selects = SignatureOption;
          }
        });
      },
    },
  };
</script>


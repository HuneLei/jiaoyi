<template>
  <DialogList :isShowDialog="options.isShowDialog" :tableType="options.tableType" :msgBase="options.msgBase" :options="optionsDialog" @dialogHide="dialogHide">

    <div slot="customFooterName" align="center">
      <el-button type="primary" @click="dialogHide()">返回</el-button>
    </div>
  </DialogList>
</template>

<script>
/**
 * Created by yaoling on 2017/9/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import DialogList from '../../../components/DialogList';                            //  弹框组件
import ProducerChoseDelivery from '../../../api/Deliverrelation/ProducerChoseDelivery';

export default {
  activated() {
    this.$bus.$on('data/getRow', this.getRow);    // 监听获取已选择配送商的列表结果
  },
  deactivated() {
    this.$bus.$on('data/getRow', this.getRow);
  },
  components: {
    DialogList,
  },
  props: {
    options: {
      msgBase: '',
      isShowDialog: false,
      tableSelected: null,
      tableType: 0,                       //  0 单选，1 多选 默认单选
      isHideSearch: true,
    },
    row: {},
  },
  computed: mapGetters([
    'getGpoId',
    'getProjectId',
  ]),
  data() {
    return {
      optionsDialog: {                    //  基础配置，都要配的
        isLoadingTable: false,             //  表格的loading
        title: '可配送医疗机构列表',                //  弹出框的标题
        dialogSize: 'tiny',              //  弹出框的大小，tiny/small/large/full
        page: 1,                          //  当前页
        pageTotal: 0,                     //  总条数
        pageSize: 10,                     //  每一页显示多少条
        showSelection: true,
        selection: false,           //  表格选择框，去掉
        isHideSearch: true,
        filterForm: {
          id: null,
          projectId: null,
          gpoMemberId: null,
        },
        tableData: [],                    //  表格信息
        tableOptions: [                   //  要显示的表格列，默认开启选择框、num
          {
            key: 'hospitalName',
            name: '医疗机构名称',
          },
        ],
        searchMessage: [],    //  初始化搜索条件
        customFooter: true,         //  是否自定义底部
        customFooterName: 'customFooterName',   // 自定义底部的名称
      },
    };
  },
  methods: {
    //  关闭弹出框
    dialogHide() {
      this.options.isShowDialog = false;
    },
    getRow(row, projectId1) {
      this.filterForm = Object.assign({}, this.filterForm, {
        id: row.id,
        gpoMemberId: this.getGpoId,
        projectId: projectId1,
      });
      this.dataList();
    },
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      ProducerChoseDelivery.coverage(cpage, cpageSizes, this.filterForm)
        .then((res) => {
          // console.log();
          if (res.data.code === 0) {
            this.optionsDialog.isLoadingTable = false;
            const data = res.data.result.content;
            for (let i = 0; i < data.length; i += 1) {
              data[i].num = (res.data.result.number * res.data.result.size) + i + 1;
            }
            this.optionsDialog.page = res.data.result.number + 1;
            this.optionsDialog.pageTotal = res.data.result.totalElements;
            this.optionsDialog.pageSize = res.data.result.size;
            this.optionsDialog.tableData = data;
            // setTimeout(() => {
            //   this.$bus.$emit('dialogList/select');
            // }, 0);
          }
        });
      this.loading = false;
    },
  },
};
</script>

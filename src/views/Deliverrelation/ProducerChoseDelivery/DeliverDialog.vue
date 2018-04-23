<template>
  <!--<DialogList :isShowDialog="options.isShowDialog" :tableType="options.tableType" :msgBase="options.msgBase" :options="optionsDialog" @dialogHide="dialogHide">
          <div slot="customFooterName" align="center">
            <el-button type="primary" @click="dialogHide()">返回</el-button>
          </div>
        </DialogList>-->
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" size="tiny">
      <el-form ref="form" label-width="140px" class="edit-form">
        <el-table v-loading="areaLoading" border fit :data="deliveryData" stripe height="400">
          <el-table-column prop="num" label="#" width="40"></el-table-column>
          <el-table-column width="100" prop="deliveryMemberCode" label="配送企业编码" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="200" prop="deliveryMemberName" label="配送企业名称" sortable show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
/**
 * Created by yaoling on 2017/9/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import DialogList from '../../../components/DialogList';                            //  弹框组件
import ProducerChoseDelivery from '../../../api/Deliverrelation/ProducerChoseDelivery';    // api

export default {
  activated() {
    this.$bus.$on('data/deliver', this.dataDeliver);
  },
  deactivated() {
    this.$bus.$off('data/deliver', this.dataDeliver);
  },
  components: {
    DialogList,
  },
  props: {
    options: {
      msgBase: '',                        //  没什么卵用，有需要可以看看
      isShowDialog: false,                //  显示弹框
      tableSelected: null,                //  默认表格选中
      tableType: 1,                       //  0 单选，1 多选 默认单选
    },
    row: {},
  },
  data() {
    return {
      elTabs: 0,
      dialogVisible: false,
      // 是否可编辑
      areaLoading: false,
      areaPage: 1,
      areaSize: 15,
      areaTotal: 0,
      deliveryData: [],
      title: '已选配送企业',
      gid: '',
      pid: '',
      did: '',
      // filterForm: {
      //   projectId: null,
      //   gpoMemberId: null,
      //   drugsId: null,
      //   salerMemberId: null,
      // },
      // optionsDialog: {                    //  基础配置，都要配的
      //   isLoadingTable: false,             //  表格的loading
      //   title: '已选配送企业',                //  弹出框的标题
      //   dialogSize: 'small',              //  弹出框的大小，tiny/small/large/full
      //   page: 1,                          //  当前页
      //   pageTotal: 0,                     //  总条数
      //   pageSize: 10,                     //  每一页显示多少条
      //   showSelection: true,
      //   selection: false,           //  表格选择框，去掉
      //   tableHeight: 200,
      //   isHideSearch: true,
      //   filterForm: {
      //     projectId: null,
      //     gpoMemberId: null,
      //     drugsId: null,
      //     salerMemberId: null,
      //   },
      //   tableData: [],                    //  表格信息
      //   tableOptions: [                   //  要显示的表格列，默认开启选择框、num
      //     {
      //       key: 'deliveryMemberCode',
      //       name: '配送企业编码',
      //     },
      //     {
      //       key: 'deliveryMemberName',
      //       name: '配送企业名称',
      //     },
      //   ],
      //   searchMessage: [],    //  初始化搜索条件
      //   customFooter: true,         //  是否自定义底部
      //   customFooterName: 'customFooterName',   // 自定义底部的名称
      // },
    };
  },
  methods: {
    dataDeliver(form) {
      // console.log();
      this.dialogVisible = true;
      this.editType = 0;
      this.filterForm = form;
      this.gid = form.gpoMemberId;
      this.pid = form.projectId;
      this.did = form.drugsId;
      // console.log();
      this.dataList();
    },
    // 加载列表
    dataList() {
      this.areaLoading = true;
      ProducerChoseDelivery.deliverList(this.pid, this.gid, this.did)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            for (let i = 0; i < data.length; i += 1) {
              // const numX = (i + 1) + ((this.areaPage - 1) * this.areaSize);
              data[i].num = i + 1;
            }
            // this.optionsDialog.page = res.data.result.number + 1;
            // this.optionsDialog.pageTotal = res.data.result.totalElements;
            // this.optionsDialog.pageSize = res.data.result.size;
            this.deliveryData = data;
          }
          this.areaLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.edit-form {
  padding-bottom: 0.3rem;
  overflow-x: hidden;
  overflow-y: auto;
}

.edit-form-title {
  font-size: 20px;
  padding: .1rem;
  margin-bottom: .2rem;
  border-bottom: .01rem solid #eee;
}
</style>

<style>
.el-dialog__body {
  padding-top: 10px !important;
}
</style>

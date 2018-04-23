<template>
  <!--<DialogList :isShowDialog="options.isShowDialog" :tableType="options.tableType" :msgBase="options.msgBase" :options="optionsDialog" @dialogHide="dialogHide">
          <div slot="customFooterName" align="center">
            <el-button type="primary" @click="dialogHide()">返回</el-button>
          </div>
        </DialogList>-->
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" size="tiny">
      <el-form ref="form" label-width="140px" class="edit-form">
        <el-table border fit :data="deliveryData" stripe height="400">
          <el-table-column prop="num" label="#" width="40"></el-table-column>
          <el-table-column min-width="200" prop="enrollName" label="卖方会员名称" sortable show-overflow-tooltip>
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

export default {
  activated() {
    this.$bus.$on('data/salerMemberList', this.salerMemberList);
  },
  deactivated() {
    this.$bus.$off('data/salerMemberList', this.salerMemberList);
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
      dialogVisible: false,
      deliveryData: [],
      title: '卖方会员',
    };
  },
  methods: {
    salerMemberList(form) {
      this.dialogVisible = true;
      this.deliveryData = form;
      const ret = [];
      for (let i = 0; i < this.deliveryData.length; i += 1) {
        const item = this.deliveryData[i];
        const data = {
          enrollName: item,
        };
        ret.push(data);
      }
      this.deliveryData = ret;
      // console.log('this.deliveryData', this.deliveryData);
      for (let i = 0; i < this.deliveryData.length; i += 1) {
        this.deliveryData[i].num = i + 1;
      }
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
  padding: 0.1rem;
  margin-bottom: 0.2rem;
  border-bottom: 0.01rem solid #eee;
}
</style>

<style>
.el-dialog__body {
  padding-top: 10px !important;
}
</style>

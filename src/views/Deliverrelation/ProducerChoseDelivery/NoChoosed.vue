<template>
  <!--<DialogList :isShowDialog="options.isShowDialog" :showBtn="showBtn" :tableType="options.tableType" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage"  @dialogHide="dialogHide">
        </DialogList>-->
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" size="small">
      <el-form ref="form" label-width="140px" class="edit-form">
        <el-table v-loading="storeLoading" border fit :data="specificData" stripe height="400">
          <el-table-column prop="num" label="#" width="40"></el-table-column>
          <el-table-column min-width="80" prop="hospitalName" label="医疗机构名称" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column min-width="150" prop="enterpriseName" label="配送企业名称" sortable show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="affirm()">
          <i class="icon iconfont icon-right_circle"></i>继续</el-button>
        <el-button @click="dialogHide()">
          <i class="icon iconfont icon-fanhui"></i>返回</el-button>
      </span>
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
import { mapActions, mapGetters } from 'vuex';
import DialogList from '../../../components/DialogList';                            //  弹框组件
import ProducerChoseDelivery from '../../../api/Deliverrelation/ProducerChoseDelivery';

export default {
  activated() {
    this.$bus.$on('data/getId1', this.getId);    // 监听获取已选择配送商的列表结果
    // this.dataList();
  },
  deactivated() {
    this.$bus.$off('data/getId1', this.getId);
  },
  computed: mapGetters([
    'getGpoId',
    'getProjectId',
  ]),
  components: {
    DialogList,
  },
  data() {
    return {
      dialogVisible: false,
      specificData: [],
      storeLoading: false,
      projectId: '',
      gpoMemberId: '',
      drugsId: '',
      nameType: '',
      salerMemberId: '',
      deliveryMemberId: [],
      title: '',
    };
  },
  methods: {
    dialogHide() {
      this.dialogVisible = false;
    },
    getId(form) {
      console.log('form', form);
      // console.log();
      this.dialogVisible = true;
      this.title = '尚有以下配送企业与医疗机构建立配送协议，并且未被勾选，是否继续？';
      this.projectId = form.projectId;
      this.gpoMemberId = form.gpoMemberId;
      this.deliveryMemberId = form.deliveryMemberId;
      this.drugsId = form.drugsId;
      this.nameType = form.nameType;
      this.salerMemberId = form.salerMemberId;
      // console.log();
      this.dataDialogList();
    },
    dataDialogList() {
      this.storeLoading = true;
      ProducerChoseDelivery.specific(this.drugsId, this.projectId, this.gpoMemberId,
        this.salerMemberId, this.nameType, this.deliveryMemberId).then((res) => {
          // console.log();
          // this.$bus.$emit('data/result', res);
          if (res.data.code === 0) {
            const data = res.data.result.content;
            for (let i = 0; i < data.length; i += 1) {
              data[i].num = i + 1;
            }
            this.specificData = data;
          }
        });
      this.storeLoading = false;
    },
    affirm() {
      // console.log();
      this.dialogHide();
      this.$emit('nochoose-confim');
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

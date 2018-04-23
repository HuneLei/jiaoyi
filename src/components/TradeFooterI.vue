<template>
  <div class="tradeFooter">
    <div  v-if="increased" class="tradeButton">
      <el-button
        name = "Save"
        type="primary"
        size="small"
        v-show="isSaveShow"
        @click="orderSave"
        :disabled="btnDisabled.planSave"
        class="page_btn">
        <i class="icon iconfont icon-baocun"></i>保存
      </el-button>
      <el-button
        name="Delete"
        v-if="authbtn.delete"
        type="danger"
        size="small"
        v-show="isDeleteShow"
        @click="orderDelete"
        :disabled="btnDisabled.planDelete"
        class="page_btn">
        <i class="icon iconfont icon-delete"></i>删除
      </el-button>
      <el-button
        name="submit"
        type="primary"
        size="small"
        v-show="isSubmitShow"
        @click="orderSubmit"
        :disabled="btnDisabled.planSubmit"
        class="page_btn">
        <i class="icon iconfont icon-tijiao"></i>提交
      </el-button>
      <el-button
        name="Back"
        v-show="isBackShow"
        size="small"
        @click="orderBack"
        :disabled="btnDisabled.planBack"
        class="page_btn">
        <i class="icon iconfont icon-fanhui"></i>返回
      </el-button>
    </div>
    <div style="height: 0.25rem;"></div>
  </div>
</template>

<script>
  /**
   * Created by yaoling on 2017/9/3.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */
  export default {
    data() {
      return {
        tradeWidth: 200,
        increased: true,
        dataSelected: [],
//        authbtn: {
//          save: true,
//          delete: true,
//          back: true,
//          submit: true,
//        },
      };
    },
    props: {
      page: {
        type: Number,
        default: 0,
      },
      size: {
        type: Number,
        default: 15,
      },
      total: {
        type: Number,
        default: 0,
      },
      authbtn: {},                  //  判断某用户是否有该按钮权限
      isCreateShow: false,  // 生成订单按钮控制
      isSaveShow: false,  // 保存按钮控制
      isDeleteShow: false, // 删除按钮控制
      isApplyShow: false, // 申请结案按钮控制
      isPrintShow: false, // 打印按钮控制
      isSubmitShow: false, // 提交按钮控制
      isBackShow: {    // 返回按钮控制
        default: true,
      },
      tradeFooterBtnStatus: {
        type: Object,
        default() {
          return {

          };
        },
      },
      btnDisabled: {
        type: Object,
        default() {
          return {
            planCreate: false,
            planSave: false,
            planSubmit: false,
            planDelete: false,
            planBack: false,
            planApply: false,
            planPrint: false,
          };
        },
      },
    },
    methods: {
      //  返回操作
      orderBack() {
        this.$emit('order-back', this.dataSelected);
      },
      // 批量删除
      orderDelete() {
        this.$confirm('此操作将删除该记录，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$emit('order-delete', this.dataSelected);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          });
        });
      },
      // 批量提交
      orderSubmit() {
        this.$confirm('此操作将提交该记录，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$emit('data-submit', this.dataSelected);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          });
        });
      },
      // 批量保存
      orderSave() {
        this.$confirm('此操作将保存该数据，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$emit('order-save', this.dataSelected);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          });
        });
      },
      //  数据选中
//      dataSelect(vals, btnDisabled) {
//        this.dataSelected = Object.assign(vals);
//        Object.assign(this.btnDisabled, btnDisabled);
//      },
      //  条目数切换
      handleSizeChange(size) {
        this.$bus.$emit('data/list', 0, size);
      },
      //  页码切换
      pageChange(val) {
        this.$bus.$emit('page/change', val - 1);
      },
    },
  };
</script>

<style scoped>
  .tradeFooter {
    text-align: center;
    margin-top: .2rem;
    position: absolute;
    bottom: 0;
    z-index: 10;
    width: 100%;
  }
  .tradeButton {
    margin: 0 auto;
  }
  .tradeFooter_left {
    margin-left: -10px;
  }

  .el-button {
    float: left;
    padding: 8px;
    margin-left: 10px;
  }

  .el-button i {
    margin-right: 2px;
  }
  .tradeFooter .el-button {
    float: none;
  }
</style>

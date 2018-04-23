<template>
  <div class="paging">
    <div class="page_left">
      <el-button name="create" v-if="authbtn.create&&showBtn.create" size="small" class="page_btn" type="primary" @click="dataDo">
        <i class="icon iconfont icon-xinzeng"></i>新增
      </el-button>
      <el-button name="createGPO" v-if="authbtn.create&&showBtn.createGPO" size="small" class="page_btn" type="primary" @click="dataCreateGPO">
        <i class="icon iconfont icon-xinzeng"></i>新增(GPO)
      </el-button>
      <el-button name="createSaler" v-if="authbtn.create&&showBtn.createSaler" size="small" class="page_btn" type="primary" @click="dataCreateSaler">
        <i class="icon iconfont icon-xinzeng"></i>新增(卖方)
      </el-button>
      <el-button name="destory" v-if="authbtn.destory&&showBtn.destory" size="small" class="page_btn" type="danger" @click="dataDelete" :disabled="selectIds.length === 0">
        <i class="fa fa-trash"></i> 删除
      </el-button>
      <el-button name="onDrugs" v-if="authbtn.upStatusUpdate&&showBtn.onDrugs" size="small" class="page_btn" type="info" @click="onDrugsClick" :disabled="!btnDisabled.onDrugs||selectIds.length === 0">
        <i class="fa fa-arrow-circle-up"></i>上架已选药品
      </el-button>
      <el-button name="offDrugs" v-if="authbtn.upStatusUpdate&&showBtn.offDrugs" size="small" class="page_btn" type="info" @click="offDrugsClick" :disabled="!btnDisabled.offDrugs||selectIds.length === 0">
        <i class="fa fa-arrow-circle-down"></i>下架已选药品
      </el-button>
      <el-button name="applyClosure" v-if="authbtn.applyClosure&&showBtn.applyClosure" size="small" class="page_btn" type="primary" @click="applyClosureClick" :disabled="!btnDisabled.applys||selectIds.length === 0">
        <i class="icon iconfont icon-right_circle"></i>申请结案
      </el-button>
      <el-button name="deliverPrint" v-if="showBtn.deliverPrint" size="small" class="page_btn" type="warning" @click="deliverPrintClick" :disabled="!btnDisabled.onPrint||selectIds.length === 0">
        <i class="fa  fa-file-image-o"></i>条码打印
      </el-button>
      <el-button name="QrCodePrintOne" v-if="showBtn.qrcodePrintOne" size="small" class="page_btn" type="warning" @click="qrCodePrintOneClick" :disabled="!btnDisabled.onPrint||selectIds.length === 0">
        <i class="fa  fa-file-image-o"></i>二维码（单据）
      </el-button>
      <el-button name="QrCodePrintTwo" v-if="showBtn.qrcodePrintTwo" size="small" class="page_btn" type="warning" @click="qrCodePrintTwoClick" :disabled="!btnDisabled.onPrint||selectIds.length === 0">
        <i class="fa  fa-file-image-o"></i>二维码（药品）
      </el-button>
      <el-button name="revocaTion" v-if="showBtn.revocation" size="small" class="page_btn" type="warning" @click="revocaTion" :disabled="!btnDisabled.revocaTion||selectIds.length === 0">
        <i class="icon iconfont icon-icon-dahui"></i>撤销
      </el-button>
      <el-button name="exportData" v-if="authbtn.output&&showBtn.exportData" size="small" class="page_btn" type="warning" @click="exportDataClick">
        <i class="icon iconfont icon-daochu"></i>导出数据
      </el-button>
      <span class="filesContent" v-if="authbtn.upload&&showBtn.importData">
        <el-button name="importData" class="filesBtn" size="small" type="warning">
          <i class="icon iconfont icon-daoru" style="margin-right: 4px;"></i>导入数据
        </el-button>
        <input type="file" class="filesInput" ref="filesInput" @change="importDataClick">
      </span>
      <el-button name="saveChange" v-if="authbtn.saveChange&&showBtn.saveChange" size="small" class="page_btn" type="primary" @click="saveChangeClick">
        <i class="icon iconfont icon-baocun"></i>保存更改
      </el-button>
      <el-button name="dataSync" v-if="authbtn.dataSync&&showBtn.dataSync" size="small" class="page_btn" type="primary" @click="dataSyncClick" :disabled="selectIds.length === 0">
        <i class="icon iconfont icon-duibi1"></i> 同步
      </el-button>
      <el-button name="affirmChoose" v-if="authbtn.affirmChoose&&showBtn.affirmChoose" size="small" class="page_btn" type="primary" @click="affirmChooseClick">
        <i class="icon iconfont icon-right_circle"></i>确认已选
      </el-button>
      <el-button name="drugReportsPrint" v-if="showBtn.drugReportsPrint" size="small" class="page_btn" type="warning" @click="drugReportsPrintClick" :disabled="selectIds.length === 0">
        <i class="fa  fa-file-image-o"></i>打印药检报告
      </el-button>
      <el-button name="scoringRulesLook" v-if="showBtn.scoringRulesLook" size="small" class="page_btn" type="warning" @click="scoringRulesLookClick">
        <i class="el-icon-view"></i>查看评分规则
      </el-button>
    </div>
    <el-pagination v-if="pageShow" class="page_right" @size-change="handleSizeChange" @current-change="pageChange" :current-page="page" :page-size="size" :total="total" :page-sizes="[10, 50, 100, 200]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
  </div>
</template>

<script>
/**
 * 脚部组件
 */
export default {
  activated() {
    this.$bus.$on('data/select', this.dataSelect);
    this.$bus.$on('clear/file', this.clearFile);
  },
  deactivated() {
    this.$bus.$off('data/select', this.dataSelect);
    this.$bus.$off('clear/file', this.clearFile);
  },
  data() {
    return {
      selectIds: [],
      sizes: 0,
      btnDisabled: {
        onDrugs: true,
        offDrugs: true,
        applys: true,
        affirms: true,
        onPrint: false,
        planSubmit: false,
      },
    };
  },
  methods: {
    // 数据选中
    dataSelect(vals, btnDisabled) {
      this.selectIds = vals;
      Object.assign(this.btnDisabled, btnDisabled);
    },
    // 条目数切换
    handleSizeChange(size) {
      this.sizes = size;
      this.$bus.$emit('data/listOne', 0, size);
    },
    // 页码切换
    pageChange(page) {
      this.$bus.$emit('page/changeOne', page - 1, this.sizes);
    },
    // 新增
    dataDo() {
      this.$bus.$emit('data/page/do');
    },
    // 新增
    dataCreateGPO() {
      this.$bus.$emit('data/create/gpo');
    },
    // 新增
    dataCreateSaler() {
      this.$bus.$emit('data/create/saler');
    },
    // 删除
    dataDelete() {
      this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$bus.$emit('data/delete', this.selectIds);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    // 提交
    dataSubmit() {
      this.$confirm('此操作将批量提交数据容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$bus.$emit('data/submit', this.selectIds);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    // 上架已选药品
    onDrugsClick() {
      const ret = '此操作将批量上架已选药品, 是否继续?';
      this.$confirm(ret, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$bus.$emit('on/drugs', this.selectIds);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 下架已选药品
    offDrugsClick() {
      const ret = '此操作将批量下架已选药品, 是否继续?';
      this.$confirm(ret, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$bus.$emit('off/drugs', this.selectIds);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 同步操作
    dataSyncClick() {
      this.$bus.$emit('data/syncBatchNo', this.selectIds);
    },
    // 撤销操作
    revocaTion() {
      this.$bus.$emit('revoca/tion');
    },
    // 导出模板
    exportDataClick() {
      this.$bus.$emit('export/data');
    },
    // 导入数据
    importDataClick(e) {
      this.$bus.$emit('import/data', e);
    },
    // 清除file的值
    clearFile() {
      const file = this.$refs.filesInput;
      file.value = '';
    },
    // 保存更改
    saveChangeClick() {
      this.$bus.$emit('save/changes');
    },
    // 确认已选
    affirmChooseClick() {
      this.$bus.$emit('affirm/choose', this.selectIds);
    },
    // 打印药检报告
    drugReportsPrintClick() {
      this.$bus.$emit('drug/reports/print', this.selectIds);
    },
    // 查看评分详情
    scoringRulesLookClick() {
      this.$bus.$emit('scoring/rules/look');
    },
    // 申请结案
    applyClosureClick() {
      this.$bus.$emit('apply/closure', this.selectIds);
    },
    // 批量条码打印
    deliverPrintClick() {
      this.$bus.$emit('deliver/print/click', this.selectIds);
    },
    // 二维码（单据维度）
    qrCodePrintOneClick() {
      this.$bus.$emit('qrcode/printone/click', this.selectIds);
    },
    // 二维码（药品维度）
    qrCodePrintTwoClick() {
      this.$bus.$emit('qrcode/printtwo/click', this.selectIds);
    },
  },
  props: {
    page: {
      default: 0,
    },
    size: {
      default: 10,
    },
    total: {
      default: 1,
    },
    pageShow: {
      default: true,
    },
    showBtn: {
      default() {
        return {
          create: false,
          createGPO: false,
          createSaler: false,
          destory: false,
          onDrugs: false,
          offDrugs: false,
          exportData: false,
          importData: false,
          saveChange: false,
          affirmChoose: false,
          applyClosure: false,
          drugReportsPrint: false,
          scoringRulesLook: false,
          deliverPrint: false,
          revocation: false,
          dataSync: false,
          submit: false,
        };
      },
    },
    authbtn: {
      default() {
        return {
          create: false, // 新增
          submit: false, // 提交
          destory: false, // 删除
          upStatusUpdate: false, // 上下架药品
          saveChange: false, // 保存更改
          affirmChoose: false, // 确认已选
          applyClosure: false, // 申请结案
          upload: false, // 导入
          output: false, // 导出
          dataSync: false, // 同步
        };
      },
    },
  },
};
</script>

<style scoped>
.paging {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  padding: 10px 0 20px;
}

.page_left {
  float: left;
}

.page_btn {
  line-height: 16px;
}

.page_btn i {
  margin-right: 4px;
  vertical-align: middle;
  display: inline-block;
}

.page_right {
  float: right;
}

.filesContent {
  position: relative;
  float: left;
  margin-right: 10px;
}

.filesBtn {
  position: relative;
  padding: 8px;
}

.filesInput {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}
</style>

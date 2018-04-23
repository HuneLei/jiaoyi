<template>
  <div>
    <el-table :data="tableData" v-loading="loading" @selection-change="dataSelect" :height="tableHeight" stripe border fit @sort-change="sortChange" @header-dragend="headerDragend">
      <el-table-column type="selection" width="40" fixed="left" align="center" v-if="getPrincipal.memberType !== 3">
      </el-table-column>
      <el-table-column prop="num" label="#" width="40" fixed="left">
      </el-table-column>
      <el-table-column prop="drugsCode" label="药品编码" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsName" label="通用名" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="tradeName" label="商品名" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="formName" label="剂型" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="specName" label="规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packSpecName" label="包装规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="left" min-width="60" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="attributeName" label="规格属性" align="left" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packagesName" label="包装材质" align="left" width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalUnitPrice" label="单价" align="right" min-width="70" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column prop="gpoPrice" label="GPO单价" align="right" min-width="90" sortable="custom" show-overflow-tooltip v-if="getPrincipal.memberType !== 3 && getPrincipal.userFullName.substring(getPrincipal.userFullName.length - 3) !== 'sup'">
          </el-table-column>-->
      <el-table-column prop="qualityLevel" label="质量层次" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="producerName" label="生产企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="enrollName" label="卖方会员" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="approvalNumber" label="批准文号" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="projectName" label="集采项目" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="projectSubName" label="集采子项目" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugStandardCode" label="药品本位码" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column prop="insuranceNo" label="医保编号" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="insuranceType" label="医保分类" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
          </el-table-column>-->
      <el-table-column prop="medicalInsuranceDirectory" label="医保目录" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column prop="reimburseScale" label="报销比例" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column> -->
      <el-table-column prop="basicType" label="基药属性" align="left" width="80" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.basicType === 0">空</span>
          <span v-if="scope.row.basicType === 1">国基</span>
          <span v-if="scope.row.basicType === 2">省基</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="中/大包装" align="right" min-width="80" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          {{scope.row.middlePack}} / {{scope.row.bigPack}}
        </template>
      </el-table-column>
      <el-table-column prop="removeFactor" label="拆零系数" align="right" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" align="left" min-width="180" sortable="custom" show-overflow-tooltip class-name="table_right">
      </el-table-column>
      <el-table-column label="上架状态" align="center" min-width="100" max-width="160" fixed="right" class-name="table_right" v-if="authbtn.upStatusUpdate && getPrincipal.memberType !== 3">
        <template scope="scope">
          <el-switch :width="64" :class="parseInt(scope.row.upStatus, 0) ? 'switch_test1' : ''" v-model="scope.row.upStatus" on-text="已上架    " off-text="未上架" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0" @change="isUpStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="可变更配送" align="center" min-width="80" max-width="160" fixed="right" class-name="table_right" v-if="authbtn.isChangeDeliveryUpdate && getPrincipal.memberType !== 3">
        <template scope="scope">
          <el-switch :width="41" :class="parseInt(scope.row.isChangeDelivery, 0) ? 'switch_test2' : ''" v-model="scope.row.isChangeDelivery" on-text="是" off-text="否" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0" @change="isChangeDelivery(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="200" max-width="300" fixed="right" v-if="authbtn.item">
        <template scope="scope">
          <el-button @click="gpoStock(scope.row)" type="text" size="small" v-if="authbtn.stockItem">
            <i class="fa fa-archive"></i> GPO库存
          </el-button>
          <el-button @click="ChangeMore(scope.row)" type="text" size="small" v-if="scope.row.drugsSource===1 && getPrincipal.memberType !== 3">
            <i class="icon iconfont icon-bianji"></i> 修改属性
          </el-button>
          <el-button @click="ChangeLess(scope.row)" type="text" size="small" v-if="scope.row.drugsSource===0 && getPrincipal.memberType !== 3">
            <i class="icon iconfont icon-bianji"></i> 修改属性
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <CreateDialog :options="dialogOptions" @dialogSelect="dialogSelect"></CreateDialog>
    <gpoStock></gpoStock>
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
import DrugsUp from '../../../api/Drugs/DrugsUp'; // 药品上架管理APi
import CreateDialog from './CreateDialog'; //  新增时的弹框
import gpoStock from './GpoStock'; //  gpo库存的弹框

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('export/data', this.dataExport); // 导出
    this.$bus.$on('data/page/do', this.dataCreate); // 新增药品触发弹框
    this.$bus.$on('on/drugs', this.dataOnDrugs); // 上架已选药品
    this.$bus.$on('off/drugs', this.dataOffDrugs); // 下架已选药品
    if (this.getGpoId) {
      this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    this.$bus.$off('page/change', this.pageChange);
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('components/Find', this.dataSearch);
    this.$bus.$off('export/data', this.dataExport); // 导出
    this.$bus.$off('data/page/do', this.dataCreate); // 新增药品触发弹框
    this.$bus.$off('on/drugs', this.dataOnDrugs); // 上架药品
    this.$bus.$off('off/drugs', this.dataOffDrugs); // 下架药品
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/Drugs/DrugsUp') {
        // console.log();
        this.filterForm.projectId = this.getProjectId; // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
  },
  computed: {
    getPrincipal() {
      return this.$store.state.view.principal;
    },
    ...mapGetters([
      'getGpoId',
      'getProjectId',
    ]),
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  components: {
    CreateDialog,
    gpoStock,
  },
  data() {
    return {
      tableHeight: 650,
      // 新增药品弹框
      dialogOptions: {
        msgBase: '', //  没什么卵用，有需要可以看看
        isShowDialog: false, //  显示弹框
        tableSelected: [], //  默认表格选中
        tableType: 1, //  0 单选，1 多选 默认单选
        projectId: '',
        gpoMemberId: '',
      },
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      selectIds: [],
      filterForm: {
        gpoMemberId: null,
        projectId: null,
        projectSubName: null,
        drugsCode: null,
        drugsName: null,
        formName: null,
        specName: null,
        qualityLevel: null,
        producerName: null,
        tradeName: null,
        approvalNumber: null,
        drugStandardCode: null,
        upStatus: 1,
        isChangeDelivery: null,
        enrollName: null,
        basicType: null,
        medicalInsuranceDirectory: null,
        remarks: null,
      },
      page: 0,
      size: 20,
    };
  },
  methods: {
    headerDragend() {
      // setTimeout(() => {
      //   document.onselectstart = (evt) => {
      //     evt.preventDefault();
      //   };
      // }, 0);
    },
    //  每次点击排序都会触发
    sortChange(rule) {
      if (rule.order) {
        const tableData = this.convert.tableSort(rule, this.tableData);
        this.tableData = [...tableData];
      } else {
        this.tableData = [...this.tableDataOld];
      }
    },
    // 查询条件获取
    dataSearch(data) {
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        projectId: data.projectId.value,
        projectSubId: data.projectSubId.value,
        drugsCode: data.drugsCode.value,
        drugsName: data.drugsName.value,
        formName: data.formName.value,
        specName: data.specName.value,
        qualityLevel: data.qualityLevel.value,
        producerName: data.producerName.value,
        tradeName: data.tradeName.value,
        approvalNumber: data.approvalNumber.value,
        drugStandardCode: data.drugStandardCode.value,
        basicType: data.basicType.value,
        //        upStatus: data.upStatus.value,
        //        isChangeDelivery: data.isChangeDelivery.value,
        enrollName: data.enrollName.value,
        medicalInsuranceDirectory: data.medicalInsuranceDirectory.value,
        remarks: data.remarks.value,
      };
      if (data.upStatus) {
        this.filterForm.upStatus = data.upStatus.value;
      }
      if (data.isChangeDelivery) {
        this.filterForm.isChangeDelivery = data.isChangeDelivery.value;
      }
      this.dataList(0, this.size, this.filterForm);
    },
    dataList(page, size, filterForm) {
      if (!this.getGpoId) {
        return false;
      }
      this.loading = true;
      this.filterForm.gpoMemberId = this.getGpoId; // 默认的GPOID
      if (page !== undefined) this.page = page;
      if (size !== undefined) this.size = size;
      if (this.getPrincipal.memberType !== 5) {
        this.filterForm.upStatus = 1;
      }
      if (this.getPrincipal.memberType === 3) {
        this.filterForm.isChangeDelivery = null;
      }
      DrugsUp.list(page || this.page, size || this.size, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              data.content[i].upStatus = data.content[i].upStatus.toString();
              data.content[i].isChangeDelivery = data.content[i].isChangeDelivery.toString();
            }
            this.tableDataOld = data.content;
            this.tableData = data.content;
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
          this.loading = false;
        });
      return true;
    },
    dataCreate() {
      // console.log();
      this.dialogOptions.projectId = this.filterForm.projectId;
      this.dialogOptions.gpoMemberId = this.filterForm.gpoMemberId;
      this.dialogOptions.isShowDialog = true;
    },
    gpoStock(data) {
      this.$bus.$emit('drugsUp/gpoStock', data);
    },
    // 上架
    dataOnDrugs(val) {
      for (let i = 0; i < val.length; i += 1) {
        const item = val[i];
        this.selectIds.push(item.id);
      }
      DrugsUp.upStatusUpdate(this.selectIds, 1).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
          this.dataList(0);
        }
        this.selectIds = [];
      });
    },
    // 下架
    dataOffDrugs(val) {
      for (let i = 0; i < val.length; i += 1) {
        const item = val[i];
        this.selectIds.push(item.id);
      }
      DrugsUp.upStatusUpdate(this.selectIds, 0).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
          this.dataList(0);
        }
        this.selectIds = [];
      });
    },
    // 弹出框选择之后确定事件
    dialogSelect(rows, msgBase, msgCom) {
      // console.log();
      const drugsUpCreateForms = [];
      for (let i = 0; i < rows.length; i += 1) {
        const data = {
          attributeName: rows[i].attributeName,
          packagesName: rows[i].packagesName,
          approvalNumber: rows[i].approvalNumber,
          drugStandardCode: rows[i].drugStandardCode,
          drugsCode: rows[i].drugsCode,
          drugsName: rows[i].drugsName,
          drugsNo: rows[i].drugsNo,
          formName: rows[i].formName,
          gpoMemberId: this.getGpoId,
          inversionRatio: rows[i].inversionRatio,
          minUnitPrice: rows[i].minUnitPrice,
          packSpecName: rows[i].packSpecName,
          producerCode: rows[i].producerCode,
          producerId: rows[i].producerId,
          producerName: rows[i].producerName,
          projectId: this.filterForm.projectId,
          projectSubId: this.filterForm.projectSubId,
          qualityLevel: rows[i].qualityLevel,
          specificationName: rows[i].specificationName,
          tradeName: rows[i].tradeName,
          unitName: rows[i].unitName,
        };
        drugsUpCreateForms.push(data);
      }
      // console.log();
      DrugsUp.create(drugsUpCreateForms).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '药品新增成功',
          });
          this.dataList();
          this.$emit('dialogHide');
        }
      });
    },
    // 多选框选择
    dataSelect(row) {
      let onDrugs = true;
      let offDrugs = true;
      for (let i = 0; i < row.length; i += 1) {
        const item = row[i];
        // console.log();
        switch (item.upStatus) {
          case '0':
            offDrugs = false;
            break;
          case '1':
            onDrugs = false;
            break;
          default:
            break;
        }
      }
      const btn = { onDrugs, offDrugs };
      this.$bus.$emit('data/select', row, btn);
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    // 修改More
    ChangeMore(row) {
      this.$bus.$emit('changeMore/dialog', row); // 将列表原价格传入弹框
    },
    // 修改Less
    ChangeLess(row) {
      this.$bus.$emit('changeLess/dialog', row); // 将列表原价格传入弹框
    },
    // 修改 上架状态
    isUpStatus(item) {
      // 因为线上滑块点击时会直接拿到item里转变后的值  ，所以用转变后的值来判断
      let i = ''; // 上下架状态 1:上架 0:下架
      if (item.upStatus === '0') {
        i = 0;
      } else {
        i = 1;
      }
      DrugsUp.upStatusUpdate([item.id], i).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
          this.dataList();
        } else {
          this.$message({
            type: 'error',
            message: '操作失败',
          });
          this.dataList();
        }
      });
    },
    // 更改配送企业
    isChangeDelivery(item) {
      let i = ''; // '是否可更改配送企业（1.是，0否，默认为0否）'
      if (item.isChangeDelivery === '0') {
        i = 0;
      } else {
        i = 1;
      }
      DrugsUp.isChangeDeliveryUpdate(item.id, i).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
          setTimeout(() => {
            this.dataList();
          }, 0);
        } else {
          this.$message({
            type: 'error',
            message: '操作失败',
          });
          setTimeout(() => {
            this.dataList();
          }, 0);
        }
      });
    },
    // 导出
    dataExport() {
      const form = {
        gpoMemberId: this.filterForm.gpoMemberId,
      };
      if (this.filterForm.projectId !== 'undefined' && this.filterForm.projectId) {
        form.projectId = this.filterForm.projectId;
      }
      if (this.filterForm.drugsCode !== 'undefined' && this.filterForm.drugsCode) {
        form.drugsCode = this.filterForm.drugsCode;
      }
      if (this.filterForm.drugsName !== 'undefined' && this.filterForm.drugsName) {
        form.drugsName = this.filterForm.drugsName;
      }
      if (this.filterForm.projectSubId !== 'undefined' && this.filterForm.projectSubId) {
        form.projectSubId = this.filterForm.projectSubId;
      }
      if (this.filterForm.formName !== 'undefined' && this.filterForm.formName) {
        form.formName = this.filterForm.formName;
      }
      if (this.filterForm.specName !== 'undefined' && this.filterForm.specName) {
        form.specName = this.filterForm.specName;
      }
      if (this.filterForm.qualityLevel !== 'undefined' && this.filterForm.qualityLevel) {
        form.qualityLevel = this.filterForm.qualityLevel;
      }
      if (this.filterForm.producerName !== 'undefined' && this.filterForm.producerName) {
        form.producerName = this.filterForm.producerName;
      }
      if (this.filterForm.tradeName !== 'undefined' && this.filterForm.tradeName) {
        form.tradeName = this.filterForm.tradeName;
      }
      if (this.filterForm.approvalNumber !== 'undefined' && this.filterForm.approvalNumber) {
        form.approvalNumber = this.filterForm.approvalNumber;
      }
      if (this.filterForm.drugStandardCode !== 'undefined' && this.filterForm.drugStandardCode) {
        form.drugStandardCode = this.filterForm.drugStandardCode;
      }
      if (this.filterForm.enrollName !== 'undefined' && this.filterForm.enrollName) {
        form.enrollName = this.filterForm.enrollName;
      }
      if (this.filterForm.medicalInsuranceDirectory !== 'undefined' && this.filterForm.medicalInsuranceDirectory) {
        form.medicalInsuranceDirectory = this.filterForm.medicalInsuranceDirectory;
      }
      if (this.filterForm.remarks !== 'undefined' && this.filterForm.remarks) {
        form.remarks = this.filterForm.remarks;
      }
      if (this.filterForm.upStatus) {
        form.upStatus = 1;
      } else if (this.filterForm.upStatus === 0) {
        form.upStatus = 0;
      }
      if (this.filterForm.basicType) {
        form.basicType = 1;
      } else if (this.filterForm.basicType === 0) {
        form.basicType = 0;
      }
      if (this.filterForm.isChangeDelivery) {
        form.isChangeDelivery = 1;
      } else if (this.filterForm.isChangeDelivery === 0) {
        form.isChangeDelivery = 0;
      }
      // console.log();
      const url = DrugsUp.output(form);
      window.open(url);
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 135]);
      };
      setTimeout(tableHeightFun, 0);
    },
  },
};
</script>

<style>
.switch_test1 .el-switch__button {
  transform: translate(48px, 2px) !important;
}

.switch_test2 .el-switch__button {
  transform: translate(25px, 2px) !important;
}
</style>

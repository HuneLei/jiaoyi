<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" fixed="left" label="#" width="40">
      </el-table-column>
      <el-table-column prop="drugsCode" label="药品编码" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="drugsName" label="通用名" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="formName" label="剂型" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="specName" label="规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="packSpecName" label="包装规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="unitName" label="单位" align="left" min-width="60" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="batchNo" label="批号" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" label="配送企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="producerName" label="生产企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="salerMemberName" label="卖方会员" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="makeDate" label="生产日期" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="validDate" label="有效日期" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column min-width="120" align="center" label="药检报告附件" fixed="right"  show-overflow-tooltip>
        <template scope="scope">
          <YuploadFiles :data="convert.getJSON(scope.row.drugsReportFile)"></YuploadFiles>
        </template>
      </el-table-column>
      <el-table-column label="启用/禁用" align="center" min-width="100" max-width="200" fixed="right" v-if="authbtn.updataStatus">
        <template scope="scope">
          <el-switch v-model="scope.row.enabled" on-color="#13ce66" off-color="#ff4949" on-text="开启" off-text="关闭" @change="changeStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="isGpoStamp" label="GPO已盖章" align="center" fixed="right" min-width="100" class-name="table_right">
        <template scope="scope">
          <span v-if="scope.row.isGpoStamp===1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="配送企业已盖章" align="center" fixed="right" min-width="100" class-name="table_right">
        <template scope="scope">
          <span v-if="scope.row.isDeliveryStamp==1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="药检报告" align="center" min-width="100" max-width="200" fixed="right" v-if="authbtn.item">
        <template scope="scope">
          <el-button @click="isReport(scope.row)" type="text" size="small">
            <i class="icon iconfont icon-chakan"></i> 详情 ({{scope.row.drugsReportFileNum}})
          </el-button>
        </template>
      </el-table-column>
      <div v-if="authbtn.item">
        <el-table-column label="操作" align="center" min-width="100" max-width="200" fixed="right" v-if="getPrincipal.memberType===4||getPrincipal.memberType===5">
          <template scope="scope">
            <el-button @click="dataUpdata(scope.row)" type="text" size="small">
              <i class="icon iconfont icon-bianji"></i> 修改批号
            </el-button>
          </template>
        </el-table-column>
      </div>
    </el-table>
    <upEnclosure :row="row"></upEnclosure>
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
import convert from '../../../utils/convert'; //  自定义转换js
import upEnclosure from './upEnclosure'; //  上传
import DrugsBatchNo from '../../../api/Drugs/DrugsBatchNo'; // 药品批号管理APi

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    if (this.getGpoId) {
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    this.$bus.$off('page/change', this.pageChange);
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('components/Find', this.dataSearch);
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/Drugs/DrugsBatchNo') {
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
  components: {
    upEnclosure,
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  data() {
    return {
      row: null,
      tableHeight: 650,
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      filterForm: {
        gpoMemberId: null, // gpo会员id，全局，不可空
        drugsCode: null,
        drugsName: null,
        batchNo: null,
        producerName: null,
        deliveryMemberName: null,
        isUploadReport: null, // 0： 否，   1： 是
        isGpoStamp: null,
        isDeliveryStamp: null, // 0： 否，   1： 是
        salerMemberName: null,
      },
      page: 0,
      size: 20,
    };
  },
  methods: {
    //  每次点击排序都会触发
    sortChange(rule) {
      if (rule.order) {
        const tableData = this.convert.tableSort(rule, this.tableData);
        this.tableData = [...tableData];
      } else {
        this.tableData = [...this.tableDataOld];
      }
    },
    // 开启关闭状态
    changeStatus(row) {
      const index = this.tableData.indexOf(row);
      let i = '';
      if (this.tableData[index].enabled === true) {
        // 开启项目
        this.tableData[index].enabled = false;
        i = 1;
      } else {
        // 关闭项目
        this.tableData[index].enabled = true;
        i = 0;
      }
      const id = row.id;                  // 集采项目Id
      let prompt;
      if (i === 1) {
        prompt = '开启成功';
      } else {
        prompt = '关闭成功';
      }
      // 更新请求
      DrugsBatchNo.updataStatus(id, i).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: prompt,
          });
          this.dataList(this.page, this.size);
        } else {
          this.$message({
            type: 'error',
            message: '操作失败',
          });
        }
      });
    },
    // 查询条件获取
    dataSearch(data) {
      this.filterForm = {
        gpoMemberId: this.getGpoId, // gpo会员id，全局，不可空
        drugsCode: data.drugsCode.value,
        drugsName: data.drugsName.value,
        batchNo: data.batchNo.value,
        producerName: data.producerName.value,
        deliveryMemberName: data.deliveryMemberName.value,
        isUploadReport: data.isUploadReport.value, // 0： 否，   1： 是
        isGpoStamp: data.isGpoStamp.value, // 0： 否，   1： 是
        isDeliveryStamp: data.isDeliveryStamp.value, // 0： 否，   1： 是
        salerMemberName: data.salerMemberName.value,
      };
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
      DrugsBatchNo.list(page || this.page, size || this.size, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              if (data.content[i].enabled === 1) {
                data.content[i].enabled = true;
              } else {
                data.content[i].enabled = false;
              }
              if (typeof (this.toJSON(data.content[i].drugsReportFile)) === 'object') {
                for (let w = 0; w < this.toJSON(data.content[i].drugsReportFile).length; w += 1) {
                  data.content[i].drugsReportFileNum = w + 1;
                }
              } else {
                data.content[i].drugsReportFileNum = 0;
              }
              if (typeof (this.toJSON(data.content[i].drugsReportFileNew)) === 'object') {
                const newUrlArr = [];
                const fileArr = [];
                for (let j = 0; j < this.toJSON(data.content[i].drugsReportFileNew).length;
                  j += 1) {
                  newUrlArr.push(this.toJSON(data.content[i].drugsReportFileNew)[j].oldUrl);
                }
                for (let j = 0; j < this.toJSON(data.content[i].drugsReportFile).length; j += 1) {
                  if (newUrlArr.indexOf(this.toJSON(data.content[i].drugsReportFile)[j].url) < 0) {
                    // console.log();
                    fileArr.push(this.toJSON(data.content[i].drugsReportFile)[j]);
                  }
                }
                // 长度
                data.content[i].drugsReportFileNum =
                  fileArr.concat(this.toJSON(data.content[i].drugsReportFileNew)).length;
                data.content[i].drugsReportFile =
                  JSON.stringify(fileArr.concat(this.toJSON(data.content[i].drugsReportFileNew)));
              }
            }
            // console.log();
            this.tableDataOld = data.content;
            this.tableData = data.content;
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
          this.loading = false;
        });
      return true;
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    // 查看药检报告
    isReport(row) {
      this.$bus.$emit('upEnclosure/dialog', row);
      this.row = row;
    },
    // 修改批号
    dataUpdata(row) {
      this.$bus.$emit('changeEdit/dialog', row);
      // this.row = row;
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 135]);
      };
      setTimeout(tableHeightFun, 0);
    },
    toJSON(str) {
      return convert.toJSON(str);
    },
  },
};
</script>

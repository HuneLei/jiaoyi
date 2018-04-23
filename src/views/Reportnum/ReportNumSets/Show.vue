<template>
  <el-table :data="tableData" @selection-change="dataSelect" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
    <el-table-column type="selection" width="40" fixed="left" align="center">
    </el-table-column>
    <el-table-column prop="num" label="#" fixed="left" width="40" class-name="table_right_fixed">
    </el-table-column>
    <el-table-column prop="timeName" label="期间名称" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="projectName" label="集采项目" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="projectSubName" label="集采子项目" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="reportnumBtime" label="医疗机构报量期间" align="left" min-width="270" sortable="custom" show-overflow-tooltip>
      <template scope="scope">
        <div v-if="scope.row.reportnumBtime || scope.row.reportnumEtime">{{scope.row.reportnumBtime}} ~ {{scope.row.reportnumEtime}}</div>
        <div v-else style="color: rgb(191, 200, 217);">未设置</div>
      </template>
    </el-table-column>
    <el-table-column prop="reportnumValidBtime" label="报量有效期" align="left" min-width="200" sortable="custom" show-overflow-tooltip class-name="table_right">
      <template scope="scope">
        <div v-if="scope.row.reportnumValidBtime || scope.row.reportnumValidEtime">{{scope.row.reportnumValidBtime}} ~ {{scope.row.reportnumValidEtime}}</div>
        <div v-else style="color: rgb(191, 200, 217);">未设置</div>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" min-width="120" max-width="250" fixed="right" v-if="authbtn.updateStatus || authbtn.item">
      <template scope="scope">
        <el-button @click="dataUpdata(scope.row)" type="text" size="small" v-if="authbtn.item">
          <i class="icon iconfont icon-bianji"></i> 编辑
        </el-button>
        <el-switch v-if="authbtn.updateStatus" v-model="scope.row.enabled" on-color="#13ce66" off-color="#ff4949" on-text="启用" off-text="禁用" @change="changeStatus(scope.row)">
        </el-switch>
      </template>
    </el-table-column>
    <!--<el-table-column v-if="authbtn.updateStatus" label="操作" align="center" min-width="100" max-width="200" fixed="right" prop="enabled">
        <template scope="scope">
          <el-switch v-model="scope.row.enabled" on-color="#13ce66" off-color="#ff4949" on-text="启用" off-text="禁用" @change="changeStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>-->
  </el-table>
</template>

<script>
/**
 * Created by wuqian on 2017/9/20.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import ReportNumSets from '../../../api/Reportnum/ReportNumSets';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('data/page/do', this.dataCreate); // 新增
    this.$bus.$on('data/delete', this.dataDelete); // 删除
    if (this.getGpoId) {
      this.filterForm.projectId = this.getProjectId; // 获取当前切换的集采项目号码
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    this.$bus.$off('page/change', this.pageChange);
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('components/Find', this.dataSearch);
    this.$bus.$off('data/page/do', this.dataCreate); // 新增
    this.$bus.$on('data/delete', this.dataDelete); // 删除
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/Reportnum/ReportNumSets') {
        this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
  },
  computed: mapGetters([
    'getGpoId',
    'getProjectId',
  ]),
  data() {
    return {
      tableHeight: 650,
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      filterForm: {
        timeName: null,
        gpoMemberId: null,
        projectId: null,
        projectSubId: null,
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
    // // 开启关闭状态
    changeStatus(row) {
      /**
       *  集采项目开启关闭状态操作
       *  当项目默认是开启状态[需要关闭] ： 当前默认openStatus === true, 点击switch就会自动变为openStatus === false,
       *        我们手动转化openStatus === false避免未请求就变化按钮。传值：openStatus = 0
       *  当项目默认是关闭状态[需要开启] ： 当前默认openStatus === false, 点击switch就会自动变为openStatus === true,
       *        我们手动转化openStatus === true避免未请求就变化按钮。传值：openStatus = 1
       */
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
      const id = row.id;
      let prompt;
      if (i === 1) {
        prompt = '启用成功';
      } else {
        prompt = '禁用成功';
      }
      // 更新请求
      ReportNumSets.updateStatus(id, i).then((res) => {
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
        timeName: data.timeName.value,
        gpoMemberId: this.getGpoId,
        projectId: data.projectId.value,
        projectSubId: data.projectSubId.value,
      };
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取数据列表
    dataList(page, size, filterForm) {
      if (!this.getGpoId) {
        return false;
      }
      this.loading = true;
      this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      if (page !== undefined) this.page = page;
      if (size !== undefined) this.size = size;
      ReportNumSets.list(page || this.page, size || this.size, this.filterForm)
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
            }
            this.tableDataOld = data.content;
            this.tableData = data.content;
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
          this.loading = false;
        });
      return true;
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    dataCreate() {
      this.$bus.$emit('change/create/dialog');
    },
    dataUpdata(row) {
      this.$bus.$emit('change/edit/dialog', row);
    },
    // 多选框选择
    dataSelect(row) {
      this.$bus.$emit('data/select', row);
    },
    // 删除
    dataDelete(row) {
      let item = '';
      const selectIds = [];
      for (let i = 0; i < row.length; i += 1) {
        item = row[i];
        selectIds.push(item.id);
      }
      ReportNumSets.destory(selectIds).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功',
          });
          this.dataList(0);
        }
      });
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

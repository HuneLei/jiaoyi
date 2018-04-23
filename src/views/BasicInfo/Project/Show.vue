<template>
  <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
    <el-table-column prop="num" align="left" fixed="left" label="#" width="40">
    </el-table-column>
    <el-table-column prop="projectName" label="集采项目" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="pattern" label="采购模式" align="left" sortable="custom" min-width="90" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.pattern === 0">GPO模式</span>
        <span v-if="scope.row.pattern === 1">第三方模式</span>
      </template>
    </el-table-column>
    <el-table-column prop="paramValue" label="合同模板类型" align="left" sortable="custom" min-width="140" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="beginTime" label="开始日期" align="left" sortable="custom" min-width="90" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="endTime" label="结束日期" align="left" sortable="custom" min-width="90" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="releaseStatus" label="集采项目公布状态" align="left" sortable="custom" min-width="120" show-overflow-tooltip>
      <template scope="scope">
        <span v-if="scope.row.releaseStatus === 0">未公布</span>
        <span v-if="scope.row.releaseStatus === 1">公布</span>
      </template>
    </el-table-column>
    <el-table-column prop="remarks" align="left" label="备注" class-name="table_right" min-width="160" show-overflow-tooltip>
    </el-table-column>
    <el-table-column label="项目启用" align="center" min-width="100" max-width="200" fixed="right" class-name="table_right" prop="openStatus" v-if="authbtn.update">
      <template scope="scope">
        <el-switch v-model="scope.row.openStatus" on-color="#13ce66" off-color="#ff4949" on-text="开启" off-text="关闭" @change="changeStatus(scope.row)">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column label="默认项目" align="center" min-width="100" max-width="200" fixed="right" v-if="authbtn.defaultUpdate">
      <template scope="scope">
        <el-button v-if="scope.row.ifDefault === 1" type="text" class="el-icon-circle-check" size="large" @click="changeDefault(scope.row, 1)"></el-button>
        <el-button style="color: #e1e1e1;" v-if="scope.row.ifDefault === 0" type="text" class="el-icon-circle-check" size="large" @click="changeDefault(scope.row, 0)"></el-button>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" min-width="100" max-width="200" fixed="right" v-if="authbtn.numUpdate">
      <template scope="scope">
        <el-button type="text" @click="dataUpdate(scope.row)">
          <i class="fa fa-edit"></i> 操作
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
/**
 * Created by lqy on 2017/9/4.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import project from '../../../api/BasicInfo/Project';
import convert from '../../../utils/convert';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('table/height', this.tableHeightRun);     //  监听查询按钮的查看更多点击事件，重新计算表格高度
    if (this.getGpoId) {
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    // 监听页码切换
    this.$bus.$off('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('components/Find', this.dataSearch);
  },
  watch: {
    getGpoId() {
      this.dataList();
    },
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  computed: mapGetters([
    'getGpoId',
  ]),
  data() {
    return {
      tableHeight: 650,
      tableDataOld: [],
      tableData: [],
      loading: false,      // 列表加载状态
      filterForm: {
        gpoMemberId: null,        // GPO会员ID
        projectName: null,              // 集采项目名称ID，下拉，项目名称与项目id一一对应
        pattern: null,         // 采购模式
        releaseStatus: null,   // 集采项目公布状态
        beginTime: null,       // 项目开始时间
        endTime: null,         // 项目结束时间
      },
      page: 0,
      size: 20,
    };
  },
  methods: {
    dataUpdate(item) {
      this.$bus.$emit('data/update', item);
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
    // 数据查询条件获取
    dataSearch(data) {
      let beginTimeValue;  // 开始时间
      let endTimeValue;    // 结束时间
      // 将开始时间和结束时间拆分开
      if (data.dateRange.value) {
        beginTimeValue = data.dateRange.value[0];
        endTimeValue = data.dateRange.value[1];
      }
      if (beginTimeValue === '1970-01-01') {
        beginTimeValue = '';
      }
      if (endTimeValue === '1970-01-01') {
        endTimeValue = '';
      }
      // 筛选的字段
      this.filterForm = {
        gpoMemberId: this.getGpoId,              // GPO会员ID
        projectName: data.projectName.value,                       // 集采项目名称ID，下拉，项目名称与项目id一一对应
        pattern: data.pattern.value,             // 采购模式
        releaseStatus: data.releaseStatus.value, // 集采项目公布状态
        beginTime: beginTimeValue,         // 项目开始时间
        endTime: endTimeValue,             // 项目结束时间
      };
      // 调用列表请求
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取资源列表名称
    // 获取数据列表
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      project.list(cpage, cpageSizes, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableData = [];
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              if (data.content[i].openStatus === 1) {
                data.content[i].openStatus = true;
              } else {
                data.content[i].openStatus = false;
              }
            }
            this.tableDataOld = data.content;
            this.tableData = data.content;
            this.page = data.number;
            this.size = data.size;
            this.$emit('page', data.number + 1, data.size, data.totalElements, data.totalPages);
          }
          this.loading = false;
        });
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    // 开启关闭状态
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
      if (this.tableData[index].openStatus === true) {
        // 开启项目
        this.tableData[index].openStatus = false;
        i = 1;
      } else {
        // 关闭项目
        this.tableData[index].openStatus = true;
        i = 0;
      }
      const id = row.id;                  // 集采项目Id
      let prompt;
      if (i === 1) {
        prompt = '开启项目成功';
      } else {
        prompt = '关闭项目成功';
      }
      // 更新请求
      project.update(id, i).then((res) => {
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
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 135]);
      };
      setTimeout(tableHeightFun, 0);
    },
    // 改变默认
    changeDefault(row, i) {
      if (i === 1) {
        this.$message({
          type: 'warning',
          message: '需要有且仅有一个默认集采项目',
        });
      } else {
        project.defaultUpdate(row.id, this.getGpoId).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.dataList(this.page, this.size);
            this.$message({
              type: 'success',
              message: '操作成功',
            });
            this.$store.commit('projectId', row.projectId);
            this.$bus.$emit('defaultProject/change', this.getGpoId);
            // location.reload();
          }
        });
      }
    },
  },
  mounted() {
  },
};
</script>

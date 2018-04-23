<template>
  <div>
    <el-table :data="tableData" v-loading="loading" @selection-change="dataSelect" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column type="selection" width="40" fixed="left" align="center">
      </el-table-column>
      <el-table-column prop="num" fixed="left" label="#" width="40" class-name="table_right_fixed">
      </el-table-column>
      <el-table-column prop="announcementTitle" label="公告标题" align="left" sortable="custom" min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="announcementAbstract" label="公告摘要" align="left" sortable="custom" min-width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="announcementDate" label="公告展示期间" align="left" sortable="custom" min-width="170" show-overflow-tooltip>
        <template scope="scope">
          <div>{{scope.row.announcementBtime}} ~ {{scope.row.announcementEtime}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人" align="left" sortable="custom" min-min-width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="left" sortable="custom" min-width="170" show-overflow-tooltip class-name="table_right">
      </el-table-column>
      <el-table-column prop="enabled" label="发布状态" align="center" sortable="custom" fixed="right" min-width="100" class-name="table_right" v-if="authbtn.audit">
        <template scope="scope">
          <el-switch :width="64" :class="parseInt(scope.row.enabled, 0) ? 'switch_enabled' : ''" v-model="scope.row.enabled" on-text="已发布" off-text="未发布" on-color="#13ce66" off-color="#ff4949" on-value="1" off-value="0" @change="isUpStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" max-width="200" fixed="right" v-if="authbtn.update">
        <template scope="scope">
          <el-button @click="dataUpdate(scope.row)" type="text" size="small">
            <i class="icon iconfont icon-bianji"></i>编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
import convert from '../../../utils/convert';                         //  自定义转换js
import Notice from '../../../api/BasicInfo/Notice'; // 公告管理APi

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
    this.dataList();
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    this.$bus.$off('page/change', this.pageChange);
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('components/Find', this.dataSearch);
    this.$bus.$off('data/page/do', this.dataCreate); // 新增
    this.$bus.$off('data/delete', this.dataDelete); // 删除
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  data() {
    return {
      tableHeight: 650,
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      filterForm: {
        announcementTitle: null,
        enabled: null,
        announcementDate: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,
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
    // 查询条件获取
    dataSearch(datas) {
      const data = datas;
      let announcementDate = '';
      if (data.announcementDate.value && typeof data.announcementDate.value === 'object') {
        announcementDate = `${data.announcementDate.value[0].replace(/\//g, '-')} - ${data.announcementDate.value[1].replace(/\//g, '-')}`;
      } else {
        announcementDate = data.announcementDate.value;
      }
      if (announcementDate === '1970-01-01 - 1970-01-01') {
        data.announcementDate.value = null;
      } else {
        data.announcementDate.value = announcementDate;
      }
      this.filterForm = {
        announcementTitle: data.announcementTitle.value,
        enabled: data.enabled.value,
        announcementDate: data.announcementDate.value,
      };
      this.dataList(0, this.size, this.filterForm);
    },
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      Notice.list(cpage, cpageSizes, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              data.content[i].enabled = data.content[i].enabled.toString();
            }
            this.tableDataOld = data.content;
            this.tableData = data.content;
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
          this.loading = false;
        });
    },
    // 多选框选择
    dataSelect(row) {
      this.$bus.$emit('data/select', row);
    },
    // 新增
    dataCreate(row) {
      // 修改后直接跳到新的公告新增页面
      // this.$bus.$emit('createNotice/dialog', row);
      this.$router.push({ path: '/BasicInfo/NoticeList/Edit' });
    },
    // 修改
    dataUpdate(row) {
      // 修改后直接跳到新的公告编辑页面
      // this.$bus.$emit('updateNotice/dialog', row);
      this.$router.push({ path: '/BasicInfo/NoticeList/Edit', query: { id: row.id } });
    },
    // 删除
    dataDelete(row) {
      let item = '';
      const selectIds = [];
      for (let i = 0; i < row.length; i += 1) {
        item = row[i];
        selectIds.push(item.id);
      }
      Notice.destory(selectIds).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功',
          });
          this.dataList(0);
        }
      });
    },
    // 修改状态
    isUpStatus(item) {
      // 因为线上滑块点击时会直接拿到item里转变后的值  ，所以用转变后的值来判断
      let i = ''; // 启用状态，默认0禁用(0禁用，1启用)
      if (item.enabled === '0') {
        i = 0;
      } else {
        i = 1;
      }
      Notice.audit(item.id, i).then((res) => {
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
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
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
.switch_enabled .el-switch__button {
  transform: translate(48px, 2px) !important;
}
</style>

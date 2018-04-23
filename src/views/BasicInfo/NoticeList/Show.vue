<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
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
      <el-table-column prop="createTime" label="发布时间" align="left" sortable="custom" min-width="140" class-name="table_right" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" max-width="200" fixed="right">
        <template scope="scope">
          <el-button @click="dataUpdate(scope.row)" type="text" size="small">
            <i class="icon iconfont icon-bianji"></i>查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Preview></Preview>
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
import NoticeList from '../../../api/BasicInfo/NoticeList'; // 公告管理APi
import Ueditor from '../../../components/Ueditor';
import Preview from './Preview';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    this.dataList();
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    this.$bus.$off('page/change', this.pageChange);
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('components/Find', this.dataSearch);
  },
  components: {
    Ueditor,
    Preview,
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
        announcementDate: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,
      },
      editor: null,
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
      NoticeList.list(cpage, cpageSizes, this.filterForm)
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
    // 修改
    dataUpdate(item) {
      // this.$router.push({ path: '/BasicInfo/NoticeList/Edit', query: { id: item.id } });
      NoticeList.item(item.id).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.$bus.$emit('data/preview', data.announcementText, data);
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

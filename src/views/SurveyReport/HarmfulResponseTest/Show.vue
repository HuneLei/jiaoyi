<template>
  <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
    <el-table-column prop="num" align="left" fixed="left" label="#" width="40">
    </el-table-column>
    <el-table-column align="left" prop="hospitalMemberName" label="填报单位" sortable="custom" min-width="130" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="drugsName" label="通用名" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="formName" label="剂型" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="specName" label="规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="producerName" label="生产企业" align="left" min-width="160" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="fillTime" label="填报日期" align="left" min-width="140" sortable="custom" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="contacts" label="联系人" sortable="custom" min-width="100" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="phone" label="电话/传真" sortable="custom" width="100" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="createBy" label="制表人" sortable="custom" min-width="120" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="left" prop="createTime" label="制表日期" sortable="custom" class-name="table_right" width="140" show-overflow-tooltip>
    </el-table-column>
    <el-table-column align="center" min-width='160' fixed="right" label="操作">
      <template scope="scope">
        <el-button type="text" @click="dataUpdate(scope.row)">
          <i class="icon iconfont icon-chakan"></i> 详情</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
/**
 * Created by lqy on 2017/9/14.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert';
import HarmfulResponseTest from '../../../api/SurveyReport/HarmfulResponseTest';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun);     //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    // 新增采购单
    this.$bus.$on('data/page/do', this.dataCreate);
    if (this.getGpoId) {
      this.dataList();
    } else {
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    // 监听页码切换
    this.$bus.$off('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$off('data/list', this.dataList);
    // 监听删除
    this.$bus.$off('components/Find', this.dataSearch);
    // 新增采购单
    this.$bus.$off('data/page/do', this.dataCreate);
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  computed: mapGetters([
    'getGpoId',
    'View_UserInfo',
  ]),
  watch: {
    getGpoId() {
      this.dataList();
    },
  },
  data() {
    return {
      tableHeight: 650,
      tableData: [],       // 表单的值
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      page: 0,
      size: 20,
      // 筛选的字段
      filterForm: {
        gpoMemberId: null,
        hospitalMemberName: null,
        fillTime: null,
        drugsName: null,
        producerName: null,
        memberId: null,
      },
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
    // 数据查询条件获取
    dataSearch(data) {
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        hospitalMemberName: data.hospitalMemberName.value,
        drugsName: data.drugsName.value,
        producerName: data.producerName.value,
        fillTime: data.fillTime.value,
      };
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取数据列表
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.filterForm.gpoMemberId = this.getGpoId;                    // 获取默认GPO会员Id
      const form = this.filterForm;
      let fillTime = '';
      if (form.fillTime && typeof form.fillTime === 'object') {
        fillTime = `${form.fillTime[0].replace(/\//g, '-')} - ${form.fillTime[1].replace(/\//g, '-')}`;
      } else {
        fillTime = form.fillTime;
      }
      if (fillTime === '1970-01-01 - 1970-01-01') {
        form.fillTime = null;
      } else {
        form.fillTime = fillTime;
      }
      HarmfulResponseTest.list(cpage, cpageSizes, form).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.tableData = [];
          this.tableNum = [];
          this.tableCount = 0;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (data.number * data.size);
            data.content[i].num = numX;
          }
          this.tableData = data.content;
          this.tableDataOld = data.content;
          this.page = data.number;
          this.size = data.size;
          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
        this.loading = false;
      });
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page);
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 135]);
      };
      setTimeout(tableHeightFun, 0);
    },
    dataCreate() {
      this.$router.push({ path: '/SurveyReport/HarmfulResponseTest/Create' });
    },
    /**
     *  编辑
     * @param item
     */
    dataUpdate(item) {
      this.$router.push({ path: '/SurveyReport/HarmfulResponseTest/Edit', query: { id: item.id } });
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>

<template>
  <div>
    <el-table :data="tableData" v-loading="loading" @selection-change="dataSelect" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column type="selection" width="40" fixed="left" align="center">
      </el-table-column>
      <el-table-column prop="num" fixed="left" label="#" width="40" class-name="table_right_fixed">
      </el-table-column>
      <el-table-column prop="memberNo" label="会员编码" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="memberName" label="会员名称" align="left" min-width="200" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="memberType" label="会员类型" align="left" min-width="200" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.memberType === 1">生产企业</span>
          <span v-if="scope.row.memberType === 2">经营企业</span>
          <span v-if="scope.row.memberType === 3">医疗机构</span>
          <span v-if="scope.row.memberType === 4">GPO</span>
          <span v-if="scope.row.memberType === 5">平台</span>
        </template>
      </el-table-column>
      <el-table-column prop="typeName" label="印章类别" align="left" min-width="170" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="enclosure" label="附件" align="left" min-width="70"  show-overflow-tooltip>
        <template scope="scope">
          <YuploadFiles :data="convert.getJSON(scope.row.enclosure)"></YuploadFiles>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" align="left" min-width="200" sortable="custom" show-overflow-tooltip class-name="table_right">
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
import Signature from '../../../api/BasicInfo/Signature'; // 公告管理APi

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
        memberNo: null,
        memberName: null,
        memberType: null,
        typeId: null,
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
    dataSearch(data) {
      this.filterForm = {
        memberNo: data.memberNo.value,
        memberName: data.memberName.value,
        memberType: data.memberType.value,
        typeId: data.typeId.value,
      };
      this.dataList(0, this.size, this.filterForm);
    },
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      Signature.list(cpage, cpageSizes, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
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
      this.$bus.$emit('createNotice/dialog', row);
    },
    // 修改
    dataUpdate(row) {
      this.$bus.$emit('updateNotice/dialog', row);
    },
    // 删除
    dataDelete(row) {
      let item = '';
      const selectIds = [];
      for (let i = 0; i < row.length; i += 1) {
        item = row[i];
        selectIds.push(item.id);
      }
      Signature.destory(selectIds).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功',
          });
          this.dataList(0);
        }
      });
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
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
  transform: translate(48px, 2px)!important;
}
</style>

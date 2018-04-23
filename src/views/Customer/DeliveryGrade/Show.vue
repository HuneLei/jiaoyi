<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" align="center" label="#" width="40" fixed="left" :formatter="sortTable">
      </el-table-column>
      <el-table-column prop="projectSubName" label="配送企业" align="left" min-width="150" sortable>
      </el-table-column>
      <el-table-column label="品规满足率评分" sortable>
        <el-table-column prop="projectSubName" label="(15)" align="center" min-width="150"></el-table-column>
      </el-table-column>
      <el-table-column  label="到货数量满足率评分" sortable>
        <el-table-column prop="projectSubName" label="(10)" align="center" min-width="150"></el-table-column>
      </el-table-column>
      <el-table-column label="订单响应率评分" sortable>
        <el-table-column prop="projectSubName" label="(5)" align="center" min-width="150"></el-table-column>
      </el-table-column>
      <el-table-column label="到货及时率评分" sortable>
        <el-table-column prop="projectSubName" label="(15)" align="center" min-width="150"></el-table-column>
      </el-table-column>
      <el-table-column label="随货单据准确评分" sortable>
        <el-table-column prop="projectSubName" label="(10)" align="center" min-width="150"></el-table-column>
      </el-table-column>
      <el-table-column  label="随货单据及时评分" sortable>
        <el-table-column prop="projectSubName" label="(5)" align="center" min-width="150"></el-table-column>
      </el-table-column>
      <el-table-column label="质量投诉评分" sortable>
        <el-table-column prop="projectSubName" label="(20)" align="center" min-width="150"></el-table-column>
      </el-table-column>
      <el-table-column label="退换货评分" sortable>
        <el-table-column prop="projectSubName" label="(5)" align="center" min-width="150"></el-table-column>
      </el-table-column>
      <el-table-column label="信息反馈评分" sortable>
        <el-table-column prop="projectSubName" label="(15)" align="center" min-width="150"></el-table-column>
      </el-table-column>
      <el-table-column label="月度综合评分">
        <el-table-column  label="(100)" align="center"  min-width="150"  prop="projectSubName"  fixed="right" max-width="200"></el-table-column>
      </el-table-column>
      <el-table-column label="历史综合评分">
        <el-table-column label="(100)" align="center" min-width="150" max-width="200"  prop="projectSubName" fixed="right">
           <template scope="scope"> 
            <el-rate
              v-model="a"
              show-text
              text-color="#ff9900"
              text-template="{value}">
            </el-rate>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <CreateDialog :options="dialogOptions" @dialogSelect="dialogSelect"></CreateDialog>
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
  import DeliveryGrade from '../../../api/Customer/DeliveryGrade'; // APi
  import CreateDialog from './CreateDialog'; //  新增时的弹框

  export default {
    activated() {
      this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
      this.$bus.$on('page/change', this.pageChange);
      this.$bus.$on('data/list', this.dataList);
      this.$bus.$on('components/Find', this.dataSearch);
      this.$bus.$on('scoring/rules/look', this.dataCreate); // 查看评分规则
      if (this.getGpoId && this.getProjectId) {
        this.dataList();
      }
    },
    deactivated() {
      this.$bus.$off('table/height', this.tableHeightRun);
      this.$bus.$off('page/change', this.pageChange);
      this.$bus.$off('data/list', this.dataList);
      this.$bus.$off('components/Find', this.dataSearch);
      this.$bus.$off('scoring/rules/look', this.dataCreate);
    },
    computed: mapGetters([
      'getGpoId',
      'getProjectId',
    ]),
    created() {
      this.tableHeightRun();
      window.onresize = () => {
        this.tableHeightRun();
      };
    },
    components: {
      CreateDialog,
    },
    data() {
      return {
        a: 3.7,
        tableHeight: 650,
        dialogOptions: {
          msgBase: '', //  没什么卵用，有需要可以看看
          isShowDialog: false, //  显示弹框
          tableSelected: [], //  默认表格选中
          tableType: 1, //  0 单选，1 多选 默认单选
          projectId: '',
          gpoMemberId: '',
        },
        tableData: [],
        tableCount: 0,
        tableNum: [],
        loading: false,
        filterForm: {
          gpoMemberId: null,
          projectId: null,
          projectSubName: null,
        },
        page: 0,
        size: 20,
      };
    },
    methods: {
      //  每次点击排序都会触发
      sortChange() {
        this.tableCount = 0;
      },
      //  进行排序时返回每一行
      sortTable(row, column) {
        if (this.tableCount < this.tableData.length) {
          const sortRow = window.tableCustom.tableSortNum(
            row,
            this.tableData,
            this.tableCount,
            this.tableNum,
          );
          this.tableData = sortRow.tableData;
          this.tableCount = sortRow.tableCount;
        }
        return row.num;
      },
      // 查询条件获取
      dataSearch(data) {
        this.filterForm = {
          gpoMemberId: this.getGpoId,
          projectId: data.projectId.value,
          projectSubId: data.projectSubId.value,
        };
        this.dataList(this.page, this.size, this.filterForm);
      },
      dataList(page, size, filterForm) {
//      this.loading = true;
        this.filterForm.gpoMemberId = this.getGpoId; // 默认的GPOID
//      DeliveryGrade.list(page || this.page, size || this.size, this.filterForm)
//        .then((res) => {
//          if (res.data.code === 0) {
//            const data = res.data.result;
//            this.tableNum = [];
//            this.tableCount = 0;
//            for (let i = 0; i < data.content.length; i += 1) {
//              const numX = (i + 1) + (data.number * data.size);
//              data.content[i].num = numX;
//              this.tableNum.push(numX);
//            }
//            this.tableData = data.content;
//            this.$emit('page', data.number + 1, data.size, data.totalElements);
//          }
//          this.loading = false;
//        });
      },
      dataCreate() {
        // console.log();
        this.dialogOptions.projectId = this.filterForm.projectId;
        this.dialogOptions.gpoMemberId = this.filterForm.gpoMemberId;
        this.dialogOptions.isShowDialog = true;
      },
      // 弹出框选择之后确定事件
      dialogSelect(rows, msgBase, msgCom) {
        // console.log();
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

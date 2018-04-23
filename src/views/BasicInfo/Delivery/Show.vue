<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" align="left" fixed="left" label="#" width="40">
      </el-table-column>
      <el-table-column prop="enterpriseCode" label="经营企业编码" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="enterpriseName" label="经营企业名称" width="280" sortable="custom" align="left" show-overflow-tooltip>
        <template scope="scope">
          <a href="javascript:void(0)" @click="showItem(scope.row)">{{scope.row.enterpriseName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="roleType" label="角色类型" align="left" sortable="custom" min-width="100" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.roleType === 1">卖方</span>
          <span v-if="scope.row.roleType === 2">买方</span>
          <span v-if="scope.row.roleType === 3">配送方</span>
        </template>
      </el-table-column>
      <el-table-column prop="provinceName"  label="所在地区" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.countyName}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="覆盖率" prop="coverage" align="left" sortable min-width="70" show-overflow-tooltip>
        </el-table-column>-->
      <el-table-column prop="projectName" label="集采项目" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="outGpoNo" label="经营企业外部编码" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliverPerson" label="企业联系人" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliverPhone" label="联系电话" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="仓库地址" min-width="80" class-name="table_right" align="center">
        <template scope="scope">
          <el-button type="text" @click="showAddress(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width='160' fixed="right" label="修改外部编码" v-if="authbtn.update">
        <template scope="scope">
          <el-button type="text" @click="dataUpdate(scope.row)">
            <i class="fa fa-edit"></i> 编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="authbtn.updateStatus" label="操作" align="center" min-width="100" max-width="200" fixed="right" prop="enable">
        <template scope="scope">
          <el-switch v-model="scope.row.enable" on-color="#13ce66" off-color="#ff4949" on-text="启用" off-text="禁用" @change="changeStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--align="center"-->
      <!--min-width='160'-->
      <!--fixed="right"-->
      <!--label="发货联系人">-->
      <!--<template scope="scope">-->
      <!--<el-button type="text" @click="dataMaintain(scope.row)"><i class="fa fa-edit"></i> 维护</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
    <showWarehouseAddress :options="dialogOptions" :row="row" @dialog-hide="dialogHide"></showWarehouseAddress>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/4.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import project from '../../../api/BasicInfo/Project';     // api -- project[集采项目]
import delivery from '../../../api/BasicInfo/Delivery';   // api -- 医疗机构
import showWarehouseAddress from './showWarehouseAddress';  // 引入查看配送地址弹出窗

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
    if (this.getGpoId && this.getProjectId) {
      this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
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
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/BasicInfo/Delivery') {
        this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
  },
  computed: mapGetters([
    'getGpoId',
    'getProjectId',
  ]),
  components: {
    showWarehouseAddress,
  },
  data() {
    return {
      tableHeight: 650,
      row: '',                              // 需要传入组件的列表row,需要值为ID
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
      },
      tableData: [],       // 表单的值
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,      // 列表加载状态
      filterForm: {
        gpoMemberId: null,
        projectId: null,
        provinceId: null,
        cityId: null,
        countyId: null,
        enable: null,
        enterpriseName: null,
        enterpriseCode: null,
        roleType: null,
        outGpoNo: null,
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
    // 数据查询条件获取
    dataSearch(data) {
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        projectId: data.projectId.value,
        provinceId: data.provinceId.value,
        cityId: data.cityId.value,
        countyId: null,
        enterpriseName: data.enterpriseName.value,
        enterpriseCode: data.enterpriseCode.value,
        enable: data.enable.value,
        roleType: data.roleType.value,
        outGpoNo: data.outGpoNo.value,
      };

      this.dataList(0, this.size, this.filterForm);
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
      if (this.tableData[index].enable === true) {
        // 开启项目
        this.tableData[index].enable = false;
        i = 1;
      } else {
        // 关闭项目
        this.tableData[index].enable = true;
        i = 0;
      }
      const id = row.ids;                  // 集采项目Id
      let prompt;
      if (i === 1) {
        prompt = '启用成功';
      } else {
        prompt = '禁用成功';
      }
      // 更新请求
      delivery.updateStatus(id, i).then((res) => {
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
    // 获取数据列表
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.filterForm.gpoMemberId = this.getGpoId;         // 获取会员ID
      delivery.list(cpage, cpageSizes, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableData = [];
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              // data.content[i].num = (i + 1) + (cpage * cpageSizes);
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              // data.content[i].id = i;
              if (data.content[i].roleType === 1) {
                data.content[i].coverage = '-';
              } else {
                data.content[i].coverage = `${data.content[i].coverage}%`;
              }
              if (data.content[i].enable === 1) {
                data.content[i].enable = true;
              } else {
                data.content[i].enable = false;
              }
            }
            this.tableDataOld = data.content;
            this.tableData = data.content;
            // const coverage = res.data.result.coverage;
            this.page = data.number;
            this.size = data.size;
            this.$emit('page', data.number + 1, data.size, data.totalElements, data.totalPages);
          }
          this.loading = false;
        });
    },
    dataUpdate(item) {
      this.$bus.$emit('data/update', item);
    },
    dataMaintain(item) {
      this.$bus.$emit('data/updateInvoice', item);
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    // 查看仓库地址 -- 弹出窗
    showAddress(row) {
      this.row = row;
      this.dialogOptions.isShowDialog = true;  // 打开弹出框
    },
    // 查看经营企业 -- 跳页
    showItem(row) {
      this.$router.push({ path: '/BasicInfo/Delivery/BusinessDeliveyInfo', query: { id: row.id } });
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;  // 关闭弹出框
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

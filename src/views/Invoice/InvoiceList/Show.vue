<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="View_TableHeight" stripe border fit @sort-change="sortChange" @selection-change="dataSelect">
      <el-table-column type="selection" width="40" align="left" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="num" fixed="left" label="#" width="40">
      </el-table-column>
      <el-table-column prop="code" label="发票代码" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="number" label="发票号" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="invoiceType" label="发票类型" align="left" min-width="95" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.invoiceType === 1">普通发票</span>
          <span v-if="scope.row.invoiceType === 0">冲红发票</span>
          <span v-if="scope.row.invoiceType === 2">冲红发票(拒收)</span>
        </template>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" label="医疗机构" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" label="配送企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="taxesAmount" label="发票金额" align="right" min-width="100" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.taxesAmount.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="discountAmount" label="票折金额" align="right" min-width="100" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <p v-if="scope.row.discountAmount === 0"></p>
          <p v-else>{{scope.row.discountAmount.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="invoiceBy" label="开票人" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="invoiceDate" label="开票日期" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="invoiceStatus" label="发票状态" align="left" min-width="105" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span class="order-green" v-if="scope.row.invoiceStatus === 0">待提交</span>
          <span class="order-blue" v-if="scope.row.invoiceStatus === 1">已确认</span>
          <span class="order-red" v-if="scope.row.invoiceStatus === 2">已作废(配送企业)</span>
          <span class="order-red" v-if="scope.row.invoiceStatus === 4">已作废(医疗机构)</span>
          <span class="order-green" v-if="scope.row.invoiceStatus === 3">待确认</span>
        </template>
      </el-table-column>
      <el-table-column prop="returned" label="是否回款" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="Number(scope.row.returned) === 0" class="order-green">否</span>
          <span v-if="Number(scope.row.returned) === 1" class="order-blue">是</span>
        </template>
      </el-table-column>
      <el-table-column prop="returnedTime" label="回款日期" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="affirmReturned" label="配送企业确认" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.affirmReturned === 0" class="order-green">未确认</span>
          <span v-if="scope.row.affirmReturned === 1" class="order-blue">已确认</span>
        </template>
      </el-table-column>
      <el-table-column prop="ifUpload" label="是否已上传" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.ifUpload === 0">否</span>
          <span v-if="scope.row.ifUpload === 1">是</span>
        </template>
      </el-table-column>
      <el-table-column prop="ifGather" label="是否货票同行" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.ifGather === 0">否</span>
          <span v-if="scope.row.ifGather === 1">是</span>
        </template>
      </el-table-column>
      <el-table-column prop="noOut" label="外部发票编号" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="ordersBy" label="提交人" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="ordersTime" label="提交日期" align="left" min-width="140" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="confirmPerson" label="确定人" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="confirmTime" label="确定日期" align="left" min-width="140" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="operate" label="标记回款人" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="operateTime" label="标记日期" align="left" min-width="140" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="affirmBy" label="回款确认人" align="left" min-width="80" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="affirmTime" label="确认日期" align="left" min-width="140" sortable="custom" show-overflow-tooltip class-name="table_right">
      </el-table-column>
      <div v-if="authbtn.itemInfo || authbtn.withdraw || authbtn.submitUpdate">
        <el-table-column label="操作" fixed="right" align="center" min-width="300" v-if="getPrincipal.memberType === 2">
          <template scope="scope">
            <router-link :to="{ path: '/Invoice/InvoiceList/Edit', query: { id: scope.row.id, invoiceStatus: scope.row.invoiceStatus } }" v-if="authbtn.itemInfo">
              <el-button @click="dataLook(scope.row)" type="text" size="small">
                <i class="icon iconfont icon-chakan"></i> 详情
              </el-button>
            </router-link>
            <el-button @click="dataBack(scope.row)" type="text" size="small" :disabled="scope.row.invoiceStatus===1||scope.row.invoiceStatus===2 ||scope.row.invoiceStatus===4" v-if="getPrincipal.memberType === 2&&authbtn.withdraw">
              <i class="fa fa-share"></i> 撤回发票
            </el-button>
            <el-button @click="dataUpdata(scope.row)" type="text" size="small" min-width="120" :disabled="scope.row.ifUpload===1 || scope.row.invoiceStatus===2 ||scope.row.invoiceStatus===4" v-if="authbtn.submitUpdate">
              <i class="el-icon-upload2"></i> 上传发票
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" min-width="100" max-width="200" v-if="getPrincipal.memberType !== 2 && authbtn.itemInfo">
          <template scope="scope">
            <router-link :to="{ path: '/Invoice/InvoiceList/Edit', query: { id: scope.row.id, invoiceStatus: scope.row.invoiceStatus } }">
              <el-button @click="dataLook(scope.row)" type="text" size="small" style="margin-right: 10px;">
                <i class="icon iconfont icon-chakan"></i> 详情 </el-button>
            </router-link>
          </template>
        </el-table-column>
      </div>
    </el-table>
    <InvoiceEditDialog></InvoiceEditDialog>
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert';                         //  自定义转换js
import InvoiceEditDialog from './InvoiceEditDialog';
import InvoiceList from '../../../api/Invoice/InvoiceList';

export default {
  props: {
    authbtn: Object,
  },
  components: {
    InvoiceEditDialog,
  },
  activated() {
    if (this.$route.query.from === 'index') {
      this.filterForm.invoiceStatus = 3;
    }
    this.$bus.$on('page/change', this.pageChange);
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('data/page/do', this.dataPageDo);      //  多按钮点击时候触发事件
    if (this.getGpoId) {
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('page/change', this.pageChange);
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('components/Find', this.dataSearch);
    this.$bus.$off('data/page/do', this.dataPageDo);     //  多按钮点击时候触发事件
  },
  watch: {
    getGpoId() {
      if (this.$route.path === '/Invoice/InvoiceList') {
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
      'View_TableHeight',
    ]),
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
        gpoMemberId: null,
        deliveryMemberName: null,
        hospitalMemberName: null,
        code: null,
        number: null,
        invoiceDate: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,
        invoiceStatus: null,
        invoiceType: null,
        ifUpload: null,
        returned: null,
        returnedTime: null,
        affirmReturned: null,
        noOut: null,
      },
      page: 0,
      size: 20,
    };
  },
  methods: {
    dataSelect(row) {
      // let submit = true;
      const ids = [];
      for (let i = 0; i < row.length; i += 1) {
        const status = Number(row[i].invoiceStatus);
        if (status === 3) {
          ids.push(row[i].id);
        }
      }
      this.$emit('table-select', ids, row);
      // const first = 0;
      // if (first > 0) {
      //   submit = false;
      // }
      const btn = { batchConfirm: false };
      this.$bus.$emit('data/select', row, btn);
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
    dataSearch(datas) {
      const data = datas;
      let invoiceDate = '';
      if (data.invoiceDate.value && typeof data.invoiceDate.value === 'object') {
        invoiceDate = `${data.invoiceDate.value[0].replace(/\//g, '-')} - ${data.invoiceDate.value[1].replace(/\//g, '-')}`;
      } else {
        invoiceDate = data.invoiceDate.value;
      }
      if (invoiceDate === '1970-01-01 - 1970-01-01') {
        data.invoiceDate.value = null;
      } else {
        data.invoiceDate.value = invoiceDate;
      }
      let returnedTime = '';
      if (data.returnedTime.value && typeof data.returnedTime.value === 'object') {
        returnedTime = `${data.returnedTime.value[0].replace(/\//g, '-')} - ${data.returnedTime.value[1].replace(/\//g, '-')}`;
      } else {
        returnedTime = data.returnedTime.value;
      }
      if (returnedTime === '1970-01-01 - 1970-01-01') {
        data.returnedTime.value = null;
      } else {
        data.returnedTime.value = returnedTime;
      }
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        deliveryMemberName: data.deliveryMemberName.value,
        hospitalMemberName: data.hospitalMemberName.value,
        code: data.code.value,
        number: data.number.value,
        invoiceDate: data.invoiceDate.value,
        invoiceStatus: data.invoiceStatus.value,
        invoiceType: data.invoiceType.value,
        ifUpload: data.ifUpload.value,
        returned: data.returned.value,
        returnedTime: data.returnedTime.value,
        affirmReturned: data.affirmReturned.value,
        noOut: data.noOut.value,
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
      InvoiceList.list(page || this.page, size || this.size, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              data.content[i].taxesAmount = Number(data.content[i].taxesAmount);
              data.content[i].discountAmount = Number(data.content[i].discountAmount);
              if (data.content[i].returnedTime) {
                data.content[i].returnedTime = data.content[i].returnedTime.substring(0, 10);
              }
            }
            this.tableData = data.content;
            this.tableDataOld = data.content;
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
          this.loading = false;
        });
      return true;
    },
    // 撤回发票
    dataBack(row) {
      const ret = '是否撤回发票?';
      this.$confirm(ret, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        InvoiceList.withdraw(row.id).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功',
            });
            this.dataList();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 上传发票
    dataUpdata(row) {
      this.$bus.$emit('invoiceEdit/dialog', row);
    },
    // 查看
    dataLook(row) {
      this.$bus.$emit('invoice/look', row);
    },
    // 新增
    dataPageDo() {       // 新增点击时触发事件
      this.$router.push({ path: '/Invoice/InvoiceList/Creat' });
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>
<style>
.fromtrades .el-button + .el-button {
  margin-left: 0px !important;
}
</style>

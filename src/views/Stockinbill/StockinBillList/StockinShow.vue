<template>

  <div v-loading="loading">

    <el-table :data="tableData" stripe border fit :height="View_TableHeight" @sort-change="sortChange">
      <el-table-column prop="num" label="#" width="40" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="code" min-width="120" height="20px" label="入库单编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" min-width="180" height="20px" label="医疗机构" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" min-width="180" height="20px" label="配送企业" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="status" min-width="160" height="20px" label="入库单状态" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span :class="!scope.row.status ? 'order-green' : 'order-blue'">{{baseTableSelect.status[scope.row.status]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" min-width="80" height="20px" label="创建人" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createTime" min-width="160" height="20px" label="创建日期" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="sendTime" min-width="160" height="20px" label="入库日期" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="noOut" min-width="120" height="20px" label="外部入库单编号" sortable="custom" show-overflow-tooltip class-name="table_right">
      </el-table-column>
      <el-table-column label="操作" min-width="100" max-width="200" fixed="right" align="center" v-if="authbtn.item">
        <template scope="scope">
          <el-button type="text" size="small" @click="dataItem(scope.row)">
            <i class="icon iconfont icon-chakan" style="font-size: 12px"></i>详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script>
/**
 * 入库单管理
 * ----------------------------
 * 入库单列表
 */
import { mapActions, mapGetters } from 'vuex';
import StockinBillList from '../../../api/Stockinbill/StockinBillList';           //  引入入库列表api

export default {
  props: {
    authbtn: Object,
  },
  computed: {
    ...mapGetters([
      'View_TableHeight',
      'getGpoId',
    ]),
  },
  activated() {
    this.$bus.$on('components/Find', this.dataSearch);      //  查询
    this.$bus.$on('page/change', this.dataList);            //  页码切换
    this.$bus.$on('data/list', this.dataList);              //  初始化列表
    this.$bus.$on('data/page/do', this.dataCreate);              //  新增
    if (this.getGpoId) {               // 初始化列表查询
      this.dataList();
    }

    setTimeout(() => {
      this.TableHeightRun();
      window.onresize = () => {
        this.TableHeightRun();
      };
    }, 0);
  },
  deactivated() {
    this.$bus.$off('components/Find', this.dataSearch);    //  查询
    this.$bus.$off('page/change', this.dataList);          //  页码切换
    this.$bus.$off('data/list', this.dataList);            //  初始化列表
    this.$bus.$off('data/page/do', this.dataCreate);              //  新增
  },
  watch: {
    getGpoId() {
      this.dataList();
    },
  },
  data() {
    return {
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      formInline: {    // 查询条件的获取值
        code: {},
        hospitalMemberName: {},
        deliveryMemberName: {},
        status: {},
        noOut: {},
        sendTime: {},
        createTime: {
          value: [
            this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30))),
            this.convertDate(new Date()),
          ],
        },
      },
      page: 0,
      size: 20,
      total: 0,
    };
  },
  methods: {
    ...mapActions([
      'TableHeightRun',
      'CalcSet_isFirst',
    ]),
    //  每次点击排序都会触发
    sortChange(rule) {
      if (rule.order) {
        const tableData = this.convert.tableSort(rule, this.tableData);
        this.tableData = [...tableData];
      } else {
        this.tableData = [...this.tableDataOld];
      }
    },
    //  更新表格数据
    dataList(page, pageSizes, formInline) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      const form = formInline || this.formInline;
      let createTime = '';
      if (form.createTime.value && typeof form.createTime.value === 'object') {
        createTime = `${form.createTime.value[0].replace(/\//g, '-')} - ${form.createTime.value[1].replace(/\//g, '-')}`;
      } else {
        createTime = form.createTime.value;
      }
      if (createTime === '1970-01-01 - 1970-01-01') {
        form.createTime.value = '';
      } else {
        form.createTime.value = createTime;
      }
      let sendTime = '';
      if (form.sendTime.value && typeof form.sendTime.value === 'object') {
        sendTime = `${form.sendTime.value[0].replace(/\//g, '-')} - ${form.sendTime.value[1].replace(/\//g, '-')}`;
      } else {
        sendTime = form.sendTime.value;
      }
      if (sendTime === '1970-01-01 - 1970-01-01') {
        form.sendTime.value = '';
      } else {
        form.sendTime.value = sendTime;
      }
      form.gpoMemberId = this.getGpoId;
      StockinBillList.list(cpage, cpageSizes, form).then((res) => {
        if (res.data.code === 0) {
          this.tableNum = [];
          this.tableCount = 0;
          const data = res.data.result;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (cpage * cpageSizes);
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
    // 数据查询条件获取
    dataSearch(data) {
      this.formInline = data;
      this.dataList(0, this.size, this.formInline);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return this.convert.convertDate(str);
    },
    //  新增
    dataCreate() {
      this.CalcSet_isFirst(false);
      this.$router.push({ path: '/Stockinbill/StockinBillList/Edit' });
    },
    //  查看详情
    dataItem(row) {
      this.CalcSet_isFirst(false);
      this.$router.push({ path: '/Stockinbill/StockinBillList/Edit', query: { id: row.id, status: row.status } });
    },
  },
};
</script>

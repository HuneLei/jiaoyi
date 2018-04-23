<template>
  <div v-loading="loading">
    <el-table :data="tableData" stripe border fit :height="View_TableHeight" @selection-change="dataSelect" @sort-change="sortChange">
      <el-table-column type="selection" width="40" align="center">
      </el-table-column>
      <el-table-column prop="num" label="#" width="40" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="code" min-width="120" height="20px" label="配送单号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="barcode" min-width="120" height="20px" label="条码号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalMemberName" min-width="180" height="20px" label="医疗机构" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="deliveryMemberName" min-width="180" height="20px" label="配送企业" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="amount" min-width="90" height="20px" label="金额" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.amount.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="stockinStatus" sortable="custom" label="入库状态" min-width="80" show-overflow-tooltip v-if="View_UserInfo.memberType !== 2">
        <template scope="scope">
          <span v-if="Number(scope.row.stockinStatus) === 0" style="color: blue">未入库</span>
          <span v-if="Number(scope.row.stockinStatus) === 1" style="color: green">部分入库</span>
          <span v-if="Number(scope.row.stockinStatus) === 2" style="color: green">已入库</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" min-width="80" height="20px" label="创建人" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sendTime" min-width="140" height="20px" label="发货时间" sortable="custom" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="noOut" min-width="120" height="20px" label="外部配送单号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="billAccessories" min-width="100" label="随货同行单" sortable="custom" show-overflow-tooltip class-name="table_right">
        <template scope="scope">
          <YuploadFiles :data="convert.getJSON(scope.row.billAccessories)"></YuploadFiles>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" :min-width='View_UserInfo.memberType == 2?220:120' fixed="right">
        <template scope="scope">
          <el-button v-if="View_UserInfo.memberType == 3" type="text" size="small" :disabled="Number(scope.row.stockinStatus) === 2" @click="RouterStockin(scope.row.id)">
            <i class="icon iconfont icon-right_circle" style="font-size: 12px"></i>收货
          </el-button>
          <!-- <el-button v-if="View_UserInfo.memberType != 3 && authbtn.backout" type="text" size="small" @click="orderBackout(scope.row.id)" :disabled="scope.row.undoNum!=0">
            <i class="icon iconfont icon-work-exam-back" style="font-size: 12px"></i>撤销
          </el-button> -->
          <router-link :to="{ path: '/Deliverbill/DeliverBillList/CheckDItem', query: { id: scope.row.id } }">
            <el-button type="text" size="small" v-if="authbtn.item">
              <i class="icon iconfont icon-chakan" style="font-size: 12px"></i>详情
            </el-button>
          </router-link>
          <el-button @click="dataUpdata(scope.row)" type="text" size="small" :disabled="false" v-if="View_UserInfo.memberType == 2">
            <i class="el-icon-upload2"></i> 上传随货同行单
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <AccessorEditDialog></AccessorEditDialog>
  </div>
</template>

<script>
/**
 * Created by yaoling on 2017/9/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert';                         //  自定义转换js
import AccessorEditDialog from './AccessorEditDialog';                  //  上传随货同行单附件
import DeliverBillList from '../../../api/Deliverbill/DeliverBillList';  // 订单(医疗机构api)

export default {
  computed: {
    ...mapGetters([
      'View_TableHeight',
      'View_UserInfo',
      'getGpoId',
    ]),
    authList() {
      return this.$store.state.view.authList;
    },
  },
  components: {
    AccessorEditDialog,
  },
  activated() {
    if (this.$route.query.from === 'index') {
      this.formInline.stockinStatus.value = [0, 1];
    }
    this.$bus.$on('components/Find', this.dataSearch);    //  查询
    this.$bus.$on('page/change', this.dataList);          //  页码切换
    this.$bus.$on('data/list', this.dataList);            //  初始化列表
    if (this.getGpoId) {               // 初始化列表查询
      this.dataList();
    }
    this.authbtn = DeliverBillList.authbtn();
  },
  deactivated() {
    this.$bus.$off('components/Find', this.dataSearch);    //  查询
    this.$bus.$off('page/change', this.dataList);          //  页码切换
    this.$bus.$off('data/list', this.dataList);            //  初始化列表
  },
  watch: {
    authList() {
      this.authbtn = DeliverBillList.authbtn();
    },
    getGpoId() {
      if (this.$route.path === '/Deliverbill/DeliverBillList') {
        this.dataList();
      }
    },
  },
  data() {
    return {
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      authbtn: {},
      formInline: {    // 查询条件的获取值
        code: {},
        barcode: {},
        noOut: {},
        sendTime: {},
        stockinStatus: {},
        hospitalMemberName: {},
        deliveryMemberName: {},
        createTime: {
          value: [
            this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30))),
            this.convertDate(new Date()),
          ],
        },
      },
      page: 0,
      size: 20,
    };
  },
  methods: {
    ...mapActions([
      'CalcSet_isFirst',
    ]),
    // 上传随货同行单
    dataUpdata(row) {
      this.$bus.$emit('aiccessorEdit/dialog', row);
    },
    // 选择触发事件，根据审核状态判断右下角btn是否禁用
    dataSelect(row) {
      let submit = false;
      const ids = [];
      const hospitalIds = [];
      const deliverIds = [];
      for (let i = 0; i < row.length; i += 1) {
        ids.push(row[i].id);
        hospitalIds.push(row[i].hospitalMemberId);
        deliverIds.push(row[i].deliveryMemberId);
      }
      this.$emit('table-select', ids, hospitalIds, deliverIds);
      const first = row.length;
      if (first > 0) {
        submit = true;
      }
      const btn = { onPrint: submit };
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
    //  点击收货去入库管理新增
    RouterStockin(id) {
      this.CalcSet_isFirst(false);
      this.$router.push({ path: '/Stockinbill/StockinBillList/Edit', query: { deliverId: id } });
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
      if (createTime === '1970-01-01 - 1970-01-01') {
        form.createTime.value = '';
      } else {
        form.createTime.value = createTime;
      }
      form.gpoMemberId = this.getGpoId;
      if (this.View_UserInfo.memberType === 2) {
        form.stockinStatus = {};
      }
      DeliverBillList.list(cpage, cpageSizes, form).then((res) => {
        if (res.data.code === 0) {
          this.tableNum = [];
          this.tableCount = 0;
          const data = res.data.result;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (cpage * cpageSizes);
            data.content[i].num = numX;
            data.content[i].amount = Number(data.content[i].amount);
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
      this.formInline = {
        ...data,
        sendTime: data.sendTime || {},
      };
      this.dataList(0, this.size, this.formInline);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>

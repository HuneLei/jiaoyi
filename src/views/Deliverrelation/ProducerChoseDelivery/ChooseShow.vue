<template>
  <div>
    <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%" :height="tableHeight" stripe fit @sort-change="sortChange">
      <el-table-column prop="enterpriseCode" label="配送企业编码" width="100" sortable="custom" align="left" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="enterpriseUsedName" label="配送企业名称" width="200" sortable="custom" align="left" show-overflow-tooltip>
        <template scope="scope">
          {{scope.row.enterpriseUsedName}}
        </template>
      </el-table-column>
      <!--<el-table-column prop="fgl" label="覆盖率" width="80"  sortable="custom" show-overflow-tooltip align="left">
            <template scope="scope">
              <el-button type="text" @click="coverage(scope.row)">
                {{scope.row.fgl}}
              </el-button>
            </template>
          </el-table-column>-->
      <el-table-column prop="cScope" label="经营范围" sortable="custom" show-overflow-tooltip align="left"> </el-table-column>
      <el-table-column prop="region" label="所在地区" width="120" sortable="custom" show-overflow-tooltip align="left"> </el-table-column>
      <el-table-column label="配送区域" width="80" class-name="table_right" align="left">
        <template scope="scope">
          <el-button type="text" @click="enterPrise(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="选定" show-overflow-tooltip align="center" width="80" fixed="right" v-if="authbtn.submit">
        <template scope="scope">
          <el-button @click="select(scope.row, scope.$index)" :disabled="scope.row.disabled">
            <i class="el-icon-plus"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Coverage :options="dialogOptions" @dialog-hide="dialogHide"></Coverage>
    <Enterprise></Enterprise>
  </div>
</template>

<script>
/**
 * Created by yaoling on 2017/9/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import ProducerChoseDelivery from '../../../api/Deliverrelation/ProducerChoseDelivery';
import Coverage from './Coverage';
import Enterprise from './Enterprise';

export default {
  activated() {
    // console.log();
    this.$bus.$on('table/height', this.tableHeightRun);     //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    // this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/num', this.getNum);
    this.$bus.$on('data/tableData', this.getTableData);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    this.dataInit();
    // this.tableHeightRun();
    // window.onresize = () => {
    //   this.tableHeightRun();
    // };
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    // 监听页码切换
    // this.$bus.$off('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$off('data/num', this.getNum);
    this.$bus.$off('data/tableData', this.getTableData);
    // 监听删除
    this.$bus.$off('components/Find', this.dataSearch);
  },
  computed: mapGetters([
    'getGpoId',
    'getProjectId',
    'View_TableHeight',
  ]),
  components: {
    Coverage,
    Enterprise,
  },
  data() {
    return {
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
      },
      tableTitle: '添加明细',
      fromEdit: {
        projectId: '',
        gpoMemberId: '',
        drugsId: '',
        salerMemberId: '',
      },
      tableData: [],
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      selectData: [],
      // 筛选字段
      filterForm: {
        projectId: null,
        gpoMemberId: null,
        provinceId: null,
        cityId: null,
        countyId: null,
        memberName: null,
        memberNo: null,
        roleType: null,
        drugsId: null,
        salerMemberId: null,
      },
      tableshow: true,
      dialogFormVisible: false,
      page: 0,
      size: 20,
      selectedStatus: false,
      enterpriseLists: [],
      tableDataParent: [],
    };
  },
  props: {
    tableHeight: {
      default: 200,
    },
    authbtn: Object,
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
    getTableData(data, page, size) {
      this.tableDataParent = data;
      this.dataList(page, size);
      // this.dataInit();
    },
    // 数据初始化
    dataInit() {
      this.enterpriseLists = [];
      // this.tableHeightRun();
      // window.onresize = () => {
      //   this.tableHeightRun();
      // };
      if (!this.$route.query.id) {
        this.loading = false;
        return false;
      }
      ProducerChoseDelivery.item(this.$route.query.id).then((res) => {
        // console.log();
        if (res.data.code === 0) {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.filterForm = Object.assign({}, this.filterForm, {
              projectId: data.projectId,
              gpoMemberId: data.gpoMemberId,
              drugsId: data.id,
              salerMemberId: data.enrollId,
            });
            this.dataList(this.page, this.size);
          }
        }
      });
      return true;
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    // 查询条件获取
    dataSearch(data) {
      // console.log();
      this.filterForm = {
        projectId: this.getProjectId,
        gpoMemberId: this.getGpoId,
        drugsId: this.filterForm.drugsId,
        provinceId: data.provinceId.value,
        cityId: data.cityId.value,
        countyId: null,
        memberName: data.enterpriseUsedName.value,
        memberNo: data.enterpriseCode.value,
      };
      // console.log();
      this.dataInit();
      // this.dataList(this.page, this.size, this.filterForm);
    },
    // 查看覆盖率
    coverage(row) {
      this.$bus.$emit('data/getRow', row, this.filterForm.projectId);
      this.dialogOptions.isShowDialog = true;  // 打开弹出框
      // ProducerChoseDelivery.coverage()
    },
    // 查看配送区域
    enterPrise(row) {
      const form = {
        pid: this.filterForm.projectId,
        gid: this.filterForm.gpoMemberId,
        mid: row.id,
      };
      this.$bus.$emit('data/area/create1', form);
    },
    // 获取删除时的对应索引
    getNum(code) {
      for (let i = 0; i < this.tableData.length; i += 1) {
        const item = this.tableData[i];
        if (item.enterpriseCode === code) {
          this.tableData[i].disabled = false;
          break;
        }
      }
    },
    // 点击+时触发
    select(row, num) {
      this.tableData[num].disabled = true;
      this.enterpriseList = {
        deliveryMemberId: row.id,
        deleteid: row.deleteid,
        deliveryMemberCode: row.enterpriseCode,
        deliveryMemberName: row.enterpriseUsedName,
      };
      // this.enterpriseLists.push(this.enterpriseList);
      this.$bus.$emit('data/enterpriseList', this.enterpriseList);
    },
    // 获取数据列表
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      // console.log();
      ProducerChoseDelivery.salerMemberList(cpage, cpageSizes, this.filterForm).then((res) => {
        // console.log();
        if (res.data.code === 0) {
          const data = res.data.result;
          this.tableData = [];
          this.tableNum = [];
          this.tableCount = 0;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (i + 1) + (data.number * data.size);
            data.content[i].num = numX;
            this.tableNum.push(numX);
            data.content[i].disabled = false;
            data.content[i].fgl = Number(data.content[i].fgl).toFixed(2);
            data.content[i].fgl += '%';
            data.content[i].region = data.content[i].region === 'null' ? '' : data.content[i].region;
          }
          const chooseData = [];
          this.tableDataOld = data.content;
          this.tableData = data.content;
          // console.log();
          for (let i = 0; i < this.tableData.length; i += 1) {
            // if (this.tableData[i].nametype === '1') {
            //   this.tableData[i].disabled = true;
            //   // const row = this.tableData[i];
            //   // const item = {
            //   //   deliveryMemberId: row.id,
            //   //   deleteid: row.deleteid,
            //   //   deliveryMemberCode: row.enterpriseCode,
            //   //   deliveryMemberName: row.enterpriseUsedName,
            //   // };
            //   // chooseData.push(item);
            // }
            for (let j = 0; j < this.tableDataParent.length; j += 1) {
              if (this.tableData[i].enterpriseCode === this.tableDataParent[j].deliveryMemberCode) {
                this.tableData[i].disabled = true;
              }
            }
            // for (let j = 0; j < this.enterpriseCodes.length; j += 1) {
            //   if (this.tableData[i].enterpriseCode === this.enterpriseCodes[j].enterpriseCode) {
            //     this.tableData[i].disabled = true;
            //   }
            // }
          }
          this.$bus.$emit('chooseData', this.tableData, this.tableData[0].deliveryLimitNum || 0);
          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
        this.loading = false;
      });
    },
    // 多选框选择
    // dataSelect(row) {
    //   let booldelete = true;
    //   for (let i = 0; i < row.length; i += 1) {
    //     const item = row[i];
    //     if (item.auditStatus === 1 || item.auditStatus === 2) {
    //       booldelete = false;
    //       break;
    //     }
    //   }
    //   const btn = {
    //     delete: booldelete,
    //   };
    //   this.$bus.$emit('data/select', row, btn);
    // },
    // 查看选择的配送企业
    Deliver(row) {
      this.dialogFormVisible = true;
      this.dialogOptions.isShowDialog = true;
    },
    // 关闭弹出框
    closeDialog() {
      this.dialogFormVisible = false;
    },
    // // 页码切换
    // pageChange(page) {
    //   this.dataList(page, this.size);
    // },
  },
};
</script>


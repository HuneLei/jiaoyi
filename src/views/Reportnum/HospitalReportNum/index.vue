<template>
  <div>
    <div v-show="showPlan" id="Order_Plan">
      <Find :showNum="8" :message="message" @selectValue="getSelectValue" :defaultAjax="defaultAjax"></Find>
      <Show :authbtn="authbtn" @page="dataPage"></Show>
      <Paging :authbtn="authbtn" :show-btn="ShowBtn" :page="page" :size="size" :total="total"></Paging>
    </div>
    <div v-show="showCheck">
      <router-view v-loading="loading"></router-view>
      <TradeFooter :authbtn="authbtn" :isSaveShow="isSaveShow" :isDeleteShow="isDeleteShow" :isBackShow="isBackShow" @order-save="orderSave" @order-delete="orderDelete" @order-back="orderBack"></TradeFooter>
    </div>
  </div>
</template>


<script>
/**
 * Created by wuqian on 2017/9/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import Show from './Show';                                // 引用列表显示组件
import TradeFooter from '../../../components/TradeFooter';        // 引入订单底部
import gpo from '../../../api/gpo'; // gpo API
import HospitalReportNum from '../../../api/Reportnum/HospitalReportNum';

export default {
  components: {
    Show,
    TradeFooter,
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
    ...mapGetters([
      'Order_ReturnHint',
      'Order_PlanfromEdit',
      'Order_PlanDateList',
      'Order_PlanItemList',
      'View_UserInfo',
      'View_UserInfor',
      'getGpoId',
      'projectOptions',
      'getProjectId',
      'gpoOptions',
    ]),
  },
  methods: {
    orderSave() {        // 保存按钮触发事件
      this.$confirm('此操作将保存该数据，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let datelist = [];
        // console.log();
        if (!this.Order_PlanfromEdit.projectId) {
          this.$message({
            type: 'error',
            message: '请选择集采项目',
          });
          return;
        }
        if (!this.Order_PlanfromEdit.projectSubId) {
          this.$message({
            type: 'error',
            message: '请选择集采子项目',
          });
          return;
        }
        if (!this.Order_PlanfromEdit.timeId) {
          this.$message({
            type: 'error',
            message: '请选择期间名称',
          });
          return;
        }
        if (this.Order_PlanfromEdit.remarks && this.Order_PlanfromEdit.remarks.length > 256) {
          this.$message({
            type: 'error',
            message: '备注不得超过256位字符',
          });
          return;
        }
        if (typeof this.$route.query.id === 'undefined') {
          datelist = Object.assign(this.Order_PlanDateList);
          for (let i = 0; i < datelist.length; i += 1) {
            datelist[i].reportNum = datelist[i].purchaseNum;
            datelist[i].drugsId = datelist[i].ids;
            datelist[i].salerMemberId = datelist[i].enrollId;
            if (datelist[i].purchaseNum === '' || datelist[i].purchaseNum === null || Number(datelist[i].purchaseNum) === 0) {
              this.$message({
                type: 'error',
                message: '数量不能为空或为0',
              });
              return;
            }
          }
          this.loading = true;
          const from = {
            gpoMemberId: this.getGpoId,
            timeId: this.Order_PlanfromEdit.timeId,
            gpoMemberName: this.Order_PlanfromEdit.gpoMemberName,
            gpoPerson: this.Order_PlanfromEdit.gpoPerson,
            gpoPhone: this.Order_PlanfromEdit.gpoPhone,
            hospitalMemberCode: this.Order_PlanfromEdit.hospitalMemberCode,
            hospitalMemberId: this.Order_PlanfromEdit.id,
            hospitalMemberName: this.Order_PlanfromEdit.hospitalMemberName,
            hospitalPerson: this.Order_PlanfromEdit.hospitalPerson,
            hospitalPhone: this.Order_PlanfromEdit.hospitalPhone,
            reportnumValidBtime: this.Order_PlanfromEdit.reportnumValidBtime,
            reportnumValidEtime: this.Order_PlanfromEdit.reportnumValidEtime,
            projectId: this.Order_PlanfromEdit.projectId,
            projectSubId: this.Order_PlanfromEdit.projectSubId,
            remarks: this.Order_PlanfromEdit.remarks,
            reportnumId: 0,
            tmsReportnumItemFormList: datelist,
          };
          HospitalReportNum.create(from).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功',
              });
              this.$bus.$emit('data/list');
              history.back();
            }
            this.loading = false;
          });
        } else {
          datelist = Object.assign(this.Order_PlanItemList);
          for (let i = 0; i < datelist.length; i += 1) {
            datelist[i].reportNum = datelist[i].purchaseNum;
            // datelist[i].drugsId = datelist[i].ids;
            if (!datelist[i].salerMemberId) {
              datelist[i].salerMemberId = datelist[i].enrollId;
            }
            if (datelist[i].purchaseNum === '' || datelist[i].purchaseNum === null || Number(datelist[i].purchaseNum) === 0) {
              this.$message({
                type: 'error',
                message: '数量不能为空或为0',
              });
              return;
            }
          }
          this.loading = true;
          const from = {
            gpoMemberId: this.getGpoId,
            timeId: this.Order_PlanfromEdit.timeId,
            gpoMemberName: this.Order_PlanfromEdit.gpoMemberName,
            gpoPerson: this.Order_PlanfromEdit.gpoPerson,
            gpoPhone: this.Order_PlanfromEdit.gpoPhone,
            hospitalMemberCode: this.Order_PlanfromEdit.hospitalMemberCode,
            hospitalMemberId: this.Order_PlanfromEdit.hospitalMemberId,
            hospitalMemberName: this.Order_PlanfromEdit.hospitalMemberName,
            hospitalPerson: this.Order_PlanfromEdit.hospitalPerson,
            hospitalPhone: this.Order_PlanfromEdit.hospitalPhone,
            reportnumValidBtime: this.Order_PlanfromEdit.reportnumValidBtime,
            reportnumValidEtime: this.Order_PlanfromEdit.reportnumValidEtime,
            projectId: this.Order_PlanfromEdit.projectId,
            projectSubId: this.Order_PlanfromEdit.projectSubId,
            remarks: this.Order_PlanfromEdit.remarks,
            reportnumId: this.$route.query.id,
            tmsReportnumItemFormList: datelist,
          };
          // console.log();
          HospitalReportNum.update(from).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功',
              });
              this.$bus.$emit('data/list');
              history.back();
            }
            this.loading = false;
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    orderDelete() {      // 删除按钮触发事件
      this.loading = true;
      HospitalReportNum.destory(this.$route.query.id).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功',
          });
          this.$bus.$emit('data/list');
          history.back();
        }
        this.loading = false;
      });
    },
    dataPageDo() {       // 新增点击时触发事件
      this.$router.push({ path: '/Reportnum/HospitalReportNum/Creat' });
    },
    orderBack() {        // 返回按钮触发事件
      if (this.Order_ReturnHint) {
        this.$confirm('存在未保存的明细数据，确定返回吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          history.back();
          this.$bus.$emit('data/list');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
      } else {
        history.back();
        this.$bus.$emit('data/list');
      }
    },
    //  计算表格高度
    tableHeightRun() {
      this.$nextTick(() => {
        this.TableHeightRun();
      });
    },
    // 获取页码数据
    dataPage(page, size, total) {
      this.page = page;
      this.size = size;
      this.total = total;
    },
    // 得到集采项目改变值
    getSelectValue(val) {
      this.subProjectAll(val);
    },
    // 获取集采项目下拉
    getProjectAll() {
      if (this.View_UserInfo.memberType === 3) {
        this.message[3].selects = this.projectOptions; // 给项目集采名称options赋值
        this.message[3].defaults = this.getProjectId;  // 给项目集采名称options赋值
      } else {
        this.message[4].selects = this.projectOptions; // 给项目集采名称options赋值
        this.message[4].defaults = this.getProjectId;  // 给项目集采名称options赋值
      }
      this.defaultAjax += 1;                         // 控制defaultAjax变化监听
    },
    //  集采子项目
    subProjectAll(val) {
      if (this.getGpoId) {
        gpo.ProjectSubCommonAll(this.getGpoId, val || null).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            const subProjectOption = [];
            for (let i = 0; i < data.length; i += 1) {
              subProjectOption.push({
                value: data[i].id,
                label: data[i].name,
              });
            }
            if (this.View_UserInfo.memberType === 3) {
              this.message[4].selects = subProjectOption;
            } else {
              this.message[5].selects = subProjectOption;
            }
          }
        });
      }
    },
    ...mapActions([
      'ItemList',
      'showCreat',
      'Initialize',
      'TableHeightRun',
    ]),
  },
  watch: {
    authList() {
      this.authbtn = HospitalReportNum.authbtn();
      // console.log();
    },
    $route(to, from) {
      if (to.path === '/Reportnum/HospitalReportNum/Edit') {   // 如果去详情页面计算表格高度
        this.$store.commit('BreadCrumb_Update', [
          {
            path: '/index',
            name: this.$store.state.view.resourcesNow.name,
          },
          {
            path: '/Reportnum',
            name: '医疗机构报量管理',
            noLink: true,
          },
          {
            path: '/Reportnum/HospitalReportNum',
            name: '医疗机构报量',
            noLink: true,
          },
          {
            path: '/Reportnum/HospitalReportNum/Edit',
            name: '医疗机构报量详情',
            noLink: true,
          },
        ]);
        this.isSaveShow = true;
        this.isDeleteShow = true;
        const btnDisabled = {
          planSave: true,
        };
        this.$bus.$emit('data/tradefoot', btnDisabled);
        this.showPlan = false;
        this.showCheck = true;
        this.Initialize(); // 初始化数据
        this.$nextTick(() => {
          this.TableHeightRun(['#from-item', '.TradeFooter', '.search-find', 200]);
        });
      }
      if (to.path === '/Reportnum/HospitalReportNum/Creat') {  // 如果去新增页面计算表格高度
        this.isDeleteShow = false;
        this.$store.commit('BreadCrumb_Update', [
          {
            path: '/index',
            name: this.$store.state.view.resourcesNow.name,
          },
          {
            path: '/Reportnum',
            name: '医疗机构报量管理',
            noLink: true,
          },
          {
            path: '/Reportnum/HospitalReportNum',
            name: '医疗机构报量',
            noLink: true,
          },
          {
            path: '/Reportnum/HospitalReportNum/Creat',
            name: '医疗机构报量新增',
            noLink: true,
          },
        ]);
        this.showPlan = false;
        this.showCheck = true;
        const btnDisabled = {
          planSave: false,
        };
        this.$bus.$emit('data/tradefoot', btnDisabled);
        this.Initialize(); // 初始化数据
        const itemList = {
          code: '',
          createBy: '',
          createTime: '',
          hospitalMemberName: this.View_UserInfor.name,
          hospitalPerson: this.View_UserInfor.contacter,
          hospitalPhone: this.View_UserInfor.phone,
          id: this.View_UserInfor.id,
          gpoMemberName: null,
        };
        for (let i = 0; i < this.gpoOptions.length; i += 1) {
          if (this.gpoOptions[i].id === this.getGpoId) {
            this.$set(itemList, 'gpoMemberName', this.gpoOptions[i].name);
          }
        }
        // console.log();
        this.ItemList(itemList);
        this.$nextTick(() => {
          this.TableHeightRun(['.el-form', '.TradeFooter', '.search-find', 200]);
        });
      }
      if (to.path === '/Reportnum/HospitalReportNum') {   // 如果去初始页面计算表格高度
        this.$store.commit('BreadCrumb_Update', [
          {
            path: '/index',
            name: this.$store.state.view.resourcesNow.name,
          },
          {
            path: '/Reportnum',
            name: '医疗机构报量管理',
            noLink: true,
          },
          {
            path: '/Reportnum/HospitalReportNum',
            name: '医疗机构报量',
            noLink: true,
          },
        ]);
        this.showPlan = true;
        this.showCheck = false;
        this.$nextTick(() => {
          this.TableHeightRun();
        });
      }
    },
  },
  mounted() {
    if (this.View_UserInfo.memberType === 4 || this.View_UserInfo.memberType === 5) {
      this.ShowBtn.create = false;
    }
    this.$router.push({ path: '/Reportnum/HospitalReportNum' });
    this.$nextTick(() => {
      this.TableHeightRun();
    });
    window.onresize = () => {
      if (this.$route.path === '/Reportnum/HospitalReportNum') {
        this.TableHeightRun();
      } else if (this.$route.path === '/Reportnum/HospitalReportNum/Creat') {
        this.TableHeightRun(['.el-form', '.TradeFooter', '.search-find', 200]);
      } else if (this.$route.path === '/Reportnum/HospitalReportNum/Edit') {
        this.TableHeightRun(['#from-item', '.TradeFooter', '.search-find', 200]);
      }
    };
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Reportnum',
        name: '医疗机构报量管理',
        noLink: true,
      },
      {
        path: '/Reportnum/HospitalReportNum',
        name: '医疗机构报量',
        noLink: true,
      },
    ]);
  },
  activated() {
    this.authbtn = HospitalReportNum.authbtn();
    if (this.View_UserInfo.memberType === 3 && this.message[0].key === 'hospitalMemberName') {
      this.message.splice(0, 1);
    }
    // console.log();
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.getProjectAll();
    this.$bus.$on('data/page/do', this.dataPageDo);      //  多按钮点击时候触发事件
    this.$bus.$on('table/height', this.tableHeightRun);  //  监听查询按钮的查看更多点击事件，重新计算表格高度
  },
  deactivated() {
    this.$bus.$off('project/getAll', this.getProjectAll);
    this.$bus.$off('data/page/do', this.dataPageDo);     //  多按钮点击时候触发事件
    this.$bus.$off('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      loading: false,
      showPlan: true,
      showCheck: false,
      page: 1,              // 当前页数
      size: 20,             // 一页显示多少列
      total: 0,             // 一共多少页
      defaultAjax: 0,   // 控制下拉框默认
      isSaveShow: true,     // 保存按钮
      isBackShow: true,     // 返回按钮
      isDeleteShow: true,   // 删除按钮
      isCreateShow: false,  // 保存并生成订单按钮
      ShowBtn: {            // 按钮显示控制
        create: true,
      },
      message: [
        {
          key: 'hospitalMemberName',
          label: '医疗机构',
          placeholder: '请输入医疗机构',
          type: 0,
          selects: [],
        },
        {
          key: 'timeName',
          label: '期间名称',
          placeholder: '请输入期间名称',
          type: 0,
          selects: [],
        },
        {
          type: 9,  // 类型
          key: 'createTime',
          label: '创建日期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: true,  // 是否进来默认为一个月
        },
        // {
        //   key: 'createTime',
        //   label: '创建日期',
        //   placeholder: '请选择创建日期',
        //   type: 5,
        //   defaultDate: true,
        //   selects: [],
        //   pickerOptions: {
        //     shortcuts: [{
        //       text: '最近三个月',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }, {
        //       text: '最近半年',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 182));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }, {
        //       text: '最近一年',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 365));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }],
        //   },
        // },
        {
          type: 9,  // 类型
          key: 'reportnumValidtime',
          label: '报量有效期',
          shortcuts: true,  // 是否开启快捷选择
          defaultDate: false,  // 是否进来默认为一个月
        },
        // {
        //   key: 'reportnumValidtime',
        //   label: '报量有效期',
        //   placeholder: '请选择报量有效期',
        //   type: 5,
        //   selects: [],
        //   pickerOptions: {
        //     shortcuts: [{
        //       text: '最近三个月',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }, {
        //       text: '最近半年',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 182));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }, {
        //       text: '最近一年',
        //       onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - (3600 * 1000 * 24 * 365));
        //         picker.$emit('pick', [start, end]);
        //       },
        //     }],
        //   },
        // },
        {
          key: 'projectId',
          label: '集采项目',
          type: 8,
          selects: [],
        },
        {
          key: 'projectSubId',
          label: '集采子项目',
          type: 1,
          filterable: true,
          selects: [],
        },
      ],
    };
  },
};
</script>

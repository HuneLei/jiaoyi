<template>
  <div>
    <div v-show="showPlan" id="Order_Plan">
      <Find :showNum="4" :message="message"></Find>
      <PlanShow :authbtn="authbtn" @page="dataPage"></PlanShow>
      <Paging :authbtn="authbtn" :show-btn="ShowBtn" :page="page" :size="size" :total="total"></Paging>
    </div>
    <div v-show="showCheck">
      <router-view v-loading="loading"></router-view>
      <TradeFooter :authbtn="authbtn"
                   :isSaveShow="isSaveShow"
                   :isDeleteShow="isDeleteShow"
                   :isBackShow="isBackShow"
                   @order-save="orderSave"
                   @order-delete="orderDelete"
                   @order-back="orderBack"></TradeFooter>
    </div>
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
  import PlanShow from './PlanShow';                                // 引用列表显示组件
  import TradeFooter from '../../../components/TradeFooter';        // 引入订单底部
  import Paging from '../../../components/Paging';                  // 引入底部
  import Find from '../../../components/Find';                      // 引搜索头部
  import PurchasePlan from '../../../api/Order/PurchasePlan';       // 引入采购计划api
  import convert from '../../../utils/convert';                     // 引入js公共方法

  export default {
    components: {
      Find,
      Paging,
      PlanShow,
      TradeFooter,
    },
    computed: mapGetters([
      'Order_PlanfromEdit',
      'Order_PlanDateList',
      'Order_PlanItemList',
      'View_UserInfo',
      'View_UserInfor',
      'Order_ReturnHint',
      'getGpoId',
    ]),
    methods: {
      // 新增点击时触发事件
      dataPageDo() {
        this.$router.push({ path: '/Order/PurchasePlan/CreatPlan' });
      },
      // 返回按钮触发事件
      orderBack() {
        if (this.Order_ReturnHint) {
          this.$confirm('存在未保存的明细数据，确定返回吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.$bus.$emit('data/list');
            history.back();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            });
          });
        } else {
          history.back();
        }
      },
      // 删除按钮触发事件
      orderDelete() {
        this.loading = true;
        PurchasePlan.remove(this.$route.query.id).then((res) => {
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
      // 保存按钮触发事件
      orderSave() {
        this.$confirm('此操作将保存该数据，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          let datelist = [];
          if (this.Order_PlanfromEdit.name === '') {
            this.$message({
              type: 'error',
              message: '采购计划名称不能为空',
            });
            return;
          }
          if (typeof this.$route.query.id === 'undefined') {
            datelist = Object.assign(this.Order_PlanDateList);
            const id = 0;
            const from = this.checkSave(datelist, id);
            if (!from.from) {
              return;
            }
            if (from.factors) {
              this.$confirm('当前采购数量可能会导致包装拆零，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
              }).then(() => {
                this.CreatOrder(from);
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消操作',
                });
              });
            } else {
              this.CreatOrder(from);
            }
          } else {
            datelist = Object.assign(this.Order_PlanItemList);
            const id = this.$route.query.id;
            const from = this.checkSave(datelist, id);
            if (!from.from) {
              return;
            }
            if (from.factors) {
              this.$confirm('当前采购数量可能会导致包装拆零，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
              }).then(() => {
                this.UpdateOrder(from);
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消操作',
                });
              });
            } else {
              this.UpdateOrder(from);
            }
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          });
        });
      },
      // 新增接口调用
      CreatOrder(from) {
        this.loading = true;
        PurchasePlan.create(from.from).then((res) => {
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
      },
      // 保存接口调用
      UpdateOrder(from) {
        this.loading = true;
        PurchasePlan.update(from.from).then((res) => {
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
      },
      // 保存的时候校验规则
      checkSave(datelist, dateid) {
        let factors = 0;
        for (let i = 0; i < datelist.length; i += 1) {
          const removeFactor = datelist[i].removeFactor;
          const purchaseNum = datelist[i].purchaseNum;
          if (datelist[i].purchaseNum === '' || datelist[i].purchaseNum === null || Number(datelist[i].purchaseNum) === 0) {
            this.$message({
              type: 'error',
              message: '数量不能为空或为0',
            });
            return false;
          }
          if (removeFactor) {
            if (Number(purchaseNum) % Number(removeFactor) !== 0) {
              factors = 1;
            }
          }
        }
        const from = {
          gpoId: this.getGpoId,
          id: dateid,
          name: this.Order_PlanfromEdit.name,
          tmsPurchasePlanItemFormList: datelist,
        };
        return { from, factors };
      },
      // 计算表格高度
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
      // 转换日期 YYYY-MM-DD
      convertDate(str) {
        return convert.convertDate(str);
      },
      ...mapActions([
        'ItemList',
        'showCreat',
        'Initialize',
        'TableHeightRun',
        'ControltradeBtn',
      ]),
    },
    watch: {
      authList() {
        this.authbtn = PurchasePlan.authbtn();
      },
      $route(to, from) {
        if (to.path === '/Order/PurchasePlan/CheckItem') {   // 如果去详情页面计算表格高度
          this.$store.commit('BreadCrumb_Update', [
            {
              path: '/index',
              name: this.$store.state.view.resourcesNow.name,
            },
            {
              path: '/Order',
              name: '订单管理',
              noLink: true,
            },
            {
              path: '/Order/PurchasePlan',
              name: '采购计划',
            },
            {
              path: '/CheckItem',
              name: '采购计划详情',
              noLink: true,
            },
          ]);
          if (this.View_UserInfo.memberType === 4 || this.View_UserInfo.memberType === 5) {
            this.isDeleteShow = false;
            this.isSaveShow = false;
          } else {
            this.isDeleteShow = true;
            this.isSaveShow = true;
          }
          const tradeBtn = {
            orderCreat: false,
            orderDelete: true,
          };
          this.ControltradeBtn(tradeBtn);
          this.showPlan = false;
          this.showCheck = true;
          this.Initialize(); // 初始化数据
          this.$nextTick(() => {
            this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
          });
        }
        if (to.path === '/Order/PurchasePlan/CreatPlan') {
          this.isDeleteShow = false;
          this.$store.commit('BreadCrumb_Update', [
            {
              path: '/index',
              name: this.$store.state.view.resourcesNow.name,
            },
            {
              path: '/Order',
              name: '订单管理',
              noLink: true,
            },
            {
              path: '/Order/PurchasePlan',
              name: '采购计划',
            },
            {
              path: '/CreatPlan',
              name: '采购计划新增',
              noLink: true,
            },
          ]);
          const tradeBtn = {
            orderCreat: false,
            orderDelete: true,
          };
          this.ControltradeBtn(tradeBtn);
          this.showPlan = false;
          this.showCheck = true;
          // 初始化数据
          this.Initialize();
          const itemList = {
            code: '',
            createBy: '',
            createTime: '',
            hospitalName: this.View_UserInfo.memberName,
            hospitalPerson: `${this.View_UserInfor.contacter || ''} ${this.View_UserInfor.phone || ''}`,
            hospitalPhone: this.View_UserInfor.phone,
            id: '',
            name: '',
          };
          this.ItemList(itemList);
          this.$nextTick(() => {
            this.TableHeightRun(['.el-form', '.TradeFooter', 200]);  // 如果去新增页面计算表格高度
          });
        }
        if (to.path === '/Order/PurchasePlan') {
          this.$store.commit('BreadCrumb_Update', [
            {
              path: '/index',
              name: this.$store.state.view.resourcesNow.name,
            },
            {
              path: '/Order',
              name: '订单管理',
              noLink: true,
            },
            {
              path: '/PurchasePlan',
              name: '采购计划',
              noLink: true,
            },
          ]);
          this.showPlan = true;
          this.showCheck = false;
          // 如果去初始页面计算表格高度
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
      this.$router.push({ path: '/Order/PurchasePlan' });
      this.$nextTick(() => {
        this.TableHeightRun();
      });
      window.onresize = () => {
        if (this.$route.path === '/Order/PurchasePlan') {
          this.TableHeightRun();
        } else if (this.$route.path === '/Order/PurchasePlan/CreatPlan') {
          this.TableHeightRun(['.el-form', '.TradeFooter', 200]);
        } else if (this.$route.path === '/Order/PurchasePlan/CheckItem') {
          this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
        }
      };
      this.$store.commit('BreadCrumb_Update', [
        {
          path: '/index',
          name: this.$store.state.view.resourcesNow.name,
        },
        {
          path: '/Order',
          name: '订单管理',
          noLink: true,
        },
        {
          path: '/PurchasePlan',
          name: '采购计划',
          noLink: true,
        },
      ]);
    },
    activated() {
      this.authbtn = PurchasePlan.authbtn();
      this.$bus.$on('data/page/do', this.dataPageDo);      //  多按钮点击时候触发事件
      this.$bus.$on('table/height', this.tableHeightRun);  //  监听查询按钮的查看更多点击事件，重新计算表格高度
    },
    deactivated() {
      this.$bus.$off('data/page/do', this.dataPageDo);     //  多按钮点击时候触发事件
      this.$bus.$off('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    },
    data() {
      return {
        loading: false,
        showPlan: true,
        showCheck: false,
        page: 1,              // 当前页数
        size: 20,             // 一页显示多少列
        total: 0,             // 一共多少页
        isSaveShow: true,     // 保存按钮
        isBackShow: true,     // 返回按钮
        isDeleteShow: true,   // 删除按钮
        isCreateShow: false,  // 保存并生成订单按钮
        ShowBtn: {            // 按钮显示控制
          destory: false,
          create: true,
          pwnolock: false,
          onDrugs: false,
          offDrugs: false,
          exportData: false,
          importData: false,
          saveChange: false,
        },
        authbtn: {},
        message: [
          {
            key: 'code',
            label: '采购计划编号',
            placeholder: '请输入编号',
            hasOp: false,
            type: 0,
            selects: [],
          },
          {
            key: 'name',
            label: '采购计划名称',
            placeholder: '请输入名称',
            hasOp: false,
            type: 0,
            selects: [],
          },
          {
            type: 9,  // 类型
            key: 'createTime',
            label: '创建日期',
            placeholder: '请输入创建日期',
            shortcuts: true,  // 是否开启快捷选择
            defaultDate: true,  // 是否进来默认为一个月
          },
//          {
//            key: 'createTime',
//            label: '创建日期',
//            convertdate: 2,
//            type: 5,
//            placeholder: '请选择日期',
//            selects: [],
//            defaultDate: true,
//            pickerOptions: {
//              shortcuts: [{
//                text: '最近三个月',
//                onClick(picker) {
//                  const end = new Date();
//                  const start = new Date();
//                  start.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
//                  picker.$emit('pick', [start, end]);
//                },
//              }, {
//                text: '最近半年',
//                onClick(picker) {
//                  const end = new Date();
//                  const start = new Date();
//                  start.setTime(start.getTime() - (3600 * 1000 * 24 * 182));
//                  picker.$emit('pick', [start, end]);
//                },
//              }, {
//                text: '最近一年',
//                onClick(picker) {
//                  const end = new Date();
//                  const start = new Date();
//                  start.setTime(start.getTime() - (3600 * 1000 * 24 * 365));
//                  picker.$emit('pick', [start, end]);
//                },
//              }],
//            },
//          },
          {
            key: 'hospitalMemberName',
            label: '医疗机构',
            placeholder: '请输入医疗机构',
            hasOp: false,
            type: 0,
            selects: [],
          },
        ],
      };
    },
  };
</script>


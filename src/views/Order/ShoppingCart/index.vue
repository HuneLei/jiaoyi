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
                   :isBackShow="isBackShow"
                   :isCreateShow="isCreateShow"
                   @order-save="orderSave"
                   @order-create="orderCreate"
                   @order-back="orderBack"
                   v-show="isTradeShow"></TradeFooter>
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
  import Find from '../../../components/Find';                      // 引搜索头部
  import Paging from '../../../components/Paging';                  // 引入底部
  import TradeFooter from '../../../components/TradeFooter';        // 引入订单底部
  import ShoppingCart from '../../../api/Order/ShoppingCart';       // 引入订单购物车api

  export default {
    components: {
      Find,
      Paging,
      PlanShow,
      TradeFooter,
    },
    computed: mapGetters([
      'Order_PlanItemList',
      'Order_PlanfromEdit',
      'Order_purchaseNum',
      'View_UserInfo',
      'getGpoId',
    ]),
    methods: {
      // 保存按钮触发事件
      orderSave() {
        const checkpass = this.checkSave();
        if (!checkpass) {
          return;
        }
        const datelist = [];
        for (let y = 0; y < this.Order_PlanItemList.length; y += 1) {
          datelist[y] = Object.assign({}, this.Order_PlanItemList[y]);
        }
        let purNumall = 0;
        for (let i = 0; i < datelist.length; i += 1) {
          purNumall += datelist[i].purchasableNum;
          const purchasableNum = datelist[i].purchasableNum;
          const purchaseNum = datelist[i].purchaseNum;
          datelist[i].ordersNum = purchaseNum;
          datelist[i].purchaseNum = purchasableNum;
          if (Number(datelist[i].upStatus) === 0) {
            this.$message({
              type: 'error',
              message: '存在已下架药品，保存失败！',
            });
            return;
          }
          if (Number(datelist[i].purchaseNum) <= 0) {
            this.$message({
              type: 'error',
              message: '可采数量不足',
            });
            return;
          }
          if (datelist[i].ordersNum === '' || datelist[i].ordersNum === null || Number(datelist[i].ordersNum) === 0) {
            this.$message({
              type: 'error',
              message: '数量不能为空或为0',
            });
            return;
          }
        }
        if (purNumall < this.Order_purchaseNum) {
          this.$message({
            type: 'error',
            message: '请检查订单数量是否有大于可采数量',
          });
        } else {
          this.loading = true;
          const receiveAddress = JSON.parse(this.Order_PlanfromEdit.receiveAddress);
          const from = {
            gpoId: this.getGpoId,
            id: this.$route.query.id || this.Order_PlanfromEdit.id,
            receiveAddress: receiveAddress[1],
            receiveAddressId: receiveAddress[0],
            remarks: this.Order_PlanfromEdit.remarks,
            type: this.Order_PlanfromEdit.type === '普通订单' ? 0 : 1,
            tmsOrdersItemFormList: datelist,
          };
          ShoppingCart.update(from).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '保存成功',
              });
              this.$bus.$emit('data/list');
              if (typeof this.$route.query.id !== 'undefined') {
                history.back();
              }
            }
            this.loading = false;
          });
        }
      },
      // 保存并生成订单触发事件
      orderCreate() {
        if (this.Order_PlanItemList.length === 0) {
          this.$message({
            type: 'error',
            message: '请添加明细！',
          });
          return;
        }
        const checkpass = this.checkSave();
        if (!checkpass) {
          return;
        }
        const datelist = [];
        for (let y = 0; y < this.Order_PlanItemList.length; y += 1) {
          datelist[y] = Object.assign({}, this.Order_PlanItemList[y]);
        }
        let purNumall = 0;
        let factor = 0;
        for (let i = 0; i < datelist.length; i += 1) {
          purNumall += datelist[i].purchasableNum;
          const purchasableNum = datelist[i].purchasableNum;
          const purchaseNum = datelist[i].purchaseNum;
          const removeFactor = datelist[i].removeFactor;
          datelist[i].ordersNum = purchaseNum;
          datelist[i].purchaseNum = purchasableNum;
          if (Number(datelist[i].upStatus) === 0) {
            this.$message({
              type: 'error',
              message: '存在已下架药品，不可生成订单！',
            });
            return;
          }
          if (Number(datelist[i].purchaseNum) <= 0) {
            this.$message({
              type: 'error',
              message: '可采数量不足',
            });
            return;
          }
          if (datelist[i].ordersNum === '' || datelist[i].ordersNum === null || Number(datelist[i].ordersNum) === 0) {
            this.$message({
              type: 'error',
              message: '数量不能为空或为0',
            });
            return;
          }
          if (removeFactor) {
            if (Number(purchaseNum) % Number(removeFactor) !== 0) {
              factor = 1;
            }
          }
        }
        if (purNumall < this.Order_purchaseNum) {
          this.$message({
            type: 'error',
            message: '请检查订单数量是否有大于可采数量',
          });
        } else if (factor) {
          this.$confirm('当前采购数量可能会导致包装拆零，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.CreatOrder(datelist);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作',
            });
          });
        } else {
          this.CreatOrder(datelist);
        }
      },
      CreatOrder(datelist) {
        this.loading = true;
        const receiveAddress = JSON.parse(this.Order_PlanfromEdit.receiveAddress);
        const from = {
          gpoId: this.getGpoId,
          confirmSave: 0,
          id: this.$route.query.id || this.Order_PlanfromEdit.id,
          receiveAddress: receiveAddress[1],
          receiveAddressId: receiveAddress[0],
          remarks: this.Order_PlanfromEdit.remarks,
          type: this.Order_PlanfromEdit.type === '普通订单' ? 0 : 1,
          tmsOrdersItemFormList: datelist,
        };
        ShoppingCart.shopcreate(from).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            for (let i = 0; i < data.length; i += 1) {
              data[i].num = i + 1;
            }
            this.OrderCreate(data);
            this.$message({
              type: 'success',
              message: '生成订单成功',
            });
            this.isTradeShow = false;
            this.$router.push({ path: '/Order/ShoppingCart/OrderRefer' });
          } else if (res.data.code === 1001) {
            const ret = res.data.message;
            this.$confirm(ret, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              this.loading = true;
              const receiveAddresstow = JSON.parse(this.Order_PlanfromEdit.receiveAddress);
              const fromtwo = {
                gpoId: this.getGpoId,
                confirmSave: 1,
                id: this.$route.query.id || this.Order_PlanfromEdit.id,
                receiveAddress: receiveAddresstow[1],
                receiveAddressId: receiveAddresstow[0],
                remarks: this.Order_PlanfromEdit.remarks,
                type: this.Order_PlanfromEdit.type === '普通订单' ? 0 : 1,
                tmsOrdersItemFormList: datelist,
              };
              ShoppingCart.shopcreate(fromtwo).then((restow) => {
                if (restow.data.code === 0) {
                  const data = restow.data.result;
                  for (let i = 0; i < data.length; i += 1) {
                    data[i].num = i + 1;
                  }
                  this.OrderCreate(data);
                  this.$message({
                    type: 'success',
                    message: '生成订单成功',
                  });
                  this.isTradeShow = false;
                  this.$router.push({ path: '/Order/ShoppingCart/OrderRefer' });
                }
                this.loading = false;
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作',
              });
            });
          }
          this.loading = false;
        });
      },
      // 保存或生成订单的时候校验规则
      checkSave() {
        if (this.Order_PlanfromEdit.type === '') {
          this.$message({
            type: 'error',
            message: '请选择订单类型',
          });
          return false;
        }
        if (this.Order_PlanfromEdit.remarks && this.Order_PlanfromEdit.remarks.length > 256) {
          this.$message({
            type: 'error',
            message: '备注不得超过256位字符',
          });
          return false;
        }
        if (this.Order_PlanfromEdit.receiveAddress === '') {
          this.$message({
            type: 'error',
            message: '收货地址不能为空',
          });
          return false;
        }
        return true;
      },
      orderBack() {        // 返回按钮触发事件
        this.$bus.$emit('data/list');
        history.back();
      },
      // 获取页码数据
      dataPage(page, size, total) {
        this.page = page;
        this.size = size;
        this.total = total;
      },
      //  计算表格高度
      tableHeightRun() {
        this.$nextTick(() => {
          this.TableHeightRun();
        });
      },
      ...mapActions([
        'Initialize',
        'TableHeightRun',
        'OrderCreate',
        'ControltradeBtn',
      ]),
    },
    watch: {
      authList() {
        this.authbtn = ShoppingCart.authbtn();
      },
      $route(to, from) {
        if (to.path === '/Order/ShoppingCart/ShopItem') {   // 如果去详情页面计算表格高度
          if (this.View_UserInfo.memberType === 4 || this.View_UserInfo.memberType === 5) {
            this.isSaveShow = false;
            this.isCreateShow = false;
            this.isBackShow = true;
            this.showPlan = false;
            this.showCheck = true;
            this.isTradeShow = true;
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
                path: '/Order/ShoppingCart',
                name: '订单购物车',
              },
              {
                path: '/ShopItem',
                name: '订单购物车查看',
                noLink: true,
              },
            ]);
          } else {
            this.isCreateShow = true;
            this.isSaveShow = true;
            this.isBackShow = false;
            this.showPlan = false;
            this.showCheck = true;
            this.isTradeShow = true;
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
                path: '/Order/ShoppingCart',
                name: '订单购物车',
                noLink: true,
              },
            ]);
          }
          this.Initialize(); // 初始化数据
          this.$nextTick(() => {
            this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
          });
        }
        if (to.path === '/Order/ShoppingCart') {   // 如果去初始页面计算表格高度
          if (this.View_UserInfo.memberType !== 4 && this.View_UserInfo.memberType !== 5) {
            this.isCreateShow = true;
            this.isSaveShow = true;
            this.isBackShow = false;
            this.showPlan = false;
            this.showCheck = true;
            this.isTradeShow = true;
            this.$router.push({ path: '/Order/ShoppingCart/ShopItem' });
            return;
          }
          this.$store.commit('BreadCrumb_Update', [
            {
              path: '/index',
              name: this.$store.state.view.resourcesNow.name,
            },
            {
              path: '/Order',
              name: '订单管理',
            },
            {
              path: '/ShoppingCart',
              name: '订单购物车',
              noLink: true,
            },
          ]);
          this.showPlan = true;
          this.showCheck = false;
          this.$nextTick(() => {
            this.TableHeightRun();
          });
          this.isTradeShow = true;
        }
      },
    },
    mounted() {
      if (this.View_UserInfo.memberType === 4 || this.View_UserInfo.memberType === 5) {
        this.$router.push({ path: '/Order/ShoppingCart' });
        this.$nextTick(() => {
          this.TableHeightRun();
        });
      } else {
        this.showPlan = false;
        this.showCheck = true;
        this.isSaveShow = true;
        this.isBackShow = false;
        this.isCreateShow = true;
        const tradeBtn = {
          orderCreat: false,
          orderDelete: true,
          orderCplan: true,
          orderLplan: false,
        };
        this.ControltradeBtn(tradeBtn);
        this.$router.push({ path: '/Order/ShoppingCart/ShopItem' });
        this.$nextTick(() => {
          this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
        });
      }
      window.onresize = () => {
        if (this.$route.path === '/Order/ShoppingCart') {
          this.TableHeightRun();
        } else if (this.$route.path === '/Order/ShoppingCart/ShopItem') {
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
        },
        {
          path: '/ShoppingCart',
          name: '订单购物车',
          noLink: true,
        },
      ]);
    },
    activated() {
      this.authbtn = ShoppingCart.authbtn();
      this.$bus.$on('table/height', this.tableHeightRun);  //  监听查询按钮的查看更多点击事件，重新计算表格高度
    },
    deactivated() {
      this.$bus.$off('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    },
    data() {
      return {
        showPlan: true,
        showCheck: false,
        loading: false,
        page: 1,              // 当前页数
        size: 20,             // 一页显示多少列
        total: 0,             // 一共多少页
        isTradeShow: true,    // 底部按钮
        isSaveShow: true,     // 保存按钮
        isBackShow: true,     // 返回按钮
        isDeleteShow: true,   // 删除按钮
        isCreateShow: false,  // 保存并生成订单按钮
        authbtn: {},
        ShowBtn: {            // 按钮显示控制
          destory: false,
          create: false,
          pwnolock: false,
          onDrugs: false,
          offDrugs: false,
          exportData: false,
          importData: false,
          saveChange: false,
        },
        message: [
          {
            key: 'hospitalMemberName',
            label: '医疗机构',
            placeholder: '请输入名称',
            hasOp: false,
            type: 0,
            selects: [],
          },
        ],
      };
    },
  };
</script>


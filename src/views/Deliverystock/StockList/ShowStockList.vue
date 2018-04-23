<template>
  <div>
    <div v-loading="loading">
      <el-form :rules="editMessage.rules" label-width="120px" id="from-item">
        <TradeEditsFormI :from-edit="totalForm" ref="changeBtnStatus" :isCreatShow="middleBtnShow.isCreatShow" :isDeleteItem="middleBtnShow.isDeleteItem" :tradeEditBtn="tradeEditBtn" :message="editMessage" :isGoBackShow="false" :isExportShow="middleBtnShow.isExportShow" :isImportShow="middleBtnShow.isImportShow" :arrow-num=2 :arrow-down="true" @show-more="tableHeightRun"></TradeEditsFormI>
      </el-form>
      <div>
        <el-table :data="totalForm.stockItemFormList" stripe border fit :height="tableHeight">
          <el-table-column
            prop="num"
            align="left"
            fixed="left"
            label="#"
            width="40">
          </el-table-column>
          <el-table-column prop="drugsCode" min-width="80" label="药品编码" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="drugsName" min-width="80" label="通用名" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="formName" min-width="80" label="剂型" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="specName" min-width="80" label="规格" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="packSpecName" min-width="80" label="包装规格" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="batchNo" min-width="80" label="批号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="unitName" min-width="80" label="单位" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="stockNum" min-width="80" label="库存数量" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="producerName" min-width="90" label="生产企业" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="approvalNumber" min-width="80" label="批准文号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="makeDate" min-width="140" label="生产日期" sortable show-overflow-tooltip>
            <template scope="scope">
              <span>{{convertDate(scope.row.makeDate)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="validDate" min-width="140" label="有效日期" sortable show-overflow-tooltip>
            <template scope="scope">
              <span>{{convertDate(scope.row.validDate)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="salerMemberName" min-width="110" label="卖方会员" sortable show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div style="float: left;padding-right: 15px;padding-left: 63%"><span>总数量：</span>{{totalForm.totalNum}}</div>
        </div>
      </div>
    </div>
    <TradeFooterI :authbtn="authbtn" :btnDisabled="btnDisabled" :isSaveShow="isSaveShow" :isDeleteShow="isDeleteShow" :isSubmitShow="isSubmitShow" :isBackShow="isBackShow" @order-back="orderBack"></TradeFooterI>
  </div>
</template>

<script>
  /**
   * Created by lqy on 2017/9/19.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */
  import { mapActions, mapGetters } from 'vuex';
  import convert from '../../../utils/convert';
  import TradeEditsFormI from '../../../components/TradeEditsFormI'; //  引订单目录表单
  import TradeFooterI from '../../../components/TradeFooterI'; // 引入订单底部
  import common from '../../../api/common';   // api -- project[集采项目]
  import StockList from '../../../api/Deliverystock/StockList';   // 配送单列表接口

  export default {
    activated() {
      if (!this.status) {
        this.$router.push({ path: '/Deliverystock/StockList' });
      }
      this.init();
      this.$store.commit('BreadCrumb_Update', [
        {
          path: '/index',
          name: this.$store.state.view.resourcesNow.name,
        },
        {
          path: '/Deliverystock',
          name: '配送企业库存管理',
          noLink: true,
        },
        {
          path: '/Deliverystock/StockList',
          name: '库存列表',
          noLink: false,
        },
        {
          path: '/Deliverystock/StockList/ShowStockList',
          name: '库存查看',
          noLink: true,
        },
      ]);
    },
    watch: {
      $route(to, from) {
        // console.log();
        // console.log();
      },
      getGpoId() {
        // 当切换gpo时，重定向到列表页
        this.$router.push({ path: '/Deliverystock/StockList' });
      },
    },
    created() {
      this.tableHeightRun();
      window.onresize = () => {
        this.tableHeightRun();
      };
    },
    computed: mapGetters([
      'getGpoId',
      'status',
    ]),
    components: {
      TradeEditsFormI,
      TradeFooterI,
    },
    data() {
      return {
        // 中间的按钮显示隐藏
        middleBtnShow: {
          isCreatShow: true,
          isDeleteItem: true,
          isExportShow: true,
          isImportShow: true,
        },
        tableHeight: 280,
        // 底部按钮显示隐藏
        isSaveShow: true, // 保存按钮
        isBackShow: true, // 返回按钮
        isDeleteShow: false, // 删除按钮
        isSubmitShow: true,  // 提交按钮
        num: 4, // 总数量
        // 表头获取
        topbarForm: {
          id: null,
          gpoMemberId: null,
          salerMemberId: null,
        },
        // 默认的按钮样式  --  中间的按钮
        tradeEditBtn: {
          createBtn: true,    // 新增
          deleteBtn: true,    // 删除
          exportBtn: true,    // 导出
          importBtn: true,    // 导入
        },
        // 底部按钮状态
        btnDisabled: {
          planSave: true,
          planSubmit: true,
          planDelete: true,
        },
        // 权限控制
        authbtn: {
          create: true,
        },
        // 上部分表单字段
        editMessage: {
          tabTitle: '',
          selects: [
            { label: '库存单状态', key: 'status', type: 'el-input', isReadonly: true, span: 5 },
            { label: '库存日期', key: 'stockDate', type: 'el-input', isReadonly: true, span: 5 },
            { label: '库存单编号', key: 'code', type: 'el-input', isReadonly: true, span: 5 },
            { label: '创建人', key: 'stockAll', type: 'el-input', isReadonly: true, span: 5 },
            { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', isReadonly: true, span: 5 },
            { label: '联系人', key: 'deliveryAll', type: 'el-input', isReadonly: true, span: 5 },
            { label: '备注', key: 'remarks', type: 'el-input', fromType: 'textarea', isReadonly: true, span: 5, rows: 1 },
          ],
          styleObject: {
            style1: {
              width: '66%',
            },
          },
          parameters: {},
          options: {},
          radios: {},
          rules: {},
        },
        loading: false,
        // 需要提交的全部数据
        totalForm: {
          totalNum: 0,
          id: null,                                                                 // Id
          code: null,
          gpoMemberId: null,                                                        // GPOID
          gpoMemberName: null,                                                      // GPO名称
          stockDate: null,
          deliveryMemberId: null,
          deliveryMemberName: null,
          deliveryMemberCode: null,
          deliveryPerson: null,
          deliveryPhone: null,
          createBy: null,
          createTime: null,
          stockItemFormList: [],                                         // 药品列表
          remarks: null,                                                            // 备注
          status: null,                                                             // 状态
        },
      };
    },
    methods: {
      // 初始化
      init() {
        // 初始化清空数据
        this.emptyData();
        // 获取已选药品列表
        this.getSelectedDrugs();
        // 获取表头信息
        if (this.getGpoId) {
          this.getTopbarItem();
        }
        this.loading = true;
        this.middleBtnShow = {
          isCreatShow: false,
          isDeleteItem: false,
          isExportShow: false,
          isImportShow: false,
        };
        this.isSaveShow = false;   // 保存按钮
        this.isBackShow = true;   // 返回按钮
        this.isDeleteShow = false; // 删除按钮
        this.isSubmitShow = false;  // 提交按钮
      },
      // 获取头部信息
      getTopbarItem() {
        this.topbarForm.id = this.$route.query.id;
        StockList.item(this.topbarForm).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            let deliveryPerson = null;
            let deliveryPhone = null;
            let createBy = null;
            let createTime = null;
            if (data.deliveryPerson === null || data.deliveryPerson === 'null') {
              deliveryPerson = '';
            } else {
              deliveryPerson = data.deliveryPerson;
            }
            if (data.deliveryPhone === null || data.deliveryPhone === 'null') {
              deliveryPhone = '';
            } else {
              deliveryPhone = data.deliveryPhone;
            }
            if (data.createBy === null || data.createBy === 'null') {
              createBy = '';
            } else {
              createBy = data.createBy;
            }
            if (data.createTime === null || data.createTime === 'null') {
              createTime = '';
            } else {
              createTime = data.createTime;
            }
            this.totalForm.deliveryAll = `${deliveryPerson} ${deliveryPhone}`;
            this.totalForm.stockAll = `${createBy} ${createTime}`;
            this.totalForm.id = data.id;
            this.totalForm.code = data.code;
            this.totalForm.gpoMemberId = data.gpoMemberId;
            this.totalForm.gpoMemberName = data.gpoMemberName;
            this.totalForm.stockDate = this.convertDate(data.stockDate);
            this.totalForm.deliveryMemberId = data.deliveryMemberId;
            this.totalForm.deliveryMemberName = data.deliveryMemberName;
            this.totalForm.deliveryMemberCode = data.deliveryMemberCode;
            this.totalForm.deliveryPerson = data.deliveryPerson;
            this.totalForm.deliveryPhone = data.deliveryPhone;
            this.totalForm.createBy = data.createBy;
            this.totalForm.createTime = data.createTime;
            this.totalForm.status = '已提交';
            this.totalForm.remarks = data.remarks;
            this.loading = false;
          }
        });
      },
      // 获取已选药品列表
      getSelectedDrugs() {
        const stockId = Number(this.$route.query.id);
        StockList.itemAll(stockId).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.totalForm.stockItemFormList = data;
            for (let i = 0; i < data.length; i += 1) {
              this.totalForm.totalNum += data[i].stockNum;
              this.totalForm.stockItemFormList[i].num = i + 1;
            }
            this.loading = false;
          }
        });
      },
      // 返回上一页
      orderBack() { // 返回按钮触发事件
        history.back();
      },
      //  计算表格高度
      tableHeightRun() {
        const tableHeightFun = () => {
          this.tableHeight = window.tableCustom.tableHeight(['#from-item', '.TradeFooter', 200]);
        };
        setTimeout(tableHeightFun, 0);
      },
      // 清空数据
      emptyData() {
        this.totalForm = {
          // top
          code: null,
          createBy: null,
          createTime: null,
          contacter: null,
          contactPhone: null,
          drugsArr: [],
          totalNum: 0,
          // .. 需要提交的数据
          amount: 0,                                                             // 金额
          deliveryMemberCode: null,                                                 // 配送企业会员编码
          deliveryMemberId: null,                                                   // 配送企业会员Id
          deliveryMemberName: null,                                                 // 配送企业会员名称
          deliveryPerson: null,                                                     // 配送联系人
          deliveryPhone: null,                                                      // 配送联系电话
          stockItemFormList: [],                                    // 药品列表
          gpoMemberId: null,                                                        // GPOID
          gpoMemberName: null,                                                      // GPO名称
          id: null,                                                                 // Id
          projectId: null,                                                          // 集采项目ID
          receiveAddress: null,                                                     // 收货地址
          remarks: null,                                                            // 备注
          salerMemberCode: null,                                                    // 卖方会员编码
          salerMemberId: null,                                                      // 卖方会员ID
          salerMemberName: null,                                                    // 卖方会员名称
          status: null,                                                             // 状态
          deliveryAll: null,
          stockAll: null,
        };
      },
      // 转换日期 YYYY-MM-DD
      convertDate(str) {
        return convert.convertDate(str);
      },
    },
  };
</script>

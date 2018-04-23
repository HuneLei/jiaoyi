<template>
  <div>
    <div v-loading="loading">
      <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
        <TradeEditsFormI :from-edit="totalForm" ref="changeBtnStatus" :isCreatShow="middleBtnShow.isCreatShow" :isDeleteItem="middleBtnShow.isDeleteItem" :tradeEditBtn="tradeEditBtn" :message="editMessage" :isGoBackShow="false" :isExportShow="middleBtnShow.isExportShow" :isImportShow="middleBtnShow.isImportShow" :arrow-num=2 :arrow-down="true" @show-more="tableHeightRun">
          <!--<el-form-item label="发票扫描件" slot="orderFile">-->
            <!--<y-upload-edit :fileList="uploadData" @upload-result="uploadResult"></y-upload-edit>-->
          <!--</el-form-item>-->
        </TradeEditsFormI>
      </el-form>
      <div>
        <el-table :data="totalForm.gpoPurchaseDrugsItemFormList" stripe border fit :height="tableHeight">
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
          <el-table-column prop="batchNo" min-width="80" label="批号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="formName" min-width="80" label="剂型" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="specificationName" min-width="80" label="规格" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="packSpecName" min-width="80" label="包装规格" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="unitName" min-width="80" label="单位" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="gpoPrice" min-width="70" align="right" label="单价" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="stockinNum" min-width="50" align="right" label="数量" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="amount" min-width="70" align="right" label="金额" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="producerName" min-width="90" label="生产企业" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="salerMemberName" min-width="90" label="卖方会员" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="approvalNumber" min-width="80" label="批准文号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="itemNo" min-width="110" label="采购单明细编号" sortable show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div style="float: left;padding-right: 15px;padding-left: 63%"><span>总数量：</span>{{totalForm.totalNum}}</div>
          <div style="float: left;"><span>总金额：</span>{{totalForm.amount}}<span>元</span></div>
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
  import TradeEditsFormI from '../../../components/TradeEditsFormI'; //  引订单目录表单
  import TradeFooterI from '../../../components/TradeFooterI'; // 引入订单底部
  import common from '../../../api/common';   // api -- project[集采项目]
  import GpoStockinList from '../../../api/Gpopurchase/GpoStockinList';   // 配送单列表接口

  export default {
    activated() {
      if (!this.status) {
        this.$router.push({ path: '/Gpopurchase/GpoStockinList' });
      }
      this.init();
      this.$store.commit('BreadCrumb_Update', [
        {
          path: '/index',
          name: this.$store.state.view.resourcesNow.name,
        },
        {
          path: '/Gpopurchase',
          name: 'GPO采购管理',
          noLink: true,
        },
        {
          path: '/Gpopurchase/GpoPurchaseList',
          name: 'GPO入库单列表',
          noLink: true,
        },
        {
          path: '/Gpopurchase/GpoPurchaseList/ShowGPO',
          name: 'GPO入库单查看',
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
        this.$router.push({ path: '/Gpopurchase/GpoStockinList' });
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
        // uploadData: [], //  上传文件
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
            { label: '入库单编号', key: 'stockinCode', type: 'el-input', isReadonly: true, span: 5 },
            { label: '创建人', key: 'createAll', type: 'el-input', isReadonly: true, span: 5 },
            { label: 'GPO名称', key: 'gpoMemberName', type: 'el-input', isReadonly: true, span: 5 },
            { label: '联系人', key: 'gpoAll', type: 'el-input', isReadonly: true, span: 5 },
            { label: '卖方会员', key: 'salerMemberId', type: 'el-input', isReadonly: true, span: 5 },
            { label: '联系人', key: 'salerAll', type: 'el-input', isReadonly: true, span: 5 },
            { label: '收货地址', key: 'addressFull', type: 'el-input', isReadonly: true, span: 5 },
            { label: '备注', key: 'remarks', type: 'el-input', fromType: 'textarea', isReadonly: true, span: 5, rows: 1, placeholder: '' },
            // { value: 'orderFile', type: 'custom', span: 10 },
          ],
          styleObject: {
            style1: {
              width: '66%',
            },
          },
          parameters: {},
          options: {
            salerOptions: [],
          },
          radios: {},
          rules: {},
        },
        loading: false,
        // 需要提交的全部数据
        totalForm: {
          // orderFile: [],
          // top
          code: null,
          createTime: null,
          totalNum: 0,
          contacter: null,
          contactPhone: null,
          // .. 需要提交的数据
          amount: 0,                                                                // 金额
          // amount1: 0,                                                                // 金额
          gpoMemberId: null,                                                        // GPOID
          gpoMemberName: null,                                                      // GPO名称
          gpoPerson: null,                                                          // GPO名称
          gpoPhone: null,                                                           // GPO名称
          gpoPurchaseDrugsItemFormList: [],                                         // 药品列表
          id: null,                                                                 // Id
          receiveAddress: null,                                                     // 收货地址
          remarks: null,                                                            // 备注
          salerMemberCode: null,                                                    // 卖方会员编码
          salerMemberId: null,                                                      // 卖方会员ID
          salerMemberName: null,                                                    // 卖方会员名称
          status: null,                                                             // 状态
          gpoContacter: null,
          salerContacter: null,
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
      // 上传
//      uploadResult(res1) {
//        this.totalForm.orderFile = res1;
//        this.uploadData = this.convert.getJSON(this.totalForm.orderFile);
//        GpoStockinList.update(this.$route.query.id, this.totalForm.orderFile).then((res) => {
//          if (res.data.code === 0) {
//            // console.log();
//          }
//        });
//        this.tableHeightRun();
//      },
      // 获取头部信息
      getTopbarItem() {
        this.topbarForm.stockinCode = this.$route.query.code;
        this.topbarForm.gpoMemberId = this.getGpoId;
        GpoStockinList.listItem(this.topbarForm).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            let createBy = '';
            let createTime = '';
            let gContacter = '';
            let gContactPhone = '';
            let eContacter = '';
            let eContactPhone = '';
            if (data[0]) {
              if (data[0].createBy === null || data[0].createBy === 'null') {
                createBy = '';
              } else {
                createBy = data[0].createBy;
              }
              if (data[0].createTime === null || data[0].createTime === 'null') {
                createTime = '';
              } else {
                createTime = data[0].createTime;
              }
              if (data[0].gContacter === null || data[0].gContacter === 'null') {
                gContacter = '';
              } else {
                gContacter = data[0].gContacter;
              }
              if (data[0].gContactPhone === null || data[0].gContactPhone === null) {
                gContactPhone = '';
              } else {
                gContactPhone = data[0].gContactPhone;
              }
              if (data[0].eContacter === null || data[0].eContacter === null) {
                eContacter = '';
              } else {
                eContacter = data[0].eContacter;
              }
              if (data[0].eContactPhone === null || data[0].eContactPhone === null) {
                eContactPhone = '';
              } else {
                eContactPhone = data[0].eContactPhone;
              }
              this.totalForm.gpoMemberName = data[0].gpoMemberName;
              this.totalForm.salerMemberId = data[0].salerMemberName;
              this.totalForm.stockinCode = data[0].stockinCode;
              this.totalForm.remarks = data[0].remarks; // 1
              this.totalForm.createAll = `${createBy} ${createTime}`;
              this.totalForm.gpoAll = `${gContacter} ${gContactPhone}`;
              this.totalForm.salerAll = `${eContacter} ${eContactPhone}`;
            }
            // console.log();
            this.tableHeightRun();
          }
        });
      },
      // 获取已选药品列表
      getSelectedDrugs() {
        const obj = {
          stockinCode: Number(this.$route.query.code),
          gpoMemberId: this.getGpoId,
        };
        GpoStockinList.drugsList(obj).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            // console.log();
            this.totalForm.gpoPurchaseDrugsItemFormList = data;
            for (let i = 0; i < data.length; i += 1) {
              this.totalForm.amount +=
                Number(data[i].amount);
              this.totalForm.totalNum += Number(data[i].stockinNum);
              this.totalForm.gpoPurchaseDrugsItemFormList[i].num = i + 1;
            }
            this.totalForm.amount = this.totalForm.amount.toFixed(2);
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
          orderFile: null,
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
          gpoPurchaseDrugsItemFormList: [],                                    // 药品列表
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
          gpoContacter: null,
        };
      },
    },
  };
</script>

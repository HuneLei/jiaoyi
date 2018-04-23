<template>
  <div>
    <div v-loading="loading">
      <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
        <TradeEditsFormI :authbtn="authbtn" :from-edit="totalForm" ref="changeBtnStatus" :isCreatShow="middleBtnShow.isCreatShow" :isDeleteItem="middleBtnShow.isDeleteItem" :tradeEditBtn="tradeEditBtn" :message="editMessage" :isGoBackShow="false" :isExportShow="middleBtnShow.isExportShow" :isImportShow="middleBtnShow.isImportShow" :arrow-num=2 :arrow-down="true" @show-more="tableHeightRun">
          <el-form-item label="联系人"  prop="gpoContacter" slot='gpoContacter'>
            <el-input v-model="totalForm.gpoContacter" readonly disabled size="small" style="width: 100%; min-width: 120px;"></el-input>
          </el-form-item>
          <el-form-item label="联系人"  prop="salerContacter" slot='salerContacter'>
            <el-input v-model="totalForm.salerContacter" readonly disabled size="small" style="width: 100%; min-width: 120px;"></el-input>
          </el-form-item>
          <el-form-item label="收货地址"  prop="receiveAddress" slot='receiveAddress' style="width: 100%">
            <el-input v-model="totalForm.receiveAddress" readonly disabled size="small"></el-input>
          </el-form-item>
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
          <el-table-column prop="purchaseNum" min-width="50" align="right" label="数量" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="purchaseAmount" min-width="70" align="right" label="金额" sortable show-overflow-tooltip>
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
          <div style="float: left;"><span>总金额：</span>{{totalForm.amount.toFixed(2)}}<span>元</span></div>
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
  import GpoPurchaseList from '../../../api/Gpopurchase/GpoPurchaseList';   // 配送单列表接口

  export default {
    activated() {
      this.authbtn = GpoPurchaseList.authbtn();
      if (!this.status) {
        this.$router.push({ path: '/Gpopurchase/GpoPurchaseList' });
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
          name: 'GPO采购单列表',
          noLink: true,
        },
        {
          path: '/Gpopurchase/GpoPurchaseList/ShowGPO',
          name: 'GPO采购单查看',
          noLink: true,
        },
      ]);
    },
    watch: {
      authList() {
        this.authbtn = GpoPurchaseList.authbtn();
      },
      getGpoId() {
        // 当切换gpo时，重定向到列表页
        this.$router.push({ path: '/Gpopurchase/GpoPurchaseList' });
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
        authbtn: {},              //  识别用户拥有的权限
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
        // 上部分表单字段
        editMessage: {
          tabTitle: '',
          selects: [
            { label: 'GPO采购单编号', key: 'code', type: 'el-input', isReadonly: true, span: 5 },
            { label: '创建时间', key: 'createTime', type: 'el-input', isReadonly: true, span: 5 },
            { label: 'GPO名称', key: 'gpoMemberName', type: 'el-input', isReadonly: true, span: 5 },
            { value: 'gpoContacter', type: 'custom', span: 5 },
            { label: '卖方会员', key: 'salerMemberId', type: 'el-input', isReadonly: true, span: 5 },
            { value: 'salerContacter', type: 'custom', span: 5 },
            { label: '备注', key: 'remarks', type: 'el-input', fromType: 'textarea', isReadonly: true, span: 5, rows: 1, placeholder: '' },
            { value: 'receiveAddress', type: 'custom', span: 15 },
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
      // 获取头部信息
      getTopbarItem() {
        this.topbarForm.id = this.$route.query.id;
        this.topbarForm.gpoMemberId = this.getGpoId;
        this.topbarForm.salerMemberId = this.$route.query.sid;
        GpoPurchaseList.listItem(this.topbarForm).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            let gpoPerson = '';
            let gpoPhone = '';
            let contacter = '';
            let contactPhone = '';
            if (data[0]) {
              if (data[0].gpoPerson === null || data[0].gpoPerson === 'null') {
                gpoPerson = '';
              } else {
                gpoPerson = data[0].gpoPerson;
              }
              if (data[0].gpoPhone === null || data[0].gpoPhone === 'null') {
                gpoPhone = '';
              } else {
                gpoPhone = data[0].gpoPhone;
              }
              if (data[0].contacter === null || data[0].contacter === 'null') {
                contacter = '';
              } else {
                contacter = data[0].contacter;
              }
              if (data[0].contactPhone === null ||
                data[0].contactPhone === 'null') {
                contactPhone = '';
              } else {
                contactPhone = data[0].contactPhone;
              }
              this.totalForm.gpoContacter = `${gpoPerson} ${gpoPhone}`;   // GOP联系人联系方式
              this.totalForm.salerContacter = `${contacter} ${contactPhone}`;   // 卖方会员联系人联系方式
              this.totalForm.gpoMemberId = data[0].gpoMemberId;
              this.totalForm.gpoMemberName = data[0].gpoMemberName;
              this.totalForm.gpoPerson = data[0].gpoPerson;
              this.totalForm.gpoPhone = data[0].gpoPhone;
              this.totalForm.gpoPhone = data[0].gpoPhone;
              this.totalForm.code = data[0].code;
              this.totalForm.createTime = data[0].createTime;
              this.totalForm.salerMemberId = data[0].salerMemberName;
              this.totalForm.contacter = data[0].contacter;
              this.totalForm.contactPhone = data[0].contactPhone;
              this.totalForm.receiveAddress = data[0].receiveAddress;
              this.totalForm.remarks = data[0].remarks;
            }
            // console.log();
          }
        });
      },
      // 获取已选药品列表
      getSelectedDrugs() {
        const obj = {
          purchaseId: Number(this.$route.query.id),
          gpoMemberId: this.getGpoId,
        };
        GpoPurchaseList.drugsList(obj).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            // console.log();
            this.totalForm.gpoPurchaseDrugsItemFormList = data;
            for (let i = 0; i < data.length; i += 1) {
              this.totalForm.amount +=
                Number(data[i].purchaseAmount);
              this.totalForm.totalNum += data[i].purchaseNum;
              this.totalForm.gpoPurchaseDrugsItemFormList[i].num = i + 1;
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

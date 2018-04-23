<template>
  <div>
    <el-form :rules="editMessage.rules" label-width="120px" id="from-item">
      <TradeEditsFormI :from-edit="fromEdit" ref="changeBtnStatus" :isCreatShow="true" :isDeleteItem="true" :tradeEditBtn="tradeEditBtn" :message="editMessage" :isGoBackShow="false" :isExportShow="true" :isImportShow="true" :arrow-num=2 :arrow-down="true" @data-creat="dataCreat" @delete-item="deleteItem" @show-more="tableHeightRun">
        <el-form-item label="集采项目"  prop="projectName" slot='projectName'>
          <el-select v-model="fromEdit.projectName" placeholder="请选择" size="small" @change="changeProject">
            <el-option
              v-for="item in editMessage.options.projectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收货地址"  prop="receiveAddress" slot='receiveAddress'>
          <el-input v-model="fromEdit.projectName" readonly placeholder="请选择医疗机构名称" @focus="showAddressDialog()" icon="search" size="small"></el-input>
        </el-form-item>
      </TradeEditsFormI>
    </el-form>
    <div>
      <el-table :data="tableData" v-loading="loading" @selection-change="dataSelect" stripe border fit :height="tableHeight">
        <el-table-column type="selection" width="40" fixed="left" align="center">
        </el-table-column>
        <el-table-column prop="num" label="#" width="40" sortable></el-table-column>
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
        <el-table-column prop="hospitalUnitPrice" min-width="80" label="数量" sortable show-overflow-tooltip>
          <template scope="scope">
            <el-input
              style="width: 98%"
              slot="reference"
              size="small"
              placeholder="请输入内容"
              @change="creatChange(scope.row.purchaseNum)"
              v-model="scope.row.purchaseNum">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryMemberName" min-width="100" label="单价" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="producerName" min-width="100" label="金额" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tradeName" min-width="90" label="生产企业" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" min-width="80" label="商品名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" min-width="80" label="批准文号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" min-width="110" label="采购单明细编号" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <div style="float: left;padding-right: 15px;padding-left: 63%"><i>总数量：</i><span>{{Order_purchaseNum}}</span></div>
        <div style="float: left;padding-right: 15px;padding-left: 63%"><i>总金额：</i><span>{{Order_purchaseNum}}</span></div>
      </div>
    </div>
    <TradeFooterI :authbtn="authbtn" :btnDisabled="btnDisabled" :isSaveShow="isSaveShow" :isDeleteShow="isDeleteShow" :isSubmitShow="isSubmitShow" :isBackShow="isBackShow" @data-submit="submit" @order-save="orderSave" @order-delete="orderDelete" @order-back="orderBack"></TradeFooterI>
    <EditDialog :options="dialogOptions" @dialog-hide="dialogHide"></EditDialog>
    <AdressDialog :options="adressDialogOptions" @dialog-hide="adressDialogHide"></AdressDialog>
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
  import TradeEditsFormI from '../../../components/TradeEditsFormI'; //  引订单目录表单
  import TradeFooterI from '../../../components/TradeFooterI'; // 引入订单底部
  import EditDialog from './EditDialog';                     // 引入明细弹出窗
  import AdressDialog from './AdressDialog';                 // 引入收货地址弹出窗
  import Project from '../../../api/BasicInfo/Project';   // api -- project[集采项目]
  import DeliverypurchaseListect from '../../../api/Deliverypurchase/DeliverypurchaseList';   // 配送单列表接口

  export default {
    activated() {
      this.tradeEditBtn = {
        createBtn: true,        // 新增
        deleteBtn: true,        // 删除
        exportBtn: true,        // 导出
        importBtn: true,        // 导入
      };
      this.btnDisabled = {
        planSave: true,
        planSubmit: true,
        planDelete: true,
      };
      // 编辑页的类型   1、已提交[只读]  0、待提交[可编辑]
      const type = this.$route.query.type;
      let editName = '';                // 详情页面包屑名字
      switch (type) {
        case 'create':
          this.createFunc();
          editName = '采购单新增';
          break;
        case 'edit':
          this.editFunc();
          editName = '采购单编辑';
          break;
        case 'show':
          this.showFunc();
          editName = '采购单详情';
          break;
        default:
          break;
      }
      this.$store.commit('BreadCrumb_Update', [
        {
          path: '/index',
          name: this.$store.state.view.resourcesNow.name,
        },
        {
          path: '/Deliverypurchase',
          name: '配送企业采购管理',
        },
        {
          path: '/Deliverypurchase/GpoPurchaseList',
          name: '采购单列表',
          noLink: false,
        },
        {
          path: '/Deliverypurchase/GpoPurchaseList/Edit',
          name: editName,
          noLink: true,
        },
      ]);
      if (this.getGpoId) {
        //  获取集采项目下拉
        this.getProjectAll(this.getGpoId);
      }
      // 获取表头
      this.topbarForm = {
        id: null,
        projectId: null,
        gpoMemberId: null,
        memberId: null,
      };
      // this.getTopbarItem();
    },
    watch: {
      getGpoId() {
        //  获取集采项目下拉
        this.getProjectAll(this.getGpoId);
      },
    },
    created() {
      this.tableHeightRun();
      window.onresize = () => {
        this.tableHeightRun();
      };
    },
    computed: mapGetters([
      'Order_purchaseNum',
      'getGpoId',
      'View_UserInfo',
    ]),
    components: {
      EditDialog,
      TradeEditsFormI,
      TradeFooterI,
      AdressDialog,
    },
    data() {
      return {
        tableHeight: 280,
        // 底部按钮显示隐藏
        isSaveShow: true, // 保存按钮
        isBackShow: true, // 返回按钮
        isDeleteShow: true, // 删除按钮
        isSubmitShow: true,  // 提交按钮
        num: 4, // 总数量
        // 新增明细传值
        dialogOptions: {
          msgBase: '', //  没什么卵用，有需要可以看看
          isShowDialog: false, //  显示弹框
          tableSelected: null, //  默认表格选中
          tableType: 1, //  0 单选，1 多选 默认单选
        },
        // 表头获取
        topbarForm: {
          id: null,
          projectId: null,
          gpoMemberId: null,
          memberId: null,
        },
        // 地址传值
        adressDialogOptions: {
          msgBase: '', //  没什么卵用，有需要可以看看
          isShowDialog: false, //  显示弹框
          tableSelected: null, //  默认表格选中
          tableType: 1, //  0 单选，1 多选 默认单选
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
        fromEdit: {
          projectName: null,
          code: null,
          createBy: null,
          createTime: null,
          deliveryMemberName: null,
          deliveryContacter: null,
          deliveryContactPhone: null,
          gpoMemberName: null,
          gpoContacter: null,
          gpoContactPhone: null,
          receiveAddress: null,
          remark: '备注',
          drugsArr: [],
        },
        isCreateShow: true,
        // 上部分表单字段
        editMessage: {
          tabTitle: '',
          selects: [
            { value: 'projectName', type: 'custom', noClearable: true, span: 24 },
            { label: '采购单编号', key: 'code', type: 'el-input', isReadonly: true, span: 6 },
            { label: '创建人', key: 'createBy', type: 'el-input', isReadonly: true, span: 6 },
            { label: '创建时间', key: 'createTime', type: 'el-input', isReadonly: true, span: 12 },
            { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', isReadonly: true, span: 6 },
            { label: '联系人', key: 'deliveryContacter', type: 'el-input', isReadonly: true, span: 6 },
            { label: '联系电话', key: 'deliveryContactPhone', type: 'el-input', isReadonly: true, span: 12 },
            { label: 'GPO名称', key: 'gpoMemberName', type: 'el-input', isReadonly: true, span: 6 },
            { label: '联系人', key: 'gpoContacter', type: 'el-input', isReadonly: true, span: 6 },
            { label: '联系电话', key: 'gpoContactPhone', type: 'el-input', isReadonly: true, span: 12 },
            { value: 'receiveAddress', type: 'custom' },
            { label: '备注', key: 'remark', type: 'el-input', fromType: 'textarea', fromStyle: 'style1', span: 24, rows: 2, placeholder: '请输入备注' },
          ],
          styleObject: {
            style1: {
              width: '66%',
            },
          },
          parameters: {},
          options: {
            projectOptions: [],
          },
          radios: {},
          rules: {},
        },
        tableData: [{
          num: 1,
          drugsCode: '12333333',
          drugsName: '123',
          specName: '123',
          packSpecName: '123',
          formName: '123',
          unitName: '123',
          approvalNumber: '123dfsd',
          n: 123,
          purchaseNum: 12,
          purchaseAmount: '123',
          producerName: '123',
          salerMemberName: '123',
          tradeName: '123',
        }],
        loading: false,
        selectData: [],
        filterForm: {
          name: '',
          code: '',
        },
        tableshow: true,
        dialogFormVisible: false,
      };
    },
    methods: {
      createFunc() {
        // console.log();
        // console.log();
        this.isDeleteShow = false;
        this.topbarForm = {
          id: 1,
          projectId: 1,
          gpoMemberId: this.getGpoId,
          memberId: this.View_UserInfo.memberId,
        };
        // 获取表头
        this.getTopbarItem();
      },
      editFunc() {
        // console.log();
        // 获取表头
        this.isDeleteShow = true;
      },
      showFunc() {
        // console.log();
        // 获取表头
        this.isDeleteShow = true;
      },
      // 获取头部信息
      getTopbarItem() {
        // console.log();
        // console.log();
        DeliverypurchaseListect.item(this.topbarForm).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            // console.log();
          }
        });
      },
      // 获取集采项目下拉
      getProjectAll(gpoId) {
        Project.all(gpoId).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            const arr = [];
            for (let i = 0; i < data.length; i += 1) {
              arr.push({
                label: data[i].name,   // 显示
                value: data[i].id,   // id值
              });
            }
            this.editMessage.options.projectOptions = arr;    // 给项目集采名称options赋值
          }
        });
      },
      // 改变集采项目名称
      changeProject() {
        // console.log();
        if (this.fromEdit.projectName !== null) {
          // 父组件触发子组件的改变按钮状态的事件
          this.tradeEditBtn = {
            createBtn: false,        // 新增
            deleteBtn: false,        // 删除
            exportBtn: false,        // 导出
            importBtn: false,        // 导入
          };
          this.btnDisabled = {
            planSave: false,
            planSubmit: false,
            planDelete: false,
          };
        }
      },
      ...mapActions([
        'TradeSelect',
      ]),
      // 添加明细
      dataCreat() {
        this.dialogOptions.isShowDialog = true;
      },
      // 弹出收货地址窗口
      showAddressDialog() {
        this.adressDialogOptions.isShowDialog = true;
      },
      creatChange(data) {  // 数量发生变化的时候触发
        this.CountNum({ Num: this.nowNum, Count: data });
        this.nowNum = data;
      },
      // 删除明细操作
      deleteItem(res) {
        // console.log();
        this.DeleteItem(res);
      },
      // 关闭弹出框  -- 明细
      dialogHide() {
        this.dialogOptions.isShowDialog = false;
      },
      // 关闭弹出框  -- 地址
      adressDialogHide() {
        this.dialogOptions.isShowDialog = false;
      },
      // 数据查询条件获取
      dataSearch(data) {
        this.filterForm = data;
        this.dataList(this.filterForm);
      },
      // 获取数据列表
      dataList() {
        this.loading = false;
      },
      //  选择触发事件，根据审核状态判断右下角btn是否禁用
      dataSelect(row) {
        let booldelete = false;
        let first = 0;
        for (let i = 0; i < row.length; i += 1) {
          const item = row[i];
          first += 1;
        }
        if (first > 0) {
          booldelete = false;
        } else {
          booldelete = true;
        }
        const btn = {
          orderDelete: booldelete,
        };
        this.TradeSelect({ tradeRow: row, tradeBtn: btn });
      },
      orderSave(res) { // 保存按钮触发事件
        // console.log();
        // console.log();
        this.$message({
          type: 'success',
          message: '保存成功',
        });
        history.back();
      },
      // 提交
      submit() {
      },
      orderDelete(res) { // 删除按钮触发事件
        // console.log();
        // console.log();
        this.$message({
          type: 'success',
          message: '删除成功',
        });
        history.back();
      },
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
    },
    // 离开编辑页的提示
//    beforeRouteLeave(to, from, next) {
//      // 导航离开该组件的对应路由时调用
//      // 可以访问组件实例 `this`
//      this.$confirm('编辑页内容未保存，离开将消失, 是否继续?', '提示', {
//        confirmButtonText: '确定',
//        cancelButtonText: '取消',
//        type: 'warning',
//      }).then(() => {
//        next();
//      }).catch(() => {
//      });
//    },
  };
</script>

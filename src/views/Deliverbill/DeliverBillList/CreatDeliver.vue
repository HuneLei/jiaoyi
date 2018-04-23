<template>
  <div v-loading="loading">
    <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
      <TradeEditsForm :from-edit="Order_PlanfromEdit" :message="editMessage" :isGoBackShow="false" :isCreatShow="true" :isDeleteItem="true" :bility-show="false"  :arrow-num=2 :arrow-down="true" @show-more="showMore" :purchase="Order_purchaseAmount" @delete-item="deleteItem" @data-creat="dataCreat">
      </TradeEditsForm>
    </el-form>
    <div>
      <el-table :data="Order_PlanItemList" stripe border fit :height="View_TableHeight" @selection-change="dataSelect">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="num" label="#" width="40" show-overflow-tooltip fixed="left" class-name="table_right_fixed"></el-table-column>
        <el-table-column prop="code" min-width="135" label="订单编号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" min-width="120" label="通用名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="formName" min-width="90" label="剂型" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="specName" min-width="90" label="规格" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packSpecName" min-width="90" label="包装规格" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="unitName" min-width="60" label="单位" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="hospitalUnitPrice" min-width="70" label="单价" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="ordersNum" min-width="80" label="订单数量" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" min-width="90" label="金额" sortable show-overflow-tooltip>
          <template scope="scope">
            <p>{{Number(scope.row.purchaseAmount).toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="producerName" min-width="180" label="生产企业" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="salerMemberName" min-width="180" label="卖方会员" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="itemNo" min-width="160" label="订单明细编号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="contractCode" min-width="120" label="合同编号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="contractItemNo" min-width="135" label="合同明细编号" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总数量：</span>{{Order_purchaseNum}} </div>
      <div style="float: left">
        <span style="">总金额：</span>{{Order_purchaseAmount.toFixed(2)}} <span>元</span>
      </div>
    </div>
    <DeliveryTable></DeliveryTable>
    <NotDeliveryTable></NotDeliveryTable>
    <PurchaseDeliveryTable :options="dialogOptions" @dialog-hide="dialogHide"></PurchaseDeliveryTable>
    <InvoiceNumberTable :options="InvoiceOptions" @dialog-hide="InvoiceHide"></InvoiceNumberTable>
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
  import application from '../../../api/BasicInfo/Project';
  import TradeEditsForm from '../../../components/TradeEditsForm';          //  引订单目录表单
  import StepsFrom from '../../../components/StepsFrom';                    // 引入加载条组件
  import DeliverBillList from '../../../api/Deliverbill/DeliverBillList';   // 订单(配送企业api)
  import convert from '../../../utils/convert';                             // 引入js公共方法
  import DeliveryTable from './DeliveryTable';                              // 货票同行弹出框
  import NotDeliveryTable from './NotDeliveryTable';                        // 货票同行弹出框
  import ShoppingCart from '../../../api/Order/ShoppingCart';               // 引入订单购物车api
  import PurchaseDeliveryTable from './PurchaseDeliveryTable';              // 引订单目录表单
  import InvoiceNumberTable from './InvoiceNumberTable';                    // 引入发票明细弹出框

  export default {
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.hospitallist();
      });
    },
    watch: {
      hospitalMemberName(newinfo, oldinfo) {
        if (this.$route.path === '/Deliverbill/DeliverBillList/CreatDeliver') {
          if (this.Order_PlanItemList.length) {
            if (this.changInfo) {
              this.changInfo = 0;
              return;
            }
            this.changInfo += 1;
            this.Order_PlanfromEdit.deliveryMemberName = oldinfo;
            this.$confirm('此操作将清空明细，是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              const tradeBtn = {
                orderCreat: !newinfo,
                orderDelete: true,
              };
              const btnDisabled = {
                planNotDelivery: newinfo,
                planDelivery: newinfo,
              };
              this.$bus.$emit('data/tradefoot', btnDisabled);
              this.ControltradeBtn(tradeBtn);
              this.PlanListClear(0);
              const info = newinfo.split('-');
              this.addressList(info[0]);
              const Person = !info[1] || info[1] === 'null' ? '' : info[1];
              const Phonen = !info[1] || info[2] === 'null' ? '' : info[2];
              this.Order_PlanfromEdit.hospitalPerson = `${Person} ${Phonen}`;
              this.Order_PlanfromEdit.memberId = info[0];
              this.changInfo = 1;
              this.Order_PlanfromEdit.deliveryMemberName = newinfo;
            }).catch(() => {
              this.changInfo = 0;
              this.$message({
                type: 'info',
                message: '已取消操作',
              });
            });
          } else {
            this.changInfo = 0;
            const tradeBtn = {
              orderCreat: !newinfo,
              orderDelete: true,
            };
            const btnDisabled = {
              planNotDelivery: newinfo,
              planDelivery: newinfo,
            };
            this.$bus.$emit('data/tradefoot', btnDisabled);
            this.ControltradeBtn(tradeBtn);
            const info = newinfo.split('-');
            this.addressList(info[0]);
            const Person = !info[1] || info[1] === 'null' ? '' : info[1];
            const Phonen = !info[1] || info[2] === 'null' ? '' : info[2];
            this.Order_PlanfromEdit.hospitalPerson = `${Person} ${Phonen}`;
            this.Order_PlanfromEdit.memberId = info[0];
          }
        }
      },
      receiveAddress(newinfo, oldinfo) {
        if (this.$route.path === '/Deliverbill/DeliverBillList/CreatDeliver') {
          if (this.Order_PlanItemList.length) {
            if (this.changInfo) {
              this.changInfo = 0;
              return;
            }
            this.changInfo += 1;
            this.Order_PlanfromEdit.receiveAddress = oldinfo;
            this.$confirm('此操作将清空明细，是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              this.PlanListClear(0);
              this.changInfo = 1;
              this.Order_PlanfromEdit.receiveAddress = newinfo;
            }).catch(() => {
              this.changInfo = 0;
              this.$message({
                type: 'info',
                message: '已取消操作',
              });
            });
          } else {
            this.changInfo = 0;
          }
        }
      },
      deep: true,
    },
    computed: {
      hospitalMemberName() {
        return this.Order_PlanfromEdit.hospitalMemberName;
      },
      receiveAddress() {
        return this.Order_PlanfromEdit.receiveAddress;
      },
      ...mapGetters([
        'Order_purchaseAmount',
        'Order_PlanItemList',
        'Order_purchaseNum',
        'View_TableHeight',
        'Order_PlanfromEdit',
        'Order_DeliveryShow',
        'Order_NotDeliveryShow',
        'View_UserInfo',
      ]),
    },
    components: {
      PurchaseDeliveryTable,
      InvoiceNumberTable,
      NotDeliveryTable,
      TradeEditsForm,
      DeliveryTable,
      StepsFrom,
    },
    data() {
      return {
        changInfo: 0,
        tableTitle: '添加明细',
        editMessage: {
          tabTitle: '',
          selects: [
            { label: '配送单编号', key: 'code', type: 'el-input', placeholder: '自动生成', isReadonly: true },
            { label: '创建人', key: 'createBy', type: 'el-input', placeholder: '自动生成', isReadonly: true, span: 5 },
            { key: 'type', type: 'el-form-item', span: 14, md: 0, sm: 0, xs: 0 },
            { label: '配送企业', key: 'deliveryMemberName', type: 'el-input', placeholder: '请输入配送企业', isReadonly: true },
            { label: '联系人', key: 'deliveryPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true, span: 5 },
            { key: 'type', type: 'el-form-item', span: 14, md: 0, sm: 0, xs: 0 },
            { label: '条码号', key: 'sendNoOut', type: 'el-input', placeholder: '请输入条码号', span: 5 },
            { label: '发货联系人', key: 'sendPerson', type: 'el-input', placeholder: '请输入发货联系人', span: 5 },
            { label: '联系人电话', key: 'sendPhone', type: 'el-input', placeholder: '请输入发货联系人电话' },
            { key: 'type', type: 'el-form-item', span: 5, md: 0, sm: 0, xs: 0 },
            { label: '医疗机构', key: 'hospitalMemberName', type: 'el-select', placeholder: '请选择医疗机构', option: 'hospitalOption', noClearable: true, filterable: true },
            { label: '联系人', key: 'hospitalPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true, span: 5 },
            { label: '备注', key: 'remarks', span: 5, type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', rows: 1 },
            { label: '收货地址', key: 'receiveAddress', type: 'el-select', placeholder: '请选择收货地址', option: 'addressOption', span: 15, noClearable: true },
          ],
          styleObject: {
            style1: {
              width: '90%',
            },
            style2: {
              width: '90%',
            },
          },
          parameters: {},
          options: {
            hospitalOption: [],
            addressOption: [],
          },
          radios: {},
          rules: {
            receiveAddress: [
              { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
            ],
            hospitalMemberName: [
              { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
            ],
            sendPerson: [
              { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
            ],
            sendPhone: [
              { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
            ],
          },
        },
        InvoiceOptions: {
          msgBase: '',                        //  没什么卵用，有需要可以看看
          isShowDialog: false,                //  显示弹框
          tableSelected: [],                //  默认表格选中
          tableType: 1,                       //  0 单选，1 多选 默认单选
          ItemNo: '',
        },
        dialogOptions: {
          msgBase: '',                        //  没什么卵用，有需要可以看看
          isShowDialog: false,                //  显示弹框
          tableSelected: [],                //  默认表格选中
          tableType: 1,                       //  0 单选，1 多选 默认单选
        },
        loading: false,
      };
    },
    methods: {
      // 查看发票号
      InvoiceCreat(ItemNo) {
        this.InvoiceOptions.isShowDialog = true;
        this.InvoiceOptions.ItemNo = ItemNo;
      },
      // 关闭弹出框
      InvoiceHide() {
        this.InvoiceOptions.isShowDialog = false;
      },
      // 删除明细操作
      deleteItem(res) {
        this.$confirm('确定要删除该明细吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.DeleteItem(res);
          if (this.Order_PlanDateList.length === 0) {
            this.ReturnHint(0);
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          });
        });
      },
      // 关闭窗口后的触发事件
      CloseDialog() {
        // 关闭弹出表单
        this.orderDelivery(false);
      },
      // 转换日期 YYYY-MM-DD
      convertDate(str) {
        return convert.convertDate(str);
      },
      // 重新计算表格高度
      showMore() {
        this.$nextTick(() => {
          this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
        });
      },
      // 获取医疗机构下拉
      hospitallist() {
        DeliverBillList.hospitallist()
          .then((res) => {
            const hospitalOption = [];
            if (res.data.code === 0) {
              const datalist = res.data.result;
              for (let i = 0; i < datalist.length; i += 1) {
                this.$set(hospitalOption, i, {
                  label: datalist[i].memberName,
                  value: `${datalist[i].memberId}-${datalist[i].contacter}-${datalist[i].contacterPhone}`,
                });
              }
            }
            this.editMessage.options.hospitalOption = hospitalOption;
            this.loading = false;
          });
      },
      //  获取当前用户的地址信息
      addressList(id) {
        ShoppingCart.addresslist(id)
          .then((res) => {
            const addressList = [];
            if (res.data.code === 0) {
              const datalist = res.data.result;
              for (let i = 0; i < datalist.length; i += 1) {
                const addressInfo = `[${datalist[i].addressName}]${datalist[i].provinceName}${datalist[i].cityName}${datalist[i].countyName} ${datalist[i].addressFull} ${datalist[i].contacter} ${datalist[i].contacterPhone}`;
                let values = [datalist[i].id, addressInfo];
                values = JSON.stringify(values);
                this.$set(addressList, i, {
                  label: addressInfo,
                  value: values,
                });
              }
              this.$set(this.Order_PlanfromEdit, 'receiveAddress', '');
            }
            this.editMessage.options.addressOption = addressList;
            this.Order_PlanfromEdit.receiveAddress = addressList[0] ? addressList[0].value : '';
            this.loading = false;
          });
      },
      // 添加明细
      dataCreat() {
        this.dialogOptions.isShowDialog = true;
      },
      // 关闭弹出框
      dialogHide() {
        this.dialogOptions.isShowDialog = false;
      },
      //  选择触发事件，根据审核状态判断右下角btn是否禁用
      dataSelect(row) {
        let booldelete = false;
        let first = 0;
        for (let i = 0; i < row.length; i += 1) {
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
      ...mapActions([
        'ControltradeBtn',
        'TableHeightRun',
        'GetDetailDate',
        'PlanListClear',
        'orderDelivery',
        'GetItemDate',
        'TradeSelect',
        'Initialize',
        'CountNum',
        'DeleteItem',
        'ItemList',
        'ReturnHint',
      ]),
    },
  };
</script>

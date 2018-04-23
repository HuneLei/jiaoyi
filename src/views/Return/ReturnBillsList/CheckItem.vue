<template>
  <div v-loading="loading">
    <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
      <TradeEditsForm :from-edit="Order_PlanfromEdit" :isCreatShow="isCreatShow" :isDeleteItem="isDeleteItem" :message="editMessage" :isGoBackShow="false" :arrow-num=5 :arrow-down="true" @data-creat="dataCreat" @delete-item="deleteItem" @show-more="showMore" :purchase="Order_purchaseAmount" :is-readonly="isReadonly">
        <el-form-item label="" slot="StepsFrom" label-width="100px">
          <StepsFrom :steplist="steplist" :active='active' :space="160" :process="process"></StepsFrom>
        </el-form-item>
      </TradeEditsForm>
    </el-form>
    <div class="stockin-bill">
        <el-table :data="Order_PlanItemList"  @selection-change="dataSelect" stripe border fit :height="View_TableHeight">
          <el-table-column type="selection" width="40" align="center" fixed="left">
          </el-table-column>
          <el-table-column prop="num" label="#" width="50" fixed="left" class-name="table_right_fixed"></el-table-column>
          <el-table-column prop="deliverCode" min-width="120" label="配送单编号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="drugsName" min-width="120" label="通用名" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="formName" min-width="90" label="剂型" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="specName" min-width="90" label="规格" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="packSpecName" min-width="90" label="包装规格" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="unitName" min-width="60" label="单位" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="batchNo" min-width="100" label="批号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="right" prop="hospitalUnitPrice" min-width="70" label="单价" sortable show-overflow-tooltip>
            <template scope="scope">
              <p>{{Number(scope.row.hospitalUnitPrice).toFixed(2)}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="stockinNum" align="right" min-width="80" label="入库数量" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column align="right" prop="returndNum" min-width="100" label="可退货数量" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="purchaseNum" align="right" min-width="100" label="申请退货数量" sortable show-overflow-tooltip v-if="purchaseNumShow||View_UserInfo.memberType!=3">
          </el-table-column>
          <el-table-column min-width="100" label="申请退货数量" sortable show-overflow-tooltip v-if="!purchaseNumShow&&View_UserInfo.memberType==3">
            <template scope="scope">
              <el-input
                class="input-right close-clear"
                style="width: 98%"
                slot="reference"
                size="small"
                placeholder="请输入内容"
                @focus="creatFocus(scope.row.purchaseNum)"
                @keyup.native="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index )"
                @blur="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index )"
                v-model="scope.row.purchaseNum"
                :disabled="isReadonly">
              </el-input>
            </template>
          </el-table-column>
          <!--<el-table-column prop="returnNum" align="right" min-width="100" label="同意退货数量" sortable show-overflow-tooltip v-if="!returnNumShow">-->
          <!--</el-table-column>-->
          <!--<el-table-column min-width="100" label="同意退货数量" sortable show-overflow-tooltip v-if="returnNumShow">-->
            <!--<template scope="scope">-->
              <!--<el-input-->
                <!--:class="Number(scope.row.returnNum) ===0?'out-num':''"-->
                <!--class="input-right"-->
                <!--style="width: 98%"-->
                <!--slot="reference"-->
                <!--size="small"-->
                <!--placeholder="请输入数量"-->
                <!--@focus="creatFocus(scope.row.returnNum)"-->
                <!--@keyup.native="returndown(scope.row.returnNum, scope.row.hospitalUnitPrice, scope.$index, scope.row.purchaseNum)"-->
                <!--v-model="scope.row.returnNum">-->
              <!--</el-input>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column align="right" min-width="80" label="退货金额" sortable show-overflow-tooltip>
            <template scope="scope">
              <p>{{scope.row.purchaseAmount.toFixed(2)}}</p>
            </template>
          </el-table-column>
          <el-table-column min-width="160" label="退货类型" sortable show-overflow-tooltip>
            <template scope="scope">
              <el-select v-model="scope.row.returnType" :placeholder="isReadonly? '' : '请选择'" style="width: 98%" size="small" slot="reference" :disabled="isReadonly" @change="typeChange(scope.$index, scope.row.returnType)">
                <el-option
                  v-for="item in refuseOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column min-width="160" label="退货原因" sortable show-overflow-tooltip>
            <template scope="scope">
              <el-input
                style="width: 98%"
                slot="reference"
                size="small"
                v-model="scope.row.returnReason"
                :disabled="isReadonly?isReadonly:scope.row.returnType?true:false">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="returnPic" min-width="80" label="问题图片" sortable show-overflow-tooltip>
            <template scope="scope">
              <el-button @click="dataUpdate(scope.row.returnPic, scope.$index)" type="text" size="small">
                <i class="icon iconfont icon-chakan"></i> 详情 ({{scope.row.picNum}})
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="producerName" min-width="180" label="生产企业" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="salerMemberName" min-width="180" label="卖方会员" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="invoiceNumber" min-width="80" label="发票号" sortable show-overflow-tooltip align="center">
            <template scope="scope">
              <el-button type="text" size="small" @click="InvoiceCreat(scope.row.returnItemNo)">
                <!--<i class="icon iconfont icon-chakan" style="font-size: 12px"></i>查看-->
                查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="stockinItemNo" min-width="135" label="入库单明细编号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="ordersCode" min-width="135" label="订单编号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="contractCode" min-width="120" label="合同编号" sortable show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="contractItemNo" min-width="135" label="合同明细编号" sortable show-overflow-tooltip>
          </el-table-column>
      </el-table>
    </div>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总退货数量：</span>{{Order_purchaseNum}} </div>
      <div style="float: left">
        <span style="">总退货金额：</span>{{Order_purchaseAmount.toFixed(2)}} <span>元</span>
      </div>
    </div>
    <PurchasePlanTable :options="dialogOptions" @dialog-hide="dialogHide"></PurchasePlanTable>
    <InvoiceNumberTable :options="InvoiceOptions" @dialog-hide="InvoiceHide"></InvoiceNumberTable>
    <DialogForm :dialog-form-visible="dialogFormShow" @dialog-confirm="dialogConfirm" @close-dialog="CloseDialog" @dialog-cancel="dialogCancel" :message="editMessages" :from-dialog="form" :isFormConfirm="true">
      <el-form-item label="问题图片" prop="returnPicFile" slot='returnPicFile' label-width="115px">
        <YUploadEdit :fileList="uploadData" :showBriefOther="true" @upload-result="uploadResult" :isDisabled="isDisabled" :isReadonly="false"></YUploadEdit>
      </el-form-item>
    </DialogForm>
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
  import TradeEditsForm from '../../../components/TradeEditsForm';          //  引入订单目录表单
  import PurchasePlanTable from './ReturnBillTable';                        //  引入弹出框
  import DialogForm from '../../../components/DialogForm';                  //  表单弹出框
  import ReturnBillsList from '../../../api/Return/ReturnBillsList';        //  引入退货管理api
  import StepsFrom from '../../../components/StepsFrom';                    //  引入加载条组件
  import InvoiceNumberTable from './InvoiceNumberTable';                    //  引入发票明细弹出框
  import YUploadEdit from '../../../components/YUploadEdit';                //  文件上传组件
  import convert from '../../../utils/convert';

  export default {
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        vm.dataList();
        vm.deliverylist();
        vm.reasonlist();
      });
    },
    watch: {
      deliveryMemberName(newinfo, oldinfo) {
        if (this.$route.path === '/Return/ReturnBillsList/CheckItem' && typeof oldinfo !== 'undefined') {
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
              const info = newinfo.split('-');
              this.PlanListClear(0);
              const MemberId = !info[0] || info[0] === 'null' ? '' : info[0];
              const Person = !info[1] || info[1] === 'null' ? '' : info[1];
              const Phonen = !info[1] || info[2] === 'null' ? '' : info[2];
              this.Order_PlanfromEdit.deliveryPerson = `${Person} ${Phonen}`;
              this.Order_PlanfromEdit.deliveryMemberId = MemberId;
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
            const info = newinfo.split('-');
            this.PlanListClear(0);
            const MemberId = !info[0] || info[0] === 'null' ? '' : info[0];
            const Person = !info[1] || info[1] === 'null' ? '' : info[1];
            const Phonen = !info[1] || info[2] === 'null' ? '' : info[2];
            this.Order_PlanfromEdit.deliveryPerson = `${Person} ${Phonen}`;
            this.Order_PlanfromEdit.deliveryMemberId = MemberId;
          }
        }
      },
      deep: true,
    },
    computed: {
      deliveryMemberName() {
        return this.Order_PlanfromEdit.deliveryMemberName;
      },
      ...mapGetters([
        'Order_purchaseAmount',
        'Order_PlanItemList',
        'Order_purchaseNum',
        'View_TableHeight',
        'Order_ItemID',
        'Order_PlanfromEdit',
        'View_UserInfo',
      ]),
    },
    components: {
      InvoiceNumberTable,
      PurchasePlanTable,
      TradeEditsForm,
      YUploadEdit,
      StepsFrom,
      DialogForm,
    },
    data() {
      return {
        changInfo: 0,
        index: null,
        tableTitle: '添加明细',
        editMessage: {
          tabTitle: '',
          selects: [
            { value: 'StepsFrom', type: 'custom', span: 24, md: 20, sm: 24, isReadonly: true },
            { label: '退货单编号', key: 'code', type: 'el-input', placeholder: '请输入退货单编号', isReadonly: true },
            { label: '创建人', key: 'createBy', type: 'el-input', placeholder: '自动生成', isReadonly: true },
            { label: '备注', key: 'remarks', type: 'el-input', placeholder: '请输入备注', rows: 1 },
            { label: '', key: 'status', type: 'el-input', isReadonly: true, fromStyle: 'style2', noborder: 'true', span: 6, belWidth: '35px', fromclass: '' },
            { label: '医疗机构', key: 'hospitalMemberName', type: 'el-input', placeholder: '请输入医疗机构', isReadonly: true },
            { label: '联系人', key: 'hospitalPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true },
            { label: '配送企业', key: 'deliveryMemberName', type: 'el-select', placeholder: '请选择配送企业', option: 'deliveryOption', noClearable: true, filterable: true },
            { label: '联系人', key: 'deliveryPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true },
            { label: '审批时间', key: 'gpoAuditTime', type: 'el-input', placeholder: '请输入备注', isReadonly: true },
            { label: 'GPO意见', key: 'gpoAuditRemark', type: 'el-input', placeholder: '请输入备注', isReadonly: true },
            { label: '审批时间', key: 'deliverAuditTime', type: 'el-input', placeholder: '请输入备注', isReadonly: true },
            { label: '配送企业意见', key: 'deliverAuditRemark', type: 'el-input', placeholder: '请输入备注', isReadonly: true },
          ],
          styleObject: {
            style2: {
              width: '70%',
            },
          },
          parameters: {},
          options: {},
          radios: {},
          rules: {},
        },
        nowNum: 0, // 当前数量
        loading: false,
        authbtn: {
          create: true,
        },
        refuseOptions: [{
          label: '原因1',
          value: 0,
        }, {
          label: '原因2',
          value: 1,
        }],
        InvoiceOptions: {
          msgBase: '',                        //  没什么卵用，有需要可以看看
          isShowDialog: false,                //  显示弹框
          tableSelected: [],                  //  默认表格选中
          tableType: 1,                       //  0 单选，1 多选 默认单选
          OptionType: true,                   //  false 配送查看 true 退货查看
          ItemNo: '',
        },
        dialogOptions: {
          msgBase: '',                        //  没什么卵用，有需要可以看看
          isShowDialog: false,                //  显示弹框
          tableSelected: [],                  //  默认表格选中
          tableType: 1,                       //  0 单选，1 多选 默认单选
          returnType: '',
          returnReason: '',
        },
        active: 1,          // 订单状态
        process: 'process',  // 步骤条样式
        steplist: [{
          title: '创建退货单',
          description: '',
        }, {
          title: '提交退货单',
          description: '',
        }, {
          title: 'GPO审核',
          description: '',
        }, {
          title: '配送企业审核',
          description: '',
        }, {
          title: '退货完成',
          description: '',
        }],
        isDisabled: false,
        isReadonly: true,
        isCreatShow: false,
        isDeleteItem: false,
        returnNumShow: false,
        purchaseNumShow: false,
        dialogFormShow: false, // 弹出框显示隐藏控制
        editMessages: {
          dialogTitle: '问题图片详情',
          selects: [
            { value: 'returnPicFile', type: 'custom' }, // 附件
          ],
          options: {},
          checkbox: {},
          radios: {},
          rules: {},
          styleObject: {},
        },
        form: {
          returnPicFile: null,
        },
        uploadData: [], //  上传文件
      };
    },
    methods: {
      ...mapActions([
        'TableHeightRun',
        'GetItemDate',
        'TradeSelect',
        'Initialize',
        'CountNum',
        'DeleteItem',
        'ItemList',
        'GetDetailDate',
        'PlanListClear',
        'ReturnHint',
      ]),
      // 关闭窗口后的触发事件
      CloseDialog() {
        this.dialogFormShow = false;
      },
      // 确定按钮
      dialogConfirm(formName) {
        this.Order_PlanItemList[this.index].returnPic = this.form.returnPicFile;
        this.$set(this.Order_PlanItemList[this.index], 'picNum', this.uploadData.length);
      },
      // 点击取消后的触发事件
      dialogCancel(res) {
        this.dialogFormShow = false;
      },
      // 上传
      uploadResult(res) {
        this.form.returnPicFile = res;
        this.uploadData = this.convert.getJSON(res);
      },
      // 详情
      dataUpdate(data, index) {
        this.index = index;
        this.dialogFormShow = true; // 打开弹出框
        this.uploadData = [];
        // 附件信息
        if (data && typeof (this.convert.toJSON(data)) === 'object') {
          this.uploadData = this.convert.toJSON(data);
        }
      },
      // 退货键盘按钮触发方法
      returndown(data, res, index, Num) {
        if ((data.toString().search(/\D/) !== -1 || Number(data) === 0) && data !== '') {
          this.Order_PlanItemList[index].returnNum = this.nowNum;
        } else if (Number(data) <= Number(Num)) {
          const ItemListNum = this.Order_PlanItemList[index].returnNum;
          const ItemListPrice = this.Order_PlanItemList[index].hospitalUnitPrice;
          this.Order_PlanItemList[index].purchaseAmount = ItemListNum * ItemListPrice;
          this.nowNum = data;
        } else {
          this.Order_PlanItemList[index].returnNum = this.nowNum;
        }
        return false;
      },
      // 键盘按钮触发方法
      keydown(data, res, index) {
        if ((data.toString().search(/\D/) !== -1 || Number(data) === 0) && data !== '') {
          this.Order_PlanItemList[index].purchaseNum = this.nowNum;
        } else {
          const ItemListNum = this.Order_PlanItemList[index].purchaseNum;
          const ItemListPrice = this.Order_PlanItemList[index].hospitalUnitPrice;
          this.Order_PlanItemList[index].purchaseAmount = ItemListNum * ItemListPrice;
          this.CountNum({ Num: this.nowNum, Count: data, Price: res });
          this.nowNum = data;
          this.ReturnHint();
        }
        return false;
      },
      // 重新计算表格高度
      showMore() {
        this.$nextTick(() => {
          this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
        });
      },
      // 查看发票号
      InvoiceCreat(ItemNo) {
        this.InvoiceOptions.isShowDialog = true;
        this.InvoiceOptions.ItemNo = ItemNo;
        this.InvoiceOptions.OptionType = true;
      },
      // 关闭弹出框
      InvoiceHide() {
        this.InvoiceOptions.isShowDialog = false;
      },
      // 获取当前的数值
      creatFocus(data) {
        this.nowNum = data;
      },
      // 添加明细
      dataCreat() {
        this.dialogOptions.isShowDialog = true;
      },
      // 删除明细操作
      deleteItem(res) {
        this.$confirm('确定要删除该明细吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.DeleteItem(res);
          this.ReturnHint();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          });
        });
      },
      // 关闭弹出框
      dialogHide() {
        this.dialogOptions.isShowDialog = false;
      },
      // 获取数据列表
      dataList() {
        this.loading = true;
        ReturnBillsList.item(this.$route.query.id)
          .then((res) => {
            if (res.data.code === 0) {
              const data = res.data.result;
              let isDeletable = '';
              let MemberName = `${data.deliveryMemberId}-${data.deliveryPerson}-${data.deliveryPhone}`;
              switch (this.$route.query.status) {
                case 0:
                  this.isCreatShow = true;
                  this.isDeleteItem = true;
                  this.isReadonly = false;
                  this.isDisabled = false;
                  this.active = 1;
                  this.process = 'process';
                  this.purchaseNumShow = false;
                  break;
                case 1:
                  this.active = 2;
                  this.isDisabled = true;
                  MemberName = data.deliveryMemberName;
                  this.process = 'process';
                  this.purchaseNumShow = true;
                  break;
                case 2:
                  this.active = 3;
                  this.returnNumShow = true;
                  this.isDisabled = true;
                  MemberName = data.deliveryMemberName;
                  this.process = 'process';
                  this.purchaseNumShow = true;
                  break;
                case 3:
                  this.active = 5;
                  this.isDisabled = true;
                  MemberName = data.deliveryMemberName;
                  this.process = 'process';
                  this.purchaseNumShow = true;
                  break;
                case 4:
                  this.active = 2;
                  this.isDisabled = true;
                  MemberName = data.deliveryMemberName;
                  this.process = 'error';
                  this.purchaseNumShow = true;
                  break;
                case 5:
                  this.active = 3;
                  this.isDisabled = true;
                  MemberName = data.deliveryMemberName;
                  this.process = 'error';
                  this.purchaseNumShow = true;
                  break;
                default:
                  break;
              }
              switch (data.isDeletable) {
                case 0:
                  isDeletable = '待提交';
                  this.editMessage.selects[4].fromclass = 'from-green no-border';
                  break;
                case 1:
                  isDeletable = '待审核(GPO)';
                  this.editMessage.selects[4].fromclass = 'from-green no-border';
                  break;
                case 2:
                  isDeletable = '待审核(配送企业)';
                  this.editMessage.selects[4].fromclass = 'from-green no-border';
                  break;
                case 3:
                  isDeletable = '审核通过';
                  this.editMessage.selects[4].fromclass = 'from-blue no-border';
                  break;
                case 4:
                  isDeletable = 'GPO未通过';
                  this.editMessage.selects[4].fromclass = 'from-red no-border';
                  break;
                case 5:
                  isDeletable = '配送企业未通过';
                  this.editMessage.selects[4].fromclass = 'from-red no-border';
                  break;
                default:
                  isDeletable = '';
                  break;
              }
              const itemList = {
                code: data.code,
                createBy: `${data.createBy || ''} ${data.createTime || ''}`,
                createTime: data.createTime,
                deliveryMemberName: MemberName,
                deliveryPerson: `${data.deliveryPerson || ''} ${data.deliveryPhone || ''}`,
                deliveryPhone: data.deliveryPhone,
                hospitalMemberName: data.hospitalMemberName,
                deliveryMemberId: data.deliveryMemberId,
                hospitalPerson: `${data.hospitalPerson || ''} ${data.hospitalPhone || ''}`,
                hospitalPhone: data.hospitalPhone,
                gpoAuditRemark: data.gpoAuditRemark,
                gpoAuditTime: data.gpoAuditTime,
                deliverAuditTime: data.deliverAuditTime,
                deliverAuditRemark: data.deliverAuditRemark,
                remarks: data.remarks,
                status: isDeletable,
              };
              this.ItemList(itemList);
              data.tmsReturnBillsItemOutputsList.item = 0;
              const content = data.tmsReturnBillsItemOutputsList;
              for (let i = 0; i < data.tmsReturnBillsItemOutputsList.length; i += 1) {
                content[i].purchaseNum = content[i].applyReturnNum;
                content[i].purchaseAmount = content[i].hospitalUnitPrice * content[i].applyReturnNum;
                content[i].deliverItemId = content[i].id;
                content[i].beReturnNum = Number(content[i].returndNum);
                const returnPic = content[i].returnPic;
                content[i].picNum = 0;
                if (this.$route.query.status === 2) {
                  content[i].returnNum = content[i].purchaseNum;
                }
                if (returnPic && typeof (this.convert.toJSON(returnPic)) === 'object') {
                  content[i].picNum = this.convert.toJSON(returnPic).length;
                }
                if (content[i].returnType) {
                  content[i].returnType = `${content[i].returnType}-${content[i].returnReason}`;
                }
              }
              this.GetItemDate(content);
            }
            this.loading = false;
          });
      },
      // 类型变化事件
      typeChange(index, data) {
        if (data && typeof data === 'string') {
          const info = data.split('-');
          const returnReason = !info[1] || info[1] === 'null' ? '' : info[1];
          this.$set(this.Order_PlanItemList[index], 'returnReason', returnReason);
        } else if (data === 0) {
          this.$set(this.Order_PlanItemList[index], 'returnReason', '其他');
        }
      },
      // 获取退货原因下拉
      reasonlist() {
        const paramKey = 'TJTH';
        ReturnBillsList.reasonlist(paramKey)
          .then((res) => {
            const refuseOptions = [];
            if (res.data.code === 0) {
              const reasonlist = res.data.result;
              for (let i = 0; i < reasonlist.length; i += 1) {
                this.$set(refuseOptions, i, {
                  label: reasonlist[i].paramValue,
                  value: `${reasonlist[i].id}-${reasonlist[i].paramValue}`,
                });
              }
              refuseOptions.push({
                label: '其他',
                value: 0,
              });
              this.dialogOptions.returnType = refuseOptions[0].value;
              this.dialogOptions.returnReason = refuseOptions[0].label;
              this.refuseOptions = Object.assign([], refuseOptions);
            }
          });
      },
      // 获取配送企业下拉
      deliverylist() {
        ReturnBillsList.deliveryall()
          .then((res) => {
            const deliveryOption = [];
            if (res.data.code === 0) {
              const datalist = res.data.result;
              for (let i = 0; i < datalist.length; i += 1) {
                this.$set(deliveryOption, i, {
                  label: datalist[i].memberName,
                  value: `${datalist[i].memberId}-${datalist[i].contacter}-${datalist[i].contacterPhone}`,
                });
              }
            }
            this.editMessage.options.deliveryOption = deliveryOption;
            this.loading = false;
          });
      },
      //  选择触发事件，根据所选数据判断btn是否禁用
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
    },
  };
</script>
<style>
  .stockin-bill .el-input.is-disabled .el-input__inner {
    color: black;
  }
</style>

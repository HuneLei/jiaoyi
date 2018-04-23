<template>
  <div v-loading="loading">

    <el-form :rules="rules" label-width="100px" id="form-item">

      <TradeEditsForm :from-edit="form" :isCreatShow="isCreatShow" :isDeleteItem="isDeleteItem" :message="editMessage" :isGoBackShow="false" :arrow-num="4" :arrow-down="true" @data-creat="dataCreat" @delete-item="deleteItem" @show-more="showMore" :is-readonly="isReadonly"></TradeEditsForm>

    </el-form>

    <div class="stockin-bill">

      <el-table :data="CalcGet_dataList" @selection-change="dataSelect" stripe border fit :height="View_TableHeight">
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column prop="num" label="#" width="40"></el-table-column>
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
        <el-table-column prop="batchNo" min-width="120" label="批号" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="hospitalUnitPrice" min-width="70" label="单价" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="sendNum" min-width="80" label="发货数量" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column v-if="!Number(this.$route.query.status)" align="right" prop="allNum" min-width="100" label="可收货数量" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="drugsAmount" min-width="90" label="金额" sortable show-overflow-tooltip>
          <template scope="scope">
            {{Number(scope.row.drugsAmount).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column min-width="80" label="入库数量" sortable show-overflow-tooltip>
          <template scope="scope">

            <el-input v-if="isEdit" class="input-right close-clear" size="small" placeholder="请输入内容" v-model="scope.row.stockinNum" @change="stockinNumChange(scope.row.stockinNum, scope.$index)" @blur="stockinNumBlur(scope.row.stockinNum, scope.$index)">
            </el-input>

            <span v-else>{{scope.row.stockinNum}}</span>

          </template>
        </el-table-column>
        <el-table-column min-width="80" label="拒收数量" sortable show-overflow-tooltip>
          <template scope="scope">

            <el-input v-if="isEdit" class="input-right close-clear" size="small" placeholder="请输入内容" v-model="scope.row.refusedNum" @change="refusedNumChange(scope.row.refusedNum, scope.$index)" @blur="refusedNumBlur(scope.row.refusedNum, scope.$index)">>
            </el-input>

            <span v-else>{{scope.row.refusedNum}}</span>

          </template>
        </el-table-column>
        <el-table-column min-width="160" label="拒收类型" sortable show-overflow-tooltip>
          <template scope="scope">

            <el-select v-if="isEdit && scope.row.refusedNum" v-model="scope.row.refusedType" :placeholder="scope.row.refusedNum ? '请选择拒收类型' : ''" size="small" @change="typeChange(scope)" clearable :disabled="!scope.row.refusedNum">
              <el-option v-for="item in refusedOption" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>

            <el-select v-else-if="isEdit && !scope.row.refusedNum" disabled :placeholder="''" size="small" v-model="nullValue">
            </el-select>

            <span v-else-if="scope.row.refusedNum">{{refusedData[scope.row.refusedType]}}</span>

          </template>
        </el-table-column>
        <el-table-column min-width="160" label="拒收原因" sortable show-overflow-tooltip class="refused-type">
          <template scope="scope">

            <el-input v-if="isEdit && scope.row.refusedNum" size="small" v-model="scope.row.refusedReason" class="color-black" :disabled="scope.row.refusedType !== 0">
            </el-input>

            <el-input v-else-if="isEdit && !scope.row.refusedNum" disabled :placeholder="''" size="small" v-model="nullValue">
            </el-input>

            <span v-else-if="scope.row.refusedNum">{{scope.row.refusedReason}}</span>

          </template>
        </el-table-column>
        <el-table-column min-width="90" label="药检报告" sortable show-overflow-tooltip>
          <template scope="scope">
            <YuploadFiles :data="convert.getJSON(scope.row.drugsReportFile)"></YuploadFiles>
          </template>
        </el-table-column>
        <el-table-column prop="makeDate" min-width="100" height="20px" label="生产日期" sortable show-overflow-tooltip>
          <template scope="scope">
            <p>{{scope.row.makeDate?convertDate(scope.row.makeDate):''}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="validDate" min-width="100" height="20px" label="有效日期" sortable show-overflow-tooltip>
          <template scope="scope">
            <p>{{scope.row.validDate?convertDate(scope.row.validDate):''}}</p>
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
            <el-button type="text" size="small" @click="InvoiceCreat(scope.row.deliverItemNo)">
              查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ordersCode" min-width="135" label="订单编号" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>

    </div>

    <div class="table-footer">

      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总入库数量：</span>{{CalcGet_sumStockinNum}}
      </div>

    </div>

    <TradeFooter class="form-trade-footer" :authbtn="authbtn" :isSaveShow="isSaveShow" :isSubmitShow="isSubmitShow" :isDeleteShow="isDeleteShow" :isBackShow="true" @order-save="dataSave" @data-submit="dataSubmit" @order-delete="dataDelete" @order-back="dataBack"></TradeFooter>

    <StockinBillTable :options="dialogOptions" @dialog-hide="dialogHide"></StockinBillTable>

    <InvoiceNumberTable :options="InvoiceOptions" @dialog-hide="InvoiceHide"></InvoiceNumberTable>

  </div>
</template>

<script>
/**
 * 入库单管理
 * ----------------------------
 * 入库单列表------新增/详情
 */
import { mapActions, mapGetters } from 'vuex';
import StockinBillTable from './StockinBillTable';                    //  引入弹出框
import StockinBillList from '../../../api/Stockinbill/StockinBillList';             //  引入入库列表api
import DeliverBillList from '../../../api/Deliverbill/DeliverBillList';  //  订单(配送企业api)
import common from '../../../api/common'; //  公共api接口
import InvoiceNumberTable from './InvoiceNumberTable';                    // 引入发票明细弹出框

export default {
  activated() {
    if (this.CalcGet_isFirst) {
      this.$router.back();
    } else {
      this.dataInit();
    }
  },
  deactivated() {
    this.form = {
      deliveryMemberName: '',
    };
    this.setBtn();
    this.CalcSet_initData();
  },
  watch: {
    authList() {
      this.authbtn = StockinBillList.authbtn();
    },
    deliveryMemberName(newInfo, oldInfo) {
      if (
        (this.deliveryMemberName && !this.CalcGet_dataList.length)
        || !newInfo
        || !oldInfo
        || !this.isCancalBack
      ) {
        if (!this.deliverId) {
          this.ControltradeBtn({
            orderCreat: false,
            orderDelete: true,
          });
        } else {
          this.ControltradeBtn({
            orderCreat: true,
            orderDelete: true,
          });
        }
        this.form = {
          ...this.form,
          ...this.deliveryMemberData[newInfo],
        };
        this.isCancalBack = true;
      } else {
        this.$confirm('此操作将清空明细，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.form = {
            ...this.form,
            ...this.deliveryMemberData[newInfo],
          };
          this.CalcSet_deleteDetail(this.CalcGet_dataList);
        }).catch(() => {
          this.form = {
            ...this.form,
            ...this.deliveryMemberData[oldInfo],
          };
          this.isCancalBack = false;
          this.$message({
            type: 'info',
            message: '已取消操作',
          });
        });
      }
    },
  },
  computed: {
    apiDoName() {
      return this.editType === 1 ? 'update' : 'create';
    },
    authList() {
      return this.$store.state.view.authList;
    },
    //  是否可编辑
    isEdit() {
      const id = Number(this.$route.query.id);
      const status = Number(this.$route.query.status);
      if (!id) {
        return true;
      } else if (status === 1) {
        return false;
      }
      return true;
    },
    //  配送商名称，用来做watch
    deliveryMemberName() {
      return this.form.deliveryMemberName;
    },
    ...mapGetters([
      'getGpoId',
      'View_TableHeight',
      'View_UserInfor', //  用户信息详情

      'CalcGet_isFirst',
      'CalcGet_dataList', //  表格]
      'CalcGet_sumStockinNum',  //  库存总数量
    ]),
    //  配送企业文本框是否只读
    deliverIsReadonly() {
      if (this.deliverId) {
        return true;
      }
      return false;
    },
    editMessage() {
      return {
        selects: [
          {
            label: '入库单编号', key: 'code', type: 'el-input', placeholder: '请输入采购计划名称', isReadonly: true,
          },
          {
            label: '创建人', key: 'createBy', type: 'el-input', placeholder: '自动生成', isReadonly: true,
          },
          {
            label: '备注', key: 'remarks', type: 'el-input', placeholder: '请输入备注',
          },
          {
            label: '', key: 'statusName', type: 'el-input', isReadonly: true, fromStyle: 'style2', noborder: 'true', span: 6, belWidth: '35px', fromclass: this.form.status ? 'from-blue no-border' : 'from-green no-border',
          },
          {
            label: '医疗机构', key: 'hospitalMemberName', type: 'el-input', placeholder: '请输入医疗机构', isReadonly: true,
          },
          {
            label: '联系人', key: 'hospitalPersonValue', type: 'el-input', placeholder: '请输入联系人', isReadonly: true,
          },
          {
            label: '配送企业', key: 'deliveryMemberName', type: 'el-select', placeholder: '请选择配送企业', option: 'deliveryOption', noClearable: true, filterable: true, isReadonly: this.deliverIsReadonly,
          },
          {
            label: '联系人', key: 'deliveryPersonValue', type: 'el-input', placeholder: '请输入联系人', isReadonly: true,
          },
        ],
        styleObject: {
          style2: {
            width: '70%',
          },
        },
        parameters: {},
        options: {
          deliveryOption: this.deliveryOption,
        },
        radios: {},
      };
    },
  },
  components: {
    InvoiceNumberTable,
    StockinBillTable,
  },
  data() {
    return {
      id: null,
      status: null,
      deliverId: null,
      rules: {
        deliveryMemberName: [
          { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
        ],
      },
      nullValue: '',
      editType: 0,
      form: {
        deliveryMemberName: '',
      },
      loading: false,
      deliveryOption: [], //  配送企业下拉菜单
      deliveryMemberData: {}, //  配送企业JSON
      isCancalBack: true,
      authbtn: {},

      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                  //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
      },
      InvoiceOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        ItemNo: '',
      },
      refusedOption: [],  //  拒收原因下拉
      refusedData: {},  //  拒收原因JSON
      stockinNum: 0,  //  入库数量老数值
      refusedNum: 0,  //  拒收数量老数值

      isReadonly: false,
      isCreatShow: false,  //  添加明细
      isDeleteItem: false, //  删除明细
      //  底部按钮
      isSaveShow: false,  //  保存
      isSubmitShow: false,  //  提交
      isDeleteShow: false,  //  删除
    };
  },
  methods: {
    ...mapActions([
      'TableHeightRun',
      'TradeSelect',
      'ControltradeBtn',

      'Calcset_isFirst',
      'CalcSet_dataList',
      'CalcSet_initKey',  //  初始化key
      'CalcSet_deleteDetail', //  删除明细
      'CalcSet_initData', //  重置数据
    ]),
    //  页面的初始化
    dataInit() {
      this.id = Number(this.$route.query.id);
      this.status = Number(this.$route.query.status);
      this.deliverId = Number(this.$route.query.deliverId);

      this.authbtn = StockinBillList.authbtn();
      this.CalcSet_initData();
      this.CalcSet_initKey({
        baseId: 'deliverItemId', //  唯一表示id的key
        basePrice: 'hospitalUnitPrice', //  单价
        baseAmount: 'drugsAmount', //  总价格
        baseAllNum: 'allNum', //  总数量
        baseMapNum: 'mapNum', //  未入库总数量
        baseStockinNum: 'stockinNum', //  入库数量
        baseRefusedNum: 'refusedNum', //  拒收数量
        baseRefusedType: 'refusedType', //  拒收类型
      });
      this.deliverylist();
      this.getRefused();

      if (this.id) {
        //  编辑
        this.editType = 1;
        this.getInfo(this.id);
        this.setBtn(this.editType, this.status);
        this.ControltradeBtn({
          orderCreat: false,
          orderDelete: true,
        });
      } else {
        //  新增
        this.editType = 0;
        this.setBtn(this.editType);

        if (!this.deliverId) {
          //  普通新增
          this.ControltradeBtn({
            orderCreat: true,
            orderDelete: true,
          });
          this.form = {
            ...this.form,
            hospitalMemberName: this.View_UserInfor.name,
            hospitalPersonValue: `${this.View_UserInfor.contacter || ''} ${this.View_UserInfor.phone || ''}`,
          };
        } else {
          //  从配送单过来的新增
          this.ControltradeBtn({
            orderCreat: true,
            orderDelete: true,
          });
          this.getDeliverInfo(this.deliverId);
        }
      }

      this.reCalcTableHeight();
      window.onresize = () => {
        this.reCalcTableHeight();
      };

      this.$store.commit('BreadCrumb_Update', [
        {
          path: '/index',
          name: this.$store.state.view.resourcesNow.name,
        },
        {
          path: '/Stockinbill',
          name: '入库单管理',
          noLink: true,
        },
        {
          path: '/Stockinbill/StockinBillList',
          name: '入库单列表',
        },
        {
          name: `入库单列表${this.editType ? '详情' : '新增'}`,
          noLink: true,
        },
      ]);
    },
    //  设置下方按钮显示隐藏，以及isReadonly
    setBtn(editType, status) {
      if (editType === 0) {
        this.isCreatShow = true;
        this.isDeleteItem = true;
        this.isSaveShow = true;
        this.isSubmitShow = true;
        this.isDeleteShow = false;
        this.isReadonly = false;
      } else if (editType === 1 && status === 1) {
        this.isCreatShow = false;
        this.isDeleteItem = false;
        this.isSaveShow = false;
        this.isSubmitShow = false;
        this.isDeleteShow = false;
        this.isReadonly = true;
      } else if (editType === 1 && status === 0) {
        this.isCreatShow = true;
        this.isDeleteItem = true;
        this.isSaveShow = true;
        this.isSubmitShow = true;
        this.isDeleteShow = true;
        this.isReadonly = false;
      } else {
        this.isCreatShow = false;
        this.isDeleteItem = false;
        this.isSaveShow = false;
        this.isSubmitShow = false;
        this.isDeleteShow = false;
        this.isReadonly = false;
      }
    },
    //  重新计算表格高度
    reCalcTableHeight() {
      setTimeout(() => {
        this.TableHeightRun(['#form-tabs', '#form-item', '#form-trade-footer', 200]);
      }, 0);
    },
    // 重新计算表格高度
    showMore() {
      this.reCalcTableHeight();
    },
    // 获取配送企业下拉
    deliverylist() {
      StockinBillList.deliveryall().then((res) => {
        const ret = [];
        const retData = {};
        if (res.data.code === 0) {
          const data = res.data.result;
          for (let i = 0; i < data.length; i += 1) {
            const item = data[i];
            ret.push({
              label: item.memberName,
              value: item.memberName,
            });
            retData[item.memberName] = {
              deliveryMemberId: item.memberId,
              deliveryMemberName: item.memberName,
              deliveryPerson: item.contacter,
              deliveryPhone: item.contacterPhone,
              deliveryPersonValue: `${item.contacter || ''} ${item.contacterPhone || ''}`,
            };
          }
        }
        this.deliveryOption = ret;
        this.deliveryMemberData = retData;
      });
    },
    //  获取拒收原因下拉
    getRefused() {
      const retList = [];
      const retData = {};
      common.commonParameterKey('JSYP').then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          for (let i = 0; i < data.length; i += 1) {
            const item = data[i];
            retList.push({
              label: item.paramValue,
              value: item.id,
            });
            retData[item.id] = item.paramValue;
          }
          retList.push({
            label: '其他',
            value: 0,
          });
          retData[0] = '其他';

          this.refusedOption = retList;
          this.refusedData = retData;
        }
      });
    },
    //  查看详情初始化表单数据
    getInfo(id) {
      this.loading = true;
      StockinBillList.item(id).then((res) => {
        this.loading = false;
        if (res.data.code === 0) {
          const data = res.data.result;
          this.form = {
            ...data,
            id,
            tmsStockinBillsItemOutputsList: undefined,
            hospitalPersonValue: `${data.hospitalPerson || ''} ${data.hospitalPhone || ''}`,
            deliveryPersonValue: `${data.deliveryPerson || ''} ${data.deliveryPhone || ''}`,
            statusName: this.baseTableSelect.status[data.status],
          };
          this.CalcSet_dataList(data.tmsStockinBillsItemOutputsList);
        }
      });
    },
    //  从配送单收货过来的配送单详情
    getDeliverInfo(id) {
      this.loading = true;
      DeliverBillList.item(id).then((res) => {
        this.loading = false;
        if (res.data.code === 0) {
          const data = res.data.result;
          this.form = {
            ...data,
            id: 0,
            code: undefined,
            createBy: undefined,
            createTime: undefined,
            remarks: undefined,
            tmsDeliverBillsItemOutputList: undefined,
            hospitalPersonValue: `${data.hospitalPerson || ''} ${data.hospitalPhone || ''}`,
            deliveryPersonValue: `${data.deliveryPerson || ''} ${data.deliveryPhone || ''}`,
          };
          const retList = [];
          for (let i = 0; i < data.tmsDeliverBillsItemOutputList.length; i += 1) {
            const item = data.tmsDeliverBillsItemOutputList[i];
            if (Number(item.mapNum)) {
              retList.push({
                ...item,
                id: 0,
                deliverItemId: item.id,
                deliverCode: item.code,
                sendNum: item.drugsNum,
                refusedType: undefined,
                refusedReason: undefined,
                stockinNum: item.mapNum,
              });
            }
          }
          this.CalcSet_dataList(retList);
        }
      });
    },
    //  拒收类型修改
    typeChange(scope) {
      this.CalcGet_dataList[scope.$index].refusedReason = this.refusedData[scope.row.refusedType];
    },
    //  添加明细
    dataCreat() {
      this.dialogOptions = {
        ...this.dialogOptions,
        isShowDialog: true,
        deliveryMemberId: this.form.deliveryMemberId,
      };
    },
    //  显示发票明细弹框
    InvoiceCreat(ItemNo) {
      this.InvoiceOptions = {
        ...this.InvoiceOptions,
        isShowDialog: true,
        ItemNo,
      };
    },
    //  删除明细
    deleteItem(res) {
      this.$confirm('确定要删除该明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.CalcSet_deleteDetail(res);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    //  隐藏添加明细弹框
    dialogHide() {
      this.dialogOptions = {
        ...this.dialogOptions,
        isShowDialog: false,
      };
    },
    //  隐藏发票查看明细弹框
    InvoiceHide() {
      this.InvoiceOptions = {
        ...this.InvoiceOptions,
        isShowDialog: true,
        ItemNo: null,
      };
    },
    // 获取当前的数值
    stockinNumChange(value, index) {
      if (/^([1-9]\d*|0{1})$/.test(value)) {
        this.stockinNum = value;
        this.CalcSet_dataList(this.CalcGet_dataList);
      }
    },
    //  离开验证，格式不对重置回来
    stockinNumBlur(value, index) {
      if (!/^([1-9]\d*|0{1})$/.test(value)) {
        this.CalcGet_dataList[index].stockinNum = this.stockinNum;
        this.CalcSet_dataList(this.CalcGet_dataList);
      } else {
        const data = this.CalcGet_dataList[index];
        if (Number(data.stockinNum) + Number(data.refusedNum) > Number(data.allNum)) {
          this.$message({
            type: 'error',
            message: '可收货数量不足',
          });
          this.CalcGet_dataList[index].stockinNum = Number(data.allNum) - Number(data.refusedNum);
          this.CalcSet_dataList(this.CalcGet_dataList);
        }
      }
    },
    // 获取当前的数值
    refusedNumChange(value, index) {
      if (/^([1-9]\d*|0{1})$/.test(value)) {
        this.refusedNum = value;
        this.CalcSet_dataList(this.CalcGet_dataList);
      }
    },
    //  离开验证，格式不对重置回来
    refusedNumBlur(value, index) {
      if (!/^([1-9]\d*|0{1})$/.test(value)) {
        this.CalcGet_dataList[index].refusedNum = this.refusedNum;
        this.CalcSet_dataList(this.CalcGet_dataList);
      } else {
        const data = this.CalcGet_dataList[index];
        if (Number(data.stockinNum) + Number(data.refusedNum) > Number(data.allNum)) {
          this.$message({
            type: 'error',
            message: '可收货数量不足',
          });
          this.CalcGet_dataList[index].refusedNum = Number(data.allNum) - Number(data.stockinNum);
          this.CalcSet_dataList(this.CalcGet_dataList);
        }
      }
    },
    //  保存
    dataSave() {
      this.$confirm('此操作将保存该数据，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.dataToDo(0);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    //  提交
    dataSubmit() {
      this.$confirm('此操作将提交该数据，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.dataToDo(1);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    //  保存或提交
    dataToDo(status) {
      const dataList = this.CalcGet_dataList;
      const retList = [];
      let wrongMessage = false;

      if (!this.form.deliveryMemberId) {
        wrongMessage = '请选择配送企业！';
      } else if (!dataList || !dataList.length) {
        wrongMessage = '明细不能为空！';
      } else {
        for (let i = 0; i < dataList.length; i += 1) {
          const item = dataList[i];
          if (item.refusedNum && (!item.refusedType && item.refusedType !== 0)) {
            wrongMessage = '请选择拒收类型！';
            break;
          } else if (Number(item.allNum) < Number(item.stockinNum) + Number(item.refusedNum)) {
            wrongMessage = '入库数量和拒收数量的数量不得大于未开票数量！';
            break;
          } else if (!Number(item.stockinNum) && !Number(item.refusedNum)) {
            wrongMessage = '入库数量和拒收数量的总数不能为0！';
            break;
          }

          retList.push({
            id: item.id,
            barcode: item.barcode,
            deliverItemId: item.deliverItemId,
            refusedNum: item.refusedNum,
            refusedType: item.refusedType || 0,
            refusedReason: item.refusedReason || null,
            stockinItemNo: item.stockinItemNo,
            stockinNum: item.stockinNum,
            mapNum: item.allNum,
          });
        }
      }

      if (wrongMessage) {
        this.$message({
          type: 'error',
          message: wrongMessage,
        });
        return;
      }

      const form = {
        ...this.form,
        id: this.form.id || 0,
        gpoMemberId: this.getGpoId,
        status,
        tmsStockinBillsItemFormList: retList,
      };

      this.loading = true;
      StockinBillList[this.apiDoName](form).then((res) => {
        this.loading = false;
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: `${status === 1 ? '提交' : '保存'}成功`,
          });
          this.dataBack();
        }
      });
    },
    //  删除
    dataDelete() {
      this.loading = true;
      StockinBillList.remove([this.form.id]).then((res) => {
        this.loading = false;
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功',
          });
        }
        this.dataBack();
      });
    },
    //  返回
    dataBack() {
      this.form = {
        deliveryMemberName: '',
      };
      this.setBtn();
      this.CalcSet_initData();

      this.$router.back();
    },
    //  转换日期 YYYY-MM-DD
    convertDate(str) {
      return this.convert.convertDate(str, 2);
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
.color-black .el-input__inner {
  color: #000 !important;
}
</style>

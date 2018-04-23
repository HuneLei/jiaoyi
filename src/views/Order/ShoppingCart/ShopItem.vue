  <template>
  <div v-loading="loading">
    <Percent v-show="isupload" :percentage="percentage"></Percent>
    <el-form :rules="editMessage.rules" label-width="100px" id="from-item">
      <TradeEditsForm :from-edit="Order_PlanfromEdit" :isCreatShow="true" :isDeleteItem="true" :is-cplan-show="true" :is-lplan-show="true" :isExportShow1="true" :message="editMessage" :isGoBackShow="false" :arrow-num=3 :arrow-down="true" @data-creat="dataCreat" @delete-item="deleteItem" @show-more="showMore" @data-cplan="dataCplan" @data-lplan="dataLplan" :purchase="Order_purchaseAmount" :isReadonly="View_UserInfo.memberType === 4 || View_UserInfo.memberType === 5" :is-export-show="true" :is-import-show="true" @data-import="dataImport" @data-export="dataExport" @data-export1="dataExport1">
        <div slot="adress" style="line-height: 31px;">
          <el-button size="mini" type="primary" style="line-height: 20px;" @click="addAdress" v-show="View_UserInfo.memberType !== 4 && View_UserInfo.memberType !== 5">
            <i style="font-size: 13px" class="icon iconfont icon-xinzeng"></i>
            新增地址
          </el-button>
        </div>
      </TradeEditsForm>
    </el-form>
    <div>
      <el-table ref="multipleTable" :data="Order_PlanItemList" @selection-change="dataSelect" stripe border fit :height="View_TableHeight">
        <el-table-column type="selection" width="40" fixed="left">
        </el-table-column>
        <el-table-column prop="num" label="#" width="40" show-overflow-tooltip fixed="left" class-name="table_right_fixed"></el-table-column>
        <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" min-width="120" label="通用名" sortable show-overflow-tooltip>
          <template scope="scope">
            <p :class="scope.row.upStatus==0?'out-num':''">{{scope.row.drugsName}}</p>
          </template>
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
        <el-table-column align="right" prop="hospitalUnitPrice" min-width="70" label="单价" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column align="right" prop="purchasableNum" min-width="80" label="可采数量" sortable show-overflow-tooltip>
          <template scope="scope">
            <p :class="Number(scope.row.purchasableNum) ===0?'out-num':''">{{scope.row.purchasableNum}}</p>
          </template>
        </el-table-column>
        <el-table-column align="right" min-width="80" label="订单数量" sortable show-overflow-tooltip>
          <template scope="scope">
            <el-input :class="Number(scope.row.purchaseNum) ===0 || Number(scope.row.purchaseNum) > Number(scope.row.purchasableNum)?'out-num':''" class="input-right close-clear" style="width: 98%;color: red" slot="reference" size="small" placeholder="请输入数量" @focus="creatFocus(scope.row.purchaseNum)" @keyup.native="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index)" @blur="keydown(scope.row.purchaseNum, scope.row.hospitalUnitPrice, scope.$index)" v-model="scope.row.purchaseNum">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column min-width="90" label="金额" align="right" sortable show-overflow-tooltip>
          <template scope="scope">
            <p>{{Number(scope.row.purchaseAmount).toFixed(2)}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="middlePack" min-width="70" label="中包装" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="bigPack" min-width="70" label="大包装" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="removeFactor" min-width="70" label="拆零系数" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="deliveryMemberName" min-width="180" label="配送企业" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="producerName" min-width="180" label="生产企业" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" min-width="130" label="批准文号" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总数量：</span>{{Order_purchaseNum}} </div>
      <div style="float: left">
        <span>总金额：</span>{{Number(Order_purchaseAmount) ? Number(Order_purchaseAmount).toFixed(2) : '0.00'}}
        <span>元</span>
      </div>
    </div>
    <PurchasePlanTable :options="dialogOptions" @dialog-hide="dialogHide"></PurchasePlanTable>
    <ShoppingCartTable :options="dialogShops" @dialog-hide="dialogShop"></ShoppingCartTable>
    <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" :message="AddressMessage" :from-dialog="form" :isReadonly="false" :isSaveShow="isSaveShow" :saveLoading="saveLoading" :isFormConfirm="isFormConfirm" @data-save="dataSave">
      <el-form-item label="省" prop="provinceId" slot='provinceId' label-width="115px">
        <el-select v-model="form.provinceId" placeholder="请选择省" @change="changeProvince">
          <el-option v-for="item in provinceOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市" prop="cityId" slot='cityId' label-width="115px">
        <el-select v-model="form.cityId" placeholder="请选择市" @change="changeCity">
          <el-option v-for="item in cityOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区" prop="countyId" slot='countyId' label-width="115px">
        <el-select v-model="form.countyId" placeholder="请选择区" @change="changecounty">
          <el-option v-for="item in countyOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
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
import application from '../../../api/BasicInfo/Project';
import DialogForm from '../../../components/DialogForm';                //  引订单目录表单
import district from '../../../api/district';                           //  省市区接口
import TradeEditsForm from '../../../components/TradeEditsForm';        //  引入订单目录表单
import PurchasePlanTable from './PurchasePlanTable';                    //  引入弹出框
import ShoppingCartTable from './ShoppingCartTable';                    //  引入弹出框
import ShoppingCart from '../../../api/Order/ShoppingCart';             //  引入订单购物车api
import Address from '../../../api/BasicInfo/Address';                   //  引入地址管理api
import PurchasePlan from '../../../api/Order/PurchasePlan';             //  引入采购计划api

export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.dataList();
      vm.addressList();
    });
  },
  computed: mapGetters([
    'Order_purchaseAmount',
    'Order_PlanItemList',
    'Order_purchaseNum',
    'View_TableHeight',
    'Order_ItemID',
    'Order_PlanfromEdit',
    'View_UserInfo',
    'getGpoId',
  ]),
  components: {
    ShoppingCartTable,
    PurchasePlanTable,
    TradeEditsForm,
    DialogForm,
  },
  data() {
    // 不能为空的验证
    const verifyNull = (rule, value, callback) => {
      this.$data.AddressMessage.rules.provinceId[0].trigger = 'blur,change';
      this.$data.AddressMessage.rules.cityId[0].trigger = 'blur,change';
      this.$data.AddressMessage.rules.countyId[0].trigger = 'blur,change';
      let error = '';
      if (!value) {
        error = callback(new Error('不能为空'));
      } else {
        error = callback();
      }
      return error;
    };
    return {
      exportId: null,
      percentage: 0,
      isupload: false,
      editType: '',               // 弹出窗新增编辑判断 0:新增  1:编辑
      editLoading: false,         // 加载
      provinceOptions: [],        // 省
      cityOptions: [],            // 市
      countyOptions: [],          // 区
      isFormConfirm: false,       // 确定按钮显示控制
      formConfirmLoading: false,  // 确定按钮loading显示控制
      isSaveShow: true,           // 保存按钮显示控制
      saveLoading: false,         // 保存按钮loading显示控制
      isSubmitShow: false,        // 提交按钮显示控制
      submitLoading: false,       // 提交按钮loading显示控制
      // 需要提交的字段
      form: {
        id: '',                         // 地址ID
        addressName: '',                // 地址名称，不为空
        provinceId: null,               // 省，不为空
        provinceName: null,             // 省名，不为空
        cityId: null,                   // 市，不为空
        cityName: null,                 // 市，不为空
        countyId: null,                 // 县，不为空
        countyName: null,               // 县，不为空
        zipCode: null,                  // 邮政编码
        addressFull: '',                // 详细地址，不为空
        contacter: '',                  // 联系人，不为空
        contacterPhone: '',       // 联系人电话，不为空
      },
      dialogFormShow: false,      // 弹出框显示隐藏控制
      AddressMessage: {
        // 写入表单组件的数据
        selects: [
          { label: '地址名称', key: 'addressName', type: 'el-input', placeholder: '请输入地址名称' },
          { value: 'provinceId', type: 'custom' },
          { value: 'cityId', type: 'custom' },
          { value: 'countyId', type: 'custom' },
          { label: '邮政编码', key: 'zipCode', type: 'el-input', placeholder: '请输入邮政编码' },
          { label: '详细地址', key: 'addressFull', type: 'el-input', placeholder: '请输入详细地址' },
          { label: '联系人', key: 'contacter', type: 'el-input', placeholder: '请输入联系人' },
          { label: '联系电话', key: 'contacterPhone', type: 'el-input', placeholder: '请输入联系电话' },
        ],
        // 弹出框标题
        dialogTitle: '地址新增',
        options: {
          // 省下拉选项
          provinceOption: [],
          // 市下拉选项
          cityOption: [],
          // 区下拉选项
          areaOption: [],
        },
        // checkbox选项值
        checkbox: {},
        // radios选项值
        radios: {},
        // 验证规则
        rules: {
          addressName: [
            { required: true, message: '请输入地址名称', trigger: 'blur' },
            { message: '不得超过256位字符', max: 256 },
          ],
          provinceId: [
            { required: true, type: 'number', message: '请选择省', trigger: 'blur', validator: verifyNull },
          ],
          cityId: [
            { required: true, type: 'number', message: '请选择市', trigger: 'blur' },
          ],
          countyId: [
            { required: true, type: 'number', message: '请选择区', trigger: 'blur' },
          ],
          zipCode: [
            { required: true, message: '请输入邮政编码', trigger: 'blur' },
            { message: '不得超过256位字符', max: 256 },
          ],
          addressFull: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
            { message: '不得超过256位字符', max: 256 },
          ],
          contacter: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
            { message: '不得超过256位字符', max: 256 },
          ],
          contacterPhone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { message: '不得超过256位字符', max: 256 },
          ],
        },
        styleObject: {},
      },
      tableTitle: '订单购物车查看',
      nowNum: 0,                            // 当前数量
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                  //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
      },
      dialogShops: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                  //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
      },
      authbtn: {
        create: true,
      },
      isCreateShow: true,
      editMessage: {
        tabTitle: '',
        selects: [
          { label: '医疗机构', key: 'hospitalName', type: 'el-input', placeholder: '请输入医疗机构', isReadonly: true },
          { label: '联系人', key: 'hospitalPerson', type: 'el-input', placeholder: '请输入联系人', isReadonly: true },
          { key: 'type', type: 'el-form-item', span: 14, md: 0, sm: 0, xs: 0 },
          { label: '创建人', key: 'createBy', type: 'el-input', placeholder: '请输入创建人', isReadonly: true },
          { label: '订单类型', key: 'type', type: 'el-select', placeholder: '请输入创建人', option: 'typeOption', noClearable: true },
          { label: '备注', key: 'remarks', type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', rows: 1 },
          { label: '收货地址', key: 'receiveAddress', type: 'el-select', placeholder: '请选择收货地址', fromStyle: 'style2', option: 'addressOption', span: 15, noClearable: true },
          { key: 'type', type: 'el-form-item', span: 1, md: 12, sm: 12, xs: 6 },
          { value: 'adress', type: 'custom' },
        ],
        styleObject: {
          style1: {
            width: '79%',
          },
          style2: {
            width: '100%',
          },
        },
        parameters: {},
        options: {
          addressOption: [],
          typeOption: [{
            label: '普通订单',
            value: '普通订单',
          }, {
            label: '加急订单',
            value: '加急订单',
          }],
        },
        radios: {},
        rules: {
          receiveAddress: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
          type: [
            { required: true, validator: window.validator.returnTrue, trigger: 'blur' },
          ],
        },
      },
      tableData: [],
      loading: false,
      selectData: [],
    };
  },
  // watch: {
  //   Order_PlanItemList() {
  //     if (this.Order_PlanItemList.length === 0) {
  //       this.Order_PlanfromEdit.receiveAddress = null;
  //     }
  //   },
  // },
  methods: {
    ...mapActions([
      'Getitemdates',
      'TableHeightRun',
      'GetItemDate',
      'TradeSelect',
      'Initialize',
      'CountNum',
      'DeleteItem',
      'ItemList',
      'GetDetailDate',
      'PlanListClear',
      'GetPlanDate',
    ]),
    // 导入模板
    dataImport(e) {
      const file = e.target.files[0];
      // console.log('file.type', file);
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' || file.name.indexOf('.xls') > -1) {
        this.isupload = true;
        const formData = new FormData();
        formData.append('file', file);
        ShoppingCart.uploadItem(formData, this.progress)
          .then((res) => {
            if (res.data.code === 0) {
              this.PlanListClear();
              const datalist = [];
              const data = res.data.result;
              this.percentage = 100;
              setTimeout(() => {
                this.isupload = false;
                this.percentage = 0;
              }, 500);
              this.$message({
                type: 'success',
                message: res.data.message,
              });
              let pushok = 0;
              for (let i = 0; i < data.length; i += 1) {
                pushok = 0;
                data[i].purchaseNum = data[i].ordersNum;
                data[i].purchaseAmount = Number(data[i].hospitalUnitPrice)
                  * Number(data[i].purchaseNum);
                const content = data[i];
                if (datalist.length === 0) {
                  datalist.push(data[i]);
                } else {
                  let addok = 0;
                  for (let n = 0; n < datalist.length; n += 1) {
                    addok = 0;
                    if (datalist[n].drugsCode === data[i].drugsCode && datalist[n].deliveryMemberId
                      === data[i].deliveryMemberId && datalist[n].hospitalUnitPrice
                      === data[i].hospitalUnitPrice) {
                      datalist[n].purchaseNum += data[i].purchaseNum;
                      datalist[n].purchaseAmount = content.hospitalUnitPrice * content.purchaseNum;
                    } else {
                      addok = 1;
                    }
                  }
                  if (addok) datalist.push(data[i]);
                }
              }
              this.Getitemdates(datalist);
            } else {
              setTimeout(() => {
                this.isupload = false;
                this.percentage = 0;
              }, 500);
              this.$message({
                type: 'error',
                message: res.data.message,
              });
            }
            this.$bus.$emit('clear/file');
          });
      } else {
        this.$message({
          type: 'error',
          message: '文件格式出错，请导入excel',
        });
      }
    },
    // 导出模板
    dataExport() {
      const url = ShoppingCart.outputItem(this.getGpoId);
      window.open(url);
    },
    // 导出数据
    dataExport1() {
      const url = ShoppingCart.outputItemList(this.exportId);
      window.open(url);
    },
    //  进度条
    progress(e) {
      const d = parseInt((100 * e.loaded) / e.total, 0);
      if (d >= 90) {
        this.percentage = 90;
      } else {
        this.percentage = d;
      }
    },
    addAdress(i) {  // 新增地址
      this.district();
      this.dialogFormShow = true;
      this.AddressMessage.rules.provinceId[0].trigger = 'blur';
      this.AddressMessage.rules.cityId[0].trigger = 'blur';
      this.AddressMessage.rules.countyId[0].trigger = 'blur';
      this.form = {
        addressName: '',                // 地址名称，不为空
        provinceId: null,               // 省，不为空
        provinceName: null,             // 省名，不为空
        cityId: null,                   // 市，不为空
        cityName: null,                 // 市，不为空
        countyId: null,                 // 县，不为空
        countyName: null,               // 县，不为空
        zipCode: null,                  // 邮政编码
        addressFull: '',                // 详细地址，不为空
        contacter: '',                  // 联系人，不为空
        contacterPhone: '',    // 联系人电话，不为空
        memberId: this.View_UserInfo.memberId,    // 会员id
      };
      // i === 1, xinzn
      if (i === 1) {
        this.editType = 0;  // 新增
        this.editMessage.dialogTitle = '地址新增';
        this.dialogFormShow = true;   // 打开弹出框
      }
    },
    // 获取省的选项，默认父ID位88888
    district() {
      district.cityList(88888).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          for (let i = 0; i < data.length; i += 1) {
            if (data[i].id === -1) {
              //              data[i].disabled = true;
              this.$set(data[i], 'disabled', true);
            }
          }
          this.provinceOptions = data;
          this.provinceOptions[0].disabled = true;
        }
      });
      this.$set(this.provinceOptions, 0, {
        disabled: true,
      });
    },
    // 点击保存后的触发事件
    dataSave(formName) {
      this.loading = true;
      Address.create(formName).then((res) => {
        if (res.data.code === 0) {
          this.$bus.$emit('data/list');
          this.$message({
            type: 'success',
            message: '地址新增成功',
          });
        }
        this.addressList();
        this.loading = false;
      });
    },
    // 改变省
    changeProvince() {
      this.cityOptions = [];
      this.form.cityId = null;
      // 获取省name
      for (let i = 0; i < this.provinceOptions.length; i += 1) {
        if (this.provinceOptions[i].value === this.form.provinceId) {
          this.form.provinceName = this.provinceOptions[i].label;
        }
      }
      if (this.form.provinceId !== null) {
        this.getCity();
      }
    },
    // 获取市
    getCity() {
      // 获取市的选项
      district.cityList(this.form.provinceId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.cityOptions = data;
        }
      });
    },
    // 改变市，获取区
    changeCity() {
      this.countyOptions = [];
      this.form.countyId = '';
      // 获取市name
      for (let i = 0; i < this.cityOptions.length; i += 1) {
        if (this.cityOptions[i].value === this.form.cityId) {
          this.form.cityName = this.cityOptions[i].label;
        }
      }
      // 在更换省份时，市与区会清空，但是会被动触发change事件报错。所以判断市的值是否为空，为空时，不提交区的请求。
      if (this.form.cityId !== null) {
        this.getcounty();
      }
    },
    // 获取区
    getcounty() {
      // 获取区的选项
      district.cityList(this.form.cityId).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result;
          this.countyOptions = data;
        }
      });
    },
    // 选择区
    changecounty() {
      // 获取区name
      for (let i = 0; i < this.countyOptions.length; i += 1) {
        if (this.countyOptions[i].value === this.form.countyId) {
          this.form.countyName = this.countyOptions[i].label;
        }
      }
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
      // 关闭保存Loading
      this.saveLoading = false;
      // 关闭弹出表单
      this.dialogFormShow = false;
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
      }
      return false;
    },
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['#from-item', '.TradeFooter', 200]);
      });
    },
    // 获取当前的数值
    creatFocus(data) {
      this.nowNum = data;
    },
    // 添加明细
    dataCreat() {
      this.dialogOptions.isShowDialog = true;
    },
    // 生成采购计划模板
    dataCplan(data) {
      this.$prompt('请输入采购计划名称', '生成采购计划', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.+$/,
        inputErrorMessage: '采购计划名称不能为空',
      }).then(({ value }) => {
        let datelist = [];
        datelist = Object.assign(data);
        for (let i = 0; i < datelist.length; i += 1) {
          if (datelist[i].purchaseNum === '' || datelist[i].purchaseNum === null || Number(datelist[i].purchaseNum) === 0) {
            this.$message({
              type: 'error',
              message: '数量不能为空或为0',
            });
            return;
          }
          datelist[i].id = 0;
        }
        this.loading = true;
        const from = {
          gpoId: this.getGpoId,
          id: 0,
          name: value,
          tmsPurchasePlanItemFormList: datelist,
        };
        PurchasePlan.create(from).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '采购计划模板生成成功',
            });
          }
          this.$refs.multipleTable.clearSelection();
          this.loading = false;
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入',
        });
      });
    },
    // 导入采购计划
    dataLplan() {
      this.dialogShops.isShowDialog = true;
    },
    // 删除明细操作
    deleteItem(res) {
      this.$confirm('确定要删除该明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.DeleteItem(res);
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
    // 关闭弹出框
    dialogShop() {
      this.dialogShops.isShowDialog = false;
    },
    // 获取数据列表
    dataList() {
      this.loading = true;
      if (typeof this.$route.query.id === 'undefined') {
        ShoppingCart.memberitem(this.getGpoId)
          .then((res) => {
            if (res.data.code === 0) {
              const data = res.data.result;
              this.exportId = data.id;
              let values;
              if (data.receiveAddress !== '' && data.receiveAddress) {
                values = [data.receiveAddressId, data.receiveAddress];
                values = JSON.stringify(values);
              } else {
                values = '';
              }
              const itemList = {
                code: data.code,
                createBy: `${data.createBy || ''} ${data.createTime || ''}`,
                createTime: data.createTime,
                hospitalName: data.hospitalMemberName,
                hospitalPerson: `${data.hospitalPerson || ''} ${data.hospitalPhone || ''}`,
                hospitalPhone: data.hospitalPhone,
                receiveAddress: values,
                remarks: data.remarks,
                type: data.type === 0 ? '普通订单' : '加急订单',
                id: data.id,
                name: data.name,
              };
              this.ItemList(itemList);
              data.tmsOrdersItemOutputList.item = 0;
              const content = data.tmsOrdersItemOutputList;
              if (content.length === 0) {
                this.Order_PlanfromEdit.receiveAddress = '';
                this.Order_PlanfromEdit.type = '普通订单';
              }
              for (let i = 0; i < data.tmsOrdersItemOutputList.length; i += 1) {
                const purchaseNum = content[i].purchaseNum;
                const ordersNum = content[i].ordersNum;
                content[i].purchaseNum = ordersNum;
                content[i].purchasableNum = purchaseNum;
                content[i].purchaseAmount = content[i].purchaseNum * content[i].hospitalUnitPrice;
              }
              this.GetItemDate(content);
            }
            this.loading = false;
          });
      } else {
        ShoppingCart.item(this.$route.query.id)
          .then((res) => {
            if (res.data.code === 0) {
              const data = res.data.result;
              this.exportId = data.id;
              const itemList = {
                code: data.code,
                createBy: data.createBy,
                createTime: data.createTime,
                hospitalName: data.hospitalMemberName,
                hospitalPerson: data.hospitalPerson,
                hospitalPhone: data.hospitalPhone,
                receiveAddress: data.receiveAddress,
                remarks: data.remarks,
                type: data.type === 0 ? '普通订单' : '加急订单',
                id: data.id,
                name: data.name,
              };
              this.ItemList(itemList);
              data.tmsOrdersItemOutputList.item = 0;
              const content = data.tmsOrdersItemOutputList;
              for (let i = 0; i < data.tmsOrdersItemOutputList.length; i += 1) {
                const purchaseNum = content[i].purchaseNum;
                const ordersNum = content[i].ordersNum;
                content[i].purchaseNum = ordersNum;
                content[i].purchasableNum = purchaseNum;
                content[i].purchaseAmount = content[i].purchaseNum * content[i].hospitalUnitPrice;
              }
              this.GetItemDate(content);
            }
            this.loading = false;
          });
      }
    },
    //  获取当前用户的地址信息
    addressList() {
      ShoppingCart.addresslist(this.View_UserInfo.memberId)
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
          }
          addressList.reverse();
          this.editMessage.options.addressOption = addressList;
          // this.Order_PlanfromEdit.receiveAddress = '';
          this.loading = false;
        });
    },
    //  选择触发事件，根据所选数据判断btn是否禁用
    dataSelect(row) {
      let booldelete = false;
      let boolcplan = false;
      let first = 0;
      for (let i = 0; i < row.length; i += 1) {
        first += 1;
      }
      if (first > 0) {
        booldelete = false;
        boolcplan = false;
      } else {
        booldelete = true;
        boolcplan = true;
      }
      const btn = {
        orderDelete: booldelete,
        orderCplan: booldelete,
      };
      this.TradeSelect({ tradeRow: row, tradeBtn: btn });
    },
  },
};
</script>

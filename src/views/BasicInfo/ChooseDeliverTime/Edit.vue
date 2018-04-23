<template>
  <div v-loading="loading">
    <el-form :rules="editMessage.rules" label-width="100px" id="from-item" ref="form" :model="form" class="chooseDeliverTime">
      <TradeEditsForm :from-edit="form" :isCreatShow="true" :isDeleteItem="true" :salerList="true" :message="editMessage" :isGoBackShow="false" :arrow-num=5 :arrow-down="true" @data-creat="dataCreat" @delete-item="deleteItem" @show-more="showMore" @salerMember-list="salerListAll">
        <el-form-item label="卖方选配送时间" prop="salerTime" slot='salerTime' label-width="120px" class="producerTime">
          <el-date-picker v-model="salerTime" format="yyyy-MM-dd HH:mm:ss" type="datetimerange" :picker-options="pickerOptions2" placeholder="选择卖方选配送时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="配送确认时间" prop="deliveryTime" slot='deliveryTime' class="deliveryTime">
          <el-date-picker v-model="deliveryTime" format="yyyy-MM-dd HH:mm:ss" type="datetimerange" :picker-options="pickerOptions2" placeholder="选择配送确认时间"></el-date-picker>
        </el-form-item>
      </TradeEditsForm>
    </el-form>
    <div>
      <el-table :data="tableData" @selection-change="dataSelect" stripe border fit :height="View_TableHeight">
        <el-table-column type="selection" width="40" fixed="left" align="center">
        </el-table-column>
        <el-table-column prop="num1" label="#" width="40"></el-table-column>
        <el-table-column prop="drugsCode" min-width="90" label="药品编码" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" min-width="150" label="通用名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tradeName" min-width="80" label="商品名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="formName" min-width="90" label="剂型" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="specName" min-width="90" label="规格" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packSpecName" label="包装规格" align="left" min-width="90" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="unitName" label="单位" align="left" min-width="60" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="attributeName" label="规格属性" align="left" width="90" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packagesName" label="包装材质" align="left" width="90" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column prop="hospitalUnitPrice" label="单价" align="right" min-width="70" sortable="custom" show-overflow-tooltip>
        </el-table-column> -->
        <!--<el-table-column prop="gpoPrice" label="GPO单价" align="right" min-width="90" sortable="custom" show-overflow-tooltip v-if="getPrincipal.memberType !== 3 && getPrincipal.userFullName.substring(getPrincipal.userFullName.length - 3) !== 'sup'">
          </el-table-column>-->
        <el-table-column prop="qualityLevel" label="质量层次" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="producerName" label="生产企业" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="enrollName" label="卖方会员" align="left" min-width="180" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="approvalNumber" label="批准文号" align="left" min-width="130" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="projectSubName" label="集采子项目" align="left" min-width="100" sortable="custom" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugStandardCode" label="药品本位码" align="left" min-width="120" sortable="custom" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <TradeFooter class="trade" :authbtn="authbtn" :isSaveShow="true" :isBackShow="true" @order-save="orderSave('form')" @order-back="orderBack">
    </TradeFooter>
    <EditDialog :options="dialogOptions" @dialogSelect="dialogSelect"></EditDialog>
    <SalerMemberList></SalerMemberList>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TradeEditsForm from '../../../components/TradeEditsForm';
import ChooseDeliverTime from '../../../api/BasicInfo/ChooseDeliverTime';
import convert from '../../../utils/convert'; //  自定义转换js
import TradeFooter from '../../../components/TradeFooter';           // 引入底部组件
import project from '../../../api/BasicInfo/Project';   //  获取集采项目下拉接口
import EditDialog from './EditDialog';
import SalerMemberList from './SalerMemberList';

export default {
  activated() {
    this.authbtn = ChooseDeliverTime.authbtn();
    this.TableHeightRun(['.fromtrades', '.tradeFooter', '.search-find', 120]);
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/BasicInfo',
        name: '合同管理',
        noLink: true,
      },
      {
        path: '/BasicInfo/ChooseDeliverTime',
        name: '卖方补充配送时间设置',
        noLink: true,
      },
    ]);
    this.dataInit();
  },
  deactivated() {
  },
  created() {
    this.setBtnStatus(1);
  },
  watch: {
    authList() {
      this.authbtn = ChooseDeliverTime.authbtn();
    },
    getGpoId() {
      if (this.$route.path === '/BasicInfo/ChooseDeliverTime/Edit') {
        history.back();
      }
    },
    projectId(newinfo, oldinfo) {
      if (this.$route.path === '/BasicInfo/ChooseDeliverTime/Edit') {
        if (this.tableData.length) {
          if (this.changInfo) {
            this.changInfo = 0;
            return false;
          }
          this.changInfo += 1;
          this.form.projectId = oldinfo;
          this.$confirm('此操作将清空明细，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.tableData = [];
            this.changInfo = 1;
            this.setBtnStatus(0);
            this.form.projectId = newinfo;
          }).catch(() => {
            this.changInfo = 0;
            this.$message({
              type: 'info',
              message: '已取消操作',
            });
            // this.fromEdit.projectId = this.getProjectId; // 获取当前切换的集采项目号码
          });
        } else {
          this.setBtnStatus(0);
          this.changInfo = 0;
        }
      }
      return true;
    },
  },
  computed: {
    authList() {
      return this.$store.state.view.authList;
    },
    projectId() {
      return this.form.projectId;
    },
    getPrincipal() {
      return this.$store.state.view.principal;
    },
    ...mapGetters([
      'getGpoId',
      'Order_PlanItemList',
      'View_TableHeight',
      'View_UserInfo',
      'projectOptions',
    ]),
  },
  components: {
    TradeEditsForm,
    TradeFooter,
    EditDialog,
    SalerMemberList,
  },
  data() {
    // 配送确认时间
    const validateDeliveryTime = (rule, value, callback) => {
      let error = '';
      if (this.$data.deliveryTime) {
        if (!this.$data.deliveryTime[0] || !this.$data.deliveryTime[1]) {
          this.$data.editMessage.rules.deliveryTime[0].trigger = 'blur,change';
          error = callback(new Error('请选择配送确认时间范围'));
        } else {
          error = callback();
        }
      } else {
        error = callback(new Error('请选择配送确认时间范围'));
      }
      return error;
    };
    // 卖方选配送时间
    const validateSalerTime = (rule, value, callback) => {
      let error = '';
      if (this.$data.salerTime) {
        if (!this.$data.salerTime[0] || !this.$data.salerTime[1]) {
          this.$data.editMessage.rules.salerTime[0].trigger = 'blur,change';
          error = callback(new Error('请选择卖方选配送时间范围'));
        } else {
          error = callback();
        }
      } else {
        error = callback(new Error('请选择卖方选配送时间范围'));
      }
      return error;
    };
    return {
      tableData: [],
      changInfo: 0,
      // 新增药品弹框
      dialogOptions: {
        msgBase: '', //  没什么卵用，有需要可以看看
        isShowDialog: false, //  显示弹框
        tableSelected: [], //  默认表格选中
        tableType: 1, //  0 单选，1 多选 默认单选
        projectId: '',
        gpoMemberId: '',
        brr: [],
      },
      form: {
        projectId: '',
        deliveryTime: '',
        salerTime: '',
        remarks: '',
      },
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 7));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 30));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + (3600 * 1000 * 24 * 90));
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '无穷大',
          onClick(picker) {
            const end = new Date((new Date('9999-12-31').getTime() - (3600 * 1000 * 8)));
            const start = picker.minVisibleDate ?
              new Date(new Date(picker.minVisibleDate).getTime() - (3600 * 1000 * 8)) : new Date();
            picker.$emit('pick', [start, end]);
          },
        }],
      },
      isCreatShow: false, // 新增明细
      isDeleteItem: false, // 删除明细
      tableTitle: '添加明细',
      editMessage: {
        tabTitle: '',
        selects: [
          { label: '集采项目名称', key: 'projectId', type: 'el-select', option: 'projectOption', span: 6 },
          { value: 'salerTime', type: 'custom', span: 6 },
          { value: 'deliveryTime', type: 'custom', span: 6 },
          { label: '备注', key: 'remarks', span: 6, type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', rows: 1 },
        ],
        styleObject: {},
        parameters: {},
        options: {
          projectOption: [],
        },
        radios: {},
        rules: {
          projectId: [
            { required: true, type: 'number', message: '请选择集采项目', trigger: 'blur, change' },
          ],
          deliveryTime: [
            { required: true, validator: validateDeliveryTime, trigger: 'blur' },
          ],
          salerTime: [
            { required: true, validator: validateSalerTime, trigger: 'blur' },
          ],
        },
      },
      nowNum: 0, // 当前数量
      loading: false,
      authbtn: {},
      deleteIds: [],
      salerTime: [],
      deliveryTime: [],
    };
  },
  methods: {
    ...mapActions([
      'TableHeightRun',
      'Initialize',
      'ControltradeBtn',
      'TradeSelect',
      'DeleteItem',
    ]),
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['.fromtrades', '.tradeFooter', '.search-find', 120]);
      });
    },
    // 设置按钮状态
    setBtnStatus(type) {
      // type为1时  添加明细和保存禁用 否则可以点击
      if (type === 1) {
        const btn = {
          orderCreat: true,
          orderDelete: true,
        };
        this.ControltradeBtn(btn);
        const btnDisabled = {
          planSave: false,
        };
        this.$bus.$emit('data/tradefoot', btnDisabled);
      } else {
        const btn = {
          orderCreat: false,
          orderDelete: true,
        };
        this.ControltradeBtn(btn);
        const btnDisabled = {
          planSave: true,
        };
        this.$bus.$emit('data/tradefoot', btnDisabled);
      }
    },
    dataInit() {
      this.deleteIds = [];
      this.getProjectAll();
      if (!this.$route.query.id) {
        this.tableData = [];
        // this.form.projectId = '';
        this.salerTime = [];
        this.deliveryTime = [];
        this.form.remarks = '';
      } else {
        this.loading = true;
        ChooseDeliverTime.header(this.$route.query.id).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result[0];
            // this.form = data;
            this.form.projectId = data.projectId;
            // 配送确认时间
            let deliveryBtime = null;
            let deliveryEtime = null;
            if (data.deliveryBtime) {
              deliveryBtime = new Date(this.toDateTime(data.deliveryBtime));
            }
            if (data.deliveryEtime) {
              deliveryEtime = new Date(this.toDateTime(data.deliveryEtime));
            }
            this.deliveryTime = [deliveryBtime, deliveryEtime];
            // 卖方选配送时间
            let salerBtime = null;
            let salerEtime = null;
            if (data.salerBtime) {
              salerBtime = new Date(this.toDateTime(data.salerBtime));
            }
            if (data.salerEtime) {
              salerEtime = new Date(this.toDateTime(data.salerEtime));
            }
            this.salerTime = [salerBtime, salerEtime];
            this.form.remarks = data.remarks;
            ChooseDeliverTime.item(this.$route.query.id).then((res1) => {
              if (res1.data.code === 0) {
                const data1 = res1.data.result;
                this.tableData = data1;
                for (let i = 0; i < this.tableData.length; i += 1) {
                  this.tableData[i].num1 = i + 1;
                }
              }
              this.loading = false;
            });
          }
        });
      }
    },
    // 获取集采项目下拉
    getProjectAll() {
      this.editMessage.options.projectOption = this.projectOptions;
      if (this.getProjectId) {
        this.form.projectId = this.getProjectId;
        this.setBtnStatus(0);
      }
    },
    //  取时间戳
    toDateTime(str) {
      return convert.dateTime(str);
    },
    // 添加明细
    dataCreat() {
      const ids = [0];
      for (let i = 0; i < this.tableData.length; i += 1) {
        ids.push(this.tableData[i].drugsId);
      }
      this.dialogOptions.projectId = this.form.projectId;
      this.dialogOptions.gpoMemberId = this.getGpoId;
      this.dialogOptions.brr = ids;
      this.dialogOptions.isShowDialog = true;
    },
    // 查看卖方
    salerListAll() {
      const salerMemberNameArr = [];
      for (let i = 0; i < this.tableData.length; i += 1) {
        if (this.tableData[i].enrollName) {
          salerMemberNameArr.push(this.tableData[i].enrollName);
        }
      }
      const salerMemberNameArrOne = [];
      const salerMemberNameArrOneObj = {};
      for (let i = 0; i < salerMemberNameArr.length; i += 1) {
        if (!salerMemberNameArrOneObj[salerMemberNameArr[i]]) {
          salerMemberNameArrOneObj[salerMemberNameArr[i]] = 1;
          salerMemberNameArrOne.push(salerMemberNameArr[i]);
        }
      }
      this.$bus.$emit('data/salerMemberList', salerMemberNameArrOne);
    },
    // 弹出框选择之后确定事件
    dialogSelect(rows, msgBase, msgCom) {
      for (let i = 0; i < rows.length; i += 1) {
        this.$set(rows[i], 'drugsId', rows[i].id);
        this.tableData.push(rows[i]);
      }
      for (let i = 0; i < this.tableData.length; i += 1) {
        this.tableData[i].num1 = i + 1;
      }
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    orderSave(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.dataDelete();
        } else {
          return false;
        }
        return true;
      });
    },
    dataDelete() {
      const form = {
        id: this.deleteIds,
      };
      ChooseDeliverTime.deletes(form).then((res) => {
        if (res.data.code === 0) {
          this.dataSave();
        }
      });
    },
    dataSave() {
      const tmsSalerDeliveryTimeItemForms = [];
      for (let i = 0; i < this.tableData.length; i += 1) {
        // 只传新增的
        if (!this.tableData[i].itemId) {
          tmsSalerDeliveryTimeItemForms.push(this.tableData[i].drugsId);
        }
      }
      const form = {
        deliveryBtime: convert.convertDateNew(this.deliveryTime[0], 1),
        deliveryEtime: convert.convertDateNew(this.deliveryTime[1], 1),
        salerBtime: convert.convertDateNew(this.salerTime[0], 1),
        salerEtime: convert.convertDateNew(this.salerTime[1], 1),
        projectId: this.form.projectId,
        remarks: this.form.remarks,
        id: this.$route.query.id ? this.$route.query.id : 0,
        tmsSalerDeliveryTimeItemForm: tmsSalerDeliveryTimeItemForms,
      };
      // console.log('保存', form);
      this.loading = true;
      ChooseDeliverTime.create(form).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功',
          });
          this.$bus.$emit('data/list');
          this.orderBack();
        }
        this.loading = false;
      });
    },
    orderBack() {
      history.back();
    },
    // 删除明细操作
    deleteItem(res) {
      this.$confirm('确定要删除该明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // this.DeleteItem(res);
        this.deleteIds = [];
        for (let i = 0; i < this.tableData.length; i += 1) {
          for (let j = 0; j < res.length; j += 1) {
            if (Number(res[j].drugsId) === Number(this.tableData[i].drugsId)) {
              // 如果有itemId说明是不是新添加的，存起来
              this.tableData.splice(i, 1);
              if (res[j].itemId) {
                this.deleteIds.push(res[j].itemId);
              }
            }
          }
        }
        for (let i = 0; i < this.tableData.length; i += 1) {
          this.tableData[i].num1 = i + 1;
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
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
.producerTime input.el-input__inner {
  height: 30px !important;
}

.deliveryTime input.el-input__inner {
  height: 30px !important;
}

.chooseDeliverTime .fromtrade-div {
  height: 50px;
}
</style>

<template>
  <div v-loading="loading">
    <el-form :rules="editMessage.rules" label-width="120px" id="from-item">
      <TradeEditsForm :from-edit="fromEdit" :isCreatShow="true" :isDeleteItem="true" :message="editMessage" :isGoBackShow="false" :arrow-num=4 :arrow-down="true" @delete-item="deleteItem" @data-creat="dataCreat" @show-more="showMore">
        <el-form-item label="附件" slot="scanFile">
          <y-upload-edit :image="true" :pdf="false" :fileList="uploadData" @upload-result="uploadResult" :isDisabled="isUploadDisabled"></y-upload-edit>
        </el-form-item>
      </TradeEditsForm>
    </el-form>
    <div>
      <el-table :data="tableData" @selection-change="dataSelect" stripe border fit :height="View_TableHeight" @sort-change="sortChange">
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column prop="num" label="#" width="40" show-overflow-tooltip :formatter="sortTable"></el-table-column>
        <el-table-column prop="drugsCode" width="80" label="药品编码" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="drugsName" width="120" label="通用名称" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tradeName" min-width="90" label="商品名" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="specName" width="80" label="规格" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packSpecName" width="80" label="包装规格" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="formName" min-width="80" label="剂型" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="unitName" min-width="50" label="单位" sortable show-overflow-tooltip>
        </el-table-column>
        <!--<el-table-column prop="hospitalUnitPrice" min-width="80" label="单价" align="right" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column min-width="80" label="金额" align="right" sortable show-overflow-tooltip>
        </el-table-column>-->
        <el-table-column prop="deliveryMemberName" min-width="120" label="配送企业" show-overflow-tooltip>
          <template scope="scope">
            <el-button type="text" @click="choose(scope.row)">选择 </el-button>
            <el-button type="text" @click="alreadyChoosed(scope.row)">查看 ({{scope.row.brr.length + scope.row.crr.length}}) </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="producerName" min-width="160" label="生产企业" sortable show-overflow-tooltip>
        </el-table-column>
        <!--<el-table-column prop="attributeName" label="规格属性" align="left" min-width="80" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="packagesName" label="包装材质" align="left" min-width="80" sortable show-overflow-tooltip>
        </el-table-column>-->
        <el-table-column prop="approvalNumber" width="130" label="批准文号" sortable show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <TradeFooter class="trade" :isSaveShow="true" :isBackShow="true" :isSubmitShow="true" @order-save="orderSave" @data-submit="orderSubmit" @order-back="orderBack">
    </TradeFooter>
    <AddDetail :options="dialogOptions" @dialog-hide="dialogHide"></AddDetail>
    <ChooseDelivery :options="dialogOptionsOne"></ChooseDelivery>
    <Choosed :options="dialogOptionsTwo"></Choosed>
    <Enterprise></Enterprise>
  </div>
</template>

<script>
/**
 * Created by dingyiming on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import TradeEditsForm from '../../../components/TradeEditsForm';        //  引订单目录表单
import AddDetail from './AddDetail';                    //  引订单目录表单
import ChooseDelivery from './ChooseDelivery';                    //  选择配送企业
import Choosed from './Choosed';                    //  选择配送企业
import Enterprise from './Enterprise';
import Table from '../../../utils/tableHeight';                         //  重新计算高度
import ProducerContinueChoseDelivery from '../../../api/Deliverrelation/ProducerContinueChoseDelivery';
import TradeFooter from '../../../components/TradeFooter';           // 引入底部组件
import convert from '../../../utils/convert'; //  自定义转换js

export default {
  activated() {
    this.tableData = [];
    this.deliveryIdArr = [];
    this.fromEdit.remarks = '';
    this.isUploadDisabled = false;
    this.uploadData = [];
    this.TableHeightRun(['.fromtrades', '.tradeFooter', 120]);
    // 获取添加的明细
    this.$bus.$on('data/rows', this.getRows);
    this.$bus.$on('data/deliveryChoose', this.deliveryChoose);
    this.$bus.$on('project/getAll', this.getProjectAll);
    this.getProjectAll();
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Deliverrelation',
        name: '配送关系管理',
        noLink: true,
      },
      {
        path: '/Deliverrelation/ProducerContinueChoseDelivery',
        name: '卖方补充配送',
        noLink: true,
      },
    ]);
    // if (this.getGpoId && this.getProjectId) {
    //   this.fromEdit.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
    // }
  },
  deactivated() {
    this.$bus.$off('project/getAll', this.getProjectAll);
    this.$bus.$off('data/rows', this.getRows);
    this.$bus.$off('data/deliveryChoose', this.deliveryChoose);
  },
  computed: {
    projectId() {
      return this.fromEdit.projectId;
    },
    ...mapGetters([
      'View_TableHeight',
      'getGpoId',
      'projectOptions',
      'getProjectId',
      'View_UserInfo',
    ]),
  },
  watch: {
    scanFile() {
      if (this.scanFile === 0) {
        this.TableHeightRun(['#from-item', '.TradeFooter', 300]);
        // console.log();
      } else {
        this.TableHeightRun(['#from-item', '.TradeFooter', 320]);
      }
    },
    uploadData() {
      this.TableHeightRun(['.el-form', '.TradeFooter', 200]);
      if (this.uploadData.length === 0) {
        this.TableHeightRun(['.el-form', '.TradeFooter', 180]);
      }
    },
    getGpoId() {
      // 当切换gpo时，重定向到列表页
      this.$router.push({ path: '/Deliverrelation/ProducerContinueChoseDelivery/Create' });
    },
    projectId(newinfo, oldinfo) {
      for (let i = 0; i < this.editMessage.options.projectOption.length; i += 1) {
        if (newinfo === this.editMessage.options.projectOption[i].value) {
          this.projectName = this.editMessage.options.projectOption[i].label;
        }
      }
      if (this.$route.path === '/Deliverrelation/ProducerContinueChoseDelivery/Create') {
        if (this.tableData.length) {
          if (this.changInfo) {
            this.changInfo = 0;
            return;
          }
          this.changInfo += 1;
          this.fromEdit.projectId = oldinfo;
          this.$confirm('此操作将清空明细，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.tableData = [];
            this.changInfo = 1;
            this.fromEdit.projectId = newinfo;
            for (let i = 0; i < this.editMessage.options.projectOption.length; i += 1) {
              if (newinfo === this.editMessage.options.projectOption[i].value) {
                this.projectName = this.editMessage.options.projectOption[i].label;
              }
            }
          }).catch(() => {
            this.changInfo = 0;
            this.$message({
              type: 'info',
              message: '已取消操作',
            });
            for (let i = 0; i < this.editMessage.options.projectOption.length; i += 1) {
              if (oldinfo === this.editMessage.options.projectOption[i].value) {
                this.projectName = this.editMessage.options.projectOption[i].label;
              }
            }
            // this.fromEdit.projectId = this.getProjectId; // 获取当前切换的集采项目号码
          });
        } else {
          this.changInfo = 0;
        }
      }
    },
    deep: true,
  },
  components: {
    AddDetail,
    TradeEditsForm,
    TradeFooter,
    ChooseDelivery,
    Choosed,
    Enterprise,
  },
  data() {
    return {
      uploadData: [], //  上传文件
      scanFile: null, // 根据附件来判断表格高度的设置
      isUploadDisabled: true,
      tableTitle: '添加明细',
      editMessage: {
        selects: [
          { label: '申请单号', key: 'code', type: 'el-input', placeholder: '', span: 5, isReadonly: true },
          { label: '卖方会员', key: 'hospitalName', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
          { label: '联系人', key: 'hospitalPerson', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
          { label: '', key: 'contractStatus', type: 'el-input', fromStyle: 'style2', noborder: 'true', span: 5, belWidth: '55px', isReadonly: true },
          { label: '集采项目名称', key: 'projectId', type: 'el-select', option: 'projectOption', span: 5 },
          { label: '创建时间', key: 'createTime', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
          // { label: '联系电话', key: 'hospitalPhone',
          // type: 'el-input', placeholder: '请输入联系电话', isReadonly: true, span: 8 },
          { label: '审核人', key: 'deliveryMemberName', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
          { label: '审核时间', key: 'deliveryPerson', type: 'el-input', placeholder: '', isReadonly: true, span: 5 },
          // { label: '联系电话', key: 'deliveryPhone',
          // type: 'el-input', placeholder: '请输入联系电话', isReadonly: true, span: 8 },
          { value: 'scanFile', type: 'custom', span: 5, md: 20, sm: 24, isReadonly: true },
          { label: '备注', key: 'remarks', span: 15, type: 'el-input', placeholder: '请输入备注', fromType: 'textarea', rows: 1 },
        ],
        tabTitle: '',
        styleObject: {
          style1: {
            width: '90%',
          },
          style2: {
            width: '70%',
          },
        },
        options: {
          projectOption: [],
        },
        radios: {},
        parameters: {},
        rules: {
          projectId: [
            { required: true, message: '请输入集采项目', trigger: 'blur' },
          ],
        },
      },
      authbtn: {
        create: false,
      },
      fromEdit: {
        contractStatus: '待提交',
        code: '',
        hospitalMemberName: '',
        hospitalPerson: '',
        hospitalPhone: '',
        deliveryMemberName: '',
        deliveryPerson: '',
        deliveryPhone: '',
        amount: '',
        validBtime: '',
        validEtime: '',
        createTime: '',
        remarks: '',
      },
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        projectId: null,
        gpoMemberId: null,
        drugsarrs: '',
      },
      dialogOptionsOne: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        projectId: null,
        gpoMemberId: null,
        drugsId: null,
        id: null,
        memberarrs: [],
      },
      dialogOptionsTwo: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        projectId: null,
        gpoMemberId: null,
        drugsId: null,
        delivearrid: '',
        itemId: '',
      },
      loading: false,
      tableData: [],
      tableCount: 0,
      tableNum: [],
      selectData: [],
      deleteids: [],
      page: 0,
      size: 15,
      percentage: 0,
      projectName: '',
      deliveryIdArr: [],
      brrArray: [],
      memberArr: [],
      drugsarrs: [],
      brrObj: {},
    };
  },
  methods: {
    ...mapActions([
      'TableHeightRun',
      'GetDetailDate',
      'Initialize',
      'TradeSelect',
      'CountNum',
      'DeleteItem',
    ]),
    // 上传
    uploadResult(res) {
      this.fromEdit.scanFile = res;
      this.uploadData = this.convert.getJSON(this.fromEdit.scanFile);
    },
    //  每次点击排序都会触发
    sortChange() {
      this.tableCount = 0;
    },
    //  进行排序时返回每一行
    sortTable(row, column) {
      if (this.tableCount < this.tableData.length) {
        for (let i = 0; i < this.tableData.length; i += 1) {
          const item = this.tableData[i];
          if (row.drugsId === item.drugsId) {
            this.tableData[i].num = this.tableNum[this.tableCount];
            break;
          }
        }
        this.tableCount += 1;
      }
      return row.num;
    },
    //  json字符串转json，否则还是返回字符串
    toJSON(str) {
      return convert.toJSON(str);
    },
    // 重新计算表格高度
    showMore() {
      this.$nextTick(() => {
        this.TableHeightRun(['.fromtrades', '.tradeFooter', 120]);
      });
    },
    // 获取添加的明细
    getRows(rows) {
      this.tableData = this.tableData.concat(rows);
      // for (let i = 0; i < this.tableData.length; i += 1) {
      //   this.tableData[i].num = i + 1;
      // }
      this.tableNum = [];
      this.tableCount = 0;
      for (let i = 0; i < this.tableData.length; i += 1) {
        // data.content[i].num = (i + 1) + (cpage * cpageSizes);
        const numX = i + 1;
        // this.tableData[i].num = i + 1;
        this.tableData[i].num = numX;
        this.tableNum.push(numX);
        this.tableData[i].drugsId = this.tableData[i].id;
        this.tableData[i].protocolPrice = this.tableData[i].hospitalUnitPrice;
      }
    },
    deliveryChoose(data, drugsId) {
      this.brrArray = [];
      this.memberArr = [];
      this.delivearrid = [];
      for (let i = 0; i < this.tableData.length; i += 1) {
        // this.memberArr = this.tableData[i].memberarrs.split(',');
        this.memberArr = this.tableData[i].memberarrs ? this.tableData[i].memberarrs.split(',') : [];
        this.delivearrid = this.tableData[i].delivearrid ? this.tableData[i].delivearrid.split(',') : [];
        if (drugsId === this.tableData[i].drugsId) {
          for (let j = 0; j < data.length; j += 1) {
            this.delivearrid.push(data[j].id);
            this.brrObj = {
              deliveryMemberCode: data[j].enterpriseCode,
              deliveryMemberId: data[j].id,
              deliveryMemberName: data[j].enterpriseUsedName,
            };
            this.brrArray.push(this.brrObj);
            // this.deliveryIdString = this.deliveryIdArr.toString();
            this.memberArr.push(data[j].id);
          }
          this.tableData[i].delivearrid = this.delivearrid.toString();
          this.tableData[i].brr = this.tableData[i].brr.concat(this.brrArray);
          this.tableData[i].memberarrs = this.memberArr.toString();
        }
      }
    },
    // 删除明细操作
    deleteItem() {
      this.$confirm('确定要删除该明细吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        for (let i = 0; i < this.deleteids.length; i += 1) {
          for (let j = 0; j < this.tableData.length; j += 1) {
            if (this.deleteids[i] === this.tableData[j].drugsId) {
              this.tableData.splice(j, 1);
            }
          }
        }
        for (let i = 0; i < this.tableData.length; i += 1) {
          this.tableData[i].num = i + 1;
        }
        // this.purchaseAmounts = 0;
        // this.purchaseNums = 0;
        // for (let i = 0; i < this.tableData.length; i += 1) {
        //   this.purchaseAmounts += Number(this.tableData[i].purchaseAmount);
        //   this.purchaseNums += this.tableData[i].purchaseNum;
        //   this.tableData[i].num = i + 1;
        // }
        // // console.log();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    // 添加明细
    dataCreat() {
      if (!this.fromEdit.projectId) {
        this.$message({
          type: 'error',
          message: '请先选择集采项目',
        });
        return false;
      }
      this.drugsarrs = [];
      for (let i = 0; i < this.tableData.length; i += 1) {
        this.drugsarrs.push(this.tableData[i].drugsId);
      }
      this.dialogOptions.gpoMemberId = this.getGpoId;
      this.dialogOptions.projectId = this.fromEdit.projectId;
      this.dialogOptions.drugsarrs = this.drugsarrs.toString();
      this.dialogOptions.isShowDialog = true;
      return true;
    },
    // 选择配送企业
    choose(row) {
      this.dialogOptionsOne.gpoMemberId = this.getGpoId;
      this.dialogOptionsOne.projectId = this.fromEdit.projectId;
      this.dialogOptionsOne.drugsId = row.drugsId;
      this.dialogOptionsOne.memberarrs = row.memberarrs;
      this.dialogOptionsOne.id = this.$route.query.id;
      this.dialogOptionsOne.isShowDialog = true;
    },
    // 已选配送企业
    alreadyChoosed(row) {
      this.dialogOptionsTwo.gpoMemberId = this.getGpoId;
      this.dialogOptionsTwo.projectId = this.fromEdit.projectId;
      this.dialogOptionsTwo.drugsId = row.drugsId;
      this.dialogOptionsTwo.delivearrid = row.delivearrid;
      this.dialogOptionsTwo.itemId = row.id;
      this.dialogOptionsTwo.isShowDialog = true;
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
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
      this.deleteids = [];
      for (let i = 0; i < row.length; i += 1) {
        this.deleteids.push(row[i].drugsId);
      }
    },
    // 获取集采项目下拉
    getProjectAll() {
      if (this.getGpoId) {
        ProducerContinueChoseDelivery.all(this.getGpoId).then((res) => {
          if (res.data.code === 0) {
            const projectOptions = [];
            const data = res.data.result.content;
            for (let i = 0; i < data.length; i += 1) {
              projectOptions.push({
                label: data[i].projectName,
                value: data[i].projectId,
              });
              if (this.getProjectId && this.getProjectId === data[i].projectId) {
                this.projectName = data[i].projectName;
              }
            }
            this.editMessage.options.projectOption = projectOptions;
          }
        });
      }
    },
    //  保存
    orderSave() {
      if (this.fromEdit.remarks && this.fromEdit.remarks.length > 256) {
        this.$message({
          type: 'error',
          message: '备注不得超过256位字符',
        });
        return false;
      }
      if (!this.fromEdit.projectId) {
        this.$message({
          type: 'error',
          message: '集采项目不能为空',
        });
        return false;
      }
      if (this.tableData.length === 0) {
        this.$message({
          type: 'error',
          message: '明细不能为空',
        });
        return false;
      }
      for (let i = 0; i < this.tableData.length; i += 1) {
        if (!this.tableData[i].delivearrid) {
          this.$message({
            type: 'error',
            message: '当前有药品未选择配送企业',
          });
          return false;
        }
      }
      this.loading = true;
      if (this.$route.path === '/Deliverrelation/ProducerContinueChoseDelivery/Create') {
        const form = {
          arr: this.tableData,
          gpoMemberId: this.getGpoId,
          projectId: this.fromEdit.projectId,
          projectName: this.projectName,
          scanFile: this.fromEdit.scanFile,
          lxtype: 0,
          remarks: this.fromEdit.remarks,
        };
        ProducerContinueChoseDelivery.create(form).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新增成功',
            });
            this.$bus.$emit('data/list');
            history.back();
          }
          this.loading = false;
        });
      }
      return true;
    },
    //  保存
    orderSubmit() {
      if (this.fromEdit.remarks && this.fromEdit.remarks.length > 256) {
        this.$message({
          type: 'error',
          message: '备注不得超过256位字符',
        });
        return false;
      }
      if (!this.fromEdit.projectId) {
        this.$message({
          type: 'error',
          message: '集采项目不能为空',
        });
        return false;
      }
      if (this.tableData.length === 0) {
        this.$message({
          type: 'error',
          message: '明细不能为空',
        });
        return false;
      }
      for (let i = 0; i < this.tableData.length; i += 1) {
        if (!this.tableData[i].delivearrid) {
          this.$message({
            type: 'error',
            message: '当前有药品未选择配送企业',
          });
          return false;
        }
      }
      this.loading = true;
      if (this.$route.path === '/Deliverrelation/ProducerContinueChoseDelivery/Create') {
        const form = {
          arr: this.tableData,
          gpoMemberId: this.getGpoId,
          projectId: this.fromEdit.projectId,
          projectName: this.projectName,
          scanFile: this.fromEdit.scanFile,
          lxtype: 1,
        };
        ProducerContinueChoseDelivery.submit(form).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新增成功',
            });
            this.$bus.$emit('data/list');
            history.back();
          }
          this.loading = false;
        });
      }
      return true;
    },
    orderBack() { // 返回按钮触发事件
      if (this.tableData.length) {
        this.$confirm('存在未保存的明细数据，确定返回吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.$bus.$emit('data/list');
          history.back();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
      } else {
        this.$bus.$emit('data/list');
        history.back();
      }
    },
  },
};
</script>
<style>
.trade {
  position: relative !important;
}

.space-steps {
  margin-bottom: 10px;
}































/*.out-num .el-input__inner {
  color: red;
}*/
</style>

<template >
  <div v-loading="loading">
    <el-form :rules="editMessage.rules" label-width="70px" id="from-item">
      <TradeEditsForm :from-edit="fromEdit" :authbtn="authbtn" :isGoBackShow="false" :message="editMessage" :arrow-num=4 :arrow-down="true" :is-readonly="isReadonly">
      </TradeEditsForm>
    </el-form>
    <div>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="16">
          <div class="deliver">
            <Find :showNum="3" :message="message"></Find>
            <div class="statistics">
              已建立配送协议医院
              <el-button type="text" @click="specific(null)" class="choosenumber">{{nametypeAll}}</el-button> 家 , 已选
              <el-button type="text" @click="specific(1)" class="choosenumber">{{nametypeYes}}</el-button> 家 , 未选
              <el-button type="text" @click="specific(0)" class="choosenumber">{{nametypeNo}}</el-button> 家
            </div>
            <ChooseShow :authbtn="authbtn" :tableHeight="tableHeight" @page="dataPage"></ChooseShow>
            <Paging :page="page" :size="size" :total="total"></Paging>
          </div>
        </el-col>
        <el-col :span="8" align="right">
          <el-row style="width: 90%">
            <el-col :span="24" align="left">
              <div class="alreadyChoose">已选配送企业</div>
            </el-col>
          </el-row>
          <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 90%" :height="tableHeight" @sort-change="sortChange">
            <el-table-column prop="deliveryMemberCode" label="配送企业编码" width="100" sortable="custom" align="center" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="deliveryMemberName" label="配送企业名称" sortable="custom" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="center" width="50" v-if="authbtn.submit">
              <template scope="scope">
                <el-button type="text" @click="close(scope.row, scope.$index)">
                  <i class="el-icon-minus"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <TradeFooter :authbtn="authbtn" :isSaveShow="isSaveShow" :isBackShow="isBackShow" @order-save="orderSave" @order-back="orderBack"></TradeFooter>
    <Coverage :options="dialogOptions"></Coverage>
    <Specific :options="dialogOptions"></Specific>
    <NoChoosed :options="dialogOptions"  @nochoose-confim="orderSave1"></NoChoosed>
  </div>
</template>

<script>
/**
 * Created by yaoling on 2017/9/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import TradeEditsForm from '../../../components/TradeEditsForm';        //  引订单目录表单
import Find from '../../../components/Find';
import Coverage from './Coverage';   // 覆盖率弹出框
import Specific from './Specific';   // 药品独配弹出框
import ChooseShow from './ChooseShow';
import NoChoosed from './NoChoosed';    // 提示还有未选配送协议的弹框
import TradeFooter from '../../../components/TradeFooter'; // 引入底部
import ProducerChoseDelivery from '../../../api/Deliverrelation/ProducerChoseDelivery';    // api

export default {
  activated() {
    this.authbtn = ProducerChoseDelivery.authbtn();
    this.deliveryLimitNum = 0;
    this.dataInit();
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
        path: '/ProducerChoseDelivery',
        name: '卖方选择配送企业',
        noLink: true,
      },
      {
        path: '/ChooseDeliver',
        name: '选择配送企业',
        noLink: true,
      },
    ]);
    // 监听选择的数目
    this.$bus.$on('data/result', this.dataResult);
    // 监听数据更新
    this.$bus.$on('data/enterpriseList', this.enterpriseList);
    //      this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('chooseData', this.chooseData);
    this.$bus.$on('data/list', this.datachange);
    this.$bus.$on('page/change', this.pageChange);
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
    // this.dataList();
  },
  deactivated() {
    // 监听选择的数目
    this.$bus.$off('data/result', this.dataResult);
    // 监听数据更新
    this.$bus.$off('data/enterpriseList', this.enterpriseList);
    this.$bus.$off('chooseData', this.chooseData);
    this.$bus.$off('data/list', this.datachange);
    this.$bus.$off('page/change', this.pageChange);
    //      this.$bus.$off('components/Find', this.dataSearch);
  },
  computed: {
    ...mapGetters([
      'getGpoId',
      'gpoOptions',
      'View_UserInfo',
    ]),
    authList() {
      return this.$store.state.view.authList;
    },
  },
  watch: {
    authList() {
      this.authbtn = ProducerChoseDelivery.authbtn();
      // console.log();
    },
  },
  components: {
    TradeEditsForm,
    Find,
    Coverage,
    ChooseShow,
    TradeFooter,
    Specific,
    NoChoosed,
  },
  data() {
    return {
      authbtn: {},              //  识别用户拥有的权限
      tableHeight: 200,
      tableData: [],
      tableDataOld: [],
      tableOptions: [                   //  要显示的表格列，默认开启选择框、num
        {
          key: 'enterpriseCode',
          name: '配送企业编码',
        },
        {
          key: 'enterpriseUsedName',
          name: '配送企业名称',
        },
      ],
      multipleSelection: [],
      message: [
        {
          key: 'enterpriseCode',
          label: '配送企业编码',
          placeholder: '请输入配送企业编码',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'enterpriseUsedName',
          label: '配送企业名称',
          placeholder: '请输入配送企业名称',
          hasOp: false,
          type: 0,
          selects: [],
        },
        {
          key: 'region',
          label: '所在地区',
          placeholder: '请选择省市',
          hasOp: false,
          type: 3,
          selects: [],
        },
      ],
      num: 4, // 总数量
      // 覆盖率弹出框
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
      },
      // 独配弹出框
      dialogOptions1: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
      },
      // 点击保存有未选独配提示弹出框
      dialogOptions2: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
      },
      fromEdit: {
        drugsCode: '',
        drugsName: '',
        formName: '',
        specName: '',
        packSpecName: '',
        unitName: '',
        drugsId: '',
      },
      editMessage: {
        tabTitle: '',
        selects: [
          { label: '药品编码', key: 'drugsCode', type: 'el-input', isReadonly: true, span: 5 },
          { label: '通用名', key: 'drugsName', type: 'el-input', isReadonly: true, span: 5 },
          { label: '剂型', key: 'formName', type: 'el-input', isReadonly: true, span: 5 },
          { label: '规格', key: 'specName', type: 'el-input', isReadonly: true, span: 5 },
          { label: '包装规格', key: 'packSpecName', type: 'el-input', isReadonly: true, span: 5 },
          { label: '单位', key: 'unitName', type: 'el-input', isReadonly: true, span: 5 },
        ],
        styleObject: {},
        options: {},
        radios: {},
        rules: {},
      },
      loading: false,
      selectData: [],
      formAll: {},
      formAlready: {},
      formNo: {},
      // 需要提交的字段
      forms: {
        drugsId: null,
        gpoMemberId: null,
        projectId: null,
        salerMemberCode: null,
        salerMemberId: null,
        salerMemberName: null,
        memberList: {
          deliveryMemberCode: null,
          deliveryMemberId: null,
          deliveryMemberName: null,
        },
      },
      filterForm: {
        projectId: null,
        gpoMemberId: null,
        drugsId: null,
        salerMemberId: null,
        hospitalMemberId: null,
        enterpriseCode: null,
        enterpriseUsedName: null,
        region: null,
        nameType: null,
      },
      dialogFormVisible: false,
      page: 0,
      size: 5,
      total: 0,
      isSaveShow: false, // 保存按钮
      isBackShow: true, // 返回按钮
      isReadonly: false,                      //  是否只读
      nametypeAll: 0,         //  选择配送企业的全部数量
      nametypeYes: 0,         //  选择配送企业的可选数量
      nametypeNo: 0,         //  选择配送企业的未选数量
      enterpriseCode: '',     // 已选择配送企业编码
      enterpriseUsedName: '',     // 已选择配送企业名称
      memberList: {},
      ids: [],
      resObj: {},
      resArr: [],
      projectId: this.getProjectId,
      leftTable: [],
      deleteid: [],
      deletedidObj: {},
      deliveryMemberIds: [],
      deliveryLimitNum: '',
      gid: '',
      pid: '',
      did: '',
    };
  },
  methods: {
    chooseData(table, deliveryLimitNum) {
      this.leftTable = table;
      this.deliveryLimitNum = deliveryLimitNum;
    },
    //  每次点击排序都会触发
    sortChange(rule) {
      if (rule.order) {
        const tableData = this.convert.tableSort(rule, this.tableData);
        this.tableData = [...tableData];
      } else {
        this.tableData = [...this.tableDataOld];
      }
    },
    // 获取当前页面、当前页、总数
    dataPage(page, size, total) {
      this.page = page;
      this.size = size;
      this.total = total;
    },
    // 条目数切换
    datachange(page, size) {
      this.size = size;
      this.$bus.$emit('data/tableData', this.tableData, page, size);
    },
    // 页码切换
    pageChange(page) {
      this.$bus.$emit('data/tableData', this.tableData, page, this.size);
    },
    // 初始化
    dataInit() {
      this.nametypeAll = 0;
      this.nametypeYes = 0;
      this.nametypeNo = 0;
      this.deliveryMemberIds = [];
      if (this.View_UserInfo.memberType === 1 || this.View_UserInfo.memberType === 2) {
        this.isSaveShow = true;
      }
      const pid = this.$route.query.pid;
      if (!pid) {
        this.$router.back();
      }
      this.projectId = pid;
      this.loading = true;
      if (!this.$route.query.id) {
        this.loading = false;
        return false;
      }
      ProducerChoseDelivery.item(this.$route.query.id).then((res) => {
        if (res.data.code === 0) {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.fromEdit = Object.assign({}, data);
            this.fromEdit.drugsId = data.id;
          }
          this.getChoosed();
        }
        this.loading = false;
      });
      return true;
    },
    getChoosed() {
      // this.loading = true;
      // this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      this.did = this.fromEdit.drugsId;
      this.pid = this.projectId;
      this.gid = this.getGpoId;
      ProducerChoseDelivery.deliverList(this.pid, this.gid, this.did)
        .then((res) => {
          if (res.data.code === 0) {
            this.tableData = res.data.result;
            this.tableDataOld = res.data.result;
            // setTimeout(() => {
            //   this.$bus.$emit('dialogList/select');
            // }, 0);
            this.deleteid = [];
            for (let j = 0; j < this.tableData.length; j += 1) {
              this.deleteid.push(this.tableData[j].deleteid);
            }
            this.getDrugsNumber();
            this.$bus.$emit('data/tableData', this.tableData);
          }
        });
    },
    // 查看独配
    specific(data) {
      this.tableDataId = [];
      for (let j = 0; j < this.tableData.length; j += 1) {
        this.tableDataId.push(parseFloat(this.tableData[j].deliveryMemberId));
      }
      this.formAll = Object.assign({}, this.formAll, {
        drugsId: this.fromEdit.drugsId,
        projectId: this.projectId,
        gpoMemberId: this.getGpoId,
        nameType: data,
        deliveryMemberId: this.tableDataId.toString(),
      });
      this.$bus.$emit('data/getId', this.formAll);
    },
    enterpriseList(row) {
      this.tableData.unshift(row);
      this.deliveryMemberIds.push(parseInt(row.deliveryMemberId, 0));
      this.getDrugsNumber();
      for (let i = 0; i < this.tableData.length; i += 1) {
        const item = this.tableData[i];
        this.ids.push(item.deleteid);
        // 遍历数组
        const idss = [];
        for (let j = 0; j < this.ids.length; j += 1) {
          if (idss.indexOf(this.ids[j]) === -1) {  // 判断在s数组中是否存在，不存在则push到s数组中
            idss.push(this.ids[j]);
          }
        }
        this.ids = idss;
      }
    },
    // 点击-减掉tableData里的数据
    close(row, num) {
      this.tableData.splice(num, 1);
      for (let j = 0; j < this.deliveryMemberIds.length; j += 1) {
        if (parseInt(row.deliveryMemberId, 0) === this.deliveryMemberIds[j]) {
          this.deliveryMemberIds.splice(num, 1);
        }
      }
      this.getDrugsNumber();
      this.$bus.$emit('data/num', row.deliveryMemberCode);
    },
    // 获取建立配送协议的医院选择数量
    getDrugsNumber(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.tableDataId = [];
      // console.log();
      for (let j = 0; j < this.tableData.length; j += 1) {
        this.tableDataId.push(parseFloat(this.tableData[j].deliveryMemberId));
      }
      // 获取总数量
      this.form = Object.assign({}, this.form, {
        drugsId: this.fromEdit.drugsId,
        projectId: this.projectId,
        gpoMemberId: this.getGpoId,
        deliveryMemberId: this.tableDataId.toString(),
      });
      ProducerChoseDelivery.drugsNumber(cpage, cpageSizes, this.form).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result.content;
          this.nametypeAll = data[0].nametypeAll;
          this.nametypeYes = data[0].nametypeYes;
          this.nametypeNo = data[0].nametypeNo;
        }
        this.loading = false;
      });
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
      this.$bus.$emit('data/select', row, btn);
    },
    // 新增-卖方选配送
    orderSave() { // 保存按钮触发事件
      // console.log();
      this.tableDataId = [];
      for (let j = 0; j < this.tableData.length; j += 1) {
        this.tableDataId.push(parseFloat(this.tableData[j].deliveryMemberId));
      }
      if (this.nametypeNo !== '0') {
        this.formNo = Object.assign({}, this.formNo, {
          drugsId: this.fromEdit.drugsId,
          projectId: this.projectId,
          gpoMemberId: this.getGpoId,
          nameType: 0,
          deliveryMemberId: this.tableDataId.toString(),
        });
        this.$bus.$emit('data/getId1', this.formNo);
      } else {
        this.orderSave1();
      }
      // this.loading = true;
      // this.forms = Object.assign({}, this.forms, {
      //   drugsId: this.fromEdit.drugsId,
      //   gpoMemberId: this.getGpoId,
      //   projectId: this.projectId,
      //   salerMemberId: this.View_UserInfo.userId,
      //   memberList: this.tableData,
      // });
      // ProducerChoseDelivery.submit(this.forms).then((res) => {
      //   if (res.data.code === 0) {
      //     this.$message({
      //       type: 'success',
      //       message: '新增成功',
      //     });
      //     this.delete();
      //     this.deleteid = [];
      //     this.deletedidObj = {};
      //   } else {
      //     this.saveLoading = false; // 关闭保存Loading
      //   }
      // });
      // this.loading = false;
    },
    orderSave1() {
      if (this.tableData.length > this.deliveryLimitNum && this.deliveryLimitNum !== 0) {
        this.$message({
          type: 'error',
          message: '当前已选配送企业数量超过可选择配送企业数量的最大值',
        });
        return false;
      }
      // console.log();
      this.loading = true;
      this.forms = Object.assign({}, this.forms, {
        drugsId: this.fromEdit.drugsId,
        gpoMemberId: this.getGpoId,
        projectId: this.projectId,
        salerMemberId: this.View_UserInfo.userId,
        memberList: this.tableData,
        deleteid: this.deleteid,
      });
      ProducerChoseDelivery.submit(this.forms).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '新增成功',
          });
          // this.delete();
          // this.deleteid = [];
          // this.deletedidObj = {};
          this.orderBack();  // 返回主页面
          this.$bus.$emit('data/list');
        } else {
          this.saveLoading = false; // 关闭保存Loading
        }
        this.loading = false;
      });
      return true;
    },
    orderBack() { // 返回按钮触发事件
      // this.tableData = [];
      this.$router.go(-1);
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.el-form', '.tradeFooter', '.find', 250]);
      };
      setTimeout(tableHeightFun, 0);
    },
  },
};
</script>
<style>
.statistics {
  height: 40px;
  font-size: 18px;
  font-weight: 700;
}

.alreadyChoose {
  margin-top: 40px;
  height: 70px;
  line-height: 90px;
  font-size: 18px;
  font-weight: 700;
}

.deliver {
  position: relative;
  /*height: 600px;*/
}

.fromtrade .from-button {
  height: 10px;
  padding: 0;
  margin: 0;
}

.choosenumber {
  font-size: 18px;
  font-weight: 700;
  text-decoration: underline
}










/*.searchContentBox {
  padding-right: 0 !important;
}*/

.content {
  padding: 0 !important;
}

.deliver .paging {
  position: relative !important;
}
</style>

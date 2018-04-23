<template>
  <div v-loading="loading">
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" label="#" fixed="left" width="40">
      </el-table-column>
      <el-table-column align="left" prop="code" label="合同编号" sortable="custom" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="hospitalMemberName" label="医疗机构" sortable="custom" width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="deliveryMemberName" label="配送企业" sortable="custom" width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="right" prop="amount" label="合同金额" sortable width="90" show-overflow-tooltip>
        <template scope="scope">
          <p>{{scope.row.amount.toFixed(2)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="validBtime" align="left" label="合同有效期" sortable="custom" width="160" show-overflow-tooltip>
        <template scope="scope">
          {{scope.row.validBtime}} ~ {{scope.row.validEtime}}
        </template>
      </el-table-column>
      <el-table-column align="left" prop="createTime" sortable="custom" label="合同创建时间" width="130" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="contractStatus" sortable="custom" label="合同状态" width="120" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="Number(scope.row.contractStatus) === 0" style="color: green">待提交</span>
          <span v-if="Number(scope.row.contractStatus) === 1" style="color: green">已提交</span>
          <span v-if="Number(scope.row.contractStatus) === 2" style="color: green">待签章(医疗机构)</span>
          <span v-if="Number(scope.row.contractStatus) === 3" style="color: green">待签章(配送企业)</span>
          <span v-if="Number(scope.row.contractStatus) === 4" style="color: green">待签章(GPO)</span>
          <span v-if="Number(scope.row.contractStatus) === 5" style="color: red">已作废</span>
          <span v-if="Number(scope.row.contractStatus) === 6" style="color: red">已过期</span>
          <span v-if="Number(scope.row.contractStatus) === 7" style="color: blue">已生效</span>
          <span v-if="Number(scope.row.contractStatus) === 8" style="color: blue">已结案</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="closeStatus" sortable="custom" label="结案状态" width="80" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="Number(scope.row.closeStatus) === 0">无</span>
          <span v-if="Number(scope.row.closeStatus) === 1" style="color: green">部分结案</span>
          <span v-if="Number(scope.row.closeStatus) === 2" style="color: blue">已结案</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width='160' fixed="right" label="操作" v-if="authbtn.item">
        <template scope="scope">
          <el-button type="text" @click="dataUpdate(scope.row)">
            <i class="icon iconfont icon-chakan" style="font-size: 12px"></i>详情 </el-button>
          <el-button type="text" @click="dataFileShow(scope.row)" :disabled="scope.row.contractStatus === 0 || scope.row.contractStatus === 1"> 合同文件</el-button>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="submitBy" label="提交人" sortable="custom" width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="submitTime" label="提交时间" sortable="custom" width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="deliveryAuditBy" label="配送企业审核人" sortable="custom" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="deliveryAuditTime" label="配送企业审核时间" sortable="custom" width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="gpoAuditBy" label="GPO审核人" sortable="custom" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="gpoAuditTime" label="GPO审核时间" sortable="custom" width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column key="outNo" prop="outNo" min-width="120" label="外部合同编号" sortable="custom" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="left" prop="projectName" label="集采项目" class-name="table_right" sortable="custom" width="130" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div style="float: left;padding-right: 15px;padding-left: 63%">
        <span>总合同金额：</span>
        {{gatherAmount}}
        <span>元</span>
      </div>
    </div>
    <DialogSignature :signVisibleOut="signVisibleOut" :signOptions="signOptions" :btnIsDisabled="btnIsDisabled" :btnIsLoading="btnIsLoading" @to-upload="callBackSign" @dialog-close="signDialogClose"></DialogSignature>
  </div>
</template>

<script>
/**
 * Created by yaolingon 2017/9/11.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapActions, mapGetters } from 'vuex';
import convert from '../../../utils/convert'; // 引入js公共方法
import TriContractList from '../../../api/Contract/TriContractList';
import cakey from '../../../api/cakey';    // 获取插入的ukey的key值
import DialogSignature from '../../../components/DialogSignature/DialogSignature';
import upload from '../../../api/upload';

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 3) {
      this.filterForm.contractStatus = 2;
    } else if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 2) {
      this.filterForm.contractStatus = 3;
    } else if (this.$route.query.from === 'index' && this.View_UserInfo.memberType === 4) {
      this.filterForm.contractStatus = 4;
    }
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    // 监听删除
    this.$bus.$on('components/Find', this.dataSearch);
    this.$bus.$on('data/page/do', this.dataCreate); // 新增
    this.$store.commit('BreadCrumb_Update', [
      {
        path: '/index',
        name: this.$store.state.view.resourcesNow.name,
      },
      {
        path: '/Contract',
        name: '配送关系管理',
      },
      {
        path: '/TriContractList',
        name: '三方合同列表',
      },
    ]);
    if (this.getGpoId) {
      if (this.$route.query.from !== 'index') {
        this.filterForm.projectId = this.getProjectId; // 获取当前切换的集采项目号码
      }
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    // 监听页码切换
    this.$bus.$off('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$off('data/list', this.dataList);
    // 监听删除
    this.$bus.$off('components/Find', this.dataSearch);
    this.$bus.$off('data/page/do', this.dataCreate);
  },
  components: {
    DialogSignature,
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/Contract/TriContractList') {
        if (this.$route.query.from !== 'index') {
          this.filterForm.projectId = this.getProjectId; // 获取当前切换的集采项目号码
        }
        this.dataList();
      }
    },
    getGpoId() {
      if (this.$route.path === '/Contract/TriContractList') {
        this.dataList();
      }
    },
  },
  computed: mapGetters([
    'getGpoId',
    'getProjectId',
    'View_UserInfo',
  ]),
  data() {
    return {
      tableHeight: 650,
      tableData: [], // 表单的值
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,
      page: 0,
      size: 20,
      gatherAmount: '',    // 合同总金额
      // 新增明细弹出框
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
      },
      // 筛选的字段
      filterForm: {
        code: null,      // 合同编码
        hospitalMemberName: null,      // 医疗机构会员名称
        deliveryMemberName: null,      // 配送企业会员名称
        contractStatus: null,      // 合同状态
        closeStatus: null,      // 结案状态
        validBtime: null,
        validEtime: null,
        createTime: `${this.convertDate(new Date().setTime(new Date().getTime() - (3600 * 1000 * 24 * 30)))} - ${this.convertDate(new Date())}`,      // 合同创建日期
        kind: 1,      // 是否显示草稿合同
        projectId: null,      // 集采项目id
        gpoMemberId: null,      // GPO会员id
        url: '',
        outNo: null,
      },
      // 签章字段
      signOptions: {
        signTitle: '合同签章',                  //  弹出框标题
        url: null,
      },
      btnIsDisabled: {
        signature: true,
      },
      btnIsLoading: {
        signature: false,
      },
      signVisibleOut: false,
      contractUrl: '',
      contractId: '',
      cakey: '',
    };
  },
  methods: {
    //  每次点击排序都会触发
    sortChange(rule) {
      if (rule.order) {
        const tableData = this.convert.tableSort(rule, this.tableData);
        this.tableData = [...tableData];
      } else {
        this.tableData = [...this.tableDataOld];
      }
    },
    // 数据查询条件获取
    dataSearch(data) {
      let reportnumValidBtimeS;
      let reportnumValidEtimeS;
      if (data.validtime.value) {
        reportnumValidBtimeS = data.validtime.value[0];
        reportnumValidEtimeS = data.validtime.value[1];
      }
      if (reportnumValidBtimeS === '1970-01-01') {
        reportnumValidBtimeS = null;
      }
      if (reportnumValidEtimeS === '1970-01-01') {
        reportnumValidEtimeS = null;
      }
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        code: data.code.value,
        hospitalMemberName: data.hospitalMemberName.value,
        deliveryMemberName: data.deliveryMemberName.value,
        contractStatus: data.contractStatus.value,
        closeStatus: data.closeStatus.value,
        validBtime: reportnumValidBtimeS,
        validEtime: reportnumValidEtimeS,
        createTime: data.createTime.value,
        projectId: data.projectId.value,
        outNo: data.outNo.value,
      };
      if (data.kind) {
        this.filterForm.kind = data.kind.value;
      }
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取数据列表
    dataList(page, pageSizes) {
      if (!this.getGpoId) {
        return false;
      }
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.filterForm.gpoMemberId = this.getGpoId;
      const form = this.filterForm;
      let createTime = '';
      if (form.createTime && typeof form.createTime === 'object') {
        createTime = `${form.createTime[0].replace(/\//g, '-')} - ${form.createTime[1].replace(/\//g, '-')}`;
      } else {
        createTime = form.createTime;
      }
      if (createTime === '1970-01-01 - 1970-01-01') {
        form.createTime = null;
      } else {
        form.createTime = createTime;
      }
      TriContractList.list(cpage, cpageSizes, form).then((res) => {
        if (res.data.code === 0) {
          const data = res.data.result.resultList;
          this.gatherAmount = res.data.result.resultSum[0].gatherAmount;
          this.tableData = [];
          this.tableNum = [];
          this.tableCount = 0;
          for (let i = 0; i < data.content.length; i += 1) {
            // data.content[i].num = (i + 1) + (cpage * cpageSizes);
            const numX = (i + 1) + (data.number * data.size);
            data.content[i].num = numX;
            data.content[i].amount = Number(data.content[i].amount);
          }
          this.tableDataOld = data.content;
          this.tableData = data.content;
          this.page = data.number;
          this.size = data.size;
          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
        this.loading = false;
      });
      return true;
    },
    // 合同文件盖章
    dataFileShow(item) {
      if (item.contractStatus === 2) {
        this.contractUrl = item.contractSourcefile;
      } else {
        this.contractUrl = item.contractFile;
      }
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        // console.log('ie');
        upload.authorization(this.contractUrl).then((res) => {
          if (res.data.code === 0) {
            // console.log('加时效', res.data.result);
            this.contractUrl = res.data.result;
            // 浏览器为IE内核
            // 根据合同状态判断合同url
            // 根据合同状态和登录会员信息类型判断签章按钮是否被禁用
            this.btnIsDisabled.signature = true;
            if (item.contractStatus === 2 && this.View_UserInfo.memberType === 3) {
              this.btnIsDisabled.signature = false;
            } else if (item.contractStatus === 3 && this.View_UserInfo.memberType === 2) {
              this.btnIsDisabled.signature = false;
            } else if (item.contractStatus === 4 && this.View_UserInfo.memberType === 4) {
              this.btnIsDisabled.signature = false;
            } else {
              this.btnIsDisabled.signature = true;
            }
            this.contractId = item.id;
            // console.log('this.contractUrl', this.contractUrl, item.contractId);
            this.$bus.$emit('data/contractId', this.contractId, item.paramKey, item.pageNumber);
            this.signOptions = {
              ...this.signOptions,
              signTitle: '合同签章',                  //  弹出框标题
              url: this.contractUrl,
              contractStatus: item.contractStatus,
            };
            this.signVisibleOut = true;
          }
        });
      } else {
        // console.log(this.contractUrl);
        window.open(this.contractUrl);
        // 浏览器不是IE内核
        // console.log('不是IE');
      }
    },
    // 签章后将盖好章的文件上传
    callBackSign(result, cakey) {
      // console.log('result', result);
      this.btnIsDisabled.signature = true;
      const reg = new RegExp(/[^?]*/);
      const ret = result.match(reg);
      // console.log('retretretret', ret);
      // console.log('这是是最新的签章');
      if (ret[0]) {
        const url = ret[0];
        TriContractList.fileSeal(this.contractId, url, cakey).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '签章成功',
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.message,
            });
          }
        });
      } else {
        this.$message({
          type: 'error',
          message: '签章失败，请刷新重试',
        });
      }
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;
    },
    // 合同新增
    dataCreate() {
      this.$router.push({ path: '/Contract/TriContractList/CreateContract' });
    },
    // 合同详情
    dataUpdate(row) {
      // console.log(12, row);
      this.$bus.$emit('data/info', row.id);
      this.$router.push({ path: '/Contract/TriContractList/UpdateContract', query: { id: row.id, projectName: row.projectName, contractStatus: row.contractStatus } });
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page);
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 145]);
      };
      setTimeout(tableHeightFun, 0);
    },
    signDialogClose() {
      this.signVisibleOut = false;
      this.$bus.$emit('data/list');
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return convert.convertDate(str);
    },
  },
};
</script>

<template>
  <div>
    <el-table :data="tableData" v-loading="loading" :height="tableHeight" stripe border fit @sort-change="sortChange">
      <el-table-column prop="num" align="left" fixed="left" label="#" width="40">
      </el-table-column>
      <el-table-column prop="hospitalCode" label="医疗机构编码" sortable="custom" align="left" min-width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalName" label="医疗机构名称" align="left" sortable="custom" min-width="280" show-overflow-tooltip>
        <template scope="scope">
          <a href="javascript:void(0)" @click="showItem(scope.row)">{{scope.row.hospitalName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="levelsName" label="医疗机构级别" align="left" sortable="custom" min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="outCode" label="医疗机构外部编码" align="left" sortable="custom" min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="hospitalCatalogName" label="机构类型" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="categoryHospital" label="归属机构" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="yearMedicationMoney" label="年用药金额" align="left" sortable="custom" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="inUseRegulationsNumber" label="在用品规数" align="left" sortable="custom" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="provinceName" label="所在地区" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.countyName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="projectName" label="集采项目" align="left" sortable="custom" min-width="160" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="配送地址" min-width="80" class-name="table_right" align="center">
        <template scope="scope">
          <el-button type="text" @click="showAddress(scope.row)">
            查看
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否同步确认" align="center" min-width="100" max-width="200" fixed="right" v-if="authbtn.updateifSync">
        <template scope="scope">
          <el-switch v-model="scope.row.ifSync" on-color="#13ce66" off-color="#ff4949" on-text="开启" off-text="关闭" @change="changeIfSync(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width='160' fixed="right" label="修改外部编码" v-if="authbtn.updateCode">
        <template scope="scope">
          <el-button type="text" @click="dataUpdate(scope.row)">
            <i class="fa fa-edit"></i> 编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="跨订单开票" align="center" min-width="100" max-width="200" fixed="right" v-if="authbtn.update">
        <template scope="scope">
          <el-switch v-model="scope.row.ifCrossOrder" on-color="#13ce66" off-color="#ff4949" on-text="开启" off-text="关闭" @change="changeStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <showDeliveryAddress :options="dialogOptions" :row="row" @dialog-hide="dialogHide"></showDeliveryAddress>
    <DialogForm :dialog-form-visible="dialogFormShow" @close-dialog="CloseDialog" @dialog-cancel="dialogCancel" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :message="editMessage" :from-dialog="form" :isReadonly="false" :isSaveShow="isSaveShow" :saveLoading="saveLoading" @data-save="dataSave">
    </DialogForm>
  </div>
</template>

<script>
/**
 * Created by lqy on 2017/9/4.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import { mapState, mapGetters } from 'vuex';
import project from '../../../api/BasicInfo/Project';     // api -- project[集采项目]
import hospital from '../../../api/BasicInfo/Hospital';   // api -- 医疗机构
import showDeliveryAddress from './showDeliveryAddress';  // 引入查看配送地址弹出窗
import DialogForm from '../../../components/DialogForm';                //  引表单

export default {
  props: {
    authbtn: Object,
  },
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun); //  监听查询按钮的查看更多点击事件，重新计算表格高度
    // 监听页码切换
    this.$bus.$on('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$on('data/list', this.dataList);
    this.$bus.$on('components/Find', this.dataSearch);
    if (this.getGpoId && this.getProjectId) {
      this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
      this.dataList();
    }
  },
  deactivated() {
    this.$bus.$off('table/height', this.tableHeightRun);
    // 监听页码切换
    this.$bus.$off('page/change', this.pageChange);
    // 监听数据更新
    this.$bus.$off('data/list', this.dataList);
    this.$bus.$off('components/Find', this.dataSearch);
  },
  watch: {
    getProjectId() {
      if (this.$route.path === '/BasicInfo/Hospital') {
        this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
        this.dataList();
      }
    },
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  components: {
    showDeliveryAddress,
    DialogForm,
  },
  computed: mapGetters([
    'getGpoId',
    'getProjectId',
  ]),
  data() {
    // 不能为空的验证
    const verifyNull = (rule, value, callback) => {
      this.$data.editMessage.rules.provinceId[0].trigger = 'blur,change';
      this.$data.editMessage.rules.cityId[0].trigger = 'blur,change';
      this.$data.editMessage.rules.countyId[0].trigger = 'blur,change';
      let error = '';
      if (!value) {
        error = callback(new Error('不能为空'));
      } else {
        error = callback();
      }
      return error;
    };
    return {
      tableHeight: 650,                       // 表格高度
      row: '',                              // 需要传入组件的列表row,需要值为ID
      dialogOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
      },
      tableData: [],       // 表单的值
      tableDataOld: [],
      tableCount: 0,
      tableNum: [],
      loading: false,      // 列表加载状态
      filterForm: {
        gpoMemberId: null,
        projectId: null,
        provinceId: null,
        cityId: null,
        countyId: null,
        hospitalCode: null,
        hospitalName: null,
        levels: null,
        ifCrossOrder: null,
        hospitalCatalog: null,
        outCode: null,
      },
      page: 0,
      size: 20,
      isSaveShow: true,           // 保存按钮显示控制
      saveLoading: false,         // 保存按钮loading显示控制
      // 需要提交的字段
      form: {
        id: null,
        outCode: null,
      },
      dialogFormShow: false,      // 弹出框显示隐藏控制
      editMessage: {
        // 写入表单组件的数据
        selects: [
          { label: '外部编码', key: 'outCode', type: 'el-input', placeholder: '请输入医疗机构外部编码' },
        ],
        // 弹出框标题
        dialogTitle: '修改医疗机构外部编码',
        options: {},
        // checkbox选项值
        checkbox: {},
        // radios选项值
        radios: {},
        // 验证规则
        rules: {
          outCode: [
            { required: true, message: '请输入医疗机构外部编码', trigger: 'blur' },
          ],
        },
        styleObject: {},
      },
    };
  },
  methods: {
    dataUpdate(item) {
      this.dialogFormShow = true;
      this.form.id = item.id;
      this.form.outCode = item.outCode;
    },
    dataSave() {
      hospital.updateCode(this.form.id, this.form.outCode)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '编辑成功',
            });
            this.$bus.$emit('data/list');
            this.empty();
          }
        });
    },
    // 点击取消后的触发事件
    dialogCancel(res) {
      this.empty();
      this.dialogFormShow = false;
    },
    // 关闭窗口后的触发事件
    CloseDialog() {
      // 关闭保存Loading
      this.saveLoading = false;
      // 关闭弹出表单
      this.dialogFormShow = false;
      this.empty();
    },
    empty() {
      this.form = {
        id: null,
        outCode: null,
      };
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
    // 开启关闭状态
    changeStatus(row) {
      /**
       *  跨订单开票开启关闭状态操作
       *  当跨订单开票默认是开启状态[需要关闭] ： 当前默认openStatus === true, 点击switch就会自动变为openStatus === false,
       *        我们手动转化openStatus === false避免未请求就变化按钮。传值：openStatus = 0
       *  当跨订单开票默认是关闭状态[需要开启] ： 当前默认openStatus === false, 点击switch就会自动变为openStatus === true,
       *        我们手动转化openStatus === true避免未请求就变化按钮。传值：openStatus = 1
       */
      const index = this.tableData.indexOf(row);
      let i = '';
      if (this.tableData[index].ifCrossOrder === true) {
        // 开启项目
        this.tableData[index].ifCrossOrder = false;
        i = 1;
      } else {
        // 关闭项目
        this.tableData[index].ifCrossOrder = true;
        i = 0;
      }
      const id = row.id;                  // 集采项目Id
      let prompt;
      if (i === 1) {
        prompt = '开启成功';
      } else {
        prompt = '关闭成功';
      }
      // 更新请求
      hospital.update(id, i).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: prompt,
          });
          this.dataList(this.page, this.size);
        } else {
          this.$message({
            type: 'error',
            message: '操作失败',
          });
        }
      });
    },
    // 发票同步确认
    changeIfSync(row) {
      const index = this.tableData.indexOf(row);
      let i = '';
      if (this.tableData[index].ifSync === true) {
        // 开启项目
        this.tableData[index].ifSync = false;
        i = 1;
      } else {
        // 关闭项目
        this.tableData[index].ifSync = true;
        i = 0;
      }
      const id = row.id;                  // 集采项目Id
      let prompt;
      if (i === 1) {
        prompt = '开启成功';
      } else {
        prompt = '关闭成功';
      }
      // 更新请求
      hospital.updateifSync(id, i).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: prompt,
          });
          this.dataList(this.page, this.size);
        } else {
          this.$message({
            type: 'error',
            message: '操作失败',
          });
        }
      });
    },
    // 数据查询条件获取
    dataSearch(data) {
      // 搜索条件字段
      this.filterForm = {
        gpoMemberId: this.getGpoId,
        projectId: data.projectId.value,
        provinceId: data.provinceId.value,
        cityId: data.cityId.value,
        countyId: null,
        hospitalCode: data.hospitalCode.value,
        hospitalName: data.hospitalName.value,
        levels: data.levels.value,
        ifCrossOrder: data.ifCrossOrder.value,
        hospitalCatalog: data.hospitalCatalog.value,
        outCode: data.outCode.value,
      };
      this.dataList(0, this.size, this.filterForm);
    },
    // 获取资源列表名称
    // 获取数据列表
    dataList(page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      this.filterForm.gpoMemberId = this.getGpoId;                    // 获取默认GPO会员Id
      hospital.list(cpage, cpageSizes, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableData = [];
            this.tableNum = [];
            this.tableCount = 0;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              // data.content[i].id = i;
              if (data.content[i].ifCrossOrder === 1) {
                data.content[i].ifCrossOrder = true;
              } else {
                data.content[i].ifCrossOrder = false;
              }
              if (data.content[i].ifSync === 1) {
                data.content[i].ifSync = true;
              } else {
                data.content[i].ifSync = false;
              }
            }
            this.tableDataOld = data.content;
            this.tableData = data.content;
            this.page = data.number;
            this.size = data.size;
            this.$emit('page', data.number + 1, data.size, data.totalElements, data.totalPages);
          }
          this.loading = false;
        });
    },
    // 页码切换
    pageChange(page) {
      this.dataList(page, this.size);
    },
    // 打开配送地址弹窗
    showAddress(row) {
      this.row = row;
      this.dialogOptions.isShowDialog = true;  // 打开弹出框
    },
    // 显示医疗机构详情
    showItem(row) {
      this.$router.push({ path: '/BasicInfo/Hospital/BusinessHospitalInfo', query: { id: row.id } });
    },
    // 关闭弹出框
    dialogHide() {
      this.dialogOptions.isShowDialog = false;  // 关闭弹出框
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 135]);
      };
      setTimeout(tableHeightFun, 0);
    },
  },
};
</script>

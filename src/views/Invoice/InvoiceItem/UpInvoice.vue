<template>
  <div>
    <el-dialog title="上游发票" :visible.sync="dialogFormShow" size="small" :close-on-click-modal="false">
      <div v-loading="loading">
        <div>
          <el-form :rules="editMessage.rules" label-width="85px" id="from-item">
            <TradeEditsForm :from-edit="fromEdit" :isGoBackShow="false" :arrow-num=4 :arrow-down="true" :message="editMessage" :is-readonly="true">
            </TradeEditsForm>
          </el-form>
        </div>
        <Find :showNum="4" :message="message" @dialogFind="dataSearch" class="upInvoiceFind"></Find>
        <div>
          <el-table :data="tableData" stripe border fit :height="tableHeight">
            <el-table-column prop="num" label="#" width="40" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="code" min-width="100" label="发票代码" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="number" min-width="80" label="发票号" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="invoiceDate" min-width="140" label="开票日期" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="invoiceNum" min-width="80" label="开票数量" align="right" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="deliverinvoiceNums" min-width="80" label="可勾稽数量" align="right" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="right" min-width="100" label="勾稽数量" show-overflow-tooltip>
              <template scope="scope">
                <el-input :class="scope.row.OutStyle" class="input-right close-clear" style="width: 98%" slot="reference" size="small" placeholder="请输入内容" @focus="creatFocus(scope.row.deliverinvoiceNum)" @keyup.native="keydown(scope.row.deliverinvoiceNum, scope.$index, scope.row.deliverinvoiceNums)" @blur="keydown(scope.row.deliverinvoiceNum, scope.$index, scope.row.deliverinvoiceNums)" v-model="scope.row.deliverinvoiceNum">
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="发票附件" align="center" min-width="100" max-width="200">
              <template scope="scope">
                <YuploadFiles :data="convert.getJSON(scope.row.scanFile)"></YuploadFiles>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="upInvoiceFooter">
          <PagingOne class="Invoicepage" :page="page" :size="size" :total="total"></PagingOne>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dataSubmit" :loading="loading">确定</el-button>
            <el-button @click="dialogClose">取 消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
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
import convert from '../../../utils/convert';
import Find from '../../../components/DialogFind';
import PagingOne from '../../../components/Paging1';
import TradeEditsForm from '../../../components/TradeEditsForm';
import InvoiceItem from '../../../api/Invoice/InvoiceItem';

export default {
  activated() {
    this.$bus.$on('table/height', this.tableHeightRun);               //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$on('data/upInvoice', this.upInvoice);
    this.$bus.$on('page/changeOne', this.pageChangeOne);
    this.$bus.$on('data/listOne', this.dataList);
  },
  deactivated() {
    this.$bus.$off('data/upInvoice', this.upInvoice);
    this.$bus.$off('table/height', this.tableHeightRun);               //  监听查询按钮的查看更多点击事件，重新计算表格高度
    this.$bus.$off('page/changeOne', this.pageChangeOne);
    this.$bus.$off('data/listOne', this.dataList);
  },
  computed: {
    ...mapGetters([
      'getGpoId',
    ]),
    tableDataOne() {
      return this.tableData;
    },
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  components: {
    TradeEditsForm,
    // StepsFrom,
    Find,
    PagingOne,
  },
  data() {
    return {
      tableHeight: 400,
      filterForm: {
        number: null,
        batchNo: null,
        drugsCode: null,
        code: null,
        drugsNum: null,
        gpoMemberId: null,
        deliverinvoiceItemId: null,
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
          { label: '药品编码', key: 'drugsCode', type: 'el-input', isReadonly: true, span: 6 },
          { label: '通用名', key: 'drugsName', type: 'el-input', isReadonly: true, span: 6 },
          { label: '批号', key: 'batchNo', type: 'el-input', isReadonly: true, span: 6 },
        ],
        styleObject: {},
        options: {},
        radios: {},
        rules: {},
      },
      page: 0,
      size: 10,
      total: 0,
      dialogFormShow: false,
      tableData: [],
      message: [
        {
          key: 'code',
          label: '发票代码',
          placeholder: '请输入发票代码',
          type: 0,
        },
        {
          key: 'number',
          label: '发票号',
          placeholder: '请输入发票号',
          type: 0,
        }],
      loading: false,
    };
  },
  methods: {
    dataSearch(data) {
      this.filterForm = {
        number: data.number.value,
        code: data.code.value,
        drugsNum: this.filterForm.drugsNum,
        batchNo: this.filterForm.batchNo,
        drugsCode: this.filterForm.drugsCode,
        gpoMemberId: this.filterForm.gpoMemberId,
        deliverinvoiceItemId: this.filterForm.deliverinvoiceItemId,
      };
      this.dataList();
    },
    upInvoice(row) {
      this.filterForm = {
        batchNo: row.batchNo,
        drugsCode: row.drugsCode,
        drugsNum: row.drugsNum,
        gpoMemberId: row.gpoMemberId,
        deliverinvoiceItemId: row.deliverinvoiceItemId,
      };
      this.fromEdit.drugsCode = row.drugsCode;
      this.fromEdit.drugsName = row.drugsName;
      this.fromEdit.formName = row.formName;
      this.fromEdit.batchNo = row.batchNo;
      this.dialogFormShow = true;
      this.dataList();
    },
    // 获取当前的数值
    creatFocus(data) {
      this.nowNum = data;
    },
    // 键盘按钮触发方法
    keydown(data, index, key) {
      if (data.toString().search(/\D/) !== -1 && data !== '') {
        this.tableData[index].deliverinvoiceNum = this.nowNum;
        this.$set(this.tableData[index], 'deliverinvoiceNum', this.nowNum);
      } else {
        this.nowNum = data;
      }
      return false;
    },
    // 页码切换
    pageChangeOne(page) {
      this.dataList(page, this.size);
    },
    // 获取数据列表
    dataList(page, size, filterForm) {
      this.loading = true;
      if (page !== undefined) this.page = page;
      if (size !== undefined) this.size = size;
      const form = this.filterForm;
      InvoiceItem.upInvoiceList(page || this.page, size || this.size, form)
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            this.tableData = [];
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (i + 1) + (data.number * data.size);
              data.content[i].num = numX;
              data.content[i].deliverinvoiceNum = Number(data.content[i].deliverinvoiceNum);
            }
            this.tableData = data.content;
            this.page = data.number + 1;
            this.size = data.size;
            this.total = data.totalElements;
          }
          this.loading = false;
        });
    },
    // 取消按钮
    dialogClose() {
      this.dialogFormShow = false;
    },
    // 确认按钮
    dataSubmit() {
      for (let i = 0; i < this.tableData.length; i += 1) {
        if (Number(this.tableData[i].deliverinvoiceNum) >
          Number(this.tableData[i].deliverinvoiceNums)) {
          this.$message({
            type: 'error',
            message: '勾稽数量不能大于可勾稽数量',
          });
          return false;
        }
      }
      const form = {
        arr: this.tableData,
      };
      this.loading = true;
      InvoiceItem.confirm(form).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功',
          });
          this.$bus.$emit('data/list');
          this.loading = false;
          this.dialogFormShow = false;
        }
      });
      return true;
    },
    //  计算表格高度
    tableHeightRun() {
      const tableHeightFun = () => {
        this.tableHeight = window.tableCustom.tableHeight(['.find', '.paging', 300]);
      };
      setTimeout(tableHeightFun, 0);
    },
  },
};
</script>
<style>

.Invoicepage .page_right {
  float: left !important;
}

.upInvoiceFind {
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-bottom: 15px;
}
</style>
<style scoped>
.upInvoiceFooter {
  display: flex;
  justify-content: space-between;
}

.paging {
  flex: 7;
  position: relative !important;
}

.dialog-footer {
  margin: 10px 0;
}
</style>

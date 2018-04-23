<template>
  <div class="wq_dialog">
    <DialogList :isShowDialog="options.isShowDialog" :tableSelected="options.tableSelected" :tableType="1" :showBtn="showBtn" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dataSearch="dialogSearch" @dialogOpen="dialogOpen" @dialogHide="dialogHide">
    </DialogList>
  </div>
</template>

<script>
/**
 * Created by wuqian on 2017/9/20.
 */
import { mapActions, mapGetters } from 'vuex';
import DialogList from '../../../components/DialogList'; //  弹框组件
import InvoiceGather from '../../../api/Invoice/InvoiceGather';

export default {
  components: {
    DialogList,
  },
  props: {
    options: {
      msgBase: '',
      isShowDialog: false,
      tableSelected: [],
      tableType: 1, //  0 单选，1 多选 默认单选
      gpoMemberId: '',
      batchNo: '',
      drugsCode: '',
      ids: 0,
    },
  },
  computed: mapGetters([
    'View_TableHeight',
    'Order_PlanItemList',
    'Order_PlanDateList',
    'Order_DetailItemList',
  ]),
  data() {
    return {
      showBtn: {
        isShowSure: false,
        isShowCanel: false,
        isShowClose: true,
      },
      optionsDialog: { //  基础配置，都要配的
        isLoadingTable: true, //  表格的loading
        title: '生产企业发票', //  弹出框的标题
        dialogSize: 'small', //  弹出框的大小，tiny/small/large/full
        page: 1, //  当前页
        pageTotal: 0, //  总条数
        pageSize: 15, //  每一页显示多少条
        showSelection: true,
        selection: false,           //  表格选择框，去掉
        formlist: {                     //  初始化弹出框的搜索条件，enabled 一定要加
          gpoMemberId: null,
          deliveryMemberId: null,
          batchNo: null,
          drugsCode: null,
          number: null,
          invoiceDate: null,
          hospitalMemberName: null,
          deliveryMemberName: null,
        },
        tableBase: 'memebr', //  表格列表名称，根据具体情况使用，可为空
        tableData: [], //  表格信息
        tableOptions: [ //  要显示的表格列，默认开启选择框、num
          {
            key: 'code',
            name: '发票代码',
            width: 100,
          },
          {
            key: 'number',
            name: '发票号',
            width: 80,
          },
          {
            key: 'invoiceType',
            name: '发票类型',
            width: 100,
            option: [
              {
                label: '普通发票',
                value: '0',
              },
              {
                label: '冲红发票',
                value: '1',
              },
              {
                label: '冲红发票(拒收)',
                value: '2',
              },
            ],
          },
          {
            key: 'invoicedNum',
            name: '数量',
            width: 50,
            align: 'right',
          },
          {
            key: 'scanFile',
            name: '附件',
            width: 70,
            YuploadFiles: true,
          },
          {
            key: 'orderFile',
            name: '随货同行单',
            width: 90,
            YuploadFiles: true,
          },
          {
            key: 'deliveryMemberName',
            name: '卖方会员',
            width: 150,
          },
          {
            key: 'gpoMemberName',
            name: 'GPO名称',
            width: 150,
          },
          {
            key: 'invoiceBy',
            name: '开票人',
            width: 90,
          },
          {
            key: 'invoiceDate',
            name: '开票日期',
            width: 80,
          },
        ],
        searchMessage: [                  //  初始化搜索条件
          {
            key: 'number',
            label: '发票号',
            placeholder: '请输入发票号',
            type: 0,
            input: '',
          },
          {
            key: 'invoiceDate',
            label: '开票日期',
            convertdate: 2,
            placeholder: '请选择开票日期',
            type: 5,
            defaultDate: true,
            selects: [],
            pickerOptions: {
              shortcuts: [{
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - (3600 * 1000 * 24 * 90));
                  picker.$emit('pick', [start, end]);
                },
              }, {
                text: '最近半年',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - (3600 * 1000 * 24 * 182));
                  picker.$emit('pick', [start, end]);
                },
              }, {
                text: '最近一年',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - (3600 * 1000 * 24 * 365));
                  picker.$emit('pick', [start, end]);
                },
              }],
            },
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions([
      'GetPlanDate',
      'GetItemDate',
      'GetDetailDate',
      'ReturnHint',
    ]),
    //  每一次加载进去的时候
    dialogOpen() {
      this.formlist = {};
      this.dataDialogList(this.optionsDialog.tableBase, this.optionsDialog.formlist);
    },
    //  关闭弹出框
    dialogHide() {
      this.options.isShowDialog = false;
    },
    //  页面切换
    dialogPage(msg, form, page, size) {
      this.dataDialogList(msg, form, page, size);
    },
    //  加载列表
    dataDialogList(msg, form, page, size) {
      this.optionsDialog.isLoadingTable = true;
      this.formlist = Object.assign({}, this.formlist, {
        gpoMemberId: this.options.gpoMemberId,      // 药品编码
        deliveryMemberId: this.options.deliveryMemberId,
        batchNo: this.options.batchNo,
        drugsCode: this.options.drugsCode,
      });
      let invoiceDate = '';
      if (this.formlist.invoiceDate && typeof this.formlist.invoiceDate === 'object') {
        invoiceDate = `${this.formlist.invoiceDate[0].replace(/\//g, '-')} - ${this.formlist.invoiceDate[1].replace(/\//g, '-')}`;
      } else {
        invoiceDate = this.formlist.invoiceDate;
      }
      if (invoiceDate === '1970-01-01 - 1970-01-01') {
        this.formlist.invoiceDate = null;
      } else {
        this.formlist.invoiceDate = invoiceDate;
      }
      InvoiceGather.salList(page || 0, size || 10, this.formlist).then((res) => {
        if (res.data.code === 0) {
          this.optionsDialog.isLoadingTable = false;
          const data = res.data.result.content;
          for (let i = 0; i < data.length; i += 1) {
            data[i].num = (res.data.result.number * res.data.result.size) + i + 1;
          }
          this.optionsDialog.page = res.data.result.number + 1;
          this.optionsDialog.pageTotal = res.data.result.totalElements;
          this.optionsDialog.pageSize = res.data.result.size;
          this.optionsDialog.tableData = data;
          setTimeout(() => {
            this.$bus.$emit('dialogList/select');
          }, 0);
          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
      });
      this.optionsDialog.tableData = this.Order_DetailItemList;
    },
    //  弹出框查询触发事件
    dialogSearch(msg, form) {
      // console.log();
      this.formlist = {};
      this.formlist = Object.assign({}, this.formlist, {
        number: form.number.value,      // 药品编码
        invoiceDate: form.invoiceDate.value,
      });
      this.dataDialogList(msg, form);
    },
  },
};
</script>
<style>
.wq_dialog .searchLabel {
  width: 90px!important;
}

.wq_dialog .searchInput {
  padding-left: 100px!important;
}
</style>

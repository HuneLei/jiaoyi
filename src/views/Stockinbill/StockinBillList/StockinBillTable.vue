<template>
  <div>
    <DialogList :isShowDialog="options.isShowDialog" :tableSelected="options.tableSelected" :tableType="1" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dataSelect="dialogSelect" @dataSearch="dialogSearch" @dialogOpen="dialogOpen" @dialogHide="dialogHide" @buttonCreat="buttonCreat">
    </DialogList>

    <InvoiceNumberTable :options="InvoiceOptions" @dialog-hide="InvoiceHide"></InvoiceNumberTable>

  </div>
</template>

<script>
/**
 * 配送单明细弹框
 */
import { mapActions, mapGetters } from 'vuex';
import StockinBillList from '../../../api/Stockinbill/StockinBillList';   // 订单(配送企业api)
import InvoiceNumberTable from './InvoiceNumberTable';                    //  引入发票明细弹出框

export default {
  components: {
    InvoiceNumberTable,
  },
  props: {
    options: {
      msgBase: '',                        //  没什么卵用，有需要可以看看
      isShowDialog: false,                //  显示弹框
      tableSelected: [],                //  默认表格选中
      tableType: 1,                       //  0 单选，1 多选 默认单选
    },
  },
  computed: {
    ...mapGetters([
      'getGpoId',
      'CalcGet_dialogList',
      'CalcGet_inIds',
      'CalcGet_notInIds',
    ]),
  },
  data() {
    return {
      InvoiceOptions: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                  //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        OptionType: true,                   //  false 配送查看 true 退货查看
        ItemNo: '',
      },
      optionsDialog: {                    //  基础配置，都要配的
        isLoadingTable: false,            //  表格的loading
        title: '添加明细',                 //  弹出框的标题
        dialogSize: 'large',              //  弹出框的大小，tiny/small/large/full
        page: 1,                          //  当前页
        pageTotal: 0,                     //  总条数
        pageSize: 20,                     //  每一页显示多少条
        dialogForm: {                     //  初始化弹出框的搜索条件，enabled 一定要加
          barcode: {},
          deliverCode: {},
          batchNo: {},
          number: {},
          ordersCode: {},
          // deliveryMemberName: {},
          producerName: {},
          drugsCode: {},
          drugsName: {},
          salerMemberName: {},
          sendTime: {},
          enabled: { op: 'equal', value: 1 },
          removed: 0,
        },
        tableBase: 'purchasePlan',      //  表格列表名称，根据具体情况使用，可为空
        tableOptions: [
          {
            key: 'code',
            name: '配送单号',
            width: 120,
            sortable: false,
          },
          {
            key: 'barcode',
            name: '条码号',
            width: 120,
            sortable: false,
          },
          {
            key: 'drugsCode',
            name: '药品编码',
            width: 90,
            sortable: false,
          },
          {
            key: 'drugsName',
            name: '通用名',
            width: 120,
            sortable: false,
          },
          {
            key: 'tradeName',
            name: '商品名',
            width: 80,
            sortable: false,
          },
          {
            key: 'formName',
            name: '剂型',
            width: 90,
            sortable: false,
          },
          {
            key: 'specName',
            name: '规格',
            width: 90,
            sortable: false,
          },
          {
            key: 'packSpecName',
            name: '包装规格',
            width: 90,
            sortable: false,
          },
          {
            key: 'unitName',
            name: '单位',
            width: 60,
            sortable: false,
          },
          {
            key: 'batchNo',
            name: '批号',
            width: 80,
            sortable: false,
          },
          {
            key: 'hospitalUnitPrice',
            name: '单价',
            width: 80,
            align: 'right',
            sortable: false,
          },
          {
            key: 'drugsNum',
            name: '发货数量',
            width: 80,
            align: 'right',
            sortable: false,
          },
          {
            key: 'allNum',
            name: '可收货数量',
            width: 100,
            align: 'right',
            sortable: false,
          },
          {
            key: 'makeDate',
            name: '生产日期',
            width: 100,
            sortable: false,
          },
          {
            key: 'validDate',
            name: '有效日期',
            width: 100,
            sortable: false,
          },
          {
            key: 'drugsReportFile',
            name: '药检报告',
            width: 100,
            YuploadFiles: true,
          },
          {
            key: 'producerName',
            name: '生产企业',
            width: 180,
            sortable: false,
          },
          {
            key: 'salerMemberName',
            name: '卖方会员',
            width: 180,
            sortable: false,
          },
          {
            key: 'approvalNumber',
            name: '批准文号',
            width: 130,
            sortable: false,
          },
          {
            key: 'deliverItemNo',
            name: '发票号',
            width: 80,
            sortable: false,
            text: '查看',
            button: true,
            align: 'center',
          },
          {
            key: 'ordersCode',
            name: '订单编号',
            width: 135,
            sortable: false,
          },
          {
            key: 'createTime',
            name: '订单创建时间',
            width: 140,
            sortable: false,
          },
          {
            key: 'sendTime',
            name: '发货时间',
            width: 140,
            sortable: false,
          },
        ],                //  要显示的表格列，默认开启选择框、num
        searchMessage: [                  //  初始化搜索条件
          {
            key: 'barcode',
            label: '条码号',
            placeholder: '请输入条码号',
            type: 10,
            input: '',
          },
          {
            key: 'deliverCode',
            label: '配送单编号',
            placeholder: '请输入配送单编号',
            type: 0,
            input: '',
          },
          {
            key: 'batchNo',
            label: '批号',
            placeholder: '请输入批号',
            type: 0,
            input: '',
          },
          {
            key: 'number',
            label: '发票号',
            placeholder: '请输入发票号',
            type: 0,
            input: '',
          },
          {
            key: 'ordersCode',
            label: '订单编号',
            placeholder: '请输入订单编号',
            type: 0,
            input: '',
          },
          {
            key: 'producerName',
            label: '生产企业',
            placeholder: '请输入生产企业',
            type: 0,
            input: '',
          },
          {
            key: 'drugsCode',
            label: '药品编码',
            placeholder: '请输入药品编码',
            type: 0,
            input: '',
          },
          {
            key: 'drugsName',
            label: '通用名',
            placeholder: '请输入通用名',
            type: 0,
            input: '',
          },
          {
            key: 'salerMemberName',
            label: '卖方会员',
            placeholder: '请输入卖方会员',
            type: 0,
            input: '',
          },
          {
            key: 'sendTime',
            label: '发货日期',
            placeholder: '请输入发货日期',
            type: 9,
            input: '',
          },
        ],
        customFooter: false,               //  自定义底部
        customFooterName: 'myfooter',     //  自定义底部名称
        customTable: false,                //  自定义表格
        customTableName: 'mytable',       //  自定义表格class
      },
    };
  },
  methods: {
    ...mapActions([
      'CalcSet_dialogList',
      'CalcSet_addDetail',
    ]),
    // 关闭弹出框
    InvoiceHide() {
      this.InvoiceOptions.isShowDialog = false;
    },
    //  列表内点击事件
    buttonCreat(data) {
      this.InvoiceOptions.isShowDialog = true;
      this.InvoiceOptions.ItemNo = data;
      this.InvoiceOptions.OptionType = false;
    },
    //  每一次加载进去的时候
    dialogOpen() {
      this.dataDialogList(this.optionsDialog.tableBase, this.optionsDialog.dialogForm);
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
      this.optionsDialog.tableData = [];

      const formlist = form;
      let sendTime = '';
      if (formlist.sendTime.value && typeof formlist.sendTime.value === 'object') {
        sendTime = `${formlist.sendTime.value[0].replace(/\//g, '-')} - ${formlist.sendTime.value[1].replace(/\//g, '-')}`;
      } else {
        sendTime = formlist.sendTime.value;
      }
      if (sendTime === '1970-01-01 - 1970-01-01') {
        formlist.sendTime.value = '';
      } else {
        formlist.sendTime.value = sendTime;
      }

      formlist.deliveryMemberId = this.options.deliveryMemberId;
      formlist.gpoMemberId = this.getGpoId;
      formlist.inIds = this.CalcGet_inIds;
      formlist.notInIds = this.CalcGet_notInIds;

      StockinBillList.deliverlist(page || 0, size || 10, formlist).then((res) => {
        const retList = [];
        if (res.data.code === 0) {
          const data = res.data.result[1];

          for (let i = 0; i < data.content.length; i += 1) {
            const item = data.content[i];
            retList.push({
              ...item,
              makeDate: item.makeDate ? this.convertDate(item.makeDate) : '',
              validDate: item.validDate ? this.convertDate(item.validDate) : '',
              deliverItemId: item.id,
              deliverCode: item.code,
              sendNum: item.drugsNum,
              refusedType: undefined,
              refusedReason: undefined,
            });
          }
          this.CalcSet_dialogList(retList);

          this.optionsDialog = {
            ...this.optionsDialog,
            page: data.number + 1,
            pageTotal: data.totalElements,
            pageSize: data.size,
          };

          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
        this.optionsDialog = {
          ...this.optionsDialog,
          tableData: this.CalcGet_dialogList,
          isLoadingTable: false,
        };
      });
    },
    //  弹出框选择之后确定事件
    dialogSelect(rows, msgCom, msgBase) {
      this.CalcSet_addDetail(rows);
    },
    //  弹出框查询触发事件
    dialogSearch(msg, form) {
      this.dataDialogList(msg, form);
    },
    // 转换日期 YYYY-MM-DD
    convertDate(str) {
      return this.convert.convertDate(str);
    },
  },
};
</script>

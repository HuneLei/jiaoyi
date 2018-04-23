<template>
  <div class="wq_dialog">
  <DialogList :isShowDialog="options.isShowDialog" :tableSelected="options.tableSelected" :tableType="1" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dataSelect="dialogSelect" @dataSearch="dialogSearch" @dialogOpen="dialogOpen" @dialogHide="dialogHide">
  </DialogList>
  </div>
</template>

<script>
  /**
   * Created by wuqian on 2017/9/20.
   */
  import { mapActions, mapGetters } from 'vuex';
  import DialogList from '../../../components/DialogList'; //  弹框组件
  import InvoiceList from '../../../api/Invoice/InvoiceList';

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
        projectId: '',
        hospitalMemberId: '',
        ids: '',
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
        optionsDialog: { //  基础配置，都要配的
          isLoadingTable: true, //  表格的loading
          title: '新增明细', //  弹出框的标题
          dialogSize: 'large', //  弹出框的大小，tiny/small/large/full
          page: 1, //  当前页
          pageTotal: 0, //  总条数
          pageSize: 10, //  每一页显示多少条
          dialogForm: {                     //  初始化弹出框的搜索条件，enabled 一定要加
            gpoMemberId: null,
            deliveryMemberId: null,
            hospitalMemberId: null,
            returnCode: {},
            batchNo: {},
            ordersItemNo: {},
            deliverItemNo: {},
            stockinItemNo: {},
            drugsCode: {},
            drugsName: {},
            producerName: {},
            arr: null,
            itemArr: null,
          },
          tableBase: 'memebr', //  表格列表名称，根据具体情况使用，可为空
          tableData: [], //  表格信息
          tableOptions: [ //  要显示的表格列，默认开启选择框、num
            {
              key: 'returnCode',
              name: '退货单编号',
              width: 120,
            },
            {
              key: 'stockinItemNo',
              name: '入库单明细编号',
              width: 135,
            },
            {
              key: 'hospitalMemberName',
              name: '医疗机构',
              width: 180,
            },
            {
              key: 'drugsCode',
              name: '药品编码',
              width: 90,
            },
            {
              key: 'drugsName',
              name: '通用名',
              width: 120,
            },
            {
              key: 'batchNo',
              name: '批号',
              width: 90,
            },
            {
              key: 'formName',
              name: '剂型',
              width: 90,
            },
            {
              key: 'specName',
              name: '规格',
              width: 90,
            },
            {
              key: 'packSpecName',
              name: '包装规格',
              width: 90,
            },
            {
              key: 'unitName',
              name: '单位',
              width: 60,
            },
            {
              key: 'invoicedNoNum',
              name: '未开发票数量',
              width: 110,
              align: 'right',
            },
            {
              key: 'hospitalUnitPrice',
              name: '单价',
              width: 60,
              align: 'right',
            },
            {
              key: 'producerName',
              name: '生产企业',
              width: 180,
            },
            {
              key: 'tradeName',
              name: '商品名',
              width: 80,
            },
            {
              key: 'approvalNumber',
              name: '批准文号',
              width: 130,
            },
            {
              key: 'makeDate',
              name: '生产日期',
              width: 120,
            },
            {
              key: 'validDate',
              name: '有效日期',
              width: 120,
            },
            {
              key: 'ordersItemNo',
              name: '订单明细编号',
              width: 135,
            },
            {
              key: 'deliverItemNo',
              name: '配送明细单编号',
              width: 135,
            },
          ],
          searchMessage: [ //  初始化搜索条件
            {
              key: 'returnCode',
              label: '退货单编号',
              placeholder: '请输入退货单编号',
              type: 0,
            },
            {
              key: 'batchNo',
              label: '批号',
              placeholder: '请输入批号',
              type: 0,
            },
            {
              key: 'ordersItemNo',
              label: '订单明细编号',
              placeholder: '请输入订单明细编号',
              type: 0,
            },
            {
              key: 'deliverItemNo',
              label: '配送单明细编号',
              placeholder: '请输入配送单明细编号',
              type: 0,
            },
            {
              key: 'stockinItemNo',
              label: '入库单明细编号',
              placeholder: '请输入入库单明细编号',
              type: 0,
            },
            {
              key: 'drugsCode',
              label: '药品编码',
              placeholder: '请输入药品编码',
              type: 0,
            },
            {
              key: 'drugsName',
              label: '通用名',
              placeholder: '请输入通用名',
              type: 0,
            },
            {
              key: 'producerName',
              label: '生产企业',
              placeholder: '请输入生产企业',
              type: 0,
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
        this.optionsDialog.dialogForm.gpoMemberId = this.options.gpoMemberId;
        this.optionsDialog.dialogForm.deliveryMemberId = this.options.deliveryMemberId;
        this.optionsDialog.dialogForm.hospitalMemberId = this.options.hospitalMemberId;
        // console.log();
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
        let noitemLists = [];
        let itemLists = [];
        // console.log();
        if (this.$route.path === '/Invoice/InvoiceList/Creat') {
          for (let i = 0; i < this.Order_PlanDateList.length; i += 1) {
            const itemone = this.Order_PlanDateList[i];
            noitemLists[i] = `${itemone.ids}`;
          }
        } else if (this.$route.path === '/Invoice/InvoiceList/Edit') {
          for (let i = 0; i < this.Order_PlanItemList.length; i += 1) {
            const itemone = this.Order_PlanItemList[i];
            noitemLists[i] = `${itemone.ids}`;
            itemLists[i] = `${itemone.itemNo}`;
          }
        }
        noitemLists = noitemLists.join(',');
        itemLists = itemLists.join(',');
        // console.log();
        this.optionsDialog.isLoadingTable = true;
        const formlist = form;
        formlist.gpoMemberId = this.options.gpoMemberId;
        formlist.deliveryMemberId = this.options.deliveryMemberId;
        formlist.hospitalMemberId = this.options.hospitalMemberId;
        formlist.arr = noitemLists || null;
        formlist.itemArr = itemLists || null;
        formlist.invoiceId = this.$route.query.id || -1;
        InvoiceList.redDeliveryList(page || 0, size || 10, formlist).then((res) => {
          if (res.data.code === 0) {
            this.optionsDialog.isLoadingTable = false;
            const data = res.data.result.content;
            for (let i = 0; i < data.length; i += 1) {
              data[i].num = (res.data.result.number * res.data.result.size) + i + 1;
              data[i].purchaseNum = data[i].invoicedNoNum;
              data[i].purchaseAmount = data[i].drugsAmount;
              data[i].noTaxAmount = data[i].noTaxAmount;
              data[i].ids = data[i].id;
              data[i].noTaxAmountPrice = data[i].noUnitPrice;
              data[i].deliverId = 0;
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
      //  弹出框选择之后确定事件
      dialogSelect(rows, msgCom, msgBase) {
        this.ReturnHint();
        if (this.$route.path === '/Invoice/InvoiceList/Creat') {
          this.GetPlanDate(rows);
          // console.log();
        } else if (this.$route.path === '/Invoice/InvoiceList/Edit') {
          this.GetItemDate(rows);
        }
        this.$emit('dialogSelect', rows, msgCom, msgBase);
      },
      //  弹出框查询触发事件
      dialogSearch(msg, form) {
        this.dataDialogList(msg, form);
      },
    },
  };
</script>
<style>
  .wq_dialog .searchLabel{
    width:90px!important;
  }
  .wq_dialog .searchInput{
    padding-left: 100px!important;
  }
</style>

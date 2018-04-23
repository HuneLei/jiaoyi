<template>
  <div>
    <DialogList :isShowDialog="options.isShowDialog" :tableSelected="options.tableSelected" :tableType="1" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dataSelect="dialogSelect" @dataSearch="dialogSearch" @dialogOpen="dialogOpen" @dialogHide="dialogHide" @buttonCreat="buttonCreat">
    </DialogList>
    <InvoiceNumberTable :options="InvoiceOptions" @dialog-hide="InvoiceHide"></InvoiceNumberTable>
  </div>
</template>

<script>
  /**
   * Created by HuneLei
   * 基础编码库
   * 剂型 弹框组件
   */
  import { mapActions, mapGetters } from 'vuex';
  import DeliverBillList from '../../../api/Deliverbill/DeliverBillList';                         //  采购计划api
  import DialogList from '../../../components/DialogList';                            //  弹框组件
  import ReturnBillsList from '../../../api/Return/ReturnBillsList';   // 订单(配送企业api)
  import InvoiceNumberTable from './InvoiceNumberTable';                    //  引入发票明细弹出框

  export default {
    components: {
      DialogList,
      InvoiceNumberTable,
    },
    props: {
      options: {
        msgBase: '',                        //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                  //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        returnType: '',
        returnReason: '',
      },
    },
    computed: mapGetters([
      'getGpoId',
      'View_TableHeight',
      'Order_PlanItemList',
      'Order_PlanDateList',
      'Order_PlanfromEdit',
      'Order_DetailItemList',
    ]),
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
          title: '添加退货明细',              //  弹出框的标题
          dialogSize: 'large',              //  弹出框的大小，tiny/small/large/full
          page: 1,                          //  当前页
          pageTotal: 0,                     //  总条数
          pageSize: 20,                     //  每一页显示多少条
          dialogForm: {                     //  初始化弹出框的搜索条件，enabled 一定要加
            stockinCode: {},
            deliverCode: {},
            batchNo: {},
            number: {},
            ordersCode: {},
            drugsCode: {},
            drugsName: {},
            producerName: {},
            salerMemberName: {},
            sendTime: {},
            enabled: { op: 'equal', value: 1 },
            removed: 0,
          },
          tableBase: 'purchasePlan',      //  表格列表名称，根据具体情况使用，可为空
          tableData: '',                  //  表格信息
          tableOptions: [
            {
              key: 'stockinCode',
              name: '入库单编号',
              width: 120,
              sortable: false,
            },
            {
              key: 'deliverCode',
              name: '配送单号',
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
              width: 120,
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
              width: 80,
              sortable: false,
            },
            {
              key: 'batchNo',
              name: '批号',
              width: 80,
              sortable: false,
            },
            {
              key: 'stockinNum',
              name: '入库数量',
              width: 80,
              align: 'right',
              sortable: false,
            },
            {
              key: 'returndNum',
              name: '可退货数量',
              width: 80,
              align: 'right',
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
              key: 'producerName',
              name: '生产企业',
              width: 120,
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
              width: 140,
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
              key: 'contractItemNo',
              name: '合同明细编号',
              width: 160,
              sortable: false,
            },
            {
              key: 'stockinItemNo',
              name: '入库单明细编号',
              width: 160,
              sortable: false,
            },
            {
              key: 'sendTime',
              name: '入库时间',
              width: 140,
              sortable: false,
            },
          ],                //  要显示的表格列，默认开启选择框、num
          searchMessage: [                  //  初始化搜索条件
            {
              key: 'stockinCode',
              label: '入库单编号',
              placeholder: '请输入入库单编号',
              type: 0,
              input: '',
            },
            {
              key: 'deliverCode',
              label: '配送单号',
              placeholder: '请输入配送单号',
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
              label: '入库日期',
              type: 5,
              placeholder: '请选择日期',
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
          customFooter: false,               //  自定义底部
          customFooterName: 'myfooter',     //  自定义底部名称
          customTable: false,                //  自定义表格
          customTableName: 'mytable',       //  自定义表格class
        },
        authbtn: {
          remove: true,
          create: true,
          destory: true,
        },
        dialogData: [],
      };
    },
    methods: {
      ...mapActions([
        'GetPlanDate',
        'GetItemDate',
        'GetDetailDate',
        'GetGrugsList',
        'ReturnHint',
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
        let noitemLists = [];
        if (this.$route.path === '/Return/ReturnBillsList/CreatPlan') {
          for (let i = 0; i < this.Order_PlanDateList.length; i += 1) {
            const itemone = this.Order_PlanDateList[i];
            noitemLists[i] = `${itemone.stockinItemNo}`;
          }
        }
        if (this.$route.path === '/Return/ReturnBillsList/CheckItem') {
          for (let i = 0; i < this.Order_PlanItemList.length; i += 1) {
            const itemone = this.Order_PlanItemList[i];
            noitemLists[i] = `${itemone.stockinItemNo}`;
          }
        }
        noitemLists = noitemLists.join(',');
        this.optionsDialog.isLoadingTable = true;
        const formlist = form;
        if (noitemLists === '') {
          formlist.ids = null;
        } else {
          formlist.ids = noitemLists;
        }
        let sendTime = '';
        if (formlist.sendTime.value && typeof formlist.sendTime.value === 'object') {
          sendTime = `${formlist.sendTime.value[0].replace(/\//g, '-')} - ${formlist.sendTime.value[1].replace(/\//g, '-')}`;
        } else {
          sendTime = formlist.sendTime.value;
        }
        if (sendTime === '1970-01-01 - 1970-01-01') {
          formlist.sendTime.value = null;
        } else {
          formlist.sendTime.value = sendTime;
        }
        const MemberId = this.Order_PlanfromEdit.deliveryMemberId;
        formlist.deliveryMemberId = MemberId;
        formlist.gpoMemberId = this.getGpoId;
        formlist.ids = noitemLists;
        ReturnBillsList.stockinlist(page || 0, size || 10, formlist).then((res) => {
          if (res.data.code === 0) {
            this.optionsDialog.tableData = [];
            const data = res.data.result[1];
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (data.number * data.size) + i + 1;
              data.content[i].num = numX;
              data.content[i].purchaseNum = 0;
              data.content[i].stockinItemId = data.content[i].id;
              data.content[i].sendNum = data.content[i].drugsNum;
              data.content[i].returnableNum = Number(data.content[i].returndNum);
              data.content[i].beReturnNum = Number(data.content[i].returndNum);
              data.content[i].purchaseAmount = 0.00;
              data.content[i].returnType = this.options.returnType;
              data.content[i].picNum = 0;
              data.content[i].returnReason = this.options.returnReason;
            }
            this.optionsDialog.page = data.number + 1;
            this.optionsDialog.pageTotal = data.totalElements;
            this.optionsDialog.pageSize = data.size;
            this.GetDetailDate(data.content);
            setTimeout(() => {
              this.$bus.$emit('dialogList/select');
            }, 0);
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
          this.optionsDialog.tableData = this.Order_DetailItemList;
          this.optionsDialog.isLoadingTable = false;
        });
        this.optionsDialog.tableData = this.Order_DetailItemList;
      },
      //  弹出框选择之后确定事件
      dialogSelect(rows, msgCom, msgBase) {
        this.ReturnHint();
        this.$emit('dialogSelect', rows, msgCom, msgBase);
        if (this.$route.path === '/Return/ReturnBillsList/CreatPlan') {
          this.GetPlanDate(rows);
        }
        if (this.$route.path === '/Return/ReturnBillsList/CheckItem') {
          const rowslist = rows;
          rowslist.item = 1;
          this.GetItemDate(rowslist);
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

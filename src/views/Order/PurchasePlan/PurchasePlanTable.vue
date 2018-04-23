<template>
  <div>
    <DialogList :isShowDialog="options.isShowDialog" :tableSelected="options.tableSelected" :tableType="1" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dataSelect="dialogSelect" @dataSearch="dialogSearch" @dialogOpen="dialogOpen" @dialogHide="dialogHide">
    </DialogList>
  </div>
</template>

<script>
/**
 * Created by HuneLei
 * 基础编码库
 * 剂型 弹框组件
 */
import { mapActions, mapGetters } from 'vuex';
import PurchasePlan from '../../../api/Order/PurchasePlan';                         //  采购计划api
import DialogList from '../../../components/DialogList';                            //  弹框组件

export default {
  components: {
    DialogList,
  },
  props: {
    options: {
      msgBase: '',                        //  没什么卵用，有需要可以看看
      isShowDialog: false,                //  显示弹框
      tableSelected: [],                  //  默认表格选中
      tableType: 1,                       //  0 单选，1 多选 默认单选
    },
  },
  computed: mapGetters([
    'View_TableHeight',
    'Order_PlanItemList',
    'Order_PlanDateList',
    'Order_DetailItemList',
    'getGpoId',
  ]),
  data() {
    return {
      optionsDialog: {                    //  基础配置，都要配的
        isLoadingTable: false,            //  表格的loading
        title: '添加明细',                  //  弹出框的标题
        dialogSize: 'large',              //  弹出框的大小，tiny/small/large/full
        page: 1,                          //  当前页
        pageTotal: 0,                     //  总条数
        pageSize: 20,                     //  每一页显示多少条
        dialogForm: {                     //  初始化弹出框的搜索条件，enabled 一定要加
          drugsCode: {},
          drugsName: {},
          formName: {},
          specName: {},
          producerName: {},
          deliveryMemberName: {},
          tradeName: {},
          enabled: { op: 'equal', value: 1 },
          removed: 0,
        },
        tableBase: 'purchasePlan',      //  表格列表名称，根据具体情况使用，可为空
        tableData: '',                  //  表格信息
        tableOptions: [
          {
            key: 'drugsCode',
            name: '药品编码',
            width: 100,
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
            key: 'specName',
            name: '规格',
            width: 80,
            sortable: false,
          },
          {
            key: 'packSpecName',
            name: '包装规格',
            width: 80,
            sortable: false,
          },
          {
            key: 'formName',
            name: '剂型',
            width: 80,
            sortable: false,
          },
          {
            key: 'unitName',
            name: '单位',
            width: 60,
            sortable: false,
          },
          {
            key: 'hospitalUnitPrice',
            name: '单价',
            width: 70,
            align: 'right',
            sortable: false,
          },
          {
            key: 'purchasableNum',
            name: '可采数量',
            width: 80,
            align: 'right',
            sortable: false,
          },
          {
            key: 'middlePack',
            name: '中包装',
            width: 70,
            align: 'right',
            sortable: false,
          },
          {
            key: 'bigPack',
            name: '大包装',
            width: 70,
            align: 'right',
            sortable: false,
          },
          {
            key: 'removeFactor',
            name: '拆零系数',
            width: 70,
            align: 'right',
            sortable: false,
          },
          {
            key: 'deliveryMemberName',
            name: '配送企业',
            width: 180,
            sortable: false,
          },
          {
            key: 'producerName',
            name: '生产企业',
            width: 180,
            sortable: false,
          },
          {
            key: 'approvalNumber',
            name: '批准文号',
            width: 130,

          },
        ],                //  要显示的表格列，默认开启选择框、num
        searchMessage: [                  //  初始化搜索条件
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
            key: 'producerName',
            label: '生产企业',
            placeholder: '请输入生产企业',
            type: 0,
            input: '',
          },
          {
            key: 'deliveryMemberName',
            label: '配送企业',
            placeholder: '请输入配送企业',
            type: 0,
            input: '',
          },
          {
            key: 'formName',
            label: '剂型',
            placeholder: '请输入剂型',
            type: 0,
            sinput: '',
          },
          {
            key: 'specName',
            label: '规格',
            placeholder: '请输入规格',
            type: 0,
            input: '',
          },
          {
            key: 'tradeName',
            label: '商品名',
            placeholder: '请输入商品名',
            type: 0,
            input: '',
          },
        ],
        customFooter: false,              //  自定义底部
        customFooterName: 'myfooter',     //  自定义底部名称
        customTable: false,               //  自定义表格
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
      'ReturnHint',
    ]),
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
      if (this.$route.path === '/Order/PurchasePlan/CreatPlan') {
        for (let i = 0; i < this.Order_PlanDateList.length; i += 1) {
          const itemone = this.Order_PlanDateList[i];
          if (itemone.drugsCode === null) {
            itemone.drugsCode = '';
          }
          noitemLists[i] = `${itemone.drugsCode}${Number(itemone.hospitalUnitPrice).toFixed(2)}${itemone.deliveryMemberId}`;
        }
      } else if (this.$route.path === '/Order/PurchasePlan/CheckItem') {
        for (let i = 0; i < this.Order_PlanItemList.length; i += 1) {
          const itemone = this.Order_PlanItemList[i];
          if (itemone.drugsCode === null) {
            itemone.drugsCode = '';
          }
          noitemLists[i] = `${itemone.drugsCode}${Number(itemone.hospitalUnitPrice).toFixed(2)}${itemone.deliveryMemberId}`;
        }
      }
      noitemLists = noitemLists.join(',');
      this.optionsDialog.isLoadingTable = true;
      const formlist = form;
      formlist.drugsString = noitemLists;
      formlist.gpoMemberId = this.getGpoId;
      PurchasePlan.detailList(page || 0, size || 10, formlist).then((res) => {
        if (res.data.code === 0) {
          this.optionsDialog.tableData = [];
          const data = res.data.result;
          for (let i = 0; i < data.content.length; i += 1) {
            const numX = (res.data.result.number * res.data.result.size) + i + 1;
            const content = data.content[i];
            data.content[i].num = numX;
            data.content[i].purchaseNum = 0;
            data.content[i].purchaseAmount = content.hospitalUnitPrice * content.purchaseNum;
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
      if (this.$route.path === '/Order/PurchasePlan/CreatPlan') {
        this.GetPlanDate(rows);
      } else if (this.$route.path === '/Order/PurchasePlan/CheckItem') {
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

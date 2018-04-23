<template>
  <div>
    <DialogList :isShowDialog="options.isShowDialog" :tableSelected="options.tableSelected" :tableType="1" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dialogOpen="dialogOpen" @dialogHide="dialogHide" :show-btn="showBtn">
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
  import DeliverBillItem from '../../../api/Deliverbill/DeliverBillItem';             // 引入配送管理api
  import DialogList from '../../../components/DialogList';                            // 弹框组件
  import convert from '../../../utils/convert';                                       // 引入js公共方法

  export default {
    components: {
      DialogList,
    },
    props: {
      options: {
        msgBase: '',                        //  有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                  //  默认表格选中
        tableType: 1,                       //  0 单选，1 多选 默认单选
        ItemNo: '',
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
        formInline: {    // 查询条件的获取值
          code: {},
          name: {},
          createTime: {},
          hospitalMemberName: {},
        },
        optionsDialog: {                    //  基础配置，都要配的
          showSelection: true,
          isHideSearch: true,
          isLoadingTable: false,            //  表格的loading
          title: '发票号查看',                //  弹出框的标题
          dialogSize: 'small',               //  弹出框的大小，tiny/small/large/full
          page: 1,                          //  当前页
          pageTotal: 0,                     //  总条数
          pageSize: 20,                     //  每一页显示多少条
          tableBase: 'purchasePlan',        //  表格列表名称，根据具体情况使用，可为空
          tableData: [],                    //  表格信息
          tableOptions: [
            {
              key: 'code',
              name: '发票代码',
              width: 100,
            },
            {
              key: 'number',
              name: '发票号',
              width: 100,
            },
            {
              key: 'invoicedNum',
              name: '发票数量',
              align: 'right',
              width: 80,
            },
            {
              key: 'drugsAmount',
              name: '发票金额',
              align: 'right',
              width: 80,
            },
            {
              key: 'scanFile',
              name: '发票附件',
              width: 60,
              YuploadFiles: true,
            },
          ],                                 //  要显示的表格列，默认开启选择框、num
          searchMessage: [],                 //  初始化搜索条件
          customFooter: false,               //  自定义底部
          customFooterName: 'myfooter',      //  自定义底部名称
          customTable: false,                //  自定义表格
          customTableName: 'mytable',        //  自定义表格class
        },
        showBtn: {
          isShowSure: false,
          isShowCanel: false,
          isShowClose: true,
        },
        dialogData: [],
      };
    },
    methods: {
      ...mapActions([
        'GetPlanDate',
        'GetItemDate',
        'GetDetailDate',
        'GetInputDate',
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
      // 转换日期 YYYY-MM-DD
      convertDate(str) {
        return convert.convertDate(str);
      },
      //  加载列表
      dataDialogList(msg, form, page, size) {
        this.optionsDialog.isLoadingTable = true;
        const formInline = {};
        formInline.deliverItemNo = this.options.ItemNo;
        DeliverBillItem.invoicelist(page || 0, size || 10, formInline).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.result;
            for (let i = 0; i < data.content.length; i += 1) {
              const numX = (res.data.result.number * res.data.result.size) + i + 1;
              data.content[i].num = numX;
            }
            this.optionsDialog.page = data.number + 1;
            this.optionsDialog.pageTotal = data.totalElements;
            this.optionsDialog.pageSize = data.size;
            setTimeout(() => {
              this.$bus.$emit('dialogList/select');
            }, 0);
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
          this.optionsDialog.tableData = res.data.result.content;
          this.optionsDialog.isLoadingTable = false;
        });
      },
    },
  };
</script>

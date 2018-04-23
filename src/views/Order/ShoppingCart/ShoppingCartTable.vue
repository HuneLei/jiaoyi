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
  import PurchasePlan from '../../../api/Order/PurchasePlan';                         // 采购计划api
  import DialogList from '../../../components/DialogList';                            // 弹框组件
  import convert from '../../../utils/convert';                                       // 引入js公共方法
  import ShoppingCart from '../../../api/Order/ShoppingCart';                         // 引入采购计划api

  export default {
    components: {
      DialogList,
    },
    props: {
      options: {
        msgBase: '',                        //  有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: [],                //  默认表格选中
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
        formInline: {    // 查询条件的获取值
          code: {},
          name: {},
          createTime: {},
          hospitalMemberName: {},
        },
        optionsDialog: {                    //  基础配置，都要配的
          isHideSearch: true,
          isLoadingTable: false,            //  表格的loading
          title: '导入采购计划',              //  弹出框的标题
          dialogSize: 'small',              //  弹出框的大小，tiny/small/large/full
          page: 1,                          //  当前页
          pageTotal: 0,                     //  总条数
          pageSize: 20,                     //  每一页显示多少条
          tableBase: 'purchasePlan',        //  表格列表名称，根据具体情况使用，可为空
          tableData: [],                    //  表格信息
          tableOptions: [
            {
              key: 'code',
              name: '采购计划编号',
              width: 80,
            },
            {
              key: 'name',
              name: '采购计划名称',
              width: 80,
            },
            {
              key: 'createBy',
              name: '创建人',
              width: 80,
            },
            {
              key: 'createTime',
              name: '创建时间',
              width: 140,
            },
          ],                                 //  要显示的表格列，默认开启选择框、num
          searchMessage: [],                 //  初始化搜索条件
          customFooter: false,               //  自定义底部
          customFooterName: 'myfooter',      //  自定义底部名称
          customTable: false,                //  自定义表格
          customTableName: 'mytable',        //  自定义表格class
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
        this.formInline.gpoMemberId = this.getGpoId;
        PurchasePlan.list(page || 0, size || 15, this.formInline).then((res) => {
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
      //  弹出框选择之后确定事件
      dialogSelect(rows, msgCom, msgBase) {
        if (this.$route.path === '/Order/ShoppingCart/ShopItem') {
          let idlist = '';
          for (let i = 0; i < rows.length; i += 1) {
            idlist = `${rows[i].id},${idlist}`;
          }
          ShoppingCart.input(idlist, this.formInline.gpoMemberId).then((res) => {
            if (res.data.code === 0) {
              this.GetInputDate(res.data.result);
            }
          });
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

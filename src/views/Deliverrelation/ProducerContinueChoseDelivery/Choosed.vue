<template>
  <div>
    <DialogList :isShowDialog="options.isShowDialog" :showBtn="showBtn" :tableSelected="options.tableSelected" :tableType="1" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dialogOpen="dialogOpen" @dialogHide="dialogHide">
    </DialogList>
  </div>
</template>

<script>
/**
 * Created by tuxiaoan
 * 基础编码库
 * 剂型 弹框组件
 */
import { mapActions, mapGetters } from 'vuex';
import ProducerContinueChoseDelivery from '../../../api/Deliverrelation/ProducerContinueChoseDelivery';
import DialogList from '../../../components/DialogList';                            //  弹框组件

export default {
  components: {
    DialogList,
  },
  computed: mapGetters([
  ]),
  props: {
    options: {
      msgBase: '',
      isShowDialog: false,
      tableSelected: [],
      tableType: 1, //  0 单选，1 多选 默认单选
      gpoMemberId: '',
      projectId: '',
      drugsId: '',
      delivearrid: '',
      itemId: '',
      salerMemberId: '',
    },
  },
  data() {
    return {
      projectId: null,
      showBtn: {
        isShowSure: false,
        isShowCanel: false,
        isShowClose: true,
      },
      optionsDialog: {                    //  基础配置，都要配的
        isLoadingTable: false,            //  表格的loading
        title: '已选配送企业',                 //  弹出框的标题
        dialogSize: 'small',              //  弹出框的大小，tiny/small/large/full
        page: 1,                          //  当前页
        pageTotal: 0,                     //  总条数
        pageSize: 20,                     //  每一页显示多少条
        dialogForm: {
          projectId: null,
          gpoMemberId: null,
          drugsId: null,
          salerMemberId: null,
          delivearrid: '',
        },
        isHideSearch: true,
        showSelection: true,
        tableBase: '',      //  表格列表名称，根据具体情况使用，可为空
        tableData: [],                  //  表格信息
        tableOptions: [
          {
            key: 'deliveryMemberCode',
            name: '配送企业编码',
            width: 90,
          },
          {
            key: 'deliveryMemberName',
            name: '配送企业名称',
            width: 120,
          },
          {
            key: 'nametype',
            name: '是否补充',
            width: 30,
            option: [
              {
                label: '否',
                value: -1,
              },
              {
                label: '是',
                value: 1,
              },
            ],
            renderStyle(data) {
              if ([1].indexOf(Number(data.nametype)) > -1) {
                return 'color: #f00';
              }
              return '';
            },
          },
        ],                //  要显示的表格列，默认开启选择框、num
        customFooter: false,               //  自定义底部
        customFooterName: 'myfooter',     //  自定义底部名称
        customTable: false,                //  自定义表格
        customTableName: 'mytable',       //  自定义表格class
      },
      dialogData: [],
    };
  },
  methods: {
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
    dataDialogList(msg, form, page, pageSizes) {
      // this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      // this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      const formlist = form;
      formlist.gpoMemberId = this.options.gpoMemberId;
      formlist.projectId = this.options.projectId;
      formlist.drugsId = this.options.drugsId;
      formlist.delivearrid = this.options.delivearrid;
      formlist.id = this.$route.query.id;
      formlist.itemId = this.options.itemId;
      formlist.salerMemberId = this.options.salerMemberId;
      ProducerContinueChoseDelivery.deliveList(cpage, cpageSizes, formlist)
        .then((res) => {
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
            this.$emit('page', data.number + 1, data.size, data.totalElements);
          }
        });
    },
  },
};
</script>

<template>
  <DialogList :isShowDialog="options.isShowDialog" :tableType="options.tableType" :showNum="2" :showBtn="optionsDialog.showBtn" :msgBase="options.msgBase" @dataSearch="dialogSearch" @pageChange="dialogPage" @dataSelect="dialogSelect" :options="optionsDialog" @dialogHide="dialogHide">
  </DialogList>
</template>

<script>
/**
 * Created by 李昌盛
 * 订单金额弹框
 */
import { mapActions, mapGetters } from 'vuex';
import DialogList from '../../../components/DialogList';                            //  弹框组件
import HospitalRegulations from '../../../api/Deliverrelation/HospitalRegulations';

export default {
  activated() {
    this.$bus.$on('data/choose/DialogOrder', this.dataChoose);
  },
  deactivated() {
    this.$bus.$off('data/choose/DialogOrder', this.dataChoose);
  },
  created() {
    this.tableHeightRun();
    window.onresize = () => {
      this.tableHeightRun();
    };
  },
  components: {
    DialogList,
  },
  computed: mapGetters([
    'getGpoId',
    'projectOptions',
    'getProjectId',
  ]),
  props: {
    options: {
      msgBase: '',
      isShowDialog: false,
      tableType: 0,                       //  0 单选，1 多选 默认单选
      isHideSearch: false,
    },
  },
  data() {
    return {
      optionsDialog: {                    //  基础配置，都要配的
        isLoadingTable: false,             //  表格的loading
        title: '已下订单',                //  弹出框的标题
        dialogSize: 'small',              //  弹出框的大小，tiny/small/large/full
        page: 1,                          //  当前页
        pageTotal: 0,                     //  总条数
        pageSize: 10,                     //  每一页显示多少条
        showSelection: true,
        selection: false,           //  表格选择框，去掉
        isHideSearch: false,
        multipleSelection: [],
        tableBase: '', //  表格列表名称，根据具体情况使用，可为空
        tableData: [],                    //  表格信息
        tableOptions: [                   //  要显示的表格列，默认开启选择框、num
          {
            key: 'itemNo',
            name: '订单编号',
            width: 130,
          },
          {
            key: 'deliveryMemberName',
            name: '配送企业',
            width: 100,
          },
          {
            key: 'drugsCode',
            name: '药品编码',
            width: 100,
          },
          {
            key: 'drugsName',
            name: '通用名',
            width: 100,
          },
          {
            key: 'tradeName',
            name: '商品名',
            width: 100,
          },
          {
            key: 'formName',
            name: '剂型',
            width: 80,
          },
          {
            key: 'specName',
            name: '规格',
            width: 80,
          },
          {
            key: 'packSpecName',
            name: '包装规格',
            width: 80,
          },
          {
            key: 'unitName',
            name: '单位',
            width: 60,
          },
          {
            key: 'hospitalUnitPrice',
            name: '单价',
            width: 80,
            align: 'right',
          },
          {
            key: 'purchaseAmount',
            name: '金额',
            width: 80,
            align: 'right',
          },
          {
            key: 'ordersNum',
            name: '订单数量',
            width: 120,
            align: 'right',
          },
        ],
        searchMessage: [
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
            key: 'deliveryMemberName',
            label: '配送企业',
            placeholder: '请输入配送企业',
            type: 0,
            input: '',
          },
        ],    //  初始化搜索条件
        // 控制弹出窗的按钮
        showBtn: {
          isShowSure: false,
          isShowCanel: false,
          isShowClose: true,
        },
        filterForm: {
          projectId: null,
          gpoMemberId: null,
          drugsId: null,
          salerMemberId: null,
          hospitalMemberId: null,
          deliveryMemberName: null,
          deliveryMemberCode: null,
          createDate: null,
        },
      },
    };
  },
  methods: {
    //  弹出框选择之后确定事件
    dialogSelect(rows, msgCom, msgBase) { },
    //  关闭弹出框
    dialogHide() {
      this.options.isShowDialog = false;
    },
    //  页面切换
    dialogPage(msg, form, page, size) {
      this.dataDialogList(msg, form, page, size);
    },
    dataChoose(form) {
      this.filterForm = form;
      this.dataDialogList();
    },
    // 加载列表
    dataDialogList(msg, form, page, pageSizes) {
      this.optionsDialog.isLoadingTable = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      const forms = this.filterForm;
      let createDate = '';
      if (forms.createDate && typeof forms.createDate === 'object') {
        createDate = `${forms.createDate.replace(/\//g, '-')}`;
      } else {
        createDate = forms.createDate;
      }
      if (createDate === '1980-01-01') {
        forms.createDate = null;
      } else {
        forms.createDate = createDate;
      }
      HospitalRegulations.orderList(cpage, cpageSizes, forms)
        .then((res) => {
          if (res.data.code === 0) {
            this.optionsDialog.isLoadingTable = false;
            const data = res.data.result.content;
            for (let i = 0; i < data.length; i += 1) {
              data[i].num = (res.data.result.number * res.data.result.size) + i + 1;
              data[i] = {
                ...data[i],
                hospitalUnitPrice: data[i].hospitalUnitPrice ?
                  data[i].hospitalUnitPrice.toFixed(2) : null,
                purchaseAmount: data[i].purchaseAmount ?
                  data[i].purchaseAmount.toFixed(2) : null,
              };
            }
            this.optionsDialog.page = res.data.result.number + 1;
            this.optionsDialog.pageTotal = res.data.result.totalElements;
            this.optionsDialog.pageSize = res.data.result.size;
            this.optionsDialog.tableData = data;
          }
          this.loading = false;
        });
    },
    //  弹出框查询触发事件
    dialogSearch(msg, form) {
      this.filterForm = Object.assign({}, this.filterForm, {
        drugsCode: form.drugsCode.value,      // 药品编码
        drugsName: form.drugsName.value,
        deliveryMemberName: form.deliveryMemberName.value,
      });
      this.dataDialogList(msg, form);
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

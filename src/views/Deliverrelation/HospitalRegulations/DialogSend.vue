<template>
  <DialogList :isShowDialog="options.isShowDialog" :tableType="options.tableType" :showNum="2" :showBtn="optionsDialog.showBtn" :msgBase="options.msgBase" @dataSearch="dialogSearch" @pageChange="dialogPage" @dataSelect="dialogSelect" :options="optionsDialog" @dialogHide="dialogHide">
  </DialogList>
</template>

<script>
/**
 * Created by 李昌盛
 * 配送数量企业弹框
 */
import { mapActions, mapGetters } from 'vuex';
import DialogList from '../../../components/DialogList';                            //  弹框组件
import HospitalRegulations from '../../../api/Deliverrelation/HospitalRegulations';

export default {
  activated() {
    this.$bus.$on('data/choose/DialogSend', this.dataChoose);
  },
  deactivated() {
    this.$bus.$off('data/choose/DialogSend', this.dataChoose);
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
        title: '配送企业',                //  弹出框的标题
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
            key: 'deliveryMemberCode',
            name: '企业编码',
            width: 100,
          },
          {
            key: 'deliveryMemberName',
            name: '企业名称',
            width: 100,
          },
          {
            key: 'city',
            name: '所在地区',
            width: 100,
          },
        ],
        searchMessage: [
          {
            key: 'deliveryMemberCode',
            label: '企业编码',
            placeholder: '请输入企业编码',
            type: 0,
            input: '',
          },
          {
            key: 'deliveryMemberName',
            label: '企业名称',
            placeholder: '请输入企业名称',
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
          hospitalMemberId: null,
          createDate: null,
        },
      },
    };
  },
  methods: {
    //  弹出框选择之后确定事件
    dialogSelect(rows, msgCom, msgBase) {},
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
      HospitalRegulations.sendList(cpage, cpageSizes, forms)
        .then((res) => {
          if (res.data.code === 0) {
            this.optionsDialog.isLoadingTable = false;
            const data = res.data.result.content;
            for (let i = 0; i < data.length; i += 1) {
              data[i].city = `${data[i].provinceName || ''}${data[i].cityName || ''}${data[i].countyName || ''}`;
              data[i].num = (res.data.result.number * res.data.result.size) + i + 1;
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
        deliveryMemberName: form.deliveryMemberName.value,
        deliveryMemberCode: form.deliveryMemberCode.value,
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

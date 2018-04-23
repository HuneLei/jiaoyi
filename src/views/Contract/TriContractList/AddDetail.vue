<template>
  <div>
    <DialogList :isShowDialog="options.isShowDialog" :tableSelected="options.tableSelected" :tableType="1" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dataSelect="dialogSelect" @dataSearch="dialogSearch" @dialogHide="dialogHide">
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
import TriContractList from '../../../api/Contract/TriContractList';             //  三方合同列表api
import DialogList from '../../../components/DialogList';                            //  弹框组件

export default {
  activated() {
    this.$bus.$on('my/getProjectId', this.getDialogProjectId);
  },
  deactivated() {
    this.$bus.$off('my/getProjectId', this.getDialogProjectId);
  },
  components: {
    DialogList,
  },
  computed: mapGetters([
  ]),
  props: {
    options: {
      msgBase: '',                        //  没什么卵用，有需要可以看看
      isShowDialog: false,                //  显示弹框
      tableSelected: null,                //  默认表格选中
      tableType: 1,                       //  0 单选，1 多选 默认单选
    },
  },
  watch: {
    'options.isShowDialog': 'dataDialogList',
  },
  data() {
    return {
      projectId: null,
      optionsDialog: {                    //  基础配置，都要配的
        isLoadingTable: false,            //  表格的loading
        title: '添加明细',                 //  弹出框的标题
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
        tableBase: '',      //  表格列表名称，根据具体情况使用，可为空
        tableData: [],                  //  表格信息
        tableOptions: [
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
            key: 'tradeName',
            name: '商品名',
            width: 80,
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
            key: 'formName',
            name: '剂型',
            width: 90,
          },
          {
            key: 'unitName',
            name: '单位',
            width: 90,
          },
          {
            key: 'hospitalUnitPrice',
            name: '单价',
            align: 'right',
            width: 70,
          },
          {
            key: 'producerName',
            name: '生产企业',
            width: 180,
          },
          {
            key: 'deliveryMemberName',
            name: '配送企业',
            width: 180,
          },
          {
            key: 'salerMemberName',
            name: '卖方会员',
            width: 180,
          },
          {
            key: 'attributeName',
            name: '规格属性',
            width: 90,
          },
          {
            key: 'packagesName',
            name: '包装材质',
            width: 90,
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
            key: 'specName',
            label: '规格',
            placeholder: '请输入规格',
            type: 0,
            input: '',
          },
          {
            key: 'approvalNumber',
            label: '批准文号',
            placeholder: '请输入批准文号',
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
          {
            key: 'formName',
            label: '剂型',
            placeholder: '请输入剂型',
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
        ],
        customFooter: false,               //  自定义底部
        customFooterName: 'myfooter',     //  自定义底部名称
        customTable: false,                //  自定义表格
        customTableName: 'mytable',       //  自定义表格class
      },
      dialogData: [],
      filterForm: {
        drugsIds: null,
        drugsCode: null,      // 药品编码
        drugsName: null,
        producerName: null,
        deliveryMemberName: null,
        specName: null,
        approvalNumber: null,
        tradeName: null,
        formName: null,
        salerMemberName: null,
        projectId: null,
        gpoMemberId: null,
      },
    };
  },
  methods: {
    getDialogProjectId(id, drugsIds) {
      this.filterForm = Object.assign({});   // 将搜索条件清空
      this.projectId = id;
      if (this.projectId === '') {
        this.projectId = 0;
      }
      this.filterForm.drugsIds = drugsIds;
      this.dataDialogList();
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
      this.filterForm.projectId = this.projectId;
      TriContractList.drugUsableList(cpage, cpageSizes, this.filterForm)
        .then((res) => {
          if (res.data.code === 0) {
            this.optionsDialog.isLoadingTable = false;
            const data = res.data.result.content;
            for (let i = 0; i < data.length; i += 1) {
              data[i].num = (res.data.result.number * res.data.result.size) + i + 1;
              if (data[i].nametype > -1) {
                this.tableSelected = [data[i].id];
              }
            }
            this.optionsDialog.page = res.data.result.number + 1;
            this.optionsDialog.pageTotal = res.data.result.totalElements;
            this.optionsDialog.pageSize = res.data.result.size;
            this.optionsDialog.tableData = data;
          }
        });
    },
    //  弹出框选择之后确定事件
    dialogSelect(rows, msgCom, msgBase) {
      this.$bus.$emit('data/rows', rows);
    },
    //  弹出框查询触发事件
    dialogSearch(msg, form) {
      this.filterForm = Object.assign({}, this.filterForm, {
        drugsCode: form.drugsCode.value,      // 药品编码
        drugsName: form.drugsName.value,
        producerName: form.producerName.value,
        deliveryMemberName: form.deliveryMemberName.value,
        specName: form.specName.value,
        approvalNumber: form.approvalNumber.value,
        tradeName: form.tradeName.value,
        formName: form.formName.value,
        salerMemberName: form.salerMemberName.value,
      });
      this.dataDialogList(msg, form);
    },
  },
};
</script>

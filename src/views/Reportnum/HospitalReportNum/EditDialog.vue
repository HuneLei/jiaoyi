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
  import HospitalReportNum from '../../../api/Reportnum/HospitalReportNum';
  
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
        timeId: '',
        ids: 0,
        id: 0,
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
            projectId: null,
            projectSubId: null,
            hospitalMemberId: null,
            hospitalInnerCode: {},
            superviseCode: {},
            drugsCode: {},
            drugsName: {},
            formName: {},
            specName: {},
            producerName: {},
            tradeName: {},
            approvalNumber: {},
            qualityLevel: {},
            enrollName: {},
            ids: 0,
          },
          tableBase: 'memebr', //  表格列表名称，根据具体情况使用，可为空
          tableData: [], //  表格信息
          tableOptions: [ //  要显示的表格列，默认开启选择框、num
            {
              key: 'hospitalInnerCode',
              name: '医院内部编码',
              width: 120,
            },
            {
              key: 'superviseCode',
              name: '卫监码',
              width: 80,
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
              key: 'tradeName',
              name: '商品名',
              width: 80,
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
              key: 'producerName',
              name: '生产企业',
              width: 180,
            },
            {
              key: 'enrollName',
              name: '卖方会员',
              width: 180,
            },
            {
              key: 'approvalNumber',
              name: '批准文号',
              width: 130,
            },
            {
              key: 'qualityLevel',
              name: '质量层次',
              width: 80,
            },
          ],
          searchMessage: [ //  初始化搜索条件
            {
              key: 'hospitalInnerCode',
              label: '医院内部编码',
              placeholder: '请输入医院内部编码',
              type: 0,
            },
            {
              key: 'superviseCode',
              label: '卫监码',
              placeholder: '请输入卫监码',
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
              key: 'tradeName',
              label: '商品名',
              placeholder: '请输入商品名',
              type: 0,
            },
            {
              key: 'formName',
              label: '剂型',
              placeholder: '请输入剂型',
              type: 0,
            },
            {
              key: 'specName',
              label: '规格',
              placeholder: '请输入规格',
              type: 0,
            },
            {
              key: 'approvalNumber',
              label: '批准文号',
              placeholder: '请输入批准文号',
              type: 0,
            },
            {
              key: 'qualityLevel',
              label: '质量层次',
              placeholder: '请输入质量层次',
              type: 0,
            },
            {
              key: 'producerName',
              label: '生产企业',
              placeholder: '请输入生产企业名称',
              type: 0,
            },
            {
              key: 'enrollName',
              label: '卖方会员',
              placeholder: '请输入卖方会员',
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
        // console.log();
        if (this.$route.path === '/Reportnum/HospitalReportNum/Creat') {
          for (let i = 0; i < this.Order_PlanDateList.length; i += 1) {
            const itemone = this.Order_PlanDateList[i];
            noitemLists[i] = `${itemone.ids}`;
          }
        } else if (this.$route.path === '/Reportnum/HospitalReportNum/Edit') {
          for (let i = 0; i < this.Order_PlanItemList.length; i += 1) {
            const itemone = this.Order_PlanItemList[i];
            noitemLists[i] = `${itemone.ids}`;
          }
        }
        noitemLists = noitemLists.join(',');
        // console.log();
        this.optionsDialog.isLoadingTable = true;
        const formlist = form;
        formlist.ids = noitemLists || 0;
        formlist.gpoMemberId = this.options.gpoMemberId;
        formlist.projectId = this.options.projectId;
        formlist.projectSubId = this.options.projectSubId;
        formlist.timeId = this.options.timeId;
        formlist.id = this.options.id || 0;
        formlist.hospitalMemberId = this.options.hospitalMemberId;
        HospitalReportNum.reportnumDrugs(page || 0, size || 10, formlist).then((res) => {
          if (res.data.code === 0) {
            this.optionsDialog.isLoadingTable = false;
            const data = res.data.result.content;
            for (let i = 0; i < data.length; i += 1) {
              data[i].num = (res.data.result.number * res.data.result.size) + i + 1;
              data[i].purchaseNum = data[i].reportNum;
              data[i].ids = data[i].drugsId || data[i].id;
              data[i].drugsId = data[i].id;
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
        if (this.$route.path === '/Reportnum/HospitalReportNum/Creat') {
          this.GetPlanDate(rows);
          // console.log();
        } else if (this.$route.path === '/Reportnum/HospitalReportNum/Edit') {
          this.GetItemDate(rows);
        }
        this.$emit('dialogSelect', rows, msgCom, msgBase);
        // console.log();
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

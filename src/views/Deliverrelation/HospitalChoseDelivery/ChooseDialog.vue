<template>
  <DialogList :isShowDialog="options.isShowDialog" :tableType="options.tableType" :showNum="2" :showBtn="optionsDialog.showBtn" :msgBase="options.msgBase" @buttonCreat="buttonCreat" @dataSearch="dialogSearch" @pageChange="dialogPage" @dataSelect="dialogSelect" :options="optionsDialog" @dialogHide="dialogHide">
  </DialogList>
</template>

<script>
/**
 * Created by 李昌盛
 * 基础编码库
 * 药品附加信息 弹框组件
 */
import { mapActions, mapGetters } from 'vuex';
import DialogList from '../../../components/DialogList';                            //  弹框组件
import HospitalChoseDelivery from '../../../api/Deliverrelation/HospitalChoseDelivery';

export default {
  activated() {
    // this.$bus.$on('data/getprojectid', this.getprojectid);
    this.$bus.$on('data/choose', this.dataChoose);
    // if (this.getGpoId && this.getProjectId) {
    //   this.filterForm.projectId = this.getProjectId;                  // 获取当前切换的集采项目号码
    //   this.dataList();
    // }
  },
  deactivated() {
    // this.$bus.$off('data/getprojectid', this.getprojectid);
    this.$bus.$off('data/choose', this.dataChoose);
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
        title: '可选配送企业',                //  弹出框的标题
        dialogSize: 'small',              //  弹出框的大小，tiny/small/large/full
        page: 1,                          //  当前页
        pageTotal: 0,                     //  总条数
        pageSize: 10,                     //  每一页显示多少条
        showSelection: false,
        selection: false,           //  表格选择框，去掉
        isHideSearch: false,
        multipleSelection: [],
        tableBase: '', //  表格列表名称，根据具体情况使用，可为空
        tableData: [],                    //  表格信息
        tableOptions: [                   //  要显示的表格列，默认开启选择框、num
          {
            key: 'deliveryMemberCode',
            name: '配送企业编码',
          },
          {
            key: 'deliveryMemberName',
            name: '配送企业名称',
          },
          {
            key: 'cScope',
            name: '经营范围',
          },
          {
            key: 'deliveryMemberId',
            text: '查看',
            name: '配送区域',
            button: true,
          },
        ],
        searchMessage: [
          {
            key: 'deliveryMemberCode',
            label: '企业编码',
            placeholder: '请输入配送企业编码',
            type: 0,
            input: '',
          },
          {
            key: 'deliveryMemberName',
            label: '企业名称',
            placeholder: '请输入配送企业名称',
            type: 0,
            input: '',
          },
        ],    //  初始化搜索条件
        // 控制弹出窗的按钮
        showBtn: {
          isShowSure: true,
          isShowCanel: true,
        },
        filterForm: {
          projectId: null,
          gpoMemberId: null,
          drugsId: null,
          salerMemberId: null,
          hospitalMemberId: null,
          deliveryMemberName: null,
          deliveryMemberCode: null,
        },
      },
    };
  },
  methods: {
    //  弹出框选择之后确定事件
    dialogSelect(rows, msgCom, msgBase) {
      // console.log();
      this.filterForm = Object.assign({}, this.filterForm, {
        deliveryMemberCode: rows[0].deliveryMemberCode,
        deliveryMemberId: rows[0].deliveryMemberId,
        deliveryMemberName: rows[0].deliveryMemberName,
        nametype: rows[0].nametype,
        hospitalMemberPrice: rows[0].hospitalUnitPrice,
      });
      this.$emit('data-loading');
      HospitalChoseDelivery.add(this.filterForm).then((res) => {
        // console.log();
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '添加成功',
          });
        }
        this.$bus.$emit('data/list');
      });
    },
    //  关闭弹出框
    dialogHide() {
      this.options.isShowDialog = false;
    },
    //  页面切换
    dialogPage(msg, form, page, size) {
      this.dataDialogList(msg, form, page, size);
    },
    buttonCreat(data) {
      // // console.log();
      // this.$router.push({ path: '/Deliverrelation/HospitalChoseDelivery/EnterpriseCopeh',
      // query: { pid: this.filterForm.projectId, gid: this.getGpoId, mid: data } });
      // this.dialogHide();
      const form = {
        pid: this.filterForm.projectId,
        gid: this.getGpoId,
        mid: data,
      };
      this.$bus.$emit('data/area/create', form);
    },
    dataChoose(form) {
      // console.log();
      this.filterForm = form;
      // this.filterForm = Object.assign({}, this.filterForm, {
      //   nametype: form.updateid,
      //   projectId: form.projectId,
      // });
      // console.log();
      this.dataDialogList();
    },
    // 加载列表
    dataDialogList(msg, form, page, pageSizes) {
      this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      // console.log();
      HospitalChoseDelivery.update(cpage, cpageSizes, this.filterForm)
        .then((res) => {
          // console.log();
          if (res.data.code === 0) {
            this.optionsDialog.isLoadingTable = false;
            const data = res.data.result.content;
            for (let i = 0; i < data.length; i += 1) {
              data[i].num = (res.data.result.number * res.data.result.size) + i + 1;
            }
            // console.log();
            this.optionsDialog.page = res.data.result.number + 1;
            this.optionsDialog.pageTotal = res.data.result.totalElements;
            this.optionsDialog.pageSize = res.data.result.size;
            this.optionsDialog.tableData = data;
            // this.$bus.$emit('dialogList/deliveryselect', this.filterForm.deliveryMemberId);
            setTimeout(() => {
              this.$bus.$emit('dialogList/deliveryselect', [this.filterForm.deliveryMemberId]);
            }, 0);
          }
          this.loading = false;
        });
    },
    //  弹出框查询触发事件
    dialogSearch(msg, form) {
      // console.log();
      this.filterForm = Object.assign({}, this.filterForm, {
        deliveryMemberCode: form.deliveryMemberCode.value,      // 药品编码
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

<template>
  <div>
    <DialogList :isShowDialog="options.isShowDialog" :tableSelected="options.tableSelected" :tableType="0" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dataSelect="dialogSelect" @dialogOpen="dialogOpen" @dataSearch="dialogSearch" @dialogHide="dialogHide" @buttonCreat="buttonCreat">
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
import HospitalChangeDelivery from '../../../api/Deliverrelation/HospitalChangeDelivery';
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
      salerMemberId: '',
    },
  },
  data() {
    return {
      projectId: null,
      optionsDialog: {                    //  基础配置，都要配的
        isLoadingTable: false,            //  表格的loading
        title: '选择配送企业',                 //  弹出框的标题
        dialogSize: 'large',              //  弹出框的大小，tiny/small/large/full
        page: 1,                          //  当前页
        pageTotal: 0,                     //  总条数
        pageSize: 20,                     //  每一页显示多少条
        dialogForm: {
          projectId: null,
          gpoMemberId: null,
          drugsId: null,
          salerMemberId: null,
          memberNo: null,
          memberName: null,
          provinceId: null,
          cityId: null,
          countyId: null,
          memberarrs: null,
        },
        tableBase: '',      //  表格列表名称，根据具体情况使用，可为空
        tableData: [],                  //  表格信息
        tableOptions: [
          {
            key: 'deliveryMemberCode',
            name: '配送企业编码',
            width: 50,
          },
          {
            key: 'deliveryMemberName',
            name: '配送企业名称',
            width: 80,
          },
          {
            key: 'cScope',
            name: '经营范围',
            width: 300,
          },
          {
            key: 'region',
            name: '所在地区',
            width: 90,
          },
          {
            text: '查看',
            key: 'deliveryMemberId',
            name: '配送区域',
            width: 50,
            button: true,
          },
        ],                //  要显示的表格列，默认开启选择框、num
        searchMessage: [                  //  初始化搜索条件
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
          {
            key: 'region',
            label: '所在地区',
            placeholder: '请选择省市',
            hasOp: false,
            type: 3,
            selects: [],
          },
        ],
        customFooter: false,               //  自定义底部
        customFooterName: 'myfooter',     //  自定义底部名称
        customTable: false,                //  自定义表格
        customTableName: 'mytable',       //  自定义表格class
      },
      dialogData: [],
      filterForm: {
        projectId: null,
        gpoMemberId: null,
        drugsId: null,
        salerMemberId: null,
        hospitalMemberId: null,
        deliveryMemberCode: null,
        deliveryMemberName: null,
        provinceId: null,
        cityId: null,
        countyId: null,
      },
    };
  },
  methods: {
    buttonCreat(data) {
      // // console.log();
      // this.$router.push({ path: '/Deliverrelation/HospitalChoseDelivery/EnterpriseCopeh',
      // query: { pid: this.filterForm.projectId, gid: this.getGpoId, mid: data } });
      // this.dialogHide();
      const form = {
        pid: this.options.projectId,
        gid: this.options.gpoMemberId,
        mid: data,
      };
      this.$bus.$emit('data/area/create1', form);
    },
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
    dataDialogList(msg, form, page, pageSizes) {
      // this.loading = true;
      let cpage = page;
      let cpageSizes = pageSizes;
      if (page !== 0 && !page) cpage = this.page;
      if (!pageSizes) cpageSizes = this.size;
      // this.filterForm.gpoMemberId = this.getGpoId;          // 默认的GPOID
      const formlist = form;
      this.filterForm.gpoMemberId = this.options.gpoMemberId;
      this.filterForm.projectId = this.options.projectId;
      this.filterForm.drugsId = this.options.drugsId;
      this.filterForm.salerMemberId = this.options.salerMemberId;
      this.filterForm.hospitalMemberId = this.options.hospitalMemberId;
      HospitalChangeDelivery.distribu(cpage, cpageSizes, this.filterForm)
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
    //  弹出框选择之后确定事件
    dialogSelect(rows, msgCom, msgBase) {
      this.$bus.$emit('data/deliveryChoose', rows, this.options.drugsId);
    },
    //  弹出框查询触发事件
    dialogSearch(msg, form) {
      this.filterForm = Object.assign({}, this.filterForm, {
        deliveryMemberCode: form.deliveryMemberCode.value,      // 药品编码
        deliveryMemberName: form.deliveryMemberName.value,
        provinceId: form.provinceId.value,
        cityId: form.cityId.value,
        countyId: null,
      });
      this.dataDialogList(msg, form);
    },
  },
};
</script>

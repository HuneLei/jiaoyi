<template>
  <div>
    <DialogList :isShowDialog="options.isShowDialog" :tableSelected="options.tableSelected" :tableType="0" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dataSelect="dialogSelect" @dataSearch="dialogSearch" @dialogHide="dialogHide">
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
    this.$bus.$on('export/getProjectId', this.getDialogProjectId);
  },
  deactivated() {
    this.$bus.$off('export/getProjectId', this.getDialogProjectId);
  },
  components: {
    DialogList,
  },
  props: {
    options: {
      msgBase: '',                        //  没什么卵用，有需要可以看看
      isShowDialog: false,                //  显示弹框
      tableSelected: null,                //  默认表格选中
    },
  },
  data() {
    return {
      optionsDialog: {                    //  基础配置，都要配的
        isLoadingTable: false,            //  表格的loading
        title: '导入报量明细',                 //  弹出框的标题
        dialogSize: 'small',              //  弹出框的大小，tiny/small/large/full
        isHideSearch: true,
        page: 1,                          //  当前页
        pageTotal: 0,                     //  总条数
        pageSize: 20,                     //  每一页显示多少条
        tableBase: '',      //  表格列表名称，根据具体情况使用，可为空
        tableData: '',                  //  表格信息
        tableOptions: [
          {
            key: 'timeName',
            name: '期间名称',
            width: 100,
          },
          {
            key: 'reportnumValidtime',
            name: '报量有效期',
            width: 160,
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
          {
            key: 'projectSubName',
            name: '集采子项目',
            width: 140,
          },
          {
            key: 'projectName',
            name: '集采项目',
            width: 140,
          },
        ],
        customFooter: false,               //  自定义底部
        customFooterName: 'myfooter',     //  自定义底部名称
        customTable: false,                //  自定义表格
        customTableName: 'mytable',       //  自定义表格class
      },
      dialogData: [],
      projectId: null,
    };
  },
  methods: {
    getDialogProjectId(id) {
      this.projectId = id;
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
      TriContractList.reportList(cpage, cpageSizes, this.projectId)
        .then((res) => {
          if (res.data.code === 0) {
            this.optionsDialog.isLoadingTable = false;
            const data = res.data.result.content;
            for (let i = 0; i < data.length; i += 1) {
              data[i].num = (res.data.result.number * res.data.result.size) + i + 1;
              if (data[i].nametype > -1) {
                this.tableSelected = [data[i].id];
              }
              data[i].createTime = data[i].createTime.substring(0, 19);
              data[i].reportnumValidtime = `${data[i].reportnumValidBtime.substring(0, 10) || ''}~${data[i].reportnumValidEtime.substring(0, 10) || ''}`;
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
      this.$bus.$emit('data/Itemrows', rows);
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

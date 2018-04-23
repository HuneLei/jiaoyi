<template>
  <DialogList :isShowDialog="options.isShowDialog" :tableSelected="options.tableSelected" :tableType="1" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dataSelect="dialogSelect" @dataSearch="dialogSearch" @dialogOpen="dialogOpen" @dialogHide="dialogHide">
  </DialogList>
</template>

<script>
/**
 * Created by wuqian on 2017/9/20.
 * 弹框组件
 */
import DialogList from '../../../components/DialogList'; //  弹框组件
import DrugsUp from '../../../api/Drugs/DrugsUp'; // 药品上架管理APi

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
      projectId: '',
      gpoMemberId: '',
    },
  },
  data() {
    return {
      drugsStrings: 0,
      optionsDialog: { //  基础配置，都要配的
        isLoadingTable: true, //  表格的loading
        IsTrue: true,
        title: '新增药品', //  弹出框的标题
        dialogSize: 'large', //  弹出框的大小，tiny/small/large/full
        page: 1, //  当前页
        pageTotal: 0, //  总条数
        pageSize: 10, //  每一页显示多少条
        dialogForm: { //  初始化弹出框的搜索条件，enabled 一定要加
          drugsCode: {},
          drugsName: {},
          tradeName: {},
          formName: {},
          specificationName: {},
          producerName: {},
          approvalNumber: {},
        },
        tableBase: 'memebr', //  表格列表名称，根据具体情况使用，可为空
        tableData: [], //  表格信息
        tableOptions: [ //  要显示的表格列，默认开启选择框、num
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
            key: 'formName',
            name: '剂型',
            width: 90,
          },
          {
            key: 'specificationName',
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
            key: 'approvalNumber',
            name: '批准文号',
            width: 130,
          },
          {
            key: 'producerName',
            name: '生产企业',
            width: 180,
          },
          {
            key: 'tradeName',
            name: '商品名',
            width: 80,
          },
        ],
        searchMessage: [ //  初始化搜索条件
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
            key: 'formName',
            label: '剂型',
            placeholder: '请输入剂型',
            type: 0,
          },
          {
            key: 'specificationName',
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
            key: 'producerName',
            label: '生产企业',
            placeholder: '请输入生产企业',
            type: 0,
          },
          {
            key: 'tradeName',
            label: '商品名',
            placeholder: '请输入商品名',
            type: 0,
          },
        ],
      },
    };
  },
  methods: {
    //  每一次加载进去的时候
    dialogOpen() {
      // DrugsUp.all(this.options.gpoMemberId, this.options.projectId).then((res) => {
      //   if (res.data.code === 0) {
      //     const data = res.data.result;
      //     const drugsString = [];
      //     for (let i = 0; i < data.length; i += 1) {
      //       drugsString.push(data[i].code);
      //     }
      //     this.drugsStrings = drugsString.join();
      this.dataDialogList(this.optionsDialog.tableBase, this.optionsDialog.dialogForm);
      //   }
      // });
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
      const formlist = form;
      // formlist.drugsString = this.drugsStrings || 0;
      formlist.gpoMemberId = this.options.gpoMemberId;
      formlist.projectId = this.options.projectId;
      DrugsUp.createList(page || 0, size || 10, formlist).then((res) => {
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
          setTimeout(() => {
            this.$bus.$emit('dialogList/select');
          }, 0);
          this.$emit('page', data.number + 1, data.size, data.totalElements);
        }
      });
    },
    //  弹出框选择之后确定事件
    dialogSelect(rows, msgCom, msgBase) {
      if (rows.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要添加的上架药品',
        });
        return;
      }
      const ret = '此操作将批量新增选中的药品, 是否继续?';
      this.$confirm(ret, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('dialogSelect', rows, msgCom, msgBase);
        this.options.isShowDialog = false;
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作',
        });
      });
    },
    //  弹出框查询触发事件
    dialogSearch(msg, form) {
      this.dataDialogList(msg, form);
    },
  },
};
</script>

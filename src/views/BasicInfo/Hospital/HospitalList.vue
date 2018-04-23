<template>
  <DialogList :isShowDialog="options.isShowDialog" :tableSelected="options.tableSelected" :tableType="options.tableType" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dataSelect="dialogSelect" @dataSearch="dialogSearch" @dialogOpen="dialogOpen" @dialogHide="dialogHide">
  </DialogList>
</template>

<script>
/**
 * Created by 李昌盛
 * 基础编码库
 * 药品附加信息 弹框组件
 */
import DialogList from '../../../components/DialogList';                            //  弹框组件
import hospital from '../../../api/BasicInfo/Hospital';   // api -- 医疗机构

export default {
  components: {
    DialogList,
  },
  props: {
    options: {
      msgBase: '',
      isShowDialog: false,
      tableSelected: null,
      tableType: 0,                       //  0 单选，1 多选 默认单选
    },
  },
  data() {
    return {
      optionsDialog: {                    //  基础配置，都要配的
        isLoadingTable: true,             //  表格的loading
        title: '医疗机构',                //  弹出框的标题
        dialogSize: 'small',              //  弹出框的大小，tiny/small/large/full
        page: 1,                          //  当前页
        pageTotal: 0,                     //  总条数
        pageSize: 10,                     //  每一页显示多少条
        dialogForm: {                     //  初始化弹出框的搜索条件，enabled 一定要加
          hospitalName: null,
          hospitalCode: null,
        },
        tableBase: 'memebr',      //  表格列表名称，根据具体情况使用，可为空
        tableData: [],                    //  表格信息
        tableOptions: [                   //  要显示的表格列，默认开启选择框、num
          {
            key: 'hospitalCode',
            name: '医院编码',
          },
          {
            key: 'hospitalName',
            name: '医院名称',
          },
        ],
        searchMessage: [    //  初始化搜索条件
          {
            key: 'hospitalCode',
            label: '医院编码',
            placeholder: '请输入医院编码',
            type: 0,
            input: '',
          },
          {
            key: 'hospitalName',
            label: '医院名称',
            placeholder: '请输入医院名称',
            type: 0,
            input: '',
          },
        ],
      },
      filterForm: {
        hospitalCode: null,
        hospitalName: null,
      },
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
    dataDialogList(msg, form, page, size) {
      this.optionsDialog.isLoadingTable = true;
      hospital.hospitalList(page || 0, size || 10, this.filterForm).then((res) => {
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
        }
      });
    },
    //  弹出框选择之后确定事件
    dialogSelect(rows, msgCom, msgBase) {
      this.$emit('dialogSelect', rows, msgCom, msgBase);
    },
    //  弹出框查询触发事件
    dialogSearch(msg, form) {
      this.filterForm = Object.assign({}, this.filterForm, {
        hospitalCode: form.hospitalCode.value,
        hospitalName: form.hospitalName.value,
      });
      this.dataDialogList(msg, form);
    },
  },
};
</script>

<template>
  <DialogList :isShowDialog="options.isShowDialog" :showBtn="optionsDialog.showBtn" :tableSelected="options.tableSelected" :tableType="options.tableType" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dataSelect="dialogSelect" @dataSearch="dialogSearch" @dialogOpen="dialogOpen" @dialogHide="dialogHide">
  </DialogList>
</template>

<script>
/**
 * Created by 李昌盛
 * 基础编码库
 * 药品附加信息 弹框组件
 */
import DialogList from '../../../components/DialogList';                            //  弹框组件
import Hospital from '../../../api/BasicInfo/Hospital';                             // 医疗机构API
import address from '../../../api/BasicInfo/Address';                             // 医疗机构API

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
      isHideSearch: true,
    },
    row: {},
  },
  data() {
    return {
      optionsDialog: {                    //  基础配置，都要配的
        isLoadingTable: true,             //  表格的loading
        title: '仓库地址',                //  弹出框的标题
        dialogSize: 'small',              //  弹出框的大小，tiny/small/large/full
        page: 1,                          //  当前页
        pageTotal: 0,                     //  总条数
        pageSize: 10,                     //  每一页显示多少条
        dialogForm: {                     //  初始化弹出框的搜索条件，enabled 一定要加
          memberName: {},
          memberNo: {},
          enabled: { op: 'equal', value: 1 },
          removed: 0,
        },
        selection: false,
        isHideSearch: true,
        showSelection: true,
        tableBase: '配送地址',              //  表格列表名称，根据具体情况使用，可为空
        tableData: [],                    //  表格信息
        tableOptions: [                   //  要显示的表格列，默认开启选择框、num
          {
            key: 'addressCode',
            name: '地址编码',
          },
          {
            key: 'addressType',
            name: '地址类型',
            option: [
              {
                label: '医疗机构（配送点）',
                value: 1,
              },
              {
                label: '配送商（仓库）',
                value: 2,
              },
              {
                label: 'GPO仓库',
                value: 3,
              },
            ],
          },
          {
            key: 'addressName',
            name: '地址名称',
          },
          {
            key: 'provinceName',
            name: '省',
          },
          {
            key: 'cityName',
            name: '市',
          },
          {
            key: 'countyName',
            name: '区',
          },
          {
            key: 'addressFull',
            name: '详细地址',
          },
          {
            key: 'contacter',
            name: '联系人',
          },
          {
            key: 'contacterPhone',
            name: '联系电话',
          },
        ],
        searchMessage: [],    //  初始化搜索条件
        filterForm: {
          memberId: null,                       // 会员ID
          memberName: null,
          provinceId: null,                     // 省ID
          cityId: null,                         // 市ID
          countyId: null,                       // 区ID
        },
        // 控制弹出窗的按钮
        showBtn: {
          isShowSure: false,
          isShowCanel: false,
          isShowClose: true,
        },
      },
    };
  },
  methods: {
    //  每一次加载进去的时候
    dialogOpen() {
      this.filterForm = {
        memberId: this.row.memberId, // 会员ID todo 是否要获取当前vuex值
      };
      this.dataDialogList(this.optionsDialog.tableBase, this.filterForm);
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
      address.memberList(page || 0, size || 10, this.filterForm).then((res) => {
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
//          setTimeout(() => {
//            this.$bus.$emit('dialogList/select');
//          }, 0);
        }
      });
    },
    //  弹出框选择之后确定事件
    dialogSelect(rows, msgCom, msgBase) {
      this.$emit('dialogSelect', rows, msgCom, msgBase);
    },
    //  弹出框查询触发事件
    dialogSearch(msg, form) {
      this.dataDialogList(msg, form);
    },
  },
};
</script>

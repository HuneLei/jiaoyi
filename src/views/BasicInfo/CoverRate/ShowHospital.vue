<template>
  <DialogList
    :isShowDialog="options.isShowDialog"
    :tableSelected="options.tableSelected"
    :tableType="options.tableType"
    :msgBase="options.msgBase"
    :options="optionsDialog"
    @pageChange="dialogPage"
    @dataSelect="dialogSelect"
    @dataSearch="dialogSearch"
    @dialogOpen="dialogOpen"
    @dialogHide="dialogHide">
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
import CoverRate from '../../../api/BasicInfo/CoverRate';                             // 医疗机构API

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
      dialogOptions: {
        msgBase: 'hospitalId',              //  没什么卵用，有需要可以看看
        isShowDialog: false,                //  显示弹框
        tableSelected: null,                //  默认表格选中
        tableType: 0,                       //  0 单选，1 多选 默认单选
      },
      optionsDialog: {                    //  基础配置，都要配的
        isLoadingTable: true,             //  表格的loading
        title: '医疗机构',                //  弹出框的标题
        dialogSize: 'small',              //  弹出框的大小，tiny/small/large/full
        page: 1,                          //  当前页
        pageTotal: 0,                     //  总条数
        pageSize: 10,                     //  每一页显示多少条
        dialogForm: {                     //  初始化弹出框的搜索条件，enabled 一定要加
          hospitalName: null,
          provinceId: null,
          cityId: null,
          enabled: { op: 'equal', value: 1 },
          removed: 0,
        },
        showSelection: false,
        isHideSearch: false,
        tableBase: '配送地址',              //  表格列表名称，根据具体情况使用，可为空
        tableData: [],                    //  表格信息
        tableOptions: [                   //  要显示的表格列，默认开启选择框、num
          {
            key: 'location',
            name: '所在地区',
          },
          {
            key: 'hospitalCode',
            name: '医疗机构编码',
          },
          {
            key: 'hospitalName',
            name: '医疗机构名称',
          },
        ],
        searchMessage: [
          {
            key: 'region',
            label: '所在地区',
            placeholder: '请选择所在地区',
            type: 3,
          },
          {
            key: 'hospital',
            label: '医疗机构',
            placeholder: '请输入医疗机构名称',
            type: 0,
          },
        ],    //  初始化搜索条件
        filterForm: {
          hospitalName: null,                       // 会员ID
          provinceId: null,                         // 省ID
          cityId: null,                             // 市ID
        },
      },
    };
  },
  methods: {
    //  每一次加载进去的时候
    dialogOpen() {
      this.filterForm = {
        memberId: this.row.id, // 会员ID todo 是否要获取当前vuex值
        memberName: {
          op: null,
          value: null,
        },
        provinceId: null,
        cityId: null,
        countyId: null,
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
      CoverRate.all(page || 0, size || 10, form).then((res) => {
        if (res.data.code === 0) {
          this.optionsDialog.isLoadingTable = false;
          const data = res.data.result.content;
          for (let i = 0; i < data.length; i += 1) {
            data[i].num = (res.data.result.number * res.data.result.size) + i + 1;
            data[i].location = `${data[i].provinceName}${data[i].cityName}${data[i].countyName}`;
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
      this.optionsDialog.filterForm.hospitalName = form.hospital.value;
      this.optionsDialog.filterForm.provinceId = form.provinceId.value;
      this.optionsDialog.filterForm.cityId = form.cityId.value;
      this.dataDialogList(msg, this.optionsDialog.filterForm);
    },
  },
};
</script>

<template>
  <DialogList :isShowDialog="options.isShowDialog" :tableSelected="options.tableSelected" :tableType="1" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dataSelect="dialogSelect" @dataSearch="dialogSearch" @dialogOpen="dialogOpen" @dialogHide="dialogHide">
  </DialogList>
</template>

<script>
  /**
   * Created by 李昌盛
   * 基础编码库
   * 药品附加信息 弹框组件
   */
  import DialogList from '../../../components/DialogList'; //  弹框组件
  import DeliverypurchaseList from '../../../api/Deliverypurchase/DeliverypurchaseList';

  export default {
    components: {
      DialogList,
    },
    props: {
      options: {
        msgBase: '',
        isShowDialog: false,
        tableSelected: null,
        tableType: 1, //  0 单选，1 多选 默认单选
        dialogForm: { //  初始化弹出框的搜索条件，enabled 一定要加
          type: Object,
          default() {
            return {
              drugsId: null,                         // 采购单id
              gpoMemberId: null,                       // GPOs
              projectId: null,                       // 集采项目id
              drugsCode: null,                       // 药品编码
              drugsName: null,                       // 通用名
              tradeName: null,                       // 商品名
              formName: null,                        // 剂型
              specificationName: null,               // 规格
              producerName: null,                    // 生产企业名称
              approvalNumber: null,                 // 批准文号
              enabled: { op: 'equal', value: 1 },
              removed: 0,
            };
          },
        },
      },
    },
    data() {
      return {
        optionsDialog: { //  基础配置，都要配的
          isLoadingTable: true, //  表格的loading
          title: '新增药品', //  弹出框的标题
          dialogSize: 'large', //  弹出框的大小，tiny/small/large/full
          page: 1, //  当前页
          pageTotal: 0, //  总条数
          pageSize: 10, //  每一页显示多少条
          tableBase: 'memebr', //  表格列表名称，根据具体情况使用，可为空
          tableData: [], //  表格信息
          tableOptions: [ //  要显示的表格列，默认开启选择框、num
            {
              key: 'drugsCode',
              name: '药品编码',
            },
            {
              key: 'drugsName',
              name: '通用名',
            },
            {
              key: 'tradeName',
              name: '商品名',
            },
            {
              key: 'formName',
              name: '剂型',
            },
            {
              key: 'specificationName',
              name: '规格',
            },
            {
              key: 'packSpecName',
              name: '包装规格',
            },
            {
              key: 'unitName',
              name: '单位',
            },
            {
              key: 'approvalNumber',
              name: '批准文号',
            },
            {
              key: 'producerName',
              name: '生产企业',
            },
            {
              key: 'protocolPrice',
              name: '单价',
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
              placeholder: '请输入通用名名称',
              type: 0,
            },
            {
              key: 'formName',
              label: '剂型',
              placeholder: '请输入剂型名称',
              type: 0,
            },
            {
              key: 'specificationName',
              label: '规格',
              placeholder: '请输入规格名称',
              type: 0,
            },
            {
              key: 'approvalNumber',
              label: '批准文号',
              placeholder: '请输入批准文号名称',
              type: 0,
            },
            {
              key: 'producerName',
              label: '生产企业',
              placeholder: '请输入生产企业名称',
              type: 0,
            },
            {
              key: 'tradeName',
              label: '商品名',
              placeholder: '请输入商品名名称',
              type: 0,
            },
          ],
          showSelection: false,
        },
      };
    },
    methods: {
      //  每一次加载进去的时候
      dialogOpen() {
        this.dataDialogList(this.optionsDialog.tableBase, this.options.dialogForm);
        // console.log();
      },
      //  关闭弹出框
      dialogHide() {
        this.options.isShowDialog = false;
      },
      //  页面切换
      dialogPage(msg, form, page, size) {
        let form1 = [];
        if (form) {
          form1 = {
            drugsId: this.options.dialogForm.drugsId,                         // 采购单id
            gpoMemberId: this.options.dialogForm.gpoMemberId,                       // GPOs
            projectId: this.options.dialogForm.projectId,                       // 集采项目id
            drugsCode: form.drugsCode,                       // 药品编码
            drugsName: form.drugsName,                       // 通用名
            tradeName: form.tradeName,                       // 商品名
            formName: form.formName,                        // 剂型
            specificationName: form.specificationName,               // 规格
            producerName: form.producerName,                    // 生产企业名称
            approvalNumber: form.approvalNumber,                 // 批准文号
          };
        } else {
          form1 = {
            drugsId: this.options.dialogForm.drugsId,                         // 采购单id
            gpoMemberId: this.options.dialogForm.gpoMemberId,                       // GPOs
            projectId: this.options.dialogForm.projectId,                       // 集采项目id
          };
        }
        // console.log();
        this.dataDialogList(msg, form1, page, size);
      },
      //  加载列表
      dataDialogList(msg, form, page, size) {
        this.optionsDialog.isLoadingTable = true;
        DeliverypurchaseList.drugsCreateList(page || 0, size || 10, form).then((res) => {
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
//            setTimeout(() => {
//              this.$bus.$emit('dialogList/select');
//            }, 0);
          }
        });
      },
      //  弹出框选择之后确定事件
      dialogSelect(rows, msgCom, msgBase) {
        this.$emit('dialogSelect', rows, msgCom, msgBase);
      },
      //  弹出框查询触发事件
      dialogSearch(msg, form) {
        this.options.dialogForm.drugsCode = form.drugsCode.value;
        this.options.dialogForm.drugsName = form.drugsName.value;
        this.options.dialogForm.tradeName = form.tradeName.value;
        this.options.dialogForm.formName = form.formName.value;
        this.options.dialogForm.specificationName = form.specificationName.value;
        this.options.dialogForm.producerName = form.producerName.value;
        this.options.dialogForm.approvalNumber = form.approvalNumber.value;
        this.dataDialogList(msg, this.options.dialogForm);
      },
    },
  };
</script>

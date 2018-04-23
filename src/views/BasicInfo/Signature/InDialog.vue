<template>
  <DialogList :isShowDialog="options.isShowDialog" :tableSelected="options.tableSelected" :tableType="0" :msgBase="options.msgBase" :options="optionsDialog" @pageChange="dialogPage" @dataSelect="dialogSelect" @dataSearch="dialogSearch" @dialogOpen="dialogOpen" @dialogHide="dialogHide">
  </DialogList>
</template>

<script>
  /**
   * Created by wuqian on 2017/9/20.
   * <p>
   * 江苏摇铃网络科技有限公司，版权所有。
   * Copyright (C) 2015-2017 All Rights Reserved.
   */
  import DialogList from '../../../components/DialogList'; //  弹框组件
  import gpo from '../../../api/gpo'; // 公告管理APi
  
  export default {
    components: {
      DialogList,
    },
    props: {
      options: {
        msgBase: '',
        isShowDialog: false,
        tableSelected: [],
        tableType: 0, //  0 单选，1 多选 默认单选
        enrollId: '',
      },
    },
    data() {
      return {
        optionsDialog: { //  基础配置，都要配的
          isLoadingTable: true, //  表格的loading
          title: '新增药品', //  弹出框的标题
          dialogSize: 'tiny', //  弹出框的大小，tiny/small/large/full
          page: 1, //  当前页
          pageTotal: 0, //  总条数
          pageSize: 10, //  每一页显示多少条
          dialogForm: { //  初始化弹出框的搜索条件，enabled 一定要加
            memberName: {},
            memberNo: {},
          },
          tableBase: 'memebr', //  表格列表名称，根据具体情况使用，可为空
          tableData: [], //  表格信息
          tableOptions: [ //  要显示的表格列，默认开启选择框、num
            {
              key: 'memberNo',
              name: '会员编码',
              width: 90,
            },
            {
              key: 'memberName',
              name: '会员名称',
              width: 150,
            },
          ],
          searchMessage: [ //  初始化搜索条件
            {
              key: 'memberNo',
              label: '会员编码',
              placeholder: '请输入会员编码',
              type: 0,
            },
            {
              key: 'memberName',
              label: '会员名称',
              placeholder: '请输入会员名称',
              type: 0,
            },
          ],
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
        gpo.memberCommonAll(page || 0, size || 10, form).then((res) => {
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
        return true;
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

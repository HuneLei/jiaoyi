<template>
  <div class="signature">
    <el-dialog :title="signDislogData.dialogTitle" :visible.sync="dialogSignVisible" @close="closeDialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <object id="PDFForm"
              classid="clsid:CA8A9780-280D-11CF-A24D-444553540000"
              width="1000"
              height="650"
              border="0">
        <param name="_Version" value="65539">
        <param name="_ExtentX" value="20108">
        <param name="_ExtentY" value="10866">
        <param name="_StockProps" value="0">
        <param name="SRC" value="">
      </object>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    watch: {
      signDialogShow(val) {     // 监听dialogFormVisible值变化组件显示隐藏
        this.dialogSignVisible = val;
      },
    },
    data() {
      return {
        dialogSignVisible: false,
      };
    },
    props: {
      signDialogShow: false,
      signDislogData: {
        dialogTitle: null,
      },
    },
    methods: {
      // 关闭窗口
      closeDialog() {
        // this.$emit('close-dialog', this.fromDialog);
      },
    },
  };
</script>

<template>
  <el-row class="fromtemp" :style="`height: ${fromHeight}px`">
    <el-col style="min-width: 4rem;">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      fromHeight: window.innerHeight - 120,
    };
  },
};
</script>

<style>
.fromtemp {
  overflow-y: auto;
}

.fromtemp .el-input,
.fromtemp .el-textarea {
  width: 300px;
}

.fromtemp .el-textarea .el-textarea__inner {
  resize: none;
}

.fromtemp .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #000;
}

.fromtemp .el-textarea.is-disabled .el-textarea__inner {
  background-color: #fff;
  color: #000;
}

.fromtemp .el-select .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #000;
}

.fromtemp .el-cascader .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #000;
}

.fromtemp .el-cascader.is-disabled .el-cascader__label {
  color: #000;
  background-color: #fff;
}

.fromtemp .el-date-editor .el-input.is-disabled .el-input__inner {
  background-color: #fff;
  color: #000;
}
</style>

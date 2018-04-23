<template>
  <div>
    <el-input v-model="row.name"></el-input>
  </div>
</template>

<script>

export default {
  props: {
    row: {
      default() {
        return {};
      },
    },
  },
};
</script>

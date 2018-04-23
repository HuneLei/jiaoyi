<template>
  <div>
    <h1>准备打印中。。。</h1>
  </div>
</template>

<script>
export default {
  created: {
  },
  data() {
    return {
      printHtml: '',
    };
  },
  methods: {
  },
  mounted() {
    const html = localStorage.getItem('printHtml');
    if (html) {
      document.body.innerHTML = html;
      window.print();
    } else {
      this.$message({
        type: 'error',
        message: '没有要打印的图片',
      });
    }
    localStorage.removeItem('printHtml');
  },
};
</script>

<style scoped>
body {
  padding: 0;
  margin: 0;
}

h1 {
  line-height: 500px;
  font-size: 60px;
  text-align: center;
}
</style>

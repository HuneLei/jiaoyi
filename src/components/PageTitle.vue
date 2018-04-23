<template>
  <p class="cardList_title" v-text="title"></p>
</template>

<script>
  export default {
    props: {
      title: String,
    },
  };
</script>

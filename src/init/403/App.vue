<template>
  <div class="app">
    <NotAuth></NotAuth>
  </div>
</template>

<script>
import NotAuth from '../../views/Basic/NotAuth';

export default {
  mounted() {
  },
  computed: {
  },
  watch: {
  },
  data() {
    return {};
  },
  components: {
    NotAuth,
  },
  methods: {
  },
};
</script>

<style>
.app {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>

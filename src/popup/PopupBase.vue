<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'Popup',
  components: {},
  created() {
    // this.$vuetify.theme.dark = true;
  },
};
</script>

<style>
html {
  width: 600px;
  min-height: 300px;

  /* white-space: nowrap; */
}
</style>

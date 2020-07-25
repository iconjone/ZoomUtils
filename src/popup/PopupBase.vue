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
  width: 500px;
  min-height: 200px;
}
</style>

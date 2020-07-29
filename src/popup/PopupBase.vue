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

::-webkit-scrollbar {
  width: 15px;
}

::-webkit-scrollbar-track {
  background: var(--v-secondary-base);
}

::-webkit-scrollbar-thumb {
  background: var(--v-primary-base);
  border: solid 1px var(--v-secondary-base);
  border-radius: 7px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--v-primary-lighten1);
}
</style>

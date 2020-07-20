<template>
  <v-app id="popup">
    <v-navigation-drawer v-model="drawer" app right>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-email</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>Zoom Utils</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon short="true" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="text-center">

            <draggable v-model="zoomData">
 <transition-group>
      <v-card  class="mt-4" v-for="element in zoomData" :key="element.meetingID">
              {{element.class}} || {{element.meetingID}} || {{element.info}}
      </v-card>
</transition-group>

</draggable>

          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-footer app>
      <span class="">&copy; {{ new Date().getFullYear() }} Amacel Web Development</span>
    </v-footer>
  </v-app>
</template>

<script>
import draggable from 'vuedraggable'
import { mapActions } from 'vuex'

export default {

  data() {
    return { drawer: null };
  },
  components: {
           draggable,
  },
  methods:{
    ...mapActions(['setZoomData']),
  },
  computed: {
    zoomData: {
      get(){return this.$store.state.zoomData;},
      set(value){this.$store.dispatch("setZoomData", value)}


    },
  },
  created() {
    console.log(this, 'created');
  }
};
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>

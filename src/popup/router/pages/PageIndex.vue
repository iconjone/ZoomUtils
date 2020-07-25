<template>
  <v-app id="popup">
    <v-navigation-drawer v-model="drawer" app right>
      <v-list>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Add</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Delete</v-list-item-title>
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
        <v-list-item>
          <v-icon>mdi-weather-sunny</v-icon>
          <v-list-item-action>
            <v-switch v-model="isDark" inset></v-switch>
          </v-list-item-action>
          <v-icon class="pl-2">mdi-weather-night</v-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>Zoom Utils</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
        </template>
        <span>Learn More</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon v-bind="attrs" v-on="on" short="true" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </template>
        <span>Menu</span>
      </v-tooltip>
    </v-app-bar>

    <v-main>
      <!-- <v-container class="fill-height" > -->
      <!-- <v-row align="center" justify="center">
          <v-col class="text-center"> -->

      <!-- <v-simple-table >
                    <thead >
                      <tr>
                        <th scope="col">Class</th>
                        <th scope="col">Meeting</th>
                        <th scope="col">Info</th>
                      </tr>
                    </thead>
                      <draggable v-model="zoomData" tag="tbody" >

                           <tr  v-for="element in zoomData" :key="element.meetingID">
                             <td >{{ element.class }}</td>

                             <td><a target="blank" :href="generateZoomLink(element)">{{ element.meetingID }}</a></td>
                             <td>{{ element.info }}</td>
                           </tr>


                     </draggable>

                    </tbody>


                  </v-simple-table> -->

      <v-expansion-panels>
        <draggable v-model="zoomData">
          <v-expansion-panel v-for="element in zoomData" :key="element.meetingID">
            <v-expansion-panel-header class="max-width">
              <v-row>
                <v-col cols="3">
                  {{ element.class }}
                </v-col>
                <v-col style="padding:0px">
                  <v-btn target="blank" :href="generateZoomLink(element)" class="mx-4" style="width:80%" color="secondary">{{ element.meetingID }}</v-btn>
                </v-col>
                <v-col cols="5">
                  {{ element.info }}
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              {{ element.info }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </draggable>
      </v-expansion-panels>

      <!-- </v-col>
        </v-row> -->
      <!-- </v-container> -->
    </v-main>
    <v-footer app>
      <span class="">&copy; {{ new Date().getFullYear() }} Amacel Web Development</span>
    </v-footer>
  </v-app>
</template>

<script>
import draggable from 'vuedraggable';
import { mapActions } from 'vuex';

export default {
  data() {
    return { drawer: null };
  },
  components: {
    draggable,
  },
  methods: {
    ...mapActions(['setZoomData'], ['setDarkMode']),
    generateZoomLink(zoomData) {
      return 'zoommtg://jonathan.zoom.us/join?action=join&amp;confno=' + zoomData.meetingID;
    },

    // sendNotification(title, message)
  },
  computed: {
    zoomData: {
      get() {
        return this.$store.state.zoomData;
      },
      set(value) {
        this.$store.dispatch('setZoomData', value);
      },
    },
    isDark: {
      get() {
        return this.$store.state.darkmode;
      },
      set(value) {
        this.$store.dispatch('setDarkMode', value);
      },
    },
  },
  created() {
    console.log(this, 'created');
  },
  watch: {
    isDark() {
      this.$vuetify.theme.dark = this.isDark;
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
.max-width {
  width: 500px !important;
}
</style>

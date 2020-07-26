<template>
  <v-app id="popup">
    <v-navigation-drawer v-model="drawer" app right>
      <v-list>
        <v-list-item @click="addDialog = true">
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
          <v-icon v-bind="attrs" v-on="on" @click="infoDialog = true">mdi-information-outline</v-icon>
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
        <draggable v-model="zoomData" v-bind="dragOptions" @start="drag = true" @end="drag = false">
          <transition-group type="transition" :name="!drag ? 'flip-list' : null">
            <v-expansion-panel v-for="element in zoomData" :key="element.key">
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
              <v-expansion-panel-content> {{ element.info }}{{ element.key }} </v-expansion-panel-content>
            </v-expansion-panel>
          </transition-group>
        </draggable>
      </v-expansion-panels>

      <!-- </v-col>
        </v-row> -->
      <!-- </v-container> -->
    </v-main>
    <v-footer app>
      <span class="">&copy; {{ new Date().getFullYear() }} Amacel Web Development</span>
    </v-footer>
    <div class="text-center">
      <v-dialog v-model="infoDialog" width="500">
        <v-card>
          <v-card-title>
            Information
          </v-card-title>
          <v-card-subtitle>
            Concerning the blah blah
          </v-card-subtitle>

          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="infoDialog = false"> Close </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="addDialog" width="500">
        <v-card>
          <v-card-title>
            Add
          </v-card-title>
          <v-card-subtitle>
            <v-btn class="ma-2"> <v-icon left>mdi-magnify</v-icon> Add from links on current Page </v-btn>
          </v-card-subtitle>

          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-text-field label="Zoom Class Name" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field label="Info" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Meeting Id" hint="9-11 digit number" type="number"></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" text @click="addDialog = false"> Add </v-btn>
            <v-btn color="primary" text @click="addDialog = false"> Cancel </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
import draggable from 'vuedraggable';

import { mapActions } from 'vuex';

export default {
  data() {
    return { drawer: null, drag: false, infoDialog: false, addDialog: false };
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
    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        ghostClass: 'ghost',
      };
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
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>

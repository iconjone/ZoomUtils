<template>
  <v-app id="popup">
    <v-navigation-drawer v-model="drawer" app right>
      <v-list>
        <v-list-item
          @click="
            addDialog = true;
            drawer = false;
          "
          :disabled="deleteMode || editMode"
        >
          <v-list-item-action>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Add</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          active
          @click="
            deleteMode = !deleteMode;
            drawer = false;
          "
          :disabled="editMode"
        >
          <v-list-item-action>
            <v-icon>mdi-delete</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          @click="
            editMode = !editMode;
            drawer = false;
          "
          :disabled="deleteMode"
        >
          <v-list-item-action>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Edit</v-list-item-title>
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
          <v-badge color="secondary" :value="modeIcon" :icon="modeIcon" offset-x="20" offset-y="20">
            <v-app-bar-nav-icon v-bind="attrs" v-on="on" short="true" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          </v-badge>
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
              <v-overlay :value="deleteMode" absolute="absolute" opacity=".5">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon @click="deleteZoomData(element)" v-bind="attrs" v-on="on">
                      <v-icon large>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete {{ element.class }}</span>
                </v-tooltip>
              </v-overlay>
              <v-overlay :value="editMode" absolute="absolute" opacity=".5">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon @click="editZoomData(element)" v-bind="attrs" v-on="on">
                      <v-icon large>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Edit {{ element.class }}</span>
                </v-tooltip>
              </v-overlay>
              <v-expansion-panel-header class="max-width">
                <v-row>
                  <v-col cols="2" class="center-list text-center">
                    {{ element.class }}
                  </v-col>
                  <v-col style="ps-4" cols="4">
                    <v-btn target="blank" :href="generateZoomLink(element)" class="mx-4" style="width:100%" color="secondary">{{ element.meetingID }}</v-btn>
                  </v-col>
                  <v-col style="pl-4" class="center-list text-center">
                    {{ element.info }}
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content> {{ element.info }}</v-expansion-panel-content>
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
                <v-text-field v-model="inputZoomName" label="Zoom Class Name" required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="inputZoomInfo" label="Info" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="inputZoomId" label="Meeting Id" hint="9-11 digit number" type="number"></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              text
              @click="
                if (!editMode) {
                  addZoomData();
                } else {
                  editZoomDataDiag();
                }
                addDialog = false;
              "
            >
              {{ editModeText }}
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="
                clearZoomDataDialog();
                addDialog = false;
              "
            >
              Cancel
            </v-btn>
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
    return {
      drawer: null,
      drag: false,
      infoDialog: false,
      addDialog: false,
      inputZoomName: null,
      inputZoomId: null,
      inputZoomInfo: null,
      deleteMode: false,
      editMode: false,
      editKey: null,
    };
  },
  components: {
    draggable,
  },
  methods: {
    ...mapActions(['setZoomData'], ['setDarkMode']),
    generateZoomLink(zoomData) {
      return 'zoommtg://jonathan.zoom.us/join?action=join&amp;confno=' + zoomData.meetingID;
    },
    clearZoomDataDialog() {
      this.inputZoomId = this.inputZoomName = this.inputZoomInfo = null;
    },
    addZoomData() {
      var currentData = this.zoomData;
      currentData.push({
        class: this.inputZoomName,
        meetingID: this.inputZoomId,
        info: this.inputZoomInfo,
        key: this.inputZoomId + this.inputZoomName + this.inputZoomInfo,
      });
      this.zoomData = currentData;
      this.inputZoomId = this.inputZoomName = this.inputZoomInfo = null;
    },
    deleteZoomData(zoomData) {
      var key = zoomData.key;
      var currentData = this.zoomData;
      this.zoomData = currentData.filter(data => data.key != key);
    },
    editZoomData(zoomData) {
      this.editKey = zoomData.key;
      this.inputZoomName = zoomData.class;
      this.inputZoomId = zoomData.meetingID;
      this.inputZoomInfo = zoomData.info;
      this.addDialog = true;
    },
    editZoomDataDiag() {
      var vueApp = this;
      var currentData = this.zoomData;
      currentData.forEach(data => {
        if (vueApp.editKey == data.key) {
          data.class = vueApp.inputZoomName;
          data.info = vueApp.inputZoomInfo;
          data.meetingID = vueApp.inputZoomId;
          data.key = vueApp.inputZoomId + vueApp.inputZoomName + vueApp.inputZoomInfo;
        }
      });
      this.zoomData = currentData;
    },
    parseLinks(link) {
      var link;

      console.log(link);
      // print() = console.log()

      return false;
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
    modeIcon() {
      if (this.deleteMode) return 'mdi-delete';
      if (this.editMode) return 'mdi-pencil';
      return 0;
    },
    editModeText() {
      if (this.editMode) return 'SAVE';
      return 'ADD';
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
  width: 600px !important;
}
.center-list {
  margin-top: auto;
  margin-bottom: auto;
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

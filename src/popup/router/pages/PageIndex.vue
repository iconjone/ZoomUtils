<template>
  <v-app id="popup">
    <v-navigation-drawer v-model="drawer" app right width="true">
      <v-layout column fill-height>
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
              if (deleteMode) drawer = true;
              else drawer = false;
              deleteMode = !deleteMode;
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
              if (editMode) drawer = true;
              else drawer = false;
              editMode = !editMode;
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
        </v-list>

        <v-spacer></v-spacer>
        <v-divider></v-divider>
        <v-list>
          <v-list-item @click="openSettings()">
            <v-list-item-action>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-icon>mdi-weather-sunny</v-icon>
            <v-list-item-action>
              <v-switch v-model="isDark" inset color="primary"></v-switch>
            </v-list-item-action>
            <v-icon class="pl-2">mdi-weather-night</v-icon>
          </v-list-item>
        </v-list>
      </v-layout>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>Zoom Utils</v-toolbar-title>
      <v-btn v-if="zoomLinkFound" class="ma-2" @click="parseLinks()" color="secondary"> <v-icon left>mdi-plus</v-icon> Add ZOOM Link from Page </v-btn>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" @click="infoDialog = true">mdi-information-outline</v-icon>
        </template>
        <span>Learn More</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-badge color="secondary" :value="modeIcon" :icon="modeIcon + ''" offset-x="20" offset-y="20">
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
                  <v-col class="ps-4" cols="4">
                    <v-btn target="blank" :href="generateZoomLink(element)" class="mx-4" style="width:100%; " color="primary">{{ element.meetingID }}</v-btn>
                  </v-col>
                  <v-col class=" pl-4 center-list text-center">
                    {{ element.info }}
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col class="center-list text-center">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon @click="editZoomData(element)" v-bind="attrs" v-on="on">
                          <v-icon>mdi-calendar</v-icon>
                        </v-btn>
                      </template>
                      <span>Schedule {{ element.class }}</span>
                    </v-tooltip>
                  </v-col>
                  <v-col>
                    <v-switch label="Notifications" v-model="element.notification" v-on:click.stop="handleNotificationToggle(element)"></v-switch>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
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
            SOmething about clicking "Always allow chrome extension to open links of thiws type in the assocauted app"
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
            text
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
            <v-btn color="success" text @click="handleAddEdit()">
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
      <v-snackbar v-model="alert" :multi-line="true">
        {{ alertText }}

        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="alert = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
import draggable from 'vuedraggable';

import { mapActions } from 'vuex';
global.browser = require('webextension-polyfill');

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
      zoomLinkFound: false,
      alert: false,
      alertText: 'No Message',
    };
  },
  components: {
    draggable,
  },

  methods: {
    ...mapActions(['setZoomData'], ['setDarkMode']),
    generateZoomLink(zoomData) {
      /// / TODO: make this neater and smarter
      if (zoomData.password != '' && zoomData.password != undefined) {
        return 'zoommtg://jonathan.zoom.us/join?action=join&confno=' + zoomData.meetingID + '&pwd=' + zoomData.password;
      }
      return 'zoommtg://jonathan.zoom.us/join?action=join&confno=' + zoomData.meetingID;
    },
    customAlert(msg) {
      this.alertText = msg;
      this.alert = true;
    },
    clearZoomDataDialog() {
      this.inputZoomId = this.inputZoomName = this.inputZoomInfo = null;
    },
    addZoomData() {
      var currentData = this.zoomData;
      var newString = '';
      currentData.forEach(data => {
        if (data.key == this.inputZoomId + this.inputZoomName + this.inputZoomInfo) {
          newString += 'keyAdd';
        }
      });

      currentData.push({
        class: this.inputZoomName,
        meetingID: this.inputZoomId,
        info: this.inputZoomInfo,
        key: this.inputZoomId + this.inputZoomName + this.inputZoomInfo + newString,
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
    handleAddEdit() {
      if (this.validateData()) {
        if (!this.editMode) {
          this.addZoomData();
        } else {
          this.editZoomDataDiag();
        }
        this.addDialog = false;
        this.clearZoomDataDialog();
      } else {
        this.customAlert('something went wrong');
      }
    },
    validateData() {
      var meetingIdStr = this.inputZoomId + '';
      if (meetingIdStr.length >= 9 && !isNaN(meetingIdStr)) {
        return true;
      }

      return false;
    },
    openSettings() {
      browser.runtime.openOptionsPage();
    },
    getLinks() {
      browser.tabs.executeScript(null, { code: 'Array.from(document.links).map(links => links.href)' }).then(results => {
        console.log(results[0]);
        return results[0];
      });
    },
    parseLinks(link) {
      // https://stackoverflow.com/questions/11684454/getting-the-source-html-of-the-current-page-from-chrome-extension
      browser.tabs.executeScript(null, { code: 'Array.from(document.links).map(links => links.href)' }).then(results => {
        var links = results[0];
        var linksFound = [];
        links.forEach((link, i) => {
          if (link.includes('zoom')) {
            // do some magic to determine if is zoom link
            if (link.search('/[a-z]/\\d\\d\\d\\d\\d\\d\\d\\d\\d+') != -1) {
              linksFound.push(link);
            }
          }
        });
        if (linksFound.length > 0) {
          var link = linksFound[0];
          this.inputZoomId = link.match('\\d\\d\\d\\d\\d\\d\\d\\d\\d+')[0];
          this.addDialog = true;
        } else {
          customAlert('Could not find any Zoom Links :(');
        }
      });
    },
    handleNotificationToggle(element) {
      element.notification = !element.notification;
      var vueApp = this;
      var currentData = this.zoomData;
      currentData.forEach(data => {
        if (element.key == data.key) {
          data.notification = element.notification;
        }
      });
      this.zoomData = currentData;
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

    browser.tabs.executeScript(null, { code: 'Array.from(document.links).map(links => links.href)' }).then(results => {
      results[0].forEach((item, i) => {
        if (item.includes('zoom')) {
          // do some magic to determine if is zoom link
          if (item.search('/[a-z]/\\d\\d\\d\\d\\d\\d\\d\\d\\d+') != -1) {
            console.log('found');
            this.zoomLinkFound = true;
          }
        }
      });
      // return results[0];
    });
  },
  watch: {
    isDark() {
      this.$vuetify.theme.dark = this.isDark;
    },
    zoomData() {
      console.log('detected change');
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

::-webkit-scrollbar {
  width: 15px;
}

::-webkit-scrollbar-track {
  background: #202020;
  border-left: 1px solid #2c2c2c;
}

::-webkit-scrollbar-thumb {
  background: #3e3e3e;
  border: solid 3px #202020;
  border-radius: 7px;
}

::-webkit-scrollbar-thumb:hover {
  background: white;
}
</style>

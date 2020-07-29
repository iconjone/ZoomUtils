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
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn target="blank" :href="generateZoomLink(element)" class="mx-4" style="width:100%; " color="primary" v-bind="attrs" v-on="on"
                          >{{ formatMeetingID(element.meetingID) }}
                        </v-btn>
                      </template>
                      <span>Join Now</span>
                    </v-tooltip>
                  </v-col>
                  <v-col class=" pl-4 center-list text-center">
                    {{ element.info }}
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col class="center-list text-center">
                    {{ scheduleTextArrayBuilder(element.scheduleData) }}
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon @click="handleScheduleClick(element)" v-bind="attrs" v-on="on">
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
            <v-btn text @click="infoDialog = false"> Close </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="settingsDialog" persistent width="500">
        <v-card>
          <v-card-title>
            Settings
          </v-card-title>
          <v-card-subtitle>
            Explainging some of the settings we have
          </v-card-subtitle>

          <!-- <v-card-text>

          </v-card-text> -->
          <v-container fluid>
            <v-combobox
              color="white"
              :deletable-chips="true"
              v-model="reminder"
              :items="reminderItems"
              label="Input Reminder Intervals in Minutes (Leave Empty for no Reminders)"
              multiple
              :clearable="true"
              chips
            ></v-combobox>
            <v-switch v-model="autoJoin" label="Auto Join Zoom Meetings"></v-switch>
          </v-container>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              text
              @click="
                reminder = [15];
                autoJoin = false;
              "
              color="error"
            >
              Reset
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn text @click="settingsDialog = false"> Close </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="addDialog" persistent width="500">
        <v-card>
          <v-card-title>
            {{ editModeText }} Zoom Meeting <v-spacer> </v-spacer>Password
            <v-checkbox v-model="showPasswordCheckBox"></v-checkbox>
          </v-card-title>
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
              <v-col v-if="showPasswordCheckBox" cols="12">
                <v-text-field
                  v-model="inputZoomPassword"
                  label="Meeting Password"
                  hint="Meeting Password"
                  :append-icon="showMeetingPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showMeetingPassword ? 'text' : 'password'"
                  counter
                  @click:append="showMeetingPassword = !showMeetingPassword"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" text @click="handleAddEdit()">
              {{ saveModeText }}
            </v-btn>
            <v-btn
              color="error"
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
      <v-dialog v-model="scheduleDialog" width="500" persistent>
        <v-card>
          <v-card-title>
            Schedule
            <v-spacer> </v-spacer>
            <v-btn @click="addEmptySchedule()">Add Meeting Time</v-btn>
          </v-card-title>

          <v-data-iterator :items="scheduleData" disable-pagination hide-default-footer no-data-text="No Meeting Times Set">
            <template v-slot:default="props">
              <v-container>
                <v-row>
                  <v-col v-for="(item, index) in props.items" :key="item.key" cols="12">
                    <v-row>
                      <v-col v-for="(day, dayIndex) in item.days" :key="dayIndex" style="padding: 4px;">
                        <v-checkbox :off-icon="daysIcons[dayIndex] + '-outline'" :on-icon="daysIcons[dayIndex]" v-model="item.days[dayIndex]" color="secondary"> </v-checkbox>
                      </v-col>
                      <v-divider vertical></v-divider>
                      <v-col style="padding: 4px;">
                        <v-dialog ref="itemdialog" v-model="item.timeDialog" :return-value.sync="item.time" persistent>
                          <template v-slot:activator="{ on, attrs }">
                            <!-- <v-text-field v-model="item.time" label="Picker in dialog" prepend-icon="access_time" readonly v-bind="attrs" v-on="on"></v-text-field> -->
                            <v-btn icon v-bind="attrs" v-on="on" style=" margin-top: 16px; ">
                              <v-icon>access_time</v-icon>
                            </v-btn>
                          </template>
                          <v-time-picker v-if="item.timeDialog" v-model="item.time" full-width :ampm-in-title="true" :landscape="true">
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="success"
                              @click="
                                handleTimeClick(index, item.time);
                                handleScheduleSave();
                                item.timeDialog = false;
                              "
                              >Save</v-btn
                            >
                            <v-btn text color="error" @click="item.timeDialog = false">Cancel</v-btn>

                            <!-- $refs.itemdialog.save(item.time) -->
                          </v-time-picker>
                        </v-dialog>
                      </v-col>
                      <v-col style="padding: 4px;">
                        <v-btn icon style=" margin-top: 16px;" @click="handleScheduleDelete(item)">
                          <v-icon color="secondary">mdi-close</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="12"> {{ scheduleText(item.days, item.time) }} </v-col>

                      <!-- <v-checkbox v-for"day in item.days" checkboxOn="mdi-delete" checkboxOff="mdi-pencil" checkboxIndeterminate="mdi-fire" label="Do this?" v-model="day">
              </v-checkbox> -->
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-data-iterator>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="
                handleScheduleSave();
                scheduleDialog = false;
              "
            >
              Save
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
      scheduleDialog: false,
      settingsDialog: false,
      inputZoomName: null,
      inputZoomId: null,
      inputZoomInfo: null,
      inputZoomPassword: null,
      deleteMode: false,
      editMode: false,
      editKey: null,
      zoomLinkFound: false,
      alert: false,
      alertText: 'No Message',
      showPasswordCheckBox: false,
      showMeetingPassword: false,
      daysIcons: ['mdi-alpha-s-circle', 'mdi-alpha-m-circle', 'mdi-alpha-t-circle', 'mdi-alpha-w-circle', 'mdi-alpha-t-circle', 'mdi-alpha-f-circle', 'mdi-alpha-s-circle'],
      daysText: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      daysLetter: ['S', 'M', 'T', 'W', 'Th', 'F', 'S'],
      timeDialog: false,
      time: null,
      reminderItems: [5, 10, 15, 30, 45, 60],
    };
  },
  components: {
    draggable,
  },

  methods: {
    ...mapActions(['setZoomData'], ['setDarkMode'], ['setScheduleData'], ['setReminder'], ['setAutoJoin']),
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
      this.inputZoomId = this.inputZoomName = this.inputZoomInfo = this.inputZoomPassword = null;
      this.showPasswordCheckBox = false;
    },
    addZoomData() {
      var currentData = this.zoomData;
      var newString = '';
      currentData.forEach(data => {
        if (data.key == this.inputZoomId + this.inputZoomName + this.inputZoomInfo) {
          newString += 'keyAdd';
        }
      });
      if (!this.showPasswordCheckBox) {
        this.inputZoomPassword = null;
      }

      currentData.push({
        class: this.inputZoomName,
        meetingID: this.inputZoomId,
        info: this.inputZoomInfo,
        key: this.inputZoomId + this.inputZoomName + this.inputZoomInfo + newString,
        password: this.inputZoomPassword,
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
      this.inputZoomPassword = zoomData.password;
      if (zoomData.password != '' && zoomData.password != undefined) {
        this.showPasswordCheckBox = true;
      } else {
        this.showPasswordCheckBox = false;
      }
      this.addDialog = true;
    },
    editZoomDataDiag() {
      var vueApp = this;
      var currentData = this.zoomData;
      if (!this.showPasswordCheckBox) {
        this.inputZoomPassword = null;
      }
      currentData.forEach(data => {
        if (vueApp.editKey == data.key) {
          data.class = vueApp.inputZoomName;
          data.info = vueApp.inputZoomInfo;
          data.meetingID = vueApp.inputZoomId;
          data.key = vueApp.inputZoomId + vueApp.inputZoomName + vueApp.inputZoomInfo;
          data.password = vueApp.inputZoomPassword;
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
        this.customAlert('Something went wrong. Check the Meeting ID');
      }
    },
    handleScheduleClick(element) {
      this.editKey = element.key;
      this.scheduleDialog = true;
      // this.$store.dispatch('setScheduleData', [
      //   { days: [false, true, false, true, false, false, false], time: '13:29', key: 'MW-8:00 AM' },
      //   { days: [true, true, true, true, false, false, false], time: '8:00', key: 'MW-8:00 PM' },
      // ]);
      this.$store.dispatch('setScheduleData', element.scheduleData);
      // this.scheduleData = element.scheduleData
      //  this.scheduleData = ;
    },
    handleScheduleSave() {
      var vueApp = this;

      var currentScheduleData = this.scheduleData;

      currentScheduleData.forEach((item, i) => {
        currentScheduleData[i].key = vueApp.generateScheduleKey(item.days, item.time);
      });

      // this.$store.dispatch('setScheduleData', currentScheduleData);

      var currentData = this.zoomData;

      currentData.forEach(data => {
        if (vueApp.editKey == data.key) {
          data.scheduleData = currentScheduleData;
        }
      });
      this.zoomData = currentData;
      // save data into zoomdata and dispatch
      // trigger background to update and create alarms/notification fun
    },
    handleScheduleDelete(item) {
      this.handleScheduleSave();
      var currentScheduleData = [];
      this.scheduleData.forEach((data, i) => {
        if (data.key != item.key) currentScheduleData.push(data);
      });
      this.$store.dispatch('setScheduleData', currentScheduleData);
    },
    addEmptySchedule() {
      var currentScheduleData = this.scheduleData;
      if (currentScheduleData != undefined) {
        currentScheduleData.push({ days: [false, false, false, false, false, false, false], time: '8:00', key: 'None-8:00 AM' });
      } else {
        currentScheduleData = [{ days: [false, false, false, false, false, false, false], time: '8:00', key: 'None-8:00 AM' }];
      }
      this.$store.dispatch('setScheduleData', currentScheduleData);
    },
    handleTimeClick(index, time) {
      var copy = this.scheduleData;
      copy[index].time = time;
      copy[index].timeDialog = false;
      this.$store.dispatch('setScheduleData', copy);
    },
    scheduleText(days, time) {
      var daysText = '';
      days.forEach((item, i) => {
        if (item) daysText += this.daysLetter[i];
      });
      var mer = 'AM';
      var timeSplit = time.split(':');

      if (timeSplit[0] > 12) {
        mer = 'PM';
        timeSplit[0] -= 12;
      }
      if (daysText == '') daysText = 'None';
      if (timeSplit[0] == '00') timeSplit[0] = '12';

      return daysText + ' - ' + timeSplit[0] + ':' + timeSplit[1] + ' ' + mer;
    },
    scheduleTextArrayBuilder(arr) {
      if (arr == undefined || arr.length == 0) return '';
      arr = arr.map(element => {
        return this.scheduleText(element.days, element.time);
      });
      return arr.join(', ');
    },
    generateScheduleKey(days, time) {
      var daysText = '';
      days.forEach((item, i) => {
        if (item) daysText += this.daysText[i];
      });
      var mer = 'AM';
      var timeSplit = time.split(':');

      if (timeSplit[0] > 12) {
        mer = 'PM';
        timeSplit[0] -= 12;
      }
      if (daysText == '') daysText = 'None';

      return daysText + ' - ' + timeSplit[0] + ':' + timeSplit[1] + ' ' + mer;
    },
    validateData() {
      var meetingIdStr = this.inputZoomId + '';
      if (meetingIdStr.length >= 9 && !isNaN(meetingIdStr)) {
        return true;
      }

      return false;
    },
    formatMeetingID(id) {
      console.log(id);
      console.log(id.length, id.length % 3, 'info about num');
      // var id
      // id.length gives you the lenght of it
      // id.substring(i,j) returns the string at that index
      // rewrite this into a recursive function
      var ret = '';

      var amountOf4s = id.length % 3;
      var amountOf4Char = amountOf4s * 4;
      console.log(amountOf4s, amountOf4Char);
      for (var i = 0; i < id.length - amountOf4Char; i++) {
        ret += id[i];
        if ((i + 1) % 3 == 0 && i != 0) {
          ret += ' ';
        }
      }

      var count = 0;
      for (var i; i < id.length; i++) {
        count++;
        ret += id[i];
        if (count % 4 == 0 && i != 0) {
          ret += ' ';
        }
      }

      return ret; // spaced out version out version of the id
    },
    openSettings() {
      //  browser.runtime.openOptionsPage();
      this.drawer = false;
      this.settingsDialog = true;
    },
    updateNotifications() {
      browser.runtime.sendMessage({
        greeting: 'createNotificationHandler',
      });
    },
    getLinks() {
      browser.tabs.executeScript(null, { code: 'Array.from(document.links).map(links => links.href)' }).then(results => {
        return results[0];
      });
    },
    parseLinks(link) {
      // https://stackoverflow.com/questions/11684454/getting-the-source-html-of-the-current-page-from-chrome-extension
      browser.tabs.executeScript(null, { code: 'Array.from(document.links).map(links => links.href)' }).then(results => {
        var links = results[0];
        var linksFound = [];
        links.forEach((link, i) => {
          if (link.includes('zoom.us/j/') || link.includes('zoom.us/w/') || link.includes('zoom.us/wc/')) {
            // .us suffix + valid filler should guarantee it's a zoomie
            // do some magic to determine if is zoom link
            if (link.search('[0-9]{9,}') != -1) {
              // passing the extraction test means there is an ID to be extracted
              linksFound.push(link);
            }
          }
        });
        if (linksFound.length > 0) {
          var link = linksFound[0];
          this.inputZoomId = link.match('[0-9]{9,}')[0];
          this.inputZoomPassword = new URL(link).searchParams.get('pwd');
          if (this.inputZoomPassword != null) {
            this.showPasswordCheckBox = true;
          }
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
        this.updateNotifications();
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
    reminder: {
      get() {
        return this.$store.state.reminder;
      },
      set(value) {
        this.$store.dispatch('setReminder', value);
      },
    },
    autoJoin: {
      get() {
        return this.$store.state.autoJoin;
      },
      set(value) {
        this.$store.dispatch('setAutoJoin', value);
      },
    },
    scheduleData() {
      return this.$store.state.scheduleData;
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
      if (this.editMode) return 'Edit';
      return 'Add';
    },
    saveModeText() {
      if (this.editMode) return 'Save';
      return 'Add';
    },
  },
  created() {
    console.log(this, 'created');

    browser.tabs.executeScript(null, { code: 'Array.from(document.links).map(links => links.href)' }).then(results => {
      results[0].forEach((item, i) => {
        if (item.includes('zoom.us/j/') || item.includes('zoom.us/w/') || item.includes('zoom.us/wc/')) {
          // .us suffix + valid filler should guarantee it's a zoomie
          // do some magic to determine if is zoom link
          if (item.search('[0-9]{9,}') != -1) {
            // passing the extraction test means there is an ID to be extracted
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
</style>

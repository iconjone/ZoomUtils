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
          <v-icon v-bind="attrs" v-on="on" @click="supportDialog = true" class="mr-2">mdi-gift-outline</v-icon>
        </template>
        <span>Support Us</span>
      </v-tooltip>
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
                        <v-btn
                          target="blank"
                          :href="generateLink(element)"
                          class="mx-4"
                          style="width:100%; "
                          color="primary"
                          v-bind="attrs"
                          v-on="on"
                          @click="meetingLaunched(element)"
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
                  <v-col cols="2" class="center-list text-center">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon @click="handleCopyClipBoardClick(element)" v-bind="attrs" v-on="on">
                          <v-icon>mdi-clipboard-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Copy {{ element.class }} Meeting Link to Clipboard</span>
                    </v-tooltip>
                  </v-col>
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
                  <v-col>
                    <v-switch label="Auto-Join" v-model="element.autoJoin" v-on:click.stop="handleAutoJoinToggle(element)"></v-switch>
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

          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Let's get started:</v-list-item-title>
                <div class="body-2">
                  The app may be loaded with default meetings. To get rid of them, open the menu, select the <v-icon color="secondary" small>mdi-delete</v-icon> icon, and select
                  the <v-icon color="secondary" small>mdi-delete</v-icon> overlayed over the meetings. Be sure to toggle <v-icon color="secondary" small>mdi-delete</v-icon> again,
                  to get out of delete mode.
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Adding a meeting:</v-list-item-title>
                <div class="body-2">
                  To add a meeting you can navigate to any page that contains a Zoom Meeting Link and open the extension. You can then click
                  <v-btn class="ma-2" color="secondary" small> <v-icon left>mdi-plus</v-icon> Add ZOOM Link from Page </v-btn> from the navbar and it will open a dialog to enter in
                  a Class Name and Info. The Meeting Id (and password if applicable) will be filled out already.<br />
                  To manually add a Zoom Meeting, open the menu, select the <v-icon color="secondary" small>mdi-plus</v-icon> icon, and fill out the dialog. To enter in a Password,
                  check the Password checkbox on the top right.
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Editing a meeting:</v-list-item-title>
                <div class="body-2">
                  To edit a Zoom Meeting, open the menu, select the <v-icon color="secondary" small>mdi-pencil</v-icon> icon, and select the
                  <v-icon color="secondary" small>mdi-pencil</v-icon> overlayed over the meeting you'd like to edit. Change the information in the dialog that appears. To enter in
                  a Password, check the Password checkbox on the top right.
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Deleting a meeting:</v-list-item-title>
                <div class="body-2">
                  To delete a Zoom Meeting, open the menu, select the <v-icon color="secondary" small>mdi-delete</v-icon> icon, and select the
                  <v-icon color="secondary" small>mdi-delete</v-icon> overlayed over the meeting you'd like to delete.
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Organizing Meetings:</v-list-item-title>
                <div class="body-2">
                  Drag and drop Meeting Rows in the position you'd like.
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Joining Meetings:</v-list-item-title>
                <div class="body-2">
                  Click on the blue Meeting Id to easily join your meeting.
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Setting Notifications:</v-list-item-title>
                <div class="body-2">
                  To add meeting times, expand the meeting options by clicking on the meeting row. Select the <v-icon color="secondary" small>mdi-calendar</v-icon> icon to open the
                  meeting times dialog. Add or Edit the meeting schedule by selecting the days that the Zoom Meeting meets on as well as clicking the the
                  <v-icon color="secondary" small>mdi-access_time</v-icon> icon to set the meeting time. To delete a meeting time, select the
                  <v-icon color="secondary" small>mdi-close</v-icon> icon.<br />
                  To set notifications on for a class, expand the meeting options, and switch the Notifications Switch to the on position.
                  <br />
                  To set Auto Join on (Which will automatically open Zoom Meetings at the inputted time) switch the Auto-Join Switch to the on position.
                  <br />
                  To adjust the reminders interval, open the menu and select the <v-icon color="secondary" small>mdi-cog</v-icon> icon and adjust the parameters in the dialog that
                  pops up.
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-card-subtitle
            >Hints: <br />
            Pin this extension for easy access to your classes! <br />
            Click the checkbox when launching a meeting to allow this extension to always be able to open Zoom<br />
            Open Zoom Meetings via web-client by opening settings and switching the toggles<br />
            Set Dark or Light mode, by opening the Menu and switching the toggles.<br />
            To find your meeting ID manually navigate to your link in your browser, and observe the link generated. After 'zoom.us/j or w or s/' you should see a 9 to 11 digit id
            which is your Meeting ID!</v-card-subtitle
          >
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

          <!-- <v-card-text>

          </v-card-text> -->
          <v-container fluid>
            <v-combobox
              color="white"
              type="number"
              :deletable-chips="true"
              no-data-text="No Reminders"
              v-model="reminder"
              :items="reminderItems"
              label="Meeting Reminder in Minutes with Notifications. Type for custom intervals."
              multiple
              :clearable="true"
              chips
              hide-selected
              :rules="reminderRules"
            ></v-combobox>
            <!-- <v-switch v-model="autoJoin" label="Auto Join Zoom Meetings"></v-switch> -->

            <v-switch v-model="webClient" label="Join by web-client for Zoom Meetings"></v-switch>
          </v-container>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn
              text
              @click="
                reminder = [15];
                webClient = false;
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
                              >SET</v-btn
                            >
                            <v-btn text color="error" @click="item.timeDialog = false">Cancel</v-btn>

                            <!-- $refs.itemdialog.save(item.time) -->
                          </v-time-picker>
                        </v-dialog>
                      </v-col>
                      <v-col style="padding: 4px;">
                        <v-btn icon style=" margin-top: 16px;" @click="handleScheduleDelete(item, index)">
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

      <v-dialog v-model="supportDialog" width="500">
        <v-dialog v-model="venmoDialog" width="300">
          <v-card>
            <v-card-text>
              <v-img :contain="true" src="../../../icons/venmo.png"></v-img>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="venmoDialog = false"> Close </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card>
          <v-card-title>
            Support Us
          </v-card-title>
          <v-card-text>
            We're a bunch of (hungry) college students who want to help other students get to class.<br />
            Please consider supporting our team with a donation.
          </v-card-text>
          <v-card-text class="text-center">
            <v-row>
              <v-col cols="12"><v-btn color="primary" @click="venmoDialog = true">Venmo | @jonotsamuel</v-btn> </v-col>
              <v-col cols="12">
                <v-btn color="primary" href="https://www.paypal.com/paypalme/jonotsamuel/5" target="_blank">Paypal | jonotsamuel</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="supportDialog = false"> Close </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="alert" :multi-line="true" timeout="7500">
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
      supportDialog: false,
      venmoDialog: false,
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
      reminderItems: [5, 10, 15, 30, 60],
      reminderRules: [
        function(arr) {
          if (arr.length <= 0) return true;
          arr.forEach((val, i) => {
            if (val <= 0) {
              arr[i] = arr[i] * -1;
            }
          });
        },
      ],
    };
  },
  components: {
    draggable,
  },

  methods: {
    ...mapActions(['setZoomData'], ['setDarkMode'], ['setScheduleData'], ['setReminder'], ['setAutoJoin'], ['setWebClient']),
    generateLink(zoomData) {
      /// / TODO: make this neater and smarter
      if (this.webClient) {
        if (zoomData.password != '' && zoomData.password != undefined) {
          return 'https://zoom.us/wc/' + zoomData.meetingID + '/join' + '?pwd=' + zoomData.password;
        }
        return 'https://zoom.us/wc/' + zoomData.meetingID + '/join';
      } else {
        if (zoomData.password != '' && zoomData.password != undefined) {
          return 'zoommtg://jonathan.zoom.us/join?action=join&confno=' + zoomData.meetingID + '&pwd=' + zoomData.password;
        }
        return 'zoommtg://jonathan.zoom.us/join?action=join&confno=' + zoomData.meetingID;
      }
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
    handleCopyClipBoardClick(element) {
      var link = 'https://zoom.us/j/' + element.meetingID;
      if (element.password != '' && element.password != undefined) {
        link += '?pwd=' + element.password;
      }
      navigator.clipboard
        .writeText(link)
        .then(() => {
          this.customAlert('Link copied to clipboard');
        })
        .catch(err => {
          this.customAlert('Link unable to be copied to clipboard');
        });
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
      if (currentScheduleData != undefined && currentScheduleData.length > 0) {
        currentScheduleData.forEach((item, i) => {
          currentScheduleData[i].key = vueApp.generateScheduleKey(item.days, item.time);
        });
      }

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
    handleScheduleDelete(item, index) {
      var currentScheduleData = this.scheduleData;
      console.log(item, index);
      currentScheduleData.splice(index, 1);
      console.log(currentScheduleData);
      // this.scheduleData.forEach((data, i) => {
      //   if (data.key != item.key) currentScheduleData.push(data);
      // });
      this.$store.dispatch('setScheduleData', currentScheduleData);
      this.handleScheduleSave();
    },
    addEmptySchedule() {
      var currentScheduleData = this.scheduleData;
      if (currentScheduleData != undefined) {
        currentScheduleData.push({ days: [false, false, false, false, false, false, false], time: '8:00', key: 'None-8:00 AM' });
      } else {
        currentScheduleData = [{ days: [false, false, false, false, false, false, false], time: '8:00', key: 'None-8:00 AM' }];
      }
      this.$store.dispatch('setScheduleData', currentScheduleData);
      //  this.$vuetify.goTo(10000);
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

      if (timeSplit[0] >= 12) {
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
      var ret = '';

      var amountOf4s = id.length % 3;
      var amountOf4Char = amountOf4s * 4;
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
    meetingLaunched(data) {
      var send = JSON.parse(JSON.stringify(data));
      try {
        // remove private info like meetingId and password
        send.meetingID = '*****';
        send.password = '*****';
        send.key = '*****';
        _gaq.push(['_trackEvent', 'meetingLaunch', JSON.stringify(send)]);
      } catch (e) {}
    },
    getLinks() {
      browser.tabs
        .executeScript(null, { code: 'Array.from(document.links).map(links => links.href)' })
        .then(results => {
          return results[0];
        })
        .catch(e => {
          console.log(e);
        });
    },
    parseLinks(link) {
      // https://stackoverflow.com/questions/11684454/getting-the-source-html-of-the-current-page-from-chrome-extension
      browser.tabs
        .executeScript(null, { code: 'Array.from(document.links).map(links => links.href)' })
        .then(results => {
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
            if (linksFound.length > 1) {
              // and there are links in there that are different meeting ids

              if (!linksFound.every((val, i, arr) => val === arr[0]))
                this.customAlert(
                  "Look's like the page has more than 1 Zoom link. If it is the incorrect meeting ID, try clicking the link you'd like to add and add it on the newly opened page."
                );
            }
            var link = linksFound[0];
            var checkResult = this.sameLinkInZoomData(link);
            console.log(checkResult);

            this.inputZoomId = link.match('[0-9]{9,}')[0];
            this.inputZoomPassword = new URL(link).searchParams.get('pwd');

            if (!checkResult.result) {
              if (this.inputZoomPassword != null) {
                this.showPasswordCheckBox = true;
              }
              this.addDialog = true;
            } else if (checkResult.result) {
              this.editMode = true;
              checkResult.item.password = this.inputZoomPassword;
              this.editZoomData(checkResult.item);
              if (checkResult.action == 'edit') this.customAlert(checkResult.item.class + ' already exists. Editing ' + checkResult.item.class);
              else this.customAlert(' New password applied to ' + checkResult.item.class + '! Save to edit ' + checkResult.item.class);
            }
          } else {
            customAlert('Could not find any Zoom Links :(');
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    handleNotificationToggle(element) {
      element.notification = !element.notification;
      var vueApp = this;
      var currentData = this.zoomData;
      currentData.forEach(data => {
        if (element.key == data.key) {
          data.notification = element.notification;
          if (!element.notification) {
            element.autoJoin = false;
            data.autoJoin = false;
          }
        }
      });
      this.zoomData = currentData;
    },
    handleAutoJoinToggle(element) {
      element.autoJoin = !element.autoJoin;
      var vueApp = this;
      var currentData = this.zoomData;
      currentData.forEach(data => {
        if (element.key == data.key) {
          data.autoJoin = element.autoJoin;
          if (element.autoJoin) {
            element.notification = true;
            data.notification = true;
          }
        }
      });
      this.zoomData = currentData;
    },
    sameLinkInZoomData(link) {
      var ret = { result: false, name: '', action: 'new' };
      var passwordCheck = new URL(link).searchParams.get('pwd');
      this.zoomData.forEach(item => {
        console.log(item.meetingID, link.match('[0-9]{9,}')[0], item.meetingID == link.match('[0-9]{9,}')[0]);
        if (item.meetingID == link.match('[0-9]{9,}')[0]) {
          // Meeting Id has matched
          console.log('meeting id has matched');
          if (item.password == passwordCheck) {
            ret = { result: true, item: item, action: 'edit' };
            return false;
          } else {
            ret = { result: true, item: item, action: 'editPassword' };
            return false;
          }
        }
      });

      return ret;
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
    webClient: {
      get() {
        return this.$store.state.webclient;
      },
      set(value) {
        this.$store.dispatch('setWebClient', value);
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

    browser.tabs
      .executeScript(null, { code: 'Array.from(document.links).map(links => links.href)' })
      .then(results => {
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
      })
      .catch(e => {
        console.log(e);
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

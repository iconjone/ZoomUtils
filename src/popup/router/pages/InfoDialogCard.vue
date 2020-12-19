<template
  ><v-dialog v-model="dialog" width="500"
    ><v-card>
      <v-card-title>
        Information
      </v-card-title>

      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">Let's get started:</v-list-item-title>
            <div class="body-2">
              The app may be loaded with default meetings. To get rid of them, open the menu, select the <v-icon color="secondary" small>mdi-delete</v-icon> icon, and select the
              <v-icon color="secondary" small>mdi-delete</v-icon> overlayed over the meetings. Be sure to toggle <v-icon color="secondary" small>mdi-delete</v-icon> again, to get
              out of delete mode.
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">Adding a meeting:</v-list-item-title>
            <div class="body-2">
              Option 1: To add a meeting you can navigate to any page that contains a Zoom Meeting Link (such as your email) and open the extension. You can then click
              <v-btn class="ma-2" color="secondary" small> <v-icon left>mdi-plus</v-icon> Add ZOOM Link from Page </v-btn> from the top of the extension page and it will open a
              dialog to enter in your Class Name and Info. The Meeting Id (and password if applicable) will be filled out automatically.<br />
              Option 2: To manually add a Zoom Meeting, open the menu, select the <v-icon color="secondary" small>mdi-plus</v-icon> icon, and fill out the dialog. To enter in a
              Password, check the Password checkbox on the top right.
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">Editing a meeting:</v-list-item-title>
            <div class="body-2">
              To edit a Zoom Meeting, open the menu, select the <v-icon color="secondary" small>mdi-pencil</v-icon> icon, and select the
              <v-icon color="secondary" small>mdi-pencil</v-icon> overlayed over the meeting you'd like to edit. Change the information in the dialog that appears. To enter in a
              Password, check the Password checkbox on the top right.
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">Deleting a meeting:</v-list-item-title>
            <div class="body-2">
              To delete a Zoom Meeting, open the menu, select the <v-icon color="secondary" small>mdi-delete</v-icon> icon, and select the
              <v-icon color="secondary" small>mdi-delete</v-icon> overlayed over the meeting you'd like to delete.
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">Organizing Meetings:</v-list-item-title>
            <div class="body-2">
              Drag and drop Meeting Rows in the position you'd like.
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">Joining Meetings:</v-list-item-title>
            <div class="body-2">
              Click on the blue Meeting Id to easily join your meeting.
            </div>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">Setting Notifications:</v-list-item-title>
            <div class="body-2">
              To add meeting times, expand the meeting options by clicking on the meeting row. Select the <v-icon color="secondary" small>mdi-calendar</v-icon> icon to open the
              meeting times dialog. Add or Edit the meeting schedule by selecting the days that the Zoom Meeting meets on as well as clicking the
              <v-icon color="secondary" small>access_time</v-icon> icon to set the meeting time. To delete a meeting time, select the
              <v-icon color="secondary" small>mdi-close</v-icon> icon.<br />
              To enable notifications for a class, expand the meeting options, and switch the Notifications Switch to the on position.
              <br />
              To enable Auto Join (Which will automatically open Zoom Meetings at the inputted time) switch the Auto-Join Switch to the on position.
              <br />
              To adjust the reminders interval, open the menu and select the <v-icon color="secondary" small>mdi-cog</v-icon> icon and adjust the parameters in the dialog that pops
              up.
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-card-subtitle
        >Hints: <br />
        Pin this extension for easy access to your classes! <br />
        Click the checkbox when launching a meeting to allow this extension to always be able to open Zoom<br />
        Open Zoom Meetings via web-client by opening settings and switching the toggle<br />
        Set Dark or Light mode, by opening the Menu and switching the toggle.<br />
        To find your meeting ID manually navigate to your link in your browser, and observe the link generated. After 'zoom.us/j or w or s/' you should see a 9 to 11 digit id which
        is your Meeting ID!</v-card-subtitle
      >
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'InfoDialogCard',
  props: ['value', 'width', 'dialog'],
  watch: {
    dialog(val) {
      this.$emit('update:dialog', val);
    },
  },

  computed: { dialog },
  methods: {},
  created() {
    console.log(this.value);
  },
};
</script>

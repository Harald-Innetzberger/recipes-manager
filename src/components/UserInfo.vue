<template>
  <div>
    <v-menu
      nudge-left="55"
      nudge-bottom="8"
      offset-y
      max-width="350"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon title="User Account" dark v-bind="attrs" v-on="on"
          ><v-icon>mdi-account</v-icon></v-btn
        >
      </template>
      <v-card>
        <v-list>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>{{
                userProfile.firstName + " " + userProfile.lastName
              }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ userProfile.email }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              <v-btn to="user" icon title="Edit User Info">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "UserInfo",
  computed: {
    ...mapState("user", ["userProfile"])
  }
};
</script>

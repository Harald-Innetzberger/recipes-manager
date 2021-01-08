<template>
  <div id="app">
    <v-app>
      <!-- Global Snack Bar -->
      <snack-bar />
      <!-- left navigation menu -->
      <v-navigation-drawer v-model="drawer" app>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              Application
            </v-list-item-title>
            <v-list-item-subtitle>
              subtext
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list nav>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <!-- top navigation menu -->
      <v-app-bar app class="primary" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
        <v-toolbar-title>Rezepte Manager</v-toolbar-title>
        <v-spacer />
        <!-- User Menu -->
        <user-info v-if="auth.currentUser" />
        <!-- Logout Button -->
        <v-btn v-if="auth.currentUser" @click="handleLogout" icon title="Logout"
          ><v-icon>mdi-logout-variant</v-icon></v-btn
        >
      </v-app-bar>
      <v-main>
        <v-container fluid>
          <!-- using vue-router -->
          <router-view />
        </v-container>
      </v-main>
      <v-footer padless>
        <v-col class="text-right" cols="12">
          {{ new Date().getFullYear() }} — Rezepte Manager
          {{ "v." + require("../package").version }}
        </v-col>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import { mapState } from "vuex";
import UserInfo from "./components/UserInfo";
import { auth } from "./firebase";
import SnackBar from "./components/SnackBar";
export default {
  components: {
    SnackBar,
    UserInfo
  },
  data: () => ({
    drawer: null,
    auth: auth,
    items: [
      { title: "Vorspeisen", icon: "mdi-food-variant", link: "appetiser" },
      { title: "Hauptspeisen", icon: "mdi-food", link: "/" },
      { title: "Nachspeisen", icon: "mdi-food-apple", link: "dessert" }
    ]
  }),
  computed: {
    ...mapState(["userProfile"])
  },
  methods: {
    handleLogout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>

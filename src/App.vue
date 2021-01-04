<template>
  <div id="app">
    <v-app>
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
      <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
        <v-toolbar-title>Rezepte Manager</v-toolbar-title>
        <v-spacer />
        <v-btn v-if="auth.currentUser" color="success" @click="handleLogout"
          >Logout</v-btn
        >
      </v-app-bar>
      <v-main>
        <v-container fluid>
          <!-- using vue-router -->
          <router-view />
        </v-container>
      </v-main>

      <v-footer padless>
        <v-col class="text-center" cols="12">
          {{ new Date().getFullYear() }} — <strong>Rezepte Manager</strong>
          {{ "v." + require("../package").version }}
        </v-col>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { auth } from "./firebase";
export default {
  data: () => ({
    drawer: null,
    auth: auth,
    items: [
      { title: "Vorspeisen", icon: "mdi-food-variant", link: "appetiser" },
      { title: "Hauptspeisen", icon: "mdi-food", link: "/" },
      { title: "Nachspeisen", icon: "mdi-food-apple", link: "dessert" }
    ]
  }),
  methods: {
    ...mapActions(["logout"]),
    handleLogout() {
      this.logout("logout");
    }
  }
};
</script>

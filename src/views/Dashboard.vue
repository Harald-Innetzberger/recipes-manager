<template>
  <div>
    DASHBOARD
    <v-btn color="success" @click="handleLogout">Logout</v-btn>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions(["logout"]),
    handleLogout() {
      this.logout("logout");
    }
  }
};
</script>

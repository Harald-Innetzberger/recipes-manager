<template>
  <div>
    <v-snackbar
      v-model="show"
      :color="color"
      :timeout="timeout"
      bottom
      right
    >
      <span class="subtitle-1">{{ message }}</span>
      <template #action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "SnackBar",
  data: () => ({
    show: false,
    message: "",
    color: "",
    timeout: 4000
  }),
  created() {
    this.$store.watch(
      state => state.snackbar.snack,
      () => {
        const content = this.$store.state.snackbar.snack;
        if (content.length) {
          this.show = true;
          this.message = this.$store.state.snackbar.snack[0];
          this.color = this.$store.state.snackbar.snack[1];
          this.$store.dispatch("snackbar/setSnack", []);
        }
      }
    );
  }
};
</script>

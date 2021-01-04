<template>
  <div>
    <v-snackbar
      :value="true"
      :timeout="timeout"
      :color="infoType"
      right
    >
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="$emit('closeSnackBar')">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "SnackBar",
  props: {
    infoType: {
      type: String,
      default: ""
    },
    message: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    timeout: 3000
  })
};
</script>

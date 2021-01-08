<template>
  <div>
    <v-card>
      <v-card-text>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form @submit.prevent="updateAccount">
            <!-- Email -->
            <validation-provider
              v-slot="{ errors }"
              name="firstName"
              rules="required"
            >
              <v-text-field
                v-model.trim="userProfile.firstName"
                label="First Name"
                :error-messages="errors"
                required
              ></v-text-field>
            </validation-provider>
            <!-- Password -->
            <validation-provider
              v-slot="{ errors }"
              name="lastName"
              rules="required"
            >
              <v-text-field
                v-model.trim="userProfile.lastName"
                label="Last Name"
                :error-messages="errors"
                required
              ></v-text-field>
            </validation-provider>
            <!-- Location -->
            <validation-provider
              v-slot="{ errors }"
              name="location"
              rules="min:3"
            >
              <v-text-field
                v-model.trim="userProfile.location"
                label="Location"
                :error-messages="errors"
              ></v-text-field>
            </validation-provider>
            <v-btn :disabled="invalid" @click="updateAccount">Absenden</v-btn>
          </v-form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { extend } from "vee-validate";
import { required, min } from "vee-validate/dist/rules";
extend("min", min);
extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  computed: {
    ...mapState("user", ["userProfile"])
  },
  methods: {
    async updateAccount() {
      const valid = await this.$refs.observer.validate();
      if (valid) {
        await this.$store.dispatch("user/updateUserProfile", this.userProfile);
        await this.$store.dispatch("snackbar/setSnack", [
          "Benutzerdaten aktualisiert.",
          "success"
        ]);
      }
    }
  }
};
</script>

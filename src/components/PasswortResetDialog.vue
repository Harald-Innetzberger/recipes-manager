<template>
  <div>
    <v-dialog
      :value="true"
      transition="dialog-top-transition"
      max-width="600"
      persistent
    >
      <v-card>
        <v-toolbar color="primary" dark>Reset Password</v-toolbar>
        <v-card-text>
          <h3>Enter your email address to reset the password</h3>
          <validation-observer
            ref="pwResetFormObserver"
            v-slot="{ invalid }"
            v-if="!isSent"
          >
            <v-form @submit.prevent="handlePasswordReset">
              <!-- Email -->
              <validation-provider
                v-slot="{ errors }"
                name="email"
                rules="required|email"
              >
                <v-text-field
                  v-model.trim="email"
                  label="E-Mail"
                  :error-messages="errors"
                  required
                ></v-text-field>
                <v-btn :disabled="invalid" @click="handlePasswordReset"
                  >Absenden</v-btn
                >
              </validation-provider>
            </v-form>
          </validation-observer>
          <p v-else class="title">Check your email for a reset link.</p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="$emit('closeDialog')">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { auth } from "../firebase";
import { extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";
extend("email", email);
extend("required", required);
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  name: "PasswordResetDialog",
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data: () => ({
    isSent: false,
    email: ""
  }),
  methods: {
    async handlePasswordReset() {
      const valid = await this.$refs.pwResetFormObserver.validate();
      if (valid) {
        try {
          await auth.sendPasswordResetEmail(this.email);
          await this.$store.dispatch("snackbar/setSnack", [
            "Passwort Reset Link gesendet.",
            "info"
          ]);
          this.isSent = true;
        } catch (e) {
          await this.$store.dispatch("snackbar/setSnack", [e.message, "error"]);
        }
      }
    }
  }
};
</script>

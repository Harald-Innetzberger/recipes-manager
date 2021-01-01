<template>
  <v-card>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form @submit.prevent="handleLogin">
        <!-- Email -->
        <validation-provider
          v-slot="{ errors }"
          name="email"
          rules="required|email"
        >
          <v-text-field
            v-model.trim="loginForm.email"
            label="E-Mail"
            :error-messages="errors"
            required
          ></v-text-field>
        </validation-provider>
        <!-- Password -->
        <validation-provider
          v-slot="{ errors }"
          name="password"
          rules="required"
        >
          <v-text-field
            v-model.trim="loginForm.password"
            label="Password"
            :error-messages="errors"
            required
          ></v-text-field>
        </validation-provider>
        <v-btn :disabled="invalid" color="success" @click="handleLogin">Login</v-btn>
      </v-form>
    </validation-observer>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import { extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";
extend("email", {
  ...email,
  message: "Email must be valid"
});
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
  data: () => ({
    loginForm: {
      email: "harald.innetzberger@web.de",
      password: "19Claudia83"
    }
  }),
  methods: {
    ...mapActions(["login"]),
    async handleLogin() {
      const valid = await this.$refs.observer.validate();
      if (valid) {
        this.login(this.loginForm);
      }
    }
  }
};
</script>

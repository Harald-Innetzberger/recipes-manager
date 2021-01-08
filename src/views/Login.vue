<template>
  <div>
    <v-card>
      <v-card-text>
        <!-- Sign Up Form -->
        <validation-observer
          ref="signUpFormObserver"
          v-slot="{ invalid }"
          v-if="showSignUpForm"
        >
          <v-form @submit.prevent="handleSignUp">
            <!-- First Name -->
            <validation-provider
              v-slot="{ errors }"
              name="lastName"
              rules="required|min:3"
            >
              <v-text-field
                v-model.trim="signUpForm.firstName"
                label="First Name"
                :error-messages="errors"
                required
              ></v-text-field>
            </validation-provider>
            <!-- Last Name -->
            <validation-provider
              v-slot="{ errors }"
              name="lastName"
              rules="required|min:3"
            >
              <v-text-field
                v-model.trim="signUpForm.lastName"
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
                v-model.trim="signUpForm.location"
                label="Location"
                :error-messages="errors"
              ></v-text-field>
            </validation-provider>
            <!-- Email -->
            <validation-provider
              v-slot="{ errors }"
              name="email"
              rules="required|email"
            >
              <v-text-field
                v-model.trim="signUpForm.email"
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
                v-model.trim="signUpForm.password"
                label="Password"
                :error-messages="errors"
                required
              ></v-text-field>
            </validation-provider>
            <v-btn :disabled="invalid" @click="handleSignUp"
              >Account erstellen</v-btn
            >
          </v-form>
        </validation-observer>
        <validation-observer
          ref="loginFormObserver"
          v-slot="{ invalid }"
          v-if="!showSignUpForm"
        >
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
            <v-btn :disabled="invalid" @click="handleLogin">Login</v-btn><br />
          </v-form>
        </validation-observer>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-if="!showSignUpForm"
          text
          small
          @click="showPasswordResetDialog = true"
          >Passwort vergessen?</v-btn
        >
        <v-spacer />
        <v-btn v-if="!showSignUpForm" @click="showSignUpForm = true" text small
          >Account erstellen
        </v-btn>
        <v-btn v-else @click="showSignUpForm = false" text small
          >Zurück zum Login</v-btn
        >
      </v-card-actions>
    </v-card>
    <!-- Password Reset Dialog -->
    <password-reset-dialog
      v-if="showPasswordResetDialog"
      @closeDialog="showPasswordResetDialog = false"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { extend } from "vee-validate";
import { required, email, min } from "vee-validate/dist/rules";
extend("email", email);
extend("min", min);
extend("required", required);
import { ValidationObserver, ValidationProvider } from "vee-validate";
import PasswordResetDialog from "../components/PasswortResetDialog";
export default {
  components: {
    PasswordResetDialog,
    ValidationObserver,
    ValidationProvider
  },
  data: () => ({
    showSignUpForm: false,
    showPasswordResetDialog: false,
    signUpForm: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      location: ""
    },
    loginForm: {
      email: "",
      password: ""
    }
  }),
  methods: {
    ...mapActions(["login", "signUp"]),
    async handleSignUp() {
      const valid = await this.$refs.signUpFormObserver.validate();
      if (valid) {
        this.signUp(this.signUpForm);
      }
    },
    async handleLogin() {
      const valid = await this.$refs.loginFormObserver.validate();
      if (valid) {
        this.login(this.loginForm);
      }
    }
  }
};
</script>

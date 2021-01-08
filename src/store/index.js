import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";
import router from "../router";
import snackbar from "./modules/snackbar";
import user from "./modules/user";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    snackbar,
    user
  },
  actions: {
    // Sign Up
    async signUp({ dispatch }, formData) {
      try {
        const { user } = await fb.auth.createUserWithEmailAndPassword(
          formData.email,
          formData.password
        );
        // create user profile in usersCollection
        await fb.usersCollectionRef.doc(user.uid).set({
          firstName: formData.firstName,
          lastName: formData.lastName,
          location: formData.location
        });
        dispatch("snackbar/setSnack", ["Account erstellt.", "success"]);
        dispatch("user/fetchUserProfile", user, { root: true });
      } catch (e) {
        dispatch("snackbar/setSnack", [e.message, "error"]);
      }
    },
    // Login
    async login({ dispatch }, formData) {
      try {
        const { user } = await fb.auth.signInWithEmailAndPassword(
          formData.email,
          formData.password
        );
        dispatch("snackbar/setSnack", ["Erfolgreich angemeldet.", "success"]);
        dispatch("user/fetchUserProfile", user, { root: true });
      } catch (e) {
        dispatch("snackbar/setSnack", [e.message, "error"]);
      }
    },
    // Logout
    async logout({ commit }) {
      await fb.auth.signOut();
      commit("user/SET_USER_PROFILE", {}, { root: true });
      router.push("/login");
    }
  }
});

export default store;

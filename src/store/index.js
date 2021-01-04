import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";
import router from "../router";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userProfile: {}
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    }
  },
  actions: {
    async login({ dispatch }, formData) {
      // sign user in
      const { user } = await fb.auth.signInWithEmailAndPassword(
        formData.email,
        formData.password
      );
      // fetch user profile and set in state
      dispatch("fetchUserProfile", user);
    },
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollectionRef.doc(user.uid).get();
      // set user profile in state
      commit("setUserProfile", userProfile.data());
      // change route to dashboard
      router.push("/");
    },
    async logout({ commit }) {
      await fb.auth.signOut();
      // clear user profile and redirect to login page ...
      commit("setUserProfile", {});
      router.push("/login");
    }
  }
});

export default store;

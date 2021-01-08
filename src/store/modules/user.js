import * as fb from "../../firebase";
import router from "../../router";

/**
 * User (global)
 * @returns {{}}
 */
const state = () => ({
  userProfile: {}
});

const mutations = {
  SET_USER_PROFILE(state, payload) {
    state.userProfile = payload;
  }
};

const actions = {
  // Fetch user data from userCollection (key: uid)
  async fetchUserProfile({ commit }, user) {
    const userProfile = await fb.usersCollectionRef.doc(user.uid).get();
    // set user profile in state
    commit("SET_USER_PROFILE", userProfile.data());
    // change route to dashboard, only on login path
    if (router.currentRoute.path === "/login") {
      router.push("/");
    }
  },
  // Update User Profile
  async updateUserProfile({ commit }, user) {
    const docRef = await fb.usersCollectionRef.doc(fb.auth.currentUser.uid);
    await docRef.update(user);
    commit("SET_USER_PROFILE", user);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

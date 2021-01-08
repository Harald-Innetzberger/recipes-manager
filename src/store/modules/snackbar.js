/**
 * SnackBar (global)
 * @returns {{}}
 */
const state = () => ({
  snack: []
});

const mutations = {
  SET_SNACK(state, payload) {
    state.snack = payload;
  }
};

const actions = {
  setSnack({ commit }, data) {
    commit("SET_SNACK", data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

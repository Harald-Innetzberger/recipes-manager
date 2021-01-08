import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

import de from "vuetify/es5/locale/de";

const opts = {
  lang: {
    locales: { de },
    current: "de"
  },
  theme: {
    dark: true
  }
};

export default new Vuetify(opts);

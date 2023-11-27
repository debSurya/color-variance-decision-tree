import { createApp, h, provide } from 'vue';
import './style.css';
import App from './App.vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { apolloClient } from './services/graphql';
import { mdi, aliases } from 'vuetify/lib/iconsets/mdi.mjs';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
})
  .use(vuetify)
  .mount('#app');

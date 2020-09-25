<template>
    <Shell v-if="loggedIn">sdsdsd</Shell>
    <LoginPage v-else></LoginPage>
</template>

<script>
import LoginPage from './views/LoginPage';
import Shell from './views/Shell';

export default {
  name: 'App',

  components: {
    LoginPage,
    Shell
  },

  computed: {
    loggedIn() {
      return this.$store.state.loggedIn
    }
  },

  data: () => ({
    //
  }),
};
</script>

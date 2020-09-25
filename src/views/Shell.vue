<template>
<v-app id="inspire" :class="{ 'darkbackground': $vuetify.theme.dark, 'lightbackground': !$vuetify.theme.dark}">
    <v-navigation-drawer
        v-model="drawer"
        app
        absolute
        dark
        clipped
    >
    <v-list
    dense
    nav
    class="py-0"
    >

    <v-list-item
        v-for="item in items"
        :key="item.title"
        link 
        :to="item.link"
        >
        <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
    </v-list-item>
    </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="grey darken-2"
      clipped-left
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Cars Guard | Camera integrator</v-toolbar-title>
    </v-app-bar>

    <v-content>
        <router-view></router-view>
    </v-content>

</v-app>
</template>


<script>
export default {
    data: () => ({
      drawer: true,
      items: [
        //{ title: 'Dashboard', icon: 'mdi-view-dashboard', link: '/dashboard' },
        { title: 'Cameras', icon: 'mdi-camcorder', link: '/cameras' }
      ],
    }),
}
</script>
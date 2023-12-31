<script setup lang="ts">
import { useTheme } from 'vuetify'
const theme = useTheme()
const router = useRouter()
import { useConfigStore, Link } from '~/stores/config'
const configStore = useConfigStore()

const data = reactive({
  drawer: true,
  rail: true,
  darkTheme: true,
  links: [],
  userOptions: [],
  isProcessing: false,
})
const { drawer, rail, links, userOptions, darkTheme, isProcessing } = toRefs(
  data,
)
const methods = {
  toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    data.darkTheme = theme.global.current.value.dark
    localStorage.setItem(
      'useDarkTheme',
      theme.global.current.value.dark.toString(),
    )
  },
  setTheme() {
    const useDarkTheme = localStorage.getItem('useDarkTheme')
    if (!useDarkTheme) return (data.darkTheme = theme.global.current.value.dark)
    if (useDarkTheme === 'false') {
      theme.global.name.value = 'light'
      data.darkTheme = false
    }
  },
}
const { toggleTheme, setTheme } = methods
const isRail = computed(() => {
  return data.rail ? 'mdi-chevron-right' : 'mdi-chevron-left'
})
const themeIcon = computed(() =>
  data.darkTheme ? 'mdi-brightness-2' : 'mdi-white-balance-sunny',
)
onMounted(() => {
  links.value = configStore.links
  setTheme()
})
</script>

<template>
  <div>
    <v-app-bar color="inorganicPrimary">
      <v-app-bar-nav-icon
        v-show="links.length"
        variant="text"
        icon="mdi-menu"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <nuxt-link to="/">
        <v-toolbar-title>
          RSelect Widgets
        </v-toolbar-title>
      </nuxt-link>
      <v-spacer></v-spacer>
      <!-- <div>
        <v-switch
          v-model="darkTheme"
          class="px-8"
          color="primary"
          inset
          label="Dark"
          hide-details
          @change="toggleTheme()"
        ></v-switch>
      </div> -->
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      color="inorganicPrimary"
      bottom
      permanent
    >
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item
          v-for="(link, i) in links"
          :key="i"
          :to="link.to"
          color="primary"
          :prepend-icon="link.icon"
        >
          <v-list-item-title class="text-caption">
            {{ link.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <template #append>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-item :prepend-icon="themeIcon">
            <v-list-item-title>
              <v-switch
                v-model="darkTheme"
                color="primary"
                inset
                label="Dark"
                hide-details
                @change="toggleTheme()"
              ></v-switch>
            </v-list-item-title>
          </v-list-item>
          <v-list-item :prepend-icon="isRail" @click.stop="rail = !rail">
            Minify
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<style lang="sass">
.mdi-brightness-2
  transform: rotate(45deg)
</style>

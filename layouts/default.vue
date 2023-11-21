<script setup lang="ts">
import { useTheme } from 'vuetify'
const theme = reactive(useTheme())
const data = reactive({
  isProcessing: false,
  darkTheme: true,
  created: false,
  backgroundColor: '',
})
onMounted(() => {
  data.created = true
  data.backgroundColor = theme.current.colors.inorganicSecondary
})
watch(theme.global, (val) => {
  data.backgroundColor = val.current.colors.inorganicSecondary
})
const { created, darkTheme, backgroundColor } = toRefs(data)
// Master only
</script>

<template>
  <v-app :class="{ created }">
    <Navbar />
    <v-main :style="{ 'background-color': backgroundColor }">
      <v-container fluid>
        <router-view class="pa-8"></router-view>
      </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>

<style lang="sass">
.pointer
  cursor: pointer
.select-none
  user-select: none
a
  text-decoration: unset !important
  color: unset

header
  width: 100%

.v-application
  transition: opacity 150ms ease-in-out
  opacity: 0
  &.created
    opacity: 1

.v-main
  padding-top: 64px
.v-footer
  z-index: 1 !important
  height: auto
</style>

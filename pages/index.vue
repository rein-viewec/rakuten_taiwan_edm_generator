<script setup lang="ts">
const router = useRouter()
import { useConfigStore, Link } from '~/stores/config'
const configStore = useConfigStore()
const data = reactive({
  currentPageInfo: {} as Link,
  links: [],
})
const { currentPageInfo, links } = toRefs(data)
const pageInfo = configStore.links.find(
  (l) => l.to === router.currentRoute.value.path,
)
currentPageInfo.value = pageInfo
useMeta({
  title: currentPageInfo.value.meta,
})
onMounted(() => {
  links.value = configStore.links
})
</script>

<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="10" lg="8" xl="6">
        <v-card class="pa-12 elevation-12 main__card">
          <v-row align="center">
            <v-col cols="12">
              <div class="text-h5 Font-weight-bold my-2">
                Rselect Widgets
              </div>
              <div class="text-subitle my-2">
                請選擇要使用的工具
              </div>
            </v-col>
          </v-row>
          <v-row align="start" class="pt-6">
            <v-col
              v-for="link in links"
              v-show="link.to !== '/'"
              :key="link.to"
              cols="12"
              sm="12"
              md="6"
              lg="6"
            >
              <v-card :to="link.to" class="pt-5">
                <v-card-title>{{ link.title }}</v-card-title>
                <v-card-text class="text-subtitle-1">
                  {{ link.description }}
                </v-card-text>
                <v-card-text class="pb-4">
                  <v-row align="center" no-gutters>
                    <v-col cols="6" class="">
                      <v-icon
                        color="secondary"
                        :icon="link.icon"
                        size="64"
                      ></v-icon>
                    </v-col>
                    <v-col
                      class="text-subtitle-1 text-right font-weight-bold"
                      cols="6"
                    >
                      前往
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="sass">
// .main__card
//   background-color: #ffffffbb
//   &.v-theme--dark
//     background-color: #333333cc
.min__height
  min-height: 24px
.delete__todo
  opacity: 0
  pointer-events: none
.v-list-item:hover
  .delete__todo
    opacity: 1
    pointer-events: auto
</style>

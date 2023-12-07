<script setup lang="ts">
const router = useRouter()
const data = reactive({
  links: [
    // {
    //   title: 'RSelect Widgets 首頁',
    //   to: '/',
    //   icon: 'mdi-robot',
    // },
    {
      title: 'Event EDM 產生工具',
      to: '/generator/edm',
      icon: 'mdi-tooltip-image',
      description:
        '依照格式上傳檔案後可以依照上傳的圖片或商品連結，產生可以直接下載的 EDM',
    },
    {
      title: '追蹤短網址產生工具',
      to: '/generator/track-url',
      icon: 'mdi-file-link',
      description: '輸入希望追蹤的網址，來產生追蹤網址或是短網址',
    },
  ],
})
const { links } = toRefs(data)
onMounted(() => {})
</script>

<template>
  <v-container fluid>
    <v-card class="pa-12">
      <v-row align="center" class="pt-6">
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
          :key="link.to"
          cols="12"
          sm="12"
          md="6"
          lg="4"
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
  </v-container>
</template>

<style scoped lang="sass">
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

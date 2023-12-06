<script setup lang="ts">
import crypto from 'crypto-js'
const config = useRuntimeConfig()
const router = useRouter()
import { compareAsc, format } from 'date-fns'
const data = reactive({
  isMenuOpen: false,
  show: false,
  inputUrl: '',
  eventStartDate: new Date(),
  trackUrl: [
    '?scid=fbsp-oso_',
    '_&utm_source=facebook&utm_medium=ppl_oso&utm_campaign=&utm_content=',
  ],
  selectSite: {
    name: 'R-Select',
    value: 'rselect',
  },
  sites: [
    {
      name: 'R-Select',
      value: 'rselect',
    },
    {
      name: '日安優物',
      value: 'vvvshop',
    },
  ],
  isValidUrl: [
    (value) => {
      const Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
      const objExp = new RegExp(Expression)
      return objExp.test(value) == true || value === ''
        ? true
        : '請輸入正確格式的網址.'
    },
  ],
  isProcessing: false,
})
const {
  show,
  inputUrl,
  sites,
  selectSite,
  eventStartDate,
  isMenuOpen,
  trackUrl,
  isValidUrl,
  isProcessing,
} = toRefs(data)

const methods = {
  readUrl: (ctx, key) => {
    console.warn('selectSite', data.selectSite)
    console.warn('inputUrl', data.inputUrl)
    return 'site'
  },
  createShortenLink: async () => {
    try {
      data.isProcessing = true
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${config.token}`,
        },
        body: {
          url: combineUrl.value,
        },
      }
      const res = await $fetch('/api/shorten', options)
      console.warn('createShortenLink', res)
      if (res.statusCode !== 200) return
    } catch (error) {
      console.warn(error)
    } finally {
      data.isProcessing = false
    }
  },
}

const { readUrl, createShortenLink } = methods
const displayInputUrl = computed(() =>
  data.inputUrl !== '' ? data.inputUrl : '請輸入追蹤網址',
)

const combineUrl = computed(() => {
  const datetime = format(data.eventStartDate, 'yyMMdd')
  const combineResult =
    data.inputUrl +
    data.trackUrl[0] +
    data.selectSite.value +
    data.trackUrl[1] +
    datetime
  return combineResult
})
const formatDate = computed(() => {
  const datetime = format(data.eventStartDate, 'yyyy-MM-dd')
  return datetime
})
watch(inputUrl, (val) => {
  if (router.currentRoute.value.name !== 'generator-track-url') return
})

useMeta({
  title: 'Rakuten Taiwan Widget - Track Url Generator',
})
onMounted(async () => {})
</script>

<template>
  <v-container fluid>
    <v-card class="pa-6">
      <v-row align="center" class="pt-6">
        <v-col cols="12">
          <div class="headline">
            輸入希望追蹤的網址，並按下產生，來產生追蹤短網址
          </div>
        </v-col>
      </v-row>
      <v-row align="center" class="py-6">
        <v-col cols="12" sm="8">
          <client-only>
            <v-tooltip location="bottom">
              <template #activator="{ props }">
                <v-text-field
                  v-model="inputUrl"
                  label="輸入追蹤網址"
                  variant="outlined"
                  color="success"
                  :rules="isValidUrl"
                  prepend-inner-icon="mdi-link-variant-plus"
                  v-bind="props"
                ></v-text-field>
              </template>
              <div class="text-subtitle-1">
                {{ displayInputUrl }}
              </div>
            </v-tooltip>
          </client-only>
        </v-col>
        <v-col cols="12" sm="2">
          <v-select
            v-model="selectSite"
            label="Select"
            variant="outlined"
            item-title="name"
            item-value="value"
            color="success"
            return-object
            :items="sites"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="2">
          <client-only>
            <v-menu v-model="isMenuOpen">
              <template #activator="{ props }">
                <v-text-field
                  label="活動開跑日期"
                  :model-value="formatDate"
                  readonly
                  variant="outlined"
                  v-bind="props"
                  color="success"
                ></v-text-field>
              </template>
              <v-locale-provider locale="zh">
                <v-date-picker
                  v-model="eventStartDate"
                  title="活動開跑日期"
                  elevation="2"
                  color="primary"
                ></v-date-picker>
              </v-locale-provider>
            </v-menu>
          </client-only>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="12" sm="12">
          <client-only>
            <v-tooltip location="bottom">
              <template #activator="{ props }">
                <v-text-field
                  v-model="combineUrl"
                  readonly
                  label="產生的網址"
                  variant="outlined"
                  hide-details
                  prepend-inner-icon="mdi-link-variant"
                  v-bind="props"
                ></v-text-field>
              </template>
              <div class="text-subtitle-1">
                {{ combineUrl }}
              </div>
            </v-tooltip>
          </client-only>
        </v-col>

        <v-col cols="12" sm="12">
          <v-btn
            prepend-icon="mdi-download"
            color="primary"
            :loading="isProcessing"
            block
            @click="createShortenLink"
          >
            產生短網址
          </v-btn>
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

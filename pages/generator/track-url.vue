<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()
import { format } from 'date-fns'
import { useClipboard, useStorage } from '@vueuse/core'
import { useConfigStore, Link } from '~/stores/config'
const configStore = useConfigStore()

const data = reactive({
  isMenuOpen: false,
  show: false,
  isCopied: false,
  inputUrl: '',
  outputUrl: '',
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
  snackbar: {
    show: false,
    timeout: 5000,
    message: '',
    type: 'success',
  },
  currentPageInfo: {} as Link,
})
const {
  inputUrl,
  outputUrl,
  sites,
  selectSite,
  eventStartDate,
  isMenuOpen,
  trackUrl,
  isCopied,
  isValidUrl,
  isProcessing,
  snackbar,
  currentPageInfo,
} = toRefs(data)
const { copy } = useClipboard({ outputUrl })
const state = useStorage('rakuten_taiwan_store', { basic_url: inputUrl })
const methods = {
  readUrl: (ctx, key) => {
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
      const result: any = res.result
      outputUrl.value = result.short_url
      sendMessage('成功產生短網址', null, null)
    } catch (error) {
      sendMessage(
        '產生短網址失敗，請留意輸入的網址是否為合法的網址，或當前短網址伺服器不穩，請稍後再次嘗試',
        'error',
        10000,
      )
      console.warn(error)
    } finally {
      data.isProcessing = false
    }
  },
  copyUrl: async () => {
    copy(outputUrl.value)
    isCopied.value = true
    sendMessage('成功複製短網址至剪貼簿', null, null)
  },
  sendMessage(message, type, timeout: number) {
    snackbar.value.show = true
    snackbar.value.message = message ? message : '操作成功'
    snackbar.value.type = type ? type : 'success'
    snackbar.value.timeout = timeout ? timeout : 5000
  },
}

const { readUrl, createShortenLink, copyUrl, sendMessage } = methods
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
  state.value = {
    basic_url: ref(val),
  }
})

const pageInfo = configStore.links.find(
  (l) => l.to === router.currentRoute.value.path,
)
currentPageInfo.value = pageInfo
useMeta({
  title: currentPageInfo.value.meta,
})
onMounted(() => {
  if (state.value.basic_url) {
    inputUrl.value = JSON.parse(JSON.stringify(state.value.basic_url))
  }
})
</script>

<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="10" lg="8" xl="6">
        <v-card class="pa-6 pt-10">
          <v-row align="center" class="pt-6">
            <v-col cols="12">
              <div class="headline">
                輸入希望追蹤的網址，並按下產生，來產生追蹤短網址
              </div>
            </v-col>
          </v-row>
          <v-row align="start" class="pt-6">
            <v-col cols="12" sm="12" md="12" lg="6" xl="8" class="pb-6">
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
            <v-col cols="6" sm="6" md="6" lg="3" xl="2">
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
            <v-col cols="6" sm="6" md="6" lg="3" xl="2">
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
                      label="產生的追蹤網址"
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
          </v-row>
          <v-row justify="center" class="mt-12 my-6">
            <v-col cols="12" sm="12" class="mt-6">
              <v-btn
                prepend-icon="mdi-link-variant-plus"
                color="primary"
                :loading="isProcessing"
                block
                size="x-large"
                @click="createShortenLink"
              >
                開始產生短網址
              </v-btn>
            </v-col>
            <v-col cols="12" sm="9">
              <client-only>
                <v-text-field
                  v-model="outputUrl"
                  readonly
                  label="產生的短網址"
                  variant="outlined"
                  hide-details
                  prepend-inner-icon="mdi-link-variant"
                  :append-inner-icon="
                    isCopied ? 'mdi-emoticon-happy' : 'mdi-emoticon-neutral'
                  "
                ></v-text-field>
              </client-only>
            </v-col>
            <v-col cols="12" sm="3">
              <v-btn
                prepend-icon="mdi-clipboard-plus-outline"
                color="secondary"
                class="white-text"
                :loading="isProcessing"
                block
                size="x-large"
                @click="copyUrl"
              >
                複製短網址
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.type"
      class="mb-9"
    >
      <div class="text-h6">
        {{ snackbar.message }}
      </div>
      <template #actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
          icon="mdi-close"
        ></v-btn>
      </template>
    </v-snackbar>
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

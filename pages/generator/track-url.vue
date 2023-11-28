<script setup lang="ts">
import crypto from 'crypto-js'
const config = useRuntimeConfig()

const data = reactive({
  show: true,
  inputUrl: '',
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
  isProcessing: false,
})
const { show, inputUrl, sites, selectSite } = toRefs(data)

const methods = {
  readUrl: (ctx, key) => {
    console.warn('selectSite', data.selectSite)
    console.warn('inputUrl', data.inputUrl)
    return 'site'
  },
}
const { readUrl } = methods
watch(inputUrl, (val) => {
  // if (IsEmail(val)) {
  //   data.disabled = false
  //   return
  // }
  console.warn('inputUrl', val)
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
            請依照格式上傳檔案，輸出結果將會顯示在下方，可以直接下載
          </div>
        </v-col>
      </v-row>
      <v-row justify="center" align="center" class="py-6">
        <v-col cols="12" sm="5">
          <v-text-field
            v-model="inputUrl"
            label="輸入分析網址"
            variant="outlined"
            hide-details
            prepend-icon="mdi-file"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            v-model="selectSite"
            label="Select"
            variant="outlined"
            item-title="name"
            item-value="value"
            return-object
            hide-details
            :items="sites"
          ></v-select>
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

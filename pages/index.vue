<script setup lang="ts">
import axios from 'axios'
import { useCustomerStore } from '~/stores/customer'
import crypto from 'crypto-js'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
const store = useCustomerStore()
const config = useRuntimeConfig()

const data = reactive({
  show: true,
  inputValue: '',
  isSearched: false,
  message: '',
  disabled: true,
  isUpload: false,
  secret: '',
  rules: {
    required: (value) => !!value || '此為必填項目.',
    emailMatch: (value) => !!IsEmail(value) || `請輸入正確的 email 格式`,
  },
  workbook: [],
  isProcessing: false,
})
const {
  show,
  rules,
  inputValue,
  isUpload,
  isProcessing,
  isSearched,
  workbook,
  message,
  disabled,
  secret,
} = toRefs(data)

const methods = {
  encrypt: (ciphertext, key) => {
    return crypto.AES.encrypt(JSON.stringify(ciphertext), key).toString()
  },
  decrypt: (ciphertext, key) => {
    return crypto.AES.decrypt(ciphertext, key).toString(crypto.enc.Utf8)
  },
  formateData: (items) => {
    // 補齊資料漏洞
    const newItems = items.map((c) => {
      if (!c.email) {
        const newItem = {
          company_name: c.company_name,
          email: '',
        }
        return newItem
      } else if (!c.company_name) {
        const newItem = {
          company_name: '無',
          email: c.email,
        }
        return newItem
      } else {
        return {
          company_name: c.company_name.toString(),
          email: c.email.toString(),
        }
      }
    })
    return newItems
  },
  IsEmail: (email) => {
    const regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (!regex.test(email)) {
      return false
    } else {
      return true
    }
  },
  getCustomer: async () => {
    try {
      data.isProcessing = true
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${config.token}`,
        },
        body: JSON.stringify({ email: data.inputValue }),
      }
      const res = await $fetch('/api/search_customer', options)
      data.isSearched = true
      data.isProcessing = false
      if (res.statusCode !== 200) return
    } catch (error) {
      console.warn(error)
    }
  },
  readXLSX(file) {
    if (!file) return false
    const nameSplit = file.name.split('.')
    const format = nameSplit[nameSplit.length - 1]
    const fileFormats = ['xlsx', 'xls', 'csv']
    if (!fileFormats.includes(format)) {
      return `格式錯誤, 僅支持以下格式 ${fileFormats}`
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsBinaryString(file)
      reader.onload = (evt) => {
        const data = evt.target.result
        const wb = XLSX.read(data, { type: 'binary' })
        const sheetName = wb.SheetNames
        const sheet = wb.Sheets[sheetName]
        const jsonWB = XLSX.utils.sheet_to_json(sheet)
        resolve(jsonWB)
      }
    })
  },
  async uploadItems(file) {
    try {
      console.clear()
      data.isUpload = false
      const uploadFile = file.target.files[0]
      console.warn('upload', uploadFile)
      const jsonWB = await readXLSX(uploadFile)
      if (!Array.isArray(jsonWB)) return console.warn(jsonWB)
      // jsonWB.splice(0, 1)
      data.isUpload = true
      data.workbook = jsonWB
    } catch (error) {
      console.warn('uploadItems', error)
    }
  },
  exportTemplate() {
    const list = [['product_image_link', 'product_url', 'top_banner']]
    const templateLine = [
      [
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Nov1_EDM/01.jpg',
        'https://www.rakuten.com.tw/shop/rselect/product/R24-kobe-beauty-labo-main-salo6/',
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Nov1_EDM/Top%20banner.jpg',
      ],
    ]
    for (const line of templateLine) {
      list.push(line)
    }
    const workBook = XLSX.utils.book_new()
    const sheet1 = XLSX.utils.aoa_to_sheet(list)
    XLSX.utils.book_append_sheet(workBook, sheet1, 'sheet1')
    XLSX.writeFile(workBook, '格式範本' + '.xlsx')
  },
  generatorFile() {
    const wb = toRaw(data.workbook)
    if (!wb) return
    console.warn('workbook', wb)
    wb.forEach((w, index) => {
      console.warn('forEach', wb[index].top_banner)
    })
    // const topBanner = Object.keys(wb[0])
    // console.warn('top_banner', topBanner)
    const td = `
      <td colspan="1">
        <a
          target="_blank"
          href="https://www.rakuten.com.tw/shop/rselect/product/R24-kobe-beauty-labo-main-salo6/"
        >
          <img
            src="https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Nov1_EDM/01.jpg"
            width="314"
            height="317"
          />
        </a>
      </td>
      `
    const trContent = ''
    const fileContent = `
      <table
          id="___01"
          width="950"
          height="auto"
          border="0"
          cellpadding="0"
          cellspacing="0"
        >
        ${td}
      </table>
    `
    return fileContent
  },
  exportResult() {
    const content = generatorFile()
    const blob = new Blob([content], {
      type: 'text/html',
    })
    FileSaver.saveAs(blob, 'edm.html')
  },
  saveFile() {
    const blob = new Blob(['Hello, world!'], {
      type: 'text/plain;charset=utf-8',
    })
    let file = new Blob(['test'], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, 'test.txt')
  },
}
const {
  encrypt,
  decrypt,
  formateData,
  IsEmail,
  getCustomer,
  uploadItems,
  readXLSX,
  exportTemplate,
  generatorFile,
  exportResult,
  saveFile,
} = methods
watch(inputValue, (val) => {
  if (IsEmail(val)) {
    data.disabled = false
    return
  }
  data.disabled = true
})
useMeta({
  title: 'Wiser X ViewEC 現有客戶查詢',
})
onMounted(async () => {
  data.isSearched = false
})
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
        <v-col cols="12" sm="9">
          <v-file-input
            label="選擇要上傳的圖片連結資料"
            accept="xlsx/*"
            variant="outlined"
            clearable
            hint="請輸入正確格式的 email，確保查詢到的為正確的資料"
            prepend-icon="mdi-file"
            hide-details
            @change="uploadItems"
          ></v-file-input>
        </v-col>
        <v-col cols="12" sm="3">
          <v-btn
            prepend-icon="mdi-download"
            color="primary"
            :loading="isProcessing"
            block
            @click="exportTemplate"
          >
            下載檔案範本
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center" align="center" class="py-12">
        <v-col cols="12" sm="8">
          <div v-show="isUpload" class="text-center">
            <div v-html="generatorFile()"></div>
          </div>
        </v-col>

        <v-col cols="12" sm="8">
          <div v-show="isUpload" class="text-center">
            <div class="font-weight-bold my-0">
              <v-btn
                prepend-icon="mdi-download"
                color="primary"
                :loading="isProcessing"
                block
                size="large"
                @click="exportResult"
              >
                下載檔案範本
              </v-btn>
            </div>
          </div>
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

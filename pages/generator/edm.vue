<script setup lang="ts">
const router = useRouter()
import crypto from 'crypto-js'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { useConfigStore, Link } from '~/stores/config'
const configStore = useConfigStore()
const config = useRuntimeConfig()
const data = reactive({
  show: true,
  inputValue: '',
  isSearched: false,
  message: '',
  disabled: true,
  isUpload: false,
  secret: '',
  workbook: [],
  isProcessing: false,
  currentPageInfo: {} as Link,
})
const {
  show,
  inputValue,
  isUpload,
  isProcessing,
  isSearched,
  workbook,
  message,
  disabled,
  secret,
  currentPageInfo,
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
      const statusCode: any = res
      if (statusCode !== 200) return
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
        const sheetName = wb.SheetNames[0]
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
      data.workbook = []
      const uploadFile = file.target.files[0]
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
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Dec_EDM/231201_01.jpg',
        'https://www.rakuten.com.tw/shop/rselect/product/R15-10004390/',
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Dec_EDM/Top-Banner.jpg',
      ],
      [
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Dec_EDM/231201_02.jpg',
        'https://www.rakuten.com.tw/shop/rselect/product/5x9spq7s3/',
      ],
      [
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Dec_EDM/231201_03.jpg',
        'https://www.rakuten.com.tw/shop/rselect/product/R02-royce-32/',
      ],
      [
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Dec_EDM/231201_04.jpg',
        'https://www.rakuten.com.tw/shop/rselect/product/R61-0102071/',
      ],
      [
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Dec_EDM/231201_05.jpg',
        'https://www.rakuten.com.tw/shop/rselect/product/R60-14763/',
      ],
      [
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Dec_EDM/231201_06.jpg',
        'https://www.rakuten.com.tw/shop/rselect/product/R60-21384/',
      ],
      [
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Dec_EDM/231201_07.jpg',
        'https://www.rakuten.com.tw/shop/rselect/product/R29-10001270/',
      ],
      [
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Dec_EDM/231201_08.jpg',
        'https://www.rakuten.com.tw/shop/rselect/product/R27-207027/',
      ],
      [
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Dec_EDM/231201_09.jpg',
        'https://www.rakuten.com.tw/shop/rselect/product/R70-k14550/',
      ],
      [
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Dec_EDM/231201_10.jpg',
        'https://www.rakuten.com.tw/shop/rselect/product/R10-tmcf01428/',
      ],
      [
        'https://shop.r10s.com/b6e59d20-f684-11ec-932a-0242ac110009/Dec_EDM/231201_11.jpg',
        'https://www.rakuten.com.tw/shop/rselect/product/xkyoxonkc/',
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
  generateFile() {
    const wb = toRaw(data.workbook)
    if (!wb) return
    let tr = ''
    let td = ''
    let td_last = ''
    wb.forEach((w, index) => {
      if (index === 0) {
        tr += ` 
          <tr>
            <td colspan="3" style="max-width: 100%;">
              <a href="#">
                <img
                  src="${w.top_banner}"
                  width="950"
                  height="auto"
                />
              </a>
            </td>
          </tr>
        `
      }
      let productIndex = (index += 1)
      td += `
        <td colspan="1" style="max-width: 100%;">
            <a
              target="_blank"
              href="${w.product_url}"
            >
              <img
                src="${w.product_image_link}"
                width="316.7"
                height="320"
              />
            </a>
        </td>
      `
      if (productIndex % 3 === 0) {
        tr += ` <tr>
          ${td}
        </tr>`
        td = ''
      }
      if (productIndex > 9) {
        td_last += `
          <td colspan="1" style="max-width: 100%;">
              <a
                target="_blank"
                href="${w.product_url}"
              >
                <img
                  src="${w.product_image_link}"
                  width="${wb.length === 11 ? 475 : 321}"
                  height="320"
                />
              </a>
              </a>
          </td>
        `
      }
    })
    const fileContent = `
      <table
          id="___01"
          width="950"
          height="auto"
          border="0"
          cellpadding="0"
          cellspacing="0"
        >
        ${tr}
      </table>
      <table
          id="___01"
          width="950"
          height="auto"
          border="0"
          cellpadding="0"
          cellspacing="0"
        >
        <tr>
          ${td_last}
        </tr>
      </table>
    `
    return fileContent
  },
  exportResult() {
    const content = generateFile()
    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8',
    })
    FileSaver.saveAs(blob, 'edm.html')
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
  generateFile,
  exportResult,
} = methods
watch(inputValue, (val) => {
  if (IsEmail(val)) {
    data.disabled = false
    return
  }
  data.disabled = true
})

const pageInfo = configStore.links.find(
  (l) => l.to === router.currentRoute.value.path,
)
currentPageInfo.value = pageInfo
useMeta({
  title: currentPageInfo.value.meta,
})
onMounted(async () => {
  data.isSearched = false
})
</script>

<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="10" lg="8" xl="6">
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
                size="large"
                @click="exportTemplate"
              >
                下載格式範本
              </v-btn>
            </v-col>
          </v-row>
          <v-row justify="center" align="center" class="py-12 text-center">
            <v-col cols="12" sm="8" class="text-center">
              <div v-show="isUpload" class="d-flex justify-center">
                <div v-html="generateFile()"></div>
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
                    下載EDM
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
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

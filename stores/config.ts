import { defineStore } from 'pinia'
const metaTitle = 'RSelect Widgets - '

export interface Link {
  title: string
  to: string
  icon: string
  description: string
  meta: any
}

export const useConfigStore = defineStore('Config', {
  state: () => ({
    links: [{
      title: 'RSelect Widgets 首頁',
      to: '/',
      icon: 'mdi-robot',
      description: '',
      meta: metaTitle + 'Home'
    },
    {
      title: 'Event EDM 產生工具',
      to: '/generator/edm',
      icon: 'mdi-tooltip-image',
      description:
        '依照格式上傳檔案後可以依照上傳的圖片或商品連結，產生可以直接下載的 EDM',
      meta: metaTitle + 'Event EDM 產生工具'
    },
    {
      title: '追蹤短網址產生工具',
      to: '/generator/track-url',
      icon: 'mdi-file-link',
      description: '輸入目標網址並設定日期站點，來產生 UTM 追蹤網址或是短網址',
      meta: metaTitle + '追蹤短網址產生工具'
    },
    ]
  }),
  getters: {
    getData: (state) => '',
  },
  actions: {
  },
})
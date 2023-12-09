<script setup lang="ts">
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import { getHomeBannerAPI, getHomeCategoryAPI } from '@/services/home'
import { onLoad } from '@dcloudio/uni-app'
import type { BannerItem, CategoryItem } from '@/types/home'
import { ref } from 'vue'

const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

const categoryList = ref<CategoryItem[]>([])
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}

const isTriggered = ref(false)
const onRefresherrefresh = async () => {
  isTriggered.value = true
  await Promise.all([getHomeBannerData(), getHomeCategoryData()])
  // 关闭动画
  isTriggered.value = false
}

onLoad(() => {
  getHomeBannerData()
  getHomeCategoryData()
})
</script>

<template>
  <view class="index">
    <CustomNavbar></CustomNavbar>

    <scroll-view refresher-enabled
                 :refresher-triggered="isTriggered"
                 @refresherrefresh="onRefresherrefresh">
      <!-- 自定义navbar -->
      <!-- 首页轮翻广告图 -->
      <XtxSwiper :list="bannerList" />
      <!-- 首页分类 -->
      <CategoryPanel :list="categoryList" />
    </scroll-view>
  </view>
</template>

<style lang="scss">
//
</style>

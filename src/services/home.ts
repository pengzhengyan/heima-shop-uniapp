import type { BannerItem, CategoryItem } from '@/types/home'
import { http } from '@/utils/http'

// 首页的接口文件
/**
 * 首页-广告区域-小程序
 * @param distributionSite
 * @returns Promise<Data<BannerItem[]>>
 */
export const getHomeBannerAPI = (distributionSite = 1) => {
  return http<BannerItem[]>({
    method: 'GET',
    url: '/home/banner',
    data: {
      distributionSite,
    },
  })
}

// /home/category/mutli
/**
 * 首页-前台分类-小程序
 * @returns Promise<Data<CategoryItem[]>>
 */
export const getHomeCategoryAPI = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })
}

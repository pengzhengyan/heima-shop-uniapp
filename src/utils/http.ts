import { useMemberStore } from '@/stores'
/**
 * 添加拦截器
 *  拦截 request 请求
 *  拦截 uploadFile 文件上传
 * TODO
 *
 */
const memberStore = useMemberStore()

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 对请求进行地址进行拼接
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 请求超时默认为60秒，需要调整为10秒
    options.timeout = 10000
    // 设置请求头
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    // 添加token
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
  },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 请求函数
 * @param UniApp.RequestOptions
 * @returns Promise
 *  1.返回Promise对象
 *  2.请求成功
 *    2.1提取核心数据 res.data
 *    2.2添加类型，支持泛型
 *  3.请求失败
 *    3.1 网络错误
 *    3.2 401错误，清除用户信息，跳转登录页面
 *    3.3 其它错误，做轻提示
 */
interface Data<T> {
  code: string
  msg: string
  result: T
}
// 添加类型，支持泛型
export const http = <T>(options: UniApp.RequestOptions) => {
  // 返回Promise对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 响应成功
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // 清除用户信息
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
        } else {
          uni.showToast({
            title: (res.data as Data<T>).msg || '请求错误',
            icon: 'error',
            mask: true,
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({
          title: '网络错误,换个网络试试',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}

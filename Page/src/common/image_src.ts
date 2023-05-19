/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-04 20:53:31
 * ⭐ @LastEditTime: 2022-02-05 14:32:23
 * ⭐ @Description: 静态资源URL地址处理函数
 */

export function getImageUrl(url: string) {
    return new URL(`../assets/${url}`, import.meta.url).href;
}
import store from '@/store'
import _axios, { get, put } from '@/lin/plugin/axios'
import { saveTokens } from '../util/token'

export default class User {
  /**
   * 分配用户
   * @param {object} user 注册信息
   */
  static register(user) {
    return _axios({
      method: 'post',
      url: 'cms/user/register',
      data: {
        email: user.email,
        username: user.username,
        password: user.password,
        group_ids: user.groupIds,
        confirm_password: user.confirmPassword,
      },
      handleError: true,
    })
  }

  /**
   * 登陆获取tokens
   * @param { String } username 用户名
   * @param { String } password 密码
   * @param { String } captcha 验证码
   * @param { String } tag 验证码签名
   */
  static async getToken(username, password, captcha, tag) {
    const tokens = await _axios({
      url: 'v1/admin/login',
      method: 'POST',
      data: {
        captcha,
        username,
        password,
      },
      headers: {
        tag,
      },
    })
    saveTokens(tokens.accessToken)
    return tokens
  }

  /**
   * 获取当前用户信息，并返回User实例
   */
  static async getInformation() {
    const info = await get('cms/user/information')
    const storeUser = store.getters.user === null ? {} : store.getters.user
    return Object.assign({ ...storeUser }, info)
  }

  /**
   * 获取当前用户信息和所拥有的权限
   */
  static async getPermissions() {
    const info = await get('v1/admin/getAdminInfo')
    const storeUser = store.getters.user === null ? {} : store.getters.user
    return Object.assign({ ...storeUser }, info)
  }

  /**
   * 获取指定用户信息和所拥有的权限
   */
  static async getPermissionsById() {
    const info = await get('v1/admin/getAdminInfoById/1')
    console.log(info, 'iii')
    const storeUser = store.getters.user === null ? {} : store.getters.user
    return Object.assign({ ...storeUser }, info)
  }

  /**
   * 用户修改密码
   * @param {string} newPassword 新密码
   * @param {string} confirmPassword 确认新密码
   * @param {string} oldPassword 旧密码
   */
  // eslint-disable-next-line camelcase
  static updatePassword({ old_password, new_password, confirm_password }) {
    return put('cms/user/change_password', {
      new_password,
      confirm_password,
      old_password,
    })
  }
}

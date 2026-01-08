import {ID, Response} from '../../../../../../_metronic/helpers'
export type User = {
  id?: ID
  name?: string           // 列表第一欄顯示的名字
  avatar?: string         // 大頭貼
  email?: string
  position?: string       // 職稱 / 部門
  role?: string           // 角色（前端目前只有一個字串）
  last_login?: string     // 最後登入時間
  two_steps?: boolean     // 是否啟用兩步驗證
  joined_day?: string     // 加入日期
  online?: boolean        // 線上狀態（Metronic demo 用）
  initials?: {            // 大頭照縮寫圈圈（其實可以前端自己算）
    label: string
    state: string
  }
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  avatar: 'avatars/300-6.jpg',
  position: 'Art Director',
  role: 'Administrator',
  name: '',
  email: '',
}

import {
  TABLEHEIGHTRUN,
  USERINFO,
  USERINFOR,
} from './types'
import Table from '../../../utils/tableHeight';  // 重新计算高度

export default {
  [TABLEHEIGHTRUN] (state, data) {   // 计算表格高度
    data = data || ['.find', '.paging', 135];
    state.View.TableHeight = Table(data);
  },
  [USERINFO] (state, data) {         // 存储用户的信息
    state.View.UserInfo = Object.assign(data);
  },
  [USERINFOR] (state, data) {         // 存储医疗机构用户的信息
    state.View.UserInfor = Object.assign(data);
  },
}

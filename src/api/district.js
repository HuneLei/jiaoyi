/**
 * Created by dingyiming on 2017/6/2.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */

import api from './index';

// 省市
const cityList = (id) =>
  api.get('common/city/list', {
    params: {
      id,
    },
  });

export default {
  cityList,
};

/**
 * 打印相关接口
 */
import api from '../index';

const path = {
  barcode: '/deliver/bill/qrCode', // 详情-根据ID查询配送单条码号
};

// 详情-根据ID查询配送单条码号
const barcode = (ids) =>
  api.post(path.barcode, {
    ids,
  });

export default {
  barcode,
};

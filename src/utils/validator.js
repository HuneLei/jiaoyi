/**
 * 自定义表单校验方法
 */
import convert from './convert';

//  验证那个混蛋是否上传附件
const enclosure = (rule, value, callback) => {
  const arr = convert.getJSON(value);
  let count = 0;
  for (let i = 0; i < arr.length; i += 1) {
    const item = arr[i];
    if (Number(item.percentage) === 100) {
      count += 1;
    }
  }
  if (arr && arr.length && arr.length === count) {
    return callback();
  } else if (arr.length !== count) {
    return callback(new Error());
  }
  return callback(new Error(rule.message));
};

//  弹出框之后的确定的验证是否为空
const dialogInput = (rule, value, callback) => {
  if (value) {
    return callback();
  }
  return callback(new Error(rule.message));
};

//  弹出框之后的确定的验证是否为空且可以为0
const dialogInputZero = (rule, value, callback) => {
  if (value === 0 || value) {
    return callback();
  }
  return callback(new Error(rule.message));
};

// 判断是否为数字类型的验证(包含小数点)
const verifyNumber = (rule, value, callback) => {
  let error = '';
  if (!value && value !== 0) {
    error = callback(new Error(rule.message));
  } else if (/^\d+$|^\d+\.\d+$/g.test(value)) {
    error = callback();
  } else {
    error = callback(new Error(rule.message));
  }
  return error;
};

// 判断正整数并且可以为0
const verifyNumberOnlyz = (rule, value, callback) => {
  let error = '';
  if (!value && value !== 0) {
    if (rule.required) {
      error = callback(new Error(rule.message));
    } else {
      error = callback();
    }
  } else if (/^([1-9]\d*|[0]{1,1})$/g.test(value)) {
    error = callback();
  } else {
    error = callback(new Error(rule.message));
  }
  return error;
};

// 判断正整数
const verifyNumberOnly = (rule, value, callback) => {
  let error = '';
  if (!value && value !== 0) {
    error = callback(new Error(rule.message));
  } else if (/^\+?[1-9][0-9]*$/g.test(value)) {
    error = callback();
  } else {
    error = callback(new Error(rule.message));
  }
  return error;
};

//  是否选择省市啊！！！！
const province = (rule, value, callback) => {
  if (typeof value === 'object' && value.length > 0) {
    return callback();
  }
  return callback(new Error(rule.message));
};

//  下拉单选
const select = (rule, value, callback) => {
  if (value || value === 0) {
    return callback();
  }
  return callback(new Error(rule.message));
};

// 时间区间验证
const verifyReportnumTime = (rule, value, callback) => {
  let error = '';
  if (!value || value.length === 0) {
    error = callback(new Error(rule.message));
  } else if (!value[0] || !value[1]) {
    error = callback(new Error(rule.message));
  } else {
    error = callback();
  }
  return error;
};

//  必须含有数字跟字母，且不低于6
const password = (rule, value, callback) => {
  if (!value || value.length < 6) {
    return callback(new Error('密码至少6位数'));
  } else if (!/([0-9].*[A-Za-z]|[A-Za-z].*[0-9])/.test(value)) {
    return callback(new Error('密码必须包含字母和数字'));
  }
  return callback();
};

// 永远return
const returnTrue = (rule, value, callback) => callback();

export default {
  enclosure,
  dialogInput,
  dialogInputZero,
  province,
  select,
  verifyReportnumTime,
  verifyNumber,
  verifyNumberOnly,
  returnTrue,
  verifyNumberOnlyz,
  password,
};

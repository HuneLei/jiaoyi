/**
 * 关于表格的公共方法
 */

//  渲染出新的表格数据
const tableRender = (array, page, size) => {
  const tableNum = [];
  const tableData = [];
  if (typeof array === 'object' && array.length > 0) {
    for (let i = 0; i < array.length; i += 1) {
      try {
        const item = array[i] || {};
        const num = page * size + i + 1;
        item.num = num;
        tableNum.push(num);
        tableData.push(item);
      } catch (error) {
        console.error(error);
      }
    }
  }
  return {
    tableData,
    tableNum,
  };
};

//  表格排序时重新计算num值
const tableSortNum = (row, data, count, tableNum, id) => {
  const idName = id || 'id';
  const tableData = data;
  let tableCount = count || 0;
  for (let i = 0; i < tableData.length; i += 1) {
    const item = data[i] || {};
    if (row[idName] === item[idName]) {
      tableData[i].num = tableNum[count];
      break;
    }
  }
  tableCount += 1;
  return {
    row,
    tableData,
    tableCount,
    tableNum,
  };
};

//  表格高度计算
const tableHeight = (array) => {
  let h = 0;
  let data = [];
  if (typeof array !== 'object') {
    data = [array];
  } else {
    data = array;
  }
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    try {
      const $e = document.querySelector(item);
      if ($e !== null) {
        h += $e.clientHeight;
      }
    } catch (e) {
      h += parseFloat(item) || 0;
    }
  }
  return window.innerHeight - h;
};

//  根据表格的row取出ids数组
const tableIds = (array, idName) => {
  const id = idName || 'id';
  const ids = [];
  for (let i = 0; i < array.length; i += 1) {
    const item = array[i];
    ids.push(item[id]);
  }
  return ids;
};

export default {
  tableRender,
  tableSortNum,
  tableHeight,
  tableIds,
};

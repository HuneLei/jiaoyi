const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const StockList = (r) =>
  require.ensure([], () => r(require('@/views/Deliverystock/StockList')), 'Deliverystock');
const CreateStockList = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverystock/StockList/CreateStockList')),
    'Deliverystock',
  );
const EditStockList = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverystock/StockList/EditStockList')),
    'Deliverystock',
  );
const ShowStockList = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverystock/StockList/ShowStockList')),
    'Deliverystock',
  );
const StockItemList = (r) =>
  require.ensure([], () => r(require('@/views/Deliverystock/StockItemList')), 'Deliverystock');
const Stock = (r) =>
  require.ensure([], () => r(require('@/views/Deliverystock/Stock')), 'Deliverystock');

export default {
  path: '/Deliverystock',
  component: Layout,
  icon: 'fa fa-database',
  name: '配送企业库存管理',
  children: [
    {
      path: 'StockList',
      component: StockList,
      name: '库存列表',
      meta: {
        functionName: '配送企业库存管理#库存列表',
      },
    },
    {
      path: 'StockList/CreateStockList',
      component: CreateStockList,
      name: '库存创建',
      meta: {
        functionName: '配送企业库存管理#库存列表',
      },
    },
    {
      path: 'StockList/EditStockList',
      component: EditStockList,
      name: '库存编辑',
      meta: {
        functionName: '配送企业库存管理#库存列表',
      },
    },
    {
      path: 'StockList/ShowStockList',
      component: ShowStockList,
      name: '库存查看',
      meta: {
        functionName: '配送企业库存管理#库存列表',
      },
    },
    {
      path: 'StockItemList',
      component: StockItemList,
      name: '库存明细列表',
      meta: {
        functionName: '配送企业库存管理#库存明细列表',
      },
    },
    {
      path: 'Stock',
      component: Stock,
      name: '期间库存',
      meta: {
        functionName: '配送企业库存管理#期间库存',
      },
    },
  ],
};

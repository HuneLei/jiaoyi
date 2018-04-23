const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const GpoPurchaseList = (r) =>
  require.ensure([], () => r(require('@/views/Gpopurchase/GpoPurchaseList')), 'Gpopurchase'); // GPO采购管理
const CreateGPO = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Gpopurchase/GpoPurchaseList/CreateGPO')),
    'Gpopurchase',
  ); // 采购单列表
const EditGPO = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Gpopurchase/GpoPurchaseList/EditGPO')),
    'Gpopurchase',
  ); // 采购单列表
const ShowGPO = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Gpopurchase/GpoPurchaseList/ShowGPO')),
    'Gpopurchase',
  ); // 采购单列表
const GpoPurchaseItem = (r) =>
  require.ensure([], () => r(require('@/views/Gpopurchase/GpoPurchaseItem')), 'Gpopurchase'); // 采购单明细

const GpoStockinList = (r) =>
  require.ensure([], () => r(require('@/views/Gpopurchase/GpoStockinList')), 'Gpopurchase'); // GPO入库单列表
const ShowStockin = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Gpopurchase/GpoStockinList/ShowStockin')),
    'Gpopurchase',
  ); // GPO入库单查看
const GpoStockinItem = (r) =>
  require.ensure([], () => r(require('@/views/Gpopurchase/GpoStockinItem')), 'Gpopurchase'); // GPO入库单明细

export default {
  path: '/Gpopurchase',
  component: Layout,
  icon: 'fa fa-database',
  name: 'GPO采购管理',
  children: [
    {
      path: 'GpoPurchaseList',
      component: GpoPurchaseList,
      name: 'GPO采购单列表',
      meta: {
        functionName: 'GPO采购管理#GPO采购单列表',
      },
    },
    {
      path: 'GpoPurchaseList/CreateGPO',
      component: CreateGPO,
      name: 'GPO采购单列表新增',
      meta: {
        functionName: 'GPO采购管理#GPO采购单列表',
      },
    },
    {
      path: 'GpoPurchaseList/EditGPO',
      component: EditGPO,
      name: 'GPO采购单列表编辑',
      meta: {
        functionName: 'GPO采购管理#GPO采购单列表',
      },
    },
    {
      path: 'GpoPurchaseList/ShowGPO',
      component: ShowGPO,
      name: 'GPO采购单列表查看',
      meta: {
        functionName: 'GPO采购管理#GPO采购单列表',
      },
    },
    {
      path: 'GpoPurchaseItem',
      component: GpoPurchaseItem,
      name: 'GPO采购单明细',
      meta: {
        functionName: 'GPO采购管理#GPO采购单明细',
      },
    },
    {
      path: 'GpoStockinList',
      component: GpoStockinList,
      name: 'GPO入库单列表',
      meta: {
        functionName: 'GPO采购管理#GPO入库单列表',
      },
    },
    {
      path: 'GpoStockinList/ShowStockin',
      component: ShowStockin,
      name: 'GPO入库单详情',
      meta: {
        functionName: 'GPO采购管理#GPO入库单列表',
      },
    },
    {
      path: 'GpoStockinItem',
      component: GpoStockinItem,
      name: 'GPO入库单明细',
      meta: {
        functionName: 'GPO采购管理#GPO入库单明细',
      },
    },
  ],
};

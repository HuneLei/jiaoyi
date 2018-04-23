const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const DeliveryPurchaseList = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverypurchase/DeliveryPurchaseList')),
    'Deliverypurchase',
  ); // 采购单列表
const Edit = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverypurchase/DeliveryPurchaseList/Edit')),
    'Deliverypurchase',
  ); // 采购单列表
const CreateDelivery = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverypurchase/DeliveryPurchaseList/CreateDelivery')),
    'Deliverypurchase',
  ); // 采购单列表
const EditDelivery = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverypurchase/DeliveryPurchaseList/EditDelivery')),
    'Deliverypurchase',
  ); // 采购单列表
const ShowDelivery = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverypurchase/DeliveryPurchaseList/ShowDelivery')),
    'Deliverypurchase',
  ); // 采购单列表
const DeliveryPurchaseItem = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverypurchase/DeliveryPurchaseItem')),
    'Deliverypurchase',
  ); // 采购单明细

export default {
  path: '/Deliverypurchase',
  component: Layout,
  icon: 'fa fa-database',
  name: '配送企业采购管理',
  children: [
    {
      path: 'DeliveryPurchaseList',
      component: DeliveryPurchaseList,
      name: '采购单列表',
      meta: {
        functionName: '配送企业采购管理#采购单列表',
      },
    },
    {
      path: 'DeliveryPurchaseList/CreateDelivery',
      component: CreateDelivery,
      name: '采购单列表创建',
      meta: {
        functionName: '配送企业采购管理#采购单列表',
      },
    },
    {
      path: 'DeliveryPurchaseList/Edit',
      component: Edit,
      name: '采购单列表编辑',
      meta: {
        functionName: '配送企业采购管理#采购单列表',
      },
    },
    {
      path: 'DeliveryPurchaseList/EditDelivery',
      component: EditDelivery,
      name: '采购单列表-详情查看',
      meta: {
        functionName: '配送企业采购管理#采购单列表',
      },
    },
    {
      path: 'DeliveryPurchaseList/ShowDelivery',
      component: ShowDelivery,
      name: '采购单列表-详情列表查看',
      meta: {
        functionName: '配送企业采购管理#采购单列表',
      },
    },
    {
      path: 'DeliveryPurchaseItem',
      component: DeliveryPurchaseItem,
      name: '采购单明细',
      meta: {
        functionName: '配送企业采购管理#采购单明细',
      },
    },
  ],
};

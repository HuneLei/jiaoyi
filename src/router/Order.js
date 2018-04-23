const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const PurchasePlan = (r) =>
  require.ensure([], () => r(require('@/views/Order/PurchasePlan')), 'Order');
const CheckItem = (r) =>
  require.ensure([], () => r(require('@/views/Order/PurchasePlan/CheckItem')), 'Order');
const CreatPlan = (r) =>
  require.ensure([], () => r(require('@/views/Order/PurchasePlan/CreatPlan')), 'Order');
const HospitalOrdersList = (r) =>
  require.ensure([], () => r(require('@/views/Order/HospitalOrdersList')), 'Order');
const CheckHItem = (r) =>
  require.ensure([], () => r(require('@/views/Order/HospitalOrdersList/CheckHItem')), 'Order');
const DeliveryOrdersList = (r) =>
  require.ensure([], () => r(require('@/views/Order/DeliveryOrdersList')), 'Order');
const CheckDItem = (r) =>
  require.ensure([], () => r(require('@/views/Order/DeliveryOrdersList/CheckDItem')), 'Order');
const OrdersClose = (r) =>
  require.ensure([], () => r(require('@/views/Order/OrdersClose')), 'Order');
const ClosesItem = (r) =>
  require.ensure([], () => r(require('@/views/Order/OrdersClose/ClosesItem')), 'Order');
const OrdersItem = (r) => require.ensure([], () => r(require('@/views/Order/OrdersItem')), 'Order');
const ShoppingCart = (r) =>
  require.ensure([], () => r(require('@/views/Order/ShoppingCart')), 'Order');
const ShopItem = (r) =>
  require.ensure([], () => r(require('@/views/Order/ShoppingCart/ShopItem')), 'Order');
const OrderRefer = (r) =>
  require.ensure([], () => r(require('@/views/Order/ShoppingCart/OrderRefer')), 'Order');
const OrdersCloseItem = (r) =>
  require.ensure([], () => r(require('@/views/Order/OrdersCloseItem')), 'Order');

export default {
  path: '/Order',
  component: Layout,
  icon: 'fa fa-database',
  name: '订单管理',
  children: [
    {
      path: 'PurchasePlan',
      component: PurchasePlan,
      name: '采购计划',
      meta: {
        functionName: '订单管理#采购计划',
      },
      children: [
        {
          path: 'CheckItem',
          component: CheckItem,
          name: '采购计划-查看详情',
          meta: {
            functionName: '订单管理#采购计划',
          },
        },
        {
          path: 'CreatPlan',
          component: CreatPlan,
          name: '采购计划-新增',
          meta: {
            functionName: '订单管理#采购计划',
          },
        },
      ],
    },
    {
      path: 'ShoppingCart',
      component: ShoppingCart,
      name: '订单购物车',
      meta: {
        functionName: '订单管理#订单购物车',
      },
      children: [
        {
          path: 'ShopItem',
          component: ShopItem,
          name: '订单购物车查看',
          meta: {
            functionName: '订单管理#订单购物车',
          },
        },
        {
          path: 'OrderRefer',
          component: OrderRefer,
          name: '订单提交',
          meta: {
            functionName: '订单管理#订单购物车',
          },
        },
      ],
    },
    {
      path: 'HospitalOrdersList',
      component: HospitalOrdersList,
      name: '订单列表（医疗机构）',
      meta: {
        functionName: '订单管理#订单列表（医疗机构）',
      },
      children: [
        {
          path: 'CheckHItem',
          component: CheckHItem,
          name: '订单列表（医疗机构）详情',
          meta: {
            functionName: '订单管理#订单列表（医疗机构）',
          },
        },
      ],
    },
    {
      path: 'DeliveryOrdersList',
      component: DeliveryOrdersList,
      name: '订单列表（配送企业）',
      meta: {
        functionName: '订单管理#订单列表（配送企业）',
      },
      children: [
        {
          path: 'CheckDItem',
          component: CheckDItem,
          name: '订单列表（配送企业）详情',
          meta: {
            functionName: '订单管理#订单列表（配送企业）',
          },
        },
      ],
    },
    {
      path: 'OrdersClose',
      component: OrdersClose,
      name: '订单结案申请单',
      meta: {
        functionName: '订单管理#订单结案申请单',
      },
      children: [
        {
          path: 'ClosesItem',
          component: ClosesItem,
          name: '订单结案申请单详情',
          meta: {
            functionName: '订单管理#订单结案申请单',
          },
        },
      ],
    },
    {
      path: 'OrdersCloseItem',
      component: OrdersCloseItem,
      name: '订单结案申请明细',
      meta: {
        functionName: '订单管理#订单结案申请明细',
      },
    },
    {
      path: 'OrdersItem',
      component: OrdersItem,
      name: '订单明细',
      meta: {
        functionName: '订单管理#订单明细',
      },
    },
  ],
};

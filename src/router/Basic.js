const Home = r => require.ensure([], () => r(require('@/views/Basic/Home')), 'home');

const Layout = r => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

export default {
  path: '/',
  component: Layout,
  children: [
    {
      path: 'index',
      component: Home,
      name: '首页',
      meta: ['交易系统', 'home'],
    },
  ],
};

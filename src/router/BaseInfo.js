const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const Project = (r) =>
  require.ensure([], () => r(require('@/views/BasicInfo/Project')), 'BasicInf'); // 采集项目表
const Address = (r) =>
  require.ensure([], () => r(require('@/views/BasicInfo/Address')), 'BasicInf'); // 采集项目表
const Hospital = (r) =>
  require.ensure([], () => r(require('@/views/BasicInfo/Hospital')), 'BasicInf'); // 医疗机构
const Delivery = (r) =>
  require.ensure([], () => r(require('@/views/BasicInfo/Delivery')), 'BasicInf'); // 配送企业
const Producer = (r) =>
  require.ensure([], () => r(require('@/views/BasicInfo/Producer')), 'BasicInf'); // 生产企业
const ContractValid = (r) =>
  require.ensure([], () => r(require('@/views/BasicInfo/ContractValid')), 'BasicInf'); // 合同有效期设置
const DeliverTime = (r) =>
  require.ensure([], () => r(require('@/views/BasicInfo/DeliverTime')), 'BasicInf'); // 点配送事件设置
const ChooseDeliverTime = (r) =>
  require.ensure([], () => r(require('@/views/BasicInfo/ChooseDeliverTime')), 'BasicInf'); // 选配送期间设置
const ChooseDeliverTimeEdit = (r) =>
  require.ensure([], () => r(require('@/views/BasicInfo/ChooseDeliverTime/Edit')), 'BasicInf'); // 选配送期间设置编辑
const CoverRate = (r) =>
  require.ensure([], () => r(require('@/views/BasicInfo/CoverRate')), 'BasicInf'); // 覆盖率管理
const Notice = (r) => require.ensure([], () => r(require('@/views/BasicInfo/Notice')), 'BasicInf'); // 公告管理
const NoticeList = (r) =>
  require.ensure([], () => r(require('@/views/BasicInfo/NoticeList')), 'BasicInf'); // 公告列表
const Edit = (r) =>
  require.ensure([], () => r(require('@/views/BasicInfo/NoticeList/Edit')), 'BasicInf'); // 公告列表编辑
const Signature = (r) =>
  require.ensure([], () => r(require('@/views/BasicInfo/Signature')), 'BasicInf'); // 签章管理

const BusinessHospitalInfo = (r) =>
  require.ensure([], () => r(require('@/components/BusInfo/BusinessHospitalInfo')), 'BasicInf'); // 医疗机构详情
const BusinessDeliveyInfo = (r) =>
  require.ensure([], () => r(require('@/components/BusInfo/BusinessDeliveyInfo')), 'BasicInf'); // 经营企业线详情
const BusinessEnterInfo = (r) =>
  require.ensure([], () => r(require('@/components/BusInfo/BusinessEnterInfo')), 'BasicInf'); // 医疗机构详情

export default {
  path: '/BasicInfo',
  component: Layout,
  icon: 'fa fa-database',
  name: '基础信息',
  children: [
    {
      path: 'Project',
      component: Project,
      name: '集采项目表',
      meta: {
        functionName: '基础信息#集采项目表',
      },
    },
    {
      path: 'Address',
      component: Address,
      name: '地址管理',
      meta: {
        functionName: '基础信息#地址管理',
      },
    },
    {
      path: 'Hospital',
      component: Hospital,
      name: '医疗机构',
      meta: {
        functionName: '基础信息#医疗机构',
      },
    },
    {
      path: 'Hospital/BusinessHospitalInfo',
      component: BusinessHospitalInfo,
      name: '医疗机构详情',
      meta: {
        functionName: '基础信息#医疗机构',
      },
    },
    {
      path: 'Delivery',
      component: Delivery,
      name: '经营企业',
      meta: {
        functionName: '基础信息#经营企业',
      },
    },
    {
      path: 'Delivery/BusinessDeliveyInfo',
      component: BusinessDeliveyInfo,
      name: '经营企业详情',
      meta: {
        functionName: '基础信息#经营企业',
      },
    },
    {
      path: 'Producer',
      component: Producer,
      name: '生产企业',
      meta: {
        functionName: '基础信息#生产企业',
      },
    },
    {
      path: 'Producer/BusinessEnterInfo',
      component: BusinessEnterInfo,
      name: '生产企业详情',
      meta: {
        functionName: '基础信息#生产企业',
      },
    },
    {
      path: 'ContractValid',
      component: ContractValid,
      name: '合同有效期设置',
      meta: {
        functionName: '基础信息#合同有效期设置',
      },
    },
    {
      path: 'DeliverTime',
      component: DeliverTime,
      name: '点配送事件设置',
      meta: {
        functionName: '基础信息#点配送时间设置',
      },
    },
    {
      path: 'ChooseDeliverTime',
      component: ChooseDeliverTime,
      name: '卖方补充配送时间设置',
      meta: {
        functionName: '基础信息#卖方补充配送时间设置',
      },
    },
    {
      path: 'ChooseDeliverTime/Edit',
      component: ChooseDeliverTimeEdit,
      name: '卖方补充配送时间设置编辑',
      meta: {
        functionName: '基础信息#卖方补充配送时间设置',
      },
    },
    {
      path: 'CoverRate',
      component: CoverRate,
      name: '覆盖率管理',
      meta: {
        functionName: '基础信息#覆盖率管理',
      },
    },
    {
      path: 'Notice',
      component: Notice,
      name: '公告管理',
      meta: {
        functionName: '基础信息#公告管理',
      },
    },
    {
      path: 'NoticeList',
      component: NoticeList,
      name: '公告列表',
      meta: {
        functionName: '基础信息#公告列表',
      },
    },
    {
      path: 'NoticeList/Edit',
      component: Edit,
      name: '公告列表编辑',
      meta: {
        functionName: '基础信息#公告列表',
      },
    },
    {
      path: 'Signature',
      component: Signature,
      name: '印章管理',
      meta: {
        functionName: '基础信息#印章管理',
      },
    },
  ],
};

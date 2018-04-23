const state = {
  config: {},
  breadCrumb: [
    {
      path: '/',
      name: '首页',
    },
  ],
  principal: [],
  menuList: [],
  authList: [],
  resourcesList: null,
  gpoId: null,
  gpoOptions: [],
  projectOptions: [],
  projectId: null,
  status: null,
  resourcesNow: {},
};

// getters
const getters = {
  getConfig: (state) => state.config,
  getBreadCrumb: (state) => state.breadCrumb,
  getPrincipal: (state) => state.principal,
  getMenuList: (state) => state.menuList,
  getAuthList: (state) => state.authList,
  getResourcesList: (state) => state.resourcesList,
  getGpoId: (state) => state.gpoId,
  gpoOptions: (state) => state.gpoOptions,
  projectOptions: (state) => state.projectOptions,
  getProjectId: (state) => state.projectId,
  status: (state) => state.status,
  getResourcesNow: (state) => state.resourcesNow,
};

const actions = {};

// mutations
const mutations = {
  BreadCrumb_Update(state, data) {
    state.breadCrumb = data;
  },
  principal(state, data) {
    state.principal = data;
  },
  menuList(state, data) {
    state.menuList = data;
  },
  authList(state, data) {
    state.authList = data;
  },
  resourcesList(state, data) {
    state.resourcesList = data;
  },
  config(state, data) {
    state.config = data;
  },
  gpoId(state, data) {
    state.gpoId = data;
  },
  gpoOptions(state, data) {
    state.gpoOptions = data;
  },
  projectOptions(state, data) {
    state.projectOptions = data;
  },
  projectId(state, data) {
    state.projectId = data;
  },
  status(state, data) {
    state.status = data;
  },
  setResourcesNow(state, data) {
    state.resourcesNow = data;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

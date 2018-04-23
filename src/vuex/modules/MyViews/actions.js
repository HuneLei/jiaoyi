import * as types from './types.js'

export default{
  TableHeightRun: ({
    commit
  }, data) => {
    commit(types.TABLEHEIGHTRUN, data)
  },
}

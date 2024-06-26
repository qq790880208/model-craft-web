const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  labelrole: state => state.user.labelrole,
  name: state => state.user.name,
  descr: state => state.user.descr,
  avatar: state => state.user.avatar,
  menus: state => state.user.menus,
  roles: state => state.user.roles,
  role: state => state.user.role,
  permission_routes: state => state.permission.routes,
  userid: state => state.user.userid,
  password: state => state.user.password,
  authority: state => state.user.authority,
  uuid: state => state.data.uuid,
  type: state => state.data.type,
  dirPath: state => state.data.dirPath,
  predictcontrol: state => state.data.predictcontrol,
  register: state => state.user.register,
  dataSet: state => state.user.dataSet
}
export default getters

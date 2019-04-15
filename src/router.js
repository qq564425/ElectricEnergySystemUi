import Vue from 'vue'
import Router from 'vue-router'

function route (path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    components: require(`./pages/${file}.vue`)
  }
}

Vue.use(Router)

const router = new Router({
  base: __dirname,
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    route('/', 'Login', '登录'),
    route('/Main', 'Main', "主界面", [
      route('/Department', 'Department', '部门管理'),
      route('/User', 'User', '用户管理'),
      route('/Role', 'Role', '角色管理'),
      route('/Permission', 'Permission', '权限管理'),
      route('/Menu', 'Menu', '菜单管理'),
      route('/Test', 'Test', '测试666'),
    ])
  ]
})

router.beforeEach((to, from, next) => {
  if(to.path === '/') {
     next() 
  } 
  else {   
      if(sessionStorage.getItem('loginToken') !== 'qq564425') {
        next({ path: '/' })
      }
    else { 
      next() 
    }
  }
})

export default router

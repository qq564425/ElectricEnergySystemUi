<template>
  <a-layout id="components-layout-demo-custom-trigger">
    <a-layout-sider 
    :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }"
    :trigger="null"
    collapsible
    breakpoint="lg"
    v-model="collapsed">
      <div class="logo"></div>
      <a-menu 
         theme="dark" 
         mode="inline" 
         @click="handleClick"
         :defaultSelectedKeys="index">
        <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="setting" /><span>权限管理子系统</span></span>
          <a-menu-item key="1">部门管理</a-menu-item>
          <a-menu-item key="2">用户管理</a-menu-item>
          <a-menu-item key="3">角色管理</a-menu-item>
          <a-menu-item key="4">权限管理</a-menu-item>
          <a-menu-item key="5">菜单管理</a-menu-item>
          <a-menu-item key="6">test</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout :style="layoutStyle">
      <a-layout-header :style="{ background: '#5CACEE', padding: 0,position: 'fixed',zIndex: 1,width:'100%' }">
       <font color="#fff">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="()=> collapsed = !collapsed"
        />
        <a-avatar icon="user" style="margin-left:81%"/>
        <span>狡猾</span>
      </font> 
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial',marginTop:'5%'}">
        <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
            <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        能源管理系统 ©2019 Created by WWW
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
export default {
  data(){
    return {
      collapsed: false,
      layoutStyle:{ marginLeft: '200px' },
      index:[sessionStorage.getItem('key') == null?'1':sessionStorage.getItem('key')]
    }
  },

  methods: {
     handleClick (e) {
       sessionStorage.setItem("key",e.key);
      if(e.key == '1'){
         this.$router.push({path: '/Department'});
      }else if(e.key == '2'){
         this.$router.push({path: '/User'});
      }else if(e.key == '3'){
         this.$router.push({path: '/Role'});
      }else if(e.key == '4'){
         this.$router.push({path: '/Permission'});
      }else if(e.key == '5'){
         this.$router.push({path: '/Menu'});
      }else if(e.key == '6'){
         this.$router.push({path: '/Test'});
      }
    },  

    fetch(){
         console.log(this.$route.path);
         sessionStorage.setItem("path",this.$route.path);
       }
  },

  watch: {
    collapsed(newval,oldval){
      if(newval){
         this.layoutStyle.marginLeft = '80px';
      }else{
         this.layoutStyle.marginLeft = '200px'
      }
    },
    '$route':'fetch'
  },

  created() {
      this.$router.push({path: sessionStorage.getItem('path') == null?'/Department':sessionStorage.getItem('path')});
    },
}
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color .3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255,255,255,.2);
  margin: 16px;
}
</style>

<template>
<div>
    <div :style="{'backgroundImage': 'url(' + bg + ')','height':'100%','width':'100%','position': 'absolute','minHeight': '100%'}">
      <div style="margin-top:16%;width:100%;height:400px">
        <div style="width:20%;margin-left:42%;height:400px">
          <div class="form_title">
            欢迎使用能源管理系统
            <p>Welcome to use energy management system</p>
          </div>
          <a-form
            id="components-form-demo-normal-login"
            :form="form"
            class="login-form"
            @submit="handleSubmit"
          >
            <a-form-item>
              <a-input
                v-decorator="[
                  'userName',
                  { rules: [{ required: true, message: '请输入账号！' }] }
                ]"
                placeholder="账号"
              >
                <a-icon
                  slot="prefix"
                  type="user"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                v-decorator="[
                  'password',
                  { rules: [{ required: true, message: '请输入密码！' }] }
                ]"
                type="password"
                placeholder="密码"
              >
                <a-icon
                  slot="prefix"
                  type="lock"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-checkbox
                v-decorator="[
                  'remember',
                  {
                    valuePropName: 'checked',
                    initialValue: true,
                  }
                ]"
              >
                <font color="#fff">记住我</font>
              </a-checkbox>
              <a-button
                id="login"
                type="primary"
                html-type="submit"
                class="login-form-button">
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </div> 
     </div> 
  </div>
</div>
</template>

<script>
import Bg from '../assets/back2.jpg';
export default {
  data () {
    return {
      bg:Bg
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if(values.userName == 'admin'&&values.password=='123'){
             sessionStorage.setItem("loginToken",'qq564425');
             this.$router.replace('/Main')
          }
        }
      });
    },
  },
};
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}

.form_title{
  color:#fff;
  font-size: 35px;
  margin-left:0px;
  height:120px
}

.form_title p{
  font-size:10px;
  margin-left:65px;
}
</style>
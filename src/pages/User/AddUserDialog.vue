<template>
    <div>
        <a-modal 
          title="添加用户"
          v-model="addUserVisible"
          @ok="userConfirm"
          @cancel="userAddCancel">
            <a-form :form="form">
                <a-form-item
                style="width:80%;margin-left:12%"
                label="所在部门"
                >
                    <a-popover
                        title="部门树"
                        trigger="click"
                        v-model="visible"
                        placement="rightBottom"
                    >   
                        <template slot="content">
                            <div>
                                <addDepTree @changeFormValue="changeFormValue" @hide="hide"></addDepTree>
                            </div> 
                        </template>
                        <a @click="hide" slot="content">关闭</a>
                        <a-input
                        v-decorator="[
                        'deptname',
                        {rules: [{ required: true, message: '请选择用户所在部门' }]}
                        ]"
                        placeholder="请选择用户所在部门"
                        readonly="readonly"
                    />
                    </a-popover>
                </a-form-item>

                <a-form-item
                style="width:80%;margin-left:12%"
                label="dep"
                v-show = "false"
                >
                <a-input
                    v-decorator="[
                    'dep',
                    {rules: []}
                    ]"
                    placeholder="Please input your nickname"
                />
                </a-form-item>

                <a-form-item
                style="width:80%;margin-left:12%"
                label="password"
                v-show = "false"
                >
                <a-input
                    v-decorator="[
                    'password',
                    {rules: []}
                    ]"
                    placeholder="Please input your nickname"
                />
                </a-form-item>

                <a-form-item
                style="width:80%;margin-left:12%"
                label="部门名称"
                >
                <a-input
                    v-decorator="[
                    'account',
                    {rules: [{ required: true, message: '请输入账号' }]}
                    ]"
                    placeholder="请输入账号"
                />
                </a-form-item>
            </a-form>
        </a-modal >
    </div>
</template>

<script>
import {BaseURL} from '../../api/config.js';
import addDepTree from '../Department/AddDepTree.vue';
    export default {
        props: ['dialogFormVisible'],
        data() {
            return {
                //popup可见性
                addpopvisible: false,
                form: this.$form.createForm(this),
                visible: false,
            }
        },

        methods: {
            //取消添加用户
            userAddCancel(){
                this.changeFormValue('','','');
                 this.$emit('closeUserAddDialog', false)
            },

            //确认添加用户
            userConfirm(){
                let that = this;
                this.form.validateFields((err, values) => {
                values.dep = parseInt(values.dep);
                if (!err) {
                    that.$ajax.post
                        (
                            `${BaseURL}/user/create`,
                            that.$qs.stringify(values)
                        )
                        .then(function(res){
                            if(res.data.ok){
                              that.$message.success(res.data.msg);
                              that.$emit('reLoadData');
                            }else{
                              that.$message.warning(res.data.msg);
                            }
                            that.userAddCancel();
                        },function(){
                            console.log('failed');
                        });
                  }
               });
            },

            //隐藏popover
            hide () {
              this.visible = false
            },

            //改变表单值
            changeFormValue(depname,dep,account){
                 this.form.setFieldsValue({
                    deptname: depname,
                    dep: dep,
                    password:  '000000',
                    account: account
                });
            }
            
        },

        watch:{
            // addUserVisible: function(newval, oldval){
            //     if(newval){
            //         this.loadAddDeptTreeData();
            //     }
            // }
        },

        computed: {
            addUserVisible: {
                get: function () {
                    return this.dialogFormVisible;
                },
                set: function (newValue) {

                }
            },
        },

        components: {
            addDepTree
        }
    }

    //根据id初始化树形控件
    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }
</script>
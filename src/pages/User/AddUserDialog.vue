<template>
    <div>
        <!-- <el-popover
                ref="popoverAddUser"
                placement="bottom-start"
                width="300"
                trigger="click"
                v-model="addpopvisible"
        >
            <div style="height:600px;overflow:auto">
                <ul id="userAddtree" class="ztree"></ul>
            </div>
        </el-popover> -->

        <!-- 增加用户 -->
        <!-- <el-dialog 
          :visible.sync="addUserVisible" 
          :show-close="false" 
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
            <div slot="title" class="dialog-title">
                <span style="font-weight:bold;font-size:1.1em">添加用户</span>
                <el-form :model="userAddform" :rules="rules" ref="userAddform">
                    <el-form-item label="用户部门" style="width:60%;margin-left:20%" prop="deptname">
                        <el-input v-model="userAddform.deptname" v-popover:popoverAddUser readonly>
                            <el-button slot="prepend" icon="menu" v-popover:popoverAddUser></el-button>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="账户" style="width:60%;margin-left:20%" prop="account">
                        <el-input v-model="userAddform.account" placeholder="请输入账户" ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userAddCancel">关闭</el-button>
                <el-button type="primary" @click="userConfirm">保存</el-button>
            </div>
        </el-dialog> -->

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
                        placement="bottom"
                    >   
                        <template slot="content">
                            <div style="height:300px;width:300px;overflow:auto">
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
                
                <a-form-item
               
                >
                <a-button
                    type="primary"
                    @click="check"
                >
                    Check
                </a-button>
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
                //添加用户表单
                userAddform:{
                    dep:'',//部门id
                    deptname:'',//部门名称
                    account:'',//用户名
                    password:'',//密码
                    rpsw:'',//重复密码
                },

                //表单验证规则
                rules:{
                    deptname:[
                        { required: true, message: '必填', trigger: 'change'},
                    ],
                    account:[
                        { required: true, message: '必填', trigger: 'blur'},
                    ]
                },

                //popup可见性
                addpopvisible: false,
                form: this.$form.createForm(this),
                visible: false,
            }
        },

        methods: {
            //取消添加用户
            userAddCancel(){
                this.changeFormValue('','');
                 this.$emit('closeUserAddDialog', false)
            },

            //确认添加用户
            userConfirm(){
                let that = this;
                this.userAddform.dep = parseInt(this.userAddform.dep);
                this.userAddform.password='000000';
                this.$refs['userAddform'].validate((valid) => {
                    if (valid) {
                        this.$ajax.post
                        (
                            `${BaseURL}/user/create`,
                            that.$qs.stringify(that.userAddform)
                        )
                        .then(function(res){
                            if(res.data.msg == 'Login Required'){
                                that.changeShowNaviPage(false);
                                that.$confirm('您的账号登录过期或已在别处登录，请重新登录！', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                                }).then(() => {
                                
                                }).catch(() => {
                                            
                                });
                                return
                            }
                            that.$message('注册成功');
                            that.resetForm('userAddform');
                            that.$emit('closeUserAddDialog', true);
                        },function(){
                            console.log('failed');
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //隐藏popover
            hide () {
              this.visible = false
            },

            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            //添加用户树形控件check响应
            userAddtreeOnCheck(event, treeId, treeNode){
                this.userAddform.deptname = treeNode.name;
                this.userAddform.dep = treeNode.id;
                this.addpopvisible = false;
            },

            //载入添加部门的树形控件
            loadAddDeptTreeData(id){
                let that = this;
                this.$ajax.get
                (
                    `${BaseURL}/main/department/get-all-departments`
                ).then(function(res)
                    {
                        if(res.data.msg == 'Login Required'){
                            that.changeShowNaviPage(false);
                            that.$confirm('您的账号登录过期或已在别处登录，请重新登录！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                            
                            }).catch(() => {
                                        
                            });
                            return
                        }
                        let treeData = res.data.data;
                        if(id!=undefined)
                        {
                            treeData.forEach((item) => {
                                if(item.id == id)
                                    item.checked = true;
                            })
                        }

                        let setting = {
                            data: {
                                simpleData: {
                                    enable: true
                                },
                            },

                            check: {
                                enable: true,
                                chkStyle: "radio",
                                radioType: "all",
                            },

                            callback: {
                                onCheck: that.userAddtreeOnCheck
                            },
                        };
                        initializeTree('userAddtree', setting, treeData);
                    },

                    function(){
                        console.log('failed');
                    })
            },

            check  () {
                this.form.validateFields((err, values) => {
                if (!err) {
                    console.log(values);
                  }
               });
            },

            //改变表单值
            changeFormValue(depname,dep){
                 this.form.setFieldsValue({
                    deptname: depname,
                    dep: dep
                });
            }
            
        },

        watch:{
            addUserVisible: function(newval, oldval){
                if(newval){
                    this.loadAddDeptTreeData();
                }
            }
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
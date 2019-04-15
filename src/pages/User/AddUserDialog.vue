<template>
    <div>
        <el-popover
                ref="popoverAddUser"
                placement="bottom-start"
                width="300"
                trigger="click"
                v-model="addpopvisible"
        >
            <div style="height:600px;overflow:auto">
                <ul id="userAddtree" class="ztree"></ul>
            </div>
        </el-popover>

        <!-- 增加用户 -->
        <el-dialog 
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

                    <!-- <el-form-item label="密码" style="width:60%;margin-left:20%" prop="password">
                        <el-input v-model="userAddform.password" type="password" placeholder="请输入密码" ></el-input>
                    </el-form-item>

                    <el-form-item label="确认密码" style="width:60%;margin-left:20%" prop="rpsw">
                        <el-input v-model="userAddform.rpsw" type="password" placeholder="请再次输入密码" ></el-input>
                    </el-form-item> -->
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userAddCancel">关闭</el-button>
                <el-button type="primary" @click="userConfirm">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {BaseURL} from '../../api/config.js'
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
                    ],
                    // password:[
                    //     { required: true, message: '必填', trigger: 'blur'},
                    // ],
                    // rpsw:[
                    //     { validator: (rule, value, callback) => {
                    //         if (value === '') {
                    //             callback(new Error('请再次输入密码'));
                    //         } else if (value !== this.userAddform.password) {
                    //             callback(new Error('两次输入密码不一致!'));
                    //         } else {
                    //             callback();
                    //         }
                    //     }, trigger: 'change' }
                    // ],
                },

                //popup可见性
                addpopvisible: false,
            }
        },

        methods: {
            //取消添加用户
            userAddCancel(){
                this.resetForm('userAddform');
                this.$emit('closeUserAddDialog', false);
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
        }
    }

    //根据id初始化树形控件
    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }
</script>
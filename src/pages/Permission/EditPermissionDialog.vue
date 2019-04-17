<template>
    <div>
        <el-popover
                ref="popoverEditPermission"
                placement="bottom-start"
                width="300"
                trigger="click"
                v-model="popvisible">
            <div style="height:600px;overflow:auto">
                <ul id="permissionTree3" class="ztree"></ul>
            </div>
        </el-popover>

        <el-dialog 
          :visible.sync="editPermissionVisible" 
          :show-close="false" 
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
            <div slot="title" class="dialog-title">
                <span style="font-weight:bold;font-size:1.1em">编辑权限</span>
                <el-form :model="permissionEditform" :rules="rules" ref="permissionEditform">
                    <el-form-item label="上级权限" style="width:60%;margin-left:20%" prop="parentName">
                        <el-input v-model="permissionEditform.parentName" v-popover:popoverEditPermission readonly>
                            <el-button slot="prepend" icon="el-icon-menu" v-popover:popoverEditPermission></el-button>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="权限key" style="width:60%;margin-left:20%" prop="key">
                        <el-input v-model="permissionEditform.key"></el-input>
                    </el-form-item>

                    <el-form-item label="权限名称" style="width:60%;margin-left:20%" prop="name">
                        <el-input v-model="permissionEditform.name"></el-input>
                    </el-form-item>

                    <el-form-item label="排序" style="width:60%;margin-left:20%" prop="order">
                        <el-input v-model.number="permissionEditform.order"></el-input>
                    </el-form-item>

                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="permissionEditCancel">取 消</el-button>
                <el-button type="primary" @click="permissionEditConfirm">确 定</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
import {BaseURL} from '../../api/config'
    export default {
        props: ['dialogFormVisible','currentItem'],
        data() {
            return {
                //权限编辑的表单
                permissionEditform: {
                    id:'',
                    parentName: '',
                    parentId: '',
                    name: '',
                    key: '',
                    order: '',
                },

                //树形控件所在的弹出层可见性
                popvisible: false,

                //表单验证规则
                rules: {
                    parentName: [
                        {required: true, message: '请选择上级权限', trigger: 'change'},
                    ],

                    name: [
                        {required: true, message: '请输入权限名称', trigger: 'blur'},
                    ],

                    key: [
                        {required: true, message: '请输入权限key', trigger: 'blur'},
                    ],

                    order: [
                        {required: true, message: '请输入排序'},
                        {type: 'number', message: '排序必须为数字值'}
                    ],
                },
            }
        },

        methods: {
            //取消编辑权限
            permissionEditCancel(){
                this.$emit('closeEditPermissionDialog', false)
            },

            //确认编辑权限
            permissionEditConfirm(){
                let that = this;
                this.permissionEditform.parentId = parseInt(this.permissionEditform.parentId);
                this.permissionEditform.order = parseInt(this.permissionEditform.order);
                this.$refs['permissionEditform'].validate((valid) => {
                    if (valid) {
                        that.$ajax.post
                        (
                            `${BaseURL}/main/permission/edit`,
                            that.$qs.stringify(this.permissionEditform)
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
                                    return;
                                }
                                else if(res.data.msg == '更新权限成功') {
                                    that.$message('编辑权限成功');
                                    that.resetForm('permissionEditform');
                                    that.loadAddTree();
                                    that.$emit('closeEditPermissionDialog', true)
                                }
                            },function(){
                                console.log('failed');
                                that.resetForm('permissionEditform');
                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //载入编辑权限的对话框里面的树形控件
            loadAddTree(id){
                let that = this;
                this.$ajax.get
                (
                    `${BaseURL}/main/get-all-permissions`
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
                            return;
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
                                onCheck: that.zTreeOnCheck
                            },
                        };
                        initializeTree('permissionTree3', setting, treeData);
                    },
                    function(){
                        console.log('failed');
                    });
            },

            //添加和修改权限对话框中的树形控件选取响应
            zTreeOnCheck(event, treeId, treeNode) {
                this.permissionEditform.parentName = treeNode.name;
                this.permissionEditform.parentId = treeNode.id;
                this.popvisible = false;
            },

            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },

        watch: {
            editPermissionVisible: function (newval, oldval) {
                if(newval){
                    this.loadAddTree(this.currentItem.parentId);
                }
            },

            currentItem: function (newval, oldval) {
                if(newval) {
                    this.permissionEditform = {
                        id: newval.id,
                        parentName: newval.parentName == undefined ? '权限' : newval.parentName,
                        parentId: newval.parentId,
                        name: newval.name,
                        key: newval.key,
                        order: newval.order
                    };
                }
            },
        },

        computed: {
            editPermissionVisible: {
                get: function () {
                    return this.dialogFormVisible;
                },
                set: function (newValue) {

                }
            },
        }
    }

    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }
</script>
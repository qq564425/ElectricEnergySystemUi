<template>
    <div>
        <el-popover
                ref="popoverAddRoleForUser"
                placement="bottom-start"
                width="300"
                trigger="click"
                v-model="popvisible2">
            <div style="height:600px;overflow:auto">
                <ul id="rolestree" class="ztree"></ul>
            </div>
        </el-popover>

        <!-- 分配角色 -->
        <el-dialog 
          :visible.sync="addRolesVisible" 
          :show-close="false" 
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
            <div slot="title" class="dialog-title">
                <span style="font-weight:bold;font-size:1.1em">分配角色</span>
                <el-form :model="useraddRolesform"  ref="useraddRolesform">
                    <el-form-item label="用户角色" style="width:60%;margin-left:20%" prop="rolesname">
                        <el-input v-model="useraddRolesform.rolesname" v-popover:popoverAddRoleForUser readonly>
                            <el-button slot="prepend" icon="el-icon-menu" v-popover:popoverAddRoleForUser></el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userAddRoleCancel">关闭</el-button>
                <el-button type="primary" @click="userAddRoleConfirm">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {BaseURL} from '../../api/config'
    export default {
        props: ['dialogFormVisible', 'currentItem'],
        data() {
            return {
                //分配角色表单
                useraddRolesform:{
                    userId:'',
                    rolesname:'',//角色名
                    roleArray:[],//角色id
                },

                //角色树形控件所在弹出层可见性
                popvisible2: false,
            }
        },

        methods: {

            //确认分配角色
            userAddRoleConfirm(){
                let that = this;
                this.$ajax.post
                (
                    `${BaseURL}/user/grant`,
                    {
                        userId: that.useraddRolesform.userId,
                        roleStr: that.useraddRolesform.roleArray
                    }
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
                    that.$message('角色分配成功');
                    that.resetForm('useraddRolesform');
                    that.$emit('closeUserAddRoleDialog', true)
                },function(){
                    console.log('failed');
                });
            },

            //取消分配角色
            userAddRoleCancel(){
                this.resetForm('useraddRolesform');
                this.$emit('closeUserAddRoleDialog', false)
            },

            //载入角色树数据
            loadTreeData(arr){
                let that = this;
                this.$ajax.get
                (
                    `${BaseURL}/main/role/get-all-roles`
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
                        let roleTreeData = [];
                        let array = res.data.data;
                        array.forEach((item) => {
                            if(arr.indexOf(item.id) >= 0)
                            {
                                item.checked = true;
                            }
                            roleTreeData.push(item);
                        })

                        let setting = {
                            data: {
                                simpleData: {
                                    enable: true
                                }
                            },
                            check:{
                                enable:true,
                            },
                            callback: {
                                onCheck: that.zTreeOnCheck2
                            }
                        };
                        initializeTree('rolestree', setting, roleTreeData);
                    },
                    function(){
                        console.log('failed');
                    });
            },

            //角色树check响应
            zTreeOnCheck2(event, treeId, treeNode){
                let treeObj = $.fn.zTree.getZTreeObj(treeId);
                let nodes = treeObj.getCheckedNodes(true);
                this.useraddRolesform.rolesname = '';
                this.useraddRolesform.roleArray = [];
                let that = this;
                nodes.forEach((item) => {
                    that.useraddRolesform.rolesname = that.useraddRolesform.rolesname + item.name +',';
                    that.useraddRolesform.roleArray.push(parseInt(item.id));
                })
                this.useraddRolesform.rolesname = this.useraddRolesform.rolesname.slice(0, -1);
            },

            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },

        watch:{
            addRolesVisible: function (newval, oldval) {
                if(newval){
                    this.loadTreeData(this.currentItem.roleIds.split(","));
                }
            },

            currentItem: function(newval, oldval){
                if(newval){
                    let userIds=[];
                    newval.roleIds.split(",").forEach((item) => {
                        userIds.push(parseInt(item));
                    })
                    this.useraddRolesform = {
                        userId: newval.id,
                        rolesname: newval.roleNames,//角色名
                        roleArray: userIds,//角色id
                    }
                }
            }
        },

        computed: {
            addRolesVisible: {
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
        let treeObj = $.fn.zTree.getZTreeObj("rolestree");
        console.log(treeData);
        var disabledNode = treeObj.getNodeByParam("name", "开发者角色");
        if(window.sessionStorage.getItem('USER_NAME') !== 'developer'){
            treeObj.setChkDisabled(disabledNode, true);  
        }
    }
</script>
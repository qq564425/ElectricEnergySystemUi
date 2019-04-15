<template>
    <div>
        <el-dialog 
          :visible.sync="roleGrantVisible" 
          :show-close="false" 
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
            <div slot="title" class="dialog-title">
                <span style="font-weight:bold;font-size:1.1em">菜单授权</span>
                <div style="padding-left:25%;padding-top:20px;height:600px;overflow:auto">
                    <span id="roleTree1" class="ztree"></span>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="closeRoleGrant">关闭</el-button>
                <el-button @click="roleGrantConfirm">保存</el-button>
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

            }
        },

        methods: {
            //关闭授权对话框
            closeRoleGrant(){
                this.$emit('closeRoleGrantDialog');
            },

            //确认授权
            roleGrantConfirm(){
                let treeObj = $.fn.zTree.getZTreeObj("roleTree1");
                let nodes = treeObj.getCheckedNodes(true);
                let grantArray = [];
                nodes.forEach((item) => {
                    grantArray.push(parseInt(item.id));
                });
                let that = this;
                this.$ajax.post
                (
                    `${BaseURL}/main/role/grant`,
                    {
                        "id": that.currentItem.id,
                        "peridStr": grantArray
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
                    that.$message('授权成功');
                    that.$emit('closeRoleGrantDialog');
                },function(){
                    console.log('failed');
                });
            },

            //根据id初始化当前所要授权的角色的树形控件
            loadGrantTree(roleId){
                var that = this;
                this.$ajax.get
                (
                    `${BaseURL}/main/get-role-check-permissions?`+'roleId=' + roleId
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
                        let ChecktreeData = res.data.data;
                        let setting = {
                            data: {
                                simpleData: {
                                    enable: true
                                },
                            },

                            check: {
                                enable: true,
                                chkStyle: "checkbox",
		                        chkboxType: {"N": "s" }
                            },

                        };
                        initializeTree('roleTree1', setting, ChecktreeData)
                    },
                    function(){
                        console.log('failed');
                    });
            },
        },

        watch: {
            currentItem: function (newval, oldval) {
                if(newval) {
                    this.loadGrantTree(newval.id)
                }
            },
        },

        computed: {
            roleGrantVisible: {
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
        let treeObj = $.fn.zTree.getZTreeObj("roleTree1");
        var disabledNode = treeObj.getNodeByParam("name", "删除菜单");
        var disabledNode2 = treeObj.getNodeByParam("name", "菜单添加");
        var disabledNode3 = treeObj.getNodeByParam("name", "菜单编辑");
        var disabledNode4 = treeObj.getNodeByParam("name", "菜单批量删除");
        var disabledNode5 = treeObj.getNodeByParam("name", "权限新增");
        var disabledNode6 = treeObj.getNodeByParam("name", "编辑权限");
        var disabledNode7 = treeObj.getNodeByParam("name", "删除权限");
        var disabledNode8 = treeObj.getNodeByParam("name", "权限批量删除");
        if(window.sessionStorage.getItem('USER_NAME') !== 'developer'){
            treeObj.setChkDisabled(disabledNode, true); 
            treeObj.setChkDisabled(disabledNode2, true); 
            treeObj.setChkDisabled(disabledNode3, true); 
            treeObj.setChkDisabled(disabledNode4, true); 
            treeObj.setChkDisabled(disabledNode5, true); 
            treeObj.setChkDisabled(disabledNode6, true); 
            treeObj.setChkDisabled(disabledNode7, true); 
            treeObj.setChkDisabled(disabledNode8, true); 
        }
    }
</script>
<template>
    <div>
        <el-dialog 
          :visible.sync="rolecheckPermissionVisible" 
          :show-close="false" 
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
            <div slot="title" class="dialog-title">
                <span style="font-weight:bold;font-size:1.1em">查看权限</span>
                <div style="padding-left:25%;padding-top:20px;height:600px;overflow:auto">
                    <span id="roleTree2" class="ztree"></span>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="closeCheck">关闭</el-button>
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
            //根据id初始化当前所要查看的角色的树形控件
            loadCheckTree(roleId){
                let that = this;
                that.$ajax.get
                (
                    `${BaseURL}/main/get-role-show-permissions?`+'roleId=' + roleId
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
                            },
                        };
                        initializeTree('roleTree2', setting, ChecktreeData)
                    },
                    function(){
                        console.log('failed');
                    });
            },

            //关闭查看
            closeCheck(){
                this.$emit('closeCheckRoleDialog')
            }
        },

        watch: {
            currentItem: function (newval, oldval) {
                if(newval) {
                    this.loadCheckTree(newval.id)
                }
            },
        },

        computed: {
            rolecheckPermissionVisible: {
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
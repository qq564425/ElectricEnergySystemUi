<template>
    <div>
        <el-popover
                ref="popoverAddUserDepartment"
                placement="bottom-start"
                width="300"
                trigger="click"
                v-model="popvisible">
            <div style="height:600px;overflow:auto">
                <ul id="userdepttree2" class="ztree"></ul>
            </div>
        </el-popover>

        <!-- 分配部门 -->
        <el-dialog 
          :visible.sync="addUserDepartmentVisible" 
          :show-close="false" 
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
            <div slot="title" class="dialog-title">
                <span style="font-weight:bold;font-size:1.1em">分配部门</span>
                <el-form :model="editDeptform"  ref="editDeptform">
                    <el-form-item label="用户部门" style="width:60%;margin-left:20%" prop="deptname">
                        <el-input v-model="editDeptform.deptname" v-popover:popoverAddUserDepartment readonly>
                            <el-button slot="prepend" icon="el-icon-menu" v-popover:popoverAddUserDepartment></el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="userAddDepartmentCancel">关闭</el-button>
                <el-button type="primary" @click="userAddDepartmentConfirm">保存</el-button>
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

                //弹出层可见性
                popvisible: false,

                //分配部门表单
                editDeptform:{
                    deptname:'',
                    depId:'',
                    userId:'',
                },
            }
        },

        methods: {
            //取消分配部门
            userAddDepartmentCancel(){
                this.resetForm('editDeptform');
                this.$emit('closeUserAddDepartmentDialog', false);
            },

            //确认分配部门
            userAddDepartmentConfirm(){
                let that = this;
                that.$refs['editDeptform'].validate((valid) => {
                    if (valid) {
                        that.$ajax.post
                        (
                            `${BaseURL}/user/edit-user-dep`,
                            that.$qs.stringify(that.editDeptform)
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
                            that.$message('分配部门成功');
                            that.resetForm('editDeptform');
                            that.$emit('closeUserAddDepartmentDialog', true);
                        },function(){
                            console.log('failed');
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //载入添加和修改部门的树形控件
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
                        initializeTree('userdepttree2', setting, treeData);
                    },

                    function(){
                        console.log('failed');
                    })
            },

            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            //添加用户树形控件check响应
            userAddtreeOnCheck(event, treeId, treeNode){
                this.editDeptform.deptname = treeNode.name;
                this.editDeptform.depId = treeNode.id;
                this.popvisible = false;
            },
        },

        watch:{
            addUserDepartmentVisible: function (newval, oldval) {
                if(newval){
                    this.loadAddDeptTreeData(this.currentItem.dep_id);
                }
            },

            currentItem: function(newval, oldval){
                if(newval){
                    this.editDeptform = {
                        userId: newval.id,
                        depId: newval.dep_id,
                        deptname: newval.dep_name,
                    }
                    this.loadAddDeptTreeData();
                }
            }
        },

        computed: {
            addUserDepartmentVisible: {
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
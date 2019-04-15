<template>
    <div>
        <el-dialog 
          :visible.sync="addRoleVisible" 
          :show-close="false" 
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
            <div slot="title" class="dialog-title">
                <span style="font-weight:bold;font-size:1.1em">添加角色</span>
                <el-form :model="roleAddform" :rules="rules" ref="roleAddform">
                    <el-form-item label="角色键值" label-width="120" prop="key">
                        <el-input v-model="roleAddform.key" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称" label-width="120" prop="name">
                        <el-input v-model="roleAddform.name" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleAddCancel">取 消</el-button>
                <el-button type="primary" @click="roleAddConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {BaseURL} from '../../api/config'
    export default {
        props: ['dialogFormVisible'],
        data() {
            return {

                //角色添加表单
                roleAddform: {
                    id:'',
                    name:'',
                    key:'',
                },

                //表单验证规则
                rules: {
                    name: [
                        { required: true, message: '请输入角色名称', trigger: 'change' },
                    ],
                    key: [
                        { required: true, message: '请输入角色键值', trigger: 'change' },
                    ],
                },
            }
        },

        methods: {

            //取消添加角色
            roleAddCancel(){
                this.$emit('closeAddRoleDialog', false)
                this.resetForm('roleAddform');
            },

            //确认添加角色
            roleAddConfirm(){
                let that = this;
                this.$refs['roleAddform'].validate((valid) => {
                    if (valid) {
                        that.$ajax.post
                        (
                            `${BaseURL}/main/role/create`,
                            that.$qs.stringify(this.roleAddform)
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
                            that.$message('创建角色成功');
                            that.resetForm('roleAddform');
                            that.$emit('closeAddRoleDialog', true)
                        },function(){
                            console.log('failed');
                            that.resetForm('roleAddform');
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
        },

        computed: {
            addRoleVisible: {
                get: function () {
                    return this.dialogFormVisible;
                },
                set: function (newValue) {

                }
            },
        }
    }
</script>
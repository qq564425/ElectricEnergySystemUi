<template>
    <div>
        <el-dialog  
          :visible.sync="editRoleVisible" 
          :show-close="false" 
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
            <div slot="title" class="dialog-title">
                <span style="font-weight:bold;font-size:1.1em">编辑角色</span>
                <el-form :model="roleEditform" :rules="rules" ref="roleEditform">
                    <el-form-item label="角色键值" label-width="120" prop="key">
                        <el-input v-model="roleEditform.key" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称" label-width="120" prop="name">
                        <el-input v-model="roleEditform.name" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleEditCancel">取 消</el-button>
                <el-button type="primary" @click="roleEditConfirm">确 定</el-button>
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

                //角色添加表单
                roleEditform: {
                    id:'',
                    name:'',
                    key:''
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

            //取消编辑角色
            roleEditCancel(){
                this.$emit('closeEditRoleDialog', false)
            },

            //确认编辑角色
            roleEditConfirm(){
                let that = this;
                this.$refs['roleEditform'].validate((valid) => {
                    if (valid) {
                        that.$ajax.post
                        (
                            `${BaseURL}/main/role/edit`,
                            that.$qs.stringify(this.roleEditform)
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
                                that.$message('编辑角色成功');
                                that.resetForm('roleEditform');
                                that.$emit('closeEditRoleDialog', true)
                            },function(){
                                console.log('failed');
                                that.resetForm('roleEditform');
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

        watch: {
            currentItem: function (newval, oldval) {
                if(newval) {
                    this.roleEditform = {
                        id: newval.id,
                        name: newval.name,
                        key: newval.key
                    };
                }
            },
        },

        computed: {
            editRoleVisible: {
                get: function () {
                    return this.dialogFormVisible;
                },
                set: function (newValue) {

                }
            },
        }
    }
</script>
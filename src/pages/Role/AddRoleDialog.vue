<template>
    <div>
        <!-- <el-dialog 
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
        </el-dialog> -->
        <a-modal 
          title="添加角色"
          v-model="addRoleVisible"
          @ok="roleAddConfirm"
          @cancel="roleAddCancel">
            <a-form :form="form">
                <a-form-item
                style="width:80%;margin-left:12%"
                label="角色键值"
                >
                <a-input
                    v-decorator="[
                    'key',
                    {rules: [{ required: true, message: '请输入角色键值' }]}
                    ]"
                    placeholder="请输入角色键值"
                />
                </a-form-item>
                
                <a-form-item
                style="width:80%;margin-left:12%"
                label="角色名"
                >
                <a-input
                    v-decorator="[
                    'name',
                    {rules: [{ required: true, message: '请输入角色名' }]}
                    ]"
                    placeholder="请输入角色名"
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
import {BaseURL} from '../../api/config'
    export default {
        props: ['dialogFormVisible'],
        data() {
            return {
               form: this.$form.createForm(this),
            }
        },

        methods: {

            //取消添加角色
            roleAddCancel(){
                this.$emit('closeAddRoleDialog', false)
                this.changeFormValue('','');
            },

            //确认添加角色
            roleAddConfirm(){
                // let that = this;
                // this.$refs['roleAddform'].validate((valid) => {
                //     if (valid) {
                //         that.$ajax.post
                //         (
                //             `${BaseURL}/main/role/create`,
                //             that.$qs.stringify(this.roleAddform)
                //         )
                //         .then(function(res){
                //             if(res.data.msg == 'Login Required'){
                //                 that.changeShowNaviPage(false);
                //                 that.$confirm('您的账号登录过期或已在别处登录，请重新登录！', '提示', {
                //                 confirmButtonText: '确定',
                //                 cancelButtonText: '取消',
                //                 type: 'warning'
                //                 }).then(() => {
                                
                //                 }).catch(() => {
                                            
                //                 });
                //                 return;
                //              }
                //             that.$message('创建角色成功');
                //             that.resetForm('roleAddform');
                //             that.$emit('closeAddRoleDialog', true)
                //         },function(){
                //             console.log('failed');
                //             that.resetForm('roleAddform');
                //         });
                //     } else {
                //         console.log('error submit!!');
                //         return false;
                //     }
                // });
                let that = this;
                this.form.validateFields((err, values) => {
                if (!err) {
                    that.$ajax.post
                        (
                            `${BaseURL}/main/role/create`,
                            that.$qs.stringify(values)
                        )
                        .then(function(res){
                            if(res.data.ok){
                              that.$message.success(res.data.msg);
                              that.$emit('reLoadData');
                            }else{
                              that.$message.warning(res.data.msg);
                            }
                            that.roleAddCancel();
                        },function(){
                            console.log('failed');
                        });
                  }
               });
            },

             check  () {
                this.form.validateFields((err, values) => {
                if (!err) {
                    console.log(values);
                  }
               });
            },

            //改变表单值
            changeFormValue(key,name){
                 this.form.setFieldsValue({
                    key: key,
                    name: name
                });
            }
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
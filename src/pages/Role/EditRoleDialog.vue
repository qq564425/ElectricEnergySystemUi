<template>
    <div>
        <a-modal 
          title="编辑角色"
          v-model="editRoleVisible"
          @ok="roleEditConfirm"
          @cancel="roleEditCancel">
            <a-form :form="form">
                <a-form-item
                style="width:80%;margin-left:12%"
                label="id"
                v-show = "false"
                >
                <a-input
                    v-decorator="[
                    'id',
                    {rules: []}
                    ]"
                    placeholder="Please input your nickname"
                />
                </a-form-item>

                <a-form-item
                style="width:80%;margin-left:12%"
                label="角色名称"
                >
                <a-input
                    v-decorator="[
                    'name',
                    {rules: [{ required: true, message: '请输入角色名称' }]}
                    ]"
                    placeholder="请输入角色名称"
                />
                </a-form-item>
                
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
            </a-form>
        </a-modal >
    </div>
</template>

<script>
import {BaseURL} from '../../api/config'
    export default {
        props: ['dialogFormVisible', 'currentItem'],
        data() {
            return {
                form: this.$form.createForm(this),
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
                this.form.validateFields((err, values) => {
                if (!err) {
                    that.$ajax.post
                        (
                            `${BaseURL}/main/role/edit`,
                            that.$qs.stringify(values)
                        )
                        .then(function(res){
                            if(res.data.ok){
                              that.$message.success(res.data.msg);
                              that.$emit('reLoadData');
                            }else{
                              that.$message.warning(res.data.msg);
                            }
                            that.roleEditCancel();
                        },function(){
                            console.log('failed');
                        });
                  }
               });

            },

             //改变表单值
            changeFormValue(name,key,id){
                setTimeout(()=>{
                     this.form.setFieldsValue({
                     name: name,
                     key: key,
                     id: id
                  });
                },0)
            },
        },

        watch: {
            currentItem: function (newval, oldval) {
                if(newval) {
                    this.changeFormValue(newval.name,newval.key,newval.id);
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
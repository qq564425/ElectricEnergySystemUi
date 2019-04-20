<template>
    <div>
        <a-modal 
          title="分配部门"
          v-model="addRolesVisible"
          @ok="userAddRoleConfirm"
          @cancel="userAddRoleCancel">
            <a-form :form="form">
                <a-form-item
                style="width:80%;margin-left:12%"
                label="用户角色"
                >
                    <a-popover
                        title="角色树"
                        trigger="click"
                        v-model="visible"
                        placement="rightBottom"
                    >   
                        <template slot="content">
                            <div>
                                <addRoleTree @changeFormValue="changeFormValue" @hide="hide" :selectedRoleIds="selectedRoleIds" ref="child"></addRoleTree>
                            </div> 
                        </template>
                        <a @click="hide" slot="content">关闭</a>
                        <a-input
                        v-decorator="[
                        'roleNames',
                        {rules: [{ required: true, message: '请选择用户角色' }]}
                        ]"
                        placeholder="请选择用户角色"
                        readonly="readonly"
                    />
                    </a-popover>
                </a-form-item>

                <a-form-item
                style="width:80%;margin-left:12%"
                label="roleStr"
                v-show = "false"
                >
                <a-input
                    v-decorator="[
                    'roleStr',
                    {rules: []}
                    ]"
                    placeholder="Please input your nickname"
                />
                </a-form-item>

                 <a-form-item
                style="width:80%;margin-left:12%"
                label="userId"
                v-show = "false"
                >
                <a-input
                    v-decorator="[
                    'userId',
                    {rules: []}
                    ]"
                    placeholder="Please input your nickname"
                />
                </a-form-item>               
            </a-form>
        </a-modal >
    </div>
</template>

<script>
import {BaseURL} from '../../api/config'
import addRoleTree from '../User/AddRoleTree.vue'
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

                form: this.$form.createForm(this),
                visible: false,
            }
        },

        methods: {

            //确认分配角色
            userAddRoleConfirm(){
                let that = this;
                this.form.validateFields((err, values) => {
                let roleIds = [];
                values.roleStr.split(',').forEach((item) => {
                    roleIds.push(parseInt(item));
                 })
                if (!err) {
                    that.$ajax.post
                        (
                            `${BaseURL}/user/grant`,
                            {
                              userId: values.userId,
                              roleStr: roleIds
                           }
                        )
                        .then(function(res){
                            if(res.data.ok){
                              that.$message.success(res.data.msg);
                              that.$emit('reLoadData');
                            }else{
                              that.$message.warning(res.data.msg);
                            }
                            that.userAddRoleCancel();
                        },function(){
                            console.log('failed');
                        });
                  }
               });
            },

            //取消分配角色
            userAddRoleCancel(){
                this.changeFormValue('','');
                this.$emit('closeUserAddRoleDialog', false)
            },

            //隐藏popover
            hide () {
              this.visible = false
            },

            //改变表单值
            changeFormValue(roleStr,roleNames,userId){
                setTimeout(()=>{
                     this.form.setFieldsValue({
                     roleStr: roleStr,
                     roleNames: roleNames,
                     userId: this.currentItem.id
                  });
                },0)
            },
        },

        watch:{
            addRolesVisible: function (newval, oldval) {
                 if(newval){
                     if(this.$refs.child)
                     this.$refs.child.loadTreeData(this.currentItem.roleIds.split(","));
                 }
            },

            currentItem: function(newval, oldval){
                if(newval){
                    this.changeFormValue(newval.roleIds,newval.roleNames);
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

            selectedRoleIds(){
                if(this.currentItem){
                   return this.currentItem.roleIds.split(",");
                }
            }
        },

        components: {
            addRoleTree
        }
    }
</script>
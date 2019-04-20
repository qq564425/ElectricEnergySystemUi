<template>
    <div>
        <a-modal 
          title="分配部门"
          v-model="addUserDepartmentVisible"
          @ok="userAddDepartmentConfirm"
          @cancel="userAddDepartmentCancel">
            <a-form :form="form">
                <a-form-item
                style="width:80%;margin-left:12%"
                label="用户部门"
                >
                    <a-popover
                        title="部门树"
                        trigger="click"
                        v-model="visible"
                        placement="rightBottom"
                    >   
                        <template slot="content">
                            <div>
                                <addDepTree @changeFormValue="changeFormValue" @hide="hide"></addDepTree>
                            </div> 
                        </template>
                        <a @click="hide" slot="content">关闭</a>
                        <a-input
                        v-decorator="[
                        'depname',
                        {rules: [{ required: true, message: '请选择上级部门' }]}
                        ]"
                        placeholder="请选择用户部门"
                        readonly="readonly"
                    />
                    </a-popover>
                </a-form-item>

                 <a-form-item
                style="width:80%;margin-left:12%"
                label="depId"
                v-show = "false"
                >
                <a-input
                    v-decorator="[
                    'depId',
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
import addDepTree from '../User/AddUserDepTree.vue'
    export default {
        props: ['dialogFormVisible', 'currentItem'],
        data() {
            return {

                form: this.$form.createForm(this),
                visible: false,
            }
        },

        methods: {
            //取消分配部门
            userAddDepartmentCancel(){
                this.changeFormValue('');
                this.$emit('closeUserAddDepartmentDialog', false);
            },

            //确认分配部门
            userAddDepartmentConfirm(){
                let that = this;
                this.form.validateFields((err, values) => {
                if (!err) {
                    that.$ajax.post
                        (
                            `${BaseURL}/user/edit-user-dep`,
                            that.$qs.stringify(values)
                        )
                        .then(function(res){
                            if(res.data.ok){
                              that.$message.success(res.data.msg);
                              that.$emit('reLoadData');
                            }else{
                              that.$message.warning(res.data.msg);
                            }
                            that.userAddDepartmentCancel();
                        },function(){
                            console.log('failed');
                        });
                  }
               });
            },
            
            //隐藏popover
            hide () {
              this.visible = false
            },

            //改变表单值
            changeFormValue(depname,depId,userId){
                setTimeout(()=>{
                     this.form.setFieldsValue({
                     depname: depname,
                     depId: depId,
                     userId: this.currentItem.id
                  });
                },0)
            },
        },

        watch:{
            addUserDepartmentVisible: function (newval, oldval) {
                // if(newval){
                //     this.loadAddDeptTreeData(this.currentItem.dep_id);
                // }
            },

            currentItem: function(newval, oldval){
                if(newval){
                    // this.editDeptform = {
                    //     userId: newval.id,
                    //     depId: newval.dep_id,
                    //     deptname: newval.dep_name,
                    // }
                    this.changeFormValue(newval.dep_name,newval.dep_id,newval.id);
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
        },

        components: {
            addDepTree
        }
    }
</script>
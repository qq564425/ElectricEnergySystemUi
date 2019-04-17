<template>
    <div>
        <a-modal 
          title="添加部门"
          v-model="addPermissionVisible"
          @ok="permissionConfirm"
          @cancel="permissionAddCancel">
            <a-form :form="form">
                <a-form-item
                style="width:80%;margin-left:12%"
                label="上级权限"
                >
                    <a-popover
                        title="权限树"
                        trigger="click"
                        v-model="visible"
                        placement="rightBottom"
                    >   
                        <template slot="content">
                            <div>
                                <AddPermissionTree @changeFormValue="changeFormValue" @hide="hide"></AddPermissionTree>
                            </div> 
                        </template>
                        <a @click="hide" slot="content">关闭</a>
                        <a-input
                        v-decorator="[
                        'parentName',
                        {rules: [{ required: true, message: '请选择上级权限' }]}
                        ]"
                        placeholder="请选择上级权限"
                        readonly="readonly"
                    />
                    </a-popover>
                </a-form-item>

                <a-form-item
                style="width:80%;margin-left:12%"
                label="depid"
                v-show = "false"
                >
                <a-input
                    v-decorator="[
                    'parentId',
                    {rules: []}
                    ]"
                    placeholder="Please input your nickname"
                />
                </a-form-item>

                <a-form-item
                style="width:80%;margin-left:12%"
                label="权限key"
                >
                <a-input
                    v-decorator="[
                    'key',
                    {rules: [{ required: true, message: '请输入权限key' }]}
                    ]"
                    placeholder="请输入权限key"
                />
                </a-form-item>
                
                <a-form-item
                style="width:80%;margin-left:12%"
                label="权限名称"
                >
                <a-input
                    v-decorator="[
                    'name',
                    {rules: [{ required: true, message: '请输入权限名称' }]}
                    ]"
                    placeholder="请输入权限名称"
                />
                </a-form-item>

                <a-form-item
                style="width:80%;margin-left:12%"
                label="排序"
                >
                <a-input
                    v-decorator="[
                    'order',
                    {rules: [{ required: true, message: '请输入排序' }]}
                    ]"
                    placeholder="请输入排序"
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
import {BaseURL} from '../../api/config';
import AddPermissionTree from '../Permission/AddPermissionTree.vue';
    export default {
        props: ['dialogFormVisible'],
        data() {
            return {
                form: this.$form.createForm(this),
                visible: false,
            }
        },

        methods: {
            //取消添加权限
            permissionAddCancel(){
                this.$emit('closeAddPermissionDialog', false);
                this.changeFormValue('','','','');
            },

            //确认添加权限
            permissionConfirm(){
                let that = this;
                this.form.validateFields((err, values) => {
                values.parentId = parseInt(values.parentId);
                values.order = parseInt(values.order);
                if (!err) {
                    that.$ajax.post
                        (
                            `${BaseURL}/main/permission/create`,
                            that.$qs.stringify(values)
                        )
                        .then(function(res){
                            if(res.data.ok){
                              that.$message.success(res.data.msg);
                              that.$emit('reLoadData');
                              that.$emit('loadTreeData');
                            }else{
                              that.$message.warning(res.data.msg);
                            }
                            that.permissionAddCancel();
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
            changeFormValue(parentName,parentId,order,name,key){
                 this.form.setFieldsValue({
                    parentName: parentName,
                    parentId: parentId,
                    order: order,
                    name: name,
                    key: key
                });
            },

            check  () {
                this.form.validateFields((err, values) => {
                if (!err) {
                    console.log(values);
                  }
               });
            },
        },

        watch: {
            // addPermissionVisible: function (newval, oldval) {
            //     if(newval){
            //         this.loadAddTree();
            //         this.loadMenuTree();
            //     }
            // }
        },

        computed: {
            addPermissionVisible: {
                get: function () {
                    return this.dialogFormVisible;
                },
                set: function (newValue) {

                }
            },
        },

        components: {
            AddPermissionTree
        }
    }

    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }
</script>
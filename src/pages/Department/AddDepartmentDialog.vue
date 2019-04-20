<template>
    <div>
        <a-modal 
          title="添加部门"
          v-model="addDeptVisible"
          @ok="deptConfirm"
          @cancel="deptAddCancel">
            <a-form :form="form">
                <a-form-item
                style="width:80%;margin-left:12%"
                label="上级部门"
                >
                    <a-popover
                        title="部门树"
                        trigger="click"
                        v-model="visible"
                        placement="rightBottom"
                    >   
                        <template slot="content">
                            <div>
                                <addTree @changeFormValue="changeFormValue" @hide="hide"></addTree>
                            </div> 
                        </template>
                        <a @click="hide" slot="content">关闭</a>
                        <a-input
                        v-decorator="[
                        'fristdep',
                        {rules: [{ required: true, message: '请选择上级部门' }]}
                        ]"
                        placeholder="请选择上级部门"
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
                label="部门名称"
                >
                <a-input
                    v-decorator="[
                    'name',
                    {rules: [{ required: true, message: '请输入部门名称' }]}
                    ]"
                    placeholder="请输入部门名称"
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
import {BaseURL} from '../../api/config.js';
import addTree from './AddDepTree.vue';
    export default {
        props: ['dialogFormVisible'],
        data() {
            return {
                form: this.$form.createForm(this),
                visible: false,
            }
        },

        methods: {
            //取消添加
            deptAddCancel(){
                 this.changeFormValue('','','');
                 this.$emit('closeAddDeptDialog', false)
            },

            //确认添加
            deptConfirm(){
                let that = this;
                this.form.validateFields((err, values) => {
                values.parentId = parseInt(values.parentId);
                values.order = parseInt(values.order);
                if (!err) {
                    that.$ajax.post
                        (
                            `${BaseURL}/main/department/create`,
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
                            that.deptAddCancel();
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
            
            //隐藏popover
            hide () {
              this.visible = false
            },

            //改变表单值
            changeFormValue(depname,depid,order,name){
                 this.form.setFieldsValue({
                    fristdep: depname,
                    parentId: depid,
                    order: order,
                    name: name
                });
            }
        },

        watch: {
            addDeptVisible: function (newval, oldval) {
                // if(newval){
                //     this.showTree = newval;
                // }
            }
        },

        computed: {
            addDeptVisible: {
                get: function () {
                    return this.dialogFormVisible;
                },
                set: function (newValue) {

                }
            }
        },

        components: {
            addTree
        }
    }

    //根据id初始化树形控件
    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }
</script>
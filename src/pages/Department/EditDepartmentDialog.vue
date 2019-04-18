<template>
    <div>
        <a-modal 
          title="编辑部门"
          v-model="editDeptVisible"
          @ok="deptEditConfirm"
          @cancel="deptEditCancel">
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
                                <addTree @changeFormValue="changeFormValue" @hide="hide" :showTree="showTree"></addTree>
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
        props: ['dialogFormVisible','currentItem'],
        data() {
            return {
                form: this.$form.createForm(this),
                visible: false,
                showTree: 'add'
            }
        },

        methods: {
            //取消添加
           deptEditCancel(){
                this.clearForm();
                this.$emit('closeEditDeptDialog', false)
            },

            //确认添加
            deptEditConfirm(){
                let that = this;
                this.form.validateFields((err, values) => {
                values.parentId = parseInt(values.parentId);
                values.order = parseInt(values.order);
                values.id = that.currentItem.id;
                if (!err) {
                    that.$ajax.post
                        (
                            `${BaseURL}/main/department/edit`,
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
                            that.deptEditCancel();
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
            changeFormValue(depname,depid){
                setTimeout(()=>{
                     this.form.setFieldsValue({
                     fristdep: depname,
                     parentId: depid
                  });
                },0)
            },

            changeCurrentRowFormValue(depname,depid,order,name){
                setTimeout(()=>{
                     this.form.setFieldsValue({
                     fristdep: depname,
                     parentId: depid,
                     order: order,
                     name: name
                  });
                },0)
            },

            //清空扁担
            clearForm(depname,depid,order,name){
                setTimeout(()=>{
                     this.form.setFieldsValue({
                     fristdep: '',
                     parentId: '',
                     order: '',
                     name: ''
                  });
                },0)
            }
        },

        watch: {
           editDeptVisible: function (newval, oldval) {
                // if(newval){
                //     this.showTree = newval;
                // }
            },

        currentItem(newval, oldval){
           if(newval){
                    var that = this;
                    this.$ajax.post
                    (
                        `${BaseURL}/main/department/getTopDepName`,
                        {
                            "depId":newval.id,
                        }
                    )
                    .then(res => {
                        console.log(res.data);
                        that.changeCurrentRowFormValue(res.data==''?'所有部门':res.data,'',newval.order,newval.name);
                    })
                    .catch(err => console.log("连接失败"))
                }
           }
        },

        computed: {
           editDeptVisible: {
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
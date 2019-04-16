<template>
    <div>
        <!-- <el-popover
                ref="popoverAddDept"
                placement="bottom-start"
                width="300"
                trigger="click"
                v-model="popvisible">
            <div style="height:600px;overflow:auto">
                <ul id="depttree2" class="ztree"></ul>
            </div>
        </el-popover> -->

         <div style="height:600px;overflow:auto" ref="xx">
                <ul id="depttree2" class="ztree"></ul>
            </div>

        <a-modal 
          title="添加部门"
          v-model="addDeptVisible"
          @ok="deptConfirm"
          @cancel="deptAddCancel">
            <!-- <div slot="title" class="dialog-title">
                <a-form :model="deptAddform" :rules="rules" ref="deptAddform" label-position="top">
                    <a-form-item label="上级部门" style="width:60%;margin-left:20%" prop="parentName">
                        <a-input v-model="deptAddform.parentName" v-popover:popoverAddDept readonly>
                            <el-button slot="prepend" icon="menu" v-popover:popoverAddDept></el-button>
                        </a-input>
                    </a-form-item>

                    <el-form-item label="部门名称" style="width:60%;margin-left:20%" prop="name">
                        <a-input v-model="deptAddform.name"></a-input>
                    </el-form-item>

                    <a-form-item label="排序" style="width:60%;margin-left:20%" prop="order">
                        <a-input v-model.number="deptAddform.order"></a-input>
                    </a-form-item>
                </a-form>
            </div> -->
            <a-form :form="form">
                <a-form-item
                style="width:80%;margin-left:12%"
                label="上级部门"
                >
                <!-- <a-input
                    v-decorator="[
                    'username',
                    {rules: [{ required: true, message: 'Please input your name' }]}
                    ]"
                    placeholder="Please input your name"
                /> -->
                    <a-popover
                        title="部门树"
                        trigger="click"
                        v-model="visible"
                        placement="bottom"
                    >   
                        <template slot="content">
                            <!-- <div style="height:300px;width:300px;overflow:auto">
                                <ul id="depttree2" class="ztree"></ul>
                            </div> -->
                            <div v-model="this.$refs.xx"></div>
                        </template>
                        <a @click="hide" slot="content">关闭</a>
                        <a-input
                        v-decorator="[
                        'user',
                        {rules: [{ required: true, message: 'Please input your name' }]}
                        ]"
                        placeholder="请选择上级部门"
                    />
                    </a-popover>
                </a-form-item>
                <a-form-item
                style="width:80%;margin-left:12%"
                label="Nickname"
                >
                <a-input
                    v-decorator="[
                    'nickname',
                    {rules: [{ required: checkNick, message: 'Please input your nickname' }]}
                    ]"
                    placeholder="Please input your nickname"
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
import {mapActions} from 'vuex';
    export default {
        props: ['dialogFormVisible'],
        data() {
            return {
                //部门添加和修改表单
                deptAddform:{
                    parentName:'',
                    id:'',
                    name:'',
                    parentId:'',
                    order:'',
                    administrationLevel:'',
                    businessLevel:''
                },

                //弹出层可见性
                popvisible: false,

                //表单验证规则
                rules: {
                    parentName: [
                        { required: true, message: '请选择上级部门',trigger: 'change'},
                    ],
                    name: [
                        { required: true, message: '请输入部门名称' ,trigger: 'blur'},
                    ],
                    order: [
                        {required: true, message: '请输入排序'},
                        {type: 'number', message: '排序必须为数字值'},
                    ],
                },


                checkNick: false,
                form: this.$form.createForm(this),
                visible: false,
            }
        },

        methods: {
            ...mapActions({
                changeShowNaviPage:'changeShowNaviPage'
            }),

            //取消添加
            deptAddCancel(){
                this.resetForm('deptAddform');
                this.$emit('closeAddDeptDialog', false)
            },

            //确认添加
            deptConfirm(){
                let that = this;
                this.deptAddform.parentId = parseInt(this.deptAddform.parentId);
                this.deptAddform.order = parseInt(this.deptAddform.order);
                this.$refs['deptAddform'].validate((valid) => {
                    if (valid) {
                        that.$ajax.post
                        (
                            `${BaseURL}/main/department/create`,
                            that.$qs.stringify(that.deptAddform)
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
                                that.$message(res.data.msg);
                                that.resetForm('deptAddform');
                                that.$emit('closeAddDeptDialog', true)
                        },function(){
                            console.log('failed');
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //载入添加、修改部门时弹出的树形控件数据
            loadAddTree(id){
                let that = this;
                that.$ajax.get
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
                            return;
                        }
                            let treeData = res.data.data;
                            if(id!=undefined)
                            {
                                treeData.forEach((item) => {
                                    if(item.id == id)
                                        item.checked = true;
                                })
                            }

                            let setting2 = {
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
                                    onCheck: that.zTreeOnCheck
                                },
                            };
                            initializeTree('depttree2', setting2, treeData)
                    },
                    function(){
                        console.log('failed');
                    });
            },

            //对话框弹出层树形控件check响应
            zTreeOnCheck(event, treeId, treeNode) {
                this.deptAddform.parentName = treeNode.name;
                this.deptAddform.parentId = treeNode.id;
                this.popvisible = false;
            },

            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },


             check  () {
                this.form.validateFields((err, values) => {
                if (!err) {
                    console.log(values);
                  }
               });
            },

            hide () {
            console.log(111)
            this.visible = false
            },
        },

        watch: {
            addDeptVisible: function (newval, oldval) {
                if(newval){
                    this.loadAddTree();
                }
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
    }

    //根据id初始化树形控件
    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }
</script>
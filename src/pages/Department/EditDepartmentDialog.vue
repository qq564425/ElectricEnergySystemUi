<template>
    <div>
        <el-popover
                ref="popoverEditDept"
                placement="bottom-start"
                width="300"
                trigger="click"
                v-model="popvisible">
            <div style="height:600px;overflow:auto">
                <ul id="depttree3" class="ztree"></ul>
            </div>
        </el-popover>

        <el-dialog 
          :visible.sync="editDeptVisible" 
          :show-close="false"
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
            <div slot="title" class="dialog-title">
                <span style="font-weight:bold;font-size:1.1em">编辑部门</span>
                <el-form :model="deptEditform" :rules="rules" ref="deptEditform">
                    <el-form-item label="上级部门" style="width:60%;margin-left:20%" prop="parentName">
                        <el-input v-model="deptEditform.parentName" v-popover:popoverEditDept readonly>
                            <el-button slot="prepend" icon="el-icon-menu" v-popover:popoverEditDept></el-button>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="部门名称" style="width:60%;margin-left:20%" prop="name">
                        <el-input v-model="deptEditform.name"></el-input>
                    </el-form-item>

                    <el-form-item label="排序" style="width:60%;margin-left:20%" prop="order">
                        <el-input v-model.number="deptEditform.order"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="deptEditCancel">关闭</el-button>
                <el-button type="primary" @click="deptEditConfirm">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {BaseURL} from '../../api/config.js'
import {mapActions} from 'vuex'
    export default {
        props: ['dialogFormVisible','currentItem'],
        data() {
            return {
                //部门添加和修改表单
                deptEditform:{
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
            }
        },

        methods: {
            ...mapActions({
                changeShowNaviPage:'changeShowNaviPage'
            }),

            //取消编辑
            deptEditCancel(){
                this.resetForm('deptEditform');
                this.$emit('closeEditDeptDialog', false)
            },

            //确认编辑
            deptEditConfirm(){
                let that = this;
                this.deptEditform.parentId = this.deptEditform.parentId==null?0:this.deptEditform.parentId;
                this.deptEditform.parentId = parseInt(this.deptEditform.parentId);
                this.deptEditform.order = parseInt(this.deptEditform.order);
                this.$refs['deptEditform'].validate((valid) => {
                    if (valid) {
                        that.$ajax.post
                        (
                            `${BaseURL}/main/department/edit`,
                            that.$qs.stringify(that.deptEditform)
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
                                that.resetForm('deptEditform');
                                that.$emit('closeEditDeptDialog', true)
                            },function(){
                                console.log('failed');
                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //载入修改部门时弹出的树形控件数据
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
                        initializeTree('depttree3', setting2, treeData)
                    },
                    function(){
                        console.log('failed');
                    });
            },

            //对话框弹出层树形控件check响应
            zTreeOnCheck(event, treeId, treeNode) {
                this.deptEditform.parentName = treeNode.name;
                this.deptEditform.parentId = treeNode.id;
                this.popvisible = false;
            },

            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },

        watch: {
            editDeptVisible: function (newval, oldval) {
                if(newval){
                    this.loadAddTree(this.currentItem.parentId);
                }
            },

            currentItem: function (newval, oldval) {
                if(newval) {
                    this.deptEditform = {
                        id:newval.id,
                        parentName: newval.parentName == undefined ? '所有部门' : newval.parentName,
                        parentId: newval.parentId,
                        name: newval.name,
                        order: newval.order,
                        administrationLevel:newval.administrationLevel,
                        businessLevel:newval.businessLevel
                    };
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
        }
    }

    //根据id初始化树形控件
    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }
</script>
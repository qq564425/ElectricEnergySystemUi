<template>
    <div>
        <a-row :gutter="10" style="margin-top:5px">
            <a-col :span="5" :xs="24" :sm="24" :md="24" :lg="5">
                <div style="box-shadow: 2px 2px 5px #888888;background-color:#FFFFFF">
                    <div style="background-color:#5CACEE;padding:5px;height:30px">
                        <span style="font-size:1.2em;color:#FFFFFF">部门树</span>
                    </div>
                    <div id="dep" style="height:627px;overflow:auto">
                        <span id="depttree" class="ztree"></span>
                    </div>
                </div>
            </a-col>
            <a-col :span="19" :xs="24" :sm="24" :md="24" :lg="19">
                <div style="box-shadow: 2px 2px 5px #888888;background-color:#FFFFFF">
                    <div style="background-color:#5CACEE;padding:5px;overflow:hidden;height:30px">
                        <span style="font-size:1.2em;float:left;color:#FFFFFF">部门管理</span>
                        <span style="float:right;padding-right:1%;">
			  			<!-- <el-button type="success" @click="addDepartment" size="small"><i class="el-icon-plus"></i>添加</el-button> -->
                          <a-button type="primary" size="small" @click="addDepartment">添加</a-button>
    					<!-- <el-button type="danger" @click="deleteByGroup" size="small"><i class="el-icon-delete"></i>删除</el-button> -->
                        <a-button type="danger" size="small" @click="deleteByGroup">删除</a-button>
			  		</span>
                    </div>
                    <a-table :columns="columns" 
                      :dataSource="tableData"
                      :pagination="false"
                      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                       bordered>
                        <template slot="operation" slot-scope="text, record">
                            <a-popconfirm
                            v-if="tableData.length"
                            title="确定删除?"
                            @confirm="() => onDelete(record)">
                            <a href="javascript:;">删除</a>
                            </a-popconfirm>
                        </template>    
                    </a-table>

                    <div align="center" style="margin-top:2px;">
                        <div class="block">
                            <a-pagination 
                            showSizeChanger 
                            :pageSize.sync="pageSize" 
                            @showSizeChange="handleSizeChange"
                            @change="handleCurrentChange" 
                            :total="totalNum" 
                            v-model="currentPage"/>
                        </div>
                    </div>
                </div>
            </a-col>
        </a-row>

        <AddDepartmentDialog
            :dialogFormVisible="addDepartmentDialogVisible"
            @closeAddDeptDialog="closeAddDeptDialog">
        </AddDepartmentDialog>

        <!-- <EditDepartmentDialog
            :dialogFormVisible="editDepartmentDialogVisible"
            @closeEditDeptDialog="closeEditDeptDialog"
            :currentItem="currentEditItem">
        </EditDepartmentDialog> -->
    </div>
</template>

<script type="text/ecmascript-6">
     import AddDepartmentDialog from './Department/AddDepartmentDialog.vue';
    // import EditDepartmentDialog from './Department/EditDepartmentDialog.vue';
    import {BaseURL} from '../api/config.js';
    const columns = [{
    title: '部门名称',
    dataIndex: 'name',
    width: '40%',
    scopedSlots: { customRender: 'name' },
    },  
    {
    title: '排序',
    dataIndex: 'order',
    width: '40%',
    scopedSlots: { customRender: 'order' },
    },
    {
        title: '操作',
        dataIndex: 'operation',
         width: '40%',
        scopedSlots: { customRender: 'operation' },
    }];
    export default {
        data() {
            return{
                columns,
                selectedRowKeys: [],
                //表格数据
                tableData: [],

                //树形控件数据
                treeData:[],

                //当前操作的树形控件节点Id
                currentTreeNodeId: 0,

                //当前页码
                currentPage: 1,

                //数据总量
                totalNum: 0,

                //每页显示数据数量
                pageSize: 10,

                //添加部门对话框可见性
                addDepartmentDialogVisible: false,

                //编辑部门对话框可见性
                editDepartmentDialogVisible: false,

                //当前编辑的部门
                currentEditItem: ''
                
            }
        },

        methods:{

            //每页数据量变化响应
            handleSizeChange(current, size) {
                this.pageSize = size;
                this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
            },

            //页码变化响应
            handleCurrentChange(page, pageSize) {
                this.currentPage = page;
                this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
            },

            //添加部门按钮响应
            addDepartment(){
                this.addDepartmentDialogVisible = true;
            },

            //关闭添加部门对话框
            closeAddDeptDialog(refreshFlag){
                this.addDepartmentDialogVisible = false;
                if(refreshFlag){
                    this.loadTreeData();
                    this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
                }
            },

            //编辑按钮响应
            handleEdit(index, row){
                this.currentEditItem = row;
                this.editDepartmentDialogVisible = true;
            },

            //关闭编辑部门对话框
            closeEditDeptDialog(refreshFlag){
                this.editDepartmentDialogVisible = false;
                this.currentEditItem = '';
                if(refreshFlag){
                    this.loadTreeData();
                    this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
                }
            },

            //载入表格数据
            loadData(limit, offset, order, id,clickTreeNode){
                let that = this;
                that.$ajax.get
                (
                    `${BaseURL}/main/department/get-list-departments?order=` + order + '&limit=' + limit + '&offset=' + offset + '&id=' + id
                ).then(function(res)
                    {
                        that.totalNum=clickTreeNode == 'clickTreeNode'?res.data.total+1:res.data.total;
                        that.tableData = res.data.rows;
                        for (let i = 0; i < that.tableData.length; i++) {
                            that.tableData[i].key = that.tableData[i].id;
                        }
                    },
                    function(){
                        console.log('failed');
                    });
            },

            //载入左侧树形控件数据
            loadTreeData(){
                let that = this;
                this.$ajax.get
                (
                    `${BaseURL}/main/department/get-all-departments`
                ).then(function(res)
                    {
                        let departmentTreeData = res.data.data;
                        let setting = {
                            data: {
                                simpleData: {
                                    enable: true
                                }
                            },

                            callback: {
                                onClick: that.menuItemClick
                            }
                        };
                        initializeTree('depttree', setting, departmentTreeData);
                    },
                    function(){
                        console.log('failed');
                    });
            },

            //左侧树形控件节点点击响应
            menuItemClick(event, treeId, treeNode) {
                this.currentTreeNodeId = treeNode.id;
                this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId,'clickTreeNode');
                this.currentTreeNodeId = 0;
            },
            
            //确定删除
            onDelete(row){
              let deleteArray = [];
              deleteArray.push(row.id);
              this.deleteDepts(deleteArray);
            },

            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            //删除部门
            deleteDepts(array){
                let that = this;
                this.$ajax.post
                (
                    `${BaseURL}/main/department/del`,
                    {"depIdStr": array}
                )
                .then(function(res){
                    if(res.data.ok){
                       that.$message.success(res.data.msg);
                       that.selectedRowKeys = [];
                    }else{
                       that.$message.warning(res.data.msg);
                    }
                    that.loadTreeData();
                    if(that.tableData.length==1)
                    {
                        that.currentTreeNodeId = 0;
                        that.currentPage = 1;
                    }
                    that.loadData(that.pageSize, (that.currentPage - 1) * that.pageSize, 'asc', that.currentTreeNodeId);
                },function(){
                    console.log('failed');
                });
            },

            //批量删除
            deleteByGroup(){
                var that = this;
                if(this.selectedRowKeys.length == 0)
                {
                    this.$message.warning('请选择你要删除的部门！');
                    return;
                }
                this.$confirm({
                    title: '确定删除选中的' + this.selectedRowKeys.length + '个部门?',
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk() {
                      that.deleteDepts(that.selectedRowKeys);
                    },
                    onCancel() {
                      console.log('Cancel');
                    },
                });
            },

            onSelectChange (selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys
            }
        },

         computed: {
            rowSelection() {
            const { selectedRowKeys } = this;
            return {
                    onChange: (selectedRowKeys, selectedRows) => {
                      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                      this.selectedRowKeys = selectedRows;
                    },
                    getCheckboxProps: record => ({
                    props: {
                        disabled: record.name === 'Disabled User', // Column configuration not to be checked
                        name: record.name,
                    }
                    }),
                 }
            }
        },

        components: {
             AddDepartmentDialog,
            // EditDepartmentDialog
        },

        watch: {
            '$route' (to, from) {
                if(to.name == '部门管理'){
                    this.showDepTree = true;
                    this.loadTreeData();
                }
            }
        },

        mounted(){
            this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
            this.loadTreeData();
        }
    }

    //根据id初始化树形控件
    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }

</script>
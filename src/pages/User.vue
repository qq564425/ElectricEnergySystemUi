<template>
    <div>
        <a-row :gutter="10" style="margin-top:5px">
            <a-col :span="5" :xs="24" :sm="24" :md="24" :lg="5">
                <div style="box-shadow: 2px 2px 5px #888888;background-color:#FFFFFF">
                    <div style="background-color:#5CACEE;padding:5px;height:30px">
                        <span style="font-size:1.2em;color:#FFFFFF">部门树</span>
                    </div>
                    <div id="user" style="height:627px;overflow:auto">
                        <span id="userdepttree" class="ztree"></span>
                    </div>
                </div>
            </a-col>
            <a-col :span="19" :xs="24" :sm="24" :md="24" :lg="19">
                <div style="box-shadow: 2px 2px 5px #888888;background-color:#FFFFFF">
                    <div style="background-color:#5CACEE;padding:5px;overflow:hidden;height:30px">
                        <span style="font-size:1.2em;float:left;color:#FFFFFF">用户管理</span>
                        <span style="float:right;padding-right:1%;">
			  			<!-- <el-button type="success" @click="addUser" size="small"><i class="el-icon-plus"></i>添加</el-button>
    					<el-button type="danger" @click="deleteByGroup" size="small"><i class="el-icon-delete"></i>删除</el-button> -->
                        <a-button type="primary" size="small" @click="addUser">添加</a-button>
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

        <AddUserDialog
            :dialogFormVisible="addUserDialogVisible"
            @closeUserAddDialog="closeUserAddDialog">
        </AddUserDialog>

        <!-- <UserAddRoleDialog
                :dialogFormVisible="userAddRolesDialogVisible"
                @closeUserAddRoleDialog="closeUserAddRoleDialog"
                :currentItem="currentAddRolesItem">
        </UserAddRoleDialog>

        <UserAddDepartmentDialog
                :dialogFormVisible="userAddDepartmentDialogVisible"
                @closeUserAddDepartmentDialog="closeUserAddDepartmentDialog"
                :currentItem="currentAddDepartmentItem">
        </UserAddDepartmentDialog> -->
    </div>
</template>

<script type="text/ecmascript-6">
     import AddUserDialog from './User/AddUserDialog.vue'
    // import UserAddRoleDialog from './User/UserAddRoleDialog.vue'
    // import UserAddDepartmentDialog from './User/UserAddDepartmentDialog.vue'
    import {BaseURL} from '../api/config.js'
    const columns = [{
        title: '账号',
        dataIndex: 'account',
        width: '30%',
        scopedSlots: { customRender: 'account' },
    },  
    {
        title: '部门名称',
        dataIndex: 'dep_name',
        width: '30%',
        scopedSlots: { customRender: 'dep_name' },
    },
     {
        title: '角色名称',
        dataIndex: 'roleNames',
        width: '30%',
        scopedSlots: { customRender: 'roleNames' },
    },
    {
        title: '操作',
        dataIndex: 'operation',
         width: '30%',
        scopedSlots: { customRender: 'operation' },
    }];
    export default {
        data() {
            return{
                columns,
                selectedRowKeys: [],
                //表格数据
                tableData: [],

                //用户树形控件数据
                treeData:[],

                //角色树形控件数据
                roleTreeData: [],

                //部门树形控件数据
                departmentTreeData: [],

                //当前页码
                currentPage: 1,

                //数据总量
                totalNum: 0,

                //表格每页显示数量
                pageSize: 10,

                //左侧树形控件当前操作的节点数据的ID
                currentTreeNodeId: 0,

                //添加用户对话框可见性
                addUserDialogVisible: false,

                //编辑用户对话框可见性
                editUserDialogVisible: false,

                //分配角色对话框可见性
                userAddRolesDialogVisible: false,

                //分配部门对话框可见性
                userAddDepartmentDialogVisible: false,

                //当前编辑的用户
                currentEditItem: '',

                //当前分配角色的用户
                currentAddRolesItem: '',

                //当前分配部门的用户
                currentAddDepartmentItem: '',             
            }
        },

        methods:{

            //每页数据数量变化响应
            handleSizeChange(current, size) {
                this.pageSize = size;
                this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
            },

            //页码变化响应
            handleCurrentChange(page, pageSize) {
                this.currentPage = page;
                this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
            },

            //载入表格数据
            loadData(limit, offset, order, id){
                let that = this;
                this.$ajax.get
                (
                    `${BaseURL}/user/get-manage-user?`+'order=' + order + '&limit=' + limit + '&offset=' + offset + '&id=' + id
                ).then(function(res)
                    {
                        that.totalNum = res.data.total;
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
                that.loading3 = true;
                that.$ajax.get
                (
                    `${BaseURL}/main/department/get-all-departments`
                ).then(function(res)
                    {
                        let departmentTreeData2 = res.data.data;
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
                        initializeTree('userdepttree', setting, departmentTreeData2)
                        that.loading3 = false;
                    },

                    function(){
                        console.log('failed');
                    })
            },

            //左侧树形控件点击响应
            menuItemClick(event, treeId, treeNode) {
                this.currentTreeNodeId = treeNode.id;
                this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
            },

            //添加用户按钮响应
            addUser(){
                this.addUserDialogVisible = true;
            },

            //关闭添加用户对话框
            closeUserAddDialog(refreshFlag){
                this.addUserDialogVisible = false;
                if(refreshFlag){
                    this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
                }
            },

            //分配角色按钮响应
            assignRoles(index, row){
                this.currentAddRolesItem = row;
                this.userAddRolesDialogVisible = true;
            },

            //关闭分配角色对话框
            closeUserAddRoleDialog(refreshFlag){
                this.userAddRolesDialogVisible = false;
                this.currentAddRolesItem = '';
                if(refreshFlag){
                    this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
                }
            },

            //分配部门按钮响应
            distribution(index, row){
                console.log(row)
                this.currentAddDepartmentItem = row;
                this.userAddDepartmentDialogVisible = true;
            },

            //关闭分配部门对话框
            closeUserAddDepartmentDialog(refreshFlag){
                this.userAddDepartmentDialogVisible = false;
                this.currentAddDepartmentItem = '';
                if(refreshFlag){
                    this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
                }
            },

            //打开编辑用户对话框
            handleEdit(index, row){
                this.currentEditItem = row;
                this.restPassword(index, row);
            },

            //关闭编辑用户对话框
            closeUserEditDialog(refreshFlag){
                this.editUserDialogVisible = false;
                if(refreshFlag){
                    this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
                }
            },

            //确定删除
            onDelete(row){
              let deleteArray = [];
              deleteArray.push(row.id);
              this.deleteUsers(deleteArray);
            },

            //初始化密码确认
            restPassword(index, row){
                let that = this;
                this.$confirm('确认将'+row.account+'用户密码初始化？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.restPasswordAjax({account:row.account,password:'000000'});
                }).catch(() => {

                });
            },

            //删除
            deleteUsers(array){
                let that = this;
                this.$ajax.post
                (
                    `${BaseURL}/user/delete`,
                    {
                        "userIdStr": array
                    }
                )
                .then(function(res){
                    if(res.data.ok){
                       that.$message.success(res.data.msg);
                       that.selectedRowKeys = [];
                    }else{
                       that.$message.warning(res.data.msg);
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
                    this.$message.warning('请选择你要删除的账号！');
                    return;
                }
                this.$confirm({
                    title: '确定删除选中的' + this.selectedRowKeys.length + '个账号?',
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk() {
                      that.deleteUsers(that.selectedRowKeys);
                    },
                    onCancel() {
                      console.log('Cancel');
                    },
                });
            },

            //初始用户密码
            restPasswordAjax(userInfo){
                let that = this;
                        this.$ajax.post
                        (
                            `${BaseURL}/user/edit`,
                            that.$qs.stringify(userInfo)
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
                                    return
                                 }else if(res.data.msg=='success'){
                                     that.$message('初始化用户密码成功！');
                                 }else{
                                     that.$message('初始化用户密码失败！');
                                 }
                            },function(){
                                console.log('failed');
                            });
            },

            onSelectChange (selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys
            }

        },

        mounted(){
            this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
            this.loadTreeData();
        },

    //    computed: {
    //         rowSelection() {
    //         const { selectedRowKeys } = this;
    //         return {
    //                 onChange: (selectedRowKeys, selectedRows) => {
    //                   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //                   this.selectedRowKeys = selectedRows;
    //                 },
    //                 getCheckboxProps: record => ({
    //                 props: {
    //                     disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //                     name: record.name,
    //                 }
    //                 }),
    //              }
    //         }
    //     },
        components: {
             AddUserDialog,
            // UserAddRoleDialog,
            // UserAddDepartmentDialog
        },

        watch: {
            '$route' (to, from) {
                if(to.name == '用户管理'){
                    this.loadTreeData();
                }
            }
        },
    }

    //根据id初始化树形控件
    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }
</script>
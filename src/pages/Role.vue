<template>
    <div>
        <a-row :gutter="10" style="margin-top:5px">
            <a-col :span="24">
                <div style="box-shadow: 2px 2px 5px #888888;background-color:#FFFFFF">
                    <div style="background-color:#5CACEE;padding:5px;overflow:hidden;height:30px">
                        <span style="font-size:1.2em;float:left;color:#FFFFFF">角色设置</span>
                        <span style="float:right;padding-right:1%;">
                        <a-button type="primary" size="small" @click="addRole">添加</a-button>
                        <a-button type="danger" size="small" @click="deleteByGroup">删除</a-button>
			  		</span>
                    </div>
                    <a-table :columns="columns" 
                      :dataSource="tableData"
                      :pagination="false"
                      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                       bordered>
                        <template slot="operation" slot-scope="text, record">
                            <span>
                               <a href="javascript:;" @click="handleCheck(record)"><a-icon type="search" />查看</a>
                            </span>
                            <span style="margin-left:10px">
                               <a href="javascript:;" @click="onEdit(record)"><a-icon type="edit" />编辑</a>
                            </span>
                            <span style="margin-left:10px">
                               <a href="javascript:;" @click="handleGrant(record)"><a-icon type="file-protect" />授权</a>
                            </span>
                            <span style="margin-left:10px">
                                <a-popconfirm
                                v-if="tableData.length"
                                title="确定删除?"
                                @confirm="() => onDelete(record)">
                                <a href="javascript:;"><font color="red"><a-icon type="delete" />删除</font></a>
                                </a-popconfirm>
                            </span>
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

        <AddRoleDialog
            :dialogFormVisible="addRoleDialogVisible"
            @closeAddRoleDialog="closeAddRoleDialog"
            @reLoadData="reLoadData">
        </AddRoleDialog>

         <EditRoleDialog
                :dialogFormVisible="editRoleDialogVisible"
                :currentItem="currentEditItem"
                @closeEditRoleDialog="closeEditRoleDialog"
                @reLoadData="reLoadData">
        </EditRoleDialog>

        <CheckRoleDialog
                :dialogFormVisible="checkRolePermissionDialogVisible"
                :currentItem="currentCheckItem"
                @closeCheckRoleDialog="closeCheckRoleDialog">
        </CheckRoleDialog>

        <RoleGrantDialog
                :dialogFormVisible="grantRoleDialogVisible"
                :currentItem="currentGrantItem"
                @closeRoleGrantDialog="closeRoleGrantDialog">
        </RoleGrantDialog>
    </div>
</template>

<script type="text/ecmascript-6">
     import AddRoleDialog from './Role/AddRoleDialog.vue'
     import EditRoleDialog from './Role/EditRoleDialog.vue'
     import CheckRoleDialog from './Role/CheckRoleDialog.vue'
    import RoleGrantDialog from './Role/RoleGrantDialog.vue'
    import {BaseURL} from '../api/config.js';
    const columns = [{
        title: '角色键值',
        dataIndex: 'keyName',
        width: '40%',
        scopedSlots: { customRender: 'keyName' },
    },  
    {
        title: '角色名称',
        dataIndex: 'name',
        width: '40%',
        scopedSlots: { customRender: 'name' },
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
                //表格数据
                tableData: [],

                //checkbox数据
                selectedRowKeys: [],

                //当前页码
                currentPage: 1,

                //数据总量
                totalNum: 0,

                //每页数据数量
                pageSize: 10,

                //添加角色对话框可见性
                addRoleDialogVisible: false,

                //编辑角色对话框可见性
                editRoleDialogVisible: false,

                //查看角色权限对话框可见性
                checkRolePermissionDialogVisible: false,

                //角色授权对话框可见性
                grantRoleDialogVisible: false,

                //当前编辑的角色
                currentEditItem: '',

                //当前查看权限的角色
                currentCheckItem: '',

                //当前授权的角色
                currentGrantItem: ''
            }
        },

        methods: {

            //每页数据量变化响应
            handleSizeChange(current, size) {
                this.pageSize = size;
                this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc');
            },

            //页码变化响应
            handleCurrentChange(page, pageSize) {
                this.currentPage = page;
                this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc');
            },

            //打开添加角色对话框
            addRole(){
                this.addRoleDialogVisible = true;
            },

            //关闭添加角色对话框
            closeAddRoleDialog(refreshFlag){
                this.addRoleDialogVisible = false;
                if(refreshFlag){
                    this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc');
                }
            },

            //查看角色按钮响应
            handleCheck(row){
                this.currentCheckItem = row;
                this.checkRolePermissionDialogVisible = true;
            },

            //关闭查看角色权限对话框
            closeCheckRoleDialog(){
                this.currentCheckItem = '';
                this.checkRolePermissionDialogVisible = false;
            },

            //打开角色授权对话框
            handleGrant(row){
                this.currentGrantItem = row;
                this.grantRoleDialogVisible = true;
            },

            //关闭角色授权对话框
            closeRoleGrantDialog(){
                this.currentGrantItem = '';
                this.grantRoleDialogVisible = false;
            },

            //编辑部门按钮响应
            onEdit(row){
                this.currentEditItem = row;
                this.editRoleDialogVisible = true;
            },

            //关闭编辑角色对话框
            closeEditRoleDialog(refreshFlag){
                this.editRoleDialogVisible = false;
                this.currentEditItem = ''
                if(refreshFlag){
                    this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc');
                }
            },
            
             //确定删除
            onDelete(row){
              let deleteArray = [];
              deleteArray.push(row.id);
              this.deleteMenus(deleteArray);
            },

            //批量删除
            deleteByGroup(){
                 var that = this;
                if(this.selectedRowKeys.length == 0)
                {
                    this.$message.warning('请选择你要删除的角色！');
                    return;
                }
                this.$confirm({
                    title: '确定删除选中的' + this.selectedRowKeys.length + '个角色?',
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk() {
                      that.deleteMenus(that.selectedRowKeys);
                    },
                    onCancel() {
                      console.log('Cancel');
                    },
                });
            },

            //删除角色
            deleteMenus(array){
                let that = this;
                this.$ajax.post
                (
                    `${BaseURL}/main/role/del`,
                    {"roleIdStr": array}
                ).then(function(res){
                     if(res.data.ok){
                       that.$message.success(res.data.msg);
                       that.selectedRowKeys = [];
                    }else{
                       that.$message.warning(res.data.msg);
                    }
                    that.loadData(that.pageSize, (that.currentPage - 1) * that.pageSize, 'asc');
                },function(){
                    console.log('failed');
                });
            },

            //载入表格数据
            loadData(limit, offset, order){
                let that = this;
                that.$ajax.get
                (
                    `${BaseURL}/main/role/show-roles?`+'order=' + order + '&limit=' + limit + '&offset=' + offset
                ).then(function(res)
                    {
                        that.totalNum = res.data.total;
                        that.tableData = res.data.rows;
                        for (let i = 0; i < that.tableData.length; i++) {
                            that.tableData[i].keyName = that.tableData[i].key;
                            that.tableData[i].key = that.tableData[i].id;
                        }
                    },
                    function(){
                        console.log('failed');
                    });
            },

            onSelectChange (selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys
            },

            //刷新表格
            reLoadData(){
                this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc');
            }

        },

        computed: {
            
        },

        mounted(){
            this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc');
        },

        components: {
             AddRoleDialog,
             EditRoleDialog,
             CheckRoleDialog,
             RoleGrantDialog
        }
    }
</script>
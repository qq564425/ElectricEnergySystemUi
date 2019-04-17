<template>
    <div id="app">
        <a-row :gutter="10" style="margin-top:5px">
            <a-col :span="5" :xs="24" :sm="24" :md="24" :lg="5">
                <div style="box-shadow: 2px 2px 5px #888888;background-color:#FFFFFF">
                    <div style="background-color:#5CACEE;padding:5px;height:30px">
                        <span style="font-size:1.2em;color:#FFFFFF">权限树</span>
                    </div>
                    <div style="height:627px;overflow:auto">
                        <span id="permissionTree1" class="ztree"></span>
                    </div>
                </div>
            </a-col>
            <a-col :span="19" :xs="24" :sm="24" :md="24" :lg="19">
                <div style="box-shadow: 2px 2px 5px #888888;background-color:#FFFFFF">
                    <div style="background-color:#5CACEE;padding:5px;overflow:hidden;height:30px">
                        <span style="font-size:1.2em;float:left;color:#FFFFFF">权限设置</span>
                        <span style="float:right;padding-right:1%;">
                        <a-button type="primary" size="small" @click="addPermission" >添加</a-button>
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

        <AddPermissionDialog
            :dialogFormVisible="addPermissionDialogVisible"
            @closeAddPermissionDialog="closeAddPermissionDialog"
            @reLoadData="reLoadData"
            @loadTreeData="loadTreeData">
        </AddPermissionDialog>
    </div>
</template>

<script>
    import {BaseURL} from '../api/config.js';
    import AddPermissionDialog from './Permission/AddPermissionDialog.vue';
    const columns = [{
    title: '权限名称',
    dataIndex: 'name',
    width: '20%',
    scopedSlots: { customRender: 'name' },
    }, {
    title: '权限key',
    dataIndex: 'keyName',
    width: '30%',
    scopedSlots: { customRender: 'keyName' },
    }, {
    title: '排序',
    dataIndex: 'order',
    width: '30%',
    scopedSlots: { customRender: 'url' },
    },{
        title: '操作',
        dataIndex: 'operation',
         width: '40%',
        scopedSlots: { customRender: 'operation' },
    }];
    export default({
        data()
        {
            return {
                columns,
                selectedRowKeys: [],
                //表格数据
                tableData: [],

                //树形控件数据
                treeData: [],

                //左侧权限树的当前点击节点
                currentTreeNodeId: 0,

                //当前页码
                currentPage: 1,

                //数据总量
                totalNum: 0,

                //每页数据量
                pageSize: 10,

                addPermissionDialogVisible: false,
            }
        },


        methods: {
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

            //载入表格数据
            loadData(limit, offset, order, id,clickTreeNode){
                let that = this;
                this.$ajax.get
                (
                    `${BaseURL}/main/get-show-permissions?` + 'order=' + order + '&limit=' + limit + '&offset=' + offset + '&id=' + id
                ).then(function(res)
                    {
                        that.totalNum=clickTreeNode == 'clickTreeNode'?res.data.total+1:res.data.total;
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

            //载入左侧树形控件数据
            loadTreeData(){
                let that = this;
                that.loading3 = true;
                this.$ajax.get
                (
                    `${BaseURL}/main/get-all-permissions`
                ).then(function(res)
                    {   
                        that.treeData = res.data.data;
                        var setting = {
                            data: {
                                simpleData: {
                                    enable: true
                                }
                            },

                            callback: {
                                onClick: that.menuItemClick
                            }
                        };
                        initializeTree('permissionTree1', setting, that.treeData);
                        that.loading3 = false;
                    },
                    function(){
                        console.log('failed');
                    });
            },

            //左侧树形控件节点点击响应
            menuItemClick(event, treeId, treeNode, clickFlag){
                this.currentTreeNodeId = treeNode.id;
                this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId,'clickTreeNode');
            },

            onSelectChange (selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys
            },

             //确定删除
            onDelete(row){
              let deleteArray = [];
              deleteArray.push(row.id);
              this.deletePermissions(deleteArray);
            },

            //批量删除按钮响应
            deleteByGroup(){
                var that = this;
                if(this.selectedRowKeys.length == 0)
                {
                    this.$message.warning('请选择你要删除的权限！');
                    return;
                }
                this.$confirm({
                    title: '确定删除选中的' + this.selectedRowKeys.length + '个权限?',
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk() {
                      that.deletePermissions(that.selectedRowKeys);
                    },
                    onCancel() {
                      console.log('Cancel');
                    },
                });
            },

            //删除权限
            deletePermissions(array){
                let that = this;
                that.$ajax.post
                (
                    `${BaseURL}/main/permission/del`,
                    {"permIdStr": array}
                ).then(function(res)
                {
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

             //添加权限按钮响应
            addPermission(){
                this.addPermissionDialogVisible = true;
            },

            //关闭添加权限对话框
            closeAddPermissionDialog(refreshFlag){
                this.addPermissionDialogVisible = false;
                if(refreshFlag){
                    this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
                    this.loadTreeData();
                }
            },

            reLoadData(){
                this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
            }

        },

        mounted(){
            this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
            this.loadTreeData();
        },

        computed: {
         
        },

        watch: {
            '$route' (to, from) {
                if(to.name == '权限管理'){
                    this.loadTreeData();
                }
            }
        },

        components: {
            AddPermissionDialog
        }

    });

    //根据id载入初始化树形控件
    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }
</script>
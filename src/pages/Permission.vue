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
                    </div>

                    <a-table :columns="columns" 
                    :dataSource="tableData"
                    :pagination="false" 
                    bordered>    
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
    </div>
</template>

<script>
    import {BaseURL} from '../api/config.js';
    const columns = [{
    title: '权限名称',
    dataIndex: 'name',
    width: '25%',
    scopedSlots: { customRender: 'name' },
    }, {
    title: '权限key',
    dataIndex: 'key',
    width: '15%',
    scopedSlots: { customRender: 'key' },
    }, {
    title: '排序',
    dataIndex: 'order',
    width: '25%',
    scopedSlots: { customRender: 'url' },
    }];
    export default({
        data()
        {
            return {
                columns,
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
                pageSize: 10
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
                        that.totalNum=clickTreeNode == 'clickTreeNode'?res.data.total+1:res.data.total;
                        that.tableData = res.data.rows;
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
        }

    });

    //根据id载入初始化树形控件
    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }
</script>
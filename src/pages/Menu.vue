<template>
<div id="menu">
  <a-row :gutter="10" style="margin-top:5px">
    
    <a-col :span="5" :xs="24" :sm="24" :md="24" :lg="5">
      <div style="box-shadow: 2px 2px 5px #888888;background-color:#FFFFFF">
        <div style="background-color:#5CACEE;padding:5px;height:30px">
          <span style="font-size:1.2em">菜单树</span>
        </div>
        <div style="height:627px;overflow:auto" element-loading-text="拼命加载中">
          <span id="Menutree" class="ztree"></span>
        </div>
      </div>
    </a-col>

    <a-col :span="19" :xs="24" :sm="24" :md="24" :lg="19">
      <div style="box-shadow: 2px 2px 5px #888888;background-color:#FFFFFF">
        <div style="background-color:#5CACEE;padding:5px;overflow:hidden;height:30px">
          <span style="font-size:1.2em;float:left;">菜单设置</span>
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

<script type="text/ecmascript-6">
import {BaseURL} from '../api/config.js';
const columns = [{
  title: '菜单名称',
  dataIndex: 'name',
  width: '15%',
  scopedSlots: { customRender: 'name' },
}, {
  title: '菜单路径',
  dataIndex: 'url',
  width: '40%',
  scopedSlots: { customRender: 'url' },
}, {
  title: '排序',
  dataIndex: 'order',
  scopedSlots: { customRender: 'order' },
}];
export default {
  data() {
    return {
      columns,
      //表格数据
      tableData: [],

      //树形控件数据
      treeData: [],

      //当前节点id
      currentTreeNodeId: 0,

      //当前页码
      currentPage: 1,

      //数据总量
      totalNum: 0,

      //每页数据数量
      pageSize: 10,

      setting : {
            data: {
              simpleData: {
                enable: true
              }
            },
            callback: {
              onClick: this.menuItemClick
            }
      }
    }
  },

  methods: {

    //改变每页显示数量
    handleSizeChange(current, size) {
      this.pageSize = size;
      this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
    },

    //改变页码
    handleCurrentChange(page, pageSize) {
      this.currentPage = page;
      this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
    },

    //载入表格数据
    loadData(limit, offset, order, id,clickTreeNode) {
      let that = this;
      this.$ajax.get(
        `${BaseURL}/main/menu/get-list-menus?` + 'order=' + order + '&limit=' + limit + '&offset=' + offset + '&id=' + id
      ).then(function(res) {
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
        function() {
          console.log('failed');
        });
    },

    //载入左侧树形控件数据
    loadTreeData() {
      let that = this;
      that.loading3 = true;
      that.$ajax.get(
          `${BaseURL}/main/menu/get-all-menus`
        )
        .then(res => {
          that.treeData = res.data.data;
          initializeTree('Menutree', that.setting, res.data.data)
          that.loading3 = false;
        })
        .catch(err => console.log(err))
    },

    //左侧树形控件节点点击响应
    menuItemClick(event, treeId, treeNode, clickFlag) {
      this.currentTreeNodeId = treeNode.id;
      this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId,"clickTreeNode");
    },

  },

  mounted () {
    this.loadData(this.pageSize, (this.currentPage - 1) * this.pageSize, 'asc', this.currentTreeNodeId);
    this.loadTreeData();
  },

  computed: {
    
  },

  watch: {
    '$route' (to, from) {
      if (to.name == '菜单管理') {
        this.loadTreeData();
      }
    }
  }
}

function initializeTree(TemplateId, setting, treeData) {
  $.fn.zTree.init($("#" + TemplateId), setting, treeData);
}
</script>

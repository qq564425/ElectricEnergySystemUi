<template>
  <div style="height:600px;overflow:auto">
      <ul id="permissionTree2" class="ztree"></ul>
  </div>
</template>

<script>
import {BaseURL} from '../../api/config.js';
export default {
   data() {
     return {
        checkNick: false,
     }
   },

   methods: {
      //载入添加权限的对话框里面的树形控件
            loadAddTree(id){
                let that = this;
                this.$ajax.get
                (
                    `${BaseURL}/main/get-all-permissions`
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

                        let setting = {
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
                        initializeTree('permissionTree2', setting, treeData);
                        var zTree = $.fn.zTree.getZTreeObj("permissionTree2");
                        var nodes = zTree.getNodes();
                        //zTree.checkNode(nodes[0], false, false);  //父节点不被选中
                        zTree.setChkDisabled(nodes[0], true); //父节点禁止勾选
                    },
                    function(){
                        console.log('failed');
                    });
            },

           //添加和修改权限对话框中的树形控件选取响应
            zTreeOnCheck(event, treeId, treeNode) {
                this.$emit('changeFormValue',treeNode.name,treeNode.id);
                this.$emit('hide');
            },
   },

    mounted() {
      this.loadAddTree();
   },
}
function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }
</script>

<style>

</style>

<template>
  <div style="height:600px;overflow:auto">
      <ul id="rolestree" class="ztree"></ul>
  </div>
</template>

<script>
import {BaseURL} from '../../api/config'
export default {
  props: ['selectedRoleIds'],
   data () {
     return {
       
     }
   },
   methods: {
     //载入角色树数据
            loadTreeData(arr){
                let that = this;
                this.$ajax.get
                (
                    `${BaseURL}/main/role/get-all-roles`
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
                            return
                        }
                        let roleTreeData = [];
                        let array = res.data.data;
                        array.forEach((item) => {
                            if(arr.indexOf(item.id) >= 0)
                            {
                                item.checked = true;
                            }
                            roleTreeData.push(item);
                        })

                        let setting = {
                            data: {
                                simpleData: {
                                    enable: true
                                }
                            },
                            check:{
                                enable:true,
                            },
                            callback: {
                                onCheck: that.zTreeOnCheck2
                            }
                        };
                        initializeTree('rolestree', setting, roleTreeData);
                    },
                    function(){
                        console.log('failed');
                    });
            },

            //角色树check响应
            zTreeOnCheck2(event, treeId, treeNode){
                let treeObj = $.fn.zTree.getZTreeObj(treeId);
                let nodes = treeObj.getCheckedNodes(true);
                console.log("耀武扬威",nodes);
                let roleNames = '';
                let roleIds = '';
                nodes.forEach((item) => {
                    roleNames=roleNames+item.name+',';
                    roleIds=roleIds+item.id+','
                 })
                 roleNames = roleNames.slice(0, -1);
                 roleIds = roleIds.slice(0, -1);
                this.$emit('changeFormValue',roleIds,roleNames)
            },
   },

   mounted() {
      this.loadTreeData(this.selectedRoleIds);
   },
}
    //根据id初始化树形控件
    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
        let treeObj = $.fn.zTree.getZTreeObj("rolestree");
        console.log(treeData);
        var disabledNode = treeObj.getNodeByParam("name", "开发者角色");
        if(window.sessionStorage.getItem('USER_NAME') !== 'developer'){
            treeObj.setChkDisabled(disabledNode, true);  
        }
    }
</script>

<style>

</style>

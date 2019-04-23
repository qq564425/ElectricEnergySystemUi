<template>
  <div style="padding-left:25%;padding-top:20px;height:600px;overflow:auto">
      <span id="roleTreePermission" class="ztree"></span>
  </div>
</template>

<script>
import {BaseURL} from '../../api/config'
export default {
  props: ['currentItem'],
   data () {
     return {
       
     }
   },

   methods: {
     //确认授权
            roleGrantConfirm(){
                let treeObj = $.fn.zTree.getZTreeObj("roleTreePermission");
                let nodes = treeObj.getCheckedNodes(true);
                let grantArray = [];
                nodes.forEach((item) => {
                    grantArray.push(parseInt(item.id));
                });
                let that = this;
                this.$ajax.post
                (
                    `${BaseURL}/main/role/grant`,
                    {
                        "id": that.currentItem.id,
                        "peridStr": grantArray
                    }
                )
                .then(function(res){
                    // that.$message('授权成功');
                    // that.$emit('closeRoleGrantDialog');
                    if(res.data.ok){
                      that.$message.success(res.data.msg);
                      that.$emit('closeRoleGrant');
                    }else{
                      that.$message.warning(res.data.msg);
                    }
                },function(){
                    console.log('failed');
                });
            },

            //根据id初始化当前所要授权的角色的树形控件
            loadGrantTree(roleId){
                var that = this;
                this.$ajax.get
                (
                    `${BaseURL}/main/get-role-check-permissions?`+'roleId=' + roleId
                ).then(function(res)
                    {
                        let ChecktreeData = res.data.data;
                        let setting = {
                            data: {
                                simpleData: {
                                    enable: true
                                },
                            },

                            check: {
                                enable: true,
                                chkStyle: "checkbox",
		                        chkboxType: {"N": "s" }
                            },

                        };
                        initializeTree('roleTreePermission', setting, ChecktreeData)
                    },
                    function(){
                        console.log('failed');
                    });
            },
   }
}
    //根据id初始化树形控件
    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }
</script>

<style>

</style>

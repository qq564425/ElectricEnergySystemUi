<template>
  <div style="padding-left:25%;padding-top:20px;height:600px;overflow:auto">
      <span id="roleTreeCheck" class="ztree"></span>
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
     //根据id初始化当前所要查看的角色的树形控件
            loadCheckTree(roleId){
                let that = this;
                that.$ajax.get
                (
                    `${BaseURL}/main/get-role-show-permissions?`+'roleId=' + roleId
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
                            },
                        };
                        initializeTree('roleTreeCheck', setting, ChecktreeData)
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

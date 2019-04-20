<template>
   <div style="height:600px;overflow:auto" ref="xx">
      <ul id="depttreeUSER" class="ztree"></ul>
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
     //载入添加、修改部门时弹出的树形控件数据
            loadAddTree(id){
                let that = this;
                that.$ajax.get
                (
                    `${BaseURL}/main/department/get-all-departments`
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

                            let setting2 = {
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
                            initializeTree('depttreeUSER', setting2, treeData)
                    },
                    function(){
                        console.log('failed');
                    });
            },

            //对话框弹出层树形控件check响应
            zTreeOnCheck(event, treeId, treeNode) {
                this.$emit('changeFormValue',treeNode.name,treeNode.id);
                this.$emit('hide');
            }
   },

   mounted() {
      this.loadAddTree();
   },
}
   //根据id初始化树形控件
    function initializeTree(TemplateId, setting, treeData){
        $.fn.zTree.init($("#" + TemplateId), setting, treeData);
    }
</script>

<style>

</style>

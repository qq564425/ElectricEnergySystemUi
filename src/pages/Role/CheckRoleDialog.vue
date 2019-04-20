<template>
    <div>
        <!-- <el-dialog 
          :visible.sync="rolecheckPermissionVisible" 
          :show-close="false" 
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
            <div slot="title" class="dialog-title">
                <span style="font-weight:bold;font-size:1.1em">查看权限</span>
                <div style="padding-left:25%;padding-top:20px;height:600px;overflow:auto">
                    <span id="roleTree2" class="ztree"></span>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="closeCheck">关闭</el-button>
            </div>
        </el-dialog> -->
        <a-modal 
          title="查看角色"
          v-model="rolecheckPermissionVisible"
          @ok="closeCheck"
          @cancel="closeCheck">
          <CheckTree :currentItem="currentItem" ref="mychild"></CheckTree>
        </a-modal>
    </div>
</template>

<script>
import {BaseURL} from '../../api/config'
import CheckTree from './CheckRoleTree.vue'
    export default {
        props: ['dialogFormVisible', 'currentItem'],
        data() {
            return {

            }
        },

        methods: {
            //关闭查看
            closeCheck(){
                this.$emit('closeCheckRoleDialog')
            }
        },

        computed: {
            rolecheckPermissionVisible: {
                get: function () {
                    return this.dialogFormVisible;
                },
                set: function (newValue) {

                }
            },
        },

        components: {
            CheckTree
        },

        watch: {
        currentItem: function (newval, oldval) {
            if(newval) {
              console.log(newval);
               setTimeout(()=>{
                     this.$refs.mychild.loadCheckTree(newval.id)
                },0)
            }
        },
    }
}
</script>
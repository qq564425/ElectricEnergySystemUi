<template>
    <div>
        <!-- <el-dialog 
          :visible.sync="roleGrantVisible" 
          :show-close="false" 
          width="30%"
          :close-on-click-modal="false"
          :close-on-press-escape="false">
            <div slot="title" class="dialog-title">
                <span style="font-weight:bold;font-size:1.1em">菜单授权</span>
                <div style="padding-left:25%;padding-top:20px;height:600px;overflow:auto">
                    <span id="roleTree1" class="ztree"></span>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="closeRoleGrant">关闭</el-button>
                <el-button @click="roleGrantConfirm">保存</el-button>
            </div>
        </el-dialog> -->
        <div>
        <a-modal 
          title="角色授权"
          v-model="roleGrantVisible"
          @ok="roleGrantConfirm"
          @cancel="closeRoleGrant">
          <AddPermissionTree :currentItem="currentItem" ref="mychild2" @closeRoleGrant="closeRoleGrant"></AddPermissionTree>
        </a-modal>
    </div>
    </div>
</template>

<script>
import {BaseURL} from '../../api/config'
import AddPermissionTree from './AddPermissionTree.vue'
    export default {
        props: ['dialogFormVisible', 'currentItem'],
        data() {
            return {

            }
        },

        methods: {
            //关闭授权对话框
            closeRoleGrant(){
                this.$emit('closeRoleGrantDialog');
            },

            roleGrantConfirm(){
                this.$refs.mychild2.roleGrantConfirm();
            }
        },

        watch: {
            currentItem: function (newval, oldval) {
                if(newval) {
                    setTimeout(()=>{
                     this.$refs.mychild2.loadGrantTree(newval.id);
                },0)
                }
            },
        },

        computed: {
            roleGrantVisible: {
                get: function () {
                    return this.dialogFormVisible;
                },
                set: function (newValue) {

                }
            },
        },

        components: {
            AddPermissionTree
        }
    }
</script>
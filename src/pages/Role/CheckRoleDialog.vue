<template>
    <div>
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
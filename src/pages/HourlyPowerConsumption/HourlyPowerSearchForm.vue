<template>     
     <div style="border-radius:5px;">
         <div style="background-color:#FFFFFF;box-shadow: 2px 2px 5px #888888;overflow: hidden;border-radius:5px;">
            <div style="background-color:#5CACEE;padding:5px;overflow:hidden;height:33px;color:white;">
                <span style="font-size:1.2em;float:left;">小时耗电量查询</span>
            </div>
            </br>
            <el-form ref="form" :model="form" :inline="true" label-width="70px" label-position="left">
                <el-row :gutter="10">
                    <el-col :xs="24" :sm="7" :md="7" :lg="6">
                        <el-form-item label="表地址" prop="tableNumber">
                            <el-input v-model="form.tableNumber"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="7" :md="7" :lg="8">
                        <el-form-item label="日期" prop="startAndEndDate">
                            <el-date-picker
                              v-model="form.startAndEndDate"
                              type="daterange"
                              range-separator="-"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-form-item style="float:right">
                        <el-button type="primary" @click="resetForm('form')">清空</el-button>
                        <el-button type="primary" @click="submitForm()">查询</el-button>
                    </el-form-item>
                </el-row>               
            </el-form>
         </div>
     </div>
</template>

<script>
import {mapActions} from 'vuex'
import {format} from '../../script/Tool.js'
export default {
   data () {
     return {
        //提交的表单
        form: {
           tableNumber:'',
           startAndEndDate:[],
           startDate:null,
           endDate:null
        }
     }
   },

   methods: {

     ...mapActions({
          changeHourForm: 'changeHourForm',
          changeHourSearchFlag: 'changeHourSearchFlag'
      }),
      //重置表单
      resetForm(formName) {
          this.$refs[formName].resetFields();
      },

      //提交表单
      submitForm: function() {
          if(this.form.startAndEndDate.length > 0){
             this.form.startDate = format(this.form.startAndEndDate[0],'yyyy-MM-dd');
             this.form.endDate = format(this.form.startAndEndDate[1],'yyyy-MM-dd');
          }
          this.changeHourSearchFlag(true);
      }
   },

   mounted () {
      this.changeHourForm(this.form);
   }
}
</script>

<style>

</style>

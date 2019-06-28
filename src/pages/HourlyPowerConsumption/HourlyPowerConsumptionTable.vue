<template>
  <div style="box-shadow: 2px 2px 5px #888888;background-color:#FFFFFF;border-radius:5px;">
    <div style="background-color:#5CACEE;padding:5px;overflow:hidden;height:33px;color:white;">
      <span style="font-size:1.2em;float:left;">小时耗电量</span>
    </div>
    <a-table :columns="columns" 
         :dataSource="tableData"
         :pagination="false" 
         :scroll="{ x: '240%',y:300}"
         bordered>
      <template slot="aquadrantVoltage" slot-scope="aquadrantVoltage">
        {{getOnePoint(aquadrantVoltage)}}
      </template>    
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
</template>

<script>
import {BaseURL} from '../../api/config.js';
import {mapActions} from 'vuex'
const columns = [{
  title: '表号',
  dataIndex: 'tableNumber',
  width: 150,
  fixed: 'left',
  scopedSlots: { customRender: 'tableNumber' },
},{
  title: '采集时间',
  dataIndex: 'createTime',
  width: 160,
  fixed: 'left',
  scopedSlots: { customRender: 'createTime' },
},{
  title: '正向有功总电能',
  dataIndex: 'positiveActivePower',
  width: 150,
  scopedSlots: { customRender: 'positiveActivePower' },
}, {
  title: '反向有功总电能',
  dataIndex: 'reverseActivePower',
  width: 150,
  scopedSlots: { customRender: 'reverseActivePower' },
}, {
  title: '正向无功总电能',
  dataIndex: 'positiveReactivePower',
  width: 150,
  scopedSlots: { customRender: 'positiveReactivePower' },
}, {
  title: '反向无功总电能',
  dataIndex: 'reverseReactivePower',
  width: 150,
  scopedSlots: { customRender: 'reverseReactivePower' },
}, {
  title: '一象限无功总电能',
  dataIndex: 'oneQuadrantReactivePower',
  width: 170,
  scopedSlots: { customRender: 'oneQuadrantReactivePower' },
}, {
  title: '二象限无功总电能',
  dataIndex: 'twoQuadrantReactivePower',
  width: 170,
  scopedSlots: { customRender: 'twoQuadrantReactivePower' },
}, {
  title: '三象限无功总电能',
  dataIndex: 'threeQuadrantReactivePower',
  width: 170,
  scopedSlots: { customRender: 'twoQuadrantReactivePower' },
}, {
  title: '四象限无功总电能',
  dataIndex: 'fourQuadrantReactivePower',
  width: 170,
  scopedSlots: { customRender: 'fourQuadrantReactivePower' },
}, {
  title: 'A相电压',
  dataIndex: 'aquadrantVoltage',
  width: 150,
  scopedSlots: { customRender: 'aquadrantVoltage' },
}, {
  title: 'B相电压',
  dataIndex: 'bquadrantVoltage',
  width: 150,
  scopedSlots: { customRender: 'bquadrantVoltage' },
}, {
  title: 'C相电压',
  dataIndex: 'cquadrantVoltage',
  width: 150,
  scopedSlots: { customRender: 'cquadrantVoltage' },
}, {
  title: 'A相电流',
  dataIndex: 'aquadrantCurrent',
  width: 150,
  scopedSlots: { customRender: 'aquadrantCurrent' },
}, {
  title: 'B相电流',
  dataIndex: 'bquadrantCurrent',
  width: 150,
  scopedSlots: { customRender: 'bquadrantCurrent' },
}, {
  title: 'C相电流',
  dataIndex: 'cquadrantCurrent',
  width: 150,
  scopedSlots: { customRender: 'cquadrantCurrent' },
}, {
  title: 'A相功率',
  dataIndex: 'aquadrantPower',
  width: 150,
  scopedSlots: { customRender: 'aquadrantPower' },
}, {
  title: 'B相功率',
  dataIndex: 'bquadrantPower',
  width: 150,
  scopedSlots: { customRender: 'bquadrantPower' },
}, {
  title: 'C相功率',
  dataIndex: 'cquadrantPower',
  width: 150,
  scopedSlots: { customRender: 'cquadrantPower' },
}, {
  title: 'A相无工功率',
  dataIndex: 'aquadrantReactivePower',
  width: 150,
  scopedSlots: { customRender: 'aquadrantReactivePower' },
}, {
  title: 'B相无工功率',
  dataIndex: 'bquadrantReactivePower',
  width: 150,
  scopedSlots: { customRender: 'bquadrantReactivePower' },
}, {
  title: 'C相无工功率',
  dataIndex: 'cquadrantReactivePower',
  width: 150,
  scopedSlots: { customRender: 'cquadrantReactivePower' },
}, {
  title: 'A相功率因数',
  dataIndex: 'aquadrantPowerFactor',
  width: 150,
  scopedSlots: { customRender: 'aquadrantPowerFactor' },
}, {
  title: 'B相功率因数',
  dataIndex: 'bquadrantPowerFactor',
  width: 150,
  scopedSlots: { customRender: 'bquadrantPowerFactor' },
}, {
  title: 'B相功率因数',
  dataIndex: 'cquadrantPowerFactor',
  width: 150,
  scopedSlots: { customRender: 'cquadrantPowerFactor' },
}];
export default {
   data () {
     return {
       columns,
      //表格数据
      tableData: [],

      //当前页码
      currentPage: 1,

      //数据总量
      totalNum: 0,

      //每页数据数量
      pageSize: 10,
     }
   },

   methods: {
     ...mapActions({
          changeHourSearchFlag: 'changeHourSearchFlag'
      }),

     loadData(){
      let that = this;
      this.$ajax.post(
        `${BaseURL}/powerData/getPowerDataList`,{
          "queryFlag":"hour",
          "pageNum":that.currentPage,
          "pageSize":that.pageSize,
          "tableNumber":that.$store.state.moduleSearch.hourForm.tableNumber,
          "startDate":that.$store.state.moduleSearch.hourForm.startDate,
          "endDate":that.$store.state.moduleSearch.hourForm.endDate,
        }
      ).then(res => {
         that.tableData = res.data.list;
         that.totalNum = res.data.list.length;
      })
      .catch(err => console.log(err))
     },

     //改变每页显示数量
    handleSizeChange(current, size) {
      this.pageSize = size;
      this.loadData();
    },

    //改变页码
    handleCurrentChange(page, pageSize) {
      this.currentPage = page;
      this.loadData();
    },

    //去掉一位小数
    getOnePoint(val){
       return parseFloat(val).toFixed(1);
    }
   },

   mounted() {
     this.loadData();
   },

   computed: {
     hourSearchFlag(){
       return this.$store.state.moduleSearch.hourSearchFlag;
     }
   },

   watch: {
     hourSearchFlag(newval,oldval){
        if(newval){
           this.loadData();
           this.changeHourSearchFlag(false);
        }
     }
   },
}
</script>

<style>

</style>

<template>
<div>
  <div style="border-radius:5px;">
         <div style="background-color:#FFFFFF;box-shadow: 2px 2px 5px #888888;overflow: hidden;border-radius:5px;">
            <div style="background-color:#5CACEE;padding:5px;overflow:hidden;height:33px;color:white;">
               <span style="font-size:1.2em;float:left;">三相电流统计</span>
            </div>
            </br>
            <el-form ref="form" :model="form" :inline="true" label-width="70px" label-position="left" style="margin-left: 5%">
                <el-row :gutter="10">
                    <el-col :xs="24" :sm="6" :md="6" :lg="6">
                        <div style="margin-top:8px">
                           <el-radio-group v-model="radio" @change="radioChange">
                                <el-radio :label="6">按小时统计</el-radio>
                                <el-radio :label="3">按日统计</el-radio>
                                <el-radio :label="1">按月统计</el-radio>
                            </el-radio-group>
                        </div>
                    </el-col>

                    <el-col :xs="24" :sm="7" :md="7" :lg="6">
                        <el-form-item label="开始月份" prop="startYear" v-show="radio==1?true:false">
                            <el-date-picker
                            v-model="form.startMonth"
                            type="year"
                            placeholder="选择月份">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="开始日期" prop="startDate" v-show="radio==3?true:false">
                            <el-date-picker
                            v-model="form.startDate"
                            type="date"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="开始日期" prop="startDate" v-show="radio==6?true:false">
                            <el-date-picker
                            v-model="form.startDate"
                            type="date"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="7" :md="7" :lg="6">
                        <el-form-item label="结束月份" prop="endYear" v-show="radio==1?true:false">
                            <el-date-picker
                            v-model="form.endMonth"
                            type="year"
                            placeholder="选择月份">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="结束日期" prop="endDate" v-show="radio==3?true:false">
                            <el-date-picker
                            v-model="form.endDate"
                            type="date"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="结束日期" prop="endDate" v-show="radio==6?true:false">
                            <el-date-picker
                            v-model="form.endDate"
                            type="date"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-form-item style="float:right">
                        <el-button type="primary" @click="submitForm()">统计</el-button>
                    </el-form-item>
                </el-row>               
            </el-form>
         </div>
     </div>

    <div style="box-shadow: 2px 2px 5px #888888;background-color:#FFFFFF;border-radius:5px;margin-top:20px">
        <div style="background-color:#5CACEE;padding:5px;overflow:hidden;height:33px;color:white;">
            <span style="font-size:1.2em;float:left;">统计图表</span>
        </div>
        <div style="width:100%;height:40px;text-align:center;line-height:40px;font-size:18px" v-show="radio==6?true:false">
          <strong>{{startDateTitle}} 至 {{endDateTitle}} 三相电流小时统计</strong>
        </div>
        <div style="width:100%;height:40px;text-align:center;line-height:40px;font-size:18px" v-show="radio==3?true:false">
          <strong>{{startDateTitle}} 至 {{endDateTitle}} 三相电流日统计</strong>
        </div>
        <div style="width:100%;height:40px;text-align:center;line-height:40px;font-size:18px" v-show="radio==1?true:false">
          <strong>{{startMonthTitle}} 至 {{endMonthTitle}} 三相电流月统计</strong>
        </div>
        <!-- 折线图 -->
        <div id="chartmainlineHour2" style="width:99%; height:600px;" v-show="radio==6?true:false"></div>
        <div id="chartmainlineDate2" style="width:99%; height:600px;" v-show="radio==3?true:false"></div>
        <div id="chartmainlineMonth2" style="width:99%; height:600px;" v-show="radio==1?true:false"></div>
    </div>
</div>
</template>
<script>
require('echarts/theme/shine');
import {BaseURL} from '../api/config'
import { format } from '../script/Tool.js'
export default({
    data(){
     return{
        form:{
          queryFlag:'hour',
          startDate:format(new Date,'yyyy-MM')+'-01',
          endDate:format(new Date,'yyyy-MM-dd'),
          startMonth:format(new Date,'yyyy')+'-01',
          endMonth:format(new Date,'yyyy-MM'),
        },
        radio: 6,
        startDateTitle:format(new Date,'yyyy-MM')+'-01',
        endDateTitle:format(new Date,'yyyy-MM-dd'),
        startMonthTitle:format(new Date,'yyyy')+'-01',
        endMonthTitle:format(new Date,'yyyy-MM'),
        chartmainline:{}
     }
    },
    mounted() {
       this.findAnyData('chartmainlineHour2');
    },

    methods: {
      drawLine: function(type,hengxiang,aQuadrantCurrentList,bQuadrantCurrentList,cQuadrantCurrentList){
         let option = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['A相电流','B相电流','C相电流']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    //dataZoom : {show: false},
                    dataView : {
                      show: true,
                      readOnly:true,
                      title: '数据表格',
                      optionToContent: function (opt) {
                            var  axisData = opt.xAxis[0].data; //坐标数据
                            var series = opt.series; //折线图数据
                            var sum = new Array();//获取合计数组（根据对应的系数生成相应数量的sum）
                            for(var i=0; i<series.length; i++){
                                sum[i] = 0;
                            }
                            var tdHeads = '<td  style="padding: 0 10px;background-color:#E4EFFB">时间</td>'; //表头
                            var tdBodys = ''; //数据
                            series.forEach(function (item) {
                                //组装表头
                                tdHeads += '<td height="30px" style="padding: 0 10px;background-color:#E4EFFB">'+item.name+'</td>';
                            });
                            var table = '<table border="1" bordercolor="#DCDFE6" style="width:97%;margin-left:20px;border-collapse:collapse;font-size:14px;text-align:center"><tbody><tr>'+tdHeads+' </tr>';
                            for (var i = 0, l = axisData.length; i < l; i++) {
                                for (var j = 0; j < series.length; j++) {
                                    //组装表数据
                                    tdBodys += '<td height="30px">'+series[j].data[i]+'</td>';
                                }
                                table += '<tr><td height="30px" style="padding: 0 10px">'+axisData[i]+'</td>'+tdBodys+'</tr>';
                                tdBodys = '';
                            }
                            
                            for (var i = 0, l = axisData.length; i < l; i++) {
                                    for(var n=0;n<series.length;n++){
                                        if(series[n].data[i]){
                                            sum[n] += Number(series[n].data[i]);
                                        }else{
                                            sum[n] += Number(0);
                                        }
                        
                                    }
                                }


                            //最后一行加上合计
                            table +=  '<td>合计</td>';
                            for(var n=0;n<series.length;n++){
                                if(String(sum[n]).indexOf(".")>-1)
                                    table += '<td>' + (Number(sum[n])).toFixed(2)  + '</td>';
                                else
                                    table += '<td>' + Number(sum[n])  + '</td>';
                            }
                            table += '</tbody></table>';
                            return table;
                        }
                    },
                    magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore : {show: false},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            dataZoom : {
                show : true,
                realtime : true,
                start : 0,
                end : 100
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : hengxiang
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'A相电流',
                    type:'line',
                    data:aQuadrantCurrentList
                },

                {
                    name:'B相电流',
                    type:'line',
                    data:bQuadrantCurrentList
                },

                {
                    name:'C相电流',
                    type:'line',
                    data:cQuadrantCurrentList
                }
            ]
        };
        //基于准本好的DOM，初始化echarts实例
        this.chartmainline = this.$echarts.init(document.getElementById(type),'shine');
        //绘制图表
        this.chartmainline.setOption(option,true);
      },
    
    findAnyData(type){
        var that = this;
        if(this.radio == 1){
           if(this.form.startMonth == '' || this.form.startMonth == null){
            this.$alert('开始月份不得为空', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    
                }
            });
            return;
          }else if(this.form.startMonth == '' || this.form.startMonth == null){
              this.$alert('结束月份不得为空', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                      
                  }
              });
              return;
          }
        }else if(this.radio == 3 || this.radio == 6){
           if(this.form.startDate == '' || this.form.startDate == null){
            this.$alert('开始日期不得为空', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    
                }
              });
              return;
          }else if(this.form.endDate == '' || this.form.endDate == null){
              this.$alert('结束日期不得为空', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                      
                  }
              });
              return;
          }
        }
        that.$ajax.post
        (
          `${BaseURL}/powerData/electricEnergyConsumptionStatistics`,
            that.form
          )
        .then(res => {
          var hengxiang = res.data.timeList;
          var aQuadrantCurrentList = res.data.aQuadrantCurrentList;
          var bQuadrantCurrentList = res.data.bQuadrantCurrentList;
          var cQuadrantCurrentList = res.data.cQuadrantCurrentList;
          that.drawLine(type,hengxiang,aQuadrantCurrentList,bQuadrantCurrentList,cQuadrantCurrentList);
        })
        .catch(err => console.log(err))
      },
      
      resetForm(){
          this.form.year = format(new Date(),'yyyy');
          this.form.mouth = format(new Date(),'yyyy-MM');
      },

      submitForm(){
        this.chartmainline.clear();
        this.startDateTitle = format(this.form.startDate,'yyyy-MM-dd');
        this.endDateTitle = format(this.form.endDate,'yyyy-MM-dd');
        this.startMonthTitle = format(this.form.startMonth,'yyyy-MM');
        this.endMonthTitle = format(this.form.endMonth,'yyyy-MM');
          if(this.radio == 3){
              this.form.queryFlag = 'day';
              this.form.startDate = format(this.form.startDate,'yyyy-MM-dd');
              this.form.endDate = format(this.form.endDate,'yyyy-MM-dd');
              this.findAnyData('chartmainlineDate2');
          }else if(this.radio == 6){
              this.form.queryFlag = 'hour';
              this.form.startDate = format(this.form.startDate,'yyyy-MM-dd');
              this.form.endDate = format(this.form.endDate,'yyyy-MM-dd');
              this.findAnyData('chartmainlineHour2');
          }else if(this.radio == 1){
              this.form.queryFlag = 'month';
              this.form.startMonth = format(this.form.startMonth,'yyyy-MM');
              this.form.endMonth = format(this.form.endMonth,'yyyy-MM');
              this.findAnyData('chartmainlineMonth2');
          }
      },

      radioChange(val){
          if(val == 3){
              this.form.queryFlag = 'day';
              this.form.startDate = format(this.form.startDate,'yyyy-MM-dd');
              this.form.endDate = format(this.form.endDate,'yyyy-MM-dd');
              this.findAnyData('chartmainlineDate2');
          }else if(val == 6){
              this.form.queryFlag = 'hour';
              this.form.startDate = format(this.form.startDate,'yyyy-MM-dd');
              this.form.endDate = format(this.form.endDate,'yyyy-MM-dd');
              this.findAnyData('chartmainlineHour2');
          }else if(val == 1){
              this.form.queryFlag = 'month';
              this.form.startMonth = format(this.form.startMonth,'yyyy-MM');
              this.form.endMonth = format(this.form.endMonth,'yyyy-MM');
              this.findAnyData('chartmainlineMonth2');
          }
      }
    }
})
</script>
<style>
#chartmainlineMouth4 div:nth-last-child(1)
{
  margin-top:-5px
}

#chartmainlineYear4 div:nth-last-child(1)
{
  margin-top:-5px
}

#chartmainlineY4 div:nth-last-child(1)
{
  margin-top:-5px
}
</style>



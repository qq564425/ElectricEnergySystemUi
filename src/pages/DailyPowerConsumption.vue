<template>
  <div>
   <div>
     <DailyPowerSearchForm></DailyPowerSearchForm>
   </div>
   <div style="margin-top:20px">
      <DailyPowerConsumptionTable></DailyPowerConsumptionTable>
   </div>
 </div>
</template>

<script>
import DailyPowerConsumptionTable from './DailyPowerConsumption/DailyPowerConsumptionTable.vue'
import DailyPowerSearchForm from './DailyPowerConsumption/DailyPowerSearchForm.vue'
export default {
   data() {
     return {
       
     }
   },
   components: {
     DailyPowerConsumptionTable,
     DailyPowerSearchForm
   }
}
</script>

<style>

</style>

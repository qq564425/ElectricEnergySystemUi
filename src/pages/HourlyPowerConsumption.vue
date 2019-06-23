<template>
  <div>
   <div>
     <HourlyPowerSearchForm></HourlyPowerSearchForm>
   </div>
   <div style="margin-top:20px">
      <HourlyPowerConsumptionTable></HourlyPowerConsumptionTable>
   </div>
 </div>
</template>

<script>
import HourlyPowerConsumptionTable from './HourlyPowerConsumption/HourlyPowerConsumptionTable'
import HourlyPowerSearchForm from './HourlyPowerConsumption/HourlyPowerSearchForm'
export default {
   data() {
     return {
       
     }
   },
   components: {
     HourlyPowerConsumptionTable,
     HourlyPowerSearchForm
   }
}
</script>

<style>

</style>

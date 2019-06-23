<template>
  <div>
   <div>
     <MonthlyPowerSearchForm></MonthlyPowerSearchForm>
   </div>
   <div style="margin-top:20px">
      <MonthlyPowerConsumptionTable></MonthlyPowerConsumptionTable>
   </div>
 </div>
</template>

<script>
import MonthlyPowerConsumptionTable from './MonthlyPowerConsumption/MonthlyPowerConsumptionTable'
import MonthlyPowerSearchForm from './MonthlyPowerConsumption/MonthlyPowerSearchForm'
export default {
   data() {
     return {
       
     }
   },
   components: {
     MonthlyPowerConsumptionTable,
     MonthlyPowerSearchForm
   }
}
</script>

<style>

</style>

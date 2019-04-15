<template>
  <div>
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal
      title="Basic Modal"
      v-model="visible"
      width="900px"
      @ok="handleOk"
      @cancel="cancel2"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      console.log(e);
      this.visible = false
    },
    cancel2(){
      alert(2);
    }
  }
}
</script>
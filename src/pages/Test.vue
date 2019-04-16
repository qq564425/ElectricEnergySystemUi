<template>
  <a-popover
    title="Title"
    trigger="click"
    v-model="visible"
  >  
    <template slot="content">
        <p>Content</p>
        <p>Content</p>
    </template>
    <a @click="hide" slot="content">Close</a>
    <a-button type="primary">Click me</a-button>
  </a-popover>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
    }
  },
  methods: {
    hide () {
      console.log(111)
      this.visible = false
    },
  },
}
</script>
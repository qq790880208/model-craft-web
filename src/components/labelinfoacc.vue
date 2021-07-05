<template>
  <div>
    <el-row>
    <!-- <el-input 
    v-model="input" 
    placeholder="请输入内容" 
    style="width:150px" 
    clearable
    ></el-input> -->
    <p style="width:40px;display:inline-block">{{nowindex}}、</p>
    <el-input style="width:150px" v-model="inputname" :disabled="true"></el-input>
    </el-row>
  </div>
</template>

<script>
 export default {
   name:'',
   data () {
     return {
       input: "",
       value: ''
     }
   },
   props: {
     inputname:String,
     nowindex:Number,
     typelabel: {
      type: Array,
      default: () => [],
     },
   },
   methods: {

   },
   components: {

   }
 }
</script>

<style scpoed>
 
</style>

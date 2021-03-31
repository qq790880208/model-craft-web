<template>
  <div :style="{
    
  }">
    <el-row>
    <el-input 
    v-model="input" 
    placeholder="请输入内容" 
    style="width:300px" 
    clearable
    ></el-input>
    <el-input style="width:300px" v-model="inputname" :disabled="true"></el-input>
    <el-button @click="changefatherinfo" type="primary">保存</el-button>
    <el-button @click="deletefatherlabel" type="danger">删除</el-button>
    </el-row>
  </div>
</template>

<script>
 export default {
   name:'',
   data () {
     return {
       input: ""
     }
   },
   props: {
     inputname:String,
     ishighlight:Boolean
   },
   methods: {
     //通知父方法删除对应的div和标注框
     deletefatherlabel(){
       console.log(this.input)
       this.$emit("deletelabel")
       //console.log("emit!!!!!!!!!")
     },
     //保存输入的标注信息
     changefatherinfo(){
       console.log(this.input)
       console.log(this.inputname)
       this.$emit("changeinfo",this.input)
       this.input=""
     }
   },
   components: {

   }
 }
</script>

<style scpoed>
 
</style>

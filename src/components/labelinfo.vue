<template>
  <div>
    <el-row>
    <!-- <el-input 
    v-model="input" 
    placeholder="请输入内容" 
    style="width:150px" 
    clearable
    ></el-input> -->
    <el-select v-model="value" filterable placeholder="请选择">
      <el-option
      v-for="item in typelabel"
      :key="item.value"
      :label="item.label"
      :value="item.label">
     </el-option>
    </el-select>
    <el-input style="width:150px" v-model="inputname" :disabled="true"></el-input>
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
       input: "",
       value: ''
     }
   },
   props: {
     inputname:String,
     typelabel: {
      type: Array,
      default: () => [],
     },
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
       console.log(this.value)
       console.log(this.inputname)
       this.$emit("changeinfo",this.value)
     }
   },
   components: {

   }
 }
</script>

<style scpoed>
 
</style>

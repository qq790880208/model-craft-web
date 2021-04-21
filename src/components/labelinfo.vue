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
    <el-select v-model="value" @change="changefatherinfo" filterable placeholder=" " style="width:40px" ref="selectref">
      <el-option
      v-for="item in typelabel"
      :key="item.value"
      :label="item.label"
      :value="item.label">
     </el-option>
    </el-select>

    <!-- <el-button @click="changefatherinfo" type="primary">保存</el-button> -->
    <el-button @click="deletefatherlabel" type="danger" style="width:100px;margin-left:10px" >删除</el-button>
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
     //通知父方法删除对应的div和标注框
     deletefatherlabel(){
       //console.log(this.input)
       //this.value=this.inputname
       this.$emit("deletelabel")
       //this.$refs.selectref.placeholder='请选择类别'

       //console.log("emit!!!!!!!!!")
     },
     //保存输入的标注信息
     changefatherinfo(){
       console.log(this.value)
       console.log(this.inputname)
       this.$emit("changeinfo",this.value)
       this.value=''
     }
   },
   components: {

   }
 }
</script>

<style scpoed>
 
</style>

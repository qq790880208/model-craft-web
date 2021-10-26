<template>
  <div>
    <el-row>
      <p style="width:40px;display:inline-block">{{nowindex}}、</p>
    <el-input 
    v-model="input1" 
    placeholder="请输入拼音" 
    style="width:150px" 
    @blur="changefathertext1"
    clearable
    ></el-input>
    <el-input style="width:150px" v-model="inputname1" :disabled="true" ></el-input>
    <el-input 
    v-model="input2" 
    placeholder="请输入汉字 " 
    style="width:150px" 
    @blur="changefathertext2"
    clearable
    ></el-input>
    <el-input style="width:150px" v-model="inputname2" :disabled="true" ></el-input>
    <!-- <el-button @click="changefatherinfo" type="primary">保存</el-button> -->
    <el-button @click="deletefatherlabel" type="danger" style="width:100px;margin-left:10px">删除</el-button>
    </el-row>
  </div>
</template>

<script>
 export default {
   name:'',
   data () {
     return {
       input1: "",
       input2: ""
     }
   },
   props: {
     nowindex:Number,
     inputname1:String,
     inputname2:String
   },
   methods: {
     //通知父方法删除对应的div和标注框
     deletefatherlabel(){
       console.log(this.input1)
       console.log(this.input2)
       this.$emit("deletelabel")
       //console.log("emit!!!!!!!!!")
     },
     //保存输入的标注信息
     changefathertext1(){
       console.log(this.input1)
       console.log(this.inputname1)
       this.$emit("changetext1",this.input1)
       this.input1=""
     },
     changefathertext2(){
       console.log(this.input2)
       console.log(this.inputname2)
       this.$emit("changetext2",this.input2)
       this.input2=""
     }
   },
   components: {

   }
 }
</script>

<style scpoed>
 
</style>

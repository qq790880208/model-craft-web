<template>
  <div :style="{
    
  }">
    <el-row>
    <el-input 
    v-model="width" 
    placeholder="宽" 
    style="width:80px" 
    clearable
    ></el-input>
    <el-input style="width:80px" v-model="rwidth" :disabled="true"></el-input>
        <el-input 
    v-model="height" 
    placeholder="高" 
    style="width:80px" 
    clearable
    ></el-input>
    <el-input style="width:80px" v-model="rheight" :disabled="true"></el-input>
        <el-input 
    v-model="long" 
    placeholder="深" 
    style="width:80px" 
    clearable
    ></el-input>
    <el-input style="width:80px" v-model="rlong" :disabled="true"></el-input>
        <el-input 
    v-model="angle" 
    placeholder="角度" 
    style="width:80px" 
    clearable
    ></el-input>
    <el-input style="width:80px" v-model="rangle" :disabled="true"></el-input>
    <el-button @click="changefatherinfo" type="primary">保存</el-button>
    <el-button @click="changefatherupdown" type="primary">切换前后</el-button>
    <el-button @click="changeFatherFront" type="primary">切换正面</el-button>
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
       width:"",
       height:"",
       long:"",
       angle:"",
     }
   },
   props: {
     inputname:String,
     rwidth:Number,
     rheight:Number,
     rlong:Number,
     rangle:Number,
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
       console.log(this.width,this.height,this.long,this.angle)
       console.log(this.rwidth,this.rheight,this.rlong,this.rangle)
       this.$emit("changeinfo",this.width,this.height,this.long,this.angle)
       //this.input=""
     },
     changefatherupdown(){
        this.$emit("changeupdown")
     },
     changeFatherFront(){
       this.$emit("changeFront")
     }
   },
   components: {

   }
 }
</script>

<style scpoed>
 
</style>

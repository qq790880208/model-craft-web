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
    <el-input :style="{width:this.divWidth*0.15+'px'}"  v-model="inputname" :disabled="true"></el-input>
    <el-select v-model="value" @change="changefatherinfo" filterable placeholder=" " style="width:40px" ref="selectref">
      <el-option
      v-for="item in typelabel"
      :key="item.value"
      :label="item.label"
      :value="item.label">
     </el-option>
    </el-select>

    <!-- <el-button @click="changefatherinfo" type="primary">保存</el-button> -->
    <el-button @click="deletefatherlabel" type="danger" :style="{width:this.divWidth*0.1+'px', marginLeft:10+'px'}" >删除</el-button>
    </el-row>
  </div>
</template>

<script>
 export default {
   name:'',
   data () {
     return {
       input: "",
       value: '',
       divWidth:1000,
       divHeight:750
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
      GetWindowInfo(){
        // 获取浏览器高宽
        if(window.innerWidth>1650) {
          this.divWidth=1000;
          this.divHeight=750;
        } else if(window.innerWidth>800){
          this.divWidth=1000*(window.innerWidth/1650);
          this.divHeight=750*(window.innerWidth/1650)
        } else {
          this.divWidth=500;
          this.divHeight=375;
        }
      },
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

   },
  destroyed(){
    window.removeEventListener('resize', this.GetWindowInfo)
  },
  mounted: function () {
    window.addEventListener('resize', this.GetWindowInfo); //注册监听器
    this.GetWindowInfo() //页面创建时先调用一次
    //this.updatelastdata();
  },
 }
</script>

<style scpoed>
 
</style>

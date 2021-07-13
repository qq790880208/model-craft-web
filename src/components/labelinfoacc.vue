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

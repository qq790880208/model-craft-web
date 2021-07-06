<template>
  <div class="ih-item">
    <!-- <p>已标注</p> -->
      <!-- <el-button @click="kanurl">kanurl</el-button> -->
      <a>
      <div >
        <img 
          :style="{
            //width: '10%px',
            height: 200+'px',
            border: '3px solid '+this.markcolor,
            //display:'inline',
            //c
          }
          "
          :src="imagesrc"
          @mousedown="entermark"
        >
      </div>
        <div class="info" style="{width:100%;}">
          <h3 style="color:rgba(255,255,255,1)"
          >{{ismarkedtext}}</h3>
          <!-- <p class="date">2013-4-12</p> -->
      </div>
      </a>
  </div>
</template>

<script>
 export default {
   name:'',
   data () {
     return {
       input: "",

       //markcolor:'rgba(128,0,0,0.75)'
     }
   },
   props: {
     fatherimagesrc: String,
     ismarked:{
      type: Number,
      default: false,
    },
     ishighlight:Boolean
   },
   destroyed(){
    console.log("miniimageddddddddddddddddddddddddddddddddddddddddddddddddddddd")
   },
    computed: {
    imagesrc: function () {
      return this.fatherimagesrc;
    },
    markcolor(){
        if(this.ismarked===1) return '#000000'
        else if(this.ismarked ===2) return '#ff0000'
        else if(this.ismarked ===3) return '#ffff00'
        else return '#ffffff'
    },
    ismarkedtext: function(){
      if(this.ismarked===1) return '已通过'
      else if(this.ismarked ===2) return '未通过'
      else if(this.ismarked ===3) return '已重置'
      else return '未验收' 
    }
    },
  methods:{
      kanurl(){
          console.log(this.imagesrc)
      },
      entermark(){
          console.log("entermark")
          this.$emit("entermark")
      }
  },
   components: {

   }
 }
</script>

<style scpoed>
img:hover{
  filter: blur(3px);
}
.ih-item{           
    position: relative;
    /* width: 220px; */
    display: inline-block;
    height: 200px;
    } 
    .ih-item .img img{
    /* position: relative; */
    /* width: 220px; */
    height: 220px;
    max-width: 100%;
    } 
.ih-item .info {
position: absolute;
    top: 150px;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    -webkit-backface-visibility: hidden;/* 隐藏旋转元素的背面*/
    backface-visibility: hidden;
    background: rgba(0, 0, 0, 0.2);   /*后面这个0.6是指的背景的透明度*/
    
    opacity: 0;
    -webkit-transition: all 0.35s ease-in-out;   /*规定提示信息怎样出现ease-in-out以慢速度开始和结束*/
    -moz-transition: all 0.35s ease-in-out;
    transition: all 0.35s ease-in-out;
}
.ih-item a:hover .info {
    opacity: 1;    /*有opacity有0变成1*/            
}
</style>

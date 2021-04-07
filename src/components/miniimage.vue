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
      	<!-- <figcaption>
							<h3>Settings</h3>
							<span>Jacob Cummings</span>
							<a href="#">Take a look</a>
				</figcaption> -->
      </div>
        <div class="info">
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
        if(this.ismarked===0) return '#ffffff'
        else return '#ff0000'
    },
    ismarkedtext: function(){
      if(this.ismarked===0) return '未标注'
        else return '已标注'
    }
    },
    // watch: {
    //     ismarked(){
    //         console.log("ismarkedchange!")
    //         if(this.ismarked===0) 
    //         {
    //           this.ismarkedtext='未标注'
    //           //this.markcolor='#ffffff'
    //         }
    //         else 
    //         {
    //           this.ismarkedtext='已标注'
    //           //his.markcolor='#ff0000'
    //         }
    //     }
    // },
//     //监听图片变化
//     imagesrc() {
//       let image = new Image();
//       image.src = this.imagesrc;
//       //保证图片加载完成之后读取数据
//       image.onload=() =>{
//       console.log("image onload ")

//       if(image.width<600&&image.height<600){
//         this.imagewidth=image.width*1.5
//         this.imageheight=image.height*1.5
//         this.scalewidth = 1.5
//         this.scaleheight = 1.5
//       }
//       else{
//         this.imagewidth = image.width;
//         this.imageheight = image.height;
//         this.scalewidth = 1
//         this.scaleheight = 1
//       }

//       console.log(this.imagewidth);
//       console.log(this.imageheight);
//       console.log(this.scalewidth);
//       console.log(this.scaleheight);
//       this.boxArry = [],
//       this.labelArry = [],
//       this.num = 1
//       }
//     },
//   },
  methods:{
      kanurl(){
          console.log(this.imagesrc)
      },
      entermark(){
          console.log("entermark")
          this.$emit("entermark")
      }
  },
    
//    methods: {
//      //通知父方法删除对应的div和标注框
//      deletefatherlabel(){
//        console.log(this.input)
//        this.$emit("deletelabel")
//        //console.log("emit!!!!!!!!!")
//      },
//      //保存输入的标注信息
//      changefatherinfo(){
//        console.log(this.input)
//        console.log(this.inputname)
//        this.$emit("changeinfo",this.input)
//        this.input=""
//      }
//    },
   components: {

   }
 }
</script>

<style scpoed>
img:hover{
  filter: blur(3px);
}
/* img:hover p{
  display: block;
}
p{
  display: none;
} */
.ih-item{           
    position: relative;
    /* width: 220px; */
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
  /* .info h3{padding:5px;font-size:16px;}
  .col-sm-6:hover .info{opacity:1;} */


 /* .cs-style-1 figcaption {
  height: 100%;
  width: 100%;
  opacity: 0;
  text-align: center;
  backface-visibility: hidden;
  transition: transform 0.3s, opacity 0.3s;
}
.no-touch .cs-style-1 figure:hover figcaption,
.cs-style-1 figure.cs-hover figcaption {
  opacity: 1;
  transform: translate(15px, 15px);
}
.cs-style-1 figcaption h3 {
  margin-top: 70px;
}
.cs-style-1 figcaption span {
  display: block;
}
.cs-style-1 figcaption a {
  margin-top: 30px;
} */
</style>

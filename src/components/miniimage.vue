<template>
  <div >
      <!-- <el-button @click="kanurl">kanurl</el-button> -->
        <img
          :style="{
            //width: '10%px',
            height: 200+'px',
            border: '5px solid '+this.markcolor,
            display:'inline',
            color:'rgba(128,0,0,0.75)'
          }
          "
          :src="imagesrc"
          @mousedown="entermark"
        />
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
    }
    },
    watch: {
        ismarked(){
            console.log("ismarkedchange!")
            if(this.ismarked===0) this.markcolor='#ffffff'
            else this.markcolor='#ff0000'
        }
    },
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
 
</style>

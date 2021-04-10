<template>
  <div class="ih-item">
    <a>
      <span v-if="parentSelectList.indexOf(parentUuid)!=-1">
          选中
        </span>
      <div >
        <img 
          :style="{
            height: 200+'px',
            border: '3px solid '+this.markcolor,
          }
          "
          :src="imagesrc"
          @click="select"
        >
        
      </div>
      <div class="info">
          <h3 style="color:rgba(255,255,255,1)"
          >{{ismarkedtext}}</h3>
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
       visible: false
     }
   },
   props: {
     fatherimagesrc: String,
     ismarked: {
       type: Number,
       default: false,
     },
     parentSelectList: [],
     parentUuid: '',
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
    },
    isSelect: function() {
      if(this.isSelected === 1) return '选中'
      else return ''
    }
  },
  methods:{
      kanurl(){
        console.log(this.imagesrc)
      },
      select(){
        console.log('hhhhhhhhhhhhh123456789')
        var _index = this.checkSelect(this.parentUuid)
        console.log('index =============')
        // if (_index != -1) {
        //   this.visible = true
        // } else {
        //   this.visible = false
        // }
        console.log(_index)
        if(~_index){
          console.log('存在')
          this.parentSelectList.splice(_index,1)
        }else{
          console.log('不存在')
          this.parentSelectList.push(this.parentUuid)
        }
        this.$emit("childSelectList", this.parentSelectList)
      },
      checkSelect(id){
        return this.parentSelectList.indexOf(id);
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
    height: 200px;
    } 
    .ih-item .img img{
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
.ih-item .select {
  top: 0px;
  bottom: 150px;
  left: 0;
  right: 0;
  text-align: right;
} 
</style>

<template>
  <div class="ih-item">
    <a>
      <div>
        <div v-if="parentSelectList.indexOf(parentUuid)!=-1" class="checked">
          <div class="topic-shade">
            <img src="./imag/checkbox.png" style="width: 20px;height: 20px;" alt>
          </div>
        </div>
        <div
          class="test1"
          :style="{
            //hover: 'filter: blur(1px);}',
            //filter:'blur(1px)',
            height: 200+'px',
            border: '3px solid '+ markcolor1
          }
          "
          @mousedown="entermark"
        >
          <a>{{ nowaudioname }}</a>
        </div>
      </div>
      <div class="info" style="{width:100%;}">
        <h3
          style="color:rgba(255,255,255,1)"
        >{{ ismarkedtext }}</h3>
        <!-- <p class="date">2013-4-12</p> -->
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: '',
  components: {

  },
  props: {
    audioname: String,
    ismarked: {
      type: Number,
      default: false
    },
    ishighlight:Boolean
  },
  data() {
    return {
      input: ''
    }
  },
  computed: {
    nowaudioname: function() {
      const str = this.audioname
      const index = str.lastIndexOf('/')
      console.log(str)
      // return this.audioname
      return str.substring(index)
    },
    markcolor(){
        if(this.ismarked===1) return '#ffffff'
        else if(this.ismarked ===2) return '#ff0000'
        else if(this.ismarked ===3) return '#ffff00'
        else return '#000000'
    },
    ismarkedtext: function(){
      if(this.ismarked===2) return '已通过'
      else if(this.ismarked ===3) return '已驳回'
      else if(this.ismarked ===4) return '已重置'
      else return '未审核' 
    }
  },
  destroyed() {
    console.log('miniimageddddddddddddddddddddddddddddddddddddddddddddddddddddd')
  },
  methods: {
    kanurl() {
      console.log(this.audioname)
    },
    entermark(){
          console.log("entermark")
          this.$emit("entermark")
      }
  }
}
</script>

<style scpoed>
img.test1:hover{
  /* filter: brightness(50%); */
  color:rgba(128,255,255,1)
}
/* .testimg :hover{
  filter: blur(1px);
} */
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
/* .checked {
  font-size: 15px;
 font-style: normal;
 display: inline-block;
 width: 18px;
 border-radius: 15px;
 height: 18px;
 text-align: center;
 line-height: 18px;
 color: rgb(253, 253, 253);
 vertical-align: middle;
 margin: -2px 2px 1px 0px;
 border: #f8f7f6 1px solid;
 background-color: rgb(250, 0, 0);
 margin: -6px;
  margin-top: -382px;
} */
/* .checked:hover {
  margin-left: 0px;
} */
.topic-shade{
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: absolute;
  left: 3px;
  top: 3px;
}
</style>

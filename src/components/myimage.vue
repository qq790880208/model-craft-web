<template>
  <div class="ih-item">
    <a>
      <div>
        <div v-if="parentSelectList.indexOf(parentUuid)!=-1" class="checked">
          <div class="topic-shade">
            <img src="./imag/checkbox.png" style="width: 20px;height: 20px;" alt />
          </div>
        </div>
        <img
          class="test1"
          :style="{
            //hover: 'filter: blur(1px);}',
            //filter:'blur(1px)',
            height: 200+'px',
            border: '3px solid '+ markcolor1
          }
          "
          :src="imagesrc"
          @click="select"
        >

      </div>
      <div class="info">
        <h3 style="color:rgba(255,255,255,1)">{{ ismarkedtext }}</h3>
      </div>
      <!-- <div class="info" style="width:100%;height:100%;color:rgba(64,128,192,1)">
      </div> -->
    </a>
  </div>
</template>

<script>
export default {
  name: '',
  components: {

  },
  props: {
    fatherimagesrc: String,
    ismarked: {
      type: Number,
      default: false,
    },
    parentUuid: '',
    parentSelectList: '',
    ishighlight: Boolean
  },
  data() {
    return {
      input: '',
      // parentSelectList: [],
      visible: false
    }
  },
  computed: {
    imagesrc: function() {
      return this.fatherimagesrc
    },
    markcolor() {
      if (this.ismarked === 1) return '#ff0000'
      else return '#ffffff'
    },
    ismarkedtext: function() {
      if (this.ismarked === 1) return '已标注'
      else return '未标注'
    },
    isSelect: function() {
      if (this.isSelected === 1) return '选中'
      else return ''
    },
    markcolor1() {
      if (this.parentSelectList.indexOf(this.parentUuid) !== -1) return '#1334ed'
      else return '#EEF3FF'
    }
  },
  destroyed() {
    console.log('miniimageddddddddddddddddddddddddddddddddddddddddddddddddddddd')
  },
  methods: {
    kanurl() {
      console.log(this.imagesrc)
    },
    select() {
      console.log('hhhhhhhhhhhhh123456789')
      var _index = this.checkSelect(this.parentUuid)
      console.log('index =============')
      // if (_index != -1) {
      //   this.visible = true
      // } else {
      //   this.visible = false
      // }
      console.log(_index)
      if (~_index) {
        console.log('存在')
        this.parentSelectList.splice(_index, 1)
      } else {
        console.log('不存在')
        this.parentSelectList.push(this.parentUuid)
        console.log('seleeeeeeeeeeeeeeeeeeeeee')
        console.log(this.parentSelectList)
      }
      this.$emit('childSelectList', this.parentSelectList)
    },
    checkSelect(id) {
      return this.parentSelectList.indexOf(id)
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

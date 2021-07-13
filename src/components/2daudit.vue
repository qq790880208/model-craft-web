<template>
  <div
    id="test"
    :style="{
      userSelect: 'none',
    }"
  >
    <div :style="{
        //background: 'rgb(192, 192, 192)',
        //width:this.imagewidth+'px',
        display: 'block',}">
      <div
        :style="{
          //background: 'rgb(192, 192, 192)',
          //width:this.imagewidth+'px',
          marginLeft: (this.divWidth-379) / 2 + 'px',
          display: 'block',
        }"
      >
        <el-radio-group v-model="radio" style="display: inline-block">
          <el-radio-button label="drag" class="el-icon-rank"
            >拖动</el-radio-button
          >
        </el-radio-group>
        <el-button-group style="display: inline-block">
          <el-button
            @click="fangda"
            icon="el-icon-zoom-in"
            :style="{ width: 80 + 'px' }"
          ></el-button>
          <el-button
            @click="suoxiao"
            icon="el-icon-zoom-out"
            :style="{ width: 80 + 'px' }"
          ></el-button>
          <el-button
            @click="huanyuan"
            icon="el-icon-refresh"
            :style="{ width: 80 + 'px' }"
          ></el-button>
          <!-- <el-button @click="saveinfo">保存 </el-button>
        <el-button @click="updatelastdata">查看上次标注数据</el-button> -->
        </el-button-group>
      </div>
    </div>
    <div
      :style="{
        display: 'flex',
      }"
    >
      <div
        :style="{
          maxWidth: 1000 + 'px',
          maxHeight: 1000 + 'px',
          //display:flex
        }"
      >
        <div
          class="content"
          :style="{
            //width: this.imagewidth + 'px',
            //height: this.imageheight + 'px',
            width: this.divWidth + 'px',
            height: this.divHeight + 'px',
            //float: 'left',
            display: 'inline-block',
            marginLeft: 0 + 'px',
          }"
          id:contentfather
        >
          <div
            ref="canvesdiv"
            :style="{
              transform: 'scale(' + num + ')',
              position: 'relative',
              //width: '100%',
              //height: '100%',
              width: this.imagewidth + 'px',
              height: this.imageheight + 'px',
              marginLeft: this.mleft + 'px',
              marginTop: this.mtop + 'px',
              display: 'inline-block',
              //float:left
            }"
            @mousedown.stop="moveMouse"
            @click="getOffect"
          >
            <div
              :class="
                'biaozhu' + index == 'biaozhu' + b_i
                  ? 'biaozhu b_border'
                  : 'biaozhu'
              "
              :ref="'biaozhu' + index"
              @mousedown="handelClick(index)"
              @mousedown.stop="move(true, null, $event)"
              v-for="(item, index) in boxArry"
              :key="index"
              :style="{
                width: item.width + 'px',
                height: item.height + 'px',
                position: 'absolute',
                left: item.left + 'px',
                top: item.top + 'px',
                //background: item.mymarkcolor,
                background: item.color,
                //border: '5px solid #666',
                border: 'none',
              }"
            >
            </div>
            <div
              :style="{
                height: biaozhuHeight + 'px',
                width: biaozhuWidth + 'px',
                top: biaozhuTop + 'px',
                left: biaozhuLeft + 'px',
                position: 'absolute',
                background: 'rgba(43,100,206,0.5)',
              }"
            ></div>
            <img
              style="
                width: 100%;
                height: 100%;
                pointer-events: none;
                border: 1px solid #666;
              "
              :src="imagesrc"
            />
          </div>
        </div>
      </div>
      <div class="el-divider el-divider--vertical"></div>
      <div
        id="labelfather"
        :style="{
          maxWidth:450+'px',
          maxHeight:800+'px',
          //border: '1px solid #666',
          //float:'left',
          overflow:'auto',
          display: 'inline-block',
          marginLeft: 20 + 'px',
          marginTop: 0 + 'px',
          right: 0 + 'px',
        }"
      >
        <h3>当前文件标签</h3>
        <h4 style="margin-left: 80px; display:inline-block;">目前标签</h4>
        <h4 style="margin-left: 85px; display:inline-block;">选择标注标签</h4>
        <div
          v-for="(items, index) in boxArry"
          :key="index"
          :style="{
            display: 'block',
            marginTop: 10 + 'px',
            //float:left,
            marginLeft: 50 + 'px',
            //margin-top:20px,
          }"
        >
          <!-- <el-row> -->
          <labelinfo 
            :inputname="labelArry[index].info"
            :typelabel="markinfoArry"
            :nowindex="index+1"
            @mousedown.native="handelClick(index)"
            :style="{
              //textAlign:'center',
              border: b_i === index ? '1px solid #ff0000' : '0px solid #ff0000',
            }"
          ></labelinfo>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import labelinfo from "@/components/labelinfoacc.vue";
export default {
  //input: 1
  props: {
    fatherimagesrc: String,
    imageindex: Number,
    premarktype: {
      type: Array,
      default: () => [],
    },
    lastlabelArry: {
      type: Array,
      default: () => [],
    },
  },
  destroyed(){
    window.removeEventListener('resize', this.GetWindowInfo)
  },
  mounted: function () {
    this.imagechange();
    this.defaultlabel=this.premarktype[0].name;
    this.defaultcolor=this.premarktype[0].color;
    window.addEventListener('resize', this.GetWindowInfo); //注册监听器
    this.GetWindowInfo() //页面创建时先调用一次
    //this.updatelastdata();
  },
  components: {
    labelinfo,
  },
  computed: {
    imagesrc: function () {
      return this.fatherimagesrc;
    },
  },
  watch: {
    //监听图片变化
    imagesrc() {
      this.imagechange();
      //this.updatelastdata();
    },
  },
  data() {
    return {
      radio: "mark",
      num: 1,
      defaultlabel:null,
      defaultcolor:null,
      divWidth: 1000,
      divHeight: 750,
      imagewidth: 800, //图片宽度像素数
      imageheight: 800, //图片高度像素数
      scalewidth: null, //图片宽度缩放倍数
      scaleheight: null, //图片高度缩放倍数
      boxArry: [], //显示的div对象数组
      labelArry: [], //标注信息保存数组
      //tempArry: [], //临时对象
      //testsc:"image/test2",
      //imagesrc:require('@/'+this.fatherimagesrc+'.jpg'),
      isTrue: false, //移动标注和缩放标注的切换标识
      isTrue2: false, //拖动图片和标注的切换标识
      mleft:0,
      mtop:0,
      width: "",
      height: "",
      left: "",
      top: "",
      b_i: "", //获取目前点击的div的index
      buttontext: "正在标注(切换拖动图片)",
      markcolorArry: [], //标记颜色数组
      markcolor: "rgba(43,100,206,0.5)",
      markinfoArry: [], //标记信息数组
      imageleft: 0,
      imagetop: 0,
      biaozhuHeight: 0,
      biaozhuWidth: 0,
      biaozhuTop: 0,
      biaozhuLeft: 0,
    };
  },

  methods: {
    getVuex() {
      console.log(this.$store.state.treeData);
    },
    // commitVuex() {
    //   this.$store.commit("changeTreeData", { a: 1, b: 2 });
    // },
        GetWindowInfo(){
        // 获取浏览器高宽
        if(window.innerWidth>1650) {
          this.divWidth=1000;
          this.divHeight=750;
        } else if(window.innerWidth>800){
          this.divWidth=1000-(1650-window.innerWidth);
          this.divHeight=750-(1650-window.innerWidth)*0.75
        } else {
          this.divWidth=500;
          this.divHeight=375;
        }
    },
    findcolor(abcdefg) {
      this.premarktype.forEach((item) => {
        console.log("infind", abcdefg);
        //if(item.name===null) this.markcolor = "rgba(0,128,128,0.5)";
        if (item.name === abcdefg) {
          console.log("find", item.color, typeof item.color);
          this.markcolor = item.color;
        }
      });
    },
    imagechange(){
          //加载时获取图片分辨率并设置div大小为图片的大小（有缩放）
          console.log("imagechange!")
    let image = new Image();
    image.src = this.imagesrc;
    // if(image.width===0&&image.height===0){
    //   console("reread")
    // image.src = null;
    // image.src = this.imagesrc;
    // }
    //保证图片加载完成之后读取数据
    image.onload = () => {
      console.log("image onload ");
      this.imagewidth = image.width;
      this.imageheight = image.height;
      this.scalewidth = 1;
      this.scaleheight = 1;
      
      // if (image.width < 600 && image.height < 600) {
      //   this.imagewidth = image.width * 1.5;
      //   this.imageheight = image.height * 1.5;
      //   this.scalewidth = 1.5;
      //   this.scaleheight = 1.5;
      // } else {
      //   this.imagewidth = image.width;
      //   this.imageheight = image.height;
      //   this.scalewidth = 1;
      //   this.scaleheight = 1;
      // }
      if (image.width < this.divWidth*0.8 && image.height < this.divWidth*0.8) {
        while(this.imagewidth < this.divWidth*0.8 && this.imageheight < this.divWidth*0.8) {
          this.imagewidth *=1.1;
          this.imageheight *=1.1;
          this.scalewidth *=1.1;
          this.scaleheight *=1.1;
        }
      }
      if(image.width > this.divWidth || image.height > this.divHeight){
          while(this.imagewidth > this.divWidth || this.imageheight > this.divHeight) {
          this.imagewidth /=1.1;
          this.imageheight /=1.1;
          this.scalewidth /=1.1;
          this.scaleheight /=1.1;
        }
      }
      this.mleft=(this.divWidth-this.imagewidth)/2
      this.mtop=(this.divHeight-this.imageheight)/2
      console.log("thisssssssssssssssss.imagewidth",this.imagewidth);
      console.log(this.imageheight);
      console.log(this.scalewidth);
      console.log(this.scaleheight);
      (this.boxArry = []), (this.labelArry = []);
      this.updatelastdata();
      this.huanyuan();
    }
    },
    updatelastdata() {
      //将从后台读取到的标注信息更新在前端
      console.log("update!")
      console.log("image select lastlabelArry", this.lastlabelArry);
      this.b_i = -1;
      this.boxArry = [];
      this.labelArry = [];
      this.markinfoArry = [];
      this.markcolorArry = [];
      for (let i = 0; i < this.lastlabelArry.length; i++) {
        let left = Number(this.lastlabelArry[i].x1);
        let top = Number(this.lastlabelArry[i].y1);
        let width = Number(this.lastlabelArry[i].x2 - this.lastlabelArry[i].x1);
        let height = Number(
          this.lastlabelArry[i].y2 - this.lastlabelArry[i].y1
        );
        this.findcolor(this.lastlabelArry[i].info)
        this.boxArry.push({
          width: width * this.scalewidth,
          height: height * this.scaleheight,
          left: left * this.scalewidth,
          top: top * this.scaleheight,
          color: this.markcolor
        });
        console.log("llllllllll", left, top, width, height);
        this.labelArry.push({
          x1: left,
          y1: top,
          x2: left + width,
          y2: top + height,
          info: this.lastlabelArry[i].info,
        });
        console.log("scale!",this.scalewidth,this.scaleheight)
        console.log("42343423423423fsdd", this.labelArry[i]);
        //this.labelArry.push(this.lastlabelArry[i])
      }
      for(let i =0;i<this.premarktype.length;i++){
        let a = {};
        a["value"] = i;
        a["label"] = this.premarktype[i].name;
        a["color"] = this.premarktype[i].color;
        this.markinfoArry.push(a);
      }
      console.log("markinfoArry", this.markinfoArry);
      //console.log("markcolorArry", this.markcolorArry);
      console.log("vcxxcvxvxcv", this.boxArry);
      console.log("fsdfdsfsd", this.labelArry);
    },
    changeinfo(input, i) {
      //保存标注信息
      //console.log("father"+input,i)
      this.labelArry[i].info = input;
      this.findcolor(this.labelArry[i].info);
      this.boxArry[i].color = this.markcolor;
    },
    getOffect(e) {
      console.log(e);
      document.onmouseup = null;
    },
    moveMouse(e) {
      //标注或者拖动图片的函数
      //console.log("moveMouse!!!!!!!!!!!!!!");
      let odiv = e.target; //获取目标元素
      //console.log("dsadasdasdsadsadasdasdsadsad", this.radio);
      odiv.style.left = this.imageleft + "px";
      odiv.style.top = this.imagetop + "px";
      //console.log(odiv);
      this.b_i = -1;
      // console.log(
      //   "this.imageleft",
      //   this.imageleft,
      //   "this.imagetop",
      //   this.imagetop
      // );
      //拖动图片的相对位置
      let left2 = this.imageleft;
      let top2 = this.imagetop;
      let left3 = this.mleft;
      let top3 = this.mtop;
      //算出鼠标相对元素的位置
      let disX = e.clientX + left2 + left3 - odiv.offsetLeft;
      let disY = e.clientY + top2 + top3 - odiv.offsetTop;
      //  let disX = (e.clientX - odiv.offsetLeft) / this.num;
      //  let disY = (e.clientY - odiv.offsetTop) / this.num;
      console.log("disxy", disX, disY);
      if (this.radio === "drag") {
        // 拖动图片
        console.log("moveMouse!!!!!!!!!!!!!!");
        document.onmousemove = (e) => {
          //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX + left2;
          let top = e.clientY - disY + top2;

          //绑定元素位置到positionX和positionY上面
          this.positionX = top;
          this.positionY = left;

          //移动当前元素
          odiv.style.left = left + "px";
          odiv.style.top = top + "px";
          // console.log("odiv.style.left",odiv.style.left,"odiv.style.top",odiv.style.top);
          // console.log("left2",left2,"top2",top2);
          this.imageleft = left;
          this.imagetop = top;
        };
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }
    },
    move(istrue, mtype, e) {
    },
    fangda() {
      //放大图片
      if (this.num < 10) this.num += 0.1;
      //  imagesrc=require(this.testsc)
      //  console.log(this.fatherimagesrc,this.imageindex)
    },
    suoxiao() {
      //缩小图片
      if (this.num > 0.2) this.num -= 0.1;
    },
    huanyuan() {
      //还原图片大小和位置
      this.num = 1;
      console.log(this.$refs.canvesdiv);
      let canvesdiv = this.$refs.canvesdiv;
      canvesdiv.style.left = 0 + "px";
      canvesdiv.style.top = 0 + "px";
      this.imageleft = 0;
      this.imagetop = 0;
    },
    handelClick(i) {
      //存储点击对象的index
      this.b_i = i;
      console.log("hahaha" + i);
    },
  },
};
</script>

<style scoped>
.el-divider--vertical {
    display: inline-block;
    background-color: #DCDFE6;
    width: 1px;
    height: 800px;
    margin: 0 8px;
    vertical-align: middle;
    position: relative;
}
</style>

<style lang="less">
#test {
  /deep/.el-dialog__body {
    padding: 10px 20px !important;
  }
  .content {
    width: 600px;
    height: 600px;
    background: rgb(0, 0, 0);
    //margin: 0 auto;
    overflow: hidden;
    position: relative;

    .drag_box {
      width: 150px;
      height: 90px;
      border: 1px solid #666;
      background-color: #ccc;
      /* 使用定位，脱离文档流 */
      position: relative;
      top: 100px;
      left: 100px;
      /* 鼠标移入变成拖拽手势 */
      cursor: move;
      z-index: 3000;
    }
    .b_border {
      border: 1px solid rgba(255, 0, 0, 0.5) !important;
    }
    .biaozhu {
      z-index: 9999999;
    }
    .ltc {
      //左上角的点
      position: absolute;
      left: 0;
      top: 0;
      width: 6px;
      height: 6px;
      background: green;
    }
    .ltc:hover {
      cursor: se-resize;
    }
    .rtc {
      //右上角的点
      position: absolute;
      right: 0;
      top: 0;
      width: 6px;
      height: 6px;
      background: green;
    }
    .rtc:hover {
      cursor: se-resize;
    }
    .lbc {
      //左下角的点
      position: absolute;
      left: 0;
      bottom: 0;
      width: 6px;
      height: 6px;
      background: green;
    }
    .lbc:hover {
      cursor: se-resize;
    }
    .rbc {
      //右下角的点
      position: absolute;
      right: 0;
      bottom: 0;
      width: 6px;
      height: 6px;
      background: green;
    }
    .rbc:hover {
      cursor: se-resize;
    }
    .tc {
      //顶部点
      position: absolute;
      left: 50%;
      top: 0;
      width: 6px;
      height: 6px;
      background: green;
    }
    .tc:hover {
      cursor: se-resize;
    }
    .lc {
      //左边点
      position: absolute;
      left: 0;
      top: 50%;
      width: 6px;
      height: 6px;
      background: green;
    }
    .lc:hover {
      cursor: se-resize;
    }
    .rc {
      //右边点
      position: absolute;
      right: 0;
      top: 50%;
      width: 6px;
      height: 6px;
      background: green;
    }
    .rc:hover {
      cursor: se-resize;
    }
    .bc {
      //下边点
      position: absolute;
      left: 50%;
      bottom: 0;
      width: 6px;
      height: 6px;
      background: green;
    }
    .bc:hover {
      cursor: se-resize;
    }
  }
}
</style>>


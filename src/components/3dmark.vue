<template>
  <div id="test" style="user-select: none">
    <el-button @click="gai" v-show="isTrue2">拖动图片</el-button>
    <el-button @click="gai" v-show="!isTrue2">添加标注</el-button>
    <el-button @click="fangda">放大</el-button>
    <el-button @click="suoxiao">缩小</el-button>
    <el-button @click="huanyuan">还原图片大小</el-button>
    <el-button @click="saveinfo">保存 </el-button>
    <!-- <el-button @click="updatelastdata">查看上次标注数据</el-button> -->

    <div class="content" id:contentfather>
      <div
        ref="canvesdiv"
        :style="{
          transform: 'scale(' + num + ')',
          position: 'relative',
          width: '100%',
          height: '100%',
        }"
        @mousedown.stop="moveMouse"
        @click="getOffect"
      >
        <div>
          
          <div :class=" //上面的平行四边形
              'biaozhu' + index == 'biaozhu' + b_i
                ? 'biaozhu b_border'
                : 'biaozhu'
            " @mousedown="handelClick(index)"
              @mousedown.stop="move(true,true,false, null, $event)"
            v-for="(item, index) in boxArry" :key="'parallelogram1'+index" 
              :style="{
              width: item.width + 'px',
              height: item.long + 'px',
              position: 'absolute',
              //left: (item.left/Math.sin(transformx) + item.height*Math.sin(transformx)) + 'px',
              left:(item.isdown)?(item.left+0.5*item.long*Math.tan(item.transform* Math.PI / 180))+'px':(item.left-0.5*item.long*Math.tan(item.transform* Math.PI / 180))+'px',
              //-0.5*item.height*Math.tan(transformx* Math.PI / 180)
              top: (item.isdown)?(item.top)+ 'px':(item.top - item.long)+ 'px',
              transform:'skew('+item.transform+'deg)',
              //transform:'rotateX(90)',
              background: item.front[1]==1?frontColor:item.front[1]==2?backColor:sideColor,
              border: '1px solid rgba(128, 128, 128, 0.5)' ,
            }"
          ></div>
          <div :class=" //下面的平行四边形
              'biaozhu' + index == 'biaozhu' + b_i
                ? 'biaozhu b_border'
                : 'biaozhu'
            " @mousedown="handelClick(index)"
              @mousedown.stop="move(true,true,false, null, $event)"
              v-for="(item, index) in boxArry" :key="'parallelogram2'+index" 
              :style="{
              width: item.width + 'px',
              height: item.long + 'px',
              position: 'absolute',
              //left: (item.left/Math.sin(transformx) + item.height*Math.sin(transformx)) + 'px',
              left:(item.isdown)?(item.left+0.5*item.long*Math.tan(item.transform* Math.PI / 180))+'px':(item.left-0.5*item.long*Math.tan(item.transform* Math.PI / 180))+'px',
              //-0.5*item.height*Math.tan(transformx* Math.PI / 180)
              top: (item.isdown)?(item.top+item.height)+ 'px':(item.top+item.height- item.long)+ 'px',
              transform:'skew('+item.transform+'deg)',
              background: item.front[4]==1?frontColor:item.front[4]==2?backColor:sideColor,
              border: '1px solid rgba(128, 128, 128, 0.5)' ,
            }"
          ></div>
          <div :class=" //左边的平行四边形
              'biaozhu' + index == 'biaozhu' + b_i
                ? 'biaozhu b_border'
                : 'biaozhu'
            " @mousedown="handelClick(index)"
              @mousedown.stop="move(true,true,false, null, $event)"
              v-for="(item, index) in boxArry" :key="'parallelogram3'+index" 
              :style="{
              width: Math.abs(item.long*Math.tan(item.transform* Math.PI / 180)) + 'px',
              height: item.height + 'px',
              position: 'absolute',
              //left: (item.left/Math.sin(transformx) + item.height*Math.sin(transformx)) + 'px',
              //left:(item.left-0.5*item.long*Math.tan(item.transform* Math.PI / 180))+'px',
              left: (item.isdown)? 
              (item.transform>0)?item.left+'px':item.left-Math.abs(item.long*Math.tan(item.transform* Math.PI / 180))+ 'px'
              :(item.transform>0)?item.left -Math.abs(item.long*Math.tan(item.transform* Math.PI / 180))+ 'px':item.left  +'px',
              //-0.5*item.height*Math.tan(transformx* Math.PI / 180)
              top:(item.isdown)?(item.top+item.long/2)+'px':(item.top-item.long/2)+'px',
              //top: (item.top-0.5*width/Math.tan(120* Math.PI / 180))+ 'px',
              //transform:'skew(0,120deg)',
              transform:'skew(0,'+(90-item.transform)+'deg)',
              background: item.front[5]==1?frontColor:item.front[5]==2?backColor:sideColor,
              border: '1px solid rgba(128, 128, 128, 0.5)' ,
            }"
          ></div>
          <div :class=" //右边的平行四边形
              'biaozhu' + index == 'biaozhu' + b_i
                ? 'biaozhu b_border'
                : 'biaozhu'
            " @mousedown="handelClick(index)"
              @mousedown.stop="move(true,true,false, null, $event)"
              v-for="(item, index) in boxArry" :key="'parallelogram4'+index" 
              :style="{
              width: Math.abs(item.long*Math.tan(item.transform* Math.PI / 180)) + 'px',
              height: item.height + 'px',
              position: 'absolute',
              //left: (item.left/Math.sin(transformx) + item.height*Math.sin(transformx)) + 'px',
              //left:(item.left-0.5*item.long*Math.tan(item.transform* Math.PI / 180))+'px',
              left: (item.isdown)? 
              (item.transform>0)?item.left+item.width +'px':item.left -Math.abs(item.long*Math.tan(item.transform* Math.PI / 180))+ item.width +'px'
              :(item.transform>0)?item.left -Math.abs(item.long*Math.tan(item.transform* Math.PI / 180))+ item.width +'px':item.left +item.width  +'px',
              //-0.5*item.height*Math.tan(transformx* Math.PI / 180)
              top:(item.isdown)?(item.top+item.long/2)+'px':(item.top-item.long/2)+'px',
              //top: (item.top-0.5*width/Math.tan(120* Math.PI / 180))+ 'px',
              //transform:'skew(0,120deg)',
              transform:'skew(0,'+(90-item.transform)+'deg)',
              background: item.front[2]==1?frontColor:item.front[2]==2?backColor:sideColor,
              border: '1px solid rgba(128, 128, 128, 0.5)' ,
            }"
          ></div>
          <div :class=" //背面的正方形
              'biaozhu' + index == 'biaozhu' + b_i
                ? 'biaozhu b_border'
                : 'biaozhu'
            " @mousedown="handelClick(index)"
              @mousedown.stop="move(true,false,false, null, $event)"
              v-for="(item, index) in boxArry" :key="'parallelogram5'+index" 
              :style="{
              width: item.width + 'px',
              height: item.height + 'px',
              position: 'absolute',
              left: (item.isdown)?
              (item.transform>0)?item.left + Math.abs(item.long*Math.tan(item.transform* Math.PI / 180))+ 'px':item.left - Math.abs(item.long*Math.tan(item.transform* Math.PI / 180))+ 'px'
              :(item.transform>0)?item.left - Math.abs(item.long*Math.tan(item.transform* Math.PI / 180))+ 'px':item.left + Math.abs(item.long*Math.tan(item.transform* Math.PI / 180))+ 'px',
              top:(item.isdown)? item.top + item.long + 'px':item.top - item.long + 'px',
              background: item.front[3]==1?frontColor:item.front[3]==2?backColor:sideColor,
              border: '1px solid rgba(128, 128, 128, 0.5)' ,
            }"
          >
          <div class="ltc" @mousedown.stop="move(false,true,true, null, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="rtc" @mousedown.stop="move(false,true,true, null, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="lbc" @mousedown.stop="move(false,true,true, null, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="rbc" @mousedown.stop="move(false,true,true, null, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="tc" @mousedown.stop="move(false,false,false,9, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="bc" @mousedown.stop="move(false,false,false,9, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          </div>
          <div :class="  //正面的正方形
              'biaozhu' + index == 'biaozhu' + b_i
                ? 'biaozhu b_border'
                : 'biaozhu'
            "
            @mousedown="handelClick(index)"
            @mousedown.stop="move(false,true,false, null, $event)"
            v-for="(item, index) in boxArry"
            :key="index"
            :style="{
              width: item.width + 'px',
              height: item.height + 'px',
              position: 'absolute',
              left: item.left + 'px',
              top: item.top + 'px',
              background: item.front[0]==1?frontColor:item.front[0]==2?backColor:sideColor,
              border: '1px solid rgba(128, 128, 128, 0.5)' ,
              //transform:'rotateX(90)',
            }"
          >
          <!-- <div 
              :style="{
              width: item.width + 'px',
              height: item.height + 'px',
              position: 'absolute',
              //left: (item.left/Math.sin(transformx) + item.height*Math.sin(transformx)) + 'px',
              left:(-0.5*item.height*Math.tan(transformx* Math.PI / 180))+'px',
              //-0.5*item.height*Math.tan(transformx* Math.PI / 180)
              //left: 0,
              top: -item.height + 'px',
              //top: (item.top - item.height)+ 'px',
              transform:'skew('+transformx+'deg)',
              background: 'rgba(43,100,206,0.5)',
              border: 'none',
            }"
          ></div> -->
          <div class="ltc" @mousedown.stop="move(false,false,false,1, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="rtc" @mousedown.stop="move(false,false,false,2, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="lbc" @mousedown.stop="move(false,false,false,3, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="rbc" @mousedown.stop="move(false,false,false,4, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="tc" @mousedown.stop="move(false,false,false,5, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="lc" @mousedown.stop="move(false,false,false,6, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="rc" @mousedown.stop="move(false,false,false,7, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="bc" @mousedown.stop="move(false,false,false,8, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          </div>
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
    <div id="labelfather">
      <div v-for="(items, index) in boxArry" :key="index">
        <labelinfo
          :rwidth="boxArry[index].width"
          :rheight="boxArry[index].height"
          :rlong="boxArry[index].long"
          :rangle="boxArry[index].transform"
          @deletelabel="deletelabel(index)"
          @changeinfo="changeinfo(arguments,index)"
          @changeupdown="changeupdown(index)"
          @changeFront="changeFront(index)"
          style="text-align: center"
        ></labelinfo>
      </div>
    </div>
  </div>
</template>
<script>
import labelinfo from "@/components/labelinfo3d.vue";
export default {
  //input: 1
  props: {
    fatherimagesrc: String,
    imageindex: Number,
    lastlabelArry: {
      type: Array,
      default: () => [],
    },
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
        this.scalewidth = 800 / image.width;
        this.scaleheight = 800 / image.height;
        console.log(this.imagewidth);
        console.log(this.imageheight);
        console.log(this.scalewidth);
        console.log(this.scaleheight);
        (this.boxArry = []), (this.labelArry = []), (this.num = 1);
      };
    },
  },
  data() {
    return {
      num: 1,
      imagewidth: null,
      imageheight: null,
      scalewidth: null, //图片宽度缩放倍数
      scaleheight: null, //图片高度缩放倍数
      transformx:-30,
      boxArry: [],
      // frontColor: 'rgba(43,100,206,0.75)',
      // backColor: 'rgba(128,128,128,1)',
      // sideColor: 'rgba(100,200,100,0.5)',
      frontColor: 'rgba(43,100,206,0.9)',
      backColor: 'rgba(128,64,64,0.5)',
      sideColor: 'rgba(200,200,100,0.1)',
      // topgraphArry:[],
      // leftgraphArry:[],
      // rightgraphArry:[],
      // backgraphArry:[],
      // bottomgraphArry:[],
      labelArry: [],
      tempArry: [],
      rrwidth:null,
      rrheight:null,
      rrlong:null,
      rrangle:null,
      rread:[],
      //testsc:"image/test2",
      //imagesrc:require('@/'+this.fatherimagesrc+'.jpg'),
      isTrue: false,
      isTrue2: false,
      //isdown:false,
      //stopmove: false,
      width: "",
      height: "",
      left: "",
      top: "",
      b_i: "",
      imageleft: 0,
      imagetop: 0,
      biaozhuHeight: 0,
      biaozhuWidth: 0,
      biaozhuTop: 0,
      biaozhuLeft: 0,
    };
  },
  mounted(){
    //this.checkDivScroolTop
    window.addEventListener('mousewheel', this.checkFangdasSuoxiao,true)
    //document.onkeydown = keyDownSearch;
    console.log("5432543tewsgsdgsdgsdgdsgdsgdsgdsggjnbvncv");
  },
  destroyed() {
    window.removeEventListener('mousewheel', this.checkFangdasSuoxiao);   //  离开页面清除（移除）滚轮滚动事件
    //document.onkeydown = undefined;
  },
  methods: {
    clearStep(){

    },
    checkFangdasSuoxiao(e){
      let direction = e.deltaY>0?'down':'up'
      console.log("checkFangdasSuoxiao",direction);
      if(direction=='up') this.fangda()
      else this.suoxiao()
    },
    changeupdown(index){
      this.boxArry[index].isdown=!this.boxArry[index].isdown
    },
    changeFront(index){
      console.log(this.boxArry[index].front)
      let first = this.boxArry[index].front[0]
      for(let i = 0;i<this.boxArry[index].front.length-1;i++){
        this.boxArry[index].front[i]=this.boxArry[index].front[i+1]
      }
      this.boxArry[index].front[5]=first
      this.boxArry[index].width ++
      this.boxArry[index].width --
    },
    getVuex() {
      console.log(this.$store.state.treeData);
    },
    commitVuex() {
      this.$store.commit("changeTreeData", { a: 1, b: 2 });
    },
    updatelastdata() {
      console.log("image select lastlabelArry", this.lastlabelArry);
      this.b_i = -1;
      this.boxArry = [];
      this.labelArry = [];
      for (let i = 0; i < this.lastlabelArry.length; i++) {
        let left = this.lastlabelArry[i].x1;
        let top = this.lastlabelArry[i].y1;
        let width = this.lastlabelArry[i].x2 - this.lastlabelArry[i].x1;
        let height = this.lastlabelArry[i].y2 - this.lastlabelArry[i].y1;
        this.boxArry.push({
          width: width * this.scalewidth,
          height: height * this.scaleheight,
          left: left * this.scalewidth,
          top: top * this.scaleheight,
        });
        this.labelArry.push({
          x1: left,
          y1: top,
          x2: left + width,
          y2: top + height,
          info: this.lastlabelArry[i].info,
        });
        console.log("42343423423423fsdd", this.lastlabelArry[i].x1);
        //this.labelArry.push(this.lastlabelArry[i])
      }
      console.log("vcxxcvxvxcv", this.boxArry);
      console.log("fsdfdsfsd", this.labelArry);
    },
    settrue() {
      this.isTrue2 = true;
      console.log("setture");
    },
    setfalse() {
      this.isTrue2 = false;
      console.log("setfalse");
    },
    saveinfo() {
      console.log("start!!!", this.boxArry);
      //变为深拷贝
      this.tempArry.push(JSON.parse(JSON.stringify(this.labelArry)));
      //this.tempArry[0]=this.boxArry
      this.tempArry.push(this.fatherimagesrc);
      this.tempArry.push(this.imageindex);
      this.$emit("saveimageinfo", this.tempArry, this.imageindex);
      console.log(
        "11111",
        this.tempArry,
        this.tempArry[0],
        this.tempArry[1],
        this.tempArry[2]
      );
      this.tempArry = [];
      console.log("22222", this.tempArry);
      //  this.$emit('saveimageinfo',this.boxArry,this.fatherimagesrc,this.imageindex)
      //  console.log(this.boxArry,this.fatherimagesrc,this.imageindex)
    },
    deletelabel(index) {
      this.boxArry.splice(index, 1);
      this.labelArry.splice(index, 1);
      console.log(this.boxArry);
      console.log(this.labelArry);
    },
    deletelabel2() {
      console.log(this.b_i)
      if(this.b_i<0) return;
      this.boxArry.splice(this.b_i, 1);
      this.labelArry.splice(this.b_i, 1);
      console.log(this.boxArry);
      console.log(this.labelArry);
    },
    changeinfo(rread,i) {
      //保存标注信息
      console.log("father",i,rread,rread[0],rread[1],rread[2],rread[3])
      this.boxArry[i].width = Number(rread[0]);
      this.boxArry[i].height = Number(rread[1]);
      this.boxArry[i].long = Number(rread[2]);
      this.boxArry[i].transform = Number(rread[3]);
    },
    gai() {
      this.isTrue2 = !this.isTrue2;
    },
    getOffect(e) {
      console.log(e);
      document.onmouseup = null;
      // this.left=e.offsetX
      //     this.top=e.offsetY
    },
    moveMouse(e) {
      //console.log("moveMouse!!!!!!!!!!!!!!");
      let odiv = e.target; //获取目标元素
      odiv.style.left = this.imageleft + "px";
      odiv.style.top = this.imagetop + "px";
      console.log(odiv);
      this.b_i = -1;
      console.log(
        "this.imageleft",
        this.imageleft,
        "this.imagetop",
        this.imagetop
      );
      //拖动图片的相对位置
      let left2 = this.imageleft;
      let top2 = this.imagetop;
      //算出鼠标相对元素的位置
      let disX = e.clientX + this.imageleft - odiv.offsetLeft;
      let disY = e.clientY + this.imagetop - odiv.offsetTop;
      //  let disX = (e.clientX - odiv.offsetLeft) / this.num;
      //  let disY = (e.clientY - odiv.offsetTop) / this.num;
      console.log("disxy", disX, disY);
      if (this.isTrue2) {
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
      } else {
        // 添加div
        document.onmouseup = (e) => {
          //防止点击松开之后的拖动
          //console.log("nomove mouseup!!!!!!!!!!!!!!");

          document.onmousemove = null;
          document.onmouseup = null;
        };
        console.log(e);
        document.onmousemove = (e) => {
          //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置

          //  let left = disX - odiv.getBoundingClientRect().x;
          //  let top = disY - odiv.getBoundingClientRect().y;
          let left = (disX - odiv.getBoundingClientRect().x) / this.num;
          let top = (disY - odiv.getBoundingClientRect().y) / this.num;
          //console.log("this.imageleft",this.imageleft,"this.imagetop",this.imagetop);
          console.log(e.target.offsetLeft);
          this.width = (e.clientX - disX) / this.num;
          this.height = (e.clientY - disY) / this.num;
          this.biaozhuWidth = this.width;
          this.biaozhuHeight = this.height;
          this.biaozhuLeft = left;
          this.biaozhuTop = top;
          document.onmouseup = (e) => {
            let left = (disX - odiv.getBoundingClientRect().x) / this.num;
            let top = (disY - odiv.getBoundingClientRect().y) / this.num;
            this.width = (e.clientX - disX) / this.num;
            this.height = (e.clientY - disY) / this.num;

            console.log(e.target.getBoundingClientRect(), disX, disY);

            if (this.width > 5 && this.height > 5) {
              this.boxArry.push({
                width: this.width,
                height: this.height,
                long:50,
                transform:-30,
                isdown:false,
                left: left,
                top: top,
                front: [1,0,0,2,0,0],
              });
              this.labelArry.push({
                x1: left / this.scalewidth,
                y1: top / this.scaleheight,
                x2: (left + this.width) / this.scalewidth,
                y2: (top + this.height) / this.scaleheight,
                info: "default",
              });
              //完成标注
              console.log("box", this.boxArry);
              console.log("label", this.labelArry);
              //  console.log(this.left)
              //  console.log(this.top)
              //  console.log(this.width)
              //  console.log("111"+this.boxArry)
              this.$emit("markarray", this.labelArry);
            }
            this.biaozhuWidth = 0;
            this.biaozhuHeight = 0;
            this.biaozhuLeft = 0;
            this.biaozhuTop = 0;
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }
    },
    move(stopmove,istrue,isangle, mtype, e) {
      if(stopmove) return;
      if(isangle){
        console.log("changeangle!")
      let odiv = e.target; //获取目标元素
      // let canvasodiv = e.target.offsetParent.offsetParent.offsetLeft
      // console.log("PPOL",e.target.offsetParent.offsetParent)
      // console.log("POL",e.target.offsetParent)
      // console.log("e.clientX",e.clientX)
      //console.log("left",canvasodiv.offsetLeft,"top",canvasodiv.offsetTop)
      //console.log("movemovemove");
      //算出鼠标相对元素的位置
      let disX = e.clientX ;
      console.log(disX)
      let nowangle = this.boxArry[this.b_i].transform
      document.onmousemove = (e) => {
      if(this.boxArry[this.b_i].transform>-90&&this.boxArry[this.b_i].transform<90){
        if(!this.boxArry[this.b_i].isdown)this.boxArry[this.b_i].transform = nowangle-(e.clientX - disX) /8;
        if(this.boxArry[this.b_i].isdown)this.boxArry[this.b_i].transform = nowangle+(e.clientX - disX) /8;
      }
      if(this.boxArry[this.b_i].transform>=90||this.boxArry[this.b_i].transform<=-90){
        this.boxArry[this.b_i].transform = nowangle
      }
      }
      document.onmouseup = (e) => {
        document.onmousemove = null;
        if (istrue === true) document.onmouseup = null;
      };
      //let top = (e.clientY - disY) / this.num/50;
      // let oleft = this.boxArry[this.b_i].left;
      // let otop = this.boxArry[this.b_i].top;
      // let owidth = this.boxArry[this.b_i].width;
      // let oheight = this.boxArry[this.b_i].height;
        return
      };
      if (mtype === 9){
        let disY = e.clientY ;
        console.log(disY)
        let nowlong = this.boxArry[this.b_i].long
        document.onmousemove = (e) => {
        if(this.boxArry[this.b_i].long>=5){
          if(!this.boxArry[this.b_i].isdown)this.boxArry[this.b_i].long = nowlong-(e.clientY - disY) ;
          if(this.boxArry[this.b_i].isdown)this.boxArry[this.b_i].long = nowlong+(e.clientY - disY) ;
        }
        if(this.boxArry[this.b_i].long<=5){
          this.boxArry[this.b_i].long = 5
        }
        }
        document.onmouseup = (e) => {
          document.onmousemove = null;
          if (istrue === true) document.onmouseup = null;
      };
        return
      }
      let odiv = e.target; //获取目标元素
      // let canvasodiv = e.target.offsetParent.offsetParent.offsetLeft
      // console.log("PPOL",e.target.offsetParent.offsetParent)
      // console.log("POL",e.target.offsetParent)
      // console.log("e.clientX",e.clientX)
      //console.log("left",canvasodiv.offsetLeft,"top",canvasodiv.offsetTop)
      //console.log("movemovemove");
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft * this.num;
      let disY = e.clientY - odiv.offsetTop * this.num;
      let oleft = this.boxArry[this.b_i].left;
      let otop = this.boxArry[this.b_i].top;
      let owidth = this.boxArry[this.b_i].width;
      let oheight = this.boxArry[this.b_i].height;
      document.onmousemove = (e) => {
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = (e.clientX - disX) / this.num;
        let top = (e.clientY - disY) / this.num;
        //绑定元素位置到positionX和positionY上面
        //  this.positionX = top * this.num;
        //  this.positionY = left * this.num;
        //  console.log(this.positionX,this.positionY)
        //  this.positionX = top / this.num;
        //  this.positionY = left / this.num;

        //移动当前元素
        if (istrue === true) {
          //  odiv.style.left = left
          //  odiv.style.top = top
          //  odiv.style.left = left + "px" / this.num;
          //  odiv.style.top = top + "px" / this.num;
          //  odiv.style.left = left + "px / this.num";
          //  odiv.style.top = top + "px / this.num";
          odiv.style.left = left + "px";
          odiv.style.top = top + "px";
          this.boxArry[this.b_i].left = left;
          this.boxArry[this.b_i].top = top;
          let width =
            this.scalewidth *
            (this.labelArry[this.b_i].x2 - this.labelArry[this.b_i].x1);
          let height =
            this.scaleheight *
            (this.labelArry[this.b_i].y2 - this.labelArry[this.b_i].y1);
          this.labelArry[this.b_i].x1 = left / this.scalewidth;
          this.labelArry[this.b_i].y1 = top / this.scaleheight;
          this.labelArry[this.b_i].x2 = (left + width) / this.scalewidth;
          this.labelArry[this.b_i].y2 = (top + height) / this.scaleheight;
        }
        //缩放当前元素
        if (istrue === false) {
          if (mtype === 1) {
            //左上角的点
            //console.log("this.boxArry[this.b_i].left",this.boxArry[this.b_i].left,"this.boxArry[this.b_i].top",this.boxArry[this.b_i].top )
            //console.log("left",left,"top",top)
            if (left < owidth) this.boxArry[this.b_i].left = oleft + left;
            else this.boxArry[this.b_i].left = oleft + owidth - 1;

            if (top < oheight) this.boxArry[this.b_i].top = otop + top;
            else this.boxArry[this.b_i].top = otop + oheight - 1;

            if (left < owidth) this.boxArry[this.b_i].width = owidth - left;
            else this.boxArry[this.b_i].width = 1;

            if (top < oheight) this.boxArry[this.b_i].height = oheight - top;
            else this.boxArry[this.b_i].height = 1;
            this.labelArry[this.b_i].x1 =
              this.boxArry[this.b_i].left / this.scalewidth;
            this.labelArry[this.b_i].y1 =
              this.boxArry[this.b_i].top / this.scaleheight;
          }
          if (mtype === 2) {
            //右上角的点
            if (top < oheight) this.boxArry[this.b_i].top = otop + top;
            else this.boxArry[this.b_i].top = otop + oheight - 1;
            if (left > 0) this.boxArry[this.b_i].width = left + 7;
            else this.boxArry[this.b_i].width = 1;
            if (top < oheight) this.boxArry[this.b_i].height = oheight - top;
            else this.boxArry[this.b_i].height = 1;
            // this.labelArry[this.b_i].x1 =
            //   this.boxArry[this.b_i].left / this.scalewidth;
            this.labelArry[this.b_i].y1 =
              this.boxArry[this.b_i].top / this.scaleheight;
            if (left > 0)
              this.labelArry[this.b_i].x2 =
                (this.scalewidth * this.labelArry[this.b_i].x1 + left + 7) /
                this.scalewidth;
            else
              this.labelArry[this.b_i].x2 =
                (this.scalewidth * this.labelArry[this.b_i].x1 + 1) /
                this.scalewidth;
          }
          if (mtype === 3) {
            //左下角的点
            if (left < owidth) this.boxArry[this.b_i].left = oleft + left;
            else this.boxArry[this.b_i].left = oleft + owidth - 1;
            if (left < owidth) this.boxArry[this.b_i].width = owidth - left;
            else this.boxArry[this.b_i].width = 1;
            if (top > 0) this.boxArry[this.b_i].height = top + 7;
            else this.boxArry[this.b_i].height = 1;
            this.labelArry[this.b_i].x1 =
              this.boxArry[this.b_i].left / this.scalewidth;
            // this.labelArry[this.b_i].y1 =
            //   this.boxArry[this.b_i].top / this.scaleheight;
            // if (left < owidth)
            //   this.labelArry[this.b_i].x2 =
            //     (this.scalewidth * this.labelArry[this.b_i].x1 + left + 7) /
            //     this.scalewidth;
            // else
            //   this.labelArry[this.b_i].x2 =
            //     (this.scalewidth * this.labelArry[this.b_i].x1 + 1) /
            //     this.scalewidth;
            if (top > 0)
              this.labelArry[this.b_i].y2 =
                (this.scaleheight * this.labelArry[this.b_i].y1 + top + 7) /
                this.scaleheight;
            else
              this.labelArry[this.b_i].y2 =
                (this.scaleheight * this.labelArry[this.b_i].y1 + 1) /
                this.scaleheight;
          }
          if (mtype === 4) {
             //console.log("left",left,"top",top)
            if (left > 0) this.boxArry[this.b_i].width = left + 7;
            else this.boxArry[this.b_i].width = 1;
            if (top > 0) this.boxArry[this.b_i].height = top + 7;
            else this.boxArry[this.b_i].height = 1;
            if (left > 0)
              this.labelArry[this.b_i].x2 =
                (this.scalewidth * this.labelArry[this.b_i].x1 + left + 7) /
                this.scalewidth;
            else
              this.labelArry[this.b_i].x2 =
                (this.scalewidth * this.labelArry[this.b_i].x1 + 1) /
                this.scalewidth;
            if (top > 0)
              this.labelArry[this.b_i].y2 =
                (this.scaleheight * this.labelArry[this.b_i].y1 + top + 7) /
                this.scaleheight;
            else
              this.labelArry[this.b_i].y2 =
                (this.scaleheight * this.labelArry[this.b_i].y1 + 1) /
                this.scaleheight;
          }
          if (mtype === 5) {
            //上边的点
            if (top < oheight) this.boxArry[this.b_i].top = otop + top;
            else this.boxArry[this.b_i].top = otop + oheight - 1;
            if (top < oheight) this.boxArry[this.b_i].height = oheight - top;
            else this.boxArry[this.b_i].height = 1;
            this.labelArry[this.b_i].y1 =
              this.boxArry[this.b_i].top / this.scaleheight;
          }
          if (mtype === 6) {
            //左边的点
            //console.log("this.boxArry[this.b_i].left",this.boxArry[this.b_i].left,"this.boxArry[this.b_i].top",this.boxArry[this.b_i].top )
            //console.log("left",left,"top",top)
            if (left < owidth) this.boxArry[this.b_i].left = oleft + left;
            else this.boxArry[this.b_i].left = oleft + owidth - 1;
            if (left < owidth) this.boxArry[this.b_i].width = owidth - left;
            else this.boxArry[this.b_i].width = 1;
            this.labelArry[this.b_i].x1 =
            this.boxArry[this.b_i].left / this.scalewidth;
          }
          if (mtype === 7) {
            //右边的点
            //console.log("this.boxArry[this.b_i].left",this.boxArry[this.b_i].left,"this.boxArry[this.b_i].top",this.boxArry[this.b_i].top )
            //console.log("left",left,"top",top)
            if (left > 0) this.boxArry[this.b_i].width = left + 7;
            else this.boxArry[this.b_i].width = 1;
            if (left > 0)
              this.labelArry[this.b_i].x2 =
                (this.scalewidth * this.labelArry[this.b_i].x1 + left + 7) /
                this.scalewidth;
            else
              this.labelArry[this.b_i].x2 =
                (this.scalewidth * this.labelArry[this.b_i].x1 + 1) /
                this.scalewidth;
          }
          if (mtype === 8) {
            //下边点
            //console.log("this.boxArry[this.b_i].left",this.boxArry[this.b_i].left,"this.boxArry[this.b_i].top",this.boxArry[this.b_i].top )
            //console.log("left",left,"top",top)
            if (top > 0) this.boxArry[this.b_i].height = top + 7;
            else this.boxArry[this.b_i].height = 1;
            if (top > 0)
              this.labelArry[this.b_i].y2 =
                (this.scaleheight * this.labelArry[this.b_i].y1 + top + 7) /
                this.scaleheight;
            else
              this.labelArry[this.b_i].y2 =
                (this.scaleheight * this.labelArry[this.b_i].y1 + 1) /
                this.scaleheight;
          }
        }
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        if (istrue === true) document.onmouseup = null;
      };
      console.log("box", this.boxArry);
      console.log("label", this.labelArry);
      
    },

    // alter(e) {
    //   let odiv = e.target; //获取目标元素
    //   console.log("movemovemove");
    //   //算出鼠标相对元素的位置
    //   let disX = e.clientX - odiv.offsetLeft;
    //   let disY = e.clientY - odiv.offsetTop;
    //   document.onmousemove = (e) => {
    //     //鼠标按下并移动的事件
    //     //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
    //     let left = e.clientX - disX;
    //     let top = e.clientY - disY;

    //     //绑定元素位置到positionX和positionY上面
    //     this.positionX = top;
    //     this.positionY = left;

    //     //移动当前元素
    //     odiv.style.left = left + "px";
    //     odiv.style.top = top + "px";
    //   };
    //   document.onmouseup = (e) => {
    //     document.onmousemove = null;
    //     document.onmouseup = null;
    //   };
    //   console.log(this.boxArry);
    // },
    fangda() {
      if (this.num < 10) this.num += 0.1;
      //  imagesrc=require(this.testsc)
      //  console.log(this.fatherimagesrc,this.imageindex)
    },
    suoxiao() {
      if (this.num > 0.2) this.num -= 0.1;
      //console.log("transform",this.transformx,Math.sin(this.transformx))
    },
    huanyuan() {
      this.num = 1;
      console.log(this.$refs.canvesdiv);
      let canvesdiv = this.$refs.canvesdiv;
      canvesdiv.style.left = 0 + "px";
      canvesdiv.style.top = 0 + "px";
      this.imageleft = 0;
      this.imagetop = 0;
      // console.log(document.getElementById("canvesdiv"))
      // let canvesdiv=document.getElementById("canvesdiv")
      // document.getElementById("canvesdiv").style.left=0+"px"
      // document.getElementById("canvesdiv").style.top=0+"px"
    },
    // tianjia() {
    //   this.boxArry.push({
    //     width: 100,
    //     height: 100,
    //     left: 20,
    //     top: 20,
    //   });
    // },
    handelClick(i) {
      this.b_i = i;
      console.log("hahaha" + i);
    },
    dragstart(event, data) {
      // console.log('drag')
      // event.dataTransfer.setData('item', data)
    },
    dragend(event) {
      // event.dataTransfer.clearData()
    },
  },
  //  directives: {
  //    drag: function (el) {
  //      let dragBox = el; //获取当前元素
  //           console.log("movemouse")
  //      dragBox.onmousedown = (e) => {
  //        //算出鼠标相对元素的位置

  //        let disX = e.clientX - dragBox.offsetLeft;
  //        let disY = e.clientY - dragBox.offsetTop;
  //        console.log(disX, disY);
  //        document.onmousemove = (e) => {
  //          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
  //          let left = e.clientX - disX;
  //          let top = e.clientY - disY;
  //          //移动当前元素
  //          dragBox.style.left = left + "px";
  //          dragBox.style.top = top + "px";
  //          console.log(left, top, "111111111");
  //        };
  //        document.onmouseup = (e) => {
  //          //鼠标弹起来的时候不再移动
  //          document.onmousemove = null;
  //          //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
  //          document.onmouseup = null;
  //        };
  //      };
  //    },
  //  },
};
</script>
<style lang="less">
#test {
  /deep/.el-dialog__body {
    padding: 10px 20px !important;
  }
  // .parallelogram {
  //   // left:50px;
  //   // top:50px;
  //   // width: 200px;
  //   // height: 120px;
  //   transform: skew(-40deg); /*设置倾斜度为-30*/
  //   // -webkit-transform: skew(-30deg);
  //   // -moz-transform: skew(-30deg);
  //   // -o-transform: skew(-30deg);
  //   // -ms-transform: skew(-30deg);
  //   //background-color: red;
  //   margin: 0px auto;
  // }
  .content {
    width: 800px;
    height: 800px;
    background: rgb(0, 0, 0);
    margin: 0 auto;
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
      border: 2px solid rgba(255, 0, 0, 0.5) !important;
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


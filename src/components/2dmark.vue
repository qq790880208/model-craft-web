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
          marginLeft: (this.imagewidth-379) / 2 + 'px',
          display: 'block',
        }"
      >
        <el-radio-group v-model="radio" style="display: inline-block">
          <el-radio-button label="mark" class="el-icon-edit"
            >标注</el-radio-button
          >
          <el-radio-button label="drag" class="el-icon-rank"
            >拖动</el-radio-button
          >
          <!-- <el-radio-button label="mark" icon="el-icon-edit"></el-radio-button>
        <el-radio-button label="drag" icon="el-icon-rank"></el-radio-button> -->
        </el-radio-group>
        <!-- <el-button @click="gai()" >{{buttontext}}</el-button> -->
        <!-- <el-button @click="gai" v-show="!isTrue2">正在添加标注</el-button> -->
        <el-button-group style="display: inline-block">
          <!-- <el-button @click="fangda" icon="el-icon-zoom-in">放大</el-button>
        <el-button @click="suoxiao" icon="el-icon-zoom-out">缩小</el-button>
        <el-button @click="huanyuan" icon="el-icon-refresh">还原图片大小</el-button>
        <el-button @click="saveinfo">保存 </el-button>
        <el-button @click="updatelastdata">查看上次标注数据</el-button> -->
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
            width: 1000 + 'px',
            height: 750 + 'px',
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
              <!-- <div class="r_b" @mousedown="mouseMove11" v-if="b_i == index"></div> -->
              <!-- <div class="ltc" @mousedown.stop="move(false,1, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="rtc" @mousedown.stop="move(false,2, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="lbc" @mousedown.stop="move(false,3, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="rbc" @mousedown.stop="move(false,4, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="tc" @mousedown.stop="move(false,5, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="lc" @mousedown.stop="move(false,6, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="rc" @mousedown.stop="move(false,7, $event)" v-if="b_i == index"> {{ index + 1 }} </div>
          <div class="bc" @mousedown.stop="move(false,8, $event)" v-if="b_i == index"> {{ index + 1 }} </div> -->
              <div
                class="ltc"
                :style="{
                  width:item.width>30?item.height>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                  height:item.height>30?item.width>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                }"
                @mousedown.stop="move(false, 1, $event)"
                v-if="b_i == index"
              ></div>
              <div
                class="rtc"
                :style="{
                  width:item.width>30?item.height>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                  height:item.height>30?item.width>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                }"
                @mousedown.stop="move(false, 2, $event)"
                v-if="b_i == index"
              ></div>
              <div
                class="lbc"
                :style="{
                  width:item.width>30?item.height>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                  height:item.height>30?item.width>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                }"
                @mousedown.stop="move(false, 3, $event)"
                v-if="b_i == index"
              ></div>
              <div
                class="rbc"
                :style="{
                  width:item.width>30?item.height>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                  height:item.height>30?item.width>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                }"
                @mousedown.stop="move(false, 4, $event)"
                v-if="b_i == index"
              ></div>
              <div
                class="tc"
                :style="{
                  width:item.width>30?item.height>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                  height:item.height>30?item.width>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                  left:item.width>30?(item.width-6)/2+'px':(item.width-4)/2+'px',
                }"
                @mousedown.stop="move(false, 5, $event)"
                v-if="b_i == index"
              ></div>
              <div
                class="lc"
                :style="{
                  width:item.width>30?item.height>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                  height:item.height>30?item.width>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                  top:item.height>30?(item.height-6)/2+'px':(item.height-4)/2+'px',
                }"
                @mousedown.stop="move(false, 6, $event)"
                v-if="b_i == index"
              ></div>
              <div
                class="rc"
                :style="{
                  width:item.width>30?item.height>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                  height:item.height>30?item.width>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                  top:item.height>30?(item.height-6)/2+'px':(item.height-4)/2+'px',
                }"
                @mousedown.stop="move(false, 7, $event)"
                v-if="b_i == index"
              ></div>
              <div
                class="bc"
                :style="{
                  width:item.width>30?item.height>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                  height:item.height>30?item.width>30?6+'px':Math.min(item.height,item.width)/5+'px':Math.min(item.height,item.width)/5+'px',
                  left:item.width>30?(item.width-6)/2+'px':(item.width-4)/2+'px',
                }"
                @mousedown.stop="move(false, 8, $event)"
                v-if="b_i == index"
              ></div>
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
            @deletelabel="deletelabel(index)"
            @changeinfo="changeinfo($event, index)"
            @mousedown.native="handelClick(index)"
            :style="{
              //textAlign:'center',
              border: b_i === index ? '1px solid #ff0000' : '0px solid #ff0000',
            }"
          ></labelinfo>
          <!-- <el-input placeholder="请输入内容" style="width:600px" clearable></el-input>
      <el-button type="primary">保存</el-button> -->
          <!-- <el-button @click="deletelabel(index)" type="danger">删除</el-button> -->
          <!-- </el-row> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import labelinfo from "@/components/labelinfo.vue";
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
  // destroyed(){
  //   console.log("2dmarkddddddddddddddddddddddddddddddddddddddddddddddddddddd")
  // },
  mounted: function () {
    this.imagechange();
    this.defaultlabel=this.premarktype[0].name;
    this.defaultcolor=this.premarktype[0].color;
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
      if (image.width < 800 && image.height < 600) {
        while(this.imagewidth < 800 && this.imageheight < 600) {
          this.imagewidth *=1.1;
          this.imageheight *=1.1;
          this.scalewidth *=1.1;
          this.scaleheight *=1.1;
        }
      }
      if(image.width > 1000 || image.height > 750){
          while(this.imagewidth > 1000 || this.imageheight > 750) {
          this.imagewidth /=1.1;
          this.imageheight /=1.1;
          this.scalewidth /=1.1;
          this.scaleheight /=1.1;
        }
      }
      this.mleft=(1000-this.imagewidth)/2
      this.mtop=(750-this.imageheight)/2
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
    // settrue() {
    //   this.isTrue2 = true;
    //   console.log("setture");
    // },
    // setfalse() {
    //   this.isTrue2 = false;
    //   console.log("setfalse");
    // },
    // testsave(){
    //   console.log("testtttttttttttttttttttttttsssssssssssssssssssssssssssssss")
    // },
    saveinfo() {
      //保存时传递的信息
      console.log("start!!!", this.boxArry);
      //变为深拷贝
      let tempArry={}
      tempArry.rectangle=JSON.parse(JSON.stringify(this.labelArry))
     // this.tempArry.push(JSON.parse(JSON.stringify(this.labelArry)));
      //this.tempArry[0]=this.boxArry
      //this.tempArry.push(this.fatherimagesrc);
      //this.tempArry.push(this.imageindex);
      console.log("11111",tempArry,);
      this.$emit("saveimageinfo", tempArry, this.imageindex);
      console.log("11111",tempArry,);
      console.log("22222zzzzz", tempArry);
      this.tempArry = [];
      console.log("22222", tempArry);
      //  this.$emit('saveimageinfo',this.boxArry,this.fatherimagesrc,this.imageindex)
      //  console.log(this.boxArry,this.fatherimagesrc,this.imageindex)
    },
    deletelabel(i) {
      //删除对应标注
      this.boxArry.splice(i, 1);
      this.labelArry.splice(i, 1);
      this.b_i=-1;
      console.log(this.boxArry);
      console.log(this.labelArry);
    },
    changeinfo(input, i) {
      //保存标注信息
      //console.log("father"+input,i)
      this.labelArry[i].info = input;
      this.findcolor(this.labelArry[i].info);
      this.boxArry[i].color = this.markcolor;
    },
    gai() {
      this.isTrue2 = !this.isTrue2;
      console.log("isTrue2", this.isTrue2);
      if (this.isTrue2) this.buttontext = "正在标注(切换拖动图片)";
      else this.buttontext = "正在拖动图片(切换标注)";
    },
    getOffect(e) {
      console.log(e);
      document.onmouseup = null;
      // this.left=e.offsetX
      //     this.top=e.offsetY
    },
    moveMouse(e) {
      //标注或者拖动图片的函数
      //console.log("moveMouse!!!!!!!!!!!!!!");
      let odiv = e.target; //获取目标元素
      console.log("dsadasdasdsadsadasdasdsadsad", this.radio);
      odiv.style.left = this.imageleft + "px";
      odiv.style.top = this.imagetop + "px";
      //console.log(odiv);
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
          console.log("testttttttttt",odiv.getBoundingClientRect().x);
          //console.log("this.imageleft",this.imageleft,"this.imagetop",this.imagetop);
          console.log(e.target.offsetLeft);
          let Dnumberx=e.clientX - disX;
          let Dnumbery=e.clientY - disY;
          this.width = Math.abs(Dnumberx) / this.num;
          this.height = Math.abs(Dnumbery) / this.num;
          this.biaozhuWidth = this.width;
          this.biaozhuHeight = this.height;
          if(Dnumberx>=0) this.biaozhuLeft = left;
          else this.biaozhuLeft = left+Dnumberx / this.num;
          if(Dnumbery>=0) this.biaozhuTop = top;
          else this.biaozhuTop = top+Dnumbery / this.num;
          document.onmouseup = (e) => {
            let left = (disX - odiv.getBoundingClientRect().x) / this.num;
            let top = (disY - odiv.getBoundingClientRect().y) / this.num;
            this.width = Math.abs(Dnumberx) / this.num;
            this.height = Math.abs(Dnumbery) / this.num;

            console.log(e.target.getBoundingClientRect(), disX, disY);

            if (this.width > 5 && this.height > 5) {
              this.boxArry.push({
                width: this.width,
                height: this.height,
                left: Dnumberx>=0?left:left+Dnumberx/ this.num,
                top: Dnumbery>=0?top:top+Dnumbery/ this.num,
                color:this.defaultcolor,
              });
              this.labelArry.push({
                x1: Dnumberx>=0?left / this.scalewidth:(left+Dnumberx/ this.num) / this.scalewidth,
                y1: Dnumbery>=0?top / this.scaleheight:(top+Dnumbery/ this.num) / this.scaleheight,
                x2: Dnumberx>=0?(left + this.width) / this.scalewidth:left / this.scalewidth,
                y2: Dnumbery>=0?(top + this.height) / this.scaleheight:top / this.scaleheight,
                info: this.defaultlabel,
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
    move(istrue, mtype, e) {
      //移动标注框，缩放标注框的函数
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
        // console.log(
        //   "owidth",
        //   owidth,
        //   "oleft",
        //   oleft,
        //   "left",
        //   left,
        //   "oheight",
        //   oheight,
        //   "otop",
        //   otop,
        //   "top",
        //   top
        // );
        // console.log(
        //   "width",
        //   this.boxArry[this.b_i].width,
        //   "height",
        //   this.boxArry[this.b_i].height
        // );
        // //绑定元素位置到positionX和positionY上面
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
            //console.log("this.boxArry[this.b_i].left",this.boxArry[this.b_i].left,"this.boxArry[this.b_i].top",this.boxArry[this.b_i].top )
            //console.log("left",left,"top",top)
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
            // if (top < oheight)
            //   this.labelArry[this.b_i].y2 =
            //     (this.scaleheight * this.labelArry[this.b_i].y1 + top + 7) /
            //     this.scaleheight;
            // else
            //   this.labelArry[this.b_i].y2 =
            //     (this.scaleheight * this.labelArry[this.b_i].y1 + 1) /
            //     this.scaleheight;
          }
          if (mtype === 3) {
            //左下角的点
            //console.log("this.boxArry[this.b_i].left",this.boxArry[this.b_i].left,"this.boxArry[this.b_i].top",this.boxArry[this.b_i].top )
            //console.log("left",left,"top",top)
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
            //右下角的点
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
            //console.log("this.boxArry[this.b_i].left",this.boxArry[this.b_i].left,"this.boxArry[this.b_i].top",this.boxArry[this.b_i].top )
            //console.log("left",left,"top",top)
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
          //console.log("thisbox","x1",this.labelArry[this.b_i].x1,"y1",this.labelArry[this.b_i].y1,"x2",this.labelArry[this.b_i].x2,"y2",this.labelArry[this.b_i].y2)
        }
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        if (istrue === true) document.onmouseup = null;
      };
      console.log("box", this.boxArry);
      console.log("label", this.labelArry);
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
      // console.log(document.getElementById("canvesdiv"))
      // let canvesdiv=document.getElementById("canvesdiv")
      // document.getElementById("canvesdiv").style.left=0+"px"
      // document.getElementById("canvesdiv").style.top=0+"px"
    },
    tianjia() {
      this.boxArry.push({
        width: 100,
        height: 100,
        left: 20,
        top: 20,
      });
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


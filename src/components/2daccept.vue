<template>
  <div class="polygon-body" style="width: 100%">
    <div>
      <div
        :style="{
          marginLeft: (this.divWidth - 250) / 2 + 'px',
          display: 'block',
        }"
      >
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
        </el-button-group>
      </div>
    </div>
    <div
      :style="{
        display: 'flex',
      }"
    >
      <div
        id="leftdiv"
        ref="outdiv"
        :style="{
          maxWidth: 1000 + 'px',
          maxHeight: 1000 + 'px',
          //display:flex
        }"
      >
        <div
          class="polygon"
          @mouseenter="fangdasuoxiaochange1"
          @mouseleave="fangdasuoxiaochange2"
          @mousewheel.prevent
          :style="{
          }"
        >
          <canvas id="label-canvas" class="canvas"></canvas>
        </div>
        <div id="remarkinfodiv" style="display: inline-block">
          <div>
            <p>驳回备注：{{ auditremakeinfo }}</p>
          </div>
          <div>
            <p>验收备注：{{ acceptremakeinfo }}</p>
          </div>
        </div>
      </div>
      <div class="el-divider el-divider--vertical"></div>
      <div id="rightdiv">
        <!-- <div class="infopolygon" :style="setheightTag" ref="tagdiv">
          <div
            v-for="(items, index) in premarktype"
            :key="index"
            style="float: left; margin-right: 20px"
          >
            <el-button
              @click="changeinfo(items, index)"
              :disabled="!markstyle"
              :style="{
                width: 120 + 'px',
                marginBottom: 10 + 'px',
                background:  items.color,
              }"
              >{{ items.name }}</el-button
            >
          </div>
        </div> -->
        <el-divider></el-divider>
        <div class="infopolygon" :style="setheightInfo" ref="infodiv">
          <!-- <div style="margin-left:50px;float:left;border:1px solid #666;width:25%"> -->
          <div
            v-for="(items, index) in allobjArray"
            :key="index"
            style="margin-right: 20px"
          >
            <div
              :style="{
                width: 400 + 'px',
                height: 160 + 'px',
                marginTop: 10 + 'px',
                border:
                  b_i === index ? '3px solid #ff0000' : '0px solid #ff0000',
                background: items.color,
              }"
              @mousedown="handelClick(items, index)"
            >
              <div
                style="width: 300px; margin-top: 10px; display: inline-block"
              >
                <p
                  :style="{
                    marginLeft: 30 + 'px',
                    marginTop: 10 + 'px',
                    width: 300 + 'px',
                    fontSize: 20 + 'px',
                    display: 'inline-block',
                  }"
                >
                  矩形 {{ items.info }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { fabric } from "fabric";

export default {
  props: {
    fatherimagesrc: String,
    imageindex: Number,
    premarktype: {
      type: Array,
      default: () => [],
    },
    auditremakeinfo: {
      type: String,
      default: "",
    },
    acceptremakeinfo: {
      type: String,
      default: "",
    },
    lastlabelArry: {
      type: Object,
      default: () => {},
    },
    canvaswidth: {
      type: Number,
      default: 600,
    },
    canvasheight: {
      type: Number,
      default: 600,
    },
  },
  data() {
    return {
      divWidth: 1000,
      divHeight: 750,
      mountedFlag: true,
      setheightTag: {
        marginTop: 20 + "px",
        marginLeft: 20 + "px",
        height: "",
      },
      setheightInfo: {
        marginLeft: 20 + "px",
        height: "",
      },
      radio: "rectanglemark",
      markstyle: true,
      dialogVisible: false, //标注时是否弹出对话框
      dialogleft: 0,
      dialogtop: 0,
      markcolor2: "rgba(0,128,128,0.5)", //标记颜色
      markinfo2: null, //标记信息
      mousePointerEvent: null, //存储鼠标最后点击事件
      //isoneedit:false,

      b_i: "", //获取目前点击的div的index
      allowchangebi: true,
      lockradio: false,
      temitem: null,
      fangdasuoxiaoFlag: false,
      buttonindex: -1,
      input: null,
      temproof: null,

      rectangle: null,

      //istrue: false,
      panning: false,
      zoom: 1,
      //havefabricobj:false,

      islabeling: false,

      allobjArray: [],

      temtwopoint: [],
      generateline: [],
      temlineobj: null,

      //controlsObjectArryCount:0,
      imagechangebtntext: "修改图形",
      isimagechange: false,
      imagewidth: null,
      imageheight: null,
      scalewidth: null, //图片宽度缩放倍数
      scaleheight: null, //图片高度缩放倍数
      distanceDelta: 0, //图片位移距离（让图片处于中心）
      rectanglePoints: [], //矩形点数组
      realRectanglePoints: [], //真实矩形点数组
      temRectangle: [], //矩形标注时的临时矩形，用于显示

      rectangleArray: [], //矩形对象数组
      rectangleinfoArray: [], //矩形对象信息数组
      realrectangleinfoArray: [], //真实矩形对象信息数组

      //tempArry: [], //高亮多边形
      //drawingObject: {}, //flag
      // drawingObject: {
      //   type: "roof",
      //   background: "",
      //   border: "",
      // },
      fabricObj: null, //画布对象
      fabricimageObj: null, //图片对象（未使用）
      //mouseFrom: {},
      canvas: null,
      Point: {},
      markcolor: "rgba(0,128,128,0.5)", //标记颜色
      markinfo: null, //标记信息
      //isCanSelect: false,
      buttonmouseoveflag: false, //高亮显示按钮的移入移出判断flag
      //imageurl:'http://localhost:9528/static/img/QQ%E5%9B%BE%E7%89%8720201120101655.ff1d6fd1.jpg',
      //localimage:'D:/VueProject/modelcraft-web/src/image/test2.jpg'
    };
  },
  // created() {
  //    document.addEventListener("keydown", this.deletelastpoint());
  // },
  computed: {
    imagesrc: function () {
      //获取图片url
      //return require('@/image/'+this.fatherimagesrc)
      //return require('http://127.0.0.1:18080/images/abc.png')
      //return require('@/'+'image/微信图片_20200927191717'+'.jpg')
      return this.fatherimagesrc;
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.GetWindowInfo);
    window.removeEventListener("mousewheel", this.checkFangdasSuoxiao);
  },
  mounted() {
    window.addEventListener("resize", this.GetWindowInfo); //注册监听器
    window.addEventListener("mousewheel", this.checkFangdasSuoxiao, true);
    this.GetWindowInfo(); //页面创建时先调用一次
    this.mountedFlag = false;
    this.$nextTick(() => {
      //延时加载放置报错
      setTimeout(() => {
        this.fabricObj = new fabric.Canvas("label-canvas");
        this.fabricObj.selection = false;
        this.fabricEvent();

        this.createBackgroundImage();
        //this.inputimage();
        // this.drawingObject.type="roof"
        // console.log("this.drawingObject.type",this.drawingObject.type);
      }, 500),
        setTimeout(() => {
          //由于this.createBackgroundImage函数总是最后加载，在这里设置更后延迟来更新图片标注信息
          this.updatelastdata();
          console.log(
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
            this.fabricObj.width
          );
          this.huanyuan();
        }, 520);
        setTimeout(() => {
          //重新根据分辨率加载ui
          this.GetWindowInfo();
        }, 550);
    });
  },
  watch: {
    //监听图片变化
    imagesrc() {
      console.log("watch!!!!!!!!");
      //this.havefabricobj=false
      this.buttonindex = -1;
      this.createBackgroundImage();
      setTimeout(() => {
        this.rectangleArray.forEach((item) => {
          this.fabricObj.remove(item);
        });
        this.clearinfo();
        this.clearobj();
        this.markinfo = null;
        if (this.isimagechange) this.Edit();
        //this.drawingObject.type == "roof"
        this.updatelastdata();
        this.huanyuan();
        this.buttonindex = -1;
      }, 20);
      //this.fabricEvent();
      //this.inputimage();
    },
    radio() {
      this.start();
    },
  },
  methods: {

    handelClick(item, index) {
      if (this.allowchangebi) {
        if (this.b_i != index) {
          this.b_i = index;
          this.getBorder(item);
        } else {
          this.deleteBorder(item);
          this.b_i = -1;
        }
      }
      console.log("hahaha" + item.type);
    },
    getBorder(item) {
      //显示对象边框
      this.temitem = item;
      if (item.type == "rectangle") {
        let index2 = this.rectangleArray.indexOf(item);
        console.log("index2", index2);
        let poly =
          this.fabricObj.getObjects()[
            this.fabricObj._objects.indexOf(this.rectangleArray[index2])
          ];
        console.log(index2, poly);
        poly.hasBorders = true;
        poly.hasControls = false;
        poly.selectable = false;
        poly.set({
          lockMovementX: true,
          lockMovementY: true,
        });
        this.fabricObj.setActiveObject(poly);
        this.fabricObj.renderAll();
      }
    },
    deleteBorder(item) {
      //移除对象边框
      this.temitem = null;
      if (item.type == "rectangle") {
        let index2 = this.rectangleArray.indexOf(item);
        let poly =
          this.fabricObj.getObjects()[
            this.fabricObj._objects.indexOf(this.rectangleArray[index2])
          ];
        console.log(index2, poly);
        poly.hasBorders = false;
        poly.hasControls = true;
        poly.selectable = false;
        poly.set({
          lockMovementX: false,
          lockMovementY: false,
        });
        this.fabricObj.discardActiveObject(poly);
        this.fabricObj.renderAll();
      }
    },
    cancelbi() {
      this.b_i = -1;
    },
    fangdasuoxiaochange1() {
      console.log("enter!!!!!");
      this.fangdasuoxiaoFlag = true;
    },
    fangdasuoxiaochange2() {
      console.log("leave!!!!!");
      this.fangdasuoxiaoFlag = false;
    },
    checkFangdasSuoxiao(e) {
      let direction = e.deltaY > 0 ? "down" : "up";
      if (this.fangdasuoxiaoFlag) {
        if (direction == "up") this.fangda();
        else this.suoxiao();
      }
    },
    GetWindowInfo() {
      // 获取浏览器高宽
           if (window.innerWidth > 1650) {
        this.divWidth = 1000;
      } else if (window.innerWidth > 800) {
        this.divWidth = 1000 - (1650 - window.innerWidth);
      } else {
        this.divWidth = 500;
      }
      if (window.innerHeight > 930) {
        this.divHeight = 750;
      } else if (window.innerHeight > 450) {
        this.divHeight = 750 - (930 - window.innerHeight);
      } else {
        this.divHeight = 375;
      }
      if (!this.mountedFlag) {
        this.fabricObj.setWidth(this.divWidth);
        this.fabricObj.setHeight(this.divHeight);
        this.setheightTag.height = this.divHeight * 0.25 + "px";
        this.setheightInfo.height = this.divHeight * 0.75 + "px";
        console.log("asduisafhiasfb", this.divHeight);
      }
    },
    clearobj() {
      //移除画的连续直线和点
      if (this.islabeling) {
        this.islabeling = false;
      }
      this.temRectangle.forEach((item) => this.fabricObj.remove(item));
      this.rectanglePoints = [];
      this.realRectanglePoints = [];
      this.temRectangle = [];
      this.b_i = -1;
    },
    clearinfo() {
      this.allobjArray = [];
      this.rectangleArray = [];
      this.rectangleinfoArray = [];
      this.realrectangleinfoArray = [];
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    fangda() {
      //放大图片
      let zoomPoint = new fabric.Point(this.divWidth / 2, this.divHeight / 2);
      if (this.zoom < 4.99) this.zoom += 0.1;
      this.fabricObj.zoomToPoint(zoomPoint, this.zoom);
      //console.log(this.fabricObj.getZoom());
    },
    suoxiao() {
      //缩小图片
      let zoomPoint = new fabric.Point(this.divWidth / 2, this.divHeight / 2);
      if (this.zoom > 0.2) this.zoom -= 0.1;
      if (this.zoom > 0.1) this.fabricObj.zoomToPoint(zoomPoint, this.zoom);
      //console.log(this.fabricObj.getZoom());
    },
    huanyuan() {
      //还原图片大小和位置
      this.zoom = 1;
      this.fabricObj.setZoom(1);
      let ppoint = new fabric.Point(0, 0);
      this.fabricObj.absolutePan(ppoint);
      //_this.distanceDelta = new fabric.Point((1000-_this.imagewidth)/2, (750-_this.imageheight)/2);
      //var delta = new fabric.Point(1,100);
      this.fabricObj.relativePan(this.distanceDelta);
    },
    updatelastdata() {
      //查看上次标注保存的信息
      console.log("image select lastlabelArry", this.lastlabelArry);
      console.log("remarkinfo", this.auditremakeinfo, this.acceptremakeinfo);
      // if(this.lastlabelArry==undefined){
      //   return
      // }
      // this.clearinfo();
      // this.clearobj();
      this.b_i = -1;
      console.log("img11111111111111111", this.scalewidth, this.scaleheight);
      if (
        this.lastlabelArry.rectangle != undefined &&
        this.lastlabelArry.rectangle != null
      ) {
        //矩形
        for (let i = 0; i < this.lastlabelArry.rectangle.length; i++) {
          console.log("rectangle1", this.lastlabelArry.rectangle[i]);
          let a = {};
          let reala = {};
          a["x"] = this.lastlabelArry.rectangle[i].x1 * this.scalewidth;
          a["y"] = this.lastlabelArry.rectangle[i].y1 * this.scaleheight;
          reala["x"] = this.lastlabelArry.rectangle[i].x1;
          reala["y"] = this.lastlabelArry.rectangle[i].y1;
          this.rectanglePoints.push(a);
          this.realRectanglePoints.push(reala);
          let b = {};
          let realb = {};
          b["x"] = this.lastlabelArry.rectangle[i].x2 * this.scalewidth;
          b["y"] = this.lastlabelArry.rectangle[i].y2 * this.scaleheight;
          realb["x"] = this.lastlabelArry.rectangle[i].x2;
          realb["y"] = this.lastlabelArry.rectangle[i].y2;
          this.rectanglePoints.push(b);
          this.realRectanglePoints.push(realb);
          this.markinfo = this.lastlabelArry.rectangle[i].info;
          this.findcolor(this.lastlabelArry.rectangle[i].info);
          this.makeRectangle();
          this.rectangleArray.push(this.rectangle);
          this.allobjArray.push(this.rectangle);
          this.rectangleinfoArray.push({
            x1: this.rectanglePoints[0].x,
            y1: this.rectanglePoints[0].y,
            x2: this.rectanglePoints[1].x,
            y2: this.rectanglePoints[1].y,
            info: this.markinfo,
          });
          this.realrectangleinfoArray.push({
            x1: this.realRectanglePoints[0].x,
            y1: this.realRectanglePoints[0].y,
            x2: this.realRectanglePoints[1].x,
            y2: this.realRectanglePoints[1].y,
            info: this.markinfo,
          });
          this.fabricObj.add(this.rectangle);
          this.rectanglePoints = [];
          this.realRectanglePoints = [];
          this.rectangle = null;
        }
      }
      this.fabricObj.renderAll();
      this.fabricObj.hoverCursor = "default";
      //this.havefabricobj=true;
    },
    createBackgroundImage() {
      //加载图片为背景
      let _this = this;
      console.log(this.imagesrc);
      if (this.imagesrc === undefined || this.imagesrc === null) return;
      // console.log(this.fabricObj.width);
      // console.log(this.fabricObj.height);
      this.fabricimageObj = new fabric.Image.fromURL(this.imagesrc, function (
        img
      ) {
        _this.imagewidth = img.width;
        _this.imageheight = img.height;
        _this.scalewidth = 1;
        _this.scaleheight = 1;
        // console.log(_this.fabricObj)
        if (
          img.width < _this.divWidth * 0.8 &&
          img.height < _this.divHeight * 0.8
        ) {
          while (
            _this.imagewidth < _this.divWidth * 0.8 &&
            _this.imageheight < _this.divHeight * 0.8
          ) {
            _this.imagewidth *= 1.1;
            _this.imageheight *= 1.1;
            _this.scalewidth *= 1.1;
            _this.scaleheight *= 1.1;
          }
        }
        if (img.width > _this.divWidth || img.height > _this.divHeight) {
          while (
            _this.imagewidth > _this.divWidth ||
            _this.imageheight > _this.divHeight
          ) {
            _this.imagewidth /= 1.1;
            _this.imageheight /= 1.1;
            _this.scalewidth /= 1.1;
            _this.scaleheight /= 1.1;
          }
        }
        // _this.fabricObj.setWidth(imagewidth);
        // _this.fabricObj.setHeight(imageheight);
        // let ppoint = new fabric.Point(0, 0);
        // _this.fabricObj.absolutePan(ppoint);
        _this.distanceDelta = new fabric.Point(
          (_this.divWidth - _this.imagewidth) / 2,
          (_this.divHeight - _this.imageheight) / 2
        );
        //var delta = new fabric.Point(1,100);
        //_this.fabricObj.relativePan(_this.distanceDelta);
        _this.fabricObj.setWidth(_this.divWidth);
        _this.fabricObj.setHeight(_this.divHeight);
        // _this.$refs.outdiv.height=750;
        // _this.$refs.outdiv.width=1000;
        // if (img.width < 600 && img.height < 600) {
        //   _this.fabricObj.setWidth(1.5 * img.width);
        //   _this.fabricObj.setHeight(1.5 * img.height);
        //   // _this.fabricObj.setWidth(img.width);
        //   // _this.fabricObj.setHeight(img.height);
        // } else {
        //   _this.fabricObj.setWidth(img.width);
        //   _this.fabricObj.setHeight(img.height);
        // }
        // _this.scalewidth = _this.fabricObj.width / img.width;
        // _this.scaleheight = _this.fabricObj.height / img.height;
        console.log(img.width);
        console.log(img.height);
        console.log(_this.imagewidth);
        console.log(_this.imageheight);
        console.log(_this.fabricObj.width);
        console.log(_this.fabricObj.height);
        console.log(_this.scalewidth);
        console.log(_this.scaleheight);
        // _this.imagewidth=_this.fabricObj.width=img.width
        // _this.imageheight=_this.fabricObj.height=img.height
        img.set({
          scaleX: _this.scalewidth,
          scaleY: _this.scaleheight,
          selectable: true,
          hasControls: false,
          left: 0,
          top: 0,
        });
        _this.fabricObj.setBackgroundImage(
          img,
          _this.fabricObj.renderAll.bind(_this.fabricObj)
        );
      });
    },
    fabricEvent() {
      this.fabricObj.on({
        "mouse:down": (e) => {
            console.log("1111");
            this.panning = true;
        },
        "mouse:move": (e) => {
          if (this.panning && e && e.e) {
            var delta = new fabric.Point(e.e.movementX, e.e.movementY);
            this.fabricObj.relativePan(delta);
          }
        },
        "mouse:up": (e) => {
          console.log("upupup");
            this.panning = false;
        },
      });
    },

    makeRectangleObj(e) {
      //生成绘制矩形
      if (
        //防止过长时间重复点一个点时点入栈
        e.absolutePointer.x != this.rectanglePoints[0].x ||
        e.absolutePointer.y != this.rectanglePoints[0].y
      ) {
        console.log("dasiogfu890asdguyqehn fbewjkb fwekjb wef e eq");
        let _this = this;
        let a = {};
        let reala = {};
        a["x"] = e.absolutePointer.x;
        a["y"] = e.absolutePointer.y;
        reala["x"] = e.absolutePointer.x / this.scalewidth;
        reala["y"] = e.absolutePointer.y / this.scaleheight;
        this.rectanglePoints.push(a);
        this.realRectanglePoints.push(reala);
        console.log("rectanglePoints", this.rectanglePoints);
        console.log("realRectanglePoints", this.realRectanglePoints);
        this.makeRectangle();
        console.log(
          "rectanuuuuuuuuuuuuuuuuuuuuuuuuglePoints",
          this.rectanglePoints
        );
        console.log(
          "realRectanuuuuuuuuuuuuuuuuuuuuuglePoints",
          this.realRectanglePoints
        );
        this.rectangleArray.push(this.rectangle);
        this.allobjArray.push(this.rectangle);
        this.rectangleinfoArray.push({
          x1: this.rectanglePoints[0].x,
          y1: this.rectanglePoints[0].y,
          x2: this.rectanglePoints[1].x,
          y2: this.rectanglePoints[1].y,
          info: this.markinfo,
        });
        this.realrectangleinfoArray.push({
          x1: this.realRectanglePoints[0].x,
          y1: this.realRectanglePoints[0].y,
          x2: this.realRectanglePoints[1].x,
          y2: this.realRectanglePoints[1].y,
          info: this.markinfo,
        });
        this.fabricObj.remove(this.temRectangle[0]);
        this.fabricObj.add(this.rectangle);
        this.fabricObj.renderAll();
        this.rectanglePoints = [];
        this.realRectanglePoints = [];
        this.rectangle = null;
        this.temRectangle = [];
        console.log("rectangleArray", this.rectangleArray);
        console.log("rectangleinfoArray", this.rectangleinfoArray);
        console.log("realrectangleinfoArray", this.realrectangleinfoArray);
        console.log("temRectangle", this.temRectangle[0]);
        if (this.islabeling) {
          this.islabeling = false;
        }
      } else {
        console.log("click repeat!!!");
      }
    },
    makeRectangle() {
      //生成绘制矩形
      console.log("rectanglePointsinnnnn", this.rectanglePoints);
      if (this.rectanglePoints[0].x > this.rectanglePoints[1].x) {
        let tem = this.rectanglePoints[0].x;
        this.rectanglePoints[0].x = this.rectanglePoints[1].x;
        this.rectanglePoints[1].x = tem;
      }
      if (this.rectanglePoints[0].y > this.rectanglePoints[1].y) {
        let tem = this.rectanglePoints[0].y;
        this.rectanglePoints[0].y = this.rectanglePoints[1].y;
        this.rectanglePoints[1].y = tem;
      }
      if (this.realRectanglePoints[0].x > this.realRectanglePoints[1].x) {
        let tem = this.realRectanglePoints[0].x;
        this.realRectanglePoints[0].x = this.realRectanglePoints[1].x;
        this.realRectanglePoints[1].x = tem;
      }
      if (this.realRectanglePoints[0].y > this.realRectanglePoints[1].y) {
        let tem = this.realRectanglePoints[0].y;
        this.realRectanglePoints[0].y = this.realRectanglePoints[1].y;
        this.realRectanglePoints[1].y = tem;
      }
      let temrectangleA = new fabric.Rect({
        left: this.rectanglePoints[0].x,
        top: this.rectanglePoints[0].y,
        fill: this.markcolor,
        width: this.rectanglePoints[1].x - this.rectanglePoints[0].x,
        height: this.rectanglePoints[1].y - this.rectanglePoints[0].y,
        //strokeWidth: 2,
        //stroke: "#880E4F",
        //rx: 10,
        //ry: 10,
        //angle: 45,
        //scaleX: 3,
        //scaleY: 3,
        hasControls: false,
        borderColor: "red",
        //hasRotatingPoint:false,
        //strokeWidth: 3,
        selectable: false,
        //stroke: this.markcolor,
      });
      //this.rectangle.oldsx=this.rectangle.scaleX;
      //this.rectangle.oldsy=this.rectangle.scaleY;
      let _this = this;
      temrectangleA.on("scaled", function () {
        //缩放大小
        //console.log("this",this,this.left)
        this.set({
          width: this.width * this.scaleX,
          height: this.height * this.scaleY,
          scaleX: 1,
          scaleY: 1,
        });
        console.log(
          "suofangsuofang",
          this,
          _this.rectangleinfoArray[_this.rectangleArray.indexOf(this)],
          _this.realrectangleinfoArray[_this.rectangleArray.indexOf(this)]
        );
        _this.rectangleinfoArray[_this.rectangleArray.indexOf(this)].x1 =
          this.left;
        _this.rectangleinfoArray[_this.rectangleArray.indexOf(this)].y1 =
          this.top;
        _this.rectangleinfoArray[_this.rectangleArray.indexOf(this)].x2 =
          this.left + this.width;
        _this.rectangleinfoArray[_this.rectangleArray.indexOf(this)].y1 =
          this.top + this.height;
        _this.realrectangleinfoArray[_this.rectangleArray.indexOf(this)].x1 =
          this.left / _this.scalewidth;
        _this.realrectangleinfoArray[_this.rectangleArray.indexOf(this)].y1 =
          this.top / _this.scaleheight;
        _this.realrectangleinfoArray[_this.rectangleArray.indexOf(this)].x2 =
          (this.left + this.width) / _this.scalewidth;
        _this.realrectangleinfoArray[_this.rectangleArray.indexOf(this)].y2 =
          (this.top + this.height) / _this.scaleheight;
      });
      temrectangleA.on("moved", function () {
        //移动
        //console.log("54353454365663634643643643",this,this.left)
        console.log(
          "yidong",
          this,
          _this.rectangleinfoArray[_this.rectangleArray.indexOf(this)],
          _this.realrectangleinfoArray[_this.rectangleArray.indexOf(this)]
        );
        _this.rectangleinfoArray[_this.rectangleArray.indexOf(this)].x1 =
          this.left;
        _this.rectangleinfoArray[_this.rectangleArray.indexOf(this)].y1 =
          this.top;
        _this.rectangleinfoArray[_this.rectangleArray.indexOf(this)].x2 =
          this.left + this.width;
        _this.rectangleinfoArray[_this.rectangleArray.indexOf(this)].y2 =
          this.top + this.height;
        _this.realrectangleinfoArray[_this.rectangleArray.indexOf(this)].x1 =
          this.left / _this.scalewidth;
        _this.realrectangleinfoArray[_this.rectangleArray.indexOf(this)].y1 =
          this.top / _this.scaleheight;
        _this.realrectangleinfoArray[_this.rectangleArray.indexOf(this)].x2 =
          (this.left + this.width) / _this.scalewidth;
        _this.realrectangleinfoArray[_this.rectangleArray.indexOf(this)].y2 =
          (this.top + this.height) / _this.scaleheight;
      });
      temrectangleA.setControlsVisibility({ mtr: false });
      temrectangleA.type = "rectangle";
      temrectangleA.color = this.markcolor;
      temrectangleA.info = this.markinfo;
      this.rectangle = temrectangleA;
      console.log("this.rectangle", this.rectangle);
    },
    //找到标签对应的颜色
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
    //获取所有点中最上边的点的坐标
    findTopPaddingForRoof(roofPoints) {
      var result = 999999;
      for (var f = 0; f < this.roofPoints.length; f++) {
        if (roofPoints[f].y < result) {
          result = roofPoints[f].y;
        }
      }
      return Math.abs(result);
    },
    //获取所有点中最左边的点的坐标
    findLeftPaddingForRoof(roofPoints) {
      var result = 999999;
      for (var i = 0; i < this.roofPoints.length; i++) {
        if (roofPoints[i].x < result) {
          result = roofPoints[i].x;
        }
      }
      return Math.abs(result);
    },
  },
};
</script>
<style scoped>
.canvas {
  border: 1px solid black;
}
.polygon-body {
}
.delpolygon {
  margin-top: 20px;
  vertical-align: top;
}
.polygon {
  display: inline-block;
}
.infopolygon {
  display: inline-block;
  overflow: auto;
  max-height: 600px;
  max-width: 450px;
  vertical-align: top;
}
.el-divider--vertical {
  display: inline-block;
  background-color: #dcdfe6;
  width: 1px;
  height: 800px;
  margin: 0 8px;
  vertical-align: middle;
  position: relative;
}
</style>
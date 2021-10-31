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
            //width:'1000px',
            //height:'750px',
            //margin:' 0 auto',
            //width:canvaswidth+'px',
            //height:canvasheight+'px',
          }"
        >
          <!-- <canvas
            id="label-canvas"
            class="canvas"
            :width="canvaswidth"
            :height="canvasheight"
          ></canvas> -->
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
      <!-- <div id="rightdiv">
        <div class="infopolygon" :style="{
          marginLeft: 20+'px',
          maxHeight: 600+'px',
        }" ref="tagdiv"> -->
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
                background: items.color,
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
                  {{
                    items.type == "polygon"
                      ? "多边形"
                      : items.type == "line"
                      ? "线"
                      : items.type == "point"
                      ? "点"
                      : items.type == "rectangle"
                      ? "矩形"
                      : "椭圆形"
                  }}
                  {{ items.info }}
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
      radio: "polygonmark",
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
      roof: null,
      line: null,
      cicle: null,
      rectangle: null,
      ellipse: null,
      //istrue: false,
      panning: false,
      zoom: 1,
      //havefabricobj:false,

      islabeling: false,

      allobjArray: [],

      temtwopoint: [],
      testcirclearray: [],
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
      linePoints: [], //线点数组
      realLinePoints: [], //真实线点数组
      circlePoints: [], //点数组
      rectanglePoints: [], //矩形点数组
      ellipsePoints: [], //椭圆点数组
      realCirclePoints: [], //真实点数组
      roofPoints: [], //多边形点数组
      realPoints: [], //真实多边形点数组
      realRectanglePoints: [], //真实矩形点数组
      realEllipsePoints: [], //真实椭圆点数组
      temRectangle: [], //矩形标注时的临时矩形，用于显示
      temEllipse: [], //椭圆标注时的临时椭圆，用于显示
      temlines: [], //多边形标记时候的线数组
      temlineCounter: 0, //多边形标记时候的线计数
      temcircles: [], //多边形标记时候的点数组
      temcircleCounter: 0, //多边形标记时候的点计数
      llines: [], //线标记时候的线数组
      llinesCounter: 0, //线标记时候的线计数
      lineArray: [], //线对象数组
      lineinfoArray: [], //线对象信息数组
      reallineinfoArray: [], //真实线对象信息数组
      circleArray: [], //点对象数组
      circleinfoArray: [], //点对象信息数组
      realcircleinfoArray: [], //真实点对象信息数组
      polygonArray: [], //多边形对象数组
      polygoninfoArray: [], //多边形对象信息数组
      realpolygoninfoArray: [], //真实多边形对象信息数组
      rectangleArray: [], //矩形对象数组
      rectangleinfoArray: [], //矩形对象信息数组
      realrectangleinfoArray: [], //真实矩形对象信息数组
      ellipseArray: [], //椭圆对象数组
      ellipseinfoArray: [], //椭圆对象信息数组
      realellipseinfoArray: [], //真实椭圆对象信息数组
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
        this.polygonArray.forEach((item) => {
          this.fabricObj.remove(item);
        });
        this.lineArray.forEach((item) => {
          this.fabricObj.remove(item);
        });
        this.circleArray.forEach((item) => {
          this.fabricObj.remove(item);
        });
        this.rectangleArray.forEach((item) => {
          this.fabricObj.remove(item);
        });
        this.ellipseArray.forEach((item) => {
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
      if (item.type == "polygon") {
        let index2 = this.polygonArray.indexOf(item);
        let poly =
          this.fabricObj.getObjects()[
            this.fabricObj._objects.indexOf(this.polygonArray[index2])
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
      } else if (item.type == "line") {
        let index2 = this.lineArray.indexOf(item);
        let poly =
          this.fabricObj.getObjects()[
            this.fabricObj._objects.indexOf(this.lineArray[index2])
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
      } else if (item.type == "point") {
        let index2 = this.circleArray.indexOf(item);
        let poly =
          this.fabricObj.getObjects()[
            this.fabricObj._objects.indexOf(this.circleArray[index2])
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
      } else if (item.type == "rectangle") {
        let index2 = this.rectangleArray.indexOf(item);
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
      } else if (item.type == "ellipse") {
        let index2 = this.ellipseArray.indexOf(item);
        let poly =
          this.fabricObj.getObjects()[
            this.fabricObj._objects.indexOf(this.ellipseArray[index2])
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
      if (item.type == "polygon") {
        let index2 = this.polygonArray.indexOf(item);
        let poly =
          this.fabricObj.getObjects()[
            this.fabricObj._objects.indexOf(this.polygonArray[index2])
          ];
        console.log(index2, poly);
        poly.hasBorders = false;
        poly.hasControls = true;
        poly.selectable = false;
        poly.set({
          lockMovementX: true,
          lockMovementY: true,
        });
        this.fabricObj.discardActiveObject(poly);
        this.fabricObj.renderAll();
      } else if (item.type == "line") {
        let index2 = this.lineArray.indexOf(item);
        let poly =
          this.fabricObj.getObjects()[
            this.fabricObj._objects.indexOf(this.lineArray[index2])
          ];
        console.log(index2, poly);
        poly.hasBorders = false;
        poly.hasControls = false;
        poly.selectable = false;
        poly.set({
          lockMovementX: true,
          lockMovementY: true,
        });
        this.fabricObj.discardActiveObject(poly);
        this.fabricObj.renderAll();
      } else if (item.type == "point") {
        let index2 = this.circleArray.indexOf(item);
        let poly =
          this.fabricObj.getObjects()[
            this.fabricObj._objects.indexOf(this.circleArray[index2])
          ];
        console.log(index2, poly);
        poly.hasBorders = false;
        poly.hasControls = false;
        poly.selectable = false;
        poly.set({
          lockMovementX: false,
          lockMovementY: false,
        });
        this.fabricObj.discardActiveObject(poly);
        this.fabricObj.renderAll();
      } else if (item.type == "rectangle") {
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
      } else if (item.type == "ellipse") {
        let index2 = this.ellipseArray.indexOf(item);
        let poly =
          this.fabricObj.getObjects()[
            this.fabricObj._objects.indexOf(this.ellipseArray[index2])
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
      //console.log("checkFangdasSuoxiao",direction);
      //console.log("outdiv",this.$refs.outdiv.contains(e));
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
      this.temlines.forEach((item) => this.fabricObj.remove(item));
      this.temcircles.forEach((item) => this.fabricObj.remove(item));
      this.llines.forEach((item) => this.fabricObj.remove(item));
      this.temRectangle.forEach((item) => this.fabricObj.remove(item));
      this.temEllipse.forEach((item) => this.fabricObj.remove(item));
      this.roofPoints = [];
      this.realPoints = [];
      this.linePoints = [];
      this.realLinePoints = [];
      this.rectanglePoints = [];
      this.realRectanglePoints = [];
      this.ellipsePoints = [];
      this.realEllipsePoints = [];
      this.temlines = [];
      this.temcircles = [];
      this.llines = [];
      this.temRectangle = [];
      this.temEllipse = [];
      this.temlineCounter = 0;
      this.temcircleCounter = 0;
      this.b_i = -1;
      console.log(
        "count",
        this.testcirclearray.length,
        "objarr",
        this.testcirclearray
      );
      if (
        this.testcirclearray.length % 2 == 1 &&
        this.testcirclearray.length > 0
      ) {
        //移除未完成线段的单个端点
        console.log("delete one");
        this.testcirclearray.pop();
      }
    },
    clearinfo() {
      this.allobjArray = [];
      this.polygonArray = [];
      this.polygoninfoArray = [];
      this.realpolygoninfoArray = [];
      this.lineArray = [];
      this.lineinfoArray = [];
      this.reallineinfoArray = [];
      this.circleArray = [];
      this.circleinfoArray = [];
      this.realcircleinfoArray = [];
      this.rectangleArray = [];
      this.rectangleinfoArray = [];
      this.realrectangleinfoArray = [];
      this.ellipseArray = [];
      this.ellipseinfoArray = [];
      this.realellipseinfoArray = [];
      this.testcirclearray = [];
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
      this.b_i = -1;
      console.log("img11111111111111111", this.scalewidth, this.scaleheight);
      if (
        this.lastlabelArry.line != undefined &&
        this.lastlabelArry.line != null
      ) {
        //线
        for (let i = 0; i < this.lastlabelArry.line.length; i++) {
          for (let j = 0; j < this.lastlabelArry.line[i].point.length; j++) {
            console.log("point", this.lastlabelArry.line[i].point[j]);
            let a = {};
            let reala = {};
            a["x"] = this.lastlabelArry.line[i].point[j].x * this.scalewidth;
            a["y"] = this.lastlabelArry.line[i].point[j].y * this.scaleheight;
            reala["x"] = this.lastlabelArry.line[i].point[j].x;
            reala["y"] = this.lastlabelArry.line[i].point[j].y;
            this.linePoints.push(a);
            this.realLinePoints.push(reala);
            //this.testcirclearray.push(a)
            this.makeLineEndPoint(a);
          }
          this.markinfo = this.lastlabelArry.line[i].info;
          this.findcolor(this.lastlabelArry.line[i].info);
          this.lineinfoArray.push({
            point: this.linePoints,
            info: this.markinfo,
          });
          this.reallineinfoArray.push({
            point: this.realLinePoints,
            info: this.markinfo,
          });
          console.log("linePoints", this.linePoints);
          this.makeLine(this.linePoints);
          this.fabricObj.add(this.line);
          this.lineArray.push(this.line);
          this.allobjArray.push(this.line);
          this.linePoints = [];
          this.realLinePoints = [];
          this.markinfo = null;
        }
      }
      if (
        this.lastlabelArry.polygon != undefined &&
        this.lastlabelArry.polygon != null
      ) {
        //多边形
        for (let i = 0; i < this.lastlabelArry.polygon.length; i++) {
          this.realpolygoninfoArray.push(this.lastlabelArry.polygon[i]);
          this.markinfo = this.lastlabelArry.polygon[i].info;
          console.log(
            "lastlabelArry[i].point",
            this.lastlabelArry.polygon[i].point
          );
          for (let j = 0; j < this.lastlabelArry.polygon[i].point.length; j++) {
            console.log("point", this.lastlabelArry.polygon[i].point[j]);
            let a = {};
            let reala = {};
            a["x"] = this.lastlabelArry.polygon[i].point[j].x * this.scalewidth;
            a["y"] =
              this.lastlabelArry.polygon[i].point[j].y * this.scaleheight;
            // reala["x"] = this.lastlabelArry[i].point[j].x;
            // reala["y"] = this.lastlabelArry[i].point[j].y;
            this.roofPoints.push(a);
          }
          console.log("roofPoint", this.roofPoints);
          console.log(
            "this.lastlabelArry[i].info",
            this.lastlabelArry.polygon[i].info
          );
          this.findcolor(this.lastlabelArry.polygon[i].info);
          //console.log("typeof color",typeof(color))
          this.makeRoof();
          console.log("this.roof", this.roof);
          this.fabricObj.add(this.roof);
          this.polygonArray.push(this.roof);
          this.allobjArray.push(this.roof);
          this.polygoninfoArray.push({
            point: this.roofPoints,
            info: this.markinfo,
          });
          this.markinfo = null;
          // this.fabricObj.renderAll();
          console.log("create 1");
          // //clear arrays
          console.log("roofPointsuuu", this.roofPoints);
          this.roofPoints = [];
        }
      }
      if (
        this.lastlabelArry.rectangle != undefined &&
        this.lastlabelArry.rectangle != null
      ) {
        //矩形
        for (let i = 0; i < this.lastlabelArry.rectangle.length; i++) {
          console.log("rectangle1", this.lastlabelArry.rectangle[i]);
          for (
            let j = 0;
            j < this.lastlabelArry.rectangle[i].point.length;
            j++
          ) {
            console.log("rectangle2", this.lastlabelArry.rectangle[i].point[j]);
            let a = {};
            let reala = {};
            a["x"] =
              this.lastlabelArry.rectangle[i].point[j].x * this.scalewidth;
            a["y"] =
              this.lastlabelArry.rectangle[i].point[j].y * this.scaleheight;
            reala["x"] = this.lastlabelArry.rectangle[i].point[j].x;
            reala["y"] = this.lastlabelArry.rectangle[i].point[j].y;
            this.rectanglePoints.push(a);
            this.realRectanglePoints.push(reala);
          }
          this.markinfo = this.lastlabelArry.rectangle[i].info;
          this.findcolor(this.lastlabelArry.rectangle[i].info);
          this.makeRectangle();
          this.rectangleArray.push(this.rectangle);
          this.allobjArray.push(this.rectangle);
          this.rectangleinfoArray.push({
            point: this.rectanglePoints,
            info: this.markinfo,
          });
          this.realrectangleinfoArray.push({
            point: this.realRectanglePoints,
            info: this.markinfo,
          });
          this.fabricObj.add(this.rectangle);
          this.rectanglePoints = [];
          this.realRectanglePoints = [];
          this.rectangle = null;
        }
      }
      if (
        this.lastlabelArry.ellipse != undefined &&
        this.lastlabelArry.ellipse != null
      ) {
        //椭圆形
        for (let i = 0; i < this.lastlabelArry.ellipse.length; i++) {
          console.log("ellipse1", this.lastlabelArry.ellipse[i]);
          for (let j = 0; j < this.lastlabelArry.ellipse[i].point.length; j++) {
            console.log("ellipse2", this.lastlabelArry.ellipse[i].point[j]);
            let a = {};
            let reala = {};
            a["x"] = this.lastlabelArry.ellipse[i].point[j].x * this.scalewidth;
            a["y"] =
              this.lastlabelArry.ellipse[i].point[j].y * this.scaleheight;
            reala["x"] = this.lastlabelArry.ellipse[i].point[j].x;
            reala["y"] = this.lastlabelArry.ellipse[i].point[j].y;
            this.ellipsePoints.push(a);
            this.realEllipsePoints.push(reala);
          }
          this.markinfo = this.lastlabelArry.ellipse[i].info;
          this.findcolor(this.lastlabelArry.ellipse[i].info);
          this.makeEllipse();
          this.ellipseArray.push(this.ellipse);
          this.allobjArray.push(this.ellipse);
          this.ellipseinfoArray.push({
            point: this.ellipsePoints,
            info: this.markinfo,
          });
          this.realellipseinfoArray.push({
            point: this.realEllipsePoints,
            info: this.markinfo,
          });
          this.fabricObj.add(this.ellipse);
          this.ellipsePoints = [];
          this.realEllipsePoints = [];
          this.ellipse = null;
        }
      }
      if (
        this.lastlabelArry.circle != undefined &&
        this.lastlabelArry.circle != null
      ) {
        //点
        for (let i = 0; i < this.lastlabelArry.circle.length; i++) {
          console.log("circle", this.lastlabelArry.circle[i].point);
          this.markinfo = this.lastlabelArry.circle[i].info;
          this.findcolor(this.lastlabelArry.circle[i].info);
          let a = {};
          let reala = {};
          a["x"] = this.lastlabelArry.circle[i].point.x * this.scalewidth;
          a["y"] = this.lastlabelArry.circle[i].point.y * this.scaleheight;
          reala["x"] = this.lastlabelArry.circle[i].point.x;
          reala["y"] = this.lastlabelArry.circle[i].point.y;
          let apoint = new fabric.Circle({
            radius: 5,
            fill: this.markcolor,
            selectable: false,
            hasBorders: false,
            hasControls: false,
            borderColor: "red",
            top: a.y - 5,
            left: a.x - 5,
          });
          apoint.on("moved", () => {
            //移动完成修改数据
            console.log(
              "aisojfgyaigvy7a98g",
              this.circleinfoArray[this.circleArray.indexOf(apoint)]
            );
            this.circleinfoArray[this.circleArray.indexOf(apoint)].point.x =
              apoint.left + 5;
            this.circleinfoArray[this.circleArray.indexOf(apoint)].point.y =
              apoint.top + 5;
            this.realcircleinfoArray[this.circleArray.indexOf(apoint)].point.x =
              (apoint.left + 5) / this.scalewidth;
            this.realcircleinfoArray[this.circleArray.indexOf(apoint)].point.y =
              (apoint.top + 5) / this.scaleheight;
          });
          apoint.type = "point";
          apoint.color = this.markcolor;
          apoint.info = this.markinfo;
          this.circleArray.push(apoint);
          this.allobjArray.push(apoint);
          this.fabricObj.add(apoint);
          this.circleinfoArray.push({
            point: a,
            info: this.markinfo,
          });
          this.realcircleinfoArray.push({
            point: reala,
            info: this.markinfo,
          });
          this.markinfo = null;
        }
      }
      this.fabricObj.renderAll();
      this.fabricObj.hoverCursor = "default";
      //this.havefabricobj=true;
      // console.log("realpolygoninfoArray", this.realpolygoninfoArray);
      console.log("fabricobjuuu", this.fabricObj);
      console.log("polygonArrayuuu", this.polygonArray);
      console.log("polygoninfoArrayuuu", this.polygoninfoArray);
      console.log("realpolygoninfoArrayuuu", this.realpolygoninfoArray);
      console.log("realPointsuuu", this.realPoints);
      console.log("temlinesuuu", this.temlines);
      console.log("temlineCounteruuu", this.temlineCounter);
      console.log("lineArrayuuu", this.lineArray);
      console.log("lineinfoArrayuuu", this.lineinfoArray);
      console.log("reallineinfoArrayuuu", this.reallineinfoArray);
      console.log("circlearray", this.circleArray);
      console.log("circleinfoarray", this.circleinfoArray);
      console.log("realcircleinfoarray", this.realcircleinfoArray);
      console.log("polygonArrayuuu", this.polygonArray);
      console.log("polygonArrayuuu", this.polygonArray);
      console.log("polygonArrayuuu", this.polygonArray);
      console.log("allobjArrayuuu", this.allobjArray);
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
    makePolygon() {
      //生成标注多边形
      this.temlines.forEach((item) => this.fabricObj.remove(item));
      this.temcircles.forEach((item) => this.fabricObj.remove(item));
      if (this.roofPoints.length > 2) {
        //阻止生成2个点以下的对象，包括空白对象，点对象，线对象
        // canvas.remove(lines[lineCounter - 1]);
        this.makeRoof();
        console.log(this.roof);
        this.fabricObj.add(this.roof);
        this.polygonArray.push(this.roof);
        this.allobjArray.push(this.roof);
        this.polygoninfoArray.push({
          point: this.roofPoints,
          info: this.markinfo,
        });
        this.realpolygoninfoArray.push({
          point: this.realPoints,
          info: this.markinfo,
        });
      }
      this.fabricObj.renderAll();
      //console.log("point!",this.roofPoints)
      console.log("double click");
      //clear arrays
      this.roofPoints = [];
      this.realPoints = [];
      this.temlines = [];
      this.temcircles = [];
      this.temlineCounter = 0;
      this.temcircleCounter = 0;
    },
    makeRoof() {
      //生成绘制多边形
      //定义多边形生成时的生成位置
      //console.log("makefroof",e)

      let left = this.findLeftPaddingForRoof(this.roofPoints);
      let top = this.findTopPaddingForRoof(this.roofPoints);
      //   let a = {};
      //   a["x"] = this.roofPoints[0].x;
      //   a["y"] = this.roofPoints[0].y;
      //   this.roofPoints.push(a);
      console.log("!!!roofPoint", this.roofPoints);
      console.log("!!!fabricObj", this.fabricObj);
      //生成多边形
      this.roof = new fabric.Polygon(this.roofPoints, {
        //fill: "rgba(255,255,0,0)",
        fill: this.markcolor,
        //fill: color,
        strokeWidth: 5,
        selectable: false,
        //hasControls: false,
        //hasBordes:false,
        //stroke: "red",
        hasBorders: false,
        borderColor: "red",
        lockMovementX: true,
        lockMovementY: true,
        objectCaching: false,
        transparentCorners: false,
        left: left,
        top: top,
      });
      this.roof.type = "polygon";
      this.roof.color = this.markcolor;
      this.roof.info = this.markinfo;
      //this.roof.bringToFront();
      console.log("create!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", this.roof);
      // this.roof.on({
      //   selected: (e) => {
      //     console.log(e);
      //     console.log("selected");
      //   },
      // });
    },
    makeLineObj(e) {
      //生成标注线
      if (
        //防止过长时间重复点一个点时点入栈
        e.absolutePointer.x != this.linePoints[0].x ||
        e.absolutePointer.y != this.linePoints[0].y
      ) {
        let a = {};
        let reala = {};
        a["x"] = e.absolutePointer.x;
        a["y"] = e.absolutePointer.y;
        reala["x"] = e.absolutePointer.x / this.scalewidth;
        reala["y"] = e.absolutePointer.y / this.scaleheight;
        this.linePoints.push(a);
        this.realLinePoints.push(reala);
        this.makeLineEndPoint(a);
        this.makeLine(this.linePoints);
        // this.lineArray.reverse()
        this.lineArray.push(this.line);
        // this.lineArray.reverse()
        // this.allobjArray.reverse()
        this.allobjArray.splice(this.lineArray.length - 1, 0, this.line);
        // this.allobjArray.reverse()
        // this.lineinfoArray.reverse()
        this.lineinfoArray.push({
          point: this.linePoints,
          info: this.markinfo,
        });
        // this.lineinfoArray.reverse()
        // this.reallineinfoArray.reverse()
        this.reallineinfoArray.push({
          point: this.realLinePoints,
          info: this.markinfo,
        });
        // this.reallineinfoArray.reverse()
        this.fabricObj.remove(this.llines[0]);
        this.fabricObj.add(this.line);
        //console.log("worinima",this.fabricObj.getObjects()[this.fabricObj._objects.indexOf(this.line)])
        //this.fabricObj.getObjects()[this.fabricObj._objects.indexOf(this.line)].sendToBack();
        console.log("this.fabricObj._objects", this.fabricObj._objects);
        for (
          let i = 0;
          i <
          this.polygonArray.length +
            this.circleArray.length +
            this.rectangleArray.length;
          i++
        ) {
          this.fabricObj
            .getObjects()
            [this.fabricObj._objects.indexOf(this.line)].sendBackwards();
        }
        this.fabricObj.renderAll();
        this.linePoints = [];
        this.realLinePoints = [];
        this.line = null;
        this.llines = [];
        console.log("linearray", this.lineArray);
        console.log("lineinfoarray", this.lineinfoArray);
        console.log("reallineinfoarray", this.reallineinfoArray);
        console.log("llinesttttt", this.llines[0]);
        if (this.islabeling) {
          this.islabeling = false;
        }
      } else {
        console.log("click repeat!!!");
      }
    },
    makeLine(alinePoints) {
      //生成绘制线起点
      console.log("alinePoints", alinePoints);
      let twopoints = [
        alinePoints[0].x,
        alinePoints[0].y,
        alinePoints[1].x,
        alinePoints[1].y,
      ];
      this.line = new fabric.Line(twopoints, {
        strokeWidth: 3,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        borderColor: "red",
        //transparentCorners:false ,
        //strokeUniform :true,
        stroke: this.markcolor,
        //stroke:"red",
      });
      this.line.type = "line";
      this.line.color = this.markcolor;
      this.line.info = this.markinfo;
      //this.line.sendToBack();
      console.log("this.line", this.line);
    },
    makeLineEndPoint(a) {
      //生成绘制线
      let apoint = new fabric.Circle({
        radius: 5,
        fill: "green",
        selectable: true,
        hasBorders: false,
        hasControls: false,
        top: a.y - 5,
        left: a.x - 5,
      });
      apoint.bringToFront();
      if (this.testcirclearray.length % 2 == 0) {
        apoint.on("moving", () => {
          //移动修改坐标
          this.lineArray[this.testcirclearray.indexOf(apoint) / 2].set({
            x1: apoint.left + 5,
            y1: apoint.top + 5,
          });
        });
        apoint.on("moved", () => {
          //移动完成修改数据
          //console.log(this.scalewidth,",",this.scaleheight)
          // console.log(this.lineArray[this.testcirclearray.indexOf(apoint)/2])
          // console.log(this.lineinfoArray[this.testcirclearray.indexOf(apoint)/2])
          // console.log(this.reallineinfoArray[this.testcirclearray.indexOf(apoint)/2])
          this.lineinfoArray[
            this.testcirclearray.indexOf(apoint) / 2
          ].point[0].x = apoint.left + 5;
          this.lineinfoArray[
            this.testcirclearray.indexOf(apoint) / 2
          ].point[0].y = apoint.top + 5;
          this.reallineinfoArray[
            this.testcirclearray.indexOf(apoint) / 2
          ].point[0].x = (apoint.left + 5) / this.scalewidth;
          this.reallineinfoArray[
            this.testcirclearray.indexOf(apoint) / 2
          ].point[0].y = (apoint.top + 5) / this.scaleheight;
        });
      } else {
        apoint.on("moving", () => {
          //移动修改坐标
          this.lineArray[(this.testcirclearray.indexOf(apoint) - 1) / 2].set({
            x2: apoint.left + 5,
            y2: apoint.top + 5,
          });
        });
        apoint.on("moved", () => {
          //移动完成修改数据
          // console.log(this.lineArray[(this.testcirclearray.indexOf(apoint)-1)/2])
          // console.log(this.lineinfoArray[(this.testcirclearray.indexOf(apoint)-1)/2])
          // console.log(this.reallineinfoArray[(this.testcirclearray.indexOf(apoint)-1)/2])
          this.lineinfoArray[
            (this.testcirclearray.indexOf(apoint) - 1) / 2
          ].point[1].x = apoint.left + 5;
          this.lineinfoArray[
            (this.testcirclearray.indexOf(apoint) - 1) / 2
          ].point[1].y = apoint.top + 5;
          this.reallineinfoArray[
            (this.testcirclearray.indexOf(apoint) - 1) / 2
          ].point[1].x = (apoint.left + 5) / this.scalewidth;
          this.reallineinfoArray[
            (this.testcirclearray.indexOf(apoint) - 1) / 2
          ].point[1].y = (apoint.top + 5) / this.scaleheight;
        });
      }

      this.testcirclearray.push(apoint);
      //this.testcirclecount++;
    },
    makePointObj(e) {
      //生成绘制与标注点
      console.log("4444");
      // if(!this.islabeling) {
      //   this.islabeling=true;
      // }
      let a = {};
      let reala = {};
      //this.fabricObj.add(this.testpoint)
      a["x"] = e.absolutePointer.x;
      a["y"] = e.absolutePointer.y;
      reala["x"] = e.absolutePointer.x / this.scalewidth;
      reala["y"] = e.absolutePointer.y / this.scaleheight;
      let apoint = new fabric.Circle({
        radius: 5,
        fill: this.markcolor,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        borderColor: "red",
        top: a.y - 5,
        left: a.x - 5,
      });
      apoint.on("moved", () => {
        //移动完成修改数据
        this.circleinfoArray[this.circleArray.indexOf(apoint)].x =
          apoint.left + 5;
        this.circleinfoArray[this.circleArray.indexOf(apoint)].y =
          apoint.top + 5;
        this.realcircleinfoArray[this.circleArray.indexOf(apoint)].x =
          (apoint.left + 5) / this.scalewidth;
        this.realcircleinfoArray[this.circleArray.indexOf(apoint)].y =
          (apoint.top + 5) / this.scaleheight;
      });
      apoint.type = "point";
      apoint.color = this.markcolor;
      apoint.info = this.markinfo;
      this.circleArray.push(apoint);
      this.allobjArray.push(apoint);
      this.circleinfoArray.push({
        point: a,
        info: this.markinfo,
      });
      this.realcircleinfoArray.push({
        point: reala,
        info: this.markinfo,
      });
      this.fabricObj.add(apoint);
      this.fabricObj.renderAll();
      console.log("circlearray", this.circleArray);
      console.log("circleinfoarray", this.circleinfoArray);
      console.log("realcircleinfoarray", this.realcircleinfoArray);
      //console.log("llinesttttt",this.llines[0])
    },
    makeRectangleObj(e) {
      //生成绘制矩形
      if (
        //防止过长时间重复点一个点时点入栈
        e.absolutePointer.x != this.rectanglePoints[0].x ||
        e.absolutePointer.y != this.rectanglePoints[0].y
      ) {
        console.log("dasiogfu890asdguyqehn fbewjkb fwekjb wef e eq");
        let a = {};
        let reala = {};
        a["x"] = e.absolutePointer.x;
        a["y"] = e.absolutePointer.y;
        reala["x"] = e.absolutePointer.x / this.scalewidth;
        reala["y"] = e.absolutePointer.y / this.scaleheight;
        this.rectanglePoints.push(a);
        this.realRectanglePoints.push(reala);
        this.makeRectangle();
        this.rectangleArray.push(this.rectangle);
        this.allobjArray.push(this.rectangle);
        this.rectangleinfoArray.push({
          point: this.rectanglePoints,
          info: this.markinfo,
        });
        this.realrectangleinfoArray.push({
          point: this.realRectanglePoints,
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
      console.log("rectanglePoints", this.rectanglePoints);
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
        _this.rectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[0].x = this.left;
        _this.rectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[0].y = this.top;
        _this.rectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[1].x = this.left + this.width;
        _this.rectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[1].y = this.top + this.height;
        _this.realrectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[0].x = this.left / _this.scalewidth;
        _this.realrectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[0].y = this.top / _this.scaleheight;
        _this.realrectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[1].x = (this.left + this.width) / _this.scalewidth;
        _this.realrectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[1].y = (this.top + this.height) / _this.scaleheight;
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
        _this.rectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[0].x = this.left;
        _this.rectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[0].y = this.top;
        _this.rectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[1].x = this.left + this.width;
        _this.rectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[1].y = this.top + this.height;
        _this.realrectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[0].x = this.left / _this.scalewidth;
        _this.realrectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[0].y = this.top / _this.scaleheight;
        _this.realrectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[1].x = (this.left + this.width) / _this.scalewidth;
        _this.realrectangleinfoArray[
          _this.rectangleArray.indexOf(this)
        ].point[1].y = (this.top + this.height) / _this.scaleheight;
      });
      temrectangleA.setControlsVisibility({ mtr: false });
      temrectangleA.type = "rectangle";
      temrectangleA.color = this.markcolor;
      temrectangleA.info = this.markinfo;
      this.rectangle = temrectangleA;
      //this.line.sendToBack();
      console.log("this.rectangle", this.rectangle);
    },
    makeEllipseObj(e) {
      //生成标注椭圆
      if (
        //防止过长时间重复点一个点时点入栈
        e.absolutePointer.x != this.ellipsePoints[0].x ||
        e.absolutePointer.y != this.ellipsePoints[0].y
      ) {
        let a = {};
        let reala = {};
        a["x"] = e.absolutePointer.x;
        a["y"] = e.absolutePointer.y;
        reala["x"] = e.absolutePointer.x / this.scalewidth;
        reala["y"] = e.absolutePointer.y / this.scaleheight;
        this.ellipsePoints.push(a);
        this.realEllipsePoints.push(reala);
        this.makeEllipse();
        this.ellipseArray.push(this.ellipse);
        this.allobjArray.push(this.ellipse);
        this.ellipseinfoArray.push({
          point: this.ellipsePoints,
          info: this.markinfo,
        });
        this.realellipseinfoArray.push({
          point: this.realEllipsePoints,
          info: this.markinfo,
        });
        this.fabricObj.remove(this.temEllipse[0]);
        this.fabricObj.add(this.ellipse);
        this.fabricObj.renderAll();
        this.ellipsePoints = [];
        this.realEllipsePoints = [];
        this.ellipse = null;
        this.temEllipse = [];
        console.log("ellipseArray", this.ellipseArray);
        console.log("ellipseinfoArray", this.ellipseinfoArray);
        console.log("realellipseinfoArray", this.realellipseinfoArray);
        console.log("temEllipse", this.temEllipse[0]);
        if (this.islabeling) {
          this.islabeling = false;
        }
      } else {
        console.log("click repeat!!!");
      }
    },
    makeEllipse() {
      //生成绘制椭圆
      console.log("ellipsePoints", this.ellipsePoints);
      if (this.ellipsePoints[0].x > this.ellipsePoints[1].x) {
        let tem = this.ellipsePoints[0].x;
        this.ellipsePoints[0].x = this.ellipsePoints[1].x;
        this.ellipsePoints[1].x = tem;
      }
      if (this.ellipsePoints[0].y > this.ellipsePoints[1].y) {
        let tem = this.ellipsePoints[0].y;
        this.ellipsePoints[0].y = this.ellipsePoints[1].y;
        this.ellipsePoints[1].y = tem;
      }
      if (this.ellipsePoints[0].x > this.ellipsePoints[1].x) {
        let tem = this.ellipsePoints[0].x;
        this.ellipsePoints[0].x = this.ellipsePoints[1].x;
        this.ellipsePoints[1].x = tem;
      }
      if (this.ellipsePoints[0].y > this.ellipsePoints[1].y) {
        let tem = this.ellipsePoints[0].y;
        this.ellipsePoints[0].y = this.ellipsePoints[1].y;
        this.ellipsePoints[1].y = tem;
      }
      let temellipseA = new fabric.Ellipse({
        left: this.ellipsePoints[0].x,
        top: this.ellipsePoints[0].y,
        fill: this.markcolor,
        rx: (this.ellipsePoints[1].x - this.ellipsePoints[0].x) / 2,
        ry: (this.ellipsePoints[1].y - this.ellipsePoints[0].y) / 2,
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
      let _this = this;
      temellipseA.on("scaled", function () {
        //缩放大小
        //console.log("this",this,this.left)
        this.set({
          rx: this.rx * this.scaleX,
          ry: this.ry * this.scaleY,
          scaleX: 1,
          scaleY: 1,
        });
        console.log(
          "suofangsuofang",
          this,
          _this.ellipseinfoArray[_this.ellipseArray.indexOf(this)],
          _this.ellipseinfoArray[_this.ellipseArray.indexOf(this)]
        );
        _this.ellipseinfoArray[_this.ellipseArray.indexOf(this)].point[0].x =
          this.left;
        _this.ellipseinfoArray[_this.ellipseArray.indexOf(this)].point[0].y =
          this.top;
        _this.ellipseinfoArray[_this.ellipseArray.indexOf(this)].point[1].x =
          this.left + this.rx * 2;
        _this.ellipseinfoArray[_this.ellipseArray.indexOf(this)].point[1].y =
          this.top + this.ry * 2;
        _this.realellipseinfoArray[
          _this.ellipseArray.indexOf(this)
        ].point[0].x = this.left / _this.scalewidth;
        _this.realellipseinfoArray[
          _this.ellipseArray.indexOf(this)
        ].point[0].y = this.top / _this.scaleheight;
        _this.realellipseinfoArray[
          _this.ellipseArray.indexOf(this)
        ].point[1].x = (this.left + this.rx * 2) / _this.scalewidth;
        _this.realellipseinfoArray[
          _this.ellipseArray.indexOf(this)
        ].point[1].y = (this.top + this.ry * 2) / _this.scaleheight;
      });
      temellipseA.on("moved", function () {
        //移动
        //console.log("54353454365663634643643643",this,this.left)
        console.log(
          "yidong",
          this,
          _this.ellipseinfoArray[_this.ellipseArray.indexOf(this)],
          _this.ellipseinfoArray[_this.ellipseArray.indexOf(this)]
        );
        _this.ellipseinfoArray[_this.ellipseArray.indexOf(this)].point[0].x =
          this.left;
        _this.ellipseinfoArray[_this.ellipseArray.indexOf(this)].point[0].y =
          this.top;
        _this.ellipseinfoArray[_this.ellipseArray.indexOf(this)].point[1].x =
          this.left + this.rx * 2;
        _this.ellipseinfoArray[_this.ellipseArray.indexOf(this)].point[1].y =
          this.top + this.ry * 2;
        _this.realellipseinfoArray[
          _this.ellipseArray.indexOf(this)
        ].point[0].x = this.left / _this.scalewidth;
        _this.realellipseinfoArray[
          _this.ellipseArray.indexOf(this)
        ].point[0].y = this.top / _this.scaleheight;
        _this.realellipseinfoArray[
          _this.ellipseArray.indexOf(this)
        ].point[1].x = (this.left + this.rx * 2) / _this.scalewidth;
        _this.realellipseinfoArray[
          _this.ellipseArray.indexOf(this)
        ].point[1].y = (this.top + this.ry * 2) / _this.scaleheight;
      });
      temellipseA.setControlsVisibility({ mtr: false });
      temellipseA.type = "ellipse";
      temellipseA.color = this.markcolor;
      temellipseA.info = this.markinfo;
      this.ellipse = temellipseA;
      //this.line.sendToBack();
      console.log("this.ellipse", this.ellipse);
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
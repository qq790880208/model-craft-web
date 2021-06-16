<template>
  <div class="polygon-body" style="width:100% ">
    <div>
      <el-button
        type="primary"
        icon="el-icon-edit"
        circle
        id="poly"
        title="Draw Polygon"
        @click="start"
        >{{ buttonstate }}</el-button
      >
      <label style="color: blue"><b></b></label>
      <el-button @click="fangda">放大</el-button>
      <el-button @click="suoxiao">缩小</el-button>
      <el-button @click="huanyuan">还原图片大小</el-button>
      <el-button @click="saveinfo">保存 </el-button>
      <el-button @click="updatelastdata">查看上次标注数据</el-button>
    </div>
    <!-- <el-button @click="Edit">test</el-button>-->
    <div class="polygon"
      :style="{
        //margin:' 0 auto',
        //width:canvaswidth+'px',
        //height:canvasheight+'px',
      }"
    >
      <canvas
        id="label-canvas"
        class="canvas"
        :width="canvaswidth"
        :height="canvasheight"
      ></canvas>
    </div>

    <div class="infopolygon"
      style="margin-left: 50px; border: 1px solid #666; width: 25%"
    >
      <div v-for="(items, index) in premarktype" :key="index" style="float:left;margin-right: 20px;">
        <el-button @click="changeinfo(items)">{{ items.name }}</el-button>
      </div>
    </div>

    <div class="delpolygon" style="width=50%;height=50%">
      <!-- <div style="margin-left:50px;float:left;border:1px solid #666;width:25%"> -->
      <el-button
        v-for="(items, index) in polygonArray"
        :key="index"
        type="danger"
        @mouseover.native="infotip(index)"
        @mouseout.native="removetip"
        @mousedown.native="deletemarked(index)"
        style="float: left; margin-right: 20px"
        >删除{{ index + 1 }}
      </el-button>
    </div>

    <!--<div style="text-align: center; margin: 0 auto">
      <label style="color: blue"
        ><b style="text-align: center"
          >输入一个不大于标注个数的数字，鼠标放在删除上能看到将要删除的对象</b
        ></label
      >
      <el-row>
        <el-input
          v-model="input"
          placeholder="请输入内容"
          style="width: 300px"
          clearable
        ></el-input>
        
        <el-button
          @mouseover.native="infotip"
          @mouseout.native="removetip"
          @mousedown.native="deletemarked"
          type="danger"
          >删除</el-button
        >
      </el-row>
      </div> -->
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
    lastlabelArry: {
      type: Array,
      default: () => [],
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
      input: null,
      temproof: null,
      roof: null,
      istrue: false,
      panning: false,
      zoom: 1,

      scalewidth: null, //图片宽度缩放倍数
      scaleheight: null, //图片高度缩放倍数
      roofPoints: [], //多边形点数组
      realPoints: [], //真实多边形点数组
      lines: [], //线数组
      lineCounter: 0, //线计数
      polygonArray: [], //多边形对象数组
      polygoninfoArray: [], //多边形对象信息数组
      realpolygoninfoArray: [], //真实多边形对象信息数组
      tempArry: [], //高亮多边形
      //drawingObject: {}, //flag
      drawingObject: {
        type: "roof",
        background: "",
        border: "",
      },
      fabricObj: null, //画布对象
      fabricimageObj: null, //图片对象（未使用）
      //mouseFrom: {},
      canvas: null,
      Point: {},
      markcolor: "rgba(0,128,128,0.5)", //标记颜色
      markinfo: null, //标记信息
      //isCanSelect: false,
      //buttonstate: "拖动图片",
      buttonstate: "正在标注(切换拖动图片)",
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
      //return require('http://10.19.1.181:18080/images/abc.png')
      //return require('@/'+'image/微信图片_20200927191717'+'.jpg')
      return this.fatherimagesrc;
    },
  },
  mounted() {
    this.$nextTick(() => {
      //延时加载放置报错
      setTimeout(() => {
        this.fabricObj = new fabric.Canvas("label-canvas");
        this.fabricEvent();
        this.createBackgroundImage();
        //this.inputimage();
        // this.drawingObject.type="roof"
        // console.log("this.drawingObject.type",this.drawingObject.type);
      }, 500),
        setTimeout(() => {
          //由于this.createBackgroundImage函数总是最后加载，在这里设置更后延迟来更新图片标注信息
          this.updatelastdata();
        }, 510);
    });
  },
  watch: {
    //监听图片变化
    imagesrc() {
      console.log("watch!!!!!!!!");
      this.createBackgroundImage();
      this.polygonArray.forEach((item) => {
        this.fabricObj.remove(item);
      });
      this.lines.forEach((item) => this.fabricObj.remove(item));
      this.polygonArray = [];
      this.polygoninfoArray = [];
      this.realpolygoninfoArray = [];
      this.roofPoints = [];
      this.realPoints = [];
      this.lines = [];
      this.lineCounter = 0;
      this.markinfo=null;
      //this.drawingObject.type == "roof"
      this.updatelastdata();
      this.huanyuan();
      //this.fabricEvent();
      //this.inputimage();
    },
  },
  methods: {
    fangda() {
      //放大图片
      let zoomPoint = new fabric.Point(
        this.canvaswidth / 2,
        this.canvaswidth / 2
      );
      if (this.zoom < 4.99) this.zoom += 0.1;
      this.fabricObj.zoomToPoint(zoomPoint, this.zoom);
      console.log(this.fabricObj.getZoom());
    },
    suoxiao() {
      //缩小图片
      let zoomPoint = new fabric.Point(
        this.canvaswidth / 2,
        this.canvaswidth / 2
      );
      if (this.zoom > 0.2) this.zoom -= 0.1;
      if (this.zoom > 0.1) this.fabricObj.zoomToPoint(zoomPoint, this.zoom);
      console.log(this.fabricObj.getZoom());
    },
    huanyuan() {
      //还原图片大小和位置
      let ppoint = new fabric.Point(0, 0);
      this.fabricObj.absolutePan(ppoint);
      this.zoom = 1;
      this.fabricObj.setZoom(1);
    },
    changeinfo(item) {
      //切换标注类型（包括颜色）
      this.markcolor = item.color;
      this.markinfo = item.name;
    },
    // deletelastpoint(){
    //   console.log("ggggg")
    //   //if(event.keykode===32) {console.log("223244356346")}
    //   if(this.roofPoints.length>0){
    //     this.roofPoints.pop();
    //     this.realPoints.pop();
    //     this.lines.pop();
    //   }
    // },
    // polygonPositionHandler(index,fabricObject) {
    //   console.log("22222",index)
    //   console.log("11111",fabricObject.points[this.pointIndex])
    // // let x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x),
    // //     y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);
    // // return fabric.util.transformPoint(
    // // 	{ x: x, y: y },
    // //   fabric.util.multiplyTransformMatrices(
    // //     fabricObject.canvas.viewportTransform,
    // //     fabricObject.calcTransformMatrix()
    // //   )
    // // );
    // },
    // actionHandler(eventData, transform, x, y) {
    // let polygon = transform.target,
    //     currentControl = polygon.controls[polygon.__corner],
    //     mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
    //     polygonBaseSize = polygon._getNonTransformedDimensions(),
    // 		size = polygon._getTransformedDimensions(0, 0),
    // 		finalPointPosition = {
    // 			x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
    // 			y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
    // 		};
    // polygon.points[currentControl.pointIndex] = finalPointPosition;
    // return true;
    // },
    // anchorWrapper(anchorIndex, fn) {
    // return function(eventData, transform, x, y) {
    //   let fabricObject = transform.target,
    //       absolutePoint = fabric.util.transformPoint({
    //           x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
    //           y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
    //       }, fabricObject.calcTransformMatrix()),
    //       actionPerformed = fn(eventData, transform, x, y),
    //       newDim = fabricObject._setPositionDimensions({}),
    //       polygonBaseSize = fabricObject._getNonTransformedDimensions(),
    //       newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
    // 	    newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
    //   fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
    //   return actionPerformed;
    // }
    // },
    // Edit() {
    // // clone what are you copying since you
    // // may want copy and paste on different moment.
    // // and you do not want the changes happened
    // // later to reflect on the copy.
    // console.log(this.fabricObj.getObjects()[0])
    // let poly = this.fabricObj.getObjects()[0];
    // this.fabricObj.setActiveObject(poly);
    // let aaa = true
    // let _this=this
    // poly.edit = !poly.edit;
    // // if (poly.edit) {
    // if (aaa) {
    //   let lastControl = poly.points.length - 1;
    //   poly.cornerStyle = 'circle';
    //   poly.cornerColor = 'rgba(0,0,255,0.5)';
    //   poly.controls = poly.points.reduce(function(acc, point, index) {
    // 		acc['p' + index] = new fabric.Control({
    // 			positionHandler: _this.polygonPositionHandler(index,_this.fabricObj),
    // 			actionHandler: _this.anchorWrapper(index > 0 ? index - 1 : lastControl, _this.actionHandler),
    // 			actionName: 'modifyPolygon',
    // 			pointIndex: index
    // 		});
    //     console.log("aaaccc"+index,acc)
    // 		return acc;
    // 	}, { });
    //   console.log("pppppppppp",poly.controls)
    // }

    // else {
    //   poly.cornerColor = 'blue';
    //   poly.cornerStyle = 'rect';
    // 	poly.controls = fabric.Object.prototype.controls;
    // }
    // poly.hasBorders = !poly.edit;
    // this.fabricObj.requestRenderAll();
    // },
    saveinfo() {
      //保存标注信息时传递的信息
      //console.log("start!!!", this.realpolygoninfoArray);
      //变为深拷贝
      this.tempArry.push(JSON.parse(JSON.stringify(this.realpolygoninfoArray)));
      //this.tempArry[0]=this.boxArry
      // this.tempArry.push(this.fatherimagesrc);
      // this.tempArry.push(this.imageindex);
      this.$emit("saveimageinfo", this.tempArry, this.imageindex);
      this.tempArry = [];
      console.log("22222", this.tempArry);
      //  this.$emit('saveimageinfo',this.boxArry,this.fatherimagesrc,this.imageindex)
      //  console.log(this.boxArry,this.fatherimagesrc,this.imageindex)
    },
    updatelastdata() {
      //查看上次标注保存的信息
      console.log("image select lastlabelArry", this.lastlabelArry);
      this.polygonArray.forEach((item) => {
        this.fabricObj.remove(item);
      });
      this.lines.forEach((item) => this.fabricObj.remove(item));
      this.polygonArray = [];
      this.polygoninfoArray = [];
      this.realpolygoninfoArray = [];
      this.roofPoints = [];
      this.realPoints = [];
      this.lines = [];
      this.lineCounter = 0;

      for (let i = 0; i < this.lastlabelArry.length; i++) {
        this.realpolygoninfoArray.push(this.lastlabelArry[i]);
        this.markinfo = this.lastlabelArry[i].info;
        console.log("lastlabelArry[i].point", this.lastlabelArry[i].point);
        for (let j = 0; j < this.lastlabelArry[i].point.length; j++) {
          console.log("point", this.lastlabelArry[i].point[j]);
          let a = {};
          let reala = {};
          a["x"] = this.lastlabelArry[i].point[j].x * this.scalewidth;
          a["y"] = this.lastlabelArry[i].point[j].y * this.scaleheight;
          // reala["x"] = this.lastlabelArry[i].point[j].x;
          // reala["y"] = this.lastlabelArry[i].point[j].y;
          this.roofPoints.push(a);
        }
        console.log("roofPoint", this.roofPoints);
        console.log("this.lastlabelArry[i].info", this.lastlabelArry[i].info);
        this.findcolor(this.lastlabelArry[i].info);
        //console.log("typeof color",typeof(color))
        this.makeRoof();
        console.log("this.roof", this.roof);
        this.fabricObj.add(this.roof);
        this.polygonArray.push(this.roof);
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
      this.fabricObj.renderAll();
      // console.log("realpolygoninfoArray", this.realpolygoninfoArray);
      console.log("fabricobjuuu", this.fabricObj);
      console.log("polygonArrayuuu", this.polygonArray);
      console.log("polygoninfoArrayuuu", this.polygoninfoArray);
      console.log("realpolygoninfoArrayuuu", this.realpolygoninfoArray);

      console.log("realPointsuuu", this.realPoints);
      console.log("linesuuu", this.lines);
      console.log("lineCounteruuu", this.lineCounter);
    },
    createBackgroundImage() {
      //加载图片为背景
      let _this = this;
      // console.log(this.fabricObj.width);
      // console.log(this.fabricObj.height);
      this.fabricimageObj = new fabric.Image.fromURL(
        this.imagesrc,
        function (img) {
          // console.log(_this.fabricObj)
          console.log(_this.fabricObj.width);
          console.log(_this.fabricObj.height);
          console.log(img.width);
          console.log(img.height);
          if (img.width < 600 && img.height < 600) {
            _this.fabricObj.setWidth(1.5 * img.width);
            _this.fabricObj.setHeight(1.5 * img.height);
          } else {
            _this.fabricObj.setWidth(img.width);
            _this.fabricObj.setHeight(img.height);
          }
          _this.scalewidth = _this.fabricObj.width / img.width;
          _this.scaleheight = _this.fabricObj.height / img.height;
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
        }
      );
    },
    infotip(index) {
      //鼠标放在删除上时高亮（通过在创建一个同样的多边形实现
      // //防止输入数字以外的字符的响应
      // var reg = /^[1-9]+[0-9]*]*$/;
      // console.log(reg.test(this.input));
      // if (
      //   this.input > this.polygonArray.length ||
      //   this.input <= 0 ||
      //   !reg.test(this.input)
      // ) {
      //   return;
      // }
      if (!this.buttonmouseoveflag) {
        console.log(this.polygoninfoArray[index]);
        console.log(this.realpolygoninfoArray[index]);
        this.temproof = this.polygonArray[index];
        this.fabricObj.add(this.temproof);
        this.buttonmouseoveflag = true;
      }
    },
    removetip() {
      //鼠标脱离删除按钮时取消高亮
      // if (this.input > this.polygonArray.length || this.input <= 0) {
      //   return;
      // }
      if (this.buttonmouseoveflag) {
        console.log("removetemproof!");
        if (this.temproof != null) {
          this.fabricObj.remove(this.temproof);
          this.temproof = null;
        }
        this.buttonmouseoveflag = false;
      }
    },
    deletemarked(index) {
      //删除对应多边形
      // if (this.input > this.polygonArray.length || this.input <= 0) {
      //   return;
      // }
      // console.log("input", this.input);
      if (this.temproof != null) {
        this.fabricObj.remove(this.temproof);
        this.temproof = null;
      }
      this.fabricObj.remove(this.polygonArray[index]);
      this.polygonArray.splice(index, 1);
      this.polygoninfoArray.splice(index, 1);
      this.realpolygoninfoArray.splice(index, 1);
      // this.fabricObj.remove(this.polygonArray[this.input - 1]);
      // this.polygonArray.splice(this.input - 1, 1);
      // this.polygoninfoArray.splice(this.input - 1, 1);
      // this.realpolygoninfoArray.splice(this.input - 1, 1);
    },
    start() {
      console.log("this.drawingObject.type111",this.drawingObject.type);
      //切换画板上是否能标注的按钮
      if (this.drawingObject.type == "roof") {
        console.log("aaaa");
        this.drawingObject.type = "";
        // this.lines.forEach(function(value, index, ar) {
        //   this.fabricObj.remove(value);
        // });
        //移除画的连续直线
        this.lines.forEach((item) => this.fabricObj.remove(item));
        //手动画的多边形存储的点数大于2时再生成图片
        if (this.roofPoints.length > 2) {
          this.makeRoof();
          this.fabricObj.add(this.roof);
          this.polygonArray.push(this.roof);
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
        //清空直线和点数组和他们的计数
        this.roofPoints = [];
        this.realPoints = [];
        this.lines = [];
        this.lineCounter = 0;
        this.buttonstate = "正在拖动图片(切换标注)";
        //this.fabricimageObj.selectable=true
        this.istrue = true;
        //this.fabricObj.sendToBack(this.fabricimageObj);
        //this.polygonArray.forEach(item => item.selectable=true)
        // this.fabricObj.selectable=true;
        // this.isCanSelect=true;
      } else {
        console.log("bbbb");
        this.drawingObject.type = "roof"; // roof type
        this.buttonstate = "正在标注(切换拖动图片)";
        //this.fabricimageObj.selectable=false
        this.istrue = false;
        //this.fabricObj.sendToBack(this.fabricimageObj);
        //this.polygonArray.forEach(item => item.selectable=false)
        // this.isCanSelect=false;
        // this.fabricObj.selectable=false;
      }
      console.log(this.polygonArray);
      console.log(this.polygoninfoArray);
    },

    // &&e.pointer.x!=this.roofPoints[this.roofPoints.length-1].x
    // &&e.pointer.y!=this.roofPoints[this.roofPoints.length-1].y
    fabricEvent() {
      this.fabricObj.on({
        // "object:selected":e =>{
        //   console.log("selected")
        // },
        "mouse:wheel": (e) => {
          //删除上一个点
          //console.log(e)
          if (this.roofPoints.length > 0) {
            let x = e.absolutePointer.x;
            let y = e.absolutePointer.y;
            if (this.lineCounter >= 2) {
              this.lines[this.lineCounter - 2].set({
                x2: x,
                y2: y,
              });
            }
            this.fabricObj.remove(this.lines[this.lineCounter - 1]);
            //this.fabricObj.renderAll();
            //this.fabricObj.remove(this.lines[this.lineCounter+1]);
            this.roofPoints.pop();
            this.realPoints.pop();
            this.lines.pop();
            this.lineCounter--;
            this.fabricObj.renderAll();
          }
        },
        "mouse:down": (e) => {
          if(this.markinfo ==null) {
            this.$message({
            message: '您没有选中任何标签',
            type: 'warning'
          });
            return;
          }
          //点击生成多边形的边框并且将点加入数组
          //console.log(e)
          console.log(e.e);
          console.log(this.fabricObj);
          if (this.istrue === true) {
            console.log("1111");
            this.panning = true;
            this.fabricObj.selection = true;
          }
          if (this.istrue === false && this.drawingObject.type == "roof") {
            console.log("2222");
            //防止过长时间重复点一个点时点入栈
            if (
              this.roofPoints.length < 1 ||
              (this.roofPoints.length >= 1 &&
                (e.absolutePointer.x !=
                  this.roofPoints[this.roofPoints.length - 1].x ||
                  e.absolutePointer.y !=
                    this.roofPoints[this.roofPoints.length - 1].y))
            ) {
              this.fabricObj.selection = false;
              // this.mouseFrom.x = e.pointer.x;
              // this.mouseFrom.y = e.pointer.y
              let a = {};
              let reala = {};
              // a["x"] = this.mouseFrom.x;
              // a["y"] = this.mouseFrom.y;
              // a["x"] = e.absolutePointer.x-e.pointer.x;
              // a["y"] = e.absolutePointer.y-e.pointer.y;
              a["x"] = e.absolutePointer.x;
              a["y"] = e.absolutePointer.y;
              reala["x"] = e.absolutePointer.x / this.scalewidth;
              reala["y"] = e.absolutePointer.y / this.scaleheight;
              this.roofPoints.push(a);
              this.realPoints.push(reala);
              var points = [a.x, a.y, a.x, a.y];
              this.lines.push(
                new fabric.Line(points, {
                  strokeWidth: 3,
                  selectable: false,
                  stroke: this.markcolor,
                })
              );
              this.fabricObj.add(this.lines[this.lineCounter]);
              this.lineCounter++;
              console.log(this.roofPoints.length);
            } else {
              console.log("click repeat!!!");
              // console.log(e.pointer.x)
              // console.log(e.pointer.y)
              // console.log(this.roofPoints[this.roofPoints.length - 1].x)
              // console.log(this.roofPoints[this.roofPoints.length - 1].y)
            }
          }
        },
        "mouse:move": (e) => {
          //鼠标移动时的直线绘制
          if (this.istrue === true) {
            if (this.panning && e && e.e) {
              var delta = new fabric.Point(e.e.movementX, e.e.movementY);
              this.fabricObj.relativePan(delta);
            }
          }
          if (
            this.istrue === false &&
            this.lines[0] !== null &&
            this.lines[0] !== undefined &&
            this.drawingObject.type == "roof"
          ) {
            // this.x = e.pointer.x;
            // this.y = e.pointer.y;
            this.x = e.absolutePointer.x;
            this.y = e.absolutePointer.y;
            //console.log(this.lineCounter)
            this.lines[this.lineCounter - 1].set({
              x2: this.x,
              y2: this.y,
            });
            this.fabricObj.renderAll();
          }
        },
        "mouse:dblclick": (e) => {
          //双击结束绘制按点生成多边形
          if (this.drawingObject.type == "roof") {
            // if (Math.abs(this.roofPoints[this.roofPoints.length-1].x-this.roofPoints[0].x)<10||
            // Math.abs(this.roofPoints[this.roofPoints.length-1].y-this.roofPoints[0].y)<10) {
            //             console.log("double click clean");
            // //clear arrays
            // this.roofPoints = [];
            // this.lines = [];
            // this.lineCounter = 0;
            // }
            console.log(this.roofPoints.length);
            this.lines.forEach((item) => this.fabricObj.remove(item));
            if (this.roofPoints.length > 2) {
              //阻止生成2个点以下的对象，包括空白对象，点对象，线对象
              // canvas.remove(lines[lineCounter - 1]);
              this.makeRoof();
              console.log(this.roof);
              this.fabricObj.add(this.roof);
              this.polygonArray.push(this.roof);
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
            this.lines = [];
            this.lineCounter = 0;
          }
        },
        "mouse:up": (e) => {
          console.log("upupup");
          this.panning = false;
          this.fabricObj.selection = true;
        },
        // "mouse:wheel": (event) => {
        // console.log(event)
        // // let zoom = (event.deltaY > 0 ? -0.1 : 0.1) + this.fabricObj.getZoom();
        // // zoom = Math.max(0.1, zoom); //最小为原来的1/10
        // // zoom = Math.min(3, zoom); //最大是原来的3倍
        // // let zoomPoint = new fabric.Point(event.pageX, event.pageY);
        // // this.fabricObj.zoomToPoint(zoomPoint, zoom);
        // },
      });
    },
    makeRoof() {
      //生成多边形
      //定义多边形生成时的生成位置
      //console.log(color)
      let left = this.findLeftPaddingForRoof(this.roofPoints);
      let top = this.findTopPaddingForRoof(this.roofPoints);
      let a = {};
      a["x"] = this.roofPoints[0].x;
      a["y"] = this.roofPoints[0].y;
      this.roofPoints.push(a);
      console.log("!!!roofPoint", this.roofPoints);
      console.log("!!!fabricObj", this.fabricObj);
      //生成多边形
      this.roof = new fabric.Polygon(this.roofPoints, {
        //fill: "rgba(255,255,0,0)",
        fill: this.markcolor,
        //fill: color,
        strokeWidth: 2,
        selectable: false,
        hasControls: false,
        //hasBordes:false,
        //stroke: "red",
        left: left,
        top: top,
      });
      console.log("create!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", this.roof);
      // this.roof.on({
      //   selected: (e) => {
      //     console.log(e);
      //     console.log("selected");
      //   },
      // });
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
    // toggerBackHandle(src) {
    //     let Shape;
    //     // (解决跨域图片加载)
    //     const image = new Image()
    //     image.setAttribute('crossOrigin', 'anonymous')
    //     image.src = src;
    //     image.onload = function(){
    //         Shape = new fabric.Image(image, {
    //             // 通过scale来设置图片大小，这里设置和画布一样大
    //             scaleX: imageEffectCanvas.width / image.width,
    //             scaleY: imageEffectCanvas.height / image.height,
    //         });
    //         imageEffectCanvas.setBackgroundImage(Shape, imageEffectCanvas.renderAll.bind(imageEffectCanvas));// setBackgroundImage 方法设置画布背景
    //        imageEffectCanvas.renderAll(); //重新渲染画布
    //     }
    // },
    // inputimage() {
    //   let _this = this;
    //   new fabric.Image.fromURL(this.imagesrc, function (img) {
    //     // console.log(_this.fabricObj)

    //     console.log(_this.fabricObj.width);
    //     console.log(_this.fabricObj.height);
    //     console.log(img.width);
    //     console.log(img.height);
    //     _this.scalewidth = _this.fabricObj.width / img.width;
    //     _this.scaleheight = _this.fabricObj.height / img.height;
    //     console.log(_this.scalewidth);
    //     console.log(_this.scaleheight);
    //     // _this.imagewidth=_this.fabricObj.width=img.width
    //     // _this.imageheight=_this.fabricObj.height=img.height
    //     img.set({
    //       scaleX: _this.scalewidth,
    //       scaleY: _this.scaleheight,
    //       selectable: true,
    //       hasControls: false,
    //       left: 0,
    //       top: 0,
    //     });
    //     _this.fabricimageObj = img;
    //     console.log(_this.fabricimageObj, img);
    //     _this.fabricObj.add(img);
    //   });

    //   //_this.fabricObj.sendToBack(_this.fabricimageObj);
    // },
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
}
.polygon {
  display: inline-block;
}
.infopolygon {
  display: inline-block;
  vertical-align: top;
}
</style>
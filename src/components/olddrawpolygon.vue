<template>
  <div class="polygon-body" style="width: 100%">
    <div>
      <div
        :style="{
          //background: 'rgb(192, 192, 192)',
          //width:this.imagewidth+'px',
          //marginLeft: (this.fabricObj.width-458) / 2 + 'px',
          marginLeft: (this.canvaswidth - 458) / 2 + 'px',
          display: 'block',
        }"
      >
        <el-radio-group v-model="radio" style="display: inline-block">
          <el-radio-button label="pointmark">点标注</el-radio-button>
          <el-radio-button label="linemark">线标注</el-radio-button>
          <el-radio-button label="polygonmark">多边形标注</el-radio-button>
          <el-radio-button label="drag">拖动</el-radio-button>
          <el-radio-button label="modify">修改</el-radio-button>
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
        </el-button-group>
      </div>

      <!-- <el-button
        type="primary"
        icon="el-icon-edit"
        circle
        id="poly"
        title="Draw Polygon"
        :disabled="isimagechange"
        @click="start"
        >{{ buttonstate }}</el-button
      >
      <label style="color: blue"><b></b></label>
      <el-button @click="Edit">{{imagechangebtntext}}</el-button>
      <el-button @click="fangda">放大</el-button>
      <el-button @click="suoxiao">缩小</el-button>
      <el-button @click="huanyuan">还原图片大小</el-button>
      <el-button @click="saveinfo" :disabled="isimagechange">保存 </el-button>
      <el-button @click="updatelastdata" :disabled="isimagechange">查看上次标注数据</el-button> -->
    </div>
    <!-- <el-button @click="Edit">test</el-button>-->
    <div
      :style="{
        display: 'flex',
      }"
    >
      <div
        id="leftdiv"
        :style="{
          maxWidth: 1000 + 'px',
          maxHeight: 1000 + 'px',
          //display:flex
        }"
      >
        <div
          class="polygon"
          ref="outdiv"
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
          <canvas
            id="label-canvas"
            class="canvas"
          ></canvas>
        </div>
      </div>
      <div class="el-divider el-divider--vertical"></div>
      <div id="rightdiv">
        <div class="infopolygon" style="margin-left: 20px">
          <div
            v-for="(items, index) in premarktype"
            :key="index"
            style="float: left; margin-right: 20px"
          >
            <el-button
              @click="changeinfo(items, index)"
              :style="{
                width: 120 + 'px',
                marginBottom: 10 + 'px',
                background:
                  buttonindex == index ? items.color : 'rgba(0,0,0,0)',
              }"
              >{{ items.name }}</el-button
            >
          </div>
        </div>
        <el-divider></el-divider>
        <div class="infopolygon" style="margin-left: 20px">
          <!-- <div style="margin-left:50px;float:left;border:1px solid #666;width:25%"> -->
          <div
            v-for="(items, index) in polygonArray"
            :key="index"
            style="float: left; margin-right: 20px"
          >
            <el-button
              :style="{
                width: 120 + 'px',
                marginBottom: 10 + 'px',
              }"
              type="danger"
              @mouseover.native="infotip(index)"
              @mouseout.native="removetip(index)"
              @mousedown.native="deletemarked(index)"
              >删除{{ index + 1 }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { fabric } from "fabric";
//下面三个js函数都是自定义点移动（官方文档）
function polygonPositionHandler(dim, finalMatrix, fabricObject) {
  //console.log("ttttttttttttttttest",fabricObject)
  //console.log("ttttttttttttttttest",this.controlsObjectArryCount)
  // for(let key in fabricObject.controls){
  //     console.log("key",fabricObject.controls[key].pointIndex)
  //     var x = (fabricObject.points[fabricObject.controls[key].pointIndex].x - fabricObject.pathOffset.x),
  //     y = (fabricObject.points[fabricObject.controls[key].pointIndex].y - fabricObject.pathOffset.y);
  // }
  var x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
    y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
  return fabric.util.transformPoint(
    { x: x, y: y },
    fabric.util.multiplyTransformMatrices(
      fabricObject.canvas.viewportTransform,
      fabricObject.calcTransformMatrix()
    )
  );
}
function anchorWrapper(anchorIndex, fn, objjjjjjj) {
  console.log("interanchorWrapper", objjjjjjj);
  return function (eventData, transform, x, y) {
    var fabricObject = transform.target,
      absolutePoint = fabric.util.transformPoint(
        {
          x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
          y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
        },
        fabricObject.calcTransformMatrix()
      ),
      actionPerformed = fn(eventData, transform, x, y, objjjjjjj),
      newDim = fabricObject._setPositionDimensions({}),
      polygonBaseSize = fabricObject._getNonTransformedDimensions(),
      newX =
        (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
        polygonBaseSize.x,
      newY =
        (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
        polygonBaseSize.y;
    fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);

    return actionPerformed;
  };
}
function actionHandler(eventData, transform, x, y, objjjjjjj) {
  //console.log("interactionHandler",objjjjjjj)
  var polygon = transform.target,
    currentControl = polygon.controls[polygon.__corner],
    mouseLocalPosition = polygon.toLocalPoint(
      new fabric.Point(x, y),
      "center",
      "center"
    ),
    polygonBaseSize = polygon._getNonTransformedDimensions(),
    size = polygon._getTransformedDimensions(0, 0),
    finalPointPosition = {
      x:
        (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
        polygon.pathOffset.x,
      y:
        (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
        polygon.pathOffset.y,
    };
  console.log("currentControl", currentControl);
  console.log("mouseLocalPosition", mouseLocalPosition);
  polygon.points[currentControl.pointIndex] = finalPointPosition;
  return true;
}

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
      radio: "polygonmark",
      buttonindex: -1,
      input: null,
      temproof: null,
      roof: null,
      //istrue: false,
      panning: false,
      zoom: 1,

      //controlsObjectArryCount:0,
      imagechangebtntext: "修改图形",
      isimagechange: false,
      imagewidth:null,
      imageheight:null,
      scalewidth: null, //图片宽度缩放倍数
      scaleheight: null, //图片高度缩放倍数
      linePoints: [], //线数组
      realLinePoints:[], //真实线数组
      circlePoints:[],  //点数组
      realCirclePoints:[],  //真实点数组
      roofPoints: [], //多边形点数组
      realPoints: [], //真实多边形点数组
      temlines: [], //标记时候的线数组
      temlineCounter: 0, //标记时候的线计数
      temcircles: [], //标记时候的点数组
      temcircleCounter: 0,//标记时候的点计数
      polygonArray: [], //多边形对象数组
      polygoninfoArray: [], //多边形对象信息数组
      realpolygoninfoArray: [], //真实多边形对象信息数组
      tempArry: [], //高亮多边形
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
  mounted() {
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
        }, 510);
    });
  },
  watch: {
    //监听图片变化
    imagesrc() {
      console.log("watch!!!!!!!!");
      this.buttonindex = -1;
      this.createBackgroundImage();
      setTimeout(() => {
        this.polygonArray.forEach((item) => {
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
      }, 10);
      //this.fabricEvent();
      //this.inputimage();
    },
    radio() {
      this.start();
    },
  },
  methods: {
    // handelClick(i) {
    // //存储点击对象的index
    // this.buttonindex = i;
    // console.log("hahaha" + this.buttonindex);
    // },
    Edit() {
      if (!this.isimagechange) {
        this.isimagechange = true;
        this.clearobj();
        this.imagechangebtntext = "正在修改图形";
        let _this = this;
        for (let i = 0; i < this.polygonArray.length; i++) {
          var poly = this.fabricObj.getObjects()[i];
          console.log(poly);
          //this.fabricObj.setActiveObject(poly);
          poly.edit = true;
          poly.selectable = true;
          // poly.lockMovementX=true;
          // poly.lockMovementY=true;
          console.log("poly.edit", poly.edit);
          console.log("poly.selectable", poly.selectable);
          //if (poly.edit) {
          var lastControl = poly.points.length - 1;
          poly.cornerStyle = "circle";
          poly.cornerColor = "rgba(0,0,255,0.5)";
          console.log(lastControl);
          poly.controls = poly.points.reduce(function (acc, point, index) {
            //console.log("index",index)
            //_this.controlsObjectArryCount = index;
            acc[index] = new fabric.Control({
              // positionHandler: _this.polygonPositionHandler,
              positionHandler: polygonPositionHandler,
              actionHandler: anchorWrapper(
                index > 0 ? index - 1 : lastControl,
                actionHandler,
                _this.fabricObj
              ),
              actionName: "modifyPolygon",
              pointIndex: index,
            });
            //_this.fabricObj.renderAll();
            return acc;
          }, {});
        }
        // else {
        // poly.cornerColor = 'blue';
        // poly.cornerStyle = 'rect';
        // 	poly.controls = fabric.Object.prototype.controls;
        // }
        //poly.hasBorders = !poly.edit;
      } else {
        this.isimagechange = false;

        this.imagechangebtntext = "修改图形";
        console.log("realpolygoninfoArray", this.realpolygoninfoArray);
        this.realpolygoninfoArray = [];
        for (let i = 0; i < this.polygonArray.length; i++) {
          console.log("polygoninfoArray", this.polygoninfoArray[i]);
          console.log("realpolygoninfoArray", this.realpolygoninfoArray[i]);
          console.log("polygonArray", this.polygonArray[i].points);
          console.log(
            "this.fabricObj.getObjects()[i]",
            this.fabricObj.getObjects()[i]
          );
          var poly = this.fabricObj.getObjects()[i];
          //poly.isselect = false;
          this.fabricObj.discardActiveObject(poly);
          poly.edit = false;
          poly.selectable = false;
          this.realPoints = [];
          for (let j = 0; j < this.polygoninfoArray[i].point.length; j++) {
            console.log("point!!!!!!!!!", this.polygoninfoArray[i].point[j]);
            let reala = {};
            reala["x"] = this.polygonArray[i].points[j].x / this.scalewidth;
            reala["y"] = this.polygonArray[i].points[j].y / this.scaleheight;
            this.realPoints.push(reala);
          }
          this.realpolygoninfoArray.push({
            point: this.realPoints,
            info: this.polygoninfoArray[i].info,
          });
          //this.fabricObj.renderAll();
        }
        console.log("uppppppppppppdateeeeeeeeeeeee", this.realpolygoninfoArray);
      }
      this.fabricObj.renderAll();
      this.emitfather();
    },
    clearobj(){//移除画的连续直线和点
        this.temlines.forEach((item) => this.fabricObj.remove(item));
        this.temcircles.forEach((item) => this.fabricObj.remove(item));
        this.roofPoints = [];
        this.realPoints = [];
        this.temlines = [];
        this.temcircles = [];
        this.temlineCounter = 0;
        this.temcircleCounter = 0;
    },
    clearinfo(){
      this.polygonArray = [];
      this.polygoninfoArray = [];
      this.realpolygoninfoArray = [];
    },
    emitfather() {
      console.log("sonemit");
      this.$emit("closebutton");
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    changeinfo(item, i) {
      //切换标注类型（包括颜色）
      console.log("changeinfo", i);
      this.buttonindex = i;
      this.markcolor = item.color;
      this.markinfo = item.name;
    },
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
      this.clearinfo();
      this.clearobj();
      console.log("img11111111111111111", this.scalewidth, this.scaleheight);
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
      console.log("linesuuu", this.temlines);
      console.log("lineCounteruuu", this.temlineCounter);
    },
    createBackgroundImage() {
      //加载图片为背景
      let _this = this;
      console.log(this.imagesrc);
      if (this.imagesrc === null || this.imagesrc === undefined) return;
      // console.log(this.fabricObj.width);
      // console.log(this.fabricObj.height);
      this.fabricimageObj = new fabric.Image.fromURL(
        this.imagesrc,
        function (img) {
          _this.imagewidth = img.width;
          _this.imageheight = img.height;
          _this.scalewidth = 1;
          _this.scaleheight = 1;
          // console.log(_this.fabricObj)
          if (img.width < 600 && img.height < 600) {
            while (_this.imagewidth < 600 && _this.imageheight < 600) {
              _this.imagewidth *= 1.5;
              _this.imageheight *= 1.5;
              _this.scalewidth *= 1.5;
              _this.scaleheight *= 1.5;
            }
          }
          if (img.width > 1000 || img.height > 1000) {
            while (_this.imagewidth > 1000 || _this.imageheight > 1000) {
              _this.imagewidth /= 1.5;
              _this.imageheight /= 1.5;
              _this.scalewidth /= 1.5;
              _this.scaleheight /= 1.5;
            }
          }
          
          // _this.fabricObj.setWidth(imagewidth);
          // _this.fabricObj.setHeight(imageheight);
          _this.fabricObj.setWidth(1000);
          _this.fabricObj.setHeight(750);
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
        }
      );
    },
    infotip(index) {
      if (!this.buttonmouseoveflag) {
        var poly = this.fabricObj.getObjects()[index];
        console.log(this.polygoninfoArray[index]);
        console.log(this.realpolygoninfoArray[index]);
        poly.fill = "rgba(0,0,0,1)";
        this.buttonmouseoveflag = true;
        this.fabricObj.renderAll();
      }
    },
    removetip(index) {
      if (this.buttonmouseoveflag) {
        let tempcolor = this.markcolor;
        console.log("removetemproof!");
        console.log(
          "this.polygoninfoArray[index]!",
          this.polygoninfoArray[index]
        );
        var poly = this.fabricObj.getObjects()[index];
        this.findcolor(this.polygoninfoArray[index].info);
        poly.fill = this.markcolor;
        this.markcolor = tempcolor;
        this.buttonmouseoveflag = false;
        this.fabricObj.renderAll();
      }
    },
    deletemarked(index) {
      //删除对应多边形
      this.fabricObj.remove(this.polygonArray[index]);
      this.polygonArray.splice(index, 1);
      this.polygoninfoArray.splice(index, 1);
      this.realpolygoninfoArray.splice(index, 1);
    },
    start() {
      //切换画板上是否能标注的按钮
      if (this.radio == "drag") {
        console.log("aaaa");
        //this.drawingObject.type = "";
        // this.lines.forEach(function(value, index, ar) {
        //   this.fabricObj.remove(value);
        // });
        
        this.clearobj()
        //手动画的多边形存储的点数大于2时再生成图片
        // if (this.roofPoints.length > 2) {
        //   this.makeRoof();
        //   this.fabricObj.add(this.roof);
        //   this.polygonArray.push(this.roof);
        //   this.polygoninfoArray.push({
        //     point: this.roofPoints,
        //     info: this.markinfo,
        //   });
        //   this.realpolygoninfoArray.push({
        //     point: this.realPoints,
        //     info: this.markinfo,
        //   });
        // }
        this.fabricObj.renderAll();
        if (this.isimagechange) this.Edit();
      } else if (this.radio == "polygonmark") {
        console.log("bbbb");
        if (this.isimagechange) this.Edit();
      } else {
        console.log("cccc");
        this.Edit();
      }
      console.log(this.polygonArray);
      console.log(this.polygoninfoArray);
    },

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
            if (this.temlineCounter >= 2) {
              this.temlines[this.temlineCounter - 2].set({
                x2: x,
                y2: y,
              });
            }
            this.fabricObj.remove(this.temlines[this.temlineCounter - 1]);
            this.fabricObj.remove(this.temcircles[this.temcircleCounter-1]);
            this.roofPoints.pop();
            this.realPoints.pop();
            this.temlines.pop();
            this.temcircles.pop();
            this.temlineCounter--;
            this.temcircleCounter--;
            this.fabricObj.renderAll();
          }
        },
        "mouse:down": (e) => {
          if (this.isimagechange) return;
          if (this.markinfo == null && this.radio == "polygonmark") {
            this.$message({
              message: "您没有选中任何标签",
              type: "warning",
            });
            return;
          }
          if(e.absolutePointer.x>this.imagewidth||e.absolutePointer.y>this.imageheight
          ||e.absolutePointer.x<0||e.absolutePointer.y<0){
            console.log("超出图片范围");
            return;
          }
          //点击生成多边形的边框并且将点加入数组
          //console.log(e)
          console.log(e.e);
          console.log(this.fabricObj);
          if (this.radio == "drag") {
            console.log("1111");
            this.panning = true;
            //this.fabricObj.selection = true;
          }
          if (this.radio == "polygonmark") {
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
              //this.fabricObj.selection = false;
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
              // reala["x"] = e.absolutePointer.x ;
              // reala["y"] = e.absolutePointer.y ;
              this.roofPoints.push(a);
              this.realPoints.push(reala);
              var points = [a.x, a.y, a.x, a.y];
              this.temlines.push(
                new fabric.Line(points, {
                  strokeWidth: 3,
                  selectable: false,
                  stroke: this.markcolor,
                })
              );
              this.temcircles.push(
                new fabric.Circle({
                  radius: 5,
                  fill: this.markcolor,
                  selectable: false,
                  top:a.y-5,
                  left:a.x-5,
                })
              )
              //console.log("newcircle",newcircle)
              this.fabricObj.add(this.temcircles[this.temcircleCounter])
              this.fabricObj.add(this.temlines[this.temlineCounter]);
              this.temcircleCounter++;
              this.temlineCounter++;
              
              console.log(this.roofPoints.length);
            } else {
              console.log("click repeat!!!");
            }
          }
        },
        "mouse:move": (e) => {
          if (this.isimagechange) return;
          //return;
          //鼠标移动时的直线绘制
          if (this.radio == "drag") {
            if (this.panning && e && e.e) {
              var delta = new fabric.Point(e.e.movementX, e.e.movementY);
              this.fabricObj.relativePan(delta);
            }
          }
          if (
            this.temlines[0] !== null &&
            this.temlines[0] !== undefined &&
            this.radio == "polygonmark"
          ) {
            // this.x = e.pointer.x;
            // this.y = e.pointer.y;
            this.x = e.absolutePointer.x;
            this.y = e.absolutePointer.y;
            //console.log(this.lineCounter)
            this.temlines[this.temlineCounter - 1].set({
              x2: this.x,
              y2: this.y,
            });
            this.fabricObj.renderAll();
          }
        },
        "mouse:dblclick": (e) => {
          //双击结束绘制按点生成多边形
          if (this.radio == "polygonmark") {
            // if (Math.abs(this.roofPoints[this.roofPoints.length-1].x-this.roofPoints[0].x)<10||
            // Math.abs(this.roofPoints[this.roofPoints.length-1].y-this.roofPoints[0].y)<10) {
            //             console.log("double click clean");
            // //clear arrays
            // this.roofPoints = [];
            // this.lines = [];
            // this.lineCounter = 0;
            // }
            console.log(this.roofPoints.length);
            this.temlines.forEach((item) => this.fabricObj.remove(item));
            this.temcircles.forEach((item) => this.fabricObj.remove(item));
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
            this.temlines = [];
            this.temcircles = [];
            this.temlineCounter = 0;
            this.temcircleCounter = 0;
          }
        },
        "mouse:up": (e) => {
          console.log("upupup");
          if (this.radio == "drag") {
            this.panning = false;
            //this.fabricObj.selection = false;
          }
          //else this.fabricObj.selection = false;
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
        lockMovementX: true,
        lockMovementY: true,
        objectCaching: false,
        transparentCorners: false,
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
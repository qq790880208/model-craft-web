<template>
  <div class="polygon-body" style="width: 100%">
    <div>
      <div
        :style="{
          //background: 'rgb(192, 192, 192)',
          //width:this.imagewidth+'px',
          //marginLeft: (this.fabricObj.width-458) / 2 + 'px',
          marginLeft: (this.divWidth-300) / 2 + 'px',
          display: 'block',
        }"
      >
        <el-radio-group v-model="radio" style="display: inline-block">
          <el-radio-button label="drag">拖动</el-radio-button>
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
    </div>
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
              :style="{
                width: 120 + 'px',
                marginBottom: 10 + 'px',
                background:items.color ,
              }"
              >{{ items.name }}</el-button
            >
          </div>
        </div>
        <el-divider></el-divider>
        <div class="infopolygon" style="margin-left: 20px">
          <!-- <div style="margin-left:50px;float:left;border:1px solid #666;width:25%"> -->
          <div
            v-for="(items, index) in allobjArray"
            :key="index"
            style="float: left; margin-right: 20px"
          >
            <el-button
              :style="{
                width: 120 + 'px',
                marginBottom: 10 + 'px',
              }"
              type="success"
              @mouseover.native="infotip(index)"
              @mouseout.native="removetip(index)"
              >{{ index + 1 }}、{{items.type=="polygon"?"多边形":items.type=="line"?"线":"点"}}
            </el-button>
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
      divWidth:1000,
      divHeight:750,
      mountedFlag:true,
      radio: "polygonmark",
      buttonindex: -1,
      input: null,
      temproof: null,
      roof: null,
      line:null,
      cicle:null,
      panning: false,
      zoom: 1,
      allobjArray:[],
      temtwopoint:[],
      testcirclearray:[],
      generateline:[],
      temlineobj:null,
      imagechangebtntext: "修改图形",
      isimagechange: false,
      imagewidth:null,
      imageheight:null,
      scalewidth: null, //图片宽度缩放倍数
      scaleheight: null, //图片高度缩放倍数
      distanceDelta:0,//图片位移距离（让图片处于中心）
      linePoints: [], //线点数组
      realLinePoints:[], //真实线点数组
      circlePoints:[],  //点数组
      realCirclePoints:[],  //真实点数组
      roofPoints: [], //多边形点数组
      realPoints: [], //真实多边形点数组
      temlines: [], //多边形标记时候的线数组
      temlineCounter: 0, //多边形标记时候的线计数
      temcircles: [], //多边形标记时候的点数组
      temcircleCounter: 0,//多边形标记时候的点计数
      llines:[], //线标记时候的线数组
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
      fabricObj: null, //画布对象
      fabricimageObj: null, //图片对象（未使用）
      canvas: null,
      Point: {},
      markcolor: "rgba(0,128,128,0.5)", //标记颜色
      markinfo: null, //标记信息
      buttonmouseoveflag: false, //高亮显示按钮的移入移出判断flag
    };
  },
  computed: {
    imagesrc: function () {
      return this.fatherimagesrc;
    },
  },
  destroyed(){
    window.removeEventListener('resize', this.GetWindowInfo)
  },
  mounted() {
    window.addEventListener('resize', this.GetWindowInfo); //注册监听器
    this.GetWindowInfo() //页面创建时先调用一次
    this.mountedFlag=false;
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
          this.huanyuan()
        }, 520);
    });
  },
  watch: {
    //监听图片变化
    imagesrc() {
      console.log("watch!!!!!!!!");
      this.havefabricobj=false
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
        this.clearinfo();
        this.clearobj();
        this.markinfo = null;
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
        if(!this.mountedFlag){
          this.fabricObj.setWidth(this.divWidth);
          this.fabricObj.setHeight(this.divHeight);
        }
    },
    clearobj(){//移除画的连续直线和点
        this.temlines.forEach((item) => this.fabricObj.remove(item));
        this.temcircles.forEach((item) => this.fabricObj.remove(item));
        this.llines.forEach((item) => this.fabricObj.remove(item));
        this.roofPoints = [];
        this.realPoints = [];
        this.linePoints = [];
        this.realLinePoints = [];
        this.temlines = [];
        this.temcircles = [];
        this.llines = [];
        this.temlineCounter = 0;
        this.temcircleCounter = 0;
        console.log("count",this.testcirclearray.length,"objarr",this.testcirclearray)
        if(this.testcirclearray.length%2==1&&this.testcirclearray.length>0) { //移除未完成线段的单个端点
          console.log("delete one")
          this.testcirclearray.pop();
        }
    },
    clearinfo(){
      this.allobjArray=[];
      this.polygonArray = [];
      this.polygoninfoArray = [];
      this.realpolygoninfoArray = [];
      this.lineArray = [];
      this.lineinfoArray = [];
      this.reallineinfoArray = [];
      this.circleArray = [];
      this.circleinfoArray = [];
      this.realcircleinfoArray = [];
      this.testcirclearray=[];
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    fangda() {
      //放大图片
      let zoomPoint = new fabric.Point(this.divWidth/2,this.divHeight/2);
      if (this.zoom < 4.99) this.zoom += 0.1;
      this.fabricObj.zoomToPoint(zoomPoint, this.zoom);
      console.log(this.fabricObj.getZoom());
    },
    suoxiao() {
      //缩小图片
      let zoomPoint = new fabric.Point(this.divWidth/2,this.divHeight/2);
      if (this.zoom > 0.2) this.zoom -= 0.1;
      if (this.zoom > 0.1) this.fabricObj.zoomToPoint(zoomPoint, this.zoom);
      console.log(this.fabricObj.getZoom());
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
      if(this.lastlabelArry==undefined) return
      // this.clearinfo();
      // this.clearobj();
      console.log("img11111111111111111", this.scalewidth, this.scaleheight);
      if(this.lastlabelArry.line!=null&&this.lastlabelArry.line!=undefined){
      //线
      for (let i = 0; i < this.lastlabelArry.line.length; i++) {
        for (let j = 0; j < this.lastlabelArry.line[i].point.length; j++) {
          console.log("point", this.lastlabelArry.line[i].point[j]);
          let a = {};
          let reala = {};
          a["x"] = this.lastlabelArry.line[i].point[j].x * this.scalewidth;
          a["y"] = this.lastlabelArry.line[i].point[j].y * this.scaleheight;
          reala["x"] = this.lastlabelArry.line[i].point[j].x
          reala["y"] = this.lastlabelArry.line[i].point[j].y
          this.linePoints.push(a);
          this.realLinePoints.push(reala);
          //this.testcirclearray.push(a)
          this.makeLineEndPoint(a);
        }        
        this.markinfo = this.lastlabelArry.line[i].info;
        this.findcolor(this.lastlabelArry.line[i].info);
        this.lineinfoArray.push({
          point:this.linePoints,
          info: this.markinfo
        })
        this.reallineinfoArray.push({
          point:this.realLinePoints,
          info: this.markinfo
        })
        console.log("linePoints", this.linePoints);
        this.makeLine(this.linePoints);
        this.fabricObj.add(this.line);
        this.lineArray.push(this.line);
        this.allobjArray.push(this.line);
        this.linePoints=[];
        this.realLinePoints=[];
        this.markinfo = null;
      }
  }
      if(this.lastlabelArry.polygon!=null&&this.lastlabelArry.polygon!=undefined){
      //多边形
      for (let i = 0; i < this.lastlabelArry.polygon.length; i++) {
        this.realpolygoninfoArray.push(this.lastlabelArry.polygon[i]);
        this.markinfo = this.lastlabelArry.polygon[i].info;
        console.log("lastlabelArry[i].point", this.lastlabelArry.polygon[i].point);
        for (let j = 0; j < this.lastlabelArry.polygon[i].point.length; j++) {
          console.log("point", this.lastlabelArry.polygon[i].point[j]);
          let a = {};
          let reala = {};
          a["x"] = this.lastlabelArry.polygon[i].point[j].x * this.scalewidth;
          a["y"] = this.lastlabelArry.polygon[i].point[j].y * this.scaleheight;
          // reala["x"] = this.lastlabelArry[i].point[j].x;
          // reala["y"] = this.lastlabelArry[i].point[j].y;
          this.roofPoints.push(a);
        }
        console.log("roofPoint", this.roofPoints);
        console.log("this.lastlabelArry[i].info", this.lastlabelArry.polygon[i].info);
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

      if(this.lastlabelArry.circle!=null&&this.lastlabelArry.circle!=undefined){
      //点
      for (let i = 0; i < this.lastlabelArry.circle.length; i++) {
        console.log("circle",this.lastlabelArry.circle[i].point)
        this.markinfo = this.lastlabelArry.circle[i].info;
        this.findcolor(this.lastlabelArry.circle[i].info);
        let a = {};
        let reala = {};
        a["x"] = this.lastlabelArry.circle[i].point.x * this.scalewidth;
        a["y"] = this.lastlabelArry.circle[i].point.y * this.scaleheight;
        reala["x"] = this.lastlabelArry.circle[i].point.x
        reala["y"] = this.lastlabelArry.circle[i].point.y
        let apoint = new fabric.Circle({
          radius: 5,
          fill: this.markcolor,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          top:a.y-5,
          left:a.x-5,
          })
          apoint.on("moved",()=>{//移动完成修改数据
          console.log("aisojfgyaigvy7a98g",this.circleinfoArray[this.circleArray.indexOf(apoint)])
          this.circleinfoArray[this.circleArray.indexOf(apoint)].point.x=apoint.left+5
          this.circleinfoArray[this.circleArray.indexOf(apoint)].point.y=apoint.top+5
          this.realcircleinfoArray[this.circleArray.indexOf(apoint)].point.x=(apoint.left+5)/this.scalewidth
          this.realcircleinfoArray[this.circleArray.indexOf(apoint)].point.y=(apoint.top+5)/this.scaleheight
          })
          apoint.type="point"
          this.circleArray.push(apoint)
          this.allobjArray.push(apoint)
          this.fabricObj.add(apoint)
          this.circleinfoArray.push({
            point:a,
            info: this.markinfo
          })
          this.realcircleinfoArray.push({
            point:reala,
            info: this.markinfo
          })
          this.markinfo = null;
      }
      }
      this.fabricObj.renderAll();
      this.fabricObj.hoverCursor="default";
      this.havefabricobj=true;
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
      console.log("circlearray",this.circleArray)
      console.log("circleinfoarray",this.circleinfoArray)
      console.log("realcircleinfoarray",this.realcircleinfoArray)
      console.log("polygonArrayuuu", this.polygonArray);
      console.log("polygonArrayuuu", this.polygonArray);
      console.log("polygonArrayuuu", this.polygonArray);
      console.log("allobjArrayuuu", this.allobjArray);
    },
    createBackgroundImage() {
      //加载图片为背景
      let _this = this;
      console.log(this.imagesrc);
      if (this.imagesrc === null || this.imagesrc === undefined) return;
      this.fabricimageObj = new fabric.Image.fromURL(
        this.imagesrc,
        function (img) {
          _this.imagewidth = img.width;
          _this.imageheight = img.height;
          _this.scalewidth = 1;
          _this.scaleheight = 1;
          if (img.width < _this.divWidth*0.8 && img.height < _this.divHeight*0.8) {
            while (_this.imagewidth < _this.divWidth*0.8 && _this.imageheight < _this.divHeight*0.8) {
              _this.imagewidth *= 1.1;
              _this.imageheight *= 1.1;
              _this.scalewidth *= 1.1;
              _this.scaleheight *= 1.1;
            }
          }
          if (img.width > _this.divWidth || img.height > _this.divHeight) {
            while (_this.imagewidth > _this.divWidth || _this.imageheight > _this.divHeight) {
              _this.imagewidth /= 1.1;
              _this.imageheight /= 1.1;
              _this.scalewidth /= 1.1;
              _this.scaleheight /= 1.1;
            }
          }
          _this.distanceDelta = new fabric.Point((_this.divWidth-_this.imagewidth)/2, (_this.divHeight-_this.imageheight)/2);
          _this.fabricObj.setWidth(_this.divWidth);
          _this.fabricObj.setHeight(_this.divHeight);
          console.log(img.width);
          console.log(img.height);
          console.log(_this.imagewidth);
          console.log(_this.imageheight);
          console.log(_this.fabricObj.width);
          console.log(_this.fabricObj.height);
          console.log(_this.scalewidth);
          console.log(_this.scaleheight);
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
      console.log("eotu23tu042982904823",this.testcirclearray,this.testcirclearray.length)
      if (!this.buttonmouseoveflag) {
        let poly = this.fabricObj.getObjects()[index];
        console.log("tesjiodshovdhsbsngs",poly,poly.type)
        if(poly.type=="polygon"){
          let index2 = this.polygonArray.indexOf(poly)
          console.log("index2",index2)
          console.log(this.polygoninfoArray[index2]);
          console.log(this.realpolygoninfoArray[index2]);
          poly.set({
            fill:"black"
          });
        }
        if(poly.type=="line"){
          console.log("islinein")
          let index2 = this.lineArray.indexOf(poly)
          console.log(this.lineinfoArray[index2]);
          console.log(this.reallineinfoArray[index2]);
          poly.set({
            stroke:"black"
          });
        }
        if(poly.type=="point"){
          console.log("ispointin")
          let index2 = this.circleArray.indexOf(poly)
          console.log(this.circleinfoArray[index2],index2);
          console.log(this.realcircleinfoArray[index2]);
          poly.set({
            fill:"black"
          });
        }
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
        if(poly.type=="polygon"){
          let index2 = this.polygonArray.indexOf(poly)
          this.findcolor(this.polygoninfoArray[index2].info);
          poly.fill = this.markcolor;
          this.markcolor = tempcolor;
        }
        if(poly.type=="line"){
          console.log("islineout")
          let index2 = this.lineArray.indexOf(poly)
          this.findcolor(this.lineinfoArray[index2].info);
          poly.set({
            stroke:this.markcolor
          });
          this.markcolor = tempcolor;
        }
        if(poly.type=="point"){
          console.log("ispointout")
          let index2 = this.circleArray.indexOf(poly)
          this.findcolor(this.circleinfoArray[index2].info);
          poly.set({
            fill:this.markcolor
          });
          this.markcolor = tempcolor;
        }
        this.buttonmouseoveflag = false;
        this.fabricObj.renderAll();
      }
    },
    start() {
      //切换画板上是否能标注的按钮
      if (this.radio == "drag") {
        console.log("aaaa");
        this.clearobj();
        this.fabricObj.renderAll();
      }
      console.log(this.polygonArray);
      console.log(this.polygoninfoArray);
    },

    fabricEvent() {
      this.fabricObj.on({
        // "object:selected":e =>{
        //   console.log("selected")
        // },
        "mouse:down": (e) => {
          if (this.radio == "drag") {
            console.log("1111");
            this.panning = true;
            }
        },
        "mouse:move": (e) => {
          if (this.radio == "drag") {
            if (this.panning && e && e.e) {
              var delta = new fabric.Point(e.e.movementX, e.e.movementY);
              this.fabricObj.relativePan(delta);
            }
          }
        },
        "mouse:up": (e) => {
          console.log("upupup");
          if (this.radio == "drag") {
            this.panning = false;
          }
        },
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
      this.roof.type="polygon";
      //this.roof.bringToFront();
      console.log("create!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", this.roof);
      // this.roof.on({
      //   selected: (e) => {
      //     console.log(e);
      //     console.log("selected");
      //   },
      // });
    },
    makeLine(alinePoints){
      console.log("alinePoints",alinePoints)
      let twopoints=[alinePoints[0].x,alinePoints[0].y,alinePoints[1].x,alinePoints[1].y]
      this.line=new fabric.Line(twopoints,{
                  strokeWidth: 3,
                  selectable: false,
                  hasBorders: false,
                  hasControls: false,
                  //transparentCorners:false ,
                  //strokeUniform :true,
                  stroke: this.markcolor,
                  //stroke:"red",
                })
                this.line.type="line"
                //this.line.sendToBack();
                console.log("this.line",this.line)
    },
    makeLineEndPoint(a){
            let apoint = new fabric.Circle({
                  radius: 5,
                  fill: "green",
                  selectable: true,
                  hasBorders: false,
                  hasControls: false,
                  top:a.y-5,
                  left:a.x-5,
            })
            apoint.bringToFront();
            if(this.testcirclearray.length%2==0){
              apoint.on("moving",()=>{//移动修改坐标
              this.lineArray[this.testcirclearray.indexOf(apoint)/2].set({
                x1:apoint.left+5,
                y1:apoint.top+5
                })
              })
              apoint.on("moved",()=>{//移动完成修改数据
                //console.log(this.scalewidth,",",this.scaleheight)
                // console.log(this.lineArray[this.testcirclearray.indexOf(apoint)/2])
                // console.log(this.lineinfoArray[this.testcirclearray.indexOf(apoint)/2])
                // console.log(this.reallineinfoArray[this.testcirclearray.indexOf(apoint)/2])
              this.lineinfoArray[this.testcirclearray.indexOf(apoint)/2].point[0].x=apoint.left+5
              this.lineinfoArray[this.testcirclearray.indexOf(apoint)/2].point[0].y=apoint.top+5
              this.reallineinfoArray[this.testcirclearray.indexOf(apoint)/2].point[0].x=(apoint.left+5)/this.scalewidth
              this.reallineinfoArray[this.testcirclearray.indexOf(apoint)/2].point[0].y=(apoint.top+5)/this.scaleheight
              })
            }
            else{
              apoint.on("moving",()=>{//移动修改坐标
              this.lineArray[(this.testcirclearray.indexOf(apoint)-1)/2].set({
                x2:apoint.left+5,
                y2:apoint.top+5
                })
              })
              apoint.on("moved",()=>{//移动完成修改数据
                // console.log(this.lineArray[(this.testcirclearray.indexOf(apoint)-1)/2])
                // console.log(this.lineinfoArray[(this.testcirclearray.indexOf(apoint)-1)/2])
                // console.log(this.reallineinfoArray[(this.testcirclearray.indexOf(apoint)-1)/2])
              this.lineinfoArray[(this.testcirclearray.indexOf(apoint)-1)/2].point[1].x=apoint.left+5
              this.lineinfoArray[(this.testcirclearray.indexOf(apoint)-1)/2].point[1].y=apoint.top+5
              this.reallineinfoArray[(this.testcirclearray.indexOf(apoint)-1)/2].point[1].x=(apoint.left+5)/this.scalewidth
              this.reallineinfoArray[(this.testcirclearray.indexOf(apoint)-1)/2].point[1].y=(apoint.top+5)/this.scaleheight
              })
            }

            this.testcirclearray.push(apoint)
            //this.testcirclecount++;
    },
    // findindex(poly,type){
    //   if(type=="polygon"){
    //     console.log("fjaiojfu34u239yt84hbgjkrvjkrwbvjki nv983r8239")
    //     return this.polygonArray.indexOf(poly)
    //   }
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
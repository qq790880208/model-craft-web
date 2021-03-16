<template>
  <div>
    <el-button type="primary" icon="el-icon-edit" circle id="poly" title="Draw Polygon" @click="start">{{buttonstate}}</el-button>
    <label style="color:blue"
      ><b>Press double click to close shape and stop</b></label
    >
    <canvas id="label-canvas" class="canvas" width="800" height="800  "></canvas>
    <el-row>
    <el-input 
    v-model="input" 
    placeholder="请输入内容" 
    style="width:300px" 
    clearable
    ></el-input>
        <!-- <el-button @mouseover="infotip" @mousedown="deletemarked" type="danger">删除</el-button> -->
        <el-button @mouseover.native="infotip" @mouseout.native="removetip" type="danger">删除</el-button>
    </el-row>
  </div>
</template>
<script>
import { fabric } from "fabric";
export default {
  data() {
    return {
      input: null,
      roof: null,
      roofPoints: [],
      lines: [],
      lineCounter: 0,
      polygonArray: [],
      polygonaxisArray: [],
      drawingObject: {},
      drawingObject: {
        type: "",
        background: "",
        border: ""
      },
      fabricObj: null,
      mouseFrom: {},
      canvas: null,
      Point: {},
      markcolor: "rgba(0,128,128,0.5)",
      isCanSelect : false,
      buttonstate : "开始标注",
      buttonmouseoveflag : false
      //imageurl:'http://localhost:9528/static/img/QQ%E5%9B%BE%E7%89%8720201120101655.ff1d6fd1.jpg',
      //localimage:'D:/VueProject/modelcraft-web/src/image/test2.jpg'
    };
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.fabricObj = new fabric.Canvas("label-canvas");
        //this.fabricObj.setBackgroundImage(this.imageurl,this.fabricObj.renderAll.bind(this.fabricObj));
        this.fabricEvent();
      }, 500);
    });
  },
  methods: {
    infotip(){
      if(!this.buttonmouseoveflag){
      console.log(this.polygonaxisArray[this.input-1])
      this.buttonmouseoveflag=true;
      }
    },
    removetip(){
      if(this.buttonmouseoveflag){
        console.log("remove!")
        this.buttonmouseoveflag=false;
      }
    },
    deletemarked(){

    },
    start() {
      if (this.drawingObject.type == "roof") {
        this.drawingObject.type = "";
        // this.lines.forEach(function(value, index, ar) {
        //   this.fabricObj.remove(value);
        // });
        this.lines.forEach(item => this.fabricObj.remove(item));
        if(this.roofPoints.length>2){
        this.makeRoof();
        this.fabricObj.add(this.roof);
        this.polygonArray.push(this.roof);
        this.polygonaxisArray.push(this.roofPoints);
      }
        this.fabricObj.renderAll();
        this.roofPoints = [];
        this.lines = [];
        this.lineCounter = 0;
        this.buttonstate="开始标注"
        //this.polygonArray.forEach(item => item.selectable=true)
        // this.fabricObj.selectable=true;
        // this.isCanSelect=true;
      } else {
        this.drawingObject.type = "roof"; // roof type
        this.buttonstate="(正在标注)停止标注"
        //this.polygonArray.forEach(item => item.selectable=false)
        // this.isCanSelect=false;
        // this.fabricObj.selectable=false;
      }
      console.log(this.polygonArray)
      console.log(this.polygonaxisArray)
    },
    
          // &&e.pointer.x!=this.roofPoints[this.roofPoints.length-1].x
          // &&e.pointer.y!=this.roofPoints[this.roofPoints.length-1].y
    fabricEvent() {
      this.fabricObj.on({
        // "object:selected":e =>{
        //   console.log("selected")
        // },
        "mouse:down": e => {
          //console.log(e)
          //console.log(e)
          if (this.drawingObject.type == "roof"){
            //防止过长时间重复点一个点时点入栈
            if(this.roofPoints.length<1||(this.roofPoints.length>=1
            &&e.pointer.x!=this.roofPoints[this.roofPoints.length-1].x
            &&e.pointer.y!=this.roofPoints[this.roofPoints.length-1].y)){
            this.fabricObj.selection = false;
            // this.mouseFrom.x = e.pointer.x;
            // this.mouseFrom.y = e.pointer.y
            let a = {}
              // a["x"] = this.mouseFrom.x;
              // a["y"] = this.mouseFrom.y;
              a["x"] = e.pointer.x;
              a["y"] = e.pointer.y
            this.roofPoints.push(a);
            var points = [a.x, a.y, a.x, a.y];
            this.lines.push(
              new fabric.Line(points, {
                strokeWidth: 3,
                selectable: false,
                stroke: this.markcolor
              })
            );
             this.fabricObj.add(this.lines[this.lineCounter]);
            this.lineCounter++;
          }
          else{
            console.log("click repeat!!!")
          }
          }
        },
        "mouse:move": e => {
          if (
            this.lines[0] !== null &&
            this.lines[0] !== undefined &&
            this.drawingObject.type == "roof"
          ) {
            this.x = e.pointer.x;
            this.y = e.pointer.y;
            //console.log(this.lineCounter)
            this.lines[this.lineCounter - 1].set({
              x2: this.x,
              y2: this.y
            });
            this.fabricObj.renderAll();
          }
        },
        "mouse:dblclick": e => {
          if (this.drawingObject.type == "roof") {
          // if (Math.abs(this.roofPoints[this.roofPoints.length-1].x-this.roofPoints[0].x)<10||
          // Math.abs(this.roofPoints[this.roofPoints.length-1].y-this.roofPoints[0].y)<10) {
          //             console.log("double click clean");
          // //clear arrays
          // this.roofPoints = [];
          // this.lines = [];
          // this.lineCounter = 0;
          // }
          console.log(this.roofPoints.length)
          this.lines.forEach(item => this.fabricObj.remove(item));
          if(this.roofPoints.length>2) { //阻止生成2个点以下的对象，包括空白对象，点对象，线对象
          // canvas.remove(lines[lineCounter - 1]);
          this.makeRoof();
          console.log(this.roof)
          this.fabricObj.add(this.roof);
          this.polygonArray.push(this.roof);
          this.polygonaxisArray.push(this.roofPoints);
          }
          this.fabricObj.renderAll();

          console.log("double click");
          //clear arrays
          this.roofPoints = [];
          this.lines = [];
          this.lineCounter = 0;
          }
        }
      });
    },
    makeRoof() {
      let left = this.findLeftPaddingForRoof(this.roofPoints);
      let top = this.findTopPaddingForRoof(this.roofPoints);
      let a = {}
      a["x"] = this.roofPoints[0].x;
      a["y"] = this.roofPoints[0].y;
      this.roofPoints.push(a);
      this.roof = new fabric.Polygon(this.roofPoints, {
        //fill: "rgba(255,255,0,0)",
        //fill: this.markcolor,
        fill: this.markcolor,
        strokeWidth:2,
        selectable:false,
        hasControls:false,
        //hasBordes:false,
        //stroke: "red",
        left:left,
        top:top
      })
      this.roof.on({
        "selected":e =>{
          console.log(e)
          console.log("selected")
        }
      });
    },
    findTopPaddingForRoof(roofPoints) {
      var result = 999999;
      for (var f = 0; f < this.lineCounter; f++) {
        if (roofPoints[f].y < result) {
          result = roofPoints[f].y;
        }
      }
      return Math.abs(result);
    },
    findLeftPaddingForRoof(roofPoints) {
      var result = 999999;
      for (var i = 0; i < this.lineCounter; i++) {
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
    // }
  }
};
</script>
<style scoped>
.canvas {
  border: 1px solid black;
}
</style>
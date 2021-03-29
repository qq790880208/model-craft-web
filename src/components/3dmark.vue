<template>
  <div id="test" style="user-select: none">
    <el-button @click="gai" v-show="isTrue2">拖动图片</el-button>
    <el-button @click="gai" v-show="!isTrue2">添加标注</el-button>
    <el-button @click="fangda">放大</el-button>
    <el-button @click="suoxiao">缩小</el-button>
    <el-button @click="saveinfo">保存 </el-button>
    <el-button @click="updatelastdata">查看上次标注数据</el-button>



    <div class="content" id:contentfather>
      <div
        :style="{
          transform: 'scale(' + num + ')',
          position: 'relative',
          width: '100%',
          height: '100%',
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
          @mousedown.stop="move(true, $event)"
          @mousedown="handelClick(index)"
          v-for="(item, index) in boxArry"
          :key="index"
          :style="{
            width: item.width + 'px',
            height: item.height + 'px',
            position: 'absolute',
            left: item.left + 'px',
            top: item.top + 'px',
            background: 'rgba(43,100,206,0.8)',
            border: 'none',
          }"
        >
          <!-- <div class="r_b" @mousedown="mouseMove11" v-if="b_i == index"></div> -->
          <div
            class="r_b"
            @mousedown.stop="move(false, $event)"
            v-if="b_i == index"
          >
            {{ index + 1 }}
          </div>
        </div>
        <div
          :style="{
            height: biaozhuHeight + 'px',
            width: biaozhuWidth + 'px',
            top: biaozhuTop + 'px',
            left: biaozhuLeft + 'px',
            position: 'absolute',
            background: 'rgba(43,100,206,0.8)',
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
        <!-- <el-row> -->
        <labelinfo
          :inputname="labelArry[index].info"
          @deletelabel="deletelabel(index)"
          @changeinfo="changeinfo($event, index)"
          style="text-align: center"
        ></labelinfo>
        <!-- <el-input placeholder="请输入内容" style="width:600px" clearable></el-input>
      <el-button type="primary">保存</el-button> -->
        <!-- <el-button @click="deletelabel(index)" type="danger">删除</el-button> -->
        <!-- </el-row> -->
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
      image.onload=() =>{
      console.log("image onload ")
      this.imagewidth = image.width;
      this.imageheight = image.height;
      this.scalewidth = 800 / image.width;
      this.scaleheight = 800 / image.height;
      console.log(this.imagewidth);
      console.log(this.imageheight);
      console.log(this.scalewidth);
      console.log(this.scaleheight);
      this.boxArry = [],
      this.labelArry = [],
      this.num = 1
      }
    },
  },
  data() {
    return {
      num: 1,
      imagewidth: null,
      imageheight: null,
      scalewidth: null, //图片宽度缩放倍数
      scaleheight: null, //图片高度缩放倍数
      boxArry: [],
      labelArry: [],
      tempArry: [],
      //testsc:"image/test2",
      //imagesrc:require('@/'+this.fatherimagesrc+'.jpg'),
      isTrue: false,
      isTrue2: false,
      width: "",
      height: "",
      left: "",
      top: "",
      b_i: "",

      imageleft:0,
      imagetop:0,
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
    commitVuex() {
      this.$store.commit("changeTreeData", { a: 1, b: 2 });
    },
    //  open() {
    //       this.$prompt('请输入邮箱', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    //         inputErrorMessage: '邮箱格式不正确'
    //       }).then(({ value }) => {
    //         this.$message({
    //           type: 'success',
    //           message: '你的邮箱是: ' + value
    //         });
    //       }).catch(() => {
    //         this.$message({
    //           type: 'info',
    //           message: '取消输入'
    //         });
    //       });
    //     },
    // mouseOver2(e) {
    //   document.onmousedown = (e) => {
    //     let odiv = e.target; //获取目标元素

    //     //算出鼠标相对元素的位置
    //     let disX = e.clientX - odiv.offsetLeft;
    //     let disY = e.clientY - odiv.offsetTop;
    //     let left = e.clientX - disX;
    //     let top = e.clientY - disY;

    //     //绑定元素位置到positionX和positionY上面
    //     this.positionX = top;
    //     this.positionY = left;
    //     console.log(this.boxArry, this.dragsIndex);
    //     //移动当前元素
    //     this.boxArry[this.b_i].width = left;
    //     this.boxArry[this.b_i].height = top;
    //   };
    // },
    //  drags(e) {
    //    console.log(e);
    //  },
    //  mouseMove11(e) {
    //    let odiv = e.target; //获取目标元素

    //    //算出鼠标相对元素的位置
    //    let disX = e.clientX - odiv.offsetLeft;
    //    let disY = e.clientY - odiv.offsetTop;
    //    // debugger;
    //    e.target.onmousemove = (e) => {
    //      //鼠标按下并移动的事件
    //      //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
    //      // console.log('aaaaaaaaaaaaa',e)
    //      let left = e.clientX - disX;
    //      let top = e.clientY - disY;

    //      //绑定元素位置到positionX和positionY上面
    //      this.positionX = top;
    //      this.positionY = left;
    //      // console.log(this.boxArry,this.dragsIndex)
    //      //移动当前元素
    //      this.boxArry[this.b_i].width = left+9;
    //      this.boxArry[this.b_i].height = top+9;
    //      e.target.onmouseup = (e) => {
    //        e.target.onmousemove = null;

    //        // document.onmouseup = null;
    //      };
    //    };
    //  },
    updatelastdata() {
      console.log("image select lastlabelArry", this.lastlabelArry);
      this.boxArry = []
      this.labelArry = []
      for (let i = 0; i < this.lastlabelArry.length; i++) {
        let left = this.lastlabelArry[i].x1 
        let top = this.lastlabelArry[i].y1 
        let width = (this.lastlabelArry[i].x2-this.lastlabelArry[i].x1) 
        let height = (this.lastlabelArry[i].y2-this.lastlabelArry[i].y1) 
        this.boxArry.push({
          width: width * this.scalewidth,
          height: height * this.scaleheight,
          left: left * this.scalewidth,
          top: top * this.scaleheight,
        });
        this.labelArry.push({
          x1: left,
          y1: top,
          x2: (left + width) ,
          y2: (top + height) ,
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
    deletelabel(i) {
      this.boxArry.splice(i, 1);
      this.labelArry.splice(i, 1);
      console.log(this.boxArry);
      console.log(this.labelArry);
    },
    changeinfo(input, i) {
      //保存标注信息
      //console.log("father"+input,i)
      this.labelArry[i].info = input;
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
      console.log("mousedown!!!!!!!!")
      console.log("this.imageleft",this.imageleft,"this.imagetop",this.imagetop);
      //拖动图片的相对位置
      let left2 = this.imageleft
      let top2 = this.imagetop
      //算出鼠标相对元素的位置
      let disX = e.clientX + this.imageleft - odiv.offsetLeft;
      let disY = e.clientY + this.imagetop - odiv.offsetTop;
      //  let disX = (e.clientX - odiv.offsetLeft) / this.num;
      //  let disY = (e.clientY - odiv.offsetTop) / this.num;
      console.log("disxy", disX, disY);
      if (this.isTrue2) {
        // 拖动图片
        console.log("image mousemove!!!!!!!!!!!!!!");
        document.onmousemove = (e) => {
          //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX+left2;
          let top = e.clientY - disY+top2;

          //绑定元素位置到positionX和positionY上面
          this.positionX = top;
          this.positionY = left;

          //移动当前元素
          odiv.style.left = left + "px";
          odiv.style.top = top + "px";
          // console.log("odiv.style.left",odiv.style.left,"odiv.style.top",odiv.style.top);
          // console.log("left2",left2,"top2",top2);
          this.imageleft=left
          this.imagetop=top
        };
        document.onmouseup = (e) => {
          console.log("image mouseup!!!!!!!!!!!!!!");
          document.onmousemove = null;
          document.onmouseup = null;
        };
      } else {
        // 添加div
        document.onmouseup = (e) => {
          console.log("nomove mouseup!!!!!!!!!!!!!!");
          document.onmousemove = null;
          document.onmouseup = null;
        };
        console.log(e);
        document.onmousemove = (e) => {
          //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          console.log("creatediv mousemove!!!!!!!!")
          //  let left = disX - odiv.getBoundingClientRect().x;
          //  let top = disY - odiv.getBoundingClientRect().y;
          let left = (disX  - odiv.getBoundingClientRect().x) / this.num;
          let top = (disY  - odiv.getBoundingClientRect().y) / this.num;
          //console.log("this.imageleft",this.imageleft,"this.imagetop",this.imagetop);
          console.log(e.target.offsetLeft);
          this.width = (e.clientX - disX) / this.num;
          this.height = (e.clientY - disY) / this.num;
          this.biaozhuWidth = this.width;
          this.biaozhuHeight = this.height;
          this.biaozhuLeft = left;
          this.biaozhuTop = top;
          document.onmouseup = (e) => {
            console.log("creatediv mouseup!!!!!!!!")
            let left = (disX - odiv.getBoundingClientRect().x) / this.num;
            let top = (disY - odiv.getBoundingClientRect().y) / this.num;
            this.width = (e.clientX - disX) / this.num;
            this.height = (e.clientY - disY) / this.num;

            console.log(e.target.getBoundingClientRect(), disX, disY);

            if (this.width > 5 && this.height > 5) {
              this.boxArry.push({
                width: this.width,
                height: this.height,
                left: left,
                top: top,
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
    move(istrue, e) {
      let odiv = e.target; //获取目标元素
      //console.log("movemovemove");
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft * this.num;
      let disY = e.clientY - odiv.offsetTop * this.num;
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
          this.boxArry[this.b_i].width = left + 9;
          this.boxArry[this.b_i].height = top + 9;
          this.labelArry[this.b_i].x2 =
            (this.scalewidth * this.labelArry[this.b_i].x1 + left + 9) /
            this.scalewidth;
          this.labelArry[this.b_i].y2 =
            (this.scaleheight * this.labelArry[this.b_i].y1 + top + 9) /
            this.scaleheight;
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
 .content {
   width: 800px;
   height: 500px;
   background: rgb(0, 0, 0);
   margin: 0 auto;
   overflow: hidden;
   position: relative;
 }

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
   .r_b {
     position: absolute;
     right: 0;
     bottom: 0;
     width: 8px;
     height: 8px;
     background: green;
   }
   .r_b:hover {
     cursor: se-resize;
   }
 }

</style>>


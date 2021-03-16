<template>
 <div id="test" style="user-select: none;">
   <el-button @click="fangda">放大</el-button>
   <el-button @click="suoxiao">缩小</el-button>
   <el-button @click="saveinfo">保存 </el-button>
   <el-button @click="gai" v-show="isTrue">添加</el-button>


    <div class="content" id:contentfather>
     <div
       :style="{
         transform: 'scale(' + num + ')',
         position: 'relative',
         width: '100%',
         height: '100%',
       }"
       @mousedown="moveMouse"
       @click="getOffect"
     >
       <div
         :class="
           'biaozhu' + index == 'biaozhu' + b_i
             ? 'biaozhu b_border'
             : 'biaozhu'
         "
         :ref="'biaozhu' + index"
         @mousedown.stop="move(true,$event)"
         @mousedown="handelClick(index)"
         v-for="(item, index) in boxArry"
         :key="index"
         :style="{
           width: (item.width + 'px'),
           height: item.height + 'px',
           position: 'absolute',
           left: item.left + 'px',
           top: item.top + 'px',
           background: 'rgba(43,100,206,0.3)',
           border: 'none',
         }"
       >
         <!-- <div class="r_b" @mousedown="mouseMove11" v-if="b_i == index"></div> -->
         <div class="r_b" @mousedown.stop="move(false,$event)" v-if="b_i == index">{{index+1}}</div>
       </div>
       <div
         :style="{
           height:biaozhuHeight + 'px',
           width: biaozhuWidth + 'px',
           top: biaozhuTop + 'px',
           left: biaozhuLeft + 'px',
           position: 'absolute',
           background: 'rgba(43,100,206,0.3)',
         }"
       ></div>
       <img
         style="width: 100%; height: 100%; pointer-events: none;"
         :src=imagesrc
         alt=""
         @mousedown="isTrue ? null : alter"
       />
     </div>
   </div>
   <div id=labelfather>
    <div v-for="(items, index) in boxArry" :key=index>
      <!-- <el-row> -->
      <labelinfo :inputname="boxArry[index].info" @deletelabel="deletelabel(index)" @changeinfo='changeinfo($event,index)'></labelinfo>
      <!-- <el-input placeholder="请输入内容" style="width:600px" clearable></el-input>
      <el-button type="primary">保存</el-button> -->
      <!-- <el-button @click="deletelabel(index)" type="danger">删除</el-button> -->
      <!-- </el-row> -->
    </div>
   </div>
 </div>
</template>
<script>
  import labelinfo from '@/components/labelinfo.vue'
export default {
  //input: 1
  props:{
    fatherimagesrc:String,
    imageindex:Number
  },
  components: {
    labelinfo
    },
    computed: {
      imagesrc:function(){
        //return require('@/image/'+this.fatherimagesrc)
        //return require('http://192.168.19.237:18080/images/abc.png')
        //return require('@/'+'image/微信图片_20200927191717'+'.jpg')
        return this.fatherimagesrc
      }
    },
 data() {
   return {
     num: 1,
     boxArry: [],
     tempArry:[],
     //testsc:"image/test2",
     //imagesrc:require('@/'+this.fatherimagesrc+'.jpg'),
     isTrue: false,
     isTrue2:false,
     width: "",
     height: "",
     left: "",
     top: "",
     b_i: "",
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
   mouseOver2(e) {
     document.onmousedown = (e) => {
       let odiv = e.target; //获取目标元素

       //算出鼠标相对元素的位置
       let disX = e.clientX - odiv.offsetLeft;
       let disY = e.clientY - odiv.offsetTop;
       let left = e.clientX - disX;
       let top = e.clientY - disY;

       //绑定元素位置到positionX和positionY上面
       this.positionX = top;
       this.positionY = left;
       console.log(this.boxArry, this.dragsIndex);
       //移动当前元素
       this.boxArry[this.b_i].width = left;
       this.boxArry[this.b_i].height = top;
     };
   },
   drags(e) {
     console.log(e);
   },
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
   settrue(){
     this.isTrue2=true;
     console.log("setture")
   },
   setfalse(){
     this.isTrue2=false;
     console.log("setfalse")
   },
   saveinfo(){
     console.log("start!!!",this.boxArry)
     //变为深拷贝
     this.tempArry.push(JSON.parse(JSON.stringify(this.boxArry)))
     //this.tempArry[0]=this.boxArry
     this.tempArry.push(this.fatherimagesrc)
     this.tempArry.push(this.imageindex)
     this.$emit('saveimageinfo',this.tempArry,this.imageindex)
     console.log("11111",this.tempArry,this.tempArry[0],this.tempArry[1],this.tempArry[2])
     this.tempArry=[]
     console.log("22222",this.tempArry)
    //  this.$emit('saveimageinfo',this.boxArry,this.fatherimagesrc,this.imageindex)
    //  console.log(this.boxArry,this.fatherimagesrc,this.imageindex)
   },
   deletelabel(i) {
     this.boxArry.splice(i,1)
     console.log(this.boxArry)
   },
   changeinfo(input,i) {
     //console.log("father"+input,i)
     this.boxArry[i].info=input
   },
   gai() {
     this.isTrue = !this.isTrue;
   },
   getOffect(e) {
     console.log(e);
     document.onmouseup = null;
     // this.left=e.offsetX
     //     this.top=e.offsetY
   },
   moveMouse(e) {
     let odiv = e.target; //获取目标元素
     //算出鼠标相对元素的位置
     let disX = e.clientX - odiv.offsetLeft;
     let disY = e.clientY - odiv.offsetTop;
     console.log(disX, disY);
     if (this.isTrue) {
       // 拖动
       document.onmousemove = (e) => {
         //鼠标按下并移动的事件
         //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
         let left = e.clientX - disX;
         let top = e.clientY - disY;

         //绑定元素位置到positionX和positionY上面
         this.positionX = top;
         this.positionY = left;

         //移动当前元素
         odiv.style.left = left + "px";
         odiv.style.top = top + "px";
       };
       document.onmouseup = (e) => {
         document.onmousemove = null;
         document.onmouseup = null;
       };
     } else {
       // 添加div

       console.log(e);
       document.onmousemove = (e) => {
         //鼠标按下并移动的事件
         //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置

         let left = disX - odiv.getBoundingClientRect().x;
         let top = disY - odiv.getBoundingClientRect().y;

         console.log(e.target.offsetLeft);
         this.width = (e.clientX - disX) / this.num;
         this.height = (e.clientY - disY) / this.num;
         this.biaozhuWidth = this.width;
         this.biaozhuHeight = this.height;
         this.biaozhuLeft = left;
         this.biaozhuTop = top;
         document.onmouseup = (e) => {
           let left = disX - odiv.getBoundingClientRect().x;
           let top = disY - odiv.getBoundingClientRect().y;
           this.width = (e.clientX - disX) / this.num;
           this.height = (e.clientY - disY) / this.num;

           console.log(e.target.getBoundingClientRect(), disX, disY);
           
           if (this.width > 5 && this.height > 5) {
             this.boxArry.push({
               width: this.width,
               height: this.height,
              //  left: left,
              //  top: top,
               info:"default"
             });
             //完成标注
             console.log(this.boxArry)
            //  console.log(this.left)
            //  console.log(this.top)
            //  console.log(this.width)
            //  console.log("111"+this.boxArry)
              this.$emit('markarray',this.boxArry)
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
   move(istrue,e) {
     let odiv = e.target; //获取目标元素
     //console.log("movemovemove");
     //算出鼠标相对元素的位置
     let disX = e.clientX - odiv.offsetLeft;
     let disY = e.clientY - odiv.offsetTop;
     document.onmousemove = (e) => {
       //鼠标按下并移动的事件
       //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
       let left = e.clientX - disX;
       let top = e.clientY - disY;

       //绑定元素位置到positionX和positionY上面
       this.positionX = top;
       this.positionY = left;

       //移动当前元素
       if(istrue === true)
       {
       odiv.style.left = left + "px";
       odiv.style.top = top + "px";
       this.boxArry[this.b_i].left = left;
       this.boxArry[this.b_i].top = top;
       }
       //缩放当前元素
       if(istrue === false)
       {
       this.boxArry[this.b_i].width = left+9;
       this.boxArry[this.b_i].height = top+9;
       }
     };
     document.onmouseup = (e) => {
       document.onmousemove = null;
       if(istrue === true)document.onmouseup = null;
     };
      console.log(this.boxArry)
   },
   
   alter(e) {
     let odiv = e.target; //获取目标元素
     console.log("movemovemove");
     //算出鼠标相对元素的位置
     let disX = e.clientX - odiv.offsetLeft;
     let disY = e.clientY - odiv.offsetTop;
     document.onmousemove = (e) => {
       //鼠标按下并移动的事件
       //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
       let left = e.clientX - disX;
       let top = e.clientY - disY;

       //绑定元素位置到positionX和positionY上面
       this.positionX = top;
       this.positionY = left;

       //移动当前元素
       odiv.style.left = left + "px";
       odiv.style.top = top + "px";
     };
     document.onmouseup = (e) => {
       document.onmousemove = null;
       document.onmouseup = null;
     };
      console.log(this.boxArry)
   },
   fangda() {
     //this.num += 0.1;
     //imagesrc=require(this.testsc)
     console.log(this.fatherimagesrc,this.imageindex)
   },
   suoxiao() {
     if(this.num>0.2)
     this.num -= 0.1;
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
     console.log("hahaha"+i);
   },
   dragstart(event, data) {
     // console.log('drag')
     // event.dataTransfer.setData('item', data)
   },
   dragend(event) {
     // event.dataTransfer.clearData()
   },
 },
 directives: {
   drag: function (el) {
     let dragBox = el; //获取当前元素
          console.log("movemouse")
     dragBox.onmousedown = (e) => {
       //算出鼠标相对元素的位置

       let disX = e.clientX - dragBox.offsetLeft;
       let disY = e.clientY - dragBox.offsetTop;
       console.log(disX, disY);
       document.onmousemove = (e) => {
         //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
         let left = e.clientX - disX;
         let top = e.clientY - disY;
         //移动当前元素
         dragBox.style.left = left + "px";
         dragBox.style.top = top + "px";
         console.log(left, top, "111111111");
       };
       document.onmouseup = (e) => {
         //鼠标弹起来的时候不再移动
         document.onmousemove = null;
         //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
         document.onmouseup = null;
       };
     };
   },
 },
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
}
</style>>



<template>
  <div style="display: flex">
    <div id="testwave">
    </div>
    <div class="leftdiv">
      <!-- <form role="form" name="edit" style="opacity: 0; transition: opacity 300ms linear; margin: 30px 0;">
                <div class="form-group">
                    <label for="start">Start</label>
                    <input class="form-control" id="start" name="start" />
                </div>

                <div class="form-group">
                    <label for="end">End</label>
                    <input class="form-control" id="end" name="end" />
                </div>

                <div class="form-group">
                    <label for="note">Note</label>
                    <textarea id="note" class="form-control" rows="3" name="note"></textarea>
                </div>

                <button type="submit" class="btn btn-success btn-block">Save</button>
                <center><i>or</i></center>
                <button type="button" class="btn btn-danger btn-block" data-action="delete-region">Delete</button>
            </form> -->
      <!-- <el-row> -->
      <!-- <el-card class="box-card" style="text-align:left"> -->
      <div id="test">
        <div style="text-align: left" @click="changebi">
          <div ref="waveform" id="waveform">
            <!-- Here be the waveform -->
          </div>
          <div ref="wavetimeline" >
            <!--时间轴 -->
          </div>
          <div ref="miniwaveform"></div>
          <div>
            <el-button type="primary" @click="playMusic">
              <i class="el-icon-video-play"></i>
              播放 /
              <i class="el-icon-video-pause"></i>
              暂停
            </el-button>
            <!-- <input id:aas data-action="zoom" type="range" :min=minnum :max=maxnum :value=valuenum style="width: 30%" /> -->
            <input
              ref="inputtest"
              type="range"
              min="1"
              max="200"
              value="0"
              style="width: 30%"
            />
          </div>

          <!-- </el-card> -->
        </div>
        <div style="max-height: 600px; overflow: auto">
          <div
            v-for="(items, index) in infoArry"
            :key="index"
            style="margin-top: 10px"
          >
            <labelinfo
              :inputname1="infoArry[index].info1"
              :inputname2="infoArry[index].info2"
              :nowindex="index + 1"
              @deletelabel="deletelabel(index)"
              @changeinfo1="changeinfo1($event, index)"
              @changeinfo2="changeinfo2($event, index)"
              @mousedown.native="handelClick(index)"
              :style="{
                //textAlign:'center',
                border:
                  b_i === index ? '1px solid #ff0000' : '0px solid #ff0000',
              }"
              style="text-align: center"
            ></labelinfo>
          </div>
        </div>
        <!-- </el-row> -->
      </div>
    </div>
    <div class="el-divider el-divider--vertical"></div>
    <div class="rightdiv" @click="changebi">
      <div class="infopolygon" style="margin-left: 20px">
        <div
          v-for="(items, index) in premarktype"
          :key="index"
          style="float: left; margin-right: 20px"
        >
          <el-button
            @click="changecolor(items, index)"
            :style="{
              width: 120 + 'px',
              marginBottom: 10 + 'px',
              background: buttonindex == index ? items.color : 'rgba(0,0,0,0)',
            }"
            >{{ items.name }}</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import WaveSurfer from "wavesurfer.js";
import labelinfo from "@/components/wavelabelinfo.vue";
import Timeline from "wavesurfer.js/dist/plugin/wavesurfer.timeline.js";
import Regions from "wavesurfer.js/dist/plugin/wavesurfer.regions.js";
import Minimap from "wavesurfer.js/dist/plugin/wavesurfer.minimap.js";
import Cursor from "wavesurfer.js/dist/plugin/wavesurfer.cursor.js";
////js////
// let wavesurfer = WaveSurfer.create({
//     container: document.querySelector('#testwave'),
//     plugins: [
//         WaveSurfer.cursor.create({
//             showTime: true,
//             opacity: 1,
//             customShowTimeStyle: {
//                 'background-color': '#000',
//                 color: '#fff',
//                 padding: '2px',
//                 'font-size': '10px'
//             }
//         })
//     ]
// });
//////////
export default {
  name: "Details",
  props: {
    premarktype: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      wavesurfer: null,
      newregion: null,
      b_i: -1,
      buttonindex: -1,
      markcolor: null, //标记颜色
      //selsectlabel:false,
      minnum: 1,
      maxnum: 200,
      valuenum: 200,
      infoArry: [],
      highlight: [],
    };
  },
  components: {
    labelinfo,
  },
  mounted() {
    this.$nextTick(() => {
      console.log(WaveSurfer);
      this.wavesurfer = WaveSurfer.create({
        container: this.$refs.waveform,
        //container: "#waveform",
        waveColor: "#A8DBA8",
        //scrollParent: true,
        //responsive:true,
        //normalize:true,
        //forceDecode:true,
        //fillParent:true,
        //autoCenter:false,
        //waveColor:"rgba(128,0,0,0.5)",
        progressColor: "#3B8686",
        backend: "MediaElement",
        plugins: [
          Regions.create(), //创建标注区域
          Minimap.create({
            //创建mini音频波形
            height: 30,
            // container: "#miniwaveform",this.$refs.
            container: this.$refs.miniwaveform,
            waveColor: "#ddd",
            progressColor: "#999",
            cursorColor: "#999",
          }),
          Timeline.create({
            //创建时间轴
            // container: "#wavetimeline",
            container: this.$refs.wavetimeline,
            formatTimeCallback: this.formatTimeCallback,
            timeInterval: this.timeInterval,
            primaryLabelInterval: this.primaryLabelInterval,
            secondaryLabelInterval: this.secondaryLabelInterval,
            // formatTimeCallback: formatTimeCallback,
            // timeInterval: timeInterval,
            // primaryLabelInterval: primaryLabelInterval,
            // secondaryLabelInterval: secondaryLabelInterval,
            // primaryColor: 'blue',
            // secondaryColor: 'red',
            // primaryFontColor: 'blue',
            // secondaryFontColor: 'red'
          }),
          Cursor.create({
            showTime: true,
            //container:'#test',
            opacity: 1,
            followCursor:false,
            customStyle:{
              //position:"relative",
              height:"128px",
              marginTop:"50px",
              marginLeft:"50px",
            },
            customShowTimeStyle: {
              "background-color": "#000",
              color: "#fff",
              padding: "2px",
              "font-size": "10px",
            },
          }),
        ],
      });
      //放大缩小效果
      let _this = this;
      {
        // Zoom slider
        //let slider = document.querySelector('[data-action="zoom"]');
        let slider = this.$refs.inputtest;
        console.log(this.wavesurfer.params.minPxPerSec);
        slider.value = 0;
        //slider.value = this.wavesurfer.params.minPxPerSec;
        //slider.min = this.wavesurfer.params.minPxPerSec;
        // Allow extreme zoom-in, to see individual samples
        slider.max = 200;
        let _this = this;
        slider.addEventListener("input", function () {
          _this.wavesurfer.zoom(Number(this.value));
        });
        // set initial zoom to match slider value
        this.wavesurfer.zoom(slider.value);
      }
      // 特别提醒：此处需要使用require(相对路径)，否则会报错
      this.wavesurfer.load(require("@/music/abc.mp3"));
      //允许标注并选中第一个标签的颜色
      this.wavesurfer.on("ready", () => {
        //选中第一个标签的颜色
        this.changecolor(this.premarktype[0], 0);
        this.wavesurfer.enableDragSelection({
          //color: this.randomColor(0, 1),
          //color: this.premarktype[0].color
        });
      });
      this.wavesurfer.on("region-click", (region, e) => {
        // console.log("region",region);
        // console.log("e",e);
        e.stopPropagation();
        //let index;
        let _this = this;
        this.infoArry.forEach(function (item, id) {
          console.log("item", item, "id", id);
          if (item.id === region.id) _this.b_i = id;
        });
        //console.log("index", index);
        //this.wavesurfer.pause();
        region.play();
        // Play on click, loop on shift click
        //e.shiftKey ? region.playLoop() : region.play();
      });
      //this.wavesurfer.on("region-click", this.editAnnotation);
      //创建标注信息数组
      this.wavesurfer.on("region-created", this.createRegions);
      //更新标注信息数组
      this.wavesurfer.on("region-update-end", this.changeRegions);
      //this.wavesurfer.on("region-update")
      //this.wavesurfer.on('region-removed', this.saveRegions);
      //this.wavesurfer.on("region-in", ()=>{console.log("in")});

      // this.wavesurfer.on("region-play", function (region) {
      //   region.once("out", function () {
      //     console.log("isplaying",_this.wavesurfer.isPlaying())

      //     if(!_this.wavesurfer.isPlaying()) {
      //                 console.log("sadasdasd")
      //                 _this.wavesurfer.pause();}
      //   });
      // });
    });
  },
  watch: {},
  methods: {
    entermark(){

    },
    changebi() {
      console.log("change!!!!!!!!!!!!!!!!!!!!");
      this.b_i = -1;
    },
    handelClick(i) {
      //存储点击对象的index
      this.b_i = i;
      console.log("hahaha" + i);
    },
    editAnnotation(region) {
      // console.log(region)
      // console.log(region.id)
      // console.log(region.start,region.end)
      // console.log(this.wavesurfer.regions.list)
    },
    createRegions(region) {
      this.b_i = -1;
      //console.log("dsadsadadsadasdsadsadsadasdasdasdsadsadasdasdasd")
      region.color = this.markcolor;
      this.infoArry.push({
        id: region.id,
        start: null,
        end: null,
        info1: "pinyin",
        info2: "hanzi",
      });
      this.highlight.push(false);
    },
    changeRegions(region) {
      let _this = this;
      console.log(region.id, _this);
      let index;
      this.infoArry.forEach(function (item, id) {
        console.log("item", item, "id", id);
        if (item.id === region.id) {
          _this.b_i = id;
          index = id;
        }
      });
      console.log("index", index);
      this.infoArry[index].start = region.start;
      this.infoArry[index].end = region.end;
      console.log("labbababbaba", this.infoArry);
    },
    deletelabel(i) {
      //删除对应的标注信息和标注片段
      this.b_i = -1;
      let regionId = this.infoArry[i].id;
      this.infoArry.splice(i, 1);
      if (regionId) {
        this.wavesurfer.regions.list[regionId].remove();
      }
      console.log(this.infoArry);
      console.log(this.wavesurfer.regions.list);
    },
    changecolor(item, i) {
      //切换标注颜色
      console.log("changecolor", i);
      this.buttonindex = i;
      this.markcolor = item.color;
      //this.markinfo = item.name;
    },
    changeinfo1(input, i) {
      //保存标注信息
      //console.log("father"+input,i)
      this.infoArry[i].info1 = input;
    },
    changeinfo2(input, i) {
      //保存标注信息
      //console.log("father"+input,i)
      this.infoArry[i].info2 = input;
    },
    randomColor(alpha) {
      return (
        "rgba(" +
        [
          ~~(Math.random() * 255),
          ~~(Math.random() * 255),
          ~~(Math.random() * 255),
          alpha || 0.25,
        ] +
        ")"
      );
    },
    playMusic() {
      //"播放/暂停"按钮的单击触发事件，暂停的话单击则播放，正在播放的话单击则暂停播放
      this.wavesurfer.playPause.bind(this.wavesurfer)();
    },
    //下面4个都是时间轴放大缩小样式函数
    formatTimeCallback(seconds, pxPerSec) {
      seconds = Number(seconds);
      var minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;

      // fill up seconds with zeroes
      var secondsStr = Math.round(seconds).toString();
      if (pxPerSec >= 25 * 10) {
        secondsStr = seconds.toFixed(2);
      } else if (pxPerSec >= 25 * 1) {
        secondsStr = seconds.toFixed(1);
      }

      if (minutes > 0) {
        if (seconds < 10) {
          secondsStr = "0" + secondsStr;
        }
        return `${minutes}:${secondsStr}`;
      }
      return secondsStr;
    },
    timeInterval(pxPerSec) {
      var retval = 1;
      if (pxPerSec >= 25 * 100) {
        retval = 0.01;
      } else if (pxPerSec >= 25 * 40) {
        retval = 0.025;
      } else if (pxPerSec >= 25 * 10) {
        retval = 0.1;
      } else if (pxPerSec >= 25 * 4) {
        retval = 0.25;
      } else if (pxPerSec >= 25 * 2) {
        retval = 0.5;
      } else if (pxPerSec >= 25) {
        retval = 1;
      } else if (pxPerSec * 5 >= 25) {
        retval = 5;
      } else if (pxPerSec * 15 >= 25) {
        retval = 15;
      } else {
        retval = Math.ceil(0.5 / pxPerSec) * 60;
      }
      return retval;
    },
    primaryLabelInterval(pxPerSec) {
      var retval = 1;
      if (pxPerSec >= 25 * 100) {
        retval = 10;
      } else if (pxPerSec >= 25 * 40) {
        retval = 4;
      } else if (pxPerSec >= 25 * 10) {
        retval = 10;
      } else if (pxPerSec >= 25 * 4) {
        retval = 4;
      } else if (pxPerSec >= 25 * 2) {
        retval = 2;
      } else if (pxPerSec >= 25) {
        retval = 5;
      } else if (pxPerSec * 5 >= 25) {
        retval = 2;
      } else if (pxPerSec * 15 >= 25) {
        retval = 2;
      } else {
        retval = Math.ceil(0.5 / pxPerSec) * 60;
      }
      return retval;
    },
    secondaryLabelInterval(pxPerSec) {
      // draw one every 10s as an example
      // return Math.floor(100 / this.timeInterval(pxPerSec));
    },
  },
};
</script>
<style scoped>
.leftdiv {
  background-color: #fafafa;
  padding: 20px;
  width: 1000px;
  height: 100%;
  max-height: 800px;
  /* overflow:auto; */
  /* min-height: calc(100vh - 84px); */
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


<template>
  <div class="mixin-components-container">
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
    <el-row>
      <!-- <el-card class="box-card" style="text-align:left"> -->
      <div class="box-card" style="text-align: left">
        <div id="waveform">
          <!-- Here be the waveform -->
        </div>
        <div id="wave-timeline" ref="wave-timeline">
          <!--时间轴 -->
        </div>
        <div>
          <el-button type="primary" @click="playMusic">
            <i class="el-icon-video-play"></i>
            播放 /
            <i class="el-icon-video-pausee"></i>
            暂停
          </el-button>
          <!-- <input id:aas data-action="zoom" type="range" :min=minnum :max=maxnum :value=valuenum style="width: 30%" /> -->
          <input
            data-action="zoom"
            type="range"
            min="1"
            max="20"
            value="0"
            style="width: 100%"
          />
        </div>

        <!-- </el-card> -->
      </div>
      <div v-for="(items, index) in infoArry" :key="index">
        <labelinfo
          :inputname="infoArry[index].info"
          :ishighlight="highlight[index]"
          @deletelabel="deletelabel(index)"
          @changeinfo="changeinfo($event, index)"
          style="text-align: center"
        ></labelinfo>
      </div>
    </el-row>
  </div>
</template>
<script>
import WaveSurfer from "wavesurfer.js";
import labelinfo from "@/components/wavelabelinfo.vue";
import Timeline from "wavesurfer.js/dist/plugin/wavesurfer.timeline.js";
import Regions from "wavesurfer.js/dist/plugin/wavesurfer.regions.js";
import Minimap from "wavesurfer.js/dist/plugin/wavesurfer.minimap.js";
import Cursor from "wavesurfer.js/dist/plugin/wavesurfer.cursor.js";
export default {
  name: "Details",
  data() {
    return {
      wavesurfer: null,
      newregion: null,
      minnum: 1,
      maxnum: 200,
      valuenum: 1000,
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
        //container: this.$refs.waveform,
        container: "#waveform",
        waveColor: "#A8DBA8",
        progressColor: "#3B8686",
        backend: "MediaElement",
        plugins: [
          Regions.create(), //创建标注区域
          Minimap.create({
            //创建mini音频波形
            height: 30,
            waveColor: "#ddd",
            progressColor: "#999",
            cursorColor: "#999",
          }),
          Timeline.create({
            //创建时间轴
            container: "#wave-timeline",
            // formatTimeCallback: this.formatTimeCallback,
            // timeInterval: this.timeInterval,
            // primaryLabelInterval: this.primaryLabelInterval,
            // secondaryLabelInterval: this.secondaryLabelInterval,
            // primaryColor: 'blue',
            // secondaryColor: 'red',
            // primaryFontColor: 'blue',
            // secondaryFontColor: 'red'
          }),
          Cursor.create({
            showTime: true,
            opacity: 1,
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
        let slider = document.querySelector('[data-action="zoom"]');
        console.log(this.wavesurfer.params.minPxPerSec);
        slider.value = 1;
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
      //随机标注颜色
      this.wavesurfer.on("ready", () => {
        this.wavesurfer.enableDragSelection({
          color: this.randomColor(0, 1),
        });
      });

      this.wavesurfer.on("region-click", (region, e) => {
        // console.log("region",region);
        // console.log("e",e);
        e.stopPropagation();
        //this.wavesurfer.pause();
        region.play();
        // Play on click, loop on shift click
        //e.shiftKey ? region.playLoop() : region.play();
      });
      this.wavesurfer.on("region-click", this.editAnnotation);
      //创建标注信息数组
      this.wavesurfer.on("region-created", this.createRegions);
      //更新标注信息数组
      this.wavesurfer.on("region-update-end", this.changeRegions);
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
    editAnnotation(region) {
      // console.log(region)
      // console.log(region.id)
      // console.log(region.start,region.end)
      // console.log(this.wavesurfer.regions.list)
    },
    createRegions(region) {
      this.infoArry.push({
        id: region.id,
        start: null,
        end: null,
        info: "default",
      });
      this.highlight.push(false)
    },
    changeRegions(region) {
      
      console.log(region.id);
      let index;
      this.infoArry.forEach(function (item, id) {
        console.log("item", item, "id", id);
        if (item.id === region.id) index = id;
      });
      console.log("index", index);
      this.infoArry[index].start = region.start;
      this.infoArry[index].end = region.end;
      console.log("labbababbaba", this.infoArry);
    },
    deletelabel(i) {
      //删除对应的标注信息和标注片段
      let regionId = this.infoArry[i].id;
      this.infoArry.splice(i, 1);
      if (regionId) {
        this.wavesurfer.regions.list[regionId].remove();
      }
      console.log(this.infoArry);
      console.log(this.wavesurfer.regions.list);
    },
    changeinfo(input, i) {
      //保存标注信息
      //console.log("father"+input,i)
      this.infoArry[i].info = input;
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
    secondaryLabelInterval(pxPerSec) {
      // draw one every 10s as an example
      return Math.floor(10 / this.timeInterval(pxPerSec));
    },
  },
};
</script>
<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
</style>

<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '../../utils'
require('echarts/theme/macarons') // echarts theme
export default {
  props: {
    Data: {
      type: Object,
      default: {}
    },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '250px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  mounted() {
    this.$nextTick(function () {
      setTimeout(this.initChart(), 200);
    })
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id), 'macarons')
      this.chart.clear();//清除画布内容
      this.chart.setOption({
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: 100,
          left: '3%',
          right: '4%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          name:'epoch',
          nameLocation:"center",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#000000'
            }
          },
          data: this.Data.epoch,
        }],
        yAxis: [{
          type: 'value',
          name: 'loss',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#000000'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#eeeeee'
            }
          }
        }],
        series: {
                name: 'train-loss',
                data: this.Data.valAccuaccy,
                type: 'line',
                color:'	#F08080'
        },
      })
      var that = this
      let sizeFun = function () {
        that.chart.resize()
      }
      window.addEventListener('resize', sizeFun)
    }
  },
//折现数据通过变量传递
  watch: {
    Data: {
      deep: true,
      handler(val) {
        if (val) {
          setTimeout(this.initChart(), 100);
        }
      }
    },
  }
}
</script>
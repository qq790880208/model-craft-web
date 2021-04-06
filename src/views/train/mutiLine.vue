<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '../../utils'
require('echarts/theme/macarons') // echarts theme
export default {
  props: {
    lineData: {
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
        title: {
          //标题
          text: this.lineData.title, 
          textStyle:{
            color:'#000000',
            fontSize:18
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: 0,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: this.lineData.yData, //导航数据
          right: '50%',
          textStyle: {
            fontSize: 12,
            color: '#000000'
          }
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
              color: '#008acd'
            }
          },
          data: this.lineData.yData,
        }],
        yAxis: [{
          type: 'value',
          name: 'loss',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#008acd'
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
        series: this.lineData.series
      })
    }
  },
//折现数据通过变量传递
  watch: {
    lineData: {
      deep: true,
      handler(val) {
        console.log('折线图监听', val)
        if (val) {
          setTimeout(this.initChart(), 100);
        }
      }
    },
  }
}
</script>
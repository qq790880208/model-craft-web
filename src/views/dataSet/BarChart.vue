<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

import resize from './mixins/resize'

const animationDuration = 1000

export default {
  name: 'BarChart',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: { // 监听父组件中的数据变化，重新触发Echarts
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // this.chart = echarts.init(this.$el, 'macarons')
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions({ tags, nums, nums2 } = {}) {
      this.chart.setOption({
        title: {
          textStyle: {
            fontSize: 15
          }
        },
        legend: {
          data: ['标签数', '含有标签的样本数'],
          icon: 'circle', // 图例的形状
          x: 'right' // 图例在右侧
        },
        xAxis: {
          type: 'value',
          axisTick: {
            show: false
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 35,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: [{
          type: 'category',
          data: tags,
          axisTick: {
            alignWithLabel: true
          }
        }],
        series: [{
          name: '标签数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '30%',
          data: nums,
          animationDuration
        },
        {
          name: '含有标签的样本数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '30%',
          data: nums2,
          animationDuration
        }]
      })
    }
  }
}
</script>

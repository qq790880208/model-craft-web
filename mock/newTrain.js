const { config } = require('@vue/test-utils')
const Mock = require('mockjs')


Mock.Random.extend({
    Tname(){
        return this.pick(['yolo','deeplab','fastspeech2'])
    },
    Astatus(){
        return this.pick(['运行中','暂停'])
    },
    Anum_version(){
        return this.pick([1,2,3,4,5,6,7,8,9])
    },
    ARunningTime(){
        return this.pick(['3h','2h'])
    },
    Aname(){
        return this.pick(['周松','田野','边策','廖子恒'])
    },
    Aalgorithm(){
      return this.pick(['tensorflow','pytorch'])
  },
})

let x = []
let y1 = []
let y2 = []
let y = []

let s =  parseInt(20*Math.random())
for (let index = 0; index < s; index++) {
  x.push(index)
  y1.push(parseInt(1000*Math.random()))
  y2.push(parseInt(1000*Math.random()))
  y.push(parseInt(1000*Math.random()))
}
// task:'yolo',
//             algorithm:'yolov3',
//             status:'运行中',
//             num:1,
//             time:'20min',
//             date: '2016-05-02',
//             description:'无',
//             name: '王小虎',

let tableData = []
for(let i = 0; i < 10; i++){
  tableData.push({
    'task': '@Tname',
    'algorithm':'@Aalgorithm',
    'status': '@Astatus',
    'num': '@Anum_version',
    'time': '@ARunningTime',
    'date': '@date("yyyy-MM-dd")',
    'description': '无',
    'name': '@Aname',
  })
}

module.exports = [
  {
    url:'/newtrain/start',
    type:'post',
    response: config =>{

      return{
        code:20000,
        data:config.params
      }
    }
  },
  {
    url:'/newtrain/stop',
    type:'post',
    response: _ =>{
      return{
        code:20000,
        data:'success'
      }
    }
  },
  {
    url:'/newtrain/delete',
    type:'post',
    response: _ =>{
      return{
        code:20000,
        data:'success'
      }
    }
  },

  {
    url: '/newtrain/getTableData',
    method: 'get',
    response: config => {
      return {
        code: 20000,
        data: tableData
      }
    }
  },

  {
    url:'/newtrain/search',
    type:'post',
    response: _ =>{
      return{
        code:20000,
        data:'success'
      }
    }
  },

  {
    url:'/newtrain/searchStatus',
    type:'post',
    response: config =>{
      return{
        code:20000,
        data:config.data
      }
    }
  },

  {
    url:'/newtrain/getVisualData',
    type:'get',
    response: config =>{
      return{
        code:20000,
        data:{
          epoch:x,
          trainLoss:y,
          valLoss:y1,
          valAccuaccy:y2
        }
      }
    }
  },

  // {
  //   url: '/train/getVisualData',
  //   method: 'get',
  //   response: config => {
  //     return {
  //       code: 20000,
  //       data: {
  //         data:trainLoss,
  //         data1:valLoss,
  //         data2:valAccuracy,
  //         yData:y
  //       }
  //     }
  //   }
  // },

  

  // {
  //   url: '/train/getcreateInfo',
  //   method: 'get',
  //   response: config => {
  //     return {
  //       code: 20000,
  //       data: {
  //         model:['train1','train2'],
  //         inputdata:['voc', 'coco'],
  //         outpath:['/yolo', '/deeplab', '/fastspeech','/yolo', '/deeplab', '/fastspeech']
  //       }
  //     }
  //   }
  // },
  // {
  //   url: '/train/sendTaskInfo',
  //   method: 'get',
  //   response: config => {
  //     let taskdata = config.params
  //     return {
  //       code: 20000,
  //       data: taskdata
  //     }
  //   }
  // }
]
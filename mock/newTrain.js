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
for (let index = 0; index < 20; index++) {
  x.push(index)
  y1.push(parseInt(1000*Math.random()))
  y2.push(parseInt(1000*Math.random()))
  y.push(parseInt(Math.random()+0.1))

}

let tableData = []
for(let i = 0; i < 12; i++){
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
      const {index}=config.query
      return{
        code:20000,
        data:index
      }
    }
  },
  {
    url:'/newtrain/stop',
    type:'post',
    response: config =>{
      const {index}=config.query
      return{
        code:20000,
        data:index
      }
    }
  },
  {
    url:'/newtrain/delete',
    type:'delete',
    response: config =>{
      const {index}=config.query
      return{
        code:20000,
        data:index
      }
    }
  },

  

  {
    url:'/newtrain/search',
    type:'get',
    response: _ =>{
      return{
        code:20000,
        data:'success'
      }
    }
  },

  {
    url:'/newtrain/searchStatus',
    type:'get',
    response: config =>{
      return{
        code:20000,
        data:'seccuss'
      }
    }
  },

  {
    url:'/newtrain/getVisualData',
    type:'get',
    response: config =>{
      const {index} = config.query
      return{
        code:20000,
        data:{
          index,
          epoch:x,
          valAccuaccy:y,
          valLoss:y1,
          trainLoss:y2
        }
      }
    }
  },
  {
    url:'/newtrain/submitTask',
    type:'post',
    response: config =>{
      const {para} = config.query
      return{
        code:20000,
        data:para
      }
    }
  },

  {
    url: '/newtrain/getinitialPara',
    method: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          outpath:['\path1', '\path2']
        }
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
  }
]
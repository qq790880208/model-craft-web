const Mock = require('mockjs') 
let trainLoss = []
let valLoss = []
let valAccuracy = []
let y = []

for(let i = 0; i < 30; i++) {
  let l = parseInt(1000*Math.random())
  let l1 = parseInt(1000*Math.random())
  let l2 = parseInt(1000*Math.random())
  trainLoss.push(l)
  valLoss.push(l1)
  valAccuracy.push(l2)
  y.push(i)
}

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

})

module.exports = [
  // user login
  {
    url: '/train/getVisualData',
    method: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          data:trainLoss,
          data1:valLoss,
          data2:valAccuracy,
          yData:y
        }
      }
    }
  },

  {
    url: '/train/getTableData',
    method: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          'name': '@Tname',
          'status': '@Astatus',
          'num_version': '@Anum_version',
          'RunningTime': '@ARunningTime',
          'startTime': '@date("yyyy-MM-dd")',
          'description': '无',
          'creator': '@Aname',
        }
      }
    }
  },

  {
    url: '/train/getcreateInfo',
    method: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          model:['train1','train2'],
          inputdata:['voc', 'coco'],
          outpath:['/yolo', '/deeplab', '/fastspeech','/yolo', '/deeplab', '/fastspeech']
        }
      }
    }
  },
  {
    url: '/train/sendTaskInfo',
    method: 'get',
    response: config => {
      let taskdata = config.params
      return {
        code: 20000,
        data: taskdata
      }
    }
  }
]
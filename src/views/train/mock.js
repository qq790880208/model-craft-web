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

})




Mock.mock('/train/getTableData','get',{
    'name': '@Tname',
    'status': '@Astatus',
    'num_version': '@Anum_version',
    'RunningTime': '@ARunningTime',
    'startTime': '@date("yyyy-MM-dd")',
    'description': '无',
    'creator': '@Aname', 
})

Mock.mock('/train/getcreateInfo','get',{
    model:['train1','train2'],
    inputdata:['voc', 'coco'],
    outpath:['/yolo', '/deeplab', '/fastspeech','/yolo', '/deeplab', '/fastspeech']
})

Mock.mock('/train/getVisualData','get',{
    data: [820, 932, 901, 934, 1290, 1330, 1320,1500,987,369,147,963],
    data1: [820, 932, 901, 934, 1290, 1330, 1320,1500,987,369,147,963],
    data2: [20, 32, 01, 34, 290, 330, 320,50,87,69,47,63],
    yData:[1,2,3,4,5,6,7,8,9,10,11,12]
    
})


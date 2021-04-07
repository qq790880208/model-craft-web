<template>
<div class="folder-container">
    <el-row>
        <el-col :span="12">
            <el-form>
            <el-form-item label="请选择桶:">
                <el-radio-group v-model="bucket" @change="choosebucket">
                    <el-radio-button :label="item.name" :key="item.name" v-for="item in list">{{item.name}}</el-radio-button>
                </el-radio-group>
            </el-form-item> 
        </el-form>
        </el-col>
        <el-col :span="12">
            <el-button plain round @click="createbucketmsg">创建桶</el-button>
            <el-button plain round @click="removebucketmsg">删除桶</el-button>
            <el-button plain round @click="uploadobjectmsg">上传文件</el-button>
            <el-button plain round @click="">删除文件</el-button>
        </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
        <el-button icon="el-icon-upload2" circle @click="returnOldCurrentRow"></el-button>
        <el-divider direction="vertical"></el-divider>
        <el-tag type="info" effect="light">当前路径：{{bucket}} ：{{objectcurrentRow}}</el-tag>
    </el-row> 
    <el-divider></el-divider>
    <el-row>
        <el-table  :data="objectData" highlight-current-row @row-click="listbyPrefix">
            <el-table-column prop="name" label="对象名"></el-table-column>
        </el-table>
    </el-row>
    
    <!--上传文件dialog-->
    <el-dialog title="上传文件" :visible.sync="uploadObjectVisible">
            <el-button-group>
                <el-button type="primary" @click="choosefolder = true">选择上传路径</el-button>
                <el-button>{{uploadBucketName}} : {{uploadObjectFolder}}</el-button>
            </el-button-group>
            </el-col>
        <el-dialog width="30%" title="选择路径" :visible.sync="choosefolder" append-to-body>
            <el-form>
                <el-form-item label="请选择桶:">
                    <el-radio-group v-model="uplbucket" @change="chooseuplbucket">
                        <el-radio-button :label="item.name" :key="item.name" v-for="item in list">{{item.name}}</el-radio-button>
                    </el-radio-group>
                </el-form-item> 
            </el-form>
        <el-divider></el-divider>
        <el-row>
            <el-button icon="el-icon-upload2" circle @click="returnOlduplCurrentRow"></el-button>
            <el-divider direction="vertical"></el-divider>
            <el-tag type="info" effect="light">当前路径：{{uplbucket}} ：{{objectuplcurrentRow}}</el-tag>
        </el-row> 
        <el-table :data="objectuplData" highlight-current-row @row-click="upllistbyPrefix">
            <el-table-column prop="name" label="请选择上传位置"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="returnNull">取 消</el-button>
            <el-button type="primary" @click="returnuplFolder">确定</el-button>
        </div>
        </el-dialog>
        <el-divider></el-divider>
            <el-upload>
                <el-button>选择文件</el-button>
            </el-upload>
        <el-divider></el-divider>
        <el-input placeholder="请输入文件名" v-model="uploadobjectName" clearable>
            <template slot="prepend">文件名：</template>
        </el-input>
        <div slot="footer" class="dialog-footer">
            <el-button @click="uploadObjectVisible = false">取 消</el-button>
            <el-button type="primary" @click="">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import{ listBucket,listObject,listObjectByPrefix,createBucket,removeBucket,removeFile } from '@/api/dataManagement'
export default {
    data(){
        return{
            bucket:'',//双向绑定已选择的bucket
            list:[],//bucket radio的数据
            objectData:[],//object table的数据
            objectcurrentRow:'',//页面显示的当前路径
            objectPrefix:'',//后端调用的路径
            oldCurrentRow:'',//上一级目录
            oldObjectPrefix:'',//后端调用的上级目录
            uploadObjectVisible:false,//上传文件dialog框信号
            uplbucket:'',//上传对象bucket
            objectuplData:[],//上传对象列表
            objectuplcurrentRow:'',//页面显式的上传路径
            objectuplPrefix:'',//后端调用的上传路径
            olduplCurrentRow:'',//上传的上一级目录
            oldObjectuplPrefix:'',//上传的后端调用上级目录
            choosefolder: false,
            selectBucketName:'',//内层dialog选中的bucket
            selectObjectFolder:'',//内层dialog选中的目录
            uploadBucketName:'',//上传目标桶
            uploadObjectFolder:'',//上传目标路径
            uploadobjectName:'',//上传文件名
        }
    },

    created (){
        this.bucketlist()
    },

    methods : {

        fresh(){//刷新
            location. reload()
        },

        suc(){//成功提醒
            this.$message({
                message: '成功',
                type: 'success'
            })
        },
        fai(){//失败提醒
            this.$message.error('发生错误');
        },
        
        //获取bucketlist
        bucketlist(){
            listBucket().then(response=>{
            this.list = response.data}).catch(()=>{})
        },

        //选bucket
        choosebucket(val){
            this.objectData=[]
            const para = {bucketName : val}
            console.log(para);
            this.objectlist(para);
        },

        //根据bucket列object
        objectlist(para){
            listObject(para).then(response=>{
                if(response){
                    console.log(response);
                    this.objectData = response.data
                }else{
                }
            }).catch()
        },

        //根据object前缀递归列object
        listbyPrefix(row,event,column){
            console.log(row.name);
            const para={}
            if("/"==((row.name.split("").reverse().join("")).substring(0,1)).split("").reverse().join("")){
                console.log("isdir");
                this.objectcurrentRow = row.name;
                console.log(row.name.substring(0,row.name.length-1));
                this.objectPrefix = row.name.substring(0,row.name.length-1)
                para.bucketName = this.bucket
                para.objectPrefix = this.objectPrefix
                console.log(para);
                this.listObject(para)
                // this.oldCurrentRow = this.objectPrefix.split("").reverse().indexOf("/") 逆置然后求出第一个/在第几个位置 
                this.oldObjectPrefix = this.objectPrefix.substring(0,this.objectPrefix.length-this.objectPrefix.split("").reverse().indexOf("/")-1)
                this.oldCurrentRow = this.objectPrefix.substring(0,this.objectPrefix.length-this.objectPrefix.split("").reverse().indexOf("/"))
            }else{
                console.log("isnotdir");
            }
        },

        //更新objectData的值
        listObject(para){
            listObjectByPrefix(para).then(response=>{
                this.objectData = response.data
            }).catch(error=>{console.log(error);})
        },

        //返回上一级
        returnOldCurrentRow(){
            console.log("start");
            console.log(this.bucket);
            console.log(this.oldCurrentRow);
            console.log(this.oldObjectPrefix);
            const para={}
            para.bucketName = this.bucket;
            para.objectPrefix = this.oldObjectPrefix;
            console.log(para);
            this.listObject(para)
            this.objectcurrentRow = this.oldCurrentRow
            this.objectPrefix = this.oldObjectPrefix
            this.oldCurrentRow = this.objectPrefix.substring(0,this.objectPrefix.length-this.objectPrefix.split("").reverse().indexOf("/"))
            this.oldObjectPrefix = this.objectPrefix.substring(0,this.objectPrefix.length-this.objectPrefix.split("").reverse().indexOf("/")-1)
        },

        //创建桶的点击事件
        createbucketmsg(){
            this.$prompt('请输入桶名', '新建存储桶', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                console.log(value);
                const para = {bucketName : value}
                this.createBucket(para)
                this.fresh()
            }).catch(() => {
                    });       
        },

        //后端创建一个存储桶
        createBucket(para){
            createBucket(para).then(response=>{
                if(20000 == response.code){
                    this.suc()
                }else{
                    this.fai()
                }
            })
        },

        //删除桶的点击事件
        removebucketmsg(){
            this.$prompt('请输入桶名', '删除存储桶', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                console.log(value);
                const para = {bucketName : value}
                this.removeBucket(para)
                this.fresh();
            }).catch(() => {
                    }); 
        },

        //后端删除一个桶
        removeBucket(para){
            removeBucket(para).then(response=>{
                if(20000 == response.code){
                    this.suc()
                }else{
                    this.fai()
                }
            })
        },

        //上传文件点击事件
        uploadobjectmsg(){
            this.uploadObjectVisible=true
        },

        //选择上传对象的bucket
        chooseuplbucket(val){
            this.objectuplData=[]
            const para = {bucketName : val}
            console.log(para);
            this.objectupllist(para);
        },

        //上传对象的object列表数据,更新上传列表
        objectupllist(para){
            listObject(para).then(response=>{
                if(response){
                    console.log(response);
                    this.objectuplData = response.data
                }else{
                }
            }).catch()
        },

        //根据前缀名递归列上传object列表
        upllistbyPrefix(row,event,column){
            console.log(row.name);
            const para={}
            if("/"==((row.name.split("").reverse().join("")).substring(0,1)).split("").reverse().join("")){
                console.log("isdir");
                this.objectuplcurrentRow = row.name;
                console.log(row.name.substring(0,row.name.length-1));
                this.objectuplPrefix = row.name.substring(0,row.name.length-1)
                para.bucketName = this.uplbucket
                para.objectPrefix = this.objectuplPrefix
                console.log(para);
                this.listuplObject(para)
                // this.oldCurrentRow = this.objectPrefix.split("").reverse().indexOf("/") 逆置然后求出第一个/在第几个位置 
                this.oldObjectuplPrefix = this.objectuplPrefix.substring(0,this.objectuplPrefix.length-this.objectuplPrefix.split("").reverse().indexOf("/")-1)
                this.olduplCurrentRow = this.objectuplPrefix.substring(0,this.objectuplPrefix.length-this.objectuplPrefix.split("").reverse().indexOf("/"))
            }else{
                console.log("isnotdir");
            }
            this.selectBucketName=this.uplbucket;
            this.selectObjectFolder=row.name;

        },

        //更新objectuplData的值
        listuplObject(para){
            listObjectByPrefix(para).then(response=>{
                this.objectuplData = response.data
            }).catch(error=>{console.log(error);})
        },

        //上传的返回上一级事件
        returnOlduplCurrentRow(){
            console.log(this.uplbucket);
            console.log(this.olduplCurrentRow);
            console.log(this.oldObjectuplPrefix);
            const para={}
            para.bucketName = this.uplbucket;
            para.objectPrefix = this.oldObjectuplPrefix;
            console.log(para);
            this.listuplObject(para)
            this.objectuplcurrentRow = this.olduplCurrentRow
            this.objectuplPrefix = this.oldObjectuplPrefix
            this.olduplCurrentRow = this.objectuplPrefix.substring(0,this.objectuplPrefix.length-this.objectuplPrefix.split("").reverse().indexOf("/"))
            this.oldObjectuplPrefix = this.objectuplPrefix.substring(0,this.objectuplPrefix.length-this.objectuplPrefix.split("").reverse().indexOf("/")-1)
        },

        //返回内层dialog
        returnuplFolder(){
            this.uploadBucketName=this.selectBucketName
            this.uploadObjectFolder=this.selectObjectFolder
            this.choosefolder = false
        },

        //清空内层dialog返回值
        returnNull(){
            this.uploadBucketName=''
            this.uploadObjectFolder=''
            this.choosefolder = false
        },
    }

}
</script>

<style scoped>
.folder-container{
    width: 100%;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
}


</style>
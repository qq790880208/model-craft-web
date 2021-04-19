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
            <el-button plain round @click="removeobjectmsg">删除文件</el-button>
        </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
        <el-button icon="el-icon-upload2" type="text" @click="returnOldCurrentRow">返回上级</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button-group>
            <el-button plain>当前路径：{{bucket}} ：{{objectcurrentRow}}</el-button>
            <el-button  icon="el-icon-folder-add" @click="addFolder">创建文件夹</el-button>
            <el-button  icon="el-icon-folder-remove" @click="remFolder">删除文件夹</el-button>
        </el-button-group>
    </el-row> 
    <el-divider></el-divider>
    <el-row>
        <el-table  :data="objectData" highlight-current-row @row-click="listbyPrefix" @row-contextmenu="rightClick" >
            <el-table-column prop="name" label="对象名"></el-table-column>
        </el-table>
        <div v-show="rightClickMenuVisible">
            <ul id="menu" class="menu">
                <li class="menu__item" @click="downLoadObject">下载</li>
                <li class="menu__item" @click="renameObject">重命名</li>
                <li class="menu__item" @click="copyObject">拷贝</li>
                <li class="menu__item" @click="deleteObject">删除</li>
            </ul>
        </div>
    </el-row>
    
    <!--上传文件dialog-->
    <el-dialog title="上传文件" :visible.sync="uploadObjectVisible">
            <el-button-group>
                <el-button type="primary" @click="choosefolder = true">选择上传路径</el-button>
                <el-button>{{uploadBucketName}} : {{uploadObjectFolder}}</el-button>
            </el-button-group>
        <el-dialog width="30%" title="选择路径" :visible.sync="choosefolder" append-to-body :show-close="false">
            <el-form>
                <el-form-item label="请选择桶:">
                    <el-radio-group v-model="uplbucket" @change="chooseuplbucket">
                        <el-radio-button :label="item.name" :key="item.name" v-for="item in list">{{item.name}}</el-radio-button>
                    </el-radio-group>
                </el-form-item> 
            </el-form>
        <el-divider></el-divider>
        <el-row>
            <el-button icon="el-icon-upload2" type="text"  @click="returnOlduplCurrentRow">返回上级</el-button>
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
            <el-upload
                class="upload"
                ref="upload"
                action="string"
                :file-list="fileList"
                :auto-upload="false"
                :http-request="uplFile"
                :on-change="handleChange"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                multiple="multiple">
                <el-button slot="trigger" size="small" type="primary" @click="delFile">选取文件</el-button>
            </el-upload>
        <el-divider></el-divider>
        <el-input placeholder="请输入文件名" v-model="uploadobjectName" clearable>
            <template slot="prepend">文件名：</template>
        </el-input>
        <div slot="footer" class="dialog-footer">
            <el-button @click="uploadObjectVisible = false">取 消</el-button>
            <el-button type="primary" @click="uploadObject">确 定</el-button>
        </div>
    </el-dialog>

    <!--删除文件dialog-->
    <el-dialog title="删除文件" :visible.sync="removefileVisible">
        <el-button-group>
                <el-button type="primary" @click="removefolder = true">选择删除文件</el-button>
                <el-button>{{removeBucketName}} : {{removeObjectFolder}} : {{removeObjectName}}</el-button>
        </el-button-group>
        <el-dialog width="30%" title="选择路径" :visible.sync="removefolder" append-to-body :show-close="false">
            <el-form>
                <el-form-item label="请选择桶:">
                    <el-radio-group v-model="delbucket" @change="choosedelbucket">
                        <el-radio-button :label="item.name" :key="item.name" v-for="item in list">{{item.name}}</el-radio-button>
                    </el-radio-group>
                </el-form-item> 
            </el-form>
        <el-divider></el-divider>
        <el-row>
            <el-button icon="el-icon-upload2" type="text"  @click="returnOlddelCurrentRow">返回上级</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-tag type="info" effect="light">当前路径：{{delbucket}} ：{{objectdelcurrentRow}}</el-tag>
        </el-row> 
        <el-table :data="objectdelData" highlight-current-row @row-click="dellistbyPrefix">
            <el-table-column prop="name" label="请选择文件"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="returndelNull">取 消</el-button>
            <el-button type="primary" @click="returndelFolder">确定</el-button>
        </div>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
            <el-button @click="removefileVisible = false">取 消</el-button>
            <el-button type="primary" @click="removeObject">确 定</el-button>
        </div>
    </el-dialog>

    <!--删除文件夹-->
    <el-dialog title="删除文件夹" :visible.sync="remFolderVisible" width="30%" >
        {{bucket}} ：{{objectcurrentRow}}
        <el-divider></el-divider>
        <el-form>
            <el-form-item label="选择文件夹:">
                <el-radio-group v-model="folder" @change="chooseremFolder">
                    <el-radio-button :label="item.name" :key="item.name" v-for="item in folders">{{item.name}}</el-radio-button>
                </el-radio-group>
            </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="remFolderVisible=false">取 消</el-button>
            <el-button type="primary" @click="delFol">确 定</el-button>
        </div>
    </el-dialog>

    <!--右键重命名弹出框-->
    <el-dialog title="重命名" :visible.sync="renameVisible" width="30%" >
        <el-input v-model="objectNewName" placeholder="请输入新文件名" clearable>
            <template slot="append">{{postfix}}</template>
        </el-input>
        <div slot="footer" class="dialog-footer">
            <el-button @click="renameVisible=false">取 消</el-button>
            <el-button type="primary" @click="renameFile">确 定</el-button>
        </div>
    </el-dialog>

    <!--拷贝弹出框-->
    <el-dialog title="拷贝" :visible.sync="copyVisible">
        <el-button-group>
            <el-button icon="el-icon-folder" size="medium">源文件</el-button>
            <el-button size="medium">{{bucket}}:</el-button>
            <el-button size="medium" v-show="objectcurrentRow">{{objectcurrentRow}}</el-button>
            <el-button size="medium">{{copyNameOrg}}</el-button>
        </el-button-group>
        <el-divider></el-divider>
        <el-button-group>
            <el-button icon="el-icon-folder" size="medium" @click="copyFolder">目标路径</el-button>
            <el-button size="medium" v-show="copyBucketName">{{copyBucketName}}:</el-button>
            <el-button size="medium" v-show="copyObjectRow">{{copyObjectRow}}</el-button>
            <el-button size="medium" v-show="copyName">{{copyName}}</el-button>
        </el-button-group>
        <el-dialog width="30%" title="选择路径" :visible.sync="copyFolderVisible" append-to-body :show-close="false">
            <el-form>
                <el-form-item label="请选择桶:">
                    <el-radio-group v-model="copyBucket" @change="choosecopybucket">
                        <el-radio-button :label="item.name" :key="item.name" v-for="item in list">{{item.name}}</el-radio-button>
                    </el-radio-group>
                </el-form-item> 
            </el-form>
        <el-divider></el-divider>
        <el-row>
            <el-button icon="el-icon-upload2" type="text"  @click="returnOldcopyCurrentRow">返回上级</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-tag type="info" effect="light">当前路径：{{copyBucket}} ：{{objectcopycurrentRow}}</el-tag>
        </el-row> 
        <el-table :data="objectcopyData" highlight-current-row @row-click="copylistbyPrefix">
            <el-table-column prop="name" label="请选择上传位置"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="returnCopyNull">取 消</el-button>
            <el-button type="primary" @click="returnCopyFolder">确定</el-button>
        </div>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
            <el-button @click="returnCopyCancel">取 消</el-button>
            <el-button type="primary" @click="returnCopy">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import{ listBucket,listObject,listObjectByPrefix,createBucket,removeBucket,removeFile,upload,createFolder,listFolder,fileRename,fileURL,fileCopy } from '@/api/oss'
import request from "@/utils/request"
export default {
    data(){
        return{
            bucket:'modelcraft',//双向绑定已选择的bucket(默认值设为modelcraft)
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
            uploadFile:'',//要给后端的文件
            uploadFilesignal:false,//上传文件判断信号
            removefileVisible:false,//删除文件dialog框信号
            removefolder:false,//删除文件路径dialog框信号
            delbucket:'',//删除文件bucket
            objectdelData:[],//删除文件列表
            objectdelcurrentRow:'',//页面显示的删除路径
            objectdelPrefix:'',//后端调用的删除路径
            oldObjectdelPrefix:'',//删除文件后端调用的上级目录
            olddelCurrentRow:'',//删除的上一级目录
            delsignal:false,//是否选择文件
            selectremBucketName:'',//选择删除文件的桶名
            selectremObjectFolder:'',//选择删除文件的总路径（前缀+名称）
            removeBucketName:'',//传给后端的删除桶名
            removeObjectFolder:'',//传给后端的删除前缀
            removeObjectName:'',//传给后端的文件名
            fileList: [],
            multiple: true,
            formData: "",
            remFolderVisible:false,//删除文件夹dialog框
            folder:'',//选择的folder
            folders:[],//folder列表
            delfolder:'',//要删除的文件夹
            rightClickMenuVisible:false,//右键菜单信号
            rightName:'',//右键选中的行
            renameVisible:false,//重命名弹出框信号
            objectNewName:'',//文件重命名的新名字
            postfix:'',//重命名文件的后缀与之前保持一致
            copyVisible:false,//拷贝文件的弹出框信号
            copyNameOrg:'',//拷贝的原文件名
            copyBucket:'',//拷贝文件的目标桶
            copyObjectRow:'',//拷贝文件的目标路径
            copyName:'',//拷贝文件的新名称
            copyFolderVisible:false,//拷贝文件选择性目标路径框信号
            objectcopyData:'',//拷贝文件对象列表
            objectcopycurrentRow:'',//拷贝文件的当前显示列表
            objectcopyPrefix:'',//拷贝文件的后端调用
            oldObjectcopyPrefix:'',//拷贝文件的上一级前缀名
            oldcopyCurrentRow:'',//拷贝文件的上级目录
            copysignal:false,//拷贝的选择具体文件信号控制
            copyBucketName:''//拷贝的目标桶名
        }
    },

    created (){
        this.bucketlist()
        this.choosebucket("modelcraft")//(默认值设为modelcraft)
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
            this.objectcurrentRow=''
            this.objectPrefix=''
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
            if(this.oldCurrentRow==this.oldObjectPrefix){
                this.oldCurrentRow=''
                this.oldObjectPrefix=''
                this.objectcurrentRow=''
                this.objectPrefix=''
            }
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
            if(this.olduplCurrentRow==this.oldObjectuplPrefix){
                this.olduplCurrentRow=''
                this.oldObjectuplPrefix=''
                this.objectuplcurrentRow=''
                this.objectuplPrefix=''
                this.selectObjectFolder=''
            }
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

        delFile() {
        this.fileList = [];
        },
        handleChange(file, fileList) {
            this.fileList = fileList;
        },
        uplFile(file) {
        this.formData.append("file", file.file);
        },
        handleRemove(file, fileList) {
        console.log(file, fileList);
        },
        handlePreview(file) {
        console.log(file);
        },

        uploadObject() {
        let formData = new FormData();
        formData.append("bucketName", this.uploadBucketName);
        formData.append("folderName", this.uploadObjectFolder);
        formData.append("file", this.fileList[0].raw);
        formData.append("objectName", this.uploadobjectName);
            return request({
            url: "http://localhost:8089/minio-service/upload",
            method: "post",
            data: formData,
            headers: {
            "Content-Type": "multipart/form-data;charset=utf-8"
            }
        }).then(response => {
            if(20000 == response.code){
                    this.suc()
                    this.uploadObjectVisible = false
                }else{
                    this.fai()
                }
        })
        .catch(err => {console.log(err);})
        this.fresh()
    },

        //返回内层dialog
        returnuplFolder(){
            if(this.selectBucketName==''){this.selectBucketName=this.uplbucket}
            this.uploadBucketName=this.selectBucketName
            this.uploadObjectFolder=this.selectObjectFolder
            this.choosefolder = false
        },

        //清空内层dialog返回值
        returnNull(){
            this.uploadBucketName=''
            this.uploadObjectFolder=''
            this.uplbucket=''
            this.objectuplcurrentRow=''
            this.objectuplData=[]
            this.choosefolder = false
        },

        //删除文件点击事件
        removeobjectmsg(){
            this.removefileVisible = true
        },

        //选择删除文件的bucket
        choosedelbucket(val){
            this.objectdelData=[]
            this.objectdelcurrentRow=''
            const para = {bucketName : val}
            console.log(para);
            this.objectdellist(para);
        },

        //删除文件的列表
        objectdellist(para){
            listObject(para).then(response=>{
                if(response){
                    console.log(response);
                    this.objectdelData = response.data
                }else{
                }
            }).catch()
        },

        dellistbyPrefix(row,event,column){
            console.log(row.name);
            const para={}
            if("/"==((row.name.split("").reverse().join("")).substring(0,1)).split("").reverse().join("")){
                console.log("isdir");
                this.delsignal=false //未选择文件
                this.objectdelcurrentRow = row.name;
                console.log(row.name.substring(0,row.name.length-1));
                this.objectdelPrefix = row.name.substring(0,row.name.length-1)
                para.bucketName = this.delbucket
                para.objectPrefix = this.objectdelPrefix
                console.log(para);
                this.listdelObject(para)
                // this.oldCurrentRow = this.objectPrefix.split("").reverse().indexOf("/") 逆置然后求出第一个/在第几个位置 
                this.oldObjectdelPrefix = this.objectdelPrefix.substring(0,this.objectdelPrefix.length-this.objectdelPrefix.split("").reverse().indexOf("/")-1)
                this.olddelCurrentRow = this.objectdelPrefix.substring(0,this.objectdelPrefix.length-this.objectdelPrefix.split("").reverse().indexOf("/"))
            }else{
                console.log("isnotdir");
                this.delsignal=true //选到了文件
                this.selectremBucketName=this.delbucket;
                this.selectremObjectFolder=row.name;
            }
        },

        //更新objectdelData的值
        listdelObject(para){
            listObjectByPrefix(para).then(response=>{
                this.objectdelData = response.data
            }).catch(error=>{console.log(error);})
        },

        //删除的返回上一级事件
        returnOlddelCurrentRow(){
            if(this.olddelCurrentRow==this.oldObjectdelPrefix){
                this.olddelCurrentRow=''
                this.oldObjectdelPrefix=''
                this.objectdelcurrentRow=''
                this.objectdelPrefix=''
            }
            console.log(this.delbucket);
            console.log(this.olddelCurrentRow);
            console.log(this.oldObjectdelPrefix);
            const para={}
            para.bucketName = this.delbucket;
            para.objectPrefix = this.oldObjectdelPrefix;
            console.log(para);
            this.listdelObject(para)
            this.objectdelcurrentRow = this.olddelCurrentRow
            this.objectdelPrefix = this.oldObjectdelPrefix
            this.olddelCurrentRow = this.objectdelPrefix.substring(0,this.objectdelPrefix.length-this.objectdelPrefix.split("").reverse().indexOf("/"))
            this.oldObjectdelPrefix = this.objectdelPrefix.substring(0,this.objectdelPrefix.length-this.objectdelPrefix.split("").reverse().indexOf("/")-1)
        },

        //返回待删除文件
        returndelFolder(){
            if(this.delsignal==true){
                this.removeBucketName=this.selectremBucketName
                this.removeObjectFolder=this.objectdelPrefix
                this.removeObjectName=this.selectremObjectFolder.substring(this.objectdelcurrentRow.length,this.selectremObjectFolder.length)
                this.delsignal=false
                this.removefolder=false
            }else{
                this.choosefile()
            }
        },

        //提示选择文件进行删除
        choosefile(){
            this.$message.error('请选择文件');
        },

        //关闭并销毁数据
        returndelNull(){
            this.removeBucketName=''
            this.removeObjectFolder=''
            this.removeObjectName=''
            this.delbucket=''
            this.objectdelcurrentRow=''
            this.objectdelData=[]
            this.delsignal=false
            this.removefolder=false
        },

        //删除文件
        removeObject(){
            const para={}
            para.bucketName=this.removeBucketName
            para.folderName=this.removeObjectFolder
            para.objectName=this.removeObjectName
            this.removeobj(para)
            this.removeBucketName=''
            this.removeObjectFolder=''
            this.removeObjectName=''
            this.fresh()
        },

        //后端删除一个文件
        removeobj(para){
            removeFile(para).then(response=>{
                if(20000 == response.code){
                    this.suc()
                }else{
                    this.fai()
                }
            })
        },

        //在目录创建文件夹
        addFolder(){
            this.$prompt(this.bucket+':'+this.objectcurrentRow, '新建文件夹', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder:'请输入文件夹名'
            }).then(({ value }) => {
                console.log(this.objectcurrentRow+value);
                const para={}
                para.bucketName=this.bucket
                para.objectName=this.objectcurrentRow+value
                this.createfolder(para)
                this.fresh()
            }).catch(() => {
                    });      
        },

        //后端新建一个文件夹
        createfolder(para){
            createFolder(para).then(response=>{
                if(20000 == response.code){
                    this.suc()
                }else{
                    this.fai()
                }
            })
        },

        //在目录删除文件夹
        remFolder(){
            this.remFolderVisible=true
            console.log(this.bucket);
            console.log(this.objectPrefix);
            const para={}
            para.bucketName=this.bucket
            para.objectPrefix=this.objectPrefix
            this.listFolders(para)
        },
        listFolders(para){
            listFolder(para).then(response=>{
                if(response.message=="nofolder"){
                    this.choofolder()
                }
            this.folders = response.data}).catch(()=>{})
        },
        chooseremFolder(val){
            this.delfolder=val;
        },
        delFol(){
            const para={}
            para.bucketName=this.bucket
            para.objectName=this.objectcurrentRow+this.delfolder
            this.removeobj(para)
            this.remFolderVisible=false
            this.fresh()
        },
        choofolder(){
            this.$message.error('该目录下不存在文件夹');
        },

        //右键点击事件
        rightClick(row, event,column) {
            this.rightName=row.name;
            this.rightClickMenuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
            this.rightClickMenuVisible = true; // 显示模态窗口，跳出自定义菜单栏
            var menu = document.querySelector('#menu');
            this.styleMenu(menu);
        },
        // 取消鼠标监听事件 菜单栏
        foo() {
            this.rightClickMenuVisible = false;
            document.removeEventListener('click', this.foo); // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
        },
        styleMenu(menu) {
        if (event.clientX > 1800) {
            menu.style.left = event.clientX - 100 + 'px';
        } else {
            menu.style.left = event.clientX + 1 + 'px';
        }
        document.addEventListener('click', this.foo); // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
        event.preventDefault();
        if (event.clientY > 700) {
            menu.style.top = event.clientY - 30 + 'px';
        } else {
            menu.style.top = event.clientY - 10 + 'px';
        }
        },

        //重命名文件
        renameObject(){
            if("/"==this.rightName.substring(this.rightName.length-1)){
                this.choosefile()
            }else{
                this.renameVisible=true;
                console.log(this.rightName);
                const name=this.rightName.substring(this.objectcurrentRow.length);
                console.log(name);
                this.postfix=name.substring(this.rightName.substring(this.objectcurrentRow.length).indexOf("."));
            }
        },

        //后端重命名
        renameFile(){
            const para={}
                para.bucketName=this.bucket
                para.folderName=this.objectcurrentRow
                para.objectName=this.rightName.substring(this.objectcurrentRow.length)
                para.objectNameNew=this.objectNewName+this.postfix
                console.log(para);
                fileRename(para).then(response=>{
                if(20000 == response.code){
                    this.suc()
                }else{
                    this.fai()
                }
            })
            this.renameVisible=false
        },

        //下载的点击事件
        downLoadObject(){
            console.log(this.bucket);
            console.log(this.rightName);
            const para={}
            para.bucketName=this.bucket
            para.objectName=this.rightName
            console.log(para);
            fileURL(para).then(response=>{
                if(20000 == response.code){
                    this.suc()
                    console.log(response.data);
                }else{
                    this.fai()
                }
            })
        },

        //拷贝的点击事件
        copyObject(){
            if("/"==this.rightName.substring(this.rightName.length-1)){
                this.choosefile()
            }else{
                this.copyVisible=true
            this.copyNameOrg=this.rightName.substring(this.objectcurrentRow.length);
            const para={}
            para.bucketNameOrg=this.bucket
            para.folderNameOrg=this.objectcurrentRow
            para.objectNameOrg=this.copyNameOrg
            console.log(para);
            }
        },

        //拷贝文件的目标路径
        copyFolder(){
            this.copyFolderVisible=true;
        },

        //选择拷贝目标桶
        choosecopybucket(val){
            this.objectcopyData=[]
            const para = {bucketName : val}
            console.log(para);
            this.objectcopylist(para);
        },

        //拷贝对象的object列表数据,更新上传列表
        objectcopylist(para){
            listObject(para).then(response=>{
                if(response){
                    console.log(response);
                    this.objectcopyData = response.data
                }else{
                }
            }).catch()
        },

        copylistbyPrefix(row,event,column){
            console.log(row.name);
            const para={}
            if("/"==((row.name.split("").reverse().join("")).substring(0,1)).split("").reverse().join("")){
                console.log("isdir");
                this.copysignal=true //选择路径
                this.objectcopycurrentRow = row.name;
                console.log(row.name.substring(0,row.name.length-1));
                this.objectcopyPrefix = row.name.substring(0,row.name.length-1)
                para.bucketName = this.copyBucket
                para.objectPrefix = this.objectcopyPrefix
                console.log(para);
                this.listCopyObject(para)
                this.oldObjectcopyPrefix = this.objectuplPrefix.substring(0,this.objectuplPrefix.length-this.objectuplPrefix.split("").reverse().indexOf("/")-1)
                this.oldcopyCurrentRow = this.objectuplPrefix.substring(0,this.objectuplPrefix.length-this.objectuplPrefix.split("").reverse().indexOf("/"))
                this.selectBucketName=this.copyBucket;
                this.selectObjectFolder=row.name;
            }else{
                console.log("isnotdir");
                this.copysignal=false //选择的不是路径
            }
        },

        //更新objectcopyData的值
        listCopyObject(para){
            listObjectByPrefix(para).then(response=>{
                this.objectcopyData = response.data
            }).catch(error=>{console.log(error);})
        },

        //拷贝的返回上级
        returnOldcopyCurrentRow(){
            console.log(this.copyBucket);
            console.log(this.oldcopyCurrentRow);
            console.log(this.oldObjectcopyPrefix);
            if(this.oldcopyCurrentRow==this.oldObjectcopyPrefix){
                this.oldcopyCurrentRow=''
                this.oldObjectcopyPrefix=''
                this.objectcopycurrentRow=''
                this.objectcopyPrefix=''
                this.selectObjectFolder=''
            }
            const para={}
            para.bucketName = this.copyBucket;
            para.objectPrefix = this.oldObjectcopyPrefix;
            console.log(para);
            this.listCopyObject(para)
            this.objectcopycurrentRow = this.oldcopyCurrentRow
            this.objectcopyPrefix = this.oldObjectcopyPrefix
            this.oldcopyCurrentRow = this.objectcopyPrefix.substring(0,this.objectcopyPrefix.length-this.objectcopyPrefix.split("").reverse().indexOf("/"))
            this.oldObjectcopyPrefix = this.objectcopyPrefix.substring(0,this.objectcopyPrefix.length-this.objectcopyPrefix.split("").reverse().indexOf("/")-1)
        },

        //确定拷贝目标路径
        returnCopyFolder(){
            if(this.copysignal==true){
                if(this.selectBucketName==''){this.selectBucketName=this.copyBucket}
                this.copyBucketName=this.selectBucketName
                this.copyObjectRow=this.selectObjectFolder
                this.copyFolderVisible=false
                this.copysignal=false
            }else{
                this.choosedir()
            }
        },

        //提示选择路径进行拷贝
        choosedir(){
            this.$message.error('请选择文件目录');
        },

        //取消拷贝目标路径
        returnCopyNull(){
            this.copyBucketName=''
            this.copyBucket=''
            this.copyObjectRow=''
            this.objectcopycurrentRow=''
            this.objectcopyData=[]
            this.copyFolderVisible = false
            this.copysignal = false
        },

        //确认拷贝
        returnCopy(){
            const para={}
            para.bucketNameOrg=this.bucket
            para.bucketName=this.copyBucketName
            para.folderNameOrg=this.objectcurrentRow
            para.folderName=this.copyObjectRow
            para.objectNameOrg=this.copyNameOrg
            para.objectName=this.copyName
            console.log(para);
            fileCopy(para).then(response=>{
                if(20000 == response.code){
                    this.suc()
                    this.copyBucketName=''
                    this.copyBucket=''
                    this.copyObjectRow=''
                    this.objectcopycurrentRow=''
                    this.objectcopyData=[]
                }else{
                    this.fai()
                    this.copyBucketName=''
                    this.copyBucket=''
                    this.copyObjectRow=''
                    this.objectcopycurrentRow=''
                    this.objectcopyData=[]
                }
            })
            this.copyVisible=false
        },

        //取消拷贝
        returnCopyCancel(){
            this.copyBucketName=''
            this.copyObjectRow=''
            this.copyName=''
            this.copyBucketName=''
            this.copyBucket=''
            this.objectcopycurrentRow=''
            this.objectcopyData=[]
            this.copyVisible=false
        },

        //右键删除
        deleteObject(){
            if("/"==this.rightName.substring(this.rightName.length-1)){
                this.choosefile()
            }else{
            console.log(this.bucket);
            console.log(this.objectcurrentRow);
            console.log(this.rightName.substring(this.objectcurrentRow.length));
            const para={}
            para.bucketName=this.bucket
            para.folderName=this.objectcurrentRow
            para.objectName=this.rightName.substring(this.objectcurrentRow.length)
            this.removeobj(para)
            }
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
.menu__item {
	display: block;
	line-height: 20px;
	text-align: center;
	margin:10px;
	cursor: default;
}
.menu__item:hover{
	color: #FF0000;
}

.menu {
    height: auto;
    width: auto;
    position: fixed;
    font-size: 14px;
    text-align: left;
    border-radius: 10px;
    border: 1px solid #c1c1c1;
    background-color: #ffffff;
}

li:hover {
    background-color: #E0E0E2;
    color: white;
}



</style>
<template>
<div class="folder-container">
    <el-row>
        <el-col :span="16">
            <el-form>
            <el-form-item label="请选择桶:">
                <el-radio-group v-model="bucket" @change="choosebucket">
                    <el-radio-button :label="item.name" :key="item.name" v-for="item in list">{{item.name}}</el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        </el-col>
        <el-col :span="8">
            <el-button plain round @click="createbucketmsg">创建桶</el-button>
            <el-button plain round @click="removebucketmsg">删除桶</el-button>
            <el-button plain round @click="uploadobjectmsg">上传文件</el-button>
        </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
        <el-button icon="el-icon-upload2" type="text" @click="returnOldCurrentRow">返回上级</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button-group>
            <el-button plain class="dir">当前路径：{{bucket}} ：{{objectcurrentRow}}</el-button>
            <el-button  icon="el-icon-folder-add" @click="addFolder">创建文件夹</el-button>
            <el-button  icon="el-icon-folder-remove" @click="remFolder">删除文件夹</el-button>
        </el-button-group>
    </el-row>
    <el-divider></el-divider>
    <el-row>
        <el-table  :data="objectData" highlight-current-row @row-click="listbyPrefix" @row-contextmenu="rightClick" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="对象名"></el-table-column>
        </el-table>
        <div v-show="rightClickMenuVisible">
            <ul id="menu" class="menu">
                <li class="menu__item" @click="downLoadObject">文件外链</li>
                <li class="menu__item" @click="renameObject">重命名</li>
                <li class="menu__item" @click="moveObject">移动</li>
                <li class="menu__item" @click="copyObject">拷贝</li>
                <li class="menu__item" @click="deleteObject">删除</li>
            </ul>
        </div>
    </el-row>
    <el-divider></el-divider>
    <div style="margin-top: 20px">
        <el-row>
        <el-button plain @click="toggleSelection()">取消选择</el-button>
        <el-popconfirm @onConfirm="allDelete" confirmButtonText='好的' cancelButtonText='不用了' icon="el-icon-info" iconColor="red" title="确定删除已选中的内容吗？">
		<el-button plain slot="reference">批量删除</el-button>
		</el-popconfirm>
        <el-button plain @click="allCopy">批量拷贝</el-button>
        <el-button plain @click="allMove">批量移动</el-button>
    </el-row>
    </div>
    <!--上传文件dialog-->
    <el-dialog title="上传文件" :visible.sync="uploadObjectVisible" :close-on-click-modal="false" :destroy-on-close="true"> 
            <el-button-group>
                <el-button type="primary" @click="choosefolder = true">选择上传路径</el-button>
                <el-button class="dir" plain>{{uploadBucketName}} : {{uploadObjectFolder}}</el-button>
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
        <el-table :data="objectuplData" height="250" highlight-current-row @row-click="upllistbyPrefix">
            <el-table-column prop="name" label="请选择上传位置"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="returnNull">取 消</el-button>
            <el-button type="primary" @click="returnuplFolder" >确定</el-button>
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
                multiple="multiple"
                v-loading="uploadLoading"
                element-loading-text="上传中"
                element-loading-spinner="el-icon-loading">
                <el-button slot="trigger" size="small" type="primary" @click="delFile">选取文件</el-button>
            </el-upload>
        <el-divider></el-divider>
        <el-input placeholder="请输入文件名" v-model="uploadobjectName" clearable>
            <template slot="prepend">文件名：</template>
            <template slot="append">{{uploadFilePostfix}}</template>
        </el-input>
        <h5> <font color="#e6a23c">*注：1个文件上传时可自定义命名</font></h5>
        <div slot="footer" class="dialog-footer">
            <el-button @click="uploadObjectNull">取 消</el-button>
            <el-button type="primary" @click="uploadObject">确 定</el-button>
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
        <h5> <font color="#e6a23c">*注：删除时确保文件夹为空</font></h5>
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
            <el-button size="medium" class="dir" plain>{{bucket}}:</el-button>
            <el-button size="medium" v-show="objectcurrentRow" class="dir" plain>{{objectcurrentRow}}</el-button>
            <el-button size="medium" class="dir" plain>{{copyNameOrg}}</el-button>
        </el-button-group>
        <el-divider></el-divider>
        <el-button-group>
            <el-button icon="el-icon-folder" size="medium" @click="copyFolder" type="primary">目标路径</el-button>
            <el-button size="medium" v-show="copyBucketName" class="dir" plain>{{copyBucketName}}:</el-button>
            <el-button size="medium" v-show="copyObjectRow" class="dir" plain>{{copyObjectRow}}</el-button>
            <el-button size="medium" v-show="copyName" class="dir" plain>{{copyName}}</el-button>
        </el-button-group>
        <el-divider></el-divider>
        <el-input v-model="copyName" placeholder="请输入新文件名" clearable>
            <template slot="prepend">重命名文件（可选）:</template>
            <template slot="append">{{copyNameOrg.substring(copyNameOrg.indexOf('.'))}}</template>
        </el-input>
        <h5> <font color="#e6a23c">*注：不输入新文件名将保留原名拷贝</font></h5>
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
            <el-table-column prop="name" label="请选择位置"></el-table-column>
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

    <!--移动弹出框-->
    <el-dialog title="移动" :visible.sync="moveVisible">
        <el-button-group>
            <el-button icon="el-icon-folder" size="medium">源文件</el-button>
            <el-button size="medium" class="dir" plain>{{bucket}}:</el-button>
            <el-button size="medium" v-show="objectcurrentRow" class="dir" plain>{{objectcurrentRow}}</el-button>
            <el-button size="medium" class="dir" plain>{{moveNameOrg}}</el-button>
        </el-button-group>
        <el-divider></el-divider>
        <el-button-group>
            <el-button icon="el-icon-folder" size="medium" @click="moveFolder" type="primary">目标路径</el-button>
            <el-button size="medium" v-show="moveBucketName" class="dir" plain>{{moveBucketName}}:</el-button>
            <el-button size="medium" v-show="moveObjectRow" class="dir" plain>{{moveObjectRow}}</el-button>
        </el-button-group>
        <el-divider></el-divider>
        <el-dialog width="30%" title="选择路径" :visible.sync="moveFolderVisible" append-to-body :show-close="false">
            <el-form>
                <el-form-item label="请选择桶:">
                    <el-radio-group v-model="moveBucket" @change="choosemovebucket">
                        <el-radio-button :label="item.name" :key="item.name" v-for="item in list">{{item.name}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        <el-divider></el-divider>
        <el-row>
            <el-button icon="el-icon-upload2" type="text"  @click="returnOldmoveCurrentRow">返回上级</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-tag type="info" effect="light">当前路径：{{moveBucket}} ：{{objectmovecurrentRow}}</el-tag>
        </el-row>
        <el-table :data="objectmoveData" highlight-current-row @row-click="movelistbyPrefix">
            <el-table-column prop="name" label="请选择位置"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="returnMoveNull">取 消</el-button>
            <el-button type="primary" @click="returnMoveFolder">确定</el-button>
        </div>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
            <el-button @click="returnMoveCancel">取 消</el-button>
            <el-button type="primary" @click="returnMove">确 定</el-button>
        </div>
    </el-dialog>

    <!--批量拷贝弹出框-->
    <el-dialog title="选择目标路径" :visible.sync="multipleCopyVisible">
        <el-button-group>
            <el-button icon="el-icon-folder" size="medium" @click="copyFolder">目标路径</el-button>
            <el-button size="medium" v-show="MultipleCopyBucketName" class="dir" plain>{{MultipleCopyBucketName}}:</el-button>
            <el-button size="medium" v-show="MultipleCopyObjectRow" class="dir" plain>{{MultipleCopyObjectRow}}</el-button>
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
            <el-table-column prop="name" label="请选择位置"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="returnMultipleCopyNull">取 消</el-button>
            <el-button type="primary" @click="returnMultipleCopyFolder">确定</el-button>
        </div>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
            <el-button @click="returnMultipleCopyCancel">取 消</el-button>
            <el-button type="primary" @click="returnMultipleCopy">确 定</el-button>
        </div>
    </el-dialog>

    <!--批量移动弹出框-->
    <el-dialog title="选择目标路径" :visible.sync="multipleMoveVisible">
        <el-button-group>
            <el-button icon="el-icon-folder" size="medium" @click="moveFolder">目标路径</el-button>
            <el-button size="medium" v-show="MultipleMoveBucketName" class="dir" plain>{{MultipleMoveBucketName}}:</el-button>
            <el-button size="medium" v-show="MultipleMoveObjectRow" class="dir" plain>{{MultipleMoveObjectRow}}</el-button>
        </el-button-group>
        <el-dialog width="30%" title="选择路径" :visible.sync="moveFolderVisible" append-to-body :show-close="false">
            <el-form>
                <el-form-item label="请选择桶:">
                    <el-radio-group v-model="moveBucket" @change="choosemovebucket">
                        <el-radio-button :label="item.name" :key="item.name" v-for="item in list">{{item.name}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        <el-divider></el-divider>
        <el-row>
            <el-button icon="el-icon-upload2" type="text"  @click="returnOldmoveCurrentRow">返回上级</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-tag type="info" effect="light">当前路径：{{moveBucket}} ：{{objectmovecurrentRow}}</el-tag>
        </el-row>
        <el-table :data="objectmoveData" highlight-current-row @row-click="movelistbyPrefix">
            <el-table-column prop="name" label="请选择位置"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="returnMultipleMoveNull">取 消</el-button>
            <el-button type="primary" @click="returnMultipleMoveFolder">确定</el-button>
        </div>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
            <el-button @click="returnMultipleMoveCancel">取 消</el-button>
            <el-button type="primary" @click="returnMultipleMove">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import{ listBucket,listObject,listObjectByPrefix,createBucket,removeBucket,removeFile,upload,createFolder,listFolder,fileRename,fileURL,fileCopy,fileMove } from '@/api/oss'
import request from "@/utils/request"
import store from '@/store'
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
            uploadFilePostfix:'',//上传的后缀名
            uploadFilesignal:false,//上传文件判断信号
            uploadLoading:false,//文件上传加载
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
            copyBucketName:'',//拷贝的目标桶名
            multipleSelection:[],//多选选项
            removesignal:0,//批量删除计数
            multipleCopyVisible:false,//批量拷贝弹出框信号
            removeSeleFolder:false,//删除是否选择文件夹
            copySeleFolder:false,//拷贝是否选择文件夹
            MultipleCopyBucketName:'',//批量拷贝的目标桶
            MultipleCopyObjectRow:'',//批量拷贝的目标路径
            multipleCopySignal:0,//批量拷贝计数
            moveVisible:false,//移动弹出框信号
            moveNameOrg:'',//移动文件原名称
            moveFolderVisible:false,//移动文件选择目标路径框信号
            moveBucketName:'',//要移动去的桶名
            moveObjectRow:'',//要移动去的路径
            moveBucket:'',//移动文件的目标桶
            objectmoveData:'',//移动文件对象列表
            movesignal:false,//移动的选择具体文件信号控制
            objectmovecurrentRow:'',//移动文件的当前显示列表
            objectmovePrefix:'',//移动文件的后端调用
            oldObjectmovePrefix:'',//移动文件的上一级前缀名
            oldmoveCurrentRow:'',//移动文件的上级目录
            selectMoveBucketName:'',//内层选中的bucket
            selectMoveObjectFolder:'',//内存选中的路径
            moveSeleFolder:false,//移动是否选择文件夹
            multipleMoveVisible:false,//批量移动弹出框信号
            MultipleMoveBucketName:'',//批量移动的目标桶
            MultipleMoveObjectRow:'',//批量移动的目标路径
            multipleMoveSignal:0,//批量移动计数
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
            //this.$message.error('发生错误');
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
        this.uploadFilePostfix = file.name.substring(file.name.indexOf('.'))
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
        this.uploadLoading=true
        let multFileList = this.fileList
        let multFileListLen = multFileList.length
        let s=0
        console.log(multFileList);
        console.log(multFileListLen);
        if(multFileListLen==1){
            let formData = new FormData();
            formData.append("bucketName", this.uploadBucketName);
            console.log(this.uploadBucketName);
            formData.append("folderName", this.uploadObjectFolder);
            console.log(this.uploadObjectFolder);
            formData.append("file", multFileList[0].raw);
            console.log( multFileList[0].raw);
            formData.append("objectName", this.uploadobjectName);
            console.log(this.uploadobjectName);
            formData.append("userid", store.getters.userid)
            console.log('sssssssssssssssssssssssss')
            console.log(store.getters.uuid)
            formData.append("dataset_id", store.getters.uuid)
            upload(formData).then(response=>{
                if(response.code==20000){
                    this.uploadLoading=false
                    this.suc()
                    this.uploadObjectVisible = false
                    this.choosebucket(this.bucket)
                    this.uploadBucketName=''
                    this.uploadObjectFolder=''
                    this.uploadobjectName=''
                    this.uplbucket=''
                    this.objectuplcurrentRow=''
                    this.objectuplData=[]
                    this.fileList=[]
                    this.uploadFilePostfix=''
                }else{
                    this.uploadLoading=false
                    this.fai()}
            })
        }else{
            for(let i=0;i<multFileListLen;i++){
            let formData = new FormData();
            formData.append("bucketName", this.uploadBucketName);
            console.log(this.uploadBucketName);
            formData.append("folderName", this.uploadObjectFolder);
            console.log(this.uploadObjectFolder);
            formData.append("file", multFileList[i].raw);
            console.log( multFileList[i].raw);
            formData.append("objectName", '');
            formData.append("userid", store.getters.userid)
            console.log('sssssssssssssssssssssssss')
            console.log(store.getters.uuid)
            formData.append("dataset_id", store.getters.uuid)
            upload(formData).then(response=>{
                if(response.code==20000){
                    s++
                    console.log(response);
                    if(s==multFileListLen-1){
                        this.uploadLoading=false
                        this.suc()
                        this.uploadObjectVisible = false
                        this.choosebucket(this.bucket)
                        this.uploadBucketName=''
                        this.uploadObjectFolder=''
                        this.uploadobjectName=''
                        this.uplbucket=''
                        this.objectuplcurrentRow=''
                        this.objectuplData=[]
                        this.fileList=[]
                        this.uploadFilePostfix=''
                    }
                }else{
                    this.uploadLoading=false
                    this.fai()}
            })
        }
        }
    },

    //上传文件的取消键
    uploadObjectNull(){
        this.uploadBucketName=''
        this.uploadObjectFolder=''
        this.uploadobjectName=''
        this.uplbucket=''
        this.objectuplcurrentRow=''
        this.objectuplData=[]
        this.fileList=[]
        this.uploadFilePostfix=''
        this.uploadLoading=false
        this.uploadObjectVisible = false
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

        //提示选择文件进行删除
        choosefile(){
            this.$message.error('请选择文件');
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


        //后端批量删除文件
        removeobjs(para){
            this.removesignal++
            removeFile(para).then(response=>{
                if(20000 == response.code){
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
                }else{
                    this.remFolderVisible=true
                    this.folders = response.data
                }
            }).catch(()=>{})
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
            // this.fresh()
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
                    console.log(response.data);
                    this.download(response.data)
                    // this.$alert(response.data, '文件外链', {
                    //     confirmButtonText: '确定',
                    // });
                }else{
                    this.fai()
                }
            })
        },

        download(href) {
            let eleLink = document.createElement('a')
            eleLink.href = href
            eleLink.click()
            eleLink.remove()
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
                this.oldObjectcopyPrefix = this.objectcopyPrefix.substring(0,this.objectcopyPrefix.length-this.objectcopyPrefix.split("").reverse().indexOf("/")-1)
                this.oldcopyCurrentRow = this.objectcopyPrefix.substring(0,this.objectcopyPrefix.length-this.objectcopyPrefix.split("").reverse().indexOf("/"))
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
            if(this.copyName!=''){this.copyName=this.copyName+this.copyNameOrg.substring(this.copyNameOrg.indexOf('.'))}
            para.objectName=this.copyName
            para.userid=store.getters.userid
            console.log(para);
            fileCopy(para).then(response=>{
                if(20000 == response.code){
                    this.suc()
                    this.copyBucketName=''
                    this.copyBucket=''
                    this.copyObjectRow=''
                    this.objectcopycurrentRow=''
                    this.objectcopyData=[]
                    this.copyName=''
                }else{
                    this.fai()
                    this.copyBucketName=''
                    this.copyBucket=''
                    this.copyObjectRow=''
                    this.objectcopycurrentRow=''
                    this.objectcopyData=[]
                    this.copyName=''
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

        //当选择项发生变化时触发该事件
        handleSelectionChange(val){
            this.multipleSelection = val;
            let data = this.multipleSelection
            let  datalen = data.length;
            for(let i=0;i < datalen ;i++){
                console.log(data[i].name);
                if('/'==data[i].name.substring(data[i].name.length-1)){
                    console.log("is dir");
                    this.removeSeleFolder=true
                    this.copySeleFolder=true
                }
            }
            console.log(this.multipleSelection);
        },

        //取消选中
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);});
            } else {this.$refs.multipleTable.clearSelection();}
        },

        //批量删除
        allDelete(){
            let  multData = this.multipleSelection;
            let  multDataLen = multData.length;
            if(multDataLen<1){
                this.choosefile()
            }else if(this.removeSeleFolder==true){
                this.choosefile()
                this.removeSeleFolder=false
            }else {
                this.removesignal=0
                let s=0
                for(let i = 0; i < multDataLen ;i++){
                    const para={}
                    para.bucketName=this.bucket
                    para.folderName=this.objectcurrentRow
                    para.objectName=multData[i].name.substring(this.objectcurrentRow.length)
                    console.log(para);
                    this.removeobjs(para)
                    s=i
                }
                if(this.removesignal==s+1){
                    this.suc()
                }else{this.fai()}
                s=0
                this.removesignal=0
                this.choosebucket(this.bucket) //刷新到选中桶目录
            }
        },

        //批量拷贝
        allCopy(){
            let  multData = this.multipleSelection;
            let  multDataLen = multData.length;
            if(multDataLen<1){
                this.choosefile()//判断是否选了
            }else if(this.copySeleFolder==true){
                this.choosefile()//判断选的是不是文件
                this.copySeleFolder=false
            }else{
                this.multipleCopyVisible=true
            }
        },

        //返回批量拷贝目标文件路径
        returnMultipleCopyFolder(){
            if(this.copysignal==true){
                if(this.selectBucketName==''){this.selectBucketName=this.copyBucket}
                this.MultipleCopyBucketName=this.selectBucketName
                this.MultipleCopyObjectRow=this.selectObjectFolder
                this.copyFolderVisible=false
                this.copysignal=false
            }else{
                this.choosedir()
            }
        },

        //批量拷贝路径的取消键
        returnMultipleCopyNull(){
            this.MultipleCopyBucketName=''
            this.copyBucket=''
            this.MultipleCopyObjectRow=''
            this.objectcopycurrentRow=''
            this.objectcopyData=[]
            this.copyFolderVisible = false
            this.copysignal = false
        },

        //批量拷贝确认
        returnMultipleCopy(){
            let  multData = this.multipleSelection;
            let  multDataLen = multData.length;
            for(let i = 0; i < multDataLen ;i++){
                const para={}
                para.bucketName=this.MultipleCopyBucketName
                para.folderName=this.MultipleCopyObjectRow
                para.bucketNameOrg=this.bucket
                para.folderNameOrg=this.objectcurrentRow
                para.userid=store.getters.userid
                para.objectNameOrg=multData[i].name.substring(this.objectcurrentRow.length)
                console.log(para);
                this.multipleCopySignal++
                fileCopy(para).then(response=>{
                if(20000 == response.code){
                }else{
                }
            })
            }
            console.log(multDataLen);
            console.log(this.multipleCopySignal);
            if(this.multipleCopySignal==multDataLen){
                this.suc()
                this.multipleCopySignal=0
                this.multipleCopyVisible=false
                const secounds = 100
	            let num = 0
                while(num<=secounds){num++}
                this.fresh()
                num=0
            }else{this.fai()}
        },

        //批量拷贝取消
        returnMultipleCopyCancel(){
            this.MultipleCopyBucketName=''
            this.MultipleCopyObjectRow=''
            this.copyBucket=''
            this.objectcopycurrentRow=''
            this.objectcopyData=[]
            this.multipleCopyVisible=false
        },

        //移动的点击事件
        moveObject(){
            if("/"==this.rightName.substring(this.rightName.length-1)){
                this.choosefile()
            }else{
                this.moveVisible=true
            this.moveNameOrg=this.rightName.substring(this.objectcurrentRow.length);
            const para={}
            para.bucketNameOrg=this.bucket
            para.folderNameOrg=this.objectcurrentRow
            para.objectNameOrg=this.moveNameOrg
            console.log(para);
            }
        },

        //移动
        moveFolder(){
            this.moveFolderVisible=true;
        },

        //移动目标桶
        choosemovebucket(val){
            this.objectmoveData=[]
            const para = {bucketName : val}
            console.log(para);
            this.objectmovelist(para);
        },

        //移动对象的object列表数据,更新上传列表
        objectmovelist(para){
            listObject(para).then(response=>{
                if(response){
                    console.log(response);
                    this.objectmoveData = response.data
                }else{
                }
            }).catch()
        },

        movelistbyPrefix(row,event,column){
            console.log(row.name);
            const para={}
            if("/"==((row.name.split("").reverse().join("")).substring(0,1)).split("").reverse().join("")){
                console.log("isdir");
                this.movesignal=true //选择路径
                this.objectmovecurrentRow = row.name;
                console.log(this.objectmovecurrentRow.substring(0,row.name.length-1));
                this.objectmovePrefix = this.objectmovecurrentRow.substring(0,row.name.length-1)
                para.bucketName = this.moveBucket
                para.objectPrefix = this.objectmovePrefix
                console.log(para);
                this.listMoveObject(para)
                this.oldObjectmovePrefix = this.objectmovePrefix.substring(0,this.objectmovePrefix.length-this.objectmovePrefix.split("").reverse().indexOf("/")-1)
                this.oldmoveCurrentRow = this.objectmovePrefix.substring(0,this.objectmovePrefix.length-this.objectmovePrefix.split("").reverse().indexOf("/"))
                this.selectMoveBucketName=this.moveBucket;
                this.selectMoveObjectFolder=row.name;
            }else{
                console.log("isnotdir");
                this.movesignal=false //选择的不是路径
            }
        },

        //更新objectmoveData的值
        listMoveObject(para){
            listObjectByPrefix(para).then(response=>{
                this.objectmoveData = response.data
            }).catch(error=>{console.log(error);})
        },

        returnOldmoveCurrentRow(){
            console.log(this.moveBucket);
            console.log(this.oldmoveCurrentRow);
            console.log(this.oldObjectmovePrefix);
            if(this.oldmoveCurrentRow==this.oldObjectmovePrefix){
                this.oldmoveCurrentRow=''
                this.oldObjectmovePrefix=''
                this.objectmovecurrentRow=''
                this.objectmovePrefix=''
                this.selectMoveObjectFolder=''
            }
            const para={}
            para.bucketName = this.moveBucket;
            para.objectPrefix = this.oldObjectmovePrefix;
            console.log(para);
            this.listMoveObject(para)
            this.objectmovecurrentRow = this.oldmoveCurrentRow
            this.objectmovePrefix = this.oldObjectmovePrefix
            this.oldmoveCurrentRow = this.objectmovePrefix.substring(0,this.objectmovePrefix.length-this.objectmovePrefix.split("").reverse().indexOf("/"))
            this.oldObjectmovePrefix = this.objectmovePrefix.substring(0,this.objectmovePrefix.length-this.objectmovePrefix.split("").reverse().indexOf("/")-1)
        },

        returnMoveFolder(){
            this.objectmoveData=[]
            this.moveBucket=''
            if(this.movesignal==true){
                if(this.selectMoveBucketName==''){this.selectMoveBucketName=this.moveBucket}
                this.moveBucketName=this.selectMoveBucketName
                this.moveObjectRow=this.selectMoveObjectFolder
                this.moveFolderVisible=false
                this.movesignal=false
            }else{
                this.choosedir()
            }
        },
        returnMoveNull(){
            this.moveBucketName=''
            this.moveBucket=''
            this.moveObjectRow=''
            this.objectmovecurrentRow=''
            this.objectmoveData=[]
            this.moveFolderVisible=false;
            this.movesignal = false
        },
        returnMove(){
            this.moveVisible=false

            const para={}
            para.bucketNameOrg=this.bucket
            para.bucketName=this.moveBucketName
            para.folderNameOrg=this.objectcurrentRow
            para.folderName=this.moveObjectRow
            para.objectNameOrg=this.moveNameOrg
            para.objectName=''
            para.userid=store.getters.userid
            console.log('here:');
            console.log(para);
            fileMove(para).then(response=>{
                if(20000 == response.code){
                    this.suc()
                    this.moveBucketName=''
                    this.moveBucket=''
                    this.moveObjectRow=''
                    this.objectmovecurrentRow=''
                    this.objectmoveData=[]
                }else{
                    this.fai()
                    this.moveBucketName=''
                    this.moveBucket=''
                    this.moveObjectRow=''
                    this.objectmovecurrentRow=''
                    this.objectmoveData=[]
                }
            })
            this.copyVisible=false
        },
        returnMoveCancel(){
            this.moveBucketName=''
            this.moveObjectRow=''
            this.moveName=''
            this.moveBucketName=''
            this.moveBucket=''
            this.objectmovecurrentRow=''
            this.objectmoveData=[]
            this.moveVisible=false
        },

        //批量移动
        allMove(){
            let  multData = this.multipleSelection;
            let  multDataLen = multData.length;
            if(multDataLen<1){
                this.choosefile()//判断是否选了
            }else if(this.moveSeleFolder==true){
                this.choosefile()//判断选的是不是文件
                this.moveSeleFolder=false
            }else{
                this.multipleMoveVisible=true
            }
        },

        //返回批量移动目标文件路径
        returnMultipleMoveFolder(){
            if(this.movesignal==true){
                if(this.selectMoveBucketName==''){this.selectMoveBucketName=this.moveBucket}
                this.MultipleMoveBucketName=this.selectMoveBucketName
                this.MultipleMoveObjectRow=this.selectMoveObjectFolder
                this.moveFolderVisible=false
                this.movesignal=false
            }else{
                this.choosedir()
            }
        },

        //批量移动路径的取消键
        returnMultipleMoveNull(){
            this.MultipleMoveBucketName=''
            this.moveBucket=''
            this.MultipleMoveObjectRow=''
            this.objectmovecurrentRow=''
            this.objectmoveData=[]
            this.moveFolderVisible = false
            this.movesignal = false
        },

        //批量移动确认
        returnMultipleMove(){
            let  multData = this.multipleSelection;
            let  multDataLen = multData.length;
            for(let i = 0; i < multDataLen ;i++){
                const para={}
                para.bucketName=this.MultipleMoveBucketName
                para.folderName=this.MultipleMoveObjectRow
                para.bucketNameOrg=this.bucket
                para.folderNameOrg=this.objectcurrentRow
                para.userid=store.getters.userid
                para.objectNameOrg=multData[i].name.substring(this.objectcurrentRow.length)
                console.log(para);
                this.multipleMoveSignal++
                fileMove(para).then(response=>{
                if(20000 == response.code){
                }else{
                }
            })
            }
            console.log(multDataLen);
            console.log(this.multipleMoveSignal);
            if(this.multipleMoveSignal==multDataLen){
                this.suc()
                this.multipleMoveSignal=0
                this.multipleMoveVisible=false
                const secounds = 100
	            let num = 0
                while(num<=secounds){num++}
                this.fresh()
                num=0
            }else{this.fai()}
        },

        //批量移动取消
        returnMultipleMoveCancel(){
            this.MultipleMoveBucketName=''
            this.MultipleMoveObjectRow=''
            this.moveBucket=''
            this.objectmovecurrentRow=''
            this.objectmoveData=[]
            this.multipleMoveVisible=false
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
	color: #f56c6c;
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
    z-index: 100;
}

li:hover {
    background-color: #f2f6fc;
    color: white;
}

.dir:hover{
    cursor: text
}




</style>
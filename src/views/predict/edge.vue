<template>
  <div>
    <h3>边缘端预测</h3>
    <!-- <el-upload class="upload-demo" :file-list="fileList" drag limit="1" :http-request="uplFile"
  :on-change="handleChange"
  style="width: 350px;" action="string" :auto-upload="false"
  multiple>
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将待预测图片拖到此处，或<em>点击上传</em></div>
  </el-upload> -->
    <el-upload
      ref="upload"
      v-loading="uploadLoading"
      class="upload"
      action="string"
      :file-list="fileList"
      :auto-upload="false"
      :http-request="uplFile"
      :on-change="handleChange"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      multiple="multiple"
      element-loading-text="上传中"
      element-loading-spinner="el-icon-loading" style="width: 400px"
    >
      <el-button slot="trigger" size="small" type="primary" @click="delFile"
        >选取文件</el-button
      >
    </el-upload>
    <el-input
      placeholder="请输入要使用模型的唯一标识"
      v-model="model_uuid"
      clearable
      style="margin-top: 15px; width: 400px"
    />
    <div slot="footer" class="dialog-footer" style="margin-top: 15px">
      <el-button @click="uploadObjectNull">清空</el-button>
      <el-button type="primary" @click="uploadObject">开始预测</el-button>
    </div>
    <el-divider></el-divider>
      <el-input
        type="textarea"
        :autosize="{ minRows: 20, maxRows: 20}"
        placeholder="接口返回内容"
        v-model="textarea1" style="width: 800px;margin-top: 15px">
      </el-input>

      <el-tooltip placement="top">
        <div slot="content">1. post请求/user/login接口获取{token}<br/><br/>
                            2. header中携带X-TOKEN:{token}字段<br/><br/>
                            3. post请求/predict/edge 接口，字段如下：<br/><br/>
                                   String file_base64, //base64编码的图片字符串<br/>
                                   String model_uuid //模型唯一标识号<br/><br/>
                            4. 接口返回内容字段如下：<br/><br/>
                                   String predict_info //标注信息<br/>
                                   String encode_predict_pic, //base64编码的预测结果图片字符串<br/><br/>
        </div>
        <el-button>接口使用</el-button>
      </el-tooltip>
  </div>




</template>

<script>
import { uploadPic } from "@/api/predict";
import store from "@/store";

export default {
  data() {
    return {
      fileList: [],
      model_uuid: "",
      uploadLoading: false, // 文件上传加载
      textarea1: '',
    };
  },

  methods: {
    uploadObjectNull() {
      this.fileList = [];
      this.model_uuid = "";
      this.textarea1 = "";
    },
    uploadObject() {
      if (this.model_uuid == "") this.$message.error("请输入模型唯一标识");
      if (this.fileList.length == 0) this.$message.error("请选择图片文件");

      let formData = new FormData();
      formData.append("file", this.fileList[0].raw);
      formData.append("model_uuid", this.model_uuid);
      console.log(this.fileList);
      uploadPic(formData).then((response) => {
        if (response.code == 20000) {
          this.fileList = [];
          this.textarea1 = "{\n  \"encode_pic\": \"" + response.data.content.encode_pic + "\", " +
                            "\n  \"predict_info\": \"" + response.data.content.predict_info + "\", " +
                            "\n  \"encode_predict_pic\": \"" + response.data.content.encode_predict_pic + "\" " + 
                            "\n }"
        } else {
          this.$message.error("请求失败");
        }
      });
    },
    delFile() {
      this.fileList = [];
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      this.uploadFilePostfix = file.name.substring(file.name.indexOf("."));
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
  },
};
</script>

<style lang='scss' scoped>
.el-row {
  margin-top: 30px;
}
.training-jobs {
  margin-left: 30px;
}
.el-table {
  font-size: 12px;
  width: 100%;
  margin-top: 25px;
}

.el-pagination {
  margin-top: 25px;
}

.scrollbar {
  overflow: auto;
}

.scrollbar::-webkit-scrollbar {
  width: 10px;
  height: 2px;
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.4);
}

.scrollbar::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
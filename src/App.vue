<template>
  <div id="vue" class="container">
      <div class="row">
          <div class="col-sm-5 projects-box">
              <div class="page-header">
                  <h3>项目列表</h3>
              </div>
              <div class="input-group mb20">
                  <input class="form-control" v-model="newFolder" @keyup.enter="addFolder" placeholder="请输入项目所在目录...">
                  <span class="input-group-btn">
                      <button class="btn btn-success" type="submit" @click="addFolder">添加</button>
                  </span>
              </div>

              <folder-item :items=folders :active-index=activeFolder></folder-item>
          </div>

          <div class="project-box col-sm-7">
            <tabs>
              <tab header="文件列表">
                <ul class="breadcrumb">
                    <li><a href="javascript:" data-bind="text:path, click: goRoot"></a></li>
                    <li><a href="javascript:" data-bind="text: name, click: onClick"></a></li>
                </ul>
                <file-item :items=activeFiles></file-item>

              </tab>
              <tab header="设置">
                <tabs nav-style="pills">
                  <tab header="项目设置">
                    <p>如果您的网站是<b>纯静态项目</b>，那么无需任何设置，只要点击文件列表中的网页就能直接使用</p>
                    <hr>
                    <p>
                        如果您的项目使用到了<b>服务器技术</b>（如php），请设置该服务器的域名和端口：
                        <div class="target-host-setter input-group">
                            <input class="form-control" type="text" id="target-host-input"
                                   placeholder="somedomain.com:8080"
                                   data-bind="attr:{value:targetHost}">
                            <div class="input-group-btn">
                                <button class="btn btn-success" type="submit">保存</button>
                                <button class="btn btn-default" data-bind="click: clearTargetHost">清除</button>
                            </div>
                        </div>

                        <p class="text-muted">
                            设定完成之后，访问F5所在域名就相当于访问映射的域名和端口（并加上自动刷新功能）
                        </p>
                    </p>
                    <hr>
                    <p>
                        如果不方便映射，也可以简单粗暴地在网页的&lt;/body&gt;之前插入如下代码来实现自动刷新:
                        <pre>&lt;script src="http://<span data-bind="text:$root.host"></span>/_/js/reloader.js"&gt;&lt;/script&gt;</pre>
                        <span class="text-muted">如果不是本机访问，请修改上述地址的host部分</span>
                    </p>
                  </tab>
                  <tab header="自动编译">
                    <legend>Less</legend>
                        <div class="checkbox">
                            <label>
                                <input type="checkbox" v-model="compileLess"> 开启自动编译
                            </label>
                            <p :class="{
                            'text-success': compileLess,
                            'text-muted': !compileLess
                            }">
                                <i class="glyphicon glyphicon-ok"></i>
                                变更后的.less文件将自动编译为.css文件（同目录）
                            </p>
                        </div>
                  </tab>
                  <tab header="刷新设置">
                    <legend><b>延迟刷新</b></legend>
                        <div class="input-group" id="w150">
                            <span class="input-group-addon">等待</span>
                            <input class="form-control" type="text" v-model="refreshDelay" number>
                            <span class="input-group-addon">秒</span>
                        </div>
                        <p :class="{
                            'text-success': refreshDelay,
                            'text-muted': !refreshDelay
                            }">
                          <i class="glyphicon glyphicon-ok"></i>检测到文件变更以后，会等待一段时间后，再更新样式和内容
                        </p>
                  </tab>
                </tabs>

              </tab>
            </tabs>

          </div>
      </div>
  </div>
</template>


<script>
  import folderItem from './components/FolderItem'
  import fileItem from './components/FileItem'
  import tab from 'vue-strap/src/Tab'
  import tabs from 'vue-strap/src/Tabset'
  export default {
    components: {
      folderItem,
      fileItem,
      tabs,
      tab
    },
    props: {
      folders: Array,
      activeFolder: {
        type: Number,
        default: 0
      },
      activeFiles: Array
    },
    data () {
      return {
        newFolder: '',
        refreshDelay: 0,
        compileLess: false
      }
    },
    methods: {
      addFolder: function () {
        var f = this.newFolder.trim()
        if (f && this.folders.indexOf(f) === -1) {
          this.addFolderArray(f)
        }
      },
      addFolderArray: function (f) {
        this.folders.unshift(f)
        this.newFolder = ''
      }
    },
    events: {
    }
  }
</script>
<style lang="scss">
  .mb20{
    margin-bottom: 20px;
  }
  .project-box{
    padding-top: 45px
  }
  #w150{
    width: 150px;
    .form-control{
      text-align: right;
    }
  }
  .text-muted .glyphicon {
    display: none;
  }
  .text-success .glyphicon{
    margin-right: 3px;
  }
  .project-box p {
    margin-top: 5px;
  }
</style>

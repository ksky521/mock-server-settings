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

              <folder-item :items=folders :active-index=activeFolderIndex></folder-item>
          </div>

          <div class="project-box col-sm-7">
            <tabs>
              <tab header="文件列表">
                <ul class="breadcrumb">
                    <li><a href="javascript:" @click="activeRoot(activeFolder)">{{activeFolder}}</a></li>
                    <li v-for="f in subFolders"><a href="javascript:" @click="activeSubFolder(f)">{{f}}</a></li>
                </ul>
                <file-item :hosts=hosts :sub-folders=subFolders :port=port></file-item>

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
    data () {
      return {
        folders: [],
        hosts: [],
        port: '',
        activeFolder: '',
        activeFolderIndex: 0,
        newFolder: '',
        refreshDelay: 0,
        compileLess: false,
        subFolders: []
      }
    },
    methods: {
      addFolder: function () {
        var f = this.newFolder.trim()
        if (f && this.folders.indexOf(f) === -1) {
          this.$dispatch('sendAddFolder', {
            folder: f
          })
        }
      },
      activeRoot: function (folder) {
        this.subFolders.length = 0
        this.$dispatch('sendSubFolder', {
          curFolder: this.activeFolder,
          newSubFolder: '',
          subFolders: this.subFolders
        })
      },
      activeSubFolder: function (subFolder) {
        subFolder = String(subFolder).trim()
        var index = this.subFolders.indexOf(subFolder)
        this.subFolders.splice(index)
        if (subFolder) {
          this.$dispatch('sendSubFolder', {
            curFolder: this.activeFolder,
            newSubFolder: subFolder,
            subFolders: this.subFolders
          })
        } else {
          alert('错误的路径')
        }
      },
      addFolderArray: function (f) {
        f && this.folders.unshift(f)
      }
    },
    events: {
      receiveFolder: function (j) {
        j.isNew && this.addFolderArray(j.folder)
        this.activeFolder = j.folder
        this.subFolders.length = 0
      },
      subFolderStatus: function (d) {
        this.$broadcast('fileList', d.files)
        if (d.newSubFolder) {
          this.subFolders.push(d.newSubFolder)
        }
      },
      subFolderClick: function (d) {
        this.$dispatch('sendSubFolder', {
          curFolder: this.activeFolder,
          newSubFolder: d,
          subFolders: this.subFolders
        })
      },
      initFolderList: function (d) {
        this.folders = d.folderList
        this.activeFolder = d.curFolder
        this.activeFolderIndex = this.folders.indexOf(d.curFolder)
        this.$broadcast('fileList', d.files)
        this.hosts = d.hosts
        this.port = d.port
      }
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

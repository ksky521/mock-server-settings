<template>
<table class="file-list table table-hover" id="fileList">
  <tbody>
    <tr :class="{
      'muted': isMuted($index)
    }" v-for="item in items">
        <td class="file">
            <a v-if="item.type==='DIR'" href="javascript:;" @click="acitveSubFolder(item.name)" class="icon {{item.type}}">{{item.name}}</a>
            <a v-else href="{{host()+item.name}}" target="_blank" class="icon {{item.type}}">{{item.name}}</a>
        </td>

        <td class="op">
            <div class="op-group">
                <a href="javascript:" class="qrcode glyphicon glyphicon-qrcode"
                   data-toggle="tooltip" title="URL+二维码" @click="showQRCode(item.name)">
                </a>
                <a href="javascript:" class="mute glyphicon glyphicon-ban-circle"
                   data-toggle="tooltip" title="不监听更新" @click="mute($index, item)" :show="isMuted($index)">
                </a>
                <a href="javascript:" class="unmute glyphicon glyphicon-ok-circle"
                   data-toggle="tooltip" title="监听更新" @click="unmute($index, item)" :show="!isMuted($index)">
                </a>
            </div>
        </td>
    </tr>
  </tbody>
</table>
<div id="qrcode-modal" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">

            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3 class="modal-title">二维码URL</h3>
            </div>

            <div class="modal-body">
                <div id="hosts">
                    <div class="input-group">
                        <h4>域名</h4>
                        <select v-model="curHost" class="form-control">
                          <option v-for="host in getHosts()">{{host}}</option>
                        </select>
                    </div>
                </div>
                <div class="clearfix"></div>

                <input id="qrurl-input" class="form-control" type="text" value="{{curHost}}">
                <div id="qrcode"></div>
            </div>

            <div class="modal-footer">
                <a href="javascript:" data-dismiss="modal" class="btn btn-primary">关闭</a>
            </div>

        </div>
    </div>
</div>
</template>

<script>
  export default {
    props: {
      hosts: {
        type: Array,
        default: []
      },
      port: {
        default: '',
        set: function (value) {
          return String(value)
        }
      },
      subFolders: Array
    },
    data () {
      return {
        items: [],
        curUrl: '',
        qrcode: null,
        host: function () {
          var host = 'http://' + this.hosts[0] + (this.port ? (':' + this.port) : '') + '/' + this.subFolders.join('/') + '/'
          return host.replace(/\/\/$/, '/')
        }
      }
    },
    ready: function () {
      this.qrcode = new QRCode(document.getElementById('qrcode'), {
        width: 150,
        height: 150,
        text: ''
      })
    },
    methods: {
      getHosts: function () {
        return this.hosts.map(function (v) {
          var host = 'http://' + v + (this.port ? (':' + this.port) : '') + '/' + this.subFolders.join('/') + '/'
          return host.replace(/\/\/$/, '/')
        }.bind(this))
      },
      acitveSubFolder: function (f) {
        this.$dispatch('subFolderClick', f)
      },
      showQRCode: function (i) {
        this.curUrl = i
        this.qrcode.makeCode(i)
        this.curHost = this.getHosts()[0]
        // console.log(this.curHost)
        $('#qrcode-modal').modal()
      },
      unmute: function (i) {
        this.items[i].isMuted = false
        this.$dispatch('fileAddWatch', this.items[i].name)
      },
      mute: function (i) {
        this.items[i].isMuted = true
        this.$dispatch('fileUnwatch', this.items[i].name)
      },
      isMuted: function (i) {
        return !!this.items[i].isMuted
      }
    },
    events: {
      fileList: function (d) {
        this.items = d
        setTimeout(function () {
          $('[data-toggle="tooltip"]').tooltip()
        }, 0)
      }
    }
  }
</script>
<style lang="scss">
  #fileList tr{
    .op-group{
      display: none;
    }
    &:hover .op-group{
      display: inline-block;
    }
    &.muted .file a{
      opacity: 0.3;
    }
    .file a{
      padding-left: 20px;
    }
    .icon {
      display: inline-block;
      background-repeat: no-repeat;
      background-position: left center;
      background-image: url("../../static/img/file-icons/unknown.png");
    }

    .icon.DIR {
      background-image: url("../../static/img/file-icons/DIR.png");
    }

    .icon.html,
    .icon.htm {
      background-image: url("../../static/img/file-icons/html.png");
    }

    .icon.js,
    .icon.vbs {
      background-image: url("../../static/img/file-icons/js.png");
    }

    .icon.css,
    .icon.less,
    .icon.sass,
    .icon.scss {
      background-image: url("../../static/img/file-icons/css.png");
    }

    .icon.php {
      background-image: url("../../static/img/file-icons/php.png");
    }

    .icon.as3,
    .icon *.fla,
    .icon *.swf {
      background-image: url("../../static/img/file-icons/flash.png");
    }
  }
  #fileList .op{
    width: 70px;
    text-align: right;
    a{
      text-decoration: none;
    }
    a.mute{
      color: #D9534F;
    }
    a.unmute{
      color: #5CB85C;
      display: none;
    }
  }
  #qrcode-modal{
    .input-group {
      width: 400px;
    }
    input[name=url] {
      margin-top: 10px;
      margin-bottom: 20px;
    }
    #hosts, #qrurl-input{
      margin-bottom: 10px;
    }
    #qrcode {
      width: 150px;
      height: 150px;
      margin: 0 auto;
    }
  }

</style>

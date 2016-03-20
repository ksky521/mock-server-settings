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
                   data-toggle="tooltip" title="URL+二维码" @click="showQRCode($index, item)">
                </a>
                <a href="javascript:" class="mute glyphicon glyphicon-ban-circle"
                   data-toggle="tooltip" title="不监听更新" @click="mute($index, item)" :show="item.isMuted">
                </a>
                <a href="javascript:" class="unmute glyphicon glyphicon-ok-circle"
                   data-toggle="tooltip" title="监听更新" @click="unmute($index, item)" :show="!item.isMuted">
                </a>
            </div>
        </td>
    </tr>
  </tbody>
</table>
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
        host: function () {
          return 'http://' + this.hosts[0] + (this.port ? (':' + this.port) : '') + '/' + this.subFolders.join('/')
        }
      }
    },
    methods: {
      acitveSubFolder: function (f) {
        this.$dispatch('subFolderClick', f)
      },
      showQRCode: function (i) {},
      unmute: function (i) {
        this.items[i].isMuted = false
      },
      mute: function (i) {
        this.items[i].isMuted = true
      },
      isMuted: function (i) {
        return !!this.items[i].isMuted
      }
    },
    events: {
      fileList: function (d) {
        this.items = d
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
</style>

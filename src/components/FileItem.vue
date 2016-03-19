<template>
<table class="file-list table table-hover" id="fileList">
  <tbody>
    <tr :class="{
      'muted': !item.isMuted
    }" v-for="item in items">
        <td class="file">
            <a href="{{item.name}}" target="_blank" class="icon {{item.type}}">{{item.name}}</a>
        </td>

        <td class="op">
            <div class="op-group">
                <a href="javascript:" class="qrcode glyphicon glyphicon-qrcode"
                   data-toggle="tooltip" title="URL+二维码" @click="showQRCode($index, item)">
                </a>
                <a href="javascript:" class="mute glyphicon glyphicon-ban-circle"
                   data-toggle="tooltip" title="不监听更新" @click="mute($index, item)">
                </a>
                <a href="javascript:" class="unmute glyphicon glyphicon-ok-circle"
                   data-toggle="tooltip" title="监听更新" @click="unmute($index, item)">
                </a>
            </div>
        </td>
    </tr>
  </tbody>
</table>
</template>

<script>
  export default {
    props: ['items'],
    data () {
      return {}
    },
    methods: {
      showQRCode: function (i) {},
      unmute: function (i) {
        this.items[i].isMuted = false
      },
      mute: function (i) {
        this.items[i].isMuted = true
        console.log(this.items[i])
      }
    },
    events: {
      fileList: function (d) {
        console.log(d)
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

<template>
<table class="file-list table table-hover">
  <tbody>
    <tr :class="{'muted': item.isMuted}" v-for="item in items">
        <td class="file">
            <a :href="{{item.url}}" class="icon" target="_blank" class="icon {{item.type}}">{{item.text}}</a>
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
      return {
      }
    },
    methods: {
      showQRCode: function (i) {},
      unmute: function (i) {
        this.items[i].isMuted = true
      },
      mute: function (i) {
        this.items[i].isMuted = false
      }
    }
  }
</script>

<template>
<modal title="二维码URL" :show.sync="modal" effect="zoom" width="400">
  <div slot="modal-body" class="modal-body">
      <div id="hosts">
        <div class="input-group">
            <span class="input-group-addon">域名</span>
            <input class="form-control" value="{{ host }}">
        </div>
    </div>
    <div class="clearfix"></div>
    <input id="qrurl-input" name="url" class="form-control" type="text" value="{{url}}">
    <div id="qrcode"></div>
  </div>
  <div slot="modal-footer">
    <a href="javascript:" @click="qrcodeModal=true" class="btn btn-primary">关闭</a>
  </div>
</modal>
</template>

<script>
    import modal from 'vue-strap/src/modal'
    export default {
        data () {
            return {
                modal: false,
                host: 'http://127.0.0.1'
            }
        }
    }
</script>

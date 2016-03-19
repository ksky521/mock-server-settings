<template>
    <div id="qrcode-modal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h3 class="modal-title">二维码URL</h3>
                </div>

                <div class="modal-body" data-bind="with:activeProject">
                    <div id="hosts">
                        <div class="input-group">
                            <span class="input-group-addon">域名</span>
                            <input class="form-control" data-bind="value:QRhost, valueUpdate:'keyup'">
                        </div>
                    </div>
                    <div class="clearfix"></div>

                    <!-- ko with: QRCodeFile -->
                    <input id="qrurl-input" name="url" class="form-control" type="text"
                           data-bind="value:QRurl, event:{keyup: $parent.QRUrlChange, change: $parent.QRUrlChange}">
                    <!-- /ko -->

                    <div id="qrcode"></div>
                </div>

                <div class="modal-footer">
                    <a href="javascript:" data-dismiss="modal" class="btn btn-primary">关闭</a>
                </div>

            </div>
        </div>
    </div>
</template>

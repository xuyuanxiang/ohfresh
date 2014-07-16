define([], function () {
    var OhFresh = new Framework7({
        modalTitle: '提示',
        modalButtonOk: '确定',
        modalButtonCancel: '取消',
        modalPreloaderTitle: '加载中...',
        pushState: true,
        smartSelectBackTemplate: '<div class="left sliding"><a href="#" class="back link"><i class="icon icon-back-white"></i><span>{{backText}}</span></a></div>',
        smartSelectBackText: '返回',
        fastClicks: true,
        onAjaxStart: function (xhr) {
            OhFresh.showIndicator();
        },
        onAjaxComplete: function (xhr) {
            OhFresh.hideIndicator();
        }
    });
    OhFresh.addView('.view-main');
    return OhFresh;
});
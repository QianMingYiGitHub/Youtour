var util = require('util');
var Promise = require('promise');
var app = {};
var base_config = require('./config');
var Wechat = require('./wechat');
app.homework = {
    apptype: 1,
    name: '作业通知',
    path: ''
};
app.activity = {
    apptype: 2,
    name: '活动通知',
    path: ''
};
app.behavior = {
    apptype: 3,
    name: '日常表现',
    path: ''
};
app.questionnair = {
    apptype: 4,
    name: '问卷调查',
    path: ''
};

exports.getAppType = function (appname) {
    if (util.isNullOrUndefined(app[appname])) {
        return null;
    }
    return app[appname].apptype;
};

exports.getSupportAppList = function () {
    return [
        {
            apptype: 1,
            name: '作业通知',
            path: '',
            key: 'homework'
        },
        {
            apptype: 2,
            name: '活动通知',
            path: '',
            key: 'activity'
        },
        {
            apptype: 3,
            name: '日常表现',
            path: '',
            key: 'behavior'
        },
        {
            apptype: 4,
            name: '问卷调查',
            path: '',
            key: 'questionnair'
        }
    ];
};
function createHomeworkMenu(corpId, appid, api) {
    var menuurl = {};
    menuurl.add_homework = api.getAuthorizeURL(base_config.getURL() + 'homework/add_homework?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.closed_homework = api.getAuthorizeURL(base_config.getURL() + 'homework/closed_homework?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.published_homework = api.getAuthorizeURL(base_config.getURL() + 'homework/published_homework?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.draft_homework = api.getAuthorizeURL(base_config.getURL() + 'homework/draft_homework?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.noread_homework = api.getAuthorizeURL(base_config.getURL() + 'homework/noread_homework?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.readed_homework = api.getAuthorizeURL(base_config.getURL() + 'homework/readed_homework?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    var menu = {
        'button': [
            {
                'name': '新建作业',
                'type': 'view',
                'url': menuurl.add_homework
            },
            {
                'name': '我发起的',
                'sub_button': [
                    {
                        'type': 'view',
                        'name': '已关闭',
                        'url': menuurl.closed_homework
                    },
                    {
                        'type': 'view',
                        'name': '已提交',
                        'url': menuurl.published_homework
                    },
                    {
                        'type': 'view',
                        'name': '草稿',
                        'url': menuurl.draft_homework
                    }
                ]
            },
            {
                'name': '我参与的',
                'sub_button': [
                    {
                        'type': 'view',
                        'name': '未阅',
                        'url': menuurl.noread_homework
                    },
                    {
                        'type': 'view',
                        'name': '已阅',
                        'url': menuurl.readed_homework
                    }
                ]
            }
        ]
    };
    return new Promise(function (resolve, reject) {
        api.createMenu(menu, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
}
function createRateMenu(corpId, appid, api) {
    var menuurl = {};
    menuurl.add_rate = api.getAuthorizeURL(base_config.getURL() + 'rate/add_rate?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.published_rate = api.getAuthorizeURL(base_config.getURL() + 'rate/list_publish?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.readed_rate = api.getAuthorizeURL(base_config.getURL() + 'rate/list_readed?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.noread_rate = api.getAuthorizeURL(base_config.getURL() + 'rate/list_noread?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    var menu = {
        'button': [
            {
                'name': '新建评语',
                'type': 'view',
                'url': menuurl.add_rate
            },
            {
                'name': '我发起的',
                'type': 'view',
                'url': menuurl.published_rate
            },
            {
                'name': '查看评语',
                'sub_button': [
                    {
                        'type': 'view',
                        'name': '未阅',
                        'url': menuurl.noread_rate
                    },
                    {
                        'type': 'view',
                        'name': '已阅',
                        'url': menuurl.readed_rate
                    }
                ]
            }
        ]
    };
    return new Promise(function (resolve, reject) {
        api.createMenu(menu, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
}
function createActivityMenu(corpId, appid, api) {
    var menuurl = {};
    menuurl.add_activity = api.getAuthorizeURL(base_config.getURL() + 'activity/add_activity?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.drfat_activity = api.getAuthorizeURL(base_config.getURL() + 'activity/list_draft?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.published_activity = api.getAuthorizeURL(base_config.getURL() + 'activity/list_publish?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.closed_activity = api.getAuthorizeURL(base_config.getURL() + 'activity/list_closed?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.readed_activity = api.getAuthorizeURL(base_config.getURL() + 'activity/list_readed?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.noread_activity = api.getAuthorizeURL(base_config.getURL() + 'activity/list_noread?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    var menu = {
        'button': [
            {
                'name': '新建活动',
                'type': 'view',
                'url': menuurl.add_activity
            },
            {
                'name': '我发起的',
                'sub_button': [
                    {
                        'type': 'view',
                        'name': '草稿',
                        'url': menuurl.drfat_activity
                    },
                    {
                        'type': 'view',
                        'name': '已提交',
                        'url': menuurl.published_activity
                    },
                    {
                        'type': 'view',
                        'name': '已关闭',
                        'url': menuurl.closed_activity
                    }
                ]
            },
            {
                'name': '我参与的',
                'sub_button': [
                    {
                        'type': 'view',
                        'name': '未阅活动',
                        'url': menuurl.noread_activity
                    },
                    {
                        'type': 'view',
                        'name': '已阅活动',
                        'url': menuurl.readed_activity
                    }
                ]
            }
        ]
    };
    return new Promise(function (resolve, reject) {
        api.createMenu(menu, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
}
function createQuestionnairMenu(corpId, appid, api) {
    var menuurl = {};
    menuurl.add_questionnair = api.getAuthorizeURL(base_config.getURL() + 'questionnair/add_questionnair?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.drfat_questionnair = api.getAuthorizeURL(base_config.getURL() + 'questionnair/list_draft?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.published_questionnair = api.getAuthorizeURL(base_config.getURL() + 'questionnair/list_publish?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.closed_questionnair = api.getAuthorizeURL(base_config.getURL() + 'questionnair/list_closed?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.joined_questionnair = api.getAuthorizeURL(base_config.getURL() + 'questionnair/list_joined?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    menuurl.unjoined_questionnair = api.getAuthorizeURL(base_config.getURL() + 'questionnair/list_unjoined?corp_id=' + corpId + '&appid=' + appid, 'youtour-wo');
    var menu = {
        'button': [
            {
                'name': '新建问卷',
                'type': 'view',
                'url': menuurl.add_questionnair
            },
            {
                'name': '我发起的',
                'sub_button': [
                    {
                        'type': 'view',
                        'name': '草稿',
                        'url': menuurl.drfat_questionnair
                    },
                    {
                        'type': 'view',
                        'name': '已提交',
                        'url': menuurl.published_questionnair
                    },
                    {
                        'type': 'view',
                        'name': '已关闭',
                        'url': menuurl.closed_questionnair
                    }
                ]
            },
            {
                'name': '我的问卷',
                'sub_button': [
                    {
                        'type': 'view',
                        'name': '未参与问卷',
                        'url': menuurl.unjoined_questionnair
                    },
                    {
                        'type': 'view',
                        'name': '已参与问卷',
                        'url': menuurl.joined_questionnair
                    }
                ]
            }
        ]
    };
    return new Promise(function (resolve, reject) {
        api.createMenu(menu, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
}
exports.createMenu = function (corpId, appid, apptype) {
    var api = Wechat.getCorpManager(corpId,appid)[appid];
    if (apptype === 1) {
        return createHomeworkMenu(corpId, appid, api);
    } else if (apptype === 2) {
        return createActivityMenu(corpId, appid, api);
    } else if (apptype === 3) {
        return createRateMenu(corpId, appid, api);
    } else {
        return createQuestionnairMenu(corpId, appid, api);
    }
};
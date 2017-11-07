// ================================================================
//  author:文霞
//  createDate: 2017/11/3
//  description: 评估产品--任务下问卷列表页
//  ===============================================================
var weixinId = "weixinIdTest20171103";//微信号
var taskId = "f8ca1b93-8535-9943-702a-9d6e79bfa167";//任务id
var userId='';
$(window).on("load",function(){
    var ajaxobj = {
        itype: "get",
        iname: "bdmanage/userController/validateUser"
    };
    var actobj = {
        "validate_value": weixinId,//待验证的字段值
        "validate_type": 1//验证的类型：1-微信，2-邮箱 （可扩展）
    };
    var layerIndex = layer.load(0, {shade: false});
    getdata(ajaxobj, actobj, function (data) {
        layer.close(layerIndex);
        if (data.resultnum != "0000") {
            layer.msg("获取用户信息失败", {
                icon: 2,
                time: 3000
            });
            return;
        }else{
            //保存用户信息
            if(data.resultdata.length == undefined){
                userId = data.resultdata.userId;
            }else{
                userId = data.resultdata[0].user_id;
            }
            console.log(userId);
            //_UserObject.user_id = userId;
            renderTaskQuesList();
        }
    });
});
//获取并渲染任务_问卷列表
var renderTaskQuesList = function(){
    var ajaxobj = {
        itype: "get",
        iname: "client/questionnaireController/getQuesByTask"
    };
    var actobj = {
        "task_id": taskId//任务id
    };
    var layerIndex = layer.load(0, {shade: false});
    getdata(ajaxobj, actobj, function (data) {
        layer.close(layerIndex);
        if (data.resultnum != "0000") {
            layer.msg("获取问卷信息失败", {
                icon: 2,
                time: 3000
            });
            return;
        }else{
            if(data.resultdata.length==0){
                layer.msg("任务下没有可用的问卷", {
                    icon: 2,
                    time: 3000
                });
                return;
            }
            else if(data.resultdata.length==1){//如果任务下有一条问卷信息，则直接跳转到问卷首页
                var project_id = data.resultdata[0].project_id;
                var questionnaire_id = data.resultdata[0].questionnaire_id;
                location.href = "problemDepict.html?user_id="+userId+"&project_id="+project_id+"&task_id="+taskId+"&questionnaire_id="+questionnaire_id;
            }else {
                layer.msg("任务有"+data.resultdata.length+"条用户信息", {
                    icon: 2,
                    time: 3000
                });
                return;
            }
        }
    });
};

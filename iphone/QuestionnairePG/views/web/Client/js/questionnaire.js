// ================================================================
//  author:文霞
//  createDate: 2017/10/26
//  description: 评估产品--问卷业务页
//  ===============================================================
/**
 * 页面中从url获取到的参数有：问卷id,用户唯一标识，是否已经填写过问卷；参数的key分别为：user_id，questionnaire_id，authority
 * 问卷设置项如下：
 * progresstype进度条计算方式：0=按照题目，1=按分页，2=不显示
 * pagesize问题分页显示时，每一页的问题数量
 * endingmode问卷提交之后的展现方式{"typekey":1,"typevalue":"显示统计结果、跳转的路径、提示语、发邮件或短信"}
 *
 *
 * 【问卷问题渲染部分】
 * 根据问卷的data.json数据文件，渲染问卷；
 * 根据问卷配置将问卷按照不同分页情况渲染；
 *
 * 【问卷填报部分】
 * 每页题目的答案缓存起来，在最后一页提交；
 *
 * 【跳转题目及关联逻辑题处理】
 * 存储一个关联逻辑的数组，
 * 方案一：每次更改选项的时候，循环关联数据，若找到选项id,就修改对应题目的显示情况；
 * 方案二：渲染选项的时候，将选项是否有关联关系用元素属性标识；更改有标识的选项时，才修改题目显示情况；
 *
 * 【基础数据提交部分】
 * 基础数据的相关问题需要单独存储一个list中，正常提交答案之后提交；
 *
 * 【答案数据回显部分】
 *
 * 【关于问卷是否回答完毕的验证】
 * 在点击"下一页"或者"提交"的时候只验证当前页；
 * 验证时只验证【显示】的题目中【必答】的问题是否有答案；
 *
 */
var _currentQuestionnaireId = "",_projectId ="",_taskId ="",_authority="";//问卷id,是否已填写问卷
var _progresstype= 0,_pagesize= 0,_endingmode={};//进度条计算类型，题目每页数目，问卷提交之后的展现方式
var progressSum=0;//计算进度条使用，分母；
var progressCurrentNum = 0;//计算进度条使用，分子；
var pageCount= 0,currentPage=0;//总页数、当前页；用于多页时候的切换
var pageVisible = [];//分页的可显示情况；item形如：{pageIndex:2,prePage:1,nextPage:3}
var _quesList=[];//当前问卷的问题列表
var answerList=[];//用于存储答案信息
var _quesDisSetList = [];//有逻辑显示设置的问题列表
var submitPageIndex = 0;

var _problemTpl,_radioOptionTpl,_checkboxOptionTpl,_blankTpl;//用于页面渲染用
$(window).on("load",function(){
    //获取url参数
    _currentQuestionnaireId = getUrlPara("questionnaire_id");
    _projectId = getUrlPara("project_id");
    _taskId = getUrlPara("task_id");
    _authority = getUrlPara("authority");
    if(!_currentQuestionnaireId){
        layer.msg("请传入问卷id", {
            icon: 2,
            time: 3000
        });
    }
    if(!_projectId){
        layer.msg("请传入项目id", {
            icon: 2,
            time: 3000
        });
    }
    if(!_taskId){
        layer.msg("请传入任务id", {
            icon: 2,
            time: 3000
        });
    }
    if(!_authority){
        layer.msg("请传入用户是否已经填报过问卷", {
            icon: 2,
            time: 3000
        });
    }
    if(!_UserObject.user_id){
        layer.msg("请传入当前用户唯一标识", {
            icon: 2,
            time: 3000
        });
    }
    //加载问卷数据
    //$.get("quesData/20171025.json",function(data){
    $.get("quesData/"+_currentQuestionnaireId+".json",function(data){
        var questionnaireData=data;
        _progresstype = questionnaireData.progresstype;//0=按照题目，1=按分页，2=不显示
        _pagesize= questionnaireData.pagesize;
        _endingmode= questionnaireData.endingmode;
        _quesList=questionnaireData.questionnaire_questoin;

        //获取_quesDisSetList //有逻辑显示设置的问题列表
        for(var i=0;i<_quesList.length;i++){
            if(_quesList[i].q_displayset){
                _quesDisSetList.push({quesId:_quesList[i].question_id,optId:_quesList[i].q_displayset});
            }
        }
        var quesCount = questionnaireData.questionnaire_questoin.length;//问题数量；跳转题、段落等都会参与计数
        $(".upperProblem").hide();
        //如果pagesize为0表示不分页，显示全部题目信息
        if(_pagesize=="0"){
            $(".alightProblem").hide();
            $(".btnSubmit").show();

            pageCount=1;
            currentPage=1;
            submitPageIndex =1;
        }else{
            pageCount= Math.ceil(quesCount/_pagesize);
            submitPageIndex =pageCount;
            currentPage=1;
            for(var i=0;i<pageCount;i++){
                pageVisible.push({pageIndex:i+1,prePage:i,nextPage:i+2});
            }
        }
        //初始化进度条显示
        if(_progresstype==1){//按分页计算进度条
            progressSum = Math.ceil(quesCount/_pagesize);
        }else if(_progresstype==0){//按题目计算进度条
            progressSum = quesCount;
        }else if(_progresstype==2){//不显示进度条
            $(".problemProgressBar").hide();
        }
        initPageToEvent();//注册"上一页","下一页"的翻页事件；

        $.get("quesTpl.html",function(data){//获取问卷模板
            var quesTplStr=data.trim();
            var quesHtmlJQ = $("<div>");quesHtmlJQ.html(quesTplStr);
            _problemTpl = quesHtmlJQ.find("#problemTpl");   //问题模板
            _radioOptionTpl  = quesHtmlJQ.find("#radioOptionTpl");   //单选选项模板
            _checkboxOptionTpl = quesHtmlJQ.find("#checkboxOptionTpl");  //多选选项模板
            _blankTpl = quesHtmlJQ.find("#blankTpl");  //填空题模板

            //根据用户填报情况，看是否显示答案数据或者注册页面控件事件；
            if(_authority==1){//如果已经填写过问卷了，则回显答案 //authority为1表示用户已经回答过问题了，其他表示没有回答过
                getAnswers(function(){//从数据库获取答案数据
                    progressCurrentNum = progressSum;
                    renderPage(1);
                    changeProgress();
                });
            }else{
                //注册页面上控件事件：单选、多选、填空事件
                initControlEvent();
                $(".btnSubmit").on("click",function(){
                    //验证当前页的必填题目是否都填写了
                    if(!validateRequired()){
                        return;
                    };
                    //按照分页计算进度条的时候，修改进度条的显示
                    if(_progresstype==1&&(currentPage)>progressCurrentNum){
                        progressCurrentNum+=1;
                        changeProgress();
                    }

                    //保存答案
                    saveAnswer();
                });
                renderPage(1);
                changeProgress();
            }
        });
    })
});
//页面控件相关事件
var initControlEvent=function(){
    //单选、多选按钮的点击事件
    //复选框事件
    $("body").delegate(".mutilstli", "click", function (_event) {
        _event.stopPropagation();
        var _event = _event || event;
        var row = _event.srcElement?_event.srcElement:_event.target;
        var $event=$(row);
        //1. 选项样式处理
        if(!$event.hasClass("mutilstli")){
            $event=$event.parents("li");
        }
        if($event.hasClass("checkbox-pitch")){
            $event.removeClass("checkbox-pitch");
        }else{
            $event.addClass("checkbox-pitch");
        }
        var currQues = $event.parents(".problem");
        var currentQuesId = currQues.attr("tmid");

        //2. 修改进度条显示
        var checkedList=$event.parent().children(".checkbox-pitch");
        if(checkedList.length>0){
            if(currQues.attr("hasAnswer")=="0"){
                currQues.attr("hasAnswer","1");
                if(_progresstype==0){
                    //progressCurrentNum+=1;
                    progressCurrentNum = _pagesize *(currentPage-1)+currQues.index()+1;
                    changeProgress();
                }
            }
        }else{
            if(currQues.attr("hasAnswer")=="1"){
                currQues.attr("hasAnswer","0");
                if(_progresstype==0){
                    progressCurrentNum-=1;
                    changeProgress();
                }
            }
        }

        //3. 检查是否控制某问题的显示   【待实现！！！！！！！！！！！！！！！！！！！！！！！！！！！！！】
    });
    // 单选框事件
    $("body").delegate(".singlestli", "click", function (_event) {
        _event.stopPropagation();
        var _event = _event || event;
        var row = _event.srcElement?_event.srcElement:_event.target;
        var $event=$(row);


        if(!$event.hasClass("singlestli")){
            $event=$event.parents("li");//触发事件的有可能是li里的span
        }
        var currentOptionId = $event.find("input").attr("optionid");
        var currQues = $event.parents(".problem");
        //0. 检查原选项是否控制某问题的显示
        var checkedOption_old = $event.siblings(".radio-pitch");
        if(checkedOption_old.length>0){
            handleLogicDisQues($(checkedOption_old[0]).find("input").attr("optionid"),false,currQues);
        }
        //1. 选项样式处理
        $event.addClass("radio-pitch").siblings().removeClass("radio-pitch");
        var currentQuesId = currQues.attr("tmid");

        //2. 修改进度条显示
        if(currQues.attr("hasAnswer")=="0"){
            currQues.attr("hasAnswer","1");
            if(_progresstype==0){
                //progressCurrentNum+=1;
                progressCurrentNum = _pagesize *(currentPage-1)+currQues.index()+1;
                changeProgress();
            }
        }

        //3. 检查是否控制某问题的显示
        handleLogicDisQues(currentOptionId,true,currQues);

        //5. 根据逻辑进行跳转到某题;
        if($event.find("input").attr("toquestnum")){
            var toQuesId = $event.find("input").attr("toquestnum");
            var toQuesId_old = currQues.attr("toquestnum");
            trunToQuestion(currQues,toQuesId,toQuesId_old);
        }else{
            //6. 根据情况看是否跳到下一页,   只有当一页一道题的时候，单选才直接跳到下一页；且当前页小于题目数量
            if(_pagesize==1&&currentPage<pageCount){
                $(".alightProblem").click();
            }
        }
    });
    //input的失去焦点事件
    $("body").delegate('input[type="text"]', "blur", function (_event) {
        _event.stopPropagation();
        var _event = _event || event;
        var eventobj = _event.srcElement?_event.srcElement:_event.target;
        var $this=$(eventobj);

        //验证值是否有效
        var $event=$this;
        var qValue;
        var valueType=$event.parents(".problem").attr("valType");
        if($event.val()){
            if(valueType!="0"){
                if(isNaN($event.val())){
                    var contentText="请输入正确的数据类型";
                    layer.msg(contentText, {
                        icon: 0,
                        time: 2000
                    });
                    $this.val("");
                    $this.focus();
                    return;
                }
                qValue=Number($event.val());
                switch(valueType){//valType=1整数,2小数保留一位,3小数保留两位,4日期
                    case "1":
                        if(qValue%1 != 0){
                            $event.val(qValue.toFixed(0));
                            var contentText="整数有效";
                            layer.msg(contentText, {
                                icon: 0,
                                time: 2000
                            });
                        }
                        break;
                    case "2":
                        if((qValue*10)%1 != 0){
                            $event.val(qValue.toFixed(1));
                            var contentText="一位小数有效";
                            layer.msg(contentText, {
                                icon: 0,
                                time: 2000
                            });
                        }
                        break;
                    case "3":
                        if((qValue*100)%1 != 0){
                            $event.val(qValue.toFixed(2));
                            var contentText="两位小数有效";
                            layer.msg(contentText, {
                                icon: 0,
                                time: 2000
                            });
                        }
                        break;
                }
            }
            //修改题目的已做状态
            if($event.parents(".problem").attr("hasAnswer")=="0"){
                $event.parents(".problem").attr("hasAnswer","1");
                if(_progresstype==0){
                    progressCurrentNum+=1;
                    changeProgress();
                }
            }
        }else{
            if($event.parents(".problem").attr("hasAnswer")=="1"){
                $event.parents(".problem").attr("hasAnswer","0");
                if(_progresstype==0){
                    progressCurrentNum-=1;
                    changeProgress();
                }
            }
            return;
        }

    });
};
//翻页事件：点击"上一页"\"下一页"
var initPageToEvent = function(){
    //上一页的点击事件
    $(".surveySubmitFooter").delegate(".upperProblem","click",function(_event){
        //0. 获取当前页的问题答案
        if(_authority!=1){
            handleAnswerCurrPage();
        }
        //1. 获取当前页的上一页index,渲染新的问题
        currentPage = pageVisible[currentPage-1].prePage;
        renderPage(0);
  });
    //下一页的点击事件
    $(".surveySubmitFooter").delegate(".alightProblem","click",function(_event){
        //1. 验证当前页的必填题目是否都填写了
        if(_authority!=1&&!validateRequired()){
            return;
        };
        //1.1 获取当前页的问题答案
        if(_authority!=1){
            handleAnswerCurrPage();
        }

        //2. 获取当前页的下一页index,渲染新的问题
        currentPage = pageVisible[currentPage-1].nextPage;
        renderPage(1);

        //3. 修改进度条显示；；只有当进度条按照“分页”计算时才使用
        if(_progresstype==1&&(currentPage-1)>progressCurrentNum){
            //progressCurrentNum+=1;
            progressCurrentNum = currentPage-1;
            changeProgress();
        }
    });
};
//根据问卷数据渲染单页面:turnType:0表示由“上一页”按钮触发，1表示由“下一页”触发
var renderPage=function(turnType){
    $(".problemList").html("");
    var questionnaire_questoin = [];
    if(_pagesize=="0"){
        console.log("当前页显示全部题目");
        questionnaire_questoin = _quesList;
    }else {
        //$(".problemList").html("当前页显示的题目index是："+_pagesize *(currentPage-1)+1+"至"+_pagesize *currentPage);
        console.log("当前页码是："+currentPage+",显示的题目index是：" + (_pagesize * (currentPage - 1) + 1) + "至" + _pagesize * currentPage);
        questionnaire_questoin =_quesList.slice(_pagesize *(currentPage-1),_pagesize *currentPage);

        //"上一页"按钮的显示
        if(currentPage>1){
            $(".upperProblem").show();
        }
        else{
            $(".upperProblem").hide();
        }

        //"下一页"按钮的显示：看是否是最后一页，最后一页显示“提交"按钮，隐藏"下一页"按钮
        if(currentPage==pageCount){//如果当前页=总页数，则切换操作按钮
            $(".alightProblem").hide();

        }else{
            $(".alightProblem").show();
        }
        if(_authority==1){
            $(".btnSubmit").hide();
        }else{
            if(currentPage==submitPageIndex){
                $(".btnSubmit").show();
            }
        }
    }
    for(var i=0;i<questionnaire_questoin.length;i++){
        /*问题实体类的字段及解释：
        * "question_id": "d3ef1339-9ae4-6dde-0506-b6233a69a8b4",          //问题id
         "questionnaire_id": "565b514e-6bdd-7df8-64f0-cca5dbfef756",     //问卷id
         "q_order": 1,                                                //题号，显示到问卷上的序号
         "q_score": null,                                       //该问题的满分值
         "q_type": "单选题",                                         ////[题型:单选/多选/填空/其它]
         "content": "本节课教师讲授表述简洁、清楚，使学员很容易理解",   //题目
         "create_time": "2017-09-28 18:15:57",               //题目创建时间
         "stand_id": "201",                                 //题目对应的指标id（问题分类id)
         "rule": 0,                                         //原逻辑规则字段，现合并到q_logicjson字段中【已弃用】
         "option_order": 1,                                 //[选项排列：1=横向;2=纵向;]【不影响移动端，移动端都是纵向】
         "q_imgurl":"",                                     //题目中的图片地址
         "q_turn":1,                                        //题目顺序，整个问卷的所有元素对应的顺序
         "q_logicjson":null,                                //问题逻辑设置json
         "q_displayset":null,                               //显示设置，关联某题的某个选项option_id
         "isbaseinfo":0,                                    //是否是基本信息表 0不是，1是基本信息表
         "question_options": []*/                           //选项列表
        var question_id = questionnaire_questoin[i].question_id;//问题id
        var stand_id = questionnaire_questoin[i].stand_id;//指标id
        var q_order = questionnaire_questoin[i].q_order;//题号，题目序号
        var option_order = questionnaire_questoin[i].option_order;//[选项排列：1=横向;2=纵向;]                                               【暂时无法实现、需要PC端样式有横排、竖排才可以~~~~~~~~~~~~】
        var rule = questionnaire_questoin[i].rule;//[ 问题规则： 默认=0;填空题{1=整型/2=小数保留一位/3=小数保留两位/4=日期};多选题{1=选一项给分/2=选多项给分}]  【未使用，已放在q_logicjson字段中处理~~~~~~~~~~~~~~~~~】
        var q_type = questionnaire_questoin[i].q_type;//[题型:单选题/多选题/填空题/其它]
        var content = questionnaire_questoin[i].content;//题目
        var imgurl = questionnaire_questoin[i].q_imgurl;//题目中的图片地址
        var question_options = questionnaire_questoin[i].question_options;//选项列表
        var q_turn = questionnaire_questoin[i].q_turn;//题目顺序，整个问卷的所有元素对应的顺序                                        【暂时未使用，只有在处理段落的时候用到~~~~~~~~~~~~~~~~~~~~~~~~】
        var q_logicjson = JSON.parse(questionnaire_questoin[i].q_logicjson) ;//问题逻辑设置json  现在的格式为"{\"required\":0,\"rule\":0}"
        var q_displayset = questionnaire_questoin[i].q_displayset;//放在题目元素属性中，待使用                                       【待使用 ~~~~~~~~~~~~~~~~~~~~~~~~~~~  】
        var isbaseinfo = questionnaire_questoin[i].isbaseinfo;//放在题目元素属性中，待使用                                       【待使用 ~~~~~~~~~~~~~~~~~~~~~~~~~~~  】

        //var isvisible = questionnaire_questoin[i].isvisible;//不是数据返回的属性，是页面显示逻辑中添加的属性
        //var isskiped = questionnaire_questoin[i].isskiped;//不是数据返回的属性，是页面显示逻辑中添加的属性:题目是否被跳过


        //问卷数据渲染
        var quesClone=_problemTpl.clone();
        quesClone.removeAttr("id");

        var tmtype="";//single = "单选题", mutil = "多选题", blank = "填空题"
        /*switch(q_type){
            case "单选题":
                tmtype="single";
                break;
            case "多选题":
                tmtype="mutil";
                break;
            case "填空题":
                tmtype="blank";
                break;
        }*/
        quesClone.attr("tmtype",q_type);//题目类型
        quesClone.attr("tmid",question_id);//题目id
        quesClone.attr("standid",stand_id);//指标id
        quesClone.attr("isbaseinfo",isbaseinfo);//是否基础信息问题
        quesClone.attr("displayset",q_displayset);//逻辑关联的选项id
        quesClone.attr("tmorder",q_order);//题目序号
        //是否必填、rule的值都是从q_logicjson中获取
        quesClone.attr("valtype",q_logicjson.rule);//问题规则： 默认=0;填空题{1=整型/2=小数保留一位/3=小数保留两位/4=日期};多选题{1=选一项给分/2=选多项给分
        quesClone.attr("isrequired",q_logicjson.required);//是否必填问题

        quesClone.find(".problemNum").html(q_order+".");
        quesClone.find(".problemWord").html(content);
        if(imgurl){
            quesClone.find(".problemImg").attr("src",imgurl);
        }else{
            quesClone.find(".problemImg").remove();
        }

        //处理答案--答案回显 part1
        var answerOption =[];
        for(var j=0;j<answerList.length;j++){
            if(question_id ==answerList[j].tmid){
                answerOption = answerList[j].optionids;
            }
        }

        //渲染选项部分
        if(q_type=="填空题"){
            var blankClone = _blankTpl.clone();
            blankClone.removeAttr("id");
            quesClone.find(".problemAnswerList").removeClass(".radio");
            quesClone.find(".problemAnswerList").html(blankClone);
            //处理答案--答案回显 part2
            if(answerOption.length!=0){
                blankClone.find("input").val(answerOption[0]);
                quesClone.attr("hasAnswer","1");
            }
        }else if(q_type=="单选题"||q_type=="多选题"){
            for(var j=0;j<question_options.length;j++){
                /*选项实体类的字段及解释：
                 * "option_id": "24133fd5-b377-31e0-9d36-2de0013255d7",   //选项id
                 "option_content": "非常同意",                              //选项内容
                 "option_order": 8,                                     //选项顺序
                 "option_score": "0",                                   //选项分数
                 "questionnaire_id": "565b514e-6bdd-7df8-64f0-cca5dbfef756",        //问卷id
                 "question_id": "d3ef1339-9ae4-6dde-0506-b6233a69a8b4",             //问题id
                 "option_imgurl":null,                                              //选项内图片url
                 "option_toquestnum":null*/                           //选项选中后跳转到的目标题目id
                var option_id = question_options[j].option_id;//选项id
                var option_content = question_options[j].option_content;//选项内容
                var option_score = question_options[j].option_score;//选项分数
                var option_imgurl = question_options[j].option_imgurl;//选项中图片地址
                var option_toquestnum = question_options[j].option_toquestnum;//选项选中后跳转到的目标题目id

                var optionClone = q_type=="单选题"?_radioOptionTpl.clone():_checkboxOptionTpl.clone();
                optionClone.removeAttr("id");
                optionClone.find("input").attr("optionid",option_id);
                optionClone.find("input").attr("score",option_score);
                optionClone.find("input").attr("toquestnum",option_toquestnum);
                optionClone.find(".problemAnswerInfo span").html(option_content);
                if(option_imgurl){
                    optionClone.find(".problemAnswerInfo img").attr("src",option_imgurl);
                }else{
                    optionClone.find(".problemAnswerInfo img").remove();
                }
                //处理答案--答案回显 part2
                if(answerOption.length!=0&&answerOption.indexOf(option_id)!=-1){
                    if(q_type=="单选题"){
                        optionClone.addClass("radio-pitch");
                        //如果选项有跳转的目标题目，那么问题就有跳转的题目
                        if(option_toquestnum){
                            quesClone.attr("toquestnum",option_toquestnum);
                        }
                    }else if(q_type=="多选题"){
                        optionClone.addClass("checkbox-pitch");
                    }
                    quesClone.attr("hasAnswer","1");
                }
                quesClone.find(".problemAnswerList").append(optionClone);
            }
        }
        //if(isvisible=="0"){
        //    quesClone.hide();
        //}
        $(".problemList").append(quesClone);
        //处理问题的逻辑显示控制
        if(q_displayset){
            //在答案数据中查找是否存在这个id，若是不存在则隐藏题目
            var haveTargetOption = false;
            for(var j=0;j<answerList.length;j++){
                var opsList = answerList[j].optionids;
                for(var h=0;h<opsList.length;h++){
                    if(opsList[h]==q_displayset){
                        haveTargetOption = true;
                        break;
                    }
                }
            }
            if(!haveTargetOption){
                quesClone.hide();//不用使用公用方法
                //如果每页显示1条数据，则修改页面显示设置
                if(_pagesize=="1"){
                    //pageVisible[currentPage-2].nextPage=pageVisible[currentPage-1].nextPage;
                    //pageVisible[currentPage].prePage=pageVisible[currentPage-1].prePage;
                    if(turnType==0){//点击“上一页”过来的
                        if((currentPage-1)>=1){
                            $(".upperProblem").click();
                        }else{
                            $(".alightProblem").click();
                        }
                    }else{
                        if((currentPage+1)<=pageCount){
                            $(".alightProblem").click();
                        }else{
                            submitPageIndex = currentPage -1;
                            $(".upperProblem").click();
                        }
                    }

                }
            }
        }
    }
    //根据题目跳转，修改问题的显示
    var quesDisList = $(".problem");
    for(var i=0;i<quesDisList.length;i++){
        var currQues = $(quesDisList[i]);
        var toQuesId = currQues.attr("toquestnum");
        trunToQuestion(currQues,toQuesId);
    }

    //修改问卷布局样式
    if($(".problemList")[0].clientHeight>$(".survey-content")[0].clientHeight){
        $(".survey-content").removeClass("content-center");
    }else{
        $(".survey-content").addClass("content-center");
    }
};
//提交答案
var saveAnswer=function(){
    //从答案中，计算指标分数//将数据添加到standScoreList中
    var standScoreList = [];
    for(var i=0;i<answerList.length;i++){
        var standid = answerList[i].standid;
        var score = answerList[i].score;
        var existStand=false;
        for(var j=0;j<standScoreList.length;j++){
            if(standScoreList[j].stand_id==standid){
                standScoreList[j].score=Number(standScoreList[j].score)+Number(score);
                existStand=true;
                break;
            }
        }
        if(!existStand){
            standScoreList.push({stand_id:standid,score:score});
        }
    }

    var ajaxobj = {
        itype: "get",
        iname: "client/questionnaireController/submitQuestionnaire"
    };
    var actobj = {//url中需要的key ：authority,project_id，task_id，questionnaire_id,uid,serid,role
        "answer_id": "",
        "user_id": getUrlPara("user_id"),//_UserObject.user_id,//"用户ID实际参数值",
        "server_id": _UserObject.server_id,
        "user_role": _UserObject.user_role,//"用户角色实际参数值",//_UserObject.user_role,
        "isanonymous":_UserObject.isanonymous,//是否匿名用户
        "sub_sourcetype":_UserObject.sub_sourcetype,//提交来源，即用户访问方式 ：提交来源，1是用户名密码登录，2是微信，3是邮箱，4是pc，5是移动设备
        "project_id": _projectId,
        "task_id": _taskId,
        "questionnaire_id": _currentQuestionnaireId,//"问卷ID实际参数值",
        "content": JSON.stringify(answerList),//"答案内容实际参数值",//"",//问卷答案
        "page_num": 1,
        //下面的字段都是在向score_result表中添加字段时候使用；
        "answer_items":standScoreList,
        "user_name":_UserObject.user_name,
        "school_name":_UserObject.server_name
    };
    var layerIndex = layer.load(0, {shade: false});
    getdata(ajaxobj, actobj, function (data) {
        layer.close(layerIndex);
        if (data.resultnum != "0000") {
            layer.msg("数据保存失败", {
                icon: 2,
                time: 3000
            });
            return;
        }else{
            answerId=data.resultdata.answer_id;//"5eea0d12-220d-03b3-8a3b-70a15c3794f6"
            layer.msg("数据保存成功", {
                icon: 1,
                time: 2000
            });
            //根据结果展示方式处理不同设置【待实现！！！！！！！！！！！！！！！！！！！！！！！！！！！！！】
        }
    });
};
//修改进度条
var changeProgress=function(){
    var percentage=progressCurrentNum/progressSum*100;
    $(".problemProgressBar").css("width",percentage+'%');
};
//从数据库获取答案
var getAnswers=function(callback){
    var ajaxobj = {
        itype: "get",
        iname: "client/questionnaireController/getQuestionnaireAnswer"
    };
    var actobj = {
        "project_id": _projectId,
        "task_id": _taskId,
        "questionnaire_id": _currentQuestionnaireId,
        "page_num": 1,
        "user_id": _UserObject.user_id,
        "server_id":  _UserObject.server_id
    };
    var layerIndex = layer.load(0, {shade: false});
    getdata(ajaxobj, actobj, function (data) {
        layer.close(layerIndex);
        if (data.resultnum != "0000") {
            layer.msg("获取答案数据失败", {
                icon: 2,
                time: 3000
            });
            return;
        }else{
            //正常情况下应该获取一条数据，但是返回的是一个list，所以就取第一条解析吧
            //answerId=data.resultdata[0].answer_id;//"5eea0d12-220d-03b3-8a3b-70a15c3794f6"
            answerList=JSON.parse(data.resultdata[0].content);
            callback&&callback();
        }
    });
};
//处理题目跳转（仅限当前页中）：当前问题jq对象\跳转到的问题id\原来问题跳转到的问题id
var trunToQuestion = function($currQues,toQuesId,toQuesId_old){
    //进行跳转
    var currQOrder = $currQues.attr("tmorder");
    var toQuesOrder = -1;
    var toQuesOrder_old = -1;
    //先找到这道题的index
    for(var i=0;i<_quesList.length;i++){
        if(_quesList[i].question_id==toQuesId){
            toQuesOrder = _quesList[i].q_order;
        }
        if(_quesList[i].question_id==toQuesId_old){
            toQuesOrder_old = _quesList[i].q_order;
        }
    }
    var targetPage = _pagesize!=0?Math.ceil(toQuesOrder/_pagesize):Math.ceil(toQuesOrder/_quesList.length);

    //如果跳转到的目标页不在当前页；逻辑未完成；由设置问卷时候限制不能跳转到其他页，故这个条件分枝不会走                       【待实现！！！！！！！！！！！！！！！！！！！！！！！！！！！！！】
    if(targetPage>currentPage){
        layer.msg("跳页设置错误", {
            icon: 2,
            time: 3000
        });
        return;
        if(_pagesize!=0){
            pageVisible[currentPage-1].nextPage=targetPage;
            pageVisible[targetPage-1].prePage=currentPage;
            //for(var i=0;i<pageVisible.length;i++){
            //    if(i>currentPage&&i<targetPage){
            //        pageVisible[i]=0;
            //    }
            //}
        }
        for(var i=0;i<_quesList.length;i++){
            var qOrder = _quesList[i].q_order;
            if(qOrder>currQOrder&&qOrder<toQuesOrder){
                //_quesList[i].isvisible=0;
                //进度条修改--按题目显示进度条的时候：求问题跳转的数量
                if(_progresstype==0){
                    progressCurrentNum+=1;
                    changeProgress();
                }
            }
        }
        //进度条修改--按分页显示进度条的时候：求页面跳转的数量
        if(_progresstype==1){

        }
        currentPage=targetPage;
        renderPage(1);
    }
    else{//如果跳转到的目标页在当前页；
        var pageQuesList = $currQues.nextAll();//当前问题后面的问题列表
        for(var i=0;i<pageQuesList.length;i++){
            var qOrder = $(pageQuesList[i]).attr("tmorder");
            if(qOrder>currQOrder&&qOrder<toQuesOrder){//2. 进行新的跳页设置；
                if(qOrder>=toQuesOrder_old){
                    //隐藏当前题目与目标题目之间的题目
                    $(pageQuesList[i]).hide();
                    //从答案列表中删除目标问题的答案
                    for(var j=0;j<answerList.length;j++){
                        if(answerList.tmid==targetQuesId){
                            answerList.splice(i,1);
                        }
                    }
                    $(pageQuesList[i]).attr("isskiped","1");
                    //var qId = $(pageQuesList[i]).attr("tmid");
                    //for(var j=0;j<_quesList.length;j++){
                    //    if(_quesList[j].question_id==qId){
                    //        _quesList[j].isvisible=0;
                    //    }
                    //}
                    //如果问题没有回答，修改进度条显示
                    if($(pageQuesList[i]).attr("hasanswer")=="0"){
                        progressCurrentNum+=1;
                        changeProgress();
                    }
                }
            }else if(qOrder>currQOrder&&qOrder<toQuesOrder_old){//取消原跳页设置；
                $(pageQuesList[i]).attr("isskiped","0");
                //显示原来隐藏的题目,如果当前题目为逻辑控制显示题，则需要根据答案判断是否显示
                var q_displayset = $(pageQuesList[i]).attr("displayset");
                var haveTargetOption = false;
                if(q_displayset){
                    //在答案数据中查找是否存在这个id，若是不存在则隐藏题目
                    for(var j=0;j<answerList.length;j++){
                        var opsList = answerList[j].optionids;
                        for(var h=0;h<opsList.length;h++){
                            if(opsList[h]==q_displayset){
                                haveTargetOption = true;
                                break;
                            }
                        }
                    }
                }
                if(!q_displayset||(q_displayset&&haveTargetOption)){
                    $(pageQuesList[i]).show();
                    //var qId = $(pageQuesList[i]).attr("tmid");
                    //for(var j=0;j<_quesList.length;j++){
                    //    if(_quesList[j].question_id==qId){
                    //        _quesList[j].isvisible=1;
                    //    }
                    //}
                    //如果问题没有回答，修改进度条显示
                    if($(pageQuesList[i]).attr("hasanswer")=="0") {
                        progressCurrentNum -= 1;
                        changeProgress();
                    }
                }
            }
        }

        $currQues.attr("toquestnum",toQuesId);
    }
};
//验证当前页的必填题目是否都填写了
var validateRequired = function(){
    var quesList = $(".problem");
    for(var i=0;i<quesList.length;i++){
        //当前题目的显示状态为true且为必填题目时，才验证回答情况
        if($(quesList[i]).is(':visible')&&$(quesList[i]).attr("isrequired")=="1"){
            if($(quesList[i]).attr("hasAnswer")=="0"){
                layer.msg("请回答第"+$(quesList[i]).attr("tmorder")+"题", {
                    icon: 2,
                    time: 3000
                });
                return false;
            }
        }
    }
    return true;
};
//处理当前页的答案
var handleAnswerCurrPage = function(){
    var quesList = $(".problem:visible");
    for(var i=0;i<quesList.length;i++){
        //{tmid,optionids,standid,score}
        var currentQues = $(quesList[i]);
        var tmid=currentQues.attr("tmid");
        var standid=currentQues.attr("standid");
        var optionids=[],score=0;
        if(currentQues.attr("hasAnswer")!="1"){
            continue;
        }
        //获取选中项
        var tmtype=currentQues.attr("tmtype");
        switch(tmtype){
            case '单选题'://单选
                optionids.push(currentQues.find(".radio-pitch input").attr("optionid"));
                score=Number(currentQues.find(".radio-pitch input").attr("score"));
                break;
            case '多选题'://多选
                var checkList=currentQues.find(".checkbox-pitch input");
                //根据计算方式的不同，计算分数结果：valType=2时，只选择一个答案不给分
                var valType=currentQues.attr("valType");
                if(valType=="2"||checkList.length==1){
                    for(var j=0;j<checkList.length;j++){
                        optionids.push($(checkList[j]).attr("optionid"));
                    }
                }else{
                    for(var j=0;j<checkList.length;j++){
                        optionids.push($(checkList[j]).attr("optionid"));
                        score+=Number($(checkList[j]).attr("score"));
                    }
                }
                break;
            case '填空题':
                score=0;
                optionids.push(currentQues.find("input").val());
            //其他题型未处理
            //right_wrong = "是非题", question_answer = "问答题",range = "区间题",blank_date = "0_0_199"; //日期类型填空题
        }
        var answerItem={
            tmid:tmid,
            standid:standid,
            optionids:optionids,
            score:score
        };
        var haveExist=false;
        for(var i=0;i<answerList.length;i++){
            if(tmid == answerList[i].tmid){
                haveExist=true;
                answerList[i]=answerItem;
            }
        }
        if(!haveExist){
            answerList.push(answerItem);
        }
    }
};
//处理逻辑显示题目：当前发生变化的选项id,当前选项的选中状态,当前问题jq对象
var handleLogicDisQues = function(optionId,checked,$currQues){
    for(var i=0;i<_quesDisSetList.length;i++){
        if(_quesDisSetList[i].optId == optionId){
            var targetQuesId = _quesDisSetList[i].quesId;
            //从答案列表中删除目标问题的答案
            if(!checked){
                for(var j=0;j<answerList.length;j++){
                    if(answerList.tmid==targetQuesId){
                        answerList.splice(i,1);
                    }
                }
            }
            //从当前页中找问题，并修改现实情况
            var pageQuesList = $currQues.nextAll();//当前问题后面的问题列表
            for(var j=0;j<pageQuesList.length;j++){
                if($(pageQuesList[j]).attr("tmid")==targetQuesId){
                    if(checked&&$(pageQuesList[j]).attr("isskiped")!="1"){
                        $(pageQuesList[j]).show();
                    }else{
                        $(pageQuesList[j]).hide();
                    }
                }
            }
        }
    }
}


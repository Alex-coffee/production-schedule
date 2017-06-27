var rootPath = "http://localhost:8080/or-tool";
var filePath = "./public/or-tool/files/";

//configuration for notification
toastr.options = {
  "closeButton": true,
  "debug": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "onclick": null,
  "showDuration": "400",
  "hideDuration": "1000",
  "timeOut": "4000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

var oLanguage={
    "oAria": {
        "sSortAscending": ": 升序排列",
        "sSortDescending": ": 降序排列"
    },
    "oPaginate": {
        "sFirst": "首页",
        "sLast": "末页",
        "sNext": "下页",
        "sPrevious": "上页"
    },
    "sEmptyTable": "没有相关记录",
    "sInfo": "第 _START_ 到 _END_ 条记录，共 _TOTAL_ 条",
    "sInfoEmpty": "第 0 到 0 条记录，共 0 条",
    "sInfoFiltered": "(从 _MAX_ 条记录中检索)",
    "sInfoPostFix": "",
    "sDecimal": "",
    "sThousands": ",",
    "sLengthMenu": "每页显示条数: _MENU_",
    "sLoadingRecords": "正在载入...",
    "sProcessing": "正在载入...",
    "sSearch": "搜索:",
    "sSearchPlaceholder": "",
    "sUrl": "",
    "sZeroRecords": "没有相关记录"
}
$.fn.dataTable.defaults.oLanguage=oLanguage;

var validationMessage = {
    required: "必选字段",  
    remote: "请修正该字段",  
    email: "请输入正确格式的电子邮件",  
    url: "请输入合法的网址",  
    date: "请输入合法的日期",  
    dateISO: "请输入合法的日期 (ISO).",  
    number: "请输入合法的数字",  
    digits: "只能输入整数",  
    creditcard: "请输入合法的信用卡号",  
    equalTo: "请再次输入相同的值",  
    accept: "请输入拥有合法后缀名的字符串",  
    maxlength: jQuery.validator.format("请输入一个长度最多是 {0} 的字符串"),  
    minlength: jQuery.validator.format("请输入一个长度最少是 {0} 的字符串"),  
    rangelength: jQuery.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),  
    range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),  
    max: jQuery.validator.format("请输入一个最大为 {0} 的值"),  
    min: jQuery.validator.format("请输入一个最小为 {0} 的值") 
}

jQuery.validator.messages = validationMessage;

function getRootPath() {
    var curWwwPath=window.document.location.href;
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    var localhostPaht=curWwwPath.substring(0,pos);
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return(localhostPaht+projectName);
}

Array.prototype.insertAt=function(index,obj){
    this.splice(index,0,obj);
}
Array.prototype.removeAt=function(index){
    this.splice(index,1);
}
Array.prototype.remove=function(obj){
    var index=this.indexOf(obj);
    if (index>=0){
        this.removeAt(index);
    }
}

//update current object, insert into array if not in list
Array.prototype.updateObject = function(object){
    var index=this.indexOf(object);
    if (index>=0){
        this.splice(index,1, object);
    }else{
        this.push(object);
    }
}

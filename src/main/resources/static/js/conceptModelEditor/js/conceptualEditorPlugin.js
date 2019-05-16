$(document).ready(function () {
    /*$.ajax({
        url:'http://localhost:8081/GeoModelingNew/JudgeLoadServlet',
        type:"get",
        async:false,
        data:"",
        success:function(data) {
            var type = "En";
            if(language!="en"){
                type = "Cn";
            }
            if (data == "no") {
                alert("Please Login");
                window.location.href = "http://localhost:8081/GeoModelingNew/"+type+"/home/login.html";
            }
        }
    });*/

    $(document).on("mouseover","#selectImgDiv .col-sm-3",function () {
        $(this).children("span").show();
    });

    $(document).on("mouseout","#selectImgDiv .col-sm-3",function () {
        $(this).children("span").hide();
    });

});

function createIcon(array,id) {
    $("#"+id).empty();
    var num = array.length/3;
    var cols = [];
    for(var i=0;i<num;i++){
        var col = document.createElement("div");
        col.style.display = "inline-flex";
        col.style.width = "100%";
        cols.push(col);
    }
    for(var i=0;i<array.length;i++){
        var n = parseInt(i/4);
        var div = document.createElement("div");
        div.style.border = "2px solid #999";
        div.style.height = "100px";
        div.style.width = "100px";
        div.style.marginLeft = "8px";
        div.style.marginTop = "6px";
        var img = document.createElement("img");
        img.id = array[i].icon_id;
        img.src = "http://localhost:8081/GeoModelingNew/showIconServlet?uid="+array[i].icon_id;
        img.width = "100";
        img.height = "100";
        div.appendChild(img);
        $(cols[n]).append(div);
    }
    for(var i=0;i<num;i++){
        $("#"+id).append(cols[i]);
    }
}

function createTaskTable(array,id) {
    $("#"+id).empty();
    for(var i=0;i<array.length;i++){
        var div = document.createElement("div");
        div.className = "col-sm-12 taskli";
        div.style.padding = "0px";
        div.style.textAlign = "left";
        div.title = array[i].name;
        div.setAttribute("xml",array[i].xml)
        var spandiv = document.createElement("div");
        spandiv.style.maxWidth = "130px";
        spandiv.style.overflowX = "hidden";
        spandiv.style.display="inline-block";
        spandiv.style.textOverflow = "ellipsis";
        div.appendChild(spandiv);
        var span1 = document.createElement("span");
        spandiv.innerHTML = array[i].name;

        div.appendChild(span1);

        var span2 = document.createElement("span");
        span2.innerHTML = array[i].time;
        span2.style.fontSize = "12px";
        span2.className = "timeTag";
        span2.style.float = "right";
        div.appendChild(span2);
        $("#"+id).append(div);
    }
}

function createConceptualModelTable(array,id) {
    $("#"+id).empty();
    for(var i=0;i<array.length;i++){
        var div = document.createElement("div");
        div.className = "col-sm-12 conceptualli";
        div.style.padding = "0px";
        div.style.textAlign = "left";
        div.title = array[i].name;
        div.id = encode64(encode64(array[i].id));
        div.setAttribute("xml",array[i].xml);
        div.style.paddingBottom = "2px";
        div.style.borderBottom = "1px solid #000";
        var spandiv = document.createElement("div");
        spandiv.style.maxWidth = "130px";
        spandiv.style.overflowX = "hidden";
        spandiv.style.display="inline-block";
        spandiv.style.textOverflow = "ellipsis";
        div.appendChild(spandiv);
        var span1 = document.createElement("span");
        spandiv.innerHTML = array[i].name;

        div.appendChild(span1);

        var span2 = document.createElement("span");
        span2.innerHTML = array[i].time;
        span2.style.fontSize = "12px";
        span2.className = "timeTag";
        span2.style.float = "right";
        div.appendChild(span2);
        $("#"+id).append(div);
    }
}

function createModelItem(array, id) {
    $("#"+id).empty();
    var table = document.createElement("table");
    table.className = "table table-bordered";
    $("#"+id).append(table);
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for(var i=0;i<array.length;i++){
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.title =  array[i].model_name;
        td.style.cursor = "pointer";
        td.innerHTML = array[i].model_name;
        td.id = array[i].model_id;
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}

function createConcept(array, id) {
    $("#"+id).empty();
    var table = document.createElement("table");
    table.className = "table table-bordered";
    $("#"+id).append(table);
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for(var i=0;i<array.length;i++){
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.title =  array[i].concept_name;
        td.style.cursor = "pointer";
        td.innerHTML = array[i].concept_name;
        td.id = array[i].concept_Id;
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}

function regetIcon(page) {
    if(firstPage){
        firstPage =  false;
    }else{
        $.ajax({
            url:"http://localhost:8081/GeoModelingNew/geoIconListServlet",
            type:"get",
            async:false,
            data:{"uid":tempNameId,"page":page,"sortType":"name"},
            success:function (data) {
                var result = JSON.parse(data);
                createIcon(result.geoIcons,"infoTable");
            }
        })
    }
}

function regetTask(page) {
    if(firstPage){
        firstPage =  false;
    }else{
        $.ajax({
            url:"http://localhost:8081/GeoModelingNew/IconTaskServlet",
            type:"get",
            data:{"page":page},
            success:function (data) {
                var result = JSON.parse(data);
                createTaskTable(result.task,"taskList");
            }
        })
    }
}

function regetConceptualModel(page) {
    if(firstPage){
        firstPage =  false;
    }else{
        $.ajax({
            url:"http://localhost:8081/GeoModelingNew/ConceptualModelEditorServlet",
            type:"get",
            data:{"page":page},
            success:function (data) {
                var result = JSON.parse(data);
                createConceptualModelTable(result.conceptual,"conceptualList");
            }
        })
    }
}

function regetModelItems(page) {
    if(firstPage){
        firstPage = false
    }else {
        if($("#searchMItemInput").val()!=""){
            var searchName = $(this).val();
            $.ajax({
                url:"http://localhost:8081/GeoModelingNew/SearchModelItemsServlet",
                type:"get",
                async:false,
                data:{"searchText":searchName,"uid":modelItemClassId,"page":page,"sortType":"name","asc":1},
                success:function (data) {
                    var result = JSON.parse(data);
                    createModelItem(result.modelItems,"modelInfoTable");
                }
            });
        }else{
            $.ajax({
                url:"http://localhost:8081/GeoModelingNew/ModelItemsServlet",
                type:"get",
                async:false,
                data:{"uid":modelItemClassId,"page":page,"sortType":"name","asc":1},
                success:function(data){
                    var result = JSON.parse(data);
                    createModelItem(result.modelItems,"modelInfoTable");
                }
            });
        }
    }
}


function regetConcept(page) {
    if(firstPage){
        firstPage = false
    }else {
        if($("#searchConceptInput").val()!=""){
            var searchName = $("#searchConceptBtn").val();
            $.ajax({
                url:"../../searchConceptServlet",
                type:"get",
                async:false,
                data:{"searchText":searchName,"uid":conceptClassId,"page":page,"sortType":"name"},
                success:function (data) {
                    var result = JSON.parse(data);
                    createConcept(result.conceptModels,"conceptInfoTable");
                }
            });
        }else{
            $.ajax({
                url:"../../conceptServlet",
                type:"get",
                async:false,
                data:{"uid":conceptClassId,"page":page,"sortType":"name"},
                success:function(data){
                    var result = JSON.parse(data);
                    createConcept(result.conceptModels,"conceptInfoTable");
                }
            });
        }
    }
}
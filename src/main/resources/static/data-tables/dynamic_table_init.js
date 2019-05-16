function fnFormatDetails(oTable, nTr) {
    var aData = oTable.fnGetData(nTr);
    var sOut = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
    sOut += '<tr><td>Rendering engine:</td><td>' + aData[1] + ' ' + aData[4] + '</td></tr>';
    sOut += '<tr><td>Link to source:</td><td>Could provide a link here</td></tr>';
    sOut += '<tr><td>Extra info:</td><td>And any further details here (images etc)</td></tr>';
    sOut += '</table>';

    return sOut;
}
var table;
$(document).ready(function () {

    table = $('#dynamic-table').DataTable({
        //"aaSorting": [[ 0, "asc" ]],
        "paging": false,
        // "ordering":false,
        "info": false,
        "searching": false
    });
    $("#dynamic-table").css("display", "none")
    //$('#dynamic-table').dataTable().fnAddData(['111','111','111','1111','1111']);
    // $("#addref").click(function(){
    //     $("#refinfo").modal("show");
    // })
    $("#doiSearch").click(function () {
        $("#doi_searchBox").addClass("spinner")
        $.ajax({
            data: "Get",
            url: "/modelItem/DOISearch",
            data: {
                doi: $("#doi_searchBox").val()
            },
            cache: false,
            async: true,
            success: (data) => {
                data=data.data;
                $("#doi_searchBox").removeClass("spinner")
                if (data == "ERROR") {
                    alert(data);
                }
                // if(!json.doi){
                //     alert("ERROR")
                // }
                else {
                    var json = eval('(' + data + ')');
                    console.log(json)
                    $("#doiTitle").val(json.title)
                    $("#doiAuthor").val(json.author)
                    $("#doiDate").val(json.month + " " + json.year)
                    $("#doiJournal").val(json.journal)
                    $("#doiPages").val(json.pages)
                    $("#doiLink").val(json.adsurl)
                    $("#doiDetails").css("display", "block");

                }
            },
            error: (data) => {
                $("#doi_searchBox").removeClass("spinner")
                alert("ERROR!")
                $("#doiDetails").css("display", "none");
                $("#doiTitle").val("")
            }
        })


    });
    $("#modal_cancel").click(function () {
        $("#refTitle").val("")
        var tags = $('#refAuthor').tagEditor('getTags')[0].tags;
        for (i = 0; i < tags.length; i++) { $('#refAuthor').tagEditor('removeTag', tags[i]); }
        $("#refDate").val("")
        $("#refJournal").val("")
        $("#refPages").val("")
        $("#refLink").val("")

        $("#doiDetails").css("display", "none");
        $("#doiTitle").val("")
    })
    $("#modal_save").click(function () {

        if ($(".nav-tabs li").eq(0)[0].className == "active") {
            if ($("#refTitle").val().trim() == "") {
                alert("Please Enter Title");
            }
            else {
                table.row.add([
                    $("#refTitle").val(),
                    $("#refAuthor").val(),
                    $("#refDate").val(),
                    $("#refJournal").val(),
                    $("#refPages").val(),
                    $("#refLink").val(), "<center><a href='javascript:;' class='fa fa-times refClose' style='color:red'></a></center>"]).draw();

                $("#dynamic-table").css("display", "block")
                $("#refinfo").modal("hide")
                $("#refTitle").val("")
                var tags = $('#refAuthor').tagEditor('getTags')[0].tags;
                for (i = 0; i < tags.length; i++) { $('#refAuthor').tagEditor('removeTag', tags[i]); }
                $("#refDate").val("")
                $("#refJournal").val("")
                $("#refPages").val("")
                $("#refLink").val("")
            }

        }
        else {
            if ($("#doiTitle").val() == "") {
                alert("Details are empty");
            }
            else {
                table.row.add([
                    $("#doiTitle").val(),
                    $("#doiAuthor").val(),
                    $("#doiDate").val(),
                    $("#doiJournal").val(),
                    $("#doiPages").val(),
                    $("#doiLink").val(), "<center><a href='javascript:;' class='fa fa-times refClose' style='color:red'></a></center>"]).draw();
                $("#dynamic-table").css("display", "block")
                $("#refinfo").modal("hide")
                $("#doiDetails").css("display", "none");
                $("#doiTitle").val("");
            }
        }


    })

    $(document).on("click", ".refClose", function () {
        table.row($(this).parents("tr")).remove().draw();
        //$(this).parents("tr").eq(0).remove();
        console.log($("tbody tr"));
        if ($("tbody tr").eq(0)[0].innerText == "No data available in table") {
            $("#dynamic-table").css("display", "none")
        }
    });
});
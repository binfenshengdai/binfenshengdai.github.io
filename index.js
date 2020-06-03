var table = null;
var i = 1;

window.onload = function(){
    $("#loading-div").hide();
}

$(document).ready(function () {
    table = $("#myTable").DataTable({
        paging: false,
        searching: false,// 禁用全局过滤
        scrollY: '50vh',
        scrollCollapse: true,
        order:[[0,"asc"]],
        columns: [
            {data:"seq"},
            {data:"name"}
        ],
        //data:[{seq:1,name:"字段1"},{seq:2,name:"字段2"},{seq:3,name:"字段3"}],
        rowReorder: {
            update: true,
            enable:false,
            selector: 'tr',
            dataSrc:'seq'
        },
        columnDefs: [
            { targets: 0, visible: false },
            {
                targets: [1],
                orderable:false,
                createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
                    $(cell).dblclick(function () {
                        let tmp = null;
                        if($(this).children('input').length>0){
                            tmp = $(this).children('input').val();
                        }
                        else(
                            tmp = $(this).html()
                        )
                        $(this).html('<input class="form-control" type="text" size="16" style="width: 100%"/>');
                        var aInput = $(this).find(":input");
                        aInput.focus().val(tmp);
                    });
                    $(cell).on("blur", ":input", function () {
                        var text = $(this).val();
                        $(cell).html(text);
                        table.cell(cell).data(text)
                    })
                }
            }
        ]
        // columnDefs: [{
        //     targets: [0],
        //     createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
        //         $(cell).dblclick(function () {
        //             let tmp = null;
        //             if($(this).children('input').length>0){
        //                 tmp = $(this).children('input').val();
        //             }
        //             else(
        //                 tmp = $(this).html()
        //             )
        //             $(this).html('<input class="form-control" type="text" size="16" style="width: 100%"/>');
        //             var aInput = $(this).find(":input");
        //             aInput.focus().val(tmp);
        //         });
        //         $(cell).on("blur", ":input", function () {
        //             var text = $(this).val();
        //             $(cell).html(text);
        //             table.cell(cell).data(text)
        //         })
        //     }
        // }]
    });


    $('#myTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            var data = table.rows('.selected').data;
            
        }
    });

    /*table.on( 'row-reorder', function ( e, diff, edit ) {
        var exchangeList = [];
        var result = 'Reorder started on row: '+eval(edit.triggerRow.data())+'<br>';

        for ( var i=0, ien=diff.length ; i<ien ; i++ ) {
            var rowData = table.row( diff[i].node ).data();

            result += rowData+' updated to be in position '+
                diff[i].newData+' (was '+diff[i].oldData+')<br>';
            exchangeList.push(rowData.relation_id+','+diff[i].newData);
        }

       console.info( 'Event result:<br>'+result );
       reOrder(exchangeList);
    } );*/

    // $('#myTable tbody').on('rowReorder',function(e,diff,edit){
    //     for ( var i=0, ien=diff.length ; i<ien ; i++ ) {
    //         $(diff[i].node).addClass("reordered");
    //     }
    // })
})

function addRow() {
    // table.row.add({field:"字段"}).draw(false);
    table.row.add({seq:table.data().length+1,name:"字段名称"}).draw(false);
}

function delRow() {
    layer.confirm('确定要删除吗？', {
        btn: ['删除', '取消'] //按钮
    }, function (index, layero) {
        var delIndex = table.$('.selected').index();
        table.row('.selected').remove().draw();
        table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
            if(table.row(rowIdx).data().seq>delIndex){
                table.row(rowIdx).data().seq = table.row(rowIdx).data().seq-1
            }
        } );
        layer.close(index)
    }, function () {
    });
}

function emptyTable() {
    table.rows().remove().draw();
}

function disableSortable() {
    table.rowReorder.disable();
}

function enableSortable() {
    table.rowReorder.enable();

}

function getDatas(){
    var a = [];
    a = getTableDatas();
    layer.alert(a.toString())
}

function getTableDatas() {
    var data = [];
    var trList = $('#myTable tbody').find('tr');
    for(let i=0;i<trList.length;i++){
        let tmp = trList[i].children[0].innerText;
        data.push(tmp)
    }
    return data;
}

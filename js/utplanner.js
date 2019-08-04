if ($('html').hasClass('gr__utexas_collegescheduler_com')) {
    $.initialize("table.section-detail-grid", function () {
        console.log('hello')
        $(this).find('thead>tr').append('<th> Plus</th')
        $(this).find('tbody>tr').each(function () {
            $(this).append(`<td data-th="Plus"><input type="image" class="distButton" id="distButton" style="vertical-align: bottom;" width="20" height="20" src='${chrome.extension.getURL('images/disticon.png')}'/></td>`);
        })
    });
}
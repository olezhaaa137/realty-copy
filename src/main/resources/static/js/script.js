$("#users tbody tr").click(function() {
    window.location = $(this).find('td').first().attr("href");
});

$("#btnMenu").click(function () { 
    $("#menu").toggle();
});

$("#type").change(function () { 
    if($(this).val() == 'Участок'){
        $("#yearDiv").hide();
        $("#year").removeAttr('required');
        $("#livingAreaDiv").hide();
        $("#livingArea").removeAttr('required');
        $("#floorLb").hide();
        $("#floorCountLb").hide();
        $("#floor").removeAttr('required');
        $("#floor").hide();
        $("#renovationsDiv").hide();
        $("#renovations").removeAttr('required');
    }
    if($(this).val() == 'Дом'){
        $("#yearDiv").show();
        $("#year").attr('required', true);
        $("#livingAreaDiv").show();
        $("#livingArea").attr('required', true);
        $("#floorLb").hide();
        $("#floorCountLb").show();
        $("#floor").attr('required', true);
        $("#floor").show();
        $("#renovationsDiv").show();
        $("#renovations").attr('required', true);
    }
    if($(this).val() == 'Квартира'){
        $("#yearDiv").show();
        $("#year").attr('required', true);
        $("#livingAreaDiv").show();
        $("#livingArea").attr('required', true);
        $("#floorLb").show();
        $("#floorCountLb").hide();
        $("#floor").attr('required', true);
        $("#floor").show();
        $("#renovationsDiv").show();
        $("#renovations").attr('required', true);
    }
    
});

$("#img_list img").click(function() {
    $(this).closest("#img_list").prev("#main_img").find("img").attr("src", $(this).attr("src"));
});

$("#dateClient").change(function () { 
    var date=$(this).val();
    window.location = '/client/getTime?id=' + $(this).attr("href") + '&date=' + $(this).val(); 
    $('#dateClient option:contains(date)').prop('selected', true);
});
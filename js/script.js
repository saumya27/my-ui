var loadingProd = false;
var noMoreProd = false;
var page_no = 0;
// Drawer menu
var  globalMenu,
currentObj,
levelLock = 3,
pathStack = [];
var sStorage = sessionStorage || {};
var lStorage = localStorage || {};
var ua = navigator.userAgent.toLowerCase();

try{
    sessionStorage .test = "a";
}catch(err){
    sStorage = {};
}
try{
    localStorage.test = "a";
}catch(err){
    lStorage = {};
}

window.onpageshow = function(event) {
    stopLoading();
    closeDrawerMenu();
};

$(document).ready(function() {
    log_data("pageView");
    iPhonePositionFix();
    initAppPromoBanner();
});

var swipe = false;
var swipeStat = false;
var minSwipeH = 16;
var maxSwipeV = 30;

$("body").on('mousedown touchstart',function(e){
    var es = e;
    try{
        es = e.originalEvent;
        es = e.originalEvent.touches[0];
    }catch(err){}
    xDown = es.pageX;
    yDown = es.pageY;
    swipe = true;
}).on("mouseup touchmove", function(e){
    var es = e;
    try{
        es = e.originalEvent.changedTouches[0];
    }catch(err){}
    xUp = es.pageX;
    yUp = es.pageY;
    if(yUp - yDown < maxSwipeV &&  yUp - yDown > -maxSwipeV && swipe && !swipeStat){
        if(xDown - xUp >= minSwipeH ){
            swipe = false;
            swipeStat = true;
            setTimeout((function(){ swipeStat = false; }),400);
            closeDrawerMenu();
            // event.preventDefault();
        }
        if( xUp - xDown >= minSwipeH){
            swipe = false;
            swipeStat = true;
            setTimeout((function(){ swipeStat = false; }),400);
            //openDrawerMenu();
            // event.preventDefault();
        }

    }
});


/* handling if document is less than screen height size*/
function fixSmallDocLoadMore(){
    if($('body').height() <= window.innerHeight){
        loadProdList();
    }
}
setTimeout(fixSmallDocLoadMore,500);



/* if its a single pushing footer down */
function pushFooter(){
    if($('.product.single.container').length){
        $('.product.single.container').css('min-height',window.innerHeight-100);
    }
}
pushFooter();



/* updating size of youtube vid */
$('.youtubeVid').each(function () {
    var heightRatio = 9 / 16;
    var height = $(this).width() * heightRatio;
    $(theis).attr('height', height);
    $(this).height(height);
});
/* checking search bar status and updating button and fixing height issue for fixed header */
; (function () {
    if ($('.searchBox').hasClass('hide')) {
        $('.menubar').find('.icon-search').removeClass('clicked');
    }
    else {
        $('.menubar').find('.icon-search').addClass('clicked');
    }

    if($('header').height()>$('.headerSpacing').height()){
        $('.headerSpacing').height($('header').height());
    }

})();

; (function () {
    var qS = queryString();
    if (qS.startinr || qS.endinr || qS.property) {
        $('.filter').addClass('applied');
    }
})();

/*; (function () {
if (getCookie("fromAndroidApp") || $('body').hasClass('fromAndroidApp')) {
    $('.fullSite').hide();
} else {
    if(!getCookie("appPromotedOnce")) {
        setTimeout(function(){
            getPopup("/promote_app.html", "modal");
        }, 1000);
        setCookie("appPromotedOnce", "1", 24);
    }
}
})(); */

$('.fullSite').on('click', function () {
    fullSite();
    window.location = "http://www.mysmartprice.com";
    return false;
});
$('.list').find('.item').filter('.hasChild').on('click', function () {
    $(this).closest('section').find('.item').filter('.isChild').each(function () {
        $(this).toggleClass("hide");
    });
    return false;
});
$('.list').find('.item').filter('.viewMore').on('click', function () {
    $(this).closest('section').children('.item').filter('.hide').each(function () {
        $(this).removeClass("hide");
    });
    $(this).remove();
    return false;
});
$('.menubar').find('.icon-search').on('click', function () {
    $(this).toggleClass('clicked');
    $('.searchBox').toggleClass('hide');
});
$('.store').filter('.list').on('click', '.item', function (e) {
    if ($(e.target).hasClass('otherinfo') || $(e.target).closest('.otherinfo').length > 0) return;
    $(this).find('.expander').toggleClass('icon-plus-sign icon-minus-sign');
    $(this).find('.otherinfo').toggleClass('hide');
// console.log(e);
});
$('.store').filter('.list').on('click', '.item .visitStore',function (e) {
    e.stopPropagation();
});
$('.review').filter('.list').find('.item').find('.showmore').on('click', function (e) {
    $(this).parents('.item').find('.review_details').toggleClass('short');
    $(this).remove();
});
$(document).on('click', '.filters input[type="checkbox"]', function () {
    var $this = $(this);
    if ($this.closest('.selectAll').length == 1) filter_selectAll($this);
    else {
        if (!$this.is(':checked')) {
            $this.closest('.filters').find('.selectAll').find('input').prop('checked', false);
        } else {
            if ($this.closest('.list').find('input').length == $this.closest('.list').find('input').filter(':checked').length)
                $this.closest('.filters').find('.selectAll').find('input').prop('checked', true);
        }
    }
});

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function filter_selectAll($this) {
    if ($this.is(':checked')) {
        $this.closest('.filters').find('input[type="checkbox"]').each(function () {
            $(this).prop('checked', true);
        });
    } else {
        $this.closest('.filters').find('input[type="checkbox"]').each(function () {
            $(this).prop('checked', false);
        });
    }
}
function startLoading() {
    if ($('.loadingBg').length > 0){
        $('.loadingBg').show();
        return;
    }
    $('body').append('<div class="loadingBg"><div id="circleG">' +
        '<div id="circleG_1" class="circleG"></div>' +
        '<div id="circleG_2" class="circleG"></div>' +
        '<div id="circleG_3" class="circleG"></div>' +
        '</div></div>');
}
function startProdLoading() {
    if ($('.prodLoadingBg').length > 0){
        $('.prodLoadingBg').show();
        return;
    }
    $('body').append('<div class="prodLoadingBg hide"><div id="circleG">' +
        '<div id="circleG_1" class="circleG"></div>' +
        '<div id="circleG_2" class="circleG"></div>' +
        '<div id="circleG_3" class="circleG"></div>' +
        '</div></div>');
    setTimeout((function(){$('.prodLoadingBg').removeClass('hide');}),200);
}
function stopLoading() {
    if ($('.loadingBg').length > 0) $('.loadingBg').remove();
}
function stopProdLoading() {
    if ($('.prodLoadingBg').length > 0) {
        $('.prodLoadingBg').addClass('hide');
        setTimeout((function(){$('.prodLoadingBg').remove();}),300);
    }
}
function getPopup(url, type) {
    startLoading();
    if ($('.popupBox.' + type).length > 0 && $('.popupBox.' + type).attr('data-url') === url) {
        window.location.hash = 'popup' + type;
        showPopup(type);
        return;
    }
    if (url.indexOf("#") === 0) {
        var data = $(url).html();
        data = data.replace(/name=([\'\"])/gi,"name=$1popup_");
        if ($('.popupBox.' + type).length > 0) {
            removePopup(type);
        }
        if ($('.popupBg.' + type).length > 0)
            $('.popupBg.' + type).show();
        else $('body').append('<div class="popupBg ' + type + '"></div>');
        $('body').append('<div class="popupBox ' + type + '" data-url="' + url + '"><div class="filters popupContent">' + data + '</div></div>');
        window.location.hash = 'popup' + type;
        setTimeout((function () { showPopup(type); }), 500);
        return;
    }
    $.ajax({
        url: url,
        context: document.body
    }).done(function (data) {
        if ($('.popupBox.' + type).length > 0) {
            removePopup(type);
        }
        if ($('.popupBg.' + type).length > 0)
            $('.popupBg.' + type).show();
        else $('body').append('<div class="popupBg ' + type + '"></div>');
        $('body').append('<div class="popupBox ' + type + '" data-url="' + url + '">' + data + '</div>');
        window.location.hash = 'popup' + type;
        setTimeout((function () { showPopup(type); }), 500);
    }).fail(function () {
        stopLoading();
    });
}
function showPopup(type) {

    if ($('.popupBox.' + type).find('.productlistFilter').length) {
        var selectedFilter;
        var qS = queryString();
        if (qS.startinr) {
            $("#pricerange").find('.min').val(qS.startinr);
            $("#pricerange").find('.min').attr('value', qS.startinr);
        }
        if (qS.endinr) {
            $("#pricerange").find('.max').val(qS.endinr);
            $("#pricerange").find('.max').attr('value', qS.endinr);
        }
        if (qS.endinr || qS.startinr) {
            selectedFilter = "Rs. " + $('#pricerange').find('.min').val() + " - Rs. " + $('#pricerange').find('.max').val();
            $('.item').filter('[data-href="#pricerange"]').find('.selectionFilter').remove();
            $('.item').filter('[data-href="#pricerange"]').append('<div class="selectionFilter">' + selectedFilter + '</div>');
        }

        if (qS.property) {
            var filterRaw = qS.property.split("%7C");
            $.each(filterRaw, function (index, value) {
                $('.item').filter('[data-propid="' + filterRaw[index] + '"]').find('input').attr('checked', true);
                var propId = filterRaw[index].split('-')[0];
                var $inputList = $("#" + propId).find('.list').find('input');
                if ($inputList.length == $inputList.filter(":checked").length) {
                    $("#" + propId).find('.selectAll').find('input').attr('checked', true);
                }
            });
        }
        $('.secondaryPopup').filter(':not(#pricerange)').each(function () {
            selectedFilter = '';
            var popupId = $(this).attr("id");
            $(this).find('input').filter(':checked').each(function () {
                if (!$(this).closest('label').hasClass('selectAll')) {
                    var text = $(this).closest('label').text();
                    selectedFilter += text + ', ';
                } else {
                    selectedFilter = "All, ";
                    return false;
                }
            });
            selectedFilter = selectedFilter.substring(0, selectedFilter.length - 2);
            $('.item').filter('[data-href="#' + popupId + '"]').find('.selectionFilter').remove();
            if (selectedFilter !== '') {
                $('.item').filter('[data-href="#' + popupId + '"]').append('<div class="selectionFilter">' + selectedFilter + '</div>');
            }

        });


    }


    stopLoading();
    $('body').addClass('hasPopup');
    repositionPopup(type);
}
function repositionPopup(type) {
    var bodyH = $(window).innerHeight();
    var bodyW = $(window).innerWidth();
    var popupH, popupW, popupT, popupL;
    var $popupContent = $('.popupBox.' + type).find('.popupContent');

    if (type === "full") {
        popupH = bodyH;
        popupW = '100%';
        popupT = popupL = 0;
    }
    if (type === "modal") {
        if ($('.popupBox.modal').attr('data-oriHeight')) {
            popupH = $('.popupBox.modal').attr('data-oriHeight');
        }
        else {
            popupH = $('.popupBox.modal').height();
            $('.popupBox.modal').attr('data-oriHeight', popupH);
        }
        popupH = parseInt(popupH, 10) + $popupContent.find('.filterButtons, .popupButtons').outerHeight();
        popupW = $('.popupBox.modal').width();
        var topMargin = 10;
        popupH = Math.min(bodyH - (2 * topMargin), popupH);
        popupT = ((bodyH - popupH) / 2) + 'px';
        popupL = ((bodyW - popupW) / 2) + 'px';
    }
    $('.popupBg.' + type).show();
    /* setting the popup Position */

    $('.popupBox.' + type).css({
        width: popupW,
        height: popupH,
        left: popupL
    });
    /* to correct the position before slide down animation and not needed if already visible */
    if (parseInt($('.popupBox.' + type).css('top'), 10) < 0)
        $('.popupBox.' + type).css({
            top: -popupH
        });

    setTimeout((function () {
        $('.popupBox.' + type).addClass('animate').css({
            top: popupT
        });
    }), 200);
    
    var listHeight = popupH - $popupContent.find('.heading').outerHeight() - $popupContent.find('.filterButtons, .popupButtons').outerHeight();
    $popupContent.find('.list').height(listHeight);
}
function hidePopup(type) {
    if (!type) {
        var bodyH = $(window).innerHeight();
        $('.popupBox').css({
            top: -bodyH
        });
        setTimeout((function () { $('.popupBg').hide(); }), 500);
    }
    else {
        var popupH = $('.popupBox.' + type).height();
        $('.popupBox.' + type).css({
            top: -popupH
        });
        var isiPhone = ua.indexOf("iphone;") > -1;
        if(isiPhone)
          $(window).scrollTop(0);
        setTimeout((function () { $('.popupBg.' + type).hide(); }), 500);
    }
}
function removePopup(type, time) {
    hidePopup(type);
    if (!time) {
        $('.popupBox.' + type).remove();
        $('.popupBg.' + type).remove();
    }
    else
        setTimeout((function () { $('.popupBox.' + type).remove(); $('.popupBg.' + type).remove(); }), time);
}
$(document).on('click', '.openPopup', function () {
    var $this = $(this),
    url = $this.attr('data-href'),
    type = $this.attr('data-type');
    getPopup(url, type);
    return false;
});
$(document).on('click', '.filterButtons .cancel, .filterButtons .ok, .popupButtons .cancel, .popupButtons .ok', function () {
    history.back();
    var type = '';
    if ($(this).closest('.popupBox').hasClass('modal')) type = "modal";
    else type = "full";
    removePopup(type, 300);
});
$(document).on('click', '.heading .clearall', function () {
    $(this).closest('.popupBox').find('.secondaryPopup').find('input').each(function () {
        var inputType = $(this).attr('type');
        if (inputType == 'checkbox' || inputType == 'radio') {
            $(this).removeAttr('checked');
            $(this).prop('checked', false);

        }
        else {
            $(this).removeAttr('value');
            $(this).prop('value', undefined);
        }
    });
    var minPrice = $("#pricerange").find('.min').attr("min");
    var maxPrice = $("#pricerange").find('.max').attr("max");
    $("#pricerange").find('.min').val(minPrice);
    $("#pricerange").find('.max').val(maxPrice);
    $("#pricerange").find('.min').attr('value', minPrice);
    $("#pricerange").find('.max').attr('value', maxPrice);
    $('.item').find('.selectionFilter').remove();
    removePopup('modal');
});

$(document).on('change', 'select.sorting', function () {
    var name = $(this).attr('name'),
    val = $(this).val();
    window.location.href = updateQueryString(name, val);
});

$(document).on('change', '#priceSort', function () {
    var sortType = $(this).val();
    var rankList = [];
    var rankAttr = "";
    var rankNa = "";
    var $storeList = $('.store').filter('.list').filter(':not(.colors)');
    if (sortType === "relevance") {
        rankAttr = "relrank";
    } else if (sortType === "price:asc" || sortType === "price:desc") {
        rankAttr = "pricerank";
    }
    $storeList.find('.item').filter(':not(.noStores)').each(function () {
        var $storeitem = $(this);
        var rank = $storeitem.attr('data-' + rankAttr);
        if (parseInt(rank, 10)) {
            rankList.push(parseInt(rank, 10));
        }
        else rankNa = rank;
    });
    rankList = rankList.sort(function (a, b) { return a - b; });
    if (sortType === "price:desc") {
        rankList = rankList.reverse();
    }
    $.each(rankList, function (index, value) {
        $storeList.find('.item').filter('[data-' + rankAttr + '="' + rankList[index] + '"]').appendTo($storeList);
    });
    $storeList.find('.item').filter('[data-' + rankAttr + '="' + rankNa + '"]').each(function () {
        $(this).appendTo($storeList);
    });
});
$(document).on('click', '.filterButtons .apply, .popupButtons .apply', function () {

    if ($(this).closest('.popupBox').find('input[type="number"]').length) {
        var $priceRangeMin = $(this).closest('.popupBox').find('input[type="number"].min');
        var $priceRangeMax = $(this).closest('.popupBox').find('input[type="number"].max');
        var priceRangeMin = parseInt($priceRangeMin.val(), 10);
        var priceRangeMax = parseInt($priceRangeMax.val(), 10);
        var minval = parseInt($priceRangeMin.attr('min'), 10);
        var maxval = parseInt($priceRangeMin.attr('max'), 10);

        if (!isNumber(priceRangeMin) || !isNumber(priceRangeMax) || priceRangeMin < minval || priceRangeMin > maxval || priceRangeMax < minval || priceRangeMax > maxval || priceRangeMax < priceRangeMin) {
            alert("Enter Valid Price Range between Rs. " + minval + " and Rs. " + maxval);
            return;
        }
    }
    var emailID, ajaxURI;
    if ($(this).closest('.popupBox').find('input[type="email"]').length) {
        var email = $(this).closest('.popupBox').find('input[type="email"]').val();
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email)) {
            alert("Please enter valid Email ID.");
            return false;
        }
        else {
            emailID = email;
            ajaxURI = $(this).closest('.popupBox').find('.popupBody').attr('data-ajaxuri');
        }
    }
    history.back();

//saving values 
var popupId = $(this).closest('.popupBox').attr('data-url');

// saving for filters
var dataArr = [];
if (popupId.indexOf("#") === 0 && $(popupId).filter('.secondaryPopup').length == 1) {
    $(this).closest('.popupBox').find('.popupContent').find('input').each(function () {
        var inputType = $(this).attr('type');
        if (inputType == 'checkbox' || inputType == 'radio') {
            dataArr.push($(this).prop('checked'));
        }
        else {
            dataArr.push($(this).prop('value'));
        }
    });
    dataArr.reverse();
    //console.log(dataArr);
    $(popupId).filter('.secondaryPopup').find('input').each(function () {
        var val = dataArr.pop();
        var inputType = $(this).attr('type');
        if (inputType == 'checkbox' || inputType == 'radio') {
            if (val === false || !val) {
                $(this).removeAttr('checked');
                $(this).prop('checked',false);
            } else {
                $(this).attr('checked', true);
                $(this).prop('checked', true);
            }
        }
        else {
            $(this).attr('value', val);
            $(this).val(val);
        }
    });
}
else {
    //saving for watch
    if (emailID) {
        ajaxURI = updateQueryString('email', emailID, ajaxURI);
        $.ajax({
            url: ajaxURI,
            processData: false,
            accepts: 'html',
            dataType: 'script',
            complete: function (data) { }
        });
        alert('Thanks!');
    }
}

// showing saved value string for product list filter
if (popupId.indexOf("#") === 0 && $(popupId).filter('.secondaryPopup').closest('.popupBox').find('.productlistFilter').length) {
    var selectedFilter = "";
    if (popupId == "#pricerange") {
        selectedFilter = "Rs. " + $(popupId).find('.min').val() + " - Rs. " + $(popupId).find('.max').val();
    }
    else {
        $(popupId).filter('.secondaryPopup').find('input').each(function () {

            if ($(this).prop('checked') === true)
                if (!$(this).closest('label').hasClass('selectAll')) {
                    var text = $(this).closest('label').text();
                    selectedFilter += text + ', ';
                } else {
                    selectedFilter = "All, ";
                    return false;
                }

            });
        selectedFilter = selectedFilter.substring(0, selectedFilter.length - 2);
    }
    $('.item').filter('[data-href="' + popupId + '"]').find('.selectionFilter').remove();
    if (selectedFilter !== '') {
        $('.item').filter('[data-href="' + popupId + '"]').append('<div class="selectionFilter">' + selectedFilter + '</div>');
    }

}

// if popup is pricetable filter hiding the storelists
if ($(this).closest('.popupBox').find('.pricetablefilter').length) {
    var filterSingle = [];
    if ($(popupId).filter('.secondaryPopup').length == 1) {
        $(this).closest('.popupBox').find('.popupContent').find('input').each(function () {
            if ($(this).prop('checked') === true) {
                filterSingle.push($(this).val());
            }
        });
        var $storeList = $('.store').filter('.list');
        $storeList.find('.item').each(function () {
            var $storeitem = $(this);
            if (!$storeitem.closest('.secondaryPopup').length) {
                $storeitem.show();
                $.each(filterSingle, function (index, value) {
                    if ($storeitem.find('.otherinfo').find('.' + value).attr('data-avail') == "false") $storeitem.hide();
                    if ($storeitem.find('.otherinfo').find('.' + value).length === 0) $storeitem.hide();
                });
            }
        });
        if (filterSingle.length > 0) {
            $('.filter').addClass('applied');
        } else {
            $('.filter').removeClass('applied');
        }
        if ($storeList.find('.item').filter(':visible').length === 0) {
            $('.noStores').fadeIn();
        } else {
            $('.noStores').hide();
        }
    }
}

var href = window.location.href;
// if popup is product list filter
if ($(this).closest('.popupBox').find('.productlistFilter').length) {
    var property = "";
    $(this).closest('.popupBox').find('.secondaryPopup').each(function () {
        var id = $(this).attr("id");
        if (id == "pricerange") {
            if ($("#pricerange").find('.min').val() == $("#pricerange").find('.min').attr("min") && $("#pricerange").find('.max').val() == $("#pricerange").find('.max').attr("max")) {
                href = updateQueryString('startinr', undefined, href);
                href = updateQueryString('endinr', undefined, href);
            } else {
                href = updateQueryString('startinr', $("#pricerange").find('.min').val(), href);
                href = updateQueryString('endinr', $("#pricerange").find('.max').val(), href);
            }

        }
        else {
            $(this).find('input').each(function () {

                if ($(this).prop('checked') === true && !$(this).closest('label').hasClass('selectAll'))
                    property += $(this).closest('label').attr('data-propid') + "%7C";
            });
        }
    });
    if (property !== '') {
        href = updateQueryString('property', property, href);
    }
    else {
        href = updateQueryString('property', undefined, href);
    }
    if (_gaq) _gaq.push(['_trackEvent', 'html5_filter', 'apply', href ]);

    href = href.replace(window.location.hash, "");
    window.location.href = href;
}


// sort by
if ($(this).closest('.popupBox').find('.sortByFilter').length) {
    href = window.location.href;
    var sortbyval =  $(this).closest(".sortByFilter").find("input:checked").val();
    if (sortbyval !== '') {
        href = updateQueryString('sort', sortbyval, href);
    }
    else {
        href = updateQueryString('sort', undefined, href);
    }
    href = href.replace(window.location.hash, "");
    window.location.href = href;
}

});

$(window).on('hashchange', function () {
    var hash = window.location.hash;
    if (hash === '#popupfull') {
        hidePopup('modal');
        return;
    }
    if (hash === '#popupmodal') {
        return;
    }
    if (hash === '') {
        hidePopup();
        $('body').removeClass('hasPopup');
        return;
    }
});

$(window).resize(function () {
    if (this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function () {
        $(this).trigger('windowResize');
    }, 500);
});

$(window).on('windowResize', function () {
    //  alert('Height: '+$(this).height()+'px and Width: '+$(this).width()+'px');
    if (parseInt($('.popupBox.modal').css('top'), 10) >= 0)
        repositionPopup('modal');
    if (parseInt($('.popupBox.full').css('top'), 10) >= 0)
        repositionPopup('full');
});


$(window).scroll(function () {
    var $docheight = parseInt($(document).height(), 10);
    var $winheight = parseInt($(window).height(), 10);
    var offset = Math.min($winheight / 1.5, 600);
    if ($docheight - $(window).scrollTop() - $winheight < offset) {
        loadProdList();
    }
});

function queryString() {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], pair[1]];
            query_string[pair[0]] = arr;
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
}



function updateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");
    var hash = "";
    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}


function loadProdList() {
    if ($('.list').filter('.product').filter('.container').attr('data-scroll') != 'true') return;
    if (loadingProd || noMoreProd) return;
    loadingProd = true;
    startProdLoading();
    var $target = $('.list').filter('.product').find('.item').not('.viewMore');
    if($('.list.fashion').length == 1)
        $target = $('.list').filter('.product').find('.list-unit-out').not('.viewMore');
    var href = updateQueryString('ajax', '1');
    page_no++;
    href = updateQueryString('page_no', page_no, href);
    href = href.replace(window.location.hash, "");
    $.ajax({
        url: href
    }).done(function (data) {
        if(data.trim() !== ""){
            $target.last().after(data);
        }
        else{
            noMoreProd = true;
        }
        loadingProd = false;
        stopProdLoading();
    });
}



// cookie functions starts here
function addCookie(c_name, value, exhour) {
    var exdate = new Date();
    var exmillisec = exhour * 60 * 60 * 1000;
    exdate.setTime(exdate.getTime() + exmillisec);
    var c_value = escape(value) + ((exhour === null) ? "" : "; expires=" + exdate.toUTCString()) + "; path=/; domain=.mysmartprice.com";
    document.cookie = c_name + '=' + c_value + ';';
}
function setCookie(c_name, value, exhour){
    addCookie(c_name, value, exhour);
}
function removeCookie(c_name) {
    addCookie(c_name, '', -1);
}
function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}
// cookie functions end here
function arrayToString(arrayName) {
    var arrayString = "";
    for (; arrayName.length > 0;) {
        arrayString += arrayName[0] + "||";
        arrayName.splice(0, 1);
    }
    return arrayString;
}



function fullSite() {
    addCookie('fullSite', true, 2);
}

$("#searchTypeElectronics, #searchTypeBooks, #searchTypeFash").click(function(){
    $("#searchForm .searchField").focus();
});

function submitForm() {

    var form = document.getElementById('searchForm');

    var base_url = location.protocol + "//" + location.hostname + "/";

    form.action = base_url + "search/";

    if (document.getElementById('searchTypeElectronics').checked) {
        form.action = base_url + "search/";
    }

    if (document.getElementById('searchTypeBooks').checked) {
        form.action = base_url + "books/search/";
    }

    if (document.getElementById('searchTypeFash').checked) {
        form.action = base_url + "fashion/search/";
    }

    form.submit();
}



// Drawer menu
$(document).on('click','.menuOpen',function(){
    openDrawerMenu();
    if (_gaq) _gaq.push(['_trackEvent', 'html5_drawer', 'open', 'click' ]);
});


$(document).on('click','.menuClose, .menuCloseBg',function(){
    closeDrawerMenu();
});



$(document).on('click','.menulist.drawerChildItem',function(){
    var $this = $(this);
    if($this.data('href')){
        sStorage.activeMenu = $this.data('code');
        closeDrawerMenu();
        window.location = $this.data('href');
    }else{
        var index = $this.index('.menulist.drawerChildItem');
        currentObj = currentObj.h[index];
        pathStack.push(currentObj);
        $('.menulist.drawerChildItem').remove();
        createParentUI(currentObj);
        createChildrenUI(currentObj);
        savePath();
    }
});

$(document).on('click','.menulist.drawerBreadcrumItem',function(){
    var $this = $(this);
    if($this.hasClass('active')) return;
    var index = $this.index('.menulist.drawerBreadcrumItem');
    var back = $('.menulist.drawerBreadcrumItem').length - index - 1;
    menuBack(back);
    savePath();
});

$(document).on("click",".menuUp", function(){
    menuBack(1);
    savePath();
});

function getMenu(){
    $('.icon-reorder').addClass('animate');
    startLoading();
    $.ajax({
        url: "/fashion/menu.json",
        dataType: 'json',
        cache: true,
        success: function(data){
            globalMenu = data;
            stopLoading();
            $('.icon-reorder').removeClass('animate');
            openDrawerMenu();
        }
    });
}

function createMenu(){
    $('.populateMenu').html('');
    if (sStorage.menuPath){
        createMenuByPath(sStorage.menuPath);
    }else{
        currentObj = globalMenu;
        createParentUI(currentObj);
        createChildrenUI(currentObj);
    }
}

function openDrawerMenu(){
    if (!globalMenu){
        getMenu();
        return;
    }
    if($('.menulist').length === 0){
        createMenu();
    }
    $('body').addClass("hasPopup");
    setTimeout((function () {
      $(".drawerMenuWrapper").removeClass("drawerMenuHide");
    }), 200);
    if ($('.popupBg.menuCloseBg').length === 0)
        $('body').append('<div class="popupBg menuCloseBg"></div>');
    $('.popupBg.menuCloseBg').show();
}

function closeDrawerMenu(){
    if( !$('.drawerMenuWrapper').length || $('.drawerMenuHide').length) return;
    setTimeout((function () {
      $(".drawerMenuWrapper").addClass("drawerMenuHide");
    }), 200);
    $("body").removeClass("hasPopup");
    $(".popupBg.menuCloseBg").remove();
}

function getBreadcrumbUI(data){
  var ui = "<div class='menulist drawerBreadcrumItem hide' data-code='"+data.c+"'>"+data.n+"</div>";
  return ui;
}

function getChildUI(data){
    var dataHref="",
    extraClass = "",
    ellipsis = "";
    if(data.h.length === 0 || pathStack.length >= (levelLock-1)){
        dataHref="data-href='"+getURLJSON(data.t,data.c)+"'";
        extraClass += " leaf ";
    }else{
        ellipsis = '<i class="icon-ellipsis-horizontal"></i>';
    }
    if(data.c === sStorage.activeMenu){
        extraClass += " active ";
    }
    var ui = "<div class='menulist drawerChildItem hide"+extraClass+"' "+dataHref+" data-code='"+data.c+"'>"+data.n+ellipsis+"</div>";
    return ui;
}

function createChildrenUI(obj){
    if($('.drawerBreadcrumItem').length <= 1){
        $('.menuUp').hide();
        $('.menuClose').show();
    }else{
        $('.menuClose').hide();
        $('.menuUp').show();
    }

    $.each(obj.h, function( index, value ) {
        var ui = getChildUI(value);
        $('.populateMenu').append(ui);
        setTimeout((function(){$('.menulist.drawerChildItem.hide').removeClass('hide');}),200);
    });
}


function createParentUI(obj){
    if(obj.h.length === 0) {
        return;
    }
    var ui = getBreadcrumbUI(obj);
    $('.populateMenu').append(ui);
    $('.drawerBreadcrumItem.active').removeClass('active'); //to remove old active breadcrumb
    $('.drawerBreadcrumItem:last').addClass('active');
    setTimeout((function(){$('.menulist.drawerBreadcrumItem.hide').removeClass('hide');}),200);
}

function menuBack(n){
    if(n === undefined) n = 1;
    if(n < 0 ) n = 0;
    while(n--){
        pathStack.pop();
        var len = pathStack.length;
        currentObj = pathStack[len-1];
        $('.menulist.drawerBreadcrumItem:last').remove();
        $('.menulist.drawerBreadcrumItem:last').addClass('active');
    }

    $('.menulist.drawerChildItem').remove();
    if(!currentObj) {
        currentObj = globalMenu;
    }
    createChildrenUI(currentObj);
}



function savePath(){
  var path = "";
  $.each(pathStack, function( index, value ) {
    path += value.c + ";";
});
  sStorage.menuPath = path;
}

function createMenuByPath(menuPath){
    menuPath = menuPath.split(";");
    menuPath.pop();
    currentObj = globalMenu;
    createParentUI(currentObj);
    pathStack = [];
    $.each(menuPath, function( ind, val ) {
        var index;
        $.each(currentObj.h, function( i, v ) {
            if( val == v.c) index = i;
        });
        currentObj = currentObj.h[index];
        pathStack.push(currentObj);
    });

    $.each(pathStack, function( i, v ) {
        createParentUI(v);
    });
    createChildrenUI(currentObj);
}

function getURLJSON(t,c){
    var base_url = location.protocol + "//" + location.hostname + "/";
    if(t == "f") return base_url + "fashion/list/"+c;
    if(t == "e") return base_url + "lists/"+c;
    if(t == "d") return base_url + "deals";
    if(t == "b") return base_url + "books";
}

// New list page filter/sort bar
var scrolled = false;
var lastScrollTop = 0;
if($(".filtersFixed").length) {

    $(window).scroll(function (e) {
        scrolled = true;
    });
    setInterval(processFilterBar, 100);

}

function processFilterBar() {
 if (!scrolled) return;
 var scrollTop = $(window).scrollTop(),
 delta = 1;
 if (Math.abs(lastScrollTop - scrollTop) <= delta) return;
 if (scrollTop > lastScrollTop) {
        // Scroll Down
        $('.filtersFixed').css({
            bottom: '-50px'
        }, 300);
    } else {
        // Scroll Up
        if (scrollTop + $(window).height() < $(document).height()) {
            $('.filtersFixed').css({
                bottom: '0px'
            }, 300);
        }
    }
    lastScrollTop = scrollTop;
    scrolled = false;
}

function iPhonePositionFix() {
    var isiPhone = ua.indexOf("iphone;") > -1;
    if(isiPhone) {
        $("body").on("focus", "#searchForm .searchField", function() {
            $(window).scrollTop(0);
            $("header").addClass("fixfixed");
        });
        $("body").on("blur", "#searchForm .searchField", function() {
            $("header").removeClass("fixfixed");
        });
    }
}

function initAppPromoBanner() {
    if (getCookie("fromAndroidApp") || $('body').hasClass('fromAndroidApp')) {
        return;
    }
    var isAndroid = ua.indexOf("android") > -1;
    if(isAndroid) {
        var cookie_s = getCookie('apppromobanner');
        if(cookie_s=='hide'){
            return;
        }
        else{
            $(".appheader").slideDown("fast", function () {
                $(".headerSpacing").height($("header").height());
            });
            $("body").on("click", ".appheader .info .details .title, .appheader .interaction .download, .appheader .interaction .skip", function () {
                addCookie("apppromobanner", "hide", 24);
                $(".appheader").slideUp("fast", function () {
                    $(".headerSpacing").height($("header").height());
                });
            });
        }
    }
}

/* Carousel Plugin Script Begins Here */
/*
 * jQuery mCycle v0.1
 */

;
(function($, window, document, undefined) {

    "use strict";

    // Defaults are below
    var defaults = {
        mCycleItem: 'img', // the item which will be slided
        animTime: 500, // time taken in animation in milliseconds
        waitTime: 3000, // time for a slide to wait in milliseconds
        isAutoPlay: true, // isAutoPlay can be false for manual control
        direction: 'left', // direction can be 'left' of 'right'
        slideBullets: true, //show the slide bullets
        height: 'auto' //height of the mCycleCont (slide show container)
    };

    // The actual plugin constructor
    function mCycle(element, options) {
        this.element = element;

        // extending defaults with user options
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = "mCycle";
        this._autoPlayQueued = false;
        this._animating = false;

        this.init(true);

    }

    // Get the next slide for the animation in the given direction
    function getNextSlide($currentSlide, direction) {
        var $nextSlide;
        switch (direction) {
            case "left":
                $nextSlide = $currentSlide.next('.mCycleItemWrapper');
                break;
            case "right":
                $nextSlide = $currentSlide.prev('.mCycleItemWrapper');
                break;
        }

        if ($nextSlide.length) return $nextSlide;

        switch (direction) {
            case "left":
                $nextSlide = $currentSlide.parent().find('.mCycleItemWrapper:first');
                break;
            case "right":
                $nextSlide = $currentSlide.parent().find('.mCycleItemWrapper:last');
                break;
        }

        return $nextSlide;
    }


    mCycle.prototype = {

        init: function(firstTime) {

            if (!firstTime) return;

            var $elem = $(this.element),
                mCycleItemCount = $elem.find(this.options.mCycleItem).length,
                elemHeight = 0;


            $elem.addClass('mCycleCont').find(this.options.mCycleItem).each(function(index) {
                var $mCycleItem = $(this);
                $mCycleItem.addClass('show')
                    .wrap('<div class="mCycleItemWrapper" data-count="' + (index + 1) + '"></div>');

                elemHeight = Math.max($mCycleItem.height(), elemHeight);


            });

            if (parseInt($elem.height(), 10) === 0 && this.options.height === 'auto') {
                $elem.height(elemHeight);
            } else if (this.options.height !== 'auto') {
                $elem.height(this.options.height);
            }

            $elem.find('.mCycleItemWrapper:first').addClass('mCycleItemCurrent');


            if (this.options.slideBullets) {
                $elem.append('<div class="mCycleSlideBullets"></div>');

                var mCycleSlideBulletCount = mCycleItemCount;
                while (mCycleSlideBulletCount--) {
                    $elem.find('.mCycleSlideBullets').append('<div class="mCycleSlideBullet"></div>');
                }

                $elem.find('.mCycleSlideBullet').eq(0).addClass('active');
            }


            if (this.options.isAutoPlay && mCycleItemCount > 1) { // start sliding if it is autoplay 
                var that = this;
                
                that._autoPlayQueued = true;

                setTimeout((function() {
                    that._autoPlayQueued = false;
                    if (that.options.isAutoPlay) that.slide();
                }), that.options.waitTime);

            }

        },

        play: function() {
            if (this.options.isAutoPlay) return;
            this.options.isAutoPlay = true;
            this.slide();
        },

        pause: function() {
            this.options.isAutoPlay = false;
        },

        reverse: function() {
            this.options.direction = (this.options.direction === 'left') ? 'right' : 'left';
        },
        slideLeft: function() {
            this.slide('left');
        },
        slideRight: function() {
            this.slide('right');
        },
        slide: function(direction) {

            if (this.options.isAutoPlay && this._autoPlayQueued || this._animating) return; // to stop multiple instance of slide when on autoplay

            direction = direction || this.options.direction;

            var $currentSlide = $(this.element).find('.mCycleItemCurrent'),
                $nextSlide = getNextSlide($currentSlide, direction),
                prevSlideLeftOffset,
                nextSlideClass;

            switch (direction) {
                case 'left':
                    nextSlideClass = 'mCycleItemNext';
                    prevSlideLeftOffset = '-100%';
                    break;
                case 'right':
                    nextSlideClass = 'mCycleItemPrev';
                    prevSlideLeftOffset = '100%';
                    break;
            }

            if ($nextSlide.hasClass('mCycleItemCurrent')) return; // if current slide is same as next slide

            $nextSlide.addClass(nextSlideClass);

            var that = this;

            this._animating = true;

            setTimeout((function() {

                // making current slide the prev slide

                $currentSlide.css({
                    '-webkit-transition': 'all ' + (that.options.animTime) / 1000 + 's',
                    'transition': 'all ' + (that.options.animTime) / 1000 + 's',
                    '-webkit-transform': 'translateX(' + prevSlideLeftOffset + ')',
                    'transform': 'translateX(' + prevSlideLeftOffset + ')'
                });

                // making next slide the current slide

                $nextSlide.css({
                    '-webkit-transition': 'all ' + (that.options.animTime) / 1000 + 's',
                    'transition': 'all ' + (that.options.animTime) / 1000 + 's',
                    '-webkit-transform': 'translateX(0)',
                    'transform': 'translateX(0)'
                });


                setTimeout((function() {

                    $currentSlide.removeClass('mCycleItemCurrent').removeAttr('style');
                    $nextSlide.toggleClass(nextSlideClass + ' mCycleItemCurrent').removeAttr('style');

                    if (that.options.slideBullets) {
                        var $elem = $(that.element),
                            count = $elem.find('.mCycleItemCurrent').data('count');

                        $elem.find('.mCycleSlideBullet.active').removeClass('active');
                        $elem.find('.mCycleSlideBullet').eq(count - 1).addClass('active');
                    }

                    that._animating = false;
                    if(that.options.isAutoPlay){
                        that._autoPlayQueued = true; // auto call for slide is queued if on autoplay
                        setTimeout((function() {
                            if (that.options.isAutoPlay && that._autoPlayQueued) {
                                that._autoPlayQueued = false;
                                that.slide();
                            }else{
                                that.options.isAutoPlay = false;
                                that._autoPlayQueued = false;
                            }
                        }), that.options.waitTime);
                    }



                }), that.options.animTime + 10); //adding 10ms to make sure animation is complete

            }), 1);


        }
    };


    $.fn["mCycle"] = function(options) {
        return this.each(function() {
            if (!$.data(this, "mCycle")) {
                // preventing against multiple instantiations
                $.data(this, "mCycle", new mCycle(this, options));
            } else {
                var mCycleObj = $.data(this, "mCycle");
                // checking if option is a valid function name
                if (typeof options === "string" && mCycleObj[options]) {
                    mCycleObj[options].call(mCycleObj);
                } else if(typeof options === "object"){
                    // if the option is object extending it with initalized object
                    mCycleObj.options = $.extend({}, mCycleObj.options, options);
                }
            }
        });
    };

})(jQuery, window, document);

/* Carousel Plugin Script Ends Here */

var slideTimeout;
$(".widget-carousel").mCycle({
    mCycleItem: "a"
});
$(".widget-carousel").on("click", ".prev-button", function () {
  $(".widget-carousel").mCycle("pause").mCycle("slideRight");
  resetSlideTimeout();
});
$(".widget-carousel").on("click", ".next-button", function () {
  $(".widget-carousel").mCycle("pause").mCycle("slideLeft");
  resetSlideTimeout();
});
function resetSlideTimeout() {
  clearTimeout(slideTimeout);
  slideTimeout = setTimeout(function () {
    $(".widget-carousel").mCycle("play");
  }, 10000);
}

$(document).ready( function(){
	
	// var _UA = window.navigator.userAgent.toLowerCase();
	
	// if(_UA.substring(_UA.indexOf("chrome/")+7,_UA.lastIndexOf("chrome/") + 9) > 44){
	// 	$('.compare-tbl__col').css('width','225px');
	// 	$('.compare-tbl__spec').css('padding-left','10px');
	// }

	setCookie('compareIDs',getUrlParameter('mspids'));
	setCookie('compareSubCategory',getUrlParameter('subcategory'));
		
	// autocomplete processing start here
	compareAutoComplete(); // initializing the autoComplete
	// autocomplete processing end here

	$("#othr_ftr_sbtl .expand-collapse").click(); // to close the other features subtable at the start

	// hide the highlight CB if number of compare products < 3
	var product_count = $('.fix-container .compare-tbl__col[data-mspid]').length;
	var expert_product_count = $('.compare-toprow .pie-score').length;
	
	if(expert_product_count < 3){  
		$('.compare-tbl__spec .compare-tbl__cb').hide()
	}

	if(!product_count){
		removeCookie('compareSubCategory');
		removeCookie('compareIDs');
	}

	$(window).scroll(function() {
		var theLoc = $('.compare-tbl__subhead').position().top;

		if(theLoc >= $(window).scrollTop() + 140) {
			$('#compareFix').hide();
			$('.sub-header').show();
			$('.ui-autocomplete').hide();	
			$('.srch-wdgt__fld').val("");
		} else { 
			$('#compareFix').show();
			$('.sub-header').hide();

			var exprtCmprBottom = $('.expert-cmpr').offset().top + $('.expert-cmpr').outerHeight();
			if(($(window).scrollTop() >= exprtCmprBottom - 160) || !exprtCmprBottom || expert_product_count < 3){  // hide the 2 checkboes in case of not expert compare
				$('.compare-tbl__spec .compare-tbl__cb').hide()
			}
			else
				$('.compare-tbl__spec .compare-tbl__cb').show()
		}
	});


	// add highlight class to different rows but not when all cells are different
	$('.expert-cmpr .compare-subtbl__content .compare-tbl__row').each(function(){
		if($(this).find('[data-isdifferent]').length < product_count)		
			$(this).find('[data-isdifferent]').addClass('highlight');	
	});


 // For filling the pie : START
	var score;
	 $(".compare-toprow .pie-score").each( function(){   // for the overall score pie
	 	score = $(this).data("score");
		$(this).find(".pie__score").html(score);

		$(this).find(".left-side").css('transform','rotate(' + score*3.6 + 'deg) '); //left rotate
		$(this).find(".left-side").css('-ms-transform', 'rotate(' + score*3.6 + 'deg) '); // for IE8

		if(score >= 50){
			$(this).find(".pie").addClass("keep-left-pie");  // pie left dont clip			
			$(this).find(".right-side").css('transform', 'rotate(180deg) ');//right rotate 180 deg
		}else{
			$(this).find(".right-side").css("display","none");  // right side dont display
		}

		switch(score) {
		    case checkRange(score, 0, 20):
		        $(this).find(".half-circle").css('border-color', '#cc0000'); 
		        break;
		    case checkRange(score, 20, 40):
		        $(this).find(".half-circle").css('border-color', '#f57900'); 
		        break;
		    case checkRange(score, 40, 60):
		        $(this).find(".half-circle").css('border-color', '#e8d700'); 
		        break;
			case checkRange(score, 60, 80):
		        $(this).find(".half-circle").css('border-color', '#73d216'); 
		        break;
		    case checkRange(score, 80, 100):
		        $(this).find(".half-circle").css('border-color', '#4e9a06'); 
		        break;    
		    default:
		        $(this).find(".half-circle").css('border-color', '#4e9a06'); 
		}
	 })

	 $(".compare-tbl__subhead .pie-score").each( function(){
	 	score = $(this).data("score");
		$(this).find(".pie__score").html(score);

		$(this).find(".left-side").css('transform','rotate(' + score*36 + 'deg) '); //left rotate
		$(this).find(".left-side").css('-ms-transform', 'rotate(' + score*36 + 'deg) '); // for IE8

		if(score >= 5){
			$(this).find(".pie").addClass("keep-left-pie");  // pie left dont clip
			$(this).find(".right-side").css('transform', 'rotate(180deg) ');//right rotate 180 deg
		}else{
			$(this).find(".right-side").css("display","none");  // right side display none
		}

		switch(score) {
		    case checkRange(score, 0, 2):
		        $(this).find(".half-circle").css('border-color', '#cc0000'); 
		        break;
		    case checkRange(score, 2, 4):
		        $(this).find(".half-circle").css('border-color', '#f57900'); 
		        break;
		    case checkRange(score, 4, 6):
		        $(this).find(".half-circle").css('border-color', '#e8d700'); 
		        break;
			case checkRange(score, 6, 8):
		        $(this).find(".half-circle").css('border-color', '#73d216'); 
		        break;
		    case checkRange(score, 8, 10):
		        $(this).find(".half-circle").css('border-color', '#4e9a06'); 
		        break;    
		    default:
		        $(this).find(".half-circle").css('border-color', '#4e9a06'); 
		}
	 })


	 function checkRange(score, min, max) {
	    if (score >= min && score < max) { return score; }
	    else { return !score; }
	 }

 // For filling the pie : END

	$('.callout-target').on('hover', function(){
		if($('.callout-target').data('callout').length > '400'){
	 	$('.callout').css('font-size','23px !important');
	 }
	});
	
});

var getUrlParameter = function getUrlParameter(sParam) {

	if(sParam == "mspids"){
		return $('.gridheader').data('mspids');
	}else if(sParam == "subcategory"){
		return $('.gridheader').data('subcategory');
	}

    // var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    //     sURLVariables = sPageURL.split('&'),
    //     sParameterName,
    //     i;

    // for (i = 0; i < sURLVariables.length; i++) {
    //     sParameterName = sURLVariables[i].split('=');

    //     if (sParameterName[0] === sParam) {
    //         return sParameterName[1] === undefined ? true : sParameterName[1];
    //     }
    // }
};

$(".expand-collapse").on('click', toggleSlider);

function toggleSlider(){
	var $subTable = $(this).closest(".compare-subtbl");
	var $slider = $subTable.find(".compare-subtbl__content");
	// slider.toggle();
    if ($subTable.hasClass('opened')) {
    	$(this).attr("src", "http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/plus_icon.png");
        $subTable.removeClass('opened').addClass('closed');
        $slider.slideUp("slow");
    } else {
    	$(this).attr("src", "http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/minus_icon.png");
        $subTable.removeClass('closed').addClass('opened');
        $slider.slideDown("slow");
    }
}

// Highlight function add do-highlight class to compare-tbl
$(".show-diff").on('click', function(){
		$(".compare-tbl").toggleClass("do-highlight");

		// for handling both the checkboxes
		if($(this).attr('checked')){
        	$(".show-diff").attr('checked', true);
	    }
	    else{
	        $(".show-diff").attr('checked', false);
	    } 
});

$(".showOnlyDiff").on('click', function(){

	// for handling both the checkboxes
		if($(this).attr('checked')){
        	$(".showOnlyDiff").attr('checked', true);
	    }
	    else{
	        $(".showOnlyDiff").attr('checked', false);
	    } 
	    
	$('.expert-cmpr .compare-subtbl__content .compare-tbl__row').each(function(){
		if($('.showOnlyDiff').attr('checked')){
			if($(this).find('[data-isdifferent]').length == 0)		
				$(this).slideUp("slow");
		}
		else{
			$(this).slideDown("slow");
		}
	});
});

function addParameterToURL(){
	var mspids = getCookie('compareIDs').toString(), 
		pathname = $('.gridheader').data('non_seo_url_pn'),
		param = "mspids="+mspids+"&subcategory="+(getCookie('compareSubCategory') || "");
		
    _url = location.href;
    _url= pathname + '?' + param;
    location.replace(_url);
}

$(".remove").add(".gridheader .compare-product").on('click', function(){
	var remove_id;

	if($(this).hasClass('remove'))
		remove_id = $(this).parent().data('mspid');
	else 	
		remove_id = $(this).data('mspid');

	setCookie('compareIDs',getUrlParameter('mspids'));
	setCookie('compareSubCategory',getUrlParameter('subcategory'));
	removeFromCookie(remove_id);
	
	var productsCount = $('.gridheader .compare-product').length;
	if(productsCount <= 1 ){
		removeCookie("compareSubCategory");
	}

	addParameterToURL();
});

$(".srch-wdgt__fld").on('change', function(){
	addParameterToURL();
});

function setCookieCompareIDS(newMSPID){

	var compare_msp_ids = [],cookie_mspids = getUrlParameter('mspids');
	if(cookie_mspids){
		compare_msp_ids = cookie_mspids.split(",");
	}
	if(newMSPID){
    	compare_msp_ids.push(newMSPID);
    }

    setCookie('compareIDs',compare_msp_ids); 
}

function removeFromCookie(id){
	var arr_mspids = (getCookie('compareIDs') || "").split(","),
    remove_id = id.toString(),
    position = $.inArray(remove_id, arr_mspids);

	if ( ~position ) 
		arr_mspids.splice(position, 1);	

	setCookie('compareIDs',arr_mspids); 
}

// autocomplete functions start here
function compareAutoComplete() {
	var prod_count = $('.fix-container .compare-tbl__col[data-mspid]').length;
    if ($(".js-atcmplt")
        .length !== 0) {

        $(".js-atcmplt")
            .autocomplete({
                minLength: 1,
                delay: 110,
                autoFocus: false,
                max: 10,
                open: function(event, ui) {
                    $parent = $(this).closest(".srch-wdgt");
                    $(".ui-menu").css({
                        "width": $parent.width()+2,
                        "left": "-1px",
                        "top": "1px"
                    });
                    $parent.addClass("srch-wdgt--show-rslt");
                },
                close: function(event, ui) {
                    $(this).closest(".srch-wdgt").removeClass("srch-wdgt--show-rslt");
                },
                source: function(request, response) {
                    var term = $.trim(request.term.toLowerCase()),
                        element = this.element,
                        category = getUrlParameter('subcategory'),
                        //element is search bar
                        autocompleteCache = this.element.data('autocompleteCache') || {},
                        //initializing autocompleteCache
                        foundInAutocompleteCache = false; //flag will be set to true if term found in autocompleteCache
                    if (term in autocompleteCache && autocompleteCache[term].length !== 0) {
                        response(autocompleteCache[term]);
                        foundInAutocompleteCache = true;
                    }

                    if (foundInAutocompleteCache) return;

                    request.term = term;
                    request.subcategory = category;
                    request.mspids = getUrlParameter('mspids');
                    $.ajax({
                        url: "/compare/auto_suggest.php",
                        dataType: "json",
                        data: request,
                        success: function(data) {
                            data = $.map(data, function(n, i) {
                                n['index'] = i;
                                return n;
                            });
                            autocompleteCache[term] = data;
                            element.data('autocompleteCache', autocompleteCache);
                            response(data);

                        }
                    });
                },
                select: function(event, ui) {
                    var $form = $(this)
                        .closest('form');
                    $form.find('.js-atcmplt')
                        .val(ui.item.value);
                    $form.find('.js-atcmplt-id').val(ui.item.mspid); // add to cookie
                    setCookieCompareIDS(ui.item.mspid);

					if(prod_count < 1)
                    	setCookie('compareSubCategory',ui.item.subcategory);
                	else
						setCookie('compareSubCategory',getUrlParameter('subcategory'));
					
                    addParameterToURL();
                    // $form.find('.srch-wdgt__srch-sbmt')
                    //     .click();
                }
            })
            .data('uiAutocomplete')
            ._renderItem = function(ul, item) {
                var term = this.term.split(' ')
                    .join('|'),
                    re = new RegExp("\\b(" + term + ")", "gi"),
                    tempval = item.value.replace(re, "<b>$1</b>");
                // if (item.subcategory !== "") tempval += " in <span style='color:#c00;font-weight:bold;'>" + item.subcategory + "</span>";
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + tempval + "</a>")
                    .appendTo(ul);
            };
    }
}
// autocomplete functions end here



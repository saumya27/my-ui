var DEFAULT_IMAGE_PATH = "http://doypaxk1e2349.cloudfront.net/icons/user-default.png";
var DEFAULT_LOGIN_NAME = "My Account";

$(document).ready(function() {
  // Feedback button load
    var feedbackbutton = '<span data-href="feedback.html" class="js-popup-trgt text-link"><img style="position:fixed;right:0;top:0;bottom:0;margin:auto 0;" src="http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/feedback.png" /></span>';
    $("body").append(feedbackbutton);
  
  //Event Hadler for Logout
  $(document).on("click", ".js-user-lgt", function() {
    logoutme();
  });
  // Login UI update on page load. Will be shifted to msp.js when login is unified with Fashion.
  update_ui();

  // For page count
  countPages();

  getAutopopupURL($(".auto-popup-data"));



  
  var subcategory = $('#msp_body').attr('category');
  $.ajax({
      type:'GET',
      url:"http://www.mysmartprice.com/msp/deals/rightsidebar_json.php?subcategory="+subcategory,
      dataType:'json',success:function(data){$.each(data,function(index,item){
        if($("#"+item.id).length>0){
          $("#"+item.id).append(item.content);
        }
      });
    }
  });
  
  // Deals and Recent Views in Bottom of Page AJAX call
  $.ajax({ 
    type: 'GET', 
    //url: "http://www.mysmartprice.com/msp/deals/rightsidebar_json.php?subcategory="+subcategory,
    url: "records.json",
    dataType: 'json',
    success: function (data) { 
        $.each(data, function(index, item) {
            if($("." + item.clas).length>0) {
                $("." + item.clas).append(item.content);
               elementSlider.init($("." + item.clas + " .js-sldr"));
            }
        });
    }
  });

  // OLX banner AJAX call
  $("#olx_banner").load("/promotions/ads/olx_banner.htm");

  // Sidebar recommendations "view_all" button scrolls upto tabs
  var loc = window.location.href;
  if ($(".product_bottom_sec").length) {
    if (loc.indexOf("view_all") > 0 && loc.indexOf("alternatives") > 0) {
      $("html, body").animate({
        scrollTop: ($(".product_bottom_sec").position().top - 50) + "px"
      });
    }
  }
});


// LOGIN FUNCTIONS START HERE

var loginCallbackQueue = [];

function loginCallback(fn, context, params) {
  if (getCookie("msp_login") == "1")
    fn.apply(context, params);
  else {
    loginCallbackQueue.push(function () {
      fn.apply(context, params);
    });
    $(".js-lgn").eq(0).click();
  }
}

// try {
//   $(".various").fancybox({
//     fitToView: false,
//     width: "auto",
//     height: "auto",
//     padding: 10,
//     beforeClose: function () {
//       setTimeout(function () {
//         // If user is not logged in and login/register/forgot password popup is not visible,
//         // user has cancelled logging in, so clear the callback queue
//         if (getCookie("msp_login") != "1" && !$(".fancybox-overlay").filter(":visible").length)
//           loginCallbackQueue = [];
//       }, 1000);
//     }
//   });
// } catch (err) {
//   console.log("Error in JS for fancybox");
// }

function update_ui() {
  var msp_login = getCookie("msp_login"),
      msp_user_image = getCookie("msp_user_image"),
      msp_login_name = getCookie("msp_login_name") || getCookie("msp_login_email");
    if (msp_login == "1") {
        $(".acnt").hide();
        $(".js-user-lgt").show();
        $(".js-user-name").text(msp_login_name);
        if (msp_user_image)
            $(".user-img").attr("src", msp_user_image);
    } else {
        $(".js-user-lgt").hide();
        $(".js-user-name").text(DEFAULT_LOGIN_NAME);
        $(".user-img").attr("src", DEFAULT_IMAGE_PATH);
        $(".acnt").show();
    }
}

function loginme(msg) {
  setCookie("msp_login", "1", 365);
  if (msg.indexOf(",") > -1) {
    var responseInfo = msg.split(",");
    setCookie("msp_login_uid", responseInfo[0], 365);
    setCookie("msp_login_email", responseInfo[1], 365);
    msg = responseInfo[1];
  } else
    setCookie("msp_login_email", msg, 365);
  var wiz_uid = get_uid(),
      wiz_msg = '"' + msg + '"';
  wizrocket.profile.push({
    "Site": {
      "Identity": wiz_uid,
      "Email": wiz_msg
    }
  });
  $.get("http://www.mysmartprice.com/users/set_username_cookie.php", {
    email: msg
  }, function (name) {
    setCookie("msp_login_name", name, 365);
  });
  update_ui();
  while (loginCallbackQueue.length)
    (loginCallbackQueue.shift())();
}

function loginme_by_fb(msg, img) {
  setCookie("msp_user_image", img, 365);
  loginme(msg);
}

function logoutme() {
  setCookie("msp_login", "", -1);
  setCookie("msp_login_email", "", -1);
  setCookie("msp_user_image", "", -1);
  update_ui();
}

// LOGIN FUNCTIONS END HERE


// Count no. of pages visited by user
function countPages() {
  var number = getCookie("num_pages");
  if (!number) number = 1;
  else number = parseInt(number, 10) + 1;
  setCookie("num_pages", number, 7);
}


// I can't find any usage for this function - Rohit
function trackLink(category, action, label, value, link) {
  if (typeof(_gaq) === "undefined") return;
  try {
    _gaq.push(["_trackEvent", category, action, label, value]);
  } catch (err) {}
  setTimeout((function() {
    location.href = link;
  }), 400);
  return false;
}
/*
  // How to use:
  <a onclick="return trackLink('something','somewhere','somehow', null, this.href);" href="/link/to/page">Link</a>
*/
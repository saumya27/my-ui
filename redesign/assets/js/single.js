var PriceTable = {
    "dataPoints" : {
        "mspid" : $(".prdct-dtl__ttl").data("mspid"),
        "defaultRows" : $(".prc-tbl__row:visible").length,
        "variant" : {
            "model" : $(".prdct-dtl__ttl-vrnt").data("model"),
            "size" : $(".prdct-dtl__ttl-vrnt").data("size")
        },
        "price" : {
            "getMrp" : function() { return $(".prdct-dtl__slr-prc-mrp-prc").data("value") },
        },
        "getSelectedColor" : function() { return $(".avlbl-clrs__item--slctd").data("value") },
        "getAppliedSort" : function() { return $(".js-prc-tbl__sort").val(); },
        "getAppliedFilters" : function() {
            var result = [];
            $(".prc-tbl__fltrs-item").each(function() {
                if ($(this).hasClass("prc-tbl__fltrs-item--slctd")) {
                    result.push($(this).data("filter"));
                }
            });
            return result;
        },
        "getSelectedCategory" : function() {
            return $(".prc-tbl__ctgry-item--slctd").data("value");
        }
    },
    "init" : function() {
        var $pageTitle = $(".prdct-dtl__ttl");
    
        if ($pageTitle.data("offlinedelivery") == "1") {
            /** 
            * TODO:: remove comment before going to prod.
            * PriceTable.update.byCategory("recommended");
            */
        }
        
        // select color and updatePage.
        $("body").on("click", ".avlbl-clrs__item", function() {
            var $this = $(this),
                $variant = $(".prdct-dtl__ttl-vrnt"),
                $clearColor = $(this).closest(".prdct-dtl__vrnt-clr").find(".prdct-dtl__vrnt-cler"),
                model = $variant.data("model"),
                size = $variant.data("size"),
                colorValue = $this.data("value");
            $(".avlbl-clrs__item").not($this).removeClass("avlbl-clrs__item--slctd");
            $this.toggleClass("avlbl-clrs__item--slctd");
            if ($this.hasClass("avlbl-clrs__item--slctd")) {
                $clearColor.show();
                $variant.text("(" + (model ? model + ", " : "") + colorValue + (size ? ", " + size : "") + ")");
            } else {
                $clearColor.hide();
                $variant.text((model || size) ? ("(" + (model ? (size ? model + ", " : model) : "") + (size || "") + ")") : "");
            }
            PriceTable.update.byFilter();
        });

        // clear selected color and updatePage.
        $("body").on("click", ".avlbl-clrs__cler", function() {
            $(".avlbl-clrs__item--slctd").removeClass("avlbl-clrs__item--slctd");
            var model = PriceTable.dataPoints.variant.model,
                size = PriceTable.dataPoints.variant.size;
            $variant.text((model || size) ? ("(" + (model ? (size ? model + ", " : model) : "") + (size || "") + ")") : "");
            $(this).hide();
            PriceTable.update.byFilter();
        });

        // load the variant page selected.
        $("body").on("click", ".avlbl-sizes__item", function() {
            var $this = $(this);
            if (!$this.hasClass("avlbl-sizes__item--slctd")) {
                window.location.href = $this.data("href");
            }
        });

        // switch between recommended, online, offline pricetables.
        $("body").on("click", ".prc-tbl__ctgry-item", function() {
            var $this = $(this),
                isSelected = $this.hasClass("prc-tbl__ctgry-item--slctd");
                
            if (!isSelected) {
                $(".prc-tbl__ctgry-item").removeClass("prc-tbl__ctgry-item--slctd");
                $this.addClass("prc-tbl__ctgry-item--slctd");
                
                PriceTable.update.byCategory($this.data("value"));
            }
        });

        // apply filters to current pricetable.
        $('body').on('click', '.prc-tbl__fltrs-item', function() {
            $(this).toggleClass("prc-tbl__fltrs-item--slctd");
            PriceTable.update.byFilter();
        });
        
        // sort current pricetable.
        $('body').on('change', '.js-prc-tbl__sort', function() {
            var sortby = $(this).val();
            PriceTable.sort(sortby);
        });

        // show more stores.
        $('body').on('click', '.js-prc-tbl__shw-mr', function() {
            var $this = $(this),
                $priceLines = $(".prc-tbl__row"),
                isCollapsed = $this.data("collapsed"),
                defaultRows = PriceTable.dataPoints.defaultRows;
            $priceLines.slice(defaultRows).slideToggle();
            if (isCollapsed) {
                $this.text("Less Stores");
                $("body").animate({
                    scrollTop: $priceLines.eq(defaultRows - 1).offset().top - $(".hdr-size").height()
                });
                $this.data("collapsed", false);
            } else {
                $this.text("Show More Stores");
                $("body").animate({
                    scrollTop: $priceLines.eq(defaultRows).offset().top - $(window).height() + $(".hdr-size").height()
                });
                $this.data("collapsed", true);
            }
        });

        /* more offers message box handlers - start */
        $("body").on("click", ".js-xtrs-msg-box-trgt", function handler(e) {
            var $popupCont = $(this),
                mspid, currentColour, storename, offerDetails, offersMsgBoxHtml;

            handler.popupData = handler.popupData || {};
            if (!$popup.is(":visible")) {
                mspid = PriceTable.dataPoints.mspid;
                storename = $(this).closest(".prc-tbl__row").data("storename");
                currentColour = PriceTable.dataPoints.getSelectedColor() || "default";
                
                if (handler.popupData.colour !== currentColour) {
                    PriceTable.fetch.offersPopups.done(function(response) {
                        handler.popupData.content = response;
                        offerDetails = response[storename];
                    
                        offersMsgBoxHtml = PriceTable.templates.offersMsgBox(offerDetails);
                        $popupCont.append(offersMsgBoxHtml);
                        $popupCont.find(".msg-box").addClass("msg-box--show");
                    });
                } else {
                    offerDetails = handler.popupData.content[storename];
                    offersMsgBoxHtml = PriceTable.templates.offersMsgBox(offerDetails);
                    
                    $popupCont.append(offersMsgBoxHtml);
                    $popupCont.find(".msg-box").addClass("msg-box--show");
                }
            }

            return false;
        });

        $(".js-xtrs-msg-box__cls").on("click", function() {
            $(this).closest(".msg-box").remove();
        });
        /* more offers message box handlers - end */

        // close all message boxed and pricealert on pressing escape key
        $('body').keydown(function(e) {
            if (e.which == 27 && $('.closepricelart').is(':visible')) {
                $('.closepricelart').click();
            }
            if (e.which == 27 && $('.msg-box').is(':visible')) {
                $('.js-msg-box__cls, .js-xtrs-msg-box__cls').click();
            }
        });

        (function locationFilterHandlers() {
            var isChrome = MSP.utils.browser.name === "chrome",
                isLocationStored;

            if (navigator.geolocation) {
                // check if location data stored in localStorage.
                isLocationStored = !!window.localStorage.userLatitude;

                // show geolocation button if geolocation API supported.
                $(".prc-tbl__lctn-gps").show();
                // if chrome, then update localStorage value onload itself.
                if (isChrome && isLocationStored) {
                  $(".prc-tbl__lctn-gps").click();
                }

                // get GPS location and update datapoints and pricetable.
                $doc.on("click", ".prc-tbl__lctn-gps", function() {
                    isLocationStored = !!window.localStorage.userLatitude;

                    /**
                     * if chrome and location not available in localStorage,
                     * then open overlay to focus permission popup
                     */
                    if (isChrome && !isLocationStored) {
                        $(".js-glctn-ovrly").addClass("js-ovrly--show");
                        $("body").css("overflow", "hidden");
                    }

                    navigator.geolocation.getCurrentPosition(locationSuccess, locationFail);

                    function locationSuccess(position) {
                        var latitude = position.coords.latitude,
                            longitude = position.coords.longitude;

                        /**
                         * 1. update localStorage values for fallback when permission denied.
                         * 2. for chrome - localstorage value is indicator that location permission is available 
                         */
                        if (window.localStorage) {
                            window.localStorage.userLatitude = latitude;
                            window.localStorage.userLongitude = longitude;
                        }

                        // for non-chrome browsers - session storage value -> indicating that location permission available.
                        if (!isChrome && window.sessionStorage) {
                            window.sessionStorage.userLatitude = latitude;
                            window.sessionStorage.userLongitude = longitude;
                        }

                        // set location input field value to notify user. 
                        $(".prc-tbl__lctn-inpt").val("Your current location");
                      
                        // remove geolocation overlay if present
                        $(".js-glctn-ovrly").click();
                      
                        PriceTable.update.byCategory(PriceTable.dataPoints.getSelectedCategory(), {
                            "latitude" : latitude,
                            "longitude" : longitude
                        });

                        if (window._gaq) _gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'allow']);
                    }

                    function locationFail() {
                        // remove geolocation overlay if present
                        $(".js-glctn-ovrly").click();

                        // if previous location value available in localStorage, then use it and update priceTable
                        if (isLocationStored) {
                            PriceTable.update.byCategory(PriceTable.dataPoints.getSelectedCategory(), {
                                "latitude" : window.localStorage.userLatitude,
                                "longitude" : window.localStorage.userLongitude
                            });
                        }

                        if (window._gaq)_gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'deny']);
                    }
                });

                // clicking on chrome geolocation overlay should remove it.
                $doc.on("click", ".js-glctn-ovrly", function () {
                    $(".glctn-ovrly-text").removeClass("js-ovrly--show");
                    $("body").css("overflow", "auto");
                });

                // bind Google maps autocomplete to location searchbox.
                (function initAutocomplete() {
                    var autocomplete = new google.maps.places.Autocomplete($(".prc-tbl__lctn-inpt").get(0), {
                        componentRestrictions: { country: "in" },
                        types: ["geocode"]
                    });
                    google.maps.event.addListener(autocomplete, "place_changed", function() {
                        var place = autocomplete.getPlace();
                        if (place && place.geometry && place.geometry.location) {
                            PriceTable.update.byCategory(PriceTable.dataPoints.getSelectedCategory(), {
                                "latitude" : location.lat(),
                                "longitude" : location.lng()
                            });
                        }
                    });
                }());

            } else {
                _gaq.push(['_trackEvent', 'Offline_Desktop', 'location', 'not_supported']);
            }
        }());

    },
    "updatePageData" : function(json) {
        var $showMoreStores = $(".js-prc-tbl__shw-more");
        if (json) {
            if (json.bestprice) {
                $(".prdct-dtl__slr-prc-rcmnd-val").html(json.bestprice);
            }
            if (json.discount) {
                $(".prdct-dtl__slr-prc-mrp-dscnt").text("[" + json.discount + "% OFF]");
            }
            if (json.buybutton) {
                $(".prdct-dtl__slr-prc-btn").replaceWith(json.buybutton);
            }
            if (json.pricetable) {
                $(".prc-tbl-inr").html(json.pricetable);
                if ($(".prc-tbl-row").length > PriceTable.dataPoints.defaultRows) {
                    $showMoreStores.show();
                    if ($showMoreStores.data("collapsed")) {
                        $(".prc-tbl-row").slice(PriceTable.dataPoints.defaultRows).show();
                    } else {
                        $(".prc-tbl-row").slice(PriceTable.dataPoints.defaultRows).hide();
                    }
                } else {
                    $showMoreStores.hide();
                }
            }
        }
    },
    "update" : {
        "byCategory" : function(type, location) {
            PriceTable.fetch.tableByCategory(type, location).done(function(html) {
                $(".prdct-dtl__slr-prc-tbl-btn").data("action", "enabled");
                $(".prc-tbl-inr").html(html);
            });
        },
        "byFilter" : function() {
            var appliedFilters = PriceTable.dataPoints.getAppliedFilters(),
                request = {
                    "mspid": PriceTable.dataPoints.mspid,
                    "mrp": PriceTable.dataPoints.price.getMrp() || 0,
                    "sort": PriceTable.dataPoints.getAppliedSort(),
                    "colour": (PriceTable.dataPoints.getSelectedColor() || "").toLowerCase(),
                    "cod": appliedFilters.indexOf("cod") !== -1,
                    "emi": appliedFilters.indexOf("emi") !== -1,
                    "returnpolicy": appliedFilters.indexOf("returnPolicy") !== -1,
                    "offers": appliedFilters.indexOf("offers") !== -1
                };

            PriceTable.fetch.tableByFilter(request).done(function (response) {
                PriceTable.updatePageData(response);
            });
        }
    },
    "sort" : function(sortby) {
        var $priceTableContainer = $('.prc-tbl-inr'),
            $store_pricetable = $('.prc-tbl-row'),
            sortDataAttrs;

        // close all messageBoxes before sorting priceTable
        $('.js-msg-box__cls, .js-xtrs-msg-box__cls').click();

        sortTypes = {
            "popularity:desc" : { "attr" : "data-relrank", "order" : "asc" },
            "price:asc" : { "attr" : "data-pricerank", "order" : "asc" },
            "price:desc" : { "attr" : "data-pricerank", "order" : "desc" },
            "rating:desc" : { "attr" : "data-rating", "order" : "desc" }
        };

        $priceTableContainer.css({
            height: $priceTableContainer.height(),
            display: 'block'
        });

        $store_pricetable.show();
        $store_pricetable.each(function(i, el) {
            var iY = $(el).position().top;
            $.data(el, 'h', iY);
        });

        if (window._gaq) _gaq.push(['_trackEvent', 'sort_by', sortby, '']);

        if (sortby === 'popularity:desc') {
            $('.prc-tbl-row--NA').attr("data-relrank", "9999");
        } else if (sortby === 'price:asc') {
            $('.prc-tbl-row--NA').attr("data-pricerank", "9999999");
        } else if (sortby === 'price:desc') {
            $('.prc-tbl-row--NA').attr("data-pricerank", "0");
        } else if (sortby === 'rating:desc') {
            $('.prc-tbl-row--NA').find('.js-prc-tbl__str-rtng').attr("data-rating", "-1");    
        }

        $('.prc-tbl-row').tsort({
            "attr" : sortTypes[sortby].attr,
            "order" : sortTypes[sortby].order
        }, '.js-prc-tbl__str-rtng', {
            attr: "data-storename"
        }).each(function(i, el) {
            var $El = $(el);
            var iFr = $.data(el, 'h');
            var iTo = 0;
            $El.prevAll('.prc-tbl-row:visible').each(function() {
                iTo += $(this).outerHeight();
            });
            $El.css({
                position: 'absolute',
                top: iFr
            }).stop().animate({
                top: iTo
            }, 500, function() {
                $store_pricetable.css({
                    position: 'static',
                    top: 'auto'
                });
                $priceTableContainer.css({
                    height: 'auto',
                    display: 'block'
                });
                
                if ($(".js-prc-tbl__shw-mr").data("collapsed")) {
                    $(".prc-tbl__row").slice(PriceTable.dataPoints.defaultRows).show();
                } else {
                    $(".prc-tbl__row").slice(PriceTable.dataPoints.defaultRows).hide();
                }
            });
        });
    },
    "templates" : {
        "offersMsgBox" : function(offerDetails) {
            var offerCount, offerRows, msgBoxHtml;

            offerCount = $(offerDetails).find("ol").length ? $(storeDetails).find("li").length : 1,
            offerRows = (function() {
                var result = "";
                if ($(offerDetails).find("ol").length) {
                    $(offerDetails).find("li").each(function(i, rowText) {
                        result += '<div class="msg-box__row">' + rowText + '</div>';
                    });
                } else {
                    result += '<div class="msg-box__row">' + $(offerDetails).html() + '</div>';
                }
                return result;
            }());

            msgBoxHtml = [
                '<div class="msg-box prc-tbl__xtrs-clm-pop">',
                    '<div class="msg-box__hdr clearfix">',
                        offerCount + ' Offers',
                        '<span class="msg-box__cls js-msg-box__cls">×</span>',
                    '</div>',
                    '<div class="msg-box__inr">',
                        offerRows,
                    '</div>',
                '</div>',
            ].join("");

            return msgBoxHtml;
        }
    },
    "fetch" : {
        "tableByCategory" : MSP.utils.memoize(function _productList(type, location) {
            var dfd = $.Deferred();

            $.ajax({
                "url": "/mobile/offline/delivery_pricetable.php",
                "data": {
                    "mspid": PriceTable.dataPoints.mspid,
                    "mrp": PriceTable.dataPoints.price.getMrp(),
                    "type": type,
                    "latitude" : location.latitude,
                    "longitude" : location.longitude
                }
            }).done(function (response) {
                if (response) {
                    dfd.resolve(response);
                }
            }).fail(function(error) {
                dfd.reject(error);
            });

            return dfd.promise();
        }, {
            isAsync : true,
            cacheLimit : 10
        }),
        "tableByFilter" : MSP.utils.memoize(function(request) {
            var dfd = $.Deferred();

            $.ajax({
                "url": "/mobile/filter_response.php",
                "dataType": "json",
                "data": request
            }).done(function (response) {
                dfd.resolve(response);
            }).fail(function (response) {
                dfd.reject(response);
            });

            return dfd.promise();
        }, {
            isAsync : true,
            cacheLimit : 10
        }),
        "offersPopups" : MSP.utils.memoize(function(mspid, color) {
            var dfd = $.Deferred();
            $.ajax({
                "url" : "/msp/offertext_ajax.php",
                "type" : "GET",
                "dataType" : "json",
                "data" : {
                    "mspid" : mspid,
                    "color" : (currentColour !== "default") ? currentColour : undefined
                }
            }).done(function(response) {
                dfd.resolve(response);
            });
        }, {
            isAsync : true,
            cacheLimit : 10
        })
    }
};


$(document).ready(function() {
    PriceTable.init();

    /**
     * save to list button handlers
     * TODO:: update DOM bindings according to ankur's html
     * - start 
     */
    var msp_login = getCookie("msp_login");
    $('body').on('click', "#addtolistbutton", function(e) {
        msp_login = getCookie("msp_login");
        if (msp_login == 1) {
            $("#addedtolistbutton").css('display', 'inline-block');
            $("#addtolistbutton").hide();
            var pagemspid = $("#mspSingleTitle").attr("data-mspid");
            $.get("/users/add_to_list.php", {
                mspid: pagemspid
            }, function(data) {});
        } else {
            checklogin = window.setInterval('addtolisttrigger();', 500);
            $(".loginbutton").click();
        }
        return false;
    });

    $("body").on("click", ".logoutbutton", function(e) {
        $("#addedtolistbutton").hide();
        $("#addtolistbutton").css('display', 'inline-block');
    }); 
    /* save to list button handlers - end */

    // show more techspecs.
    if ($(".prdct-dtl__spfctn-more-wrpr").length) {
        $("body").on("click", ".js-prdct-dtl__spfctn-show-more, .js-prdct-dtl__spfctn-show-less", function() {
            var delay = $(this).hasClass("js-prdct-dtl__spfctn-show-less") ? 400 : 0;
            setTimeout(function() {
                $(".js-prdct-dtl__spfctn-show-more").toggle();
            }, delay);
            $(".prdct-dtl__spfctn-more-wrpr").toggleClass("prdct-dtl__spfctn-more-wrpr--show");
        });
    }

    // if GTS is not a popup target then open storeUrl in new tab.
    $("body").on("click", ".js-prc-tbl__gts-btn", function() {
        var storeUrl = $(this).data("url"),
            hasPopup = $(this).hasClass("popup-target") || $(this).hasClass("loyalty-popup-target"),
            isEnabled = !$(this).hasClass("btn-GTS--dsbld");
        if (!hasPopup && isEnabled) {
            window.open(storeUrl);
        }
    });

    // theme expert review score according to its value.
    $(".rvw__scr .rvw__scr-val").each( function() {
        var score = $(this).text();

        switch(score) {
            case score >= 0 && score < 3:
                $(this).closest('.rvw__scr').css('background-color', '#CC0000');
                break;
            case score >= 3 && score < 6:
                $(this).closest('.rvw__scr').css('background-color', '#F5A623'); 
                break;
            case score >= 6 && score < 8:
                $(this).closest('.rvw__scr').css('background-color', '#70CB09'); 
                break;
            case score >= 8 && score < 10:
                $(this).closest('.rvw__scr').css('background-color', '#417505'); 
                break;
        }
    });
});
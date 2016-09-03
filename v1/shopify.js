'use strict';

// 1. Injection Code
// original source: https://raw.githubusercontent.com/Matthew-Dove/Inject/master/src/inject.js

(function () {
  /* Inject the css. */
  document.head.insertAdjacentHTML( 'beforeend', '<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/PostCo/postco-shopify/v1.7.11/v1/shopify.min.css">' );

  /* Load jquery if not present */
  if (window.jQuery === undefined) {
    var script = document.createElement('script')
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js"
    document.head.appendChild(script)
  }

  /* Redefine Jquery if loaded using dojo. */
  if (typeof dojo === 'object') {
    $ = require('jquery')
  }

  /* Build the url for each injection element to get the source's html. */
  var createApiUrl = function () {
    var protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    var baseUrl = '//query.yahooapis.com/v1/public/yql?q=';
    var yql = encodeURIComponent('select * from html where url = ');

    return function (queryUrl) {
      /* The single quote isn't encoded correctly, so the safe encoded value is hard coded. */
      return protocol + baseUrl + yql + '%27' + encodeURIComponent(queryUrl) + '%27';
    };
  }();

  /* Get the browser's XML parser. */
  var createXmlParser = function () {
    if (typeof window.DOMParser !== 'undefined') {
      return function (xml) {
        return new DOMParser().parseFromString(xml, 'text/xml');
      };
    } else if (typeof ActiveXObject !== 'undefined' && new ActiveXObject('Microsoft.XMLDOM')) {
      return function (xml) {
        var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async = 'false';
        xmlDoc.loadXML(xml);
        return xmlDoc;
      };
    } else {
      console.log('inject - no xml parser found.');
      return function (xml) {
        return null;
      };
    }
  }();

  var createXhr = function () {
    var xmlRequest = null;

    function isCorsEnabled() {
      var xhr = new XMLHttpRequest();
      return 'withCredentials' in xhr;
    }

    if (typeof XMLHttpRequest !== 'undefined' && isCorsEnabled()) {
      xmlRequest = function xmlRequest() {
        return new XMLHttpRequest();
      };
    } else if (typeof XDomainRequest !== 'undefined') {
      xmlRequest = function xmlRequest() {
        return new XDomainRequest();
      };
    } else {
      console.log('inject - cors isn\'t supported.');
    }

    return xmlRequest;
  }();

  /* Use the browser's xml request object to get the source's html. */
  var getHtml = function getHtml(url, callback) {
    var xhr = createXhr();
    if (xhr !== null) {
      xhr.open('GET', url, true);
      xhr.onerror = function () {
        console.log('inject - error making a request for a source\'s HTML.');
      };
      xhr.onload = function () {
        callback(xhr.responseText);
      };
      xhr.send(null);
    }
  };

  /* The browser's way of selecting elements by their attributes. */
  var elementSelector = function () {
    if (typeof document.querySelectorAll !== 'undefined') {
      return function (query) {
        return document.querySelectorAll('[' + query + ']');
      };
    } else {
      return function (query) {
        var matchingElements = [];
        var allElements = document.getElementsByTagName('*');
        for (var i = 0, n = allElements.length; i < n; i++) {
          if (allElements[i].getAttribute(query) !== null) {
            matchingElements.push(allElements[i]);
          }
        }
        return matchingElements;
      };
    }
  }();

  var removeNodes = function removeNodes(xmlDocument, trash, name) {
    var garbage = xmlDocument.getElementsByTagName(name);

    for (var i = 0, n = garbage.length; i < n; i++) {
      trash.push(garbage[i]);
    }

    return trash;
  };

  /* Remove unwanted nodes, and put the rest as HTML into the element that requested the HTML injection. */
  var injectResponse = function injectResponse(response, injectee) {
    var parser = createXmlParser(response);
    if (parser !== null) {
      var bodyMatch = parser.getElementsByTagName('body');
      if (bodyMatch.length === 1) {
        var body = bodyMatch[0];
        var trash = [];

        trash = removeNodes(parser, trash, 'script');
        trash = removeNodes(parser, trash, 'style');

        /* Remove any nodes we won't want injected. */
        for (var i = 0, n = trash.length; i < n; i++) {
          trash[i].parentNode.removeChild(trash[i]);
        }

        /* Inject the html. */
        injectee.innerHTML = body.innerHTML || body.xml || response;

        /* Load selectize. */
				$.getScript('https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.1/js/standalone/selectize.min.js')
					.done(function( script, textStatus ) {
						initializeSelectize();
					})
				.fail(function(jqxhr, settings, exception) {
					console.log('Selectize failed to load');
				});

      } else {
        console.log('inject - no body tag found.');
      }
    }
  };

  /* The attribue to look for when finding elements that require injection. */
  var injectSrcAttr = 'data-pc-src';
  var templateUrl = '/plugins/v1/shopify'

  /* Get the source's html, and inject it into the element that requested it. */
  var injectHtml = function injectHtml(injectee) {
    var queryUrl = injectee.getAttribute(injectSrcAttr) + templateUrl;
    getHtml(createApiUrl(queryUrl), function (response) {
      injectResponse(response, injectee);
    });
  };

  setTimeout(function () {
    /* Get all elements marked with the inject attribute, and inject them with the requested source. */
    var injectees = elementSelector(injectSrcAttr);
    for (var i = 0, n = injectees.length; i < n; i++) {
      injectHtml(injectees[i]);
    }
  }, 0);
})();

// 2. Selectize

var initializeSelectize = function initializeSelectize() {
  var plugin = document.getElementById("postco-plugin");

  var retailerAuthToken = plugin.dataset.pcApi;
  var url = plugin.dataset.pcSrc;

  $("#js-postco-shipping").click(function () {
    $("#js-postco-widget").hide()
    $("#js-postco-fields").attr('disabled', true);
  });

  $("#js-postco-collect").click(function () {
    $("#js-postco-widget").show()
    $("#js-postco-fields").attr('disabled', false);
  });

  $('#postco-agent').selectize({
    preload: true,
    valueField: 'id',
    labelField: 'name',
    searchField: ['name', 'address1', 'address2', 'zip', 'city'],
    render: {
      option: function option(item, escape) {
        return "<div data-address1=\"" + item.address1 + "\" data-address2=\"" + item.address2 + "\" data-city=\"" + item.city + "\" data-zip=\"" + item.zip + "\" data-province=\"" + item.province + "\" data-country=\"" + item.country + "\">" + "<span class=\"title\"><span class=\"name\" style=\"font-weight:bold;\">" + ("" + item.name) + "</span></span><br><span class=\"address\" style=\"font-size: small;\">" + (item.address1 + " " + item.address2 + " " + item.zip + " " + item.city) + "</span></div>";
      }
    },
    onItemAdd: function onItemAdd(value, $item) {
      var company = $item.text();
      var address = $('.selectize-dropdown-content').find('[data-value="' + value + '"]');
      var address_params = $.param({
        step: 'contact_information',
        checkout: {
          shipping_address: {
            company: company,
            address1: address.data('address1'),
            address2: address.data('address2'),
            city: address.data('city'),
            zip: address.data('zip'),
            province: address.data('province'),
            country: address.data('country')
          }
        }
      });

      $('form[action="/cart"]').attr("action", 'cart?' + address_params);
    },
    load: function load(query, callback) {
      this.settings.load = null;
      $.ajax({
        url: url + '/api/v1/locations',
        xhrFields: {
          withCredentials: true
        },
        headers: {
          "Authorization": 'Bearer ' + retailerAuthToken
        },
        type: 'GET',
        error: function error() {
          callback();
        },
        success: function success(result) {
          var agents = result.data.map(function (x) {
            return {
              id: x.attributes['agent-id'],
              name: x.attributes.company,
              address1: x.attributes.address1,
              address2: x.attributes.address2,
              city: x.attributes.city,
              zip: x.attributes.zip,
              province: x.attributes.state,
              country: x.attributes.country
            };
          });
          callback(agents);
        }
      });
    }
  });
};

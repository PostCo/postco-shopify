'use strict';

var _xcomponent = require('xcomponent/dist/xcomponent');

var _xcomponent2 = _interopRequireDefault(_xcomponent);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var childResizeCallback = function childResizeCallback(height) {
    document.getElementById('postco-widget-container').childNodes[1].style.height = height + 'px';
  };

  var agentSelectionCallback = function agentSelectionCallback(agent) {
    var address_params = _jquery2.default.param({
      step: 'contact_information',
      checkout: {
        shipping_address: {
          company: agent.company,
          address1: agent.address1,
          address2: agent.address2,
          city: agent.city,
          zip: agent.zip,
          province: agent.state,
          country: agent.country
        }
      }
    });

    (0, _jquery2.default)('form.js-postco-cart').attr("action", 'cart?' + address_params);
    (0, _jquery2.default)('#js-postco-agent-id').val(agent.id);
  };

  var agentRemovalCallback = function agentRemovalCallback() {
    (0, _jquery2.default)('form.js-postco-cart').attr("action", '/cart');
    (0, _jquery2.default)('#js-postco-agent-id').val('');
  };

  (0, _jquery2.default)("form.js-postco-cart").prepend('<input id="js-postco-agent-id" name="attributes[postco-agent-id]" type="hidden" value="">');

  var containerElement = document.getElementById("postco-widget-container");
  var containerElementWidth = containerElement.offsetWidth;

  var apiToken = containerElement.getAttribute("data-postco-api");

  window.PostCo = _xcomponent2.default.create({
    tag: 'postco-widget',
    url: 'https://postco-plugin-staging.herokuapp.com/delivery',
    singleton: true,
    props: {
      apiToken: {
        type: 'string',
        required: true
      },
      onChildResize: {
        type: 'function',
        required: true
      },
      onAgentSelection: {
        type: 'function',
        required: true
      },
      onAgentRemoval: {
        type: 'function',
        required: true
      }
    },
    dimensions: {
      width: containerElementWidth,
      height: 130
    },
    contexts: {
      iframe: true,
      lightbox: false,
      popup: false
    },
    defaultContext: 'iframe'
  });

  window.PostCo.render({
    apiToken: apiToken,
    onChildResize: childResizeCallback,
    onAgentSelection: agentSelectionCallback,
    onAgentRemoval: agentRemovalCallback
  }, '#postco-widget-container');
});
//# sourceMappingURL=shopify.js.map
import xcomponent from 'xcomponent/dist/xcomponent'
import $ from 'jquery/dist/jquery'

(global => {
  console.log("PostCo Shopify Integration Script v.2.0 was loaded successfully")

  const childResizeCallback = function(height) {
    let element = document.getElementById('postco-widget-container')
    let index = element.children.length - 1

    element.children[index].style.height = `${height}px`
  }

  const agentSelectionCallback = function(agent) {
    const address_params = $.param({
      step: 'contact_information',
      checkout: {
        shipping_address: {
          last_name: "Last Name @ PostCo",
          company: agent.company,
          address1: agent.address1,
          address2: agent.address2,
          city: agent.city,
          zip: agent.zip,
          province: agent.state,
          country: agent.country
        }
      }
    })

    $('form.js-postco-cart').attr("action", 'cart?' + address_params)
    $('#js-postco-agent-id').val(agent.id)
  }

  const agentRemovalCallback = function() {
    $('form.js-postco-cart').attr("action", '/cart');
    $('#js-postco-agent-id').val('')
  }

  $("form.js-postco-cart").prepend(`<input id="js-postco-agent-id" name="attributes[postco-agent-id]" type="hidden" value="">`)

  const containerElement = document.getElementById("postco-widget-container")

  if (containerElement === null) {
    return
  } else {
    const containerElementWidth = containerElement.offsetWidth

    const apiToken = containerElement.getAttribute("data-postco-api")

    window.PostCo = xcomponent.create({
      tag: 'postco-widget',
      url: 'https://plugin.postco.com.my/delivery',
      // url: 'http://127.0.0.1:4000/delivery',
      // url: 'https://postco-plugin.dev/delivery',
      // url: 'https://postco-plugin-production.herokuapp.com/delivery',
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
        height: 160
      },
      contexts: {
        iframe: true,
        lightbox: false,
        popup: false
      },
      defaultContext: 'iframe'
    })

    window.PostCo.render({
      apiToken: apiToken,
      onChildResize: childResizeCallback,
      onAgentSelection: agentSelectionCallback,
      onAgentRemoval: agentRemovalCallback
    }, '#postco-widget-container')

    console.log("PostCo Shopify Integration Script v.2.0 was executed successfully")
  }
})(window)

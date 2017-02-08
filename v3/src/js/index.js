import xcomponent from 'xcomponent/dist/xcomponent'
import $ from 'jquery/dist/jquery'

(global => {
  console.log("PostCo Shopify Integration Script v.3.0 was loaded successfully")

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

  const agentCancellationCallback = function() {
    $('form.js-postco-cart').attr("action", '/cart')
    $('#js-postco-agent-id').val('')
  }

  const onDeliverySelectionClickCallback = (callback) => {
    window.resetXChild = callback
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
      url: process.env.XCOMPONENT_URL,
      singleton: true,
      props: {
        apiToken: {
          type: 'string',
          required: true,
          queryParam: true
        },
        onAgentSelection: {
          type: 'function',
          required: true
        },
        onAgentCancellation: {
          type: 'function',
          required: true
        },
        onDeliverySelectionClick: {
          type: 'function',
          required: false
        }
      },
      dimensions: {
        width: containerElementWidth,
        height: 700
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
      onAgentSelection: agentSelectionCallback,
      onAgentCancellation: agentCancellationCallback,
      onDeliverySelectionClick: onDeliverySelectionClickCallback
    }, '#postco-widget-container')

    $(document).ready(() => {
      $("#delivery").click(function(event) {
        event.preventDefault()
        if (!$(this).hasClass("active")){
          agentCancellationCallback()
          window.resetXChild()
          $(".nav-item").siblings().toggleClass("active")
          $(".body-block").toggleClass("hidden")
        }
      })

      $("#collection").click(function(event) {
        event.preventDefault()
        if (!$(this).hasClass("active")){
          $(".nav-item").siblings().toggleClass("active")
          $(".body-block").toggleClass("hidden")
        }
      })
    })

    console.log("PostCo Shopify Integration Script v.3.0 was executed successfully")
  }
})(window)

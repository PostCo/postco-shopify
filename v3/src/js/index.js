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

  $("form.js-postco-cart").prepend(`<input id="js-postco-agent-id" name="attributes[postco-agent-id]" type="hidden" value="">`)

  const containerElement = document.getElementById("postco-widget-container")

  if (containerElement === null) {
    return
  } else {
    const containerElementWidth = containerElement.offsetWidth

    const apiToken = containerElement.getAttribute("data-postco-api")

    window.PostCo = xcomponent.create({
      tag: 'postco-widget',
      // url: 'https://plugin.postco.com.my/v3',
      url: 'http://127.0.0.1:4000/v3',
      // url: 'https://postco-plugin.dev/v3',
      // url: 'https://postco-plugin-production.herokuapp.com/v3',
      singleton: true,
      props: {
        apiToken: {
          type: 'string',
          required: true
        },
        onAgentSelection: {
          type: 'function',
          required: true
        },
        onAgentCancellation: {
          type: 'function',
          required: true
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

		const renderWidget = () => {
			window.PostCo.render({
				apiToken: apiToken,
				onAgentSelection: agentSelectionCallback,
				onAgentCancellation: agentCancellationCallback
			}, '#postco-widget-container')
		}

		const removeWidget = () => {
			$("#postco-widget-container iframe").remove()
		}

    document.addEventListener("DOMContentLoaded", () => {
			renderWidget()

      const explanation_block = document.getElementById("explanation")
      const widget_block = document.getElementById("postco-widget-container")

      document.getElementById("delivery").onclick = function(event) {
        event.preventDefault()
				removeWidget()
				setTimeout(() => {
					agentCancellationCallback()
					renderWidget()
				}, 1000)

        document.querySelector("a.btn.btn-secondary.active").classList.toggle("active")

        this.classList.toggle("active")

        if (explanation_block.classList.contains("hidden")) {
          explanation_block.classList.remove("hidden")
        }

        if (!widget_block.classList.contains("hidden")) {
          widget_block.classList.add("hidden")
        }

      }

      document.getElementById("collection").onclick = function(event) {
        event.preventDefault()

        document.querySelector("a.btn.btn-secondary.active").classList.toggle("active")

        this.classList.toggle("active")

        if (!explanation_block.classList.contains("hidden")) {
          explanation_block.classList.add("hidden")
        }

        if (widget_block.classList.contains("hidden")) {
          widget_block.classList.remove("hidden")
        }
      }
    })

    console.log("PostCo Shopify Integration Script v.3.0 was executed successfully")
  }
})(window)

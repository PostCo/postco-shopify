import xcomponent from 'xcomponent/dist/xcomponent'
import jqueryParam from 'jquery-param/jquery-param'

(global => {
  console.log('PostCo Shopify Integration Script v.2.0 was loaded successfully')

  const childResizeCallback = function (height) {
    Array.from(document.getElementsByClassName('xcomponent-outlet')).forEach((x) => (x.style.height = `${height}px`))
  }

  const agentSelectionCallback = function (agent) {
    const addressParams = jqueryParam({
      step: 'contact_information',
      checkout: {
        shipping_address: {
          last_name: '<Insert Your Last Name> PostCo',
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

    Array.from(document.querySelectorAll('form.js-postco-cart')).forEach((x) => x.setAttribute('action', 'cart?' + addressParams))
    document.getElementById('js-postco-agent-id').value = agent.id
    document.getElementById('checkout_btn').name = 'update'
  }

  const agentCancellationCallback = function () {
    Array.from(document.querySelectorAll('form.js-postco-cart')).forEach((x) => x.setAttribute('action', '/cart'))
    document.getElementById('js-postco-agent-id').value = ''
    document.getElementById('checkout_btn').name = 'checkout'
  }

  document.querySelectorAll("input[name='update'][type='submit'][class='update']")[0].onclick = function () {
    Array.from(document.querySelectorAll('form.js-postco-cart')).forEach((x) => x.setAttribute('action', '/cart'))
  }

  document.querySelectorAll("input[name='checkout'][type='submit']")[0].id = 'checkout_btn'

  let inputElement = document.createElement('input')
  inputElement.setAttribute('id', 'js-postco-agent-id')
  inputElement.setAttribute('name', 'attributes[postco-agent-id]')
  inputElement.setAttribute('type', 'hidden')
  inputElement.setAttribute('value', '')

  Array.from(document.querySelectorAll('form.js-postco-cart')).forEach((x) => x.prepend(inputElement))

  const containerElement = document.getElementById('postco-widget-container')

  if (containerElement !== null) {
    const containerElementWidth = `${containerElement.offsetWidth}px`

    const apiToken = containerElement.getAttribute('data-postco-api')

    const PostCoWidgetXComponent = xcomponent.create({
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
        onChildResize: {
          type: 'function',
          required: false
        }
      },
      dimensions: {
        width: containerElementWidth,
        height: '180px'
      }
    })

    PostCoWidgetXComponent.render({
      apiToken: apiToken,
      onAgentSelection: agentSelectionCallback,
      onAgentCancellation: agentCancellationCallback,
      onChildResize: childResizeCallback
    }, '#postco-widget-container')

    console.log('PostCo Shopify Integration Script v.2.0 was executed successfully')
  }
})(window)

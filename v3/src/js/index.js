import xcomponent from 'xcomponent/dist/xcomponent'
import jqueryParam from 'jquery-param/jquery-param'

(global => {
  console.log('PostCo Shopify Integration Script v.3.0 was loaded successfully')

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

  const onDeliverySelectionClickCallback = (callback) => {
    window.resetXChild = callback
  }

  let inputElement = document.createElement('input')
  inputElement.setAttribute('id', 'js-postco-agent-id')
  inputElement.setAttribute('name', 'attributes[postco-agent-id]')
  inputElement.setAttribute('type', 'hidden')
  inputElement.setAttribute('value', '')

  Array.from(document.querySelectorAll('form.js-postco-cart')).forEach((x) => x.prepend(inputElement))

  document.querySelectorAll("input[name='update'][type='submit'][class='update']")[0].onclick = function () {
    Array.from(document.querySelectorAll('form.js-postco-cart')).forEach((x) => x.setAttribute('action', '/cart'))
  }

  document.querySelectorAll("input[name='checkout'][type='submit']")[0].id = 'checkout_btn'

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
        onDeliverySelectionClick: {
          type: 'function',
          required: false
        }
      },
      dimensions: {
        width: containerElementWidth,
        height: '0px'
      }
    })

    PostCoWidgetXComponent.render({
      apiToken: apiToken,
      onAgentSelection: agentSelectionCallback,
      onAgentCancellation: agentCancellationCallback,
      onDeliverySelectionClick: onDeliverySelectionClickCallback
    }, '#postco-widget-container')

    document.addEventListener('DOMContentLoaded', () => {
      Array.from(document.querySelectorAll('#postco-widget .pw-btn')).forEach((x) => x.classList.remove('pw-in-progress'))

      document.getElementById('delivery').onclick = function () {
        Array.from(document.querySelectorAll('.xcomponent-outlet')).forEach((x) => (x.style.height = '0px'))
        if (!this.classList.contains('pw-active')) {
          agentCancellationCallback()
          window.resetXChild()
          let navItems = Array.from(document.getElementsByClassName('pw-nav-item'))
          navItems.forEach((element) => {
            const siblings = Array.from(element.parentElement.children).filter((x) => x !== element)
            siblings.forEach((x) => x.classList.toggle('pw-active'))
          })
          Array.from(document.getElementsByClassName('pw-content')).forEach((x) => x.classList.toggle('pw-hidden'))
        }
      }

      document.getElementById('collection').onclick = function () {
        Array.from(document.querySelectorAll('.xcomponent-outlet')).forEach((x) => (x.style.height = '630px'))
        if (!this.classList.contains('pw-active')) {
          let navItems = Array.from(document.getElementsByClassName('pw-nav-item'))
          navItems.forEach((element) => {
            const siblings = Array.from(element.parentElement.children).filter((x) => x !== element)
            siblings.forEach((x) => x.classList.toggle('pw-active'))
          })
          Array.from(document.getElementsByClassName('pw-content')).forEach((x) => x.classList.toggle('pw-hidden'))
        }
      }
    })

    console.log('PostCo Shopify Integration Script v.3.0 was executed successfully')
  }
})(window)

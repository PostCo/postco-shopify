import xcomponent from 'xcomponent/dist/xcomponent'
import jqueryParam from 'jquery-param/jquery-param'
// import getParam from '../../../shared/get_param'

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
  }

  const agentCancellationCallback = function () {
    Array.from(document.querySelectorAll('form.js-postco-cart')).forEach((x) => x.setAttribute('action', '/cart'))
    document.getElementById('js-postco-agent-id').value = ''
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

  const containerElement = document.getElementById('postco-widget-container')

  if (containerElement !== null) {
    const containerElementWidth = containerElement.offsetWidth

    const apiToken = containerElement.getAttribute('data-postco-api')

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
        height: 0
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

    document.addEventListener('DOMContentLoaded', () => {
      Array.from(document.querySelectorAll('#postco-widget .pw-btn')).forEach((x) => x.classList.remove('pw-in-progress'))

      document.getElementById('delivery').onclick = function () {
        Array.from(document.querySelectorAll('iframe')).forEach((x) => (x.style.height = '180px'))
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
        Array.from(document.querySelectorAll('iframe')).forEach((x) => (x.style.height = '780px'))
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

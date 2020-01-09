/* globals io */

const socket = io()

const form = document.querySelector('form')
const button = document.querySelector('button')
const messageInput = document.getElementById('new-message')
const messageList = document.getElementById('messages')
const onlineList = document.getElementById('online')

const handle = handleSetup()
socket.emit('handle-online', handle)

// disable button if messageInput is empty
messageInput.addEventListener('input', e => {
  button.disabled = messageInput.value === ''
})

messageInput.addEventListener('focus', e => {
  button.disabled = messageInput.value === ''  
})

window.addEventListener('load', () => {
  messageList.scrollTop = messageList.scrollHeight
  messageInput.focus()
})

window.addEventListener('unload', () => {
  socket.emit('handle-offline', handle)
})

// send messages
form.addEventListener('submit', e => {
  e.preventDefault()
  const data = {
    username: handle,
    datetime: new Date().toISOString(),
    rawMessage: messageInput.value
  }
  
  socket.emit('message', data)
  
  messageInput.value = ''
  button.disabled = true
})

// receive messages
socket.on('message', appendMessage)

// update users online list
socket.on('online', updateOnline)

function appendMessage({username, datetime, message}) {
  const pHandle = document.createElement('p')
  pHandle.classList.add('handle')
  pHandle.innerText = username  

  const pText = document.createElement('p')
  pText.classList.add('text')
  pText.innerText = message

  const div = document.createElement('div')
  div.classList.add('message')  
  div.appendChild(pHandle)
  div.appendChild(pText)
  
  messageList.appendChild(div)
  
  messageList.scrollTop = messageList.scrollHeight
}

function updateOnline(users) {
  // clean the list out
  while (onlineList.firstChild) {
    onlineList.removeChild(onlineList.firstChild)
  }
  
  // repopulate list
  users.forEach(handle => {
    const li = document.createElement('li')
    li.innerText = handle
    onlineList.appendChild(li)
  })
}

function handleSetup() {
  let handle = localStorage.getItem('handle')
  
  if (!handle) {
    handle = button.innerText
    localStorage.setItem('handle', button.innerText)
  } else {
    button.innerText = handle
  }
  
  return handle
}
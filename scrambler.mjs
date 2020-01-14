export function scrambler(text) {
  const lower = 0x25A0
  const upper = 0x25FF
  const diff = upper - lower

  const randomChar = c => {
    if (c !== ' ') {
      return String.fromCharCode(Math.floor(Math.random() * diff) + lower)
    } else {
      return ' '
    }
  }
  
  return text.split('').map(randomChar).join('')
  // don't scramble anything
  //return text
}
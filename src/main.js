import './main.css'
import img from './assets/images/WechatIMG8.jpeg'

const image = document.createElement('img')
image.src = img
document.body.appendChild(image)
const p  = new Promise((resolve, reject) => {
  resolve('123')
})

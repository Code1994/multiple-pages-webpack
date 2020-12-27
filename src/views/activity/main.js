import img from '../../assets/images/avatar.jpeg'
import './index.css'
const image = document.createElement('img')
image.src = img
document.body.appendChild(image)

const div = document.createElement('div')
div.style.width = '200px'
div.style.height = '200px'
document.body.appendChild(div)
const p  = new Promise((resolve, reject) => {
  resolve('123')
})

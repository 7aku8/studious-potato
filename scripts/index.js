const canvas = document.querySelector('#canvas')

canvas.width = canvas.parentElement.clientWidth
canvas.height = canvas.parentElement.clientHeight

const ctx = canvas.getContext('2d')

const mouse = {
  x: null,
  y: null,
  radius: 400
}

document.onmousemove = ({ x, y }) => {
  mouse.x = x
  mouse.y = y
}

class Particle {
  constructor ({ x, y }) {
    this.x = x
    this.y = y

    this.dx = Math.random() * 2 - 1
    this.dy = Math.random() * 2 - 1

    this.size = 3
  }

  draw () {
    ctx.globalAlpha = 1

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'

    ctx.fill()
    ctx.stroke()
  }

  update () {
    this.x += this.dx
    this.y += this.dy

    const { distance, dx, dy } = this.mouseDistance()
    if (distance < mouse.radius) {
      const forceDirectionX = dx / distance
      const forceDirectionY = dy / distance

      const acceleration = (mouse.radius - distance) / mouse.radius * 5

      this.dx = forceDirectionX * acceleration
      this.dy = forceDirectionY * acceleration
    }

    if (this.x < 0 || (this.x + this.size) > canvas.width) {
      this.dx = -this.dx
    }
    if (this.y < 0 || (this.y + this.size) > canvas.height) {
      this.dy = -this.dy
    }
  }

  mouseDistance () {
    const xDst = this.x - mouse.x
    const yDst = this.y - mouse.y

    return {
      distance: Math.sqrt(xDst * xDst + yDst * yDst),
      dx: xDst,
      dy: yDst
    }
  }
}

const particles = []

const init = () => {
  for (let x = 0; x < 500; x++) {
    const particle = new Particle({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    })

    particles.push(particle)
  }
}
init()

const connect = () => {
  const maxDst = 100

  particles.forEach(a => {
    particles.forEach(b => {
      const xDst = a.x - b.x
      const yDst = a.y - b.y

      const dst = Math.sqrt(xDst * xDst + yDst * yDst)

      if (dst < maxDst) {
        ctx.globalAlpha =(maxDst - dst) / maxDst / 4

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = 'black'

        ctx.stroke()
      }
    })
  })
}

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  connect()
  particles.forEach(x => {
    x.update()
    x.draw()
  })

  requestAnimationFrame(animate)
}
animate()

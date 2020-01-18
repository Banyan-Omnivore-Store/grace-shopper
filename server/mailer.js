import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'omnivoreStoreGraceShopper@gmail.com',
    pass: 'omnivoreStore123'
  }
})

var mailOptions = {
  from: 'e.k.tilden@gmail.com',
  to: 'e.k.tilden@gmail.com',
  subject: 'Hey Does This Work',
  // text: `I wonder.`,
  html:
    '<h1>Hi Emma!</h1><p>Thank you for your order! Please access your receipt here at any time. Come back soon! </p><p>The Omnivore Store Team</p>'
}

export default transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error)
  } else {
    console.log('Email sent: ', info.response)
  }
})

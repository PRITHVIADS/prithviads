import { Sora } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sora',
})

export const metadata = {
  title: 'PADS — Smart Coupon Platform',
  description: 'Digital marketing coupon platform for Travel, Education, E-commerce and Automobile verticals',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sora.variable}>
      <body>{children}</body>
    </html>
  )
}

export const FREE_SHIPPING_FROM = 300
export const SHIPPING_STANDARD = 25
export const SHIPPING_EXPRESS = 45

export function shippingCost(subtotal: number, express: boolean) {
  if (express) return SHIPPING_EXPRESS
  return subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_STANDARD
}

/** "entre le lun. 26 oct. et le mar. 27 oct." Same-city orders arrive a day earlier; Sundays are skipped. */
export function deliveryWindow(fromCity: string, toCity: string, express = false) {
  const sameCity = fromCity === toCity
  const first = express || sameCity ? 1 : 2
  const last = express ? 1 : sameCity ? 2 : 3
  const f = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
  const day = (n: number) => {
    const d = new Date()
    d.setDate(d.getDate() + n)
    if (d.getDay() === 0) d.setDate(d.getDate() + 1)
    return f.format(d)
  }
  return first === last ? `le ${day(first)}` : `entre le ${day(first)} et le ${day(last)}`
}

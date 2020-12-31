export interface IData {
  email: string
  password: string
  link: string
  maxPrice: number
  refreshRate: number
  card?: ICard
}

export interface ICard {
  num: number
  expiryDate: number
  cvc: number
  name: string
}

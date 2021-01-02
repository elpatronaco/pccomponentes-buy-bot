export interface IData {
  email: string
  password: string
  link: string
  maxPrice?: number
  refreshRate?: number
  phone?: string
  card?: ICard
}

export interface ICard {
  num: string
  expiryDate: string
  cvc: string
  name: string
}

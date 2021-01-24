import { By } from 'selenium-webdriver'

export interface IProps {
  email: string
  password: string
  link: string
  maxPrice?: number
  refreshRate?: number
  card?: ICard
  debug: boolean
  telegrambot?: ITelegramBot
}

export interface ICard {
  num: string
  expiryDate: string
  cvc: string
  name: string
}

export interface ITelegramBot {
  apiToken: string
  user: string
}

import { ElementHandle } from 'puppeteer'

export interface IProps {
  email: string
  password: string
  link: string
  maxPrice?: number
  refreshRate?: number
  card?: ICard
  debug: boolean
}

export interface ICard {
  num: string
  expiryDate: string
  cvc: string
  name: string
}

export interface IFrameContent {
  frame: ElementHandle<Element>
  value: string
  inputId: string
}

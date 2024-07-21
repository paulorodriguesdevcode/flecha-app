import { Customer } from "./customer"

export class Order {
    id: string
    description: string
    number: number
    price: number
    customer?: Customer
    customerId?: string
    parts?: string[]
    startWorkDateTime: string
    endWorkDateTime: string

    constructor(id: string, description: string, price: number, customer: Customer, customerId: string, parts: string[], number: number, startWorkDateTime: string, endWorkDateTime: string) {
        this.id = id
        this.customer = customer
        this.number = number
        this.description = description
        this.price = price
        this.customerId = customerId
        this.parts = parts
        this.startWorkDateTime = startWorkDateTime
        this.endWorkDateTime = endWorkDateTime
    }
}
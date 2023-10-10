import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent {

  cart: Cart = {
    items: [{
      product: "https://via.placeholder.com/150",
      name: "Snickers",
      price: 150,
      quantity: 1,
      id: 1
    },]
  };
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ]
  constructor(private cartService: CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.dataSource = this.cart.items;
    this.cartService.cart.subscribe((_cart) => {
      this.cart = _cart
      this.dataSource = this.cart.items
    })
  }
  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items)
  }



  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item)
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onCheckout(): void {
    this.http.post('http://localhost:4242/checkout', {
      items: this.cart.items
    }).subscribe(async (res: any) => {
      let stripe = await loadStripe('pk_test_51Nziq7EMaL7uETGO1KVVr0zOWjP7lv9SoENsq1nqBdVTOfiU8RZCCW6ho7z1UoJWl8zQmS6ICCTYGnZHXaqAC9No00Px6Z8qzi');
      stripe?.redirectToCheckout({
        sessionId: res.id
      })
    })
  }
}

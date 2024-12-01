import { HttpClient } from '@angular/common/http';
import { Directive, input, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Page } from '../models';

@Directive({
  selector: '[adk-http-client]',
  exportAs: 'adkHttpClient',
  standalone: true,
})
export class AdkHttpClient {
  #http = inject(HttpClient);
  /**
   * The URL to send the request to
   */
  url = input.required<string>({ alias: 'adkUrl' });
  /**
   * The page to get data from
   */
  page = input(1, { alias: 'adkPage' });
  /**
   * The number of items to get
   */
  limit = input<any>(0, { alias: 'adkLimit' });
  /**
   * Get data from the server
   * @param page
   */
  async get<T>(
    page: Page = { page: 1, limit: this.limit() }
  ): Promise<{ total: number; items: T[] }> {
    console.log('page', this.limit());

    const searchParams = new URLSearchParams({
      _page: page.page.toString(),
      _limit: page.limit.toString(),
    }).toString();
    console.log(searchParams);
    const response = await firstValueFrom(
      this.#http.get<T[]>(`${this.url()}?${searchParams}`, {
        observe: 'response',
      })
    );

    const total = parseInt(response.headers.get('X-Total-Count') ?? '0', 20);
    const items = response.body!;

    return { total, items };
  }
}

import { APIRequestContext, APIResponse } from '@playwright/test';

interface AuthPayload {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

interface BookingDates {
  checkin: string;
  checkout: string;
}

interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

interface BookingResponse extends BookingPayload {
  bookingid: number;
}

interface CreateBookingResponse {
  bookingid: number;
  booking: BookingPayload;
}

interface PingResponse {
  status: string;
}

class BookingApi {
  private baseURL: string = 'https://restful-booker.herokuapp.com';
  private requestContext: APIRequestContext;

  constructor(requestContext: APIRequestContext) {
    if (!requestContext) {
      throw new Error('APIRequestContext must be provided to BookingApi constructor');
    }
    this.requestContext = requestContext;
  }

  async createToken(username: string = 'admin', password: string = 'password123'): Promise<APIResponse> {
    try {
      const payload: AuthPayload = { username, password };
      const response = await this.requestContext.post(`${this.baseURL}/auth`, {
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok()) {
        throw new Error(`Failed to create token. Status: ${response.status()}, Body: ${await response.text()}`);
      }

      return response;
    } catch (error) {
      throw new Error(`Error in createToken: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async healthCheck(): Promise<APIResponse> {
    try {
      const response = await this.requestContext.get(`${this.baseURL}/ping`);

      if (!response.ok()) {
        throw new Error(`Health check failed. Status: ${response.status()}, Body: ${await response.text()}`);
      }

      return response;
    } catch (error) {
      throw new Error(`Error in healthCheck: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getAllBookings(): Promise<APIResponse> {
    try {
      const response = await this.requestContext.get(`${this.baseURL}/booking`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok()) {
        throw new Error(`Failed to get all bookings. Status: ${response.status()}, Body: ${await response.text()}`);
      }

      return response;
    } catch (error) {
      throw new Error(`Error in getAllBookings: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getBookingById(id: number): Promise<APIResponse> {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Booking ID must be a positive integer');
      }

      const response = await this.requestContext.get(`${this.baseURL}/booking/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok()) {
        throw new Error(`Failed to get booking by ID ${id}. Status: ${response.status()}, Body: ${await response.text()}`);
      }

      return response;
    } catch (error) {
      throw new Error(`Error in getBookingById: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async createBooking(payload: BookingPayload): Promise<APIResponse> {
    try {
      this.validateBookingPayload(payload);

      const response = await this.requestContext.post(`${this.baseURL}/booking`, {
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok()) {
        throw new Error(`Failed to create booking. Status: ${response.status()}, Body: ${await response.text()}`);
      }

      return response;
    } catch (error) {
      throw new Error(`Error in createBooking: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async updateBooking(id: number, payload: BookingPayload, token: string): Promise<APIResponse> {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Booking ID must be a positive integer');
      }

      if (!token || typeof token !== 'string') {
        throw new Error('Valid auth token must be provided');
      }

      this.validateBookingPayload(payload);

      const response = await this.requestContext.put(`${this.baseURL}/booking/${id}`, {
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${token}`,
        },
      });

      if (!response.ok()) {
        throw new Error(`Failed to update booking ${id}. Status: ${response.status()}, Body: ${await response.text()}`);
      }

      return response;
    } catch (error) {
      throw new Error(`Error in updateBooking: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async partialUpdateBooking(id: number, payload: Partial<BookingPayload>, token: string): Promise<APIResponse> {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Booking ID must be a positive integer');
      }

      if (!token || typeof token !== 'string') {
        throw new Error('Valid auth token must be provided');
      }

      if (!payload || typeof payload !== 'object') {
        throw new Error('Valid payload object must be provided');
      }

      const response = await this.requestContext.patch(`${this.baseURL}/booking/${id}`, {
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${token}`,
        },
      });

      if (!response.ok()) {
        throw new Error(`Failed to partially update booking ${id}. Status: ${response.status()}, Body: ${await response.text()}`);
      }

      return response;
    } catch (error) {
      throw new Error(`Error in partialUpdateBooking: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async deleteBooking(id: number, token: string): Promise<APIResponse> {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Booking ID must be a positive integer');
      }

      if (!token || typeof token !== 'string') {
        throw new Error('Valid auth token must be provided');
      }

      const response = await this.requestContext.delete(`${this.baseURL}/booking/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${token}`,
        },
      });

      if (!response.ok()) {
        throw new Error(`Failed to delete booking ${id}. Status: ${response.status()}, Body: ${await response.text()}`);
      }

      return response;
    } catch (error) {
      throw new Error(`Error in deleteBooking: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private validateBookingPayload(payload: Partial<BookingPayload>): void {
    const requiredFields: (keyof BookingPayload)[] = [
      'firstname',
      'lastname',
      'totalprice',
      'depositpaid',
      'bookingdates',
    ];

    for (const field of requiredFields) {
      if (!(field in payload)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof payload.firstname !== 'string' || !payload.firstname.trim()) {
      throw new Error('firstname must be a non-empty string');
    }

    if (typeof payload.lastname !== 'string' || !payload.lastname.trim()) {
      throw new Error('lastname must be a non-empty string');
    }

    if (typeof payload.totalprice !== 'number' || payload.totalprice < 0) {
      throw new Error('totalprice must be a non-negative number');
    }

    if (typeof payload.depositpaid !== 'boolean') {
      throw new Error('depositpaid must be a boolean');
    }

    if (!payload.bookingdates || typeof payload.bookingdates !== 'object') {
      throw new Error('bookingdates must be an object');
    }

    const { checkin, checkout } = payload.bookingdates;
    if (!checkin || !checkout) {
      throw new Error('bookingdates must contain checkin and checkout dates');
    }

    if (!this.isValidDate(checkin) || !this.isValidDate(checkout)) {
      throw new Error('checkin and checkout must be valid ISO 8601 dates (YYYY-MM-DD)');
    }
  }

  private isValidDate(dateString: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
}

export { BookingApi, AuthPayload, AuthResponse, BookingPayload, BookingResponse, CreateBookingResponse, BookingDates, PingResponse };

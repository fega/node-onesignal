
import axios, { AxiosInstance } from 'axios';

interface LangObject {
  en?: string
  es?: string
}

interface Dictionary {
  [key: string]: any
}

interface ButtonObject {
  id: string
  text: string
  icons: string
  url?: string
}


interface SendNotificationOps {
  app_id: string
  contents: LangObject
  headings: string
  include_player_ids?: string[]
  data: Dictionary
  url: string


  // secondary


  // urls
  web_url: string
  app_url: string
  ios_attachments: Dictionary | string
  big_picture: string
  adm_big_picture: string
  chrome_big_picture: string

  // buttons
  buttons: ButtonObject[]
  web_buttons: ButtonObject[]
  ios_category: string

  // appereance
  android_channel_id: string
  existing_android_channel_id: string
  android_background_layout: string
  small_icon: string
  large_icon: string
  adm_small_icon: string

  // email
  email_subject: string
  email_body: string
  email_from_name: string
  email_from_address: string

  // other
  subtitle: string
  include_email_tokens?: string[]
  content_available: boolean
  mutable_content: boolean
  template_id: string
  include_external_user_ids?: string[]
  delivery_time_of_day?: string | 0
  send_after: string
  ttl: number
  priority: number
  delayed_option?: string
  external_id?: string
}

export class OneSignal {
  private baseUrl: string
  private client: AxiosInstance
  constructor(readonly apiKey, readonly appId) {
    this.baseUrl = 'https://onesignal.com/api';
    this.client = axios.create({
      baseURL: this.baseUrl,
    });
  }
  public async send(ids: string | string[], message: string | LangObject, options?: SendNotificationOps, delay: string | number = 0) {

    // Convert message to object as required by the API
    const contents = typeof message === 'string' ? { en: message } : message

    // merge options
    const ops: SendNotificationOps = {
      include_player_ids: Array.isArray(ids) ? ids : [ids],
      ...options,
      app_id: this.appId,
      contents
    }
    // add delay if necesary
    if (!delay) {
      ops.delivery_time_of_day = delay ? '01:00PM' : '12:00PM';
      ops.delayed_option = 'timezone';
    }

    const { data } = await this.client.post('/v1/notifications', ops, {
      headers: {
        Authorization: `Basic ${this.apiKey}`
      }
    })

    return data
  }

  public async viewNotifications(offset, kind) {
    const _offset = offset ? `&offset=${offset}` : '';
    const _kind = kind ? `&kind=${kind}` : '';
    const result = await this.client({
      headers: {
        Authorization: `Basic ${this.apiKey}`,
      },
      url: `/v1/notifications?app_id=${this.appId}${_offset}${_kind}`,
    })
    if (!result) return [];
    return result.data;
  }
}
import {RefreshableAuthProvider, StaticAuthProvider} from 'twitch-auth';
import { ChatClient } from 'twitch-chat-client';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LoadingService} from './loading.service';

@Injectable()
export class TwitchService {

  private clientId = environment.clientId;
  private clientSecret = environment.clientSecret;
  private redirectUri = environment.redirectUri;
  private tokenData;
  private chatClient: ChatClient;
  private activeChannel;

  constructor(private http: HttpClient,
              private loadingService: LoadingService) {
  }

  getLoginUrl() {
    return 'https://id.twitch.tv/oauth2/authorize?client_id=' + this.clientId + '' +
      '&redirect_uri=' + this.redirectUri + '' +
      '&response_type=code&scope=chat:read+chat:edit';
  }

  async getTokens(code: string) {
    await this.http.post('https://id.twitch.tv/oauth2/token?client_id=' + this.clientId + '' +
      '&client_secret=' + this.clientSecret + '' +
      '&code=' + code + '' +
      '&grant_type=authorization_code' +
      '&redirect_uri=' + this.redirectUri, null).toPromise().then((data: any) => {
        console.log(data);
        this.tokenData = {
          'accessToken': data.access_token,
          'refreshToken': data.refresh_token,
          'expiryTimestamp': data.expires_in
        };
    });
  }

  async start() {
    const clientId = this.clientId;
    const auth = new RefreshableAuthProvider(
      new StaticAuthProvider(clientId, this.tokenData.accessToken),
      {
        clientSecret: this.clientSecret,
        refreshToken: this.tokenData.refreshToken,
        expiry: null,
        onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
          this.tokenData.accessToken = accessToken;
          this.tokenData.refreshToken = refreshToken;
          this.tokenData.expiryTimestamp = expiryDate;
        }
      }
    );

    this.chatClient = new ChatClient(auth);
    await this.chatClient.connect();
    this.chatClient.onMessage((channel, user, message) => {
      console.log(channel);
      console.log(user);
      console.log(message);
    });
  }

  join(channel: string) {
    this.activeChannel = channel;
    console.log('joining to channel: ', this.activeChannel);
    this.chatClient.join(this.activeChannel).then(() => console.log('joined to channel: ', this.activeChannel));
  }

  say() {
    this.chatClient.say(this.activeChannel, 'hi');
  }
}

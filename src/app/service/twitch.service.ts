import {RefreshableAuthProvider, StaticAuthProvider} from 'twitch-auth';
import {ChatClient} from 'twitch-chat-client';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LoadingService} from './loading.service';
import {EventEmitter} from 'events';
import {Message} from '../model/message';
import {Subject} from 'rxjs';

export const MESSAGE_SENT = 'tmijs_service_message_sent';

@Injectable()
export class TwitchService {

  private clientId = environment.clientId;
  private clientSecret = environment.clientSecret;
  private redirectUri = environment.redirectUri;
  private tokenData;
  private chatClient: ChatClient;
  activeChannel;
  private messageSource = new Subject<Message>();
  messageArrived = this.messageSource.asObservable();
  eventEmitter: EventEmitter = new EventEmitter();

  constructor(private http: HttpClient,
              private loadingService: LoadingService) {
  }

  getLoginUrl() {
    return 'https://id.twitch.tv/oauth2/authorize?client_id=' + this.clientId + '' +
      '&redirect_uri=' + this.redirectUri + '' +
      '&response_type=code&scope=chat:read+chat:edit';
  }

  async start(code: string) {
    this.loadingService.loadingOn();
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

      const auth = new RefreshableAuthProvider(
        new StaticAuthProvider(this.clientId, this.tokenData.accessToken),
        {
          clientSecret: this.clientSecret,
          refreshToken: this.tokenData.refreshToken,
          expiry: null,
          onRefresh: async ({accessToken, refreshToken, expiryDate}) => {
            this.tokenData.accessToken = accessToken;
            this.tokenData.refreshToken = refreshToken;
            this.tokenData.expiryTimestamp = expiryDate;
          }
        }
      );

      this.chatClient = new ChatClient(auth);
      this.chatClient.connect();
      this.chatClient.onMessage((channel, user, message) => {
        const m = new Message(user, message);
        console.log(m);
        this.eventEmitter.emit(MESSAGE_SENT, m);
      });
      this.loadingService.loadingOff();
    });
  }

  joinChannel(channel: string) {
    this.activeChannel = channel;
    this.loadingService.loadingOn();
    this.chatClient.join(this.activeChannel).then(() => {
      this.loadingService.loadingOff();
      console.log(this.chatClient.isConnected);
    });
  }

  leaveChannel() {
    this.chatClient.part(this.activeChannel);
  }

  quit() {
    this.loadingService.loadingOn();
    this.chatClient.quit().then(() => this.loadingService.loadingOff());
  }

  say(message: string) {
    this.chatClient.say(this.activeChannel, message);
  }

  isConnected() {
    return this.chatClient && this.chatClient.isConnected;
  }
}

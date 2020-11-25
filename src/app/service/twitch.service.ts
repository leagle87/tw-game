import {ClientCredentialsAuthProvider, RefreshableAuthProvider, StaticAuthProvider} from 'twitch-auth';
import { ChatClient } from 'twitch-chat-client';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import { promises as fs } from 'fs';

@Injectable()
export class TwitchService {

  clientId = '53rx93tnvzavrwf0budtim9txiu1i0';
  clientSecret = 'xpfnofjma9a5d2fiuh5u2613hhcf7e';
  redirectUri = 'http://localhost:4200/callback';
  // code = '3s3zoeunqhpc0lr5zxof76x6euqic1'; // kiszedni a valaszbol
  // accessToken = 'nqx92gfzb0kos9mcwurfzpfaj4azm'; // kiszedni a valaszbol
  // refreshToken = '298uui9s66ibe3skzs8poztheaffzx6aeyi9m55nmupboxs7dt'; // kiszedni a valaszbol
  accessToken;
  refreshToken;

  constructor(private http: HttpClient) {
  }

  getTokens(code: string) {
    this.http.post('https://id.twitch.tv/oauth2/token?client_id=' + this.clientId + '' +
      '&client_secret=' + this.clientSecret + '' +
      '&code=' + code + '' +
      '&grant_type=authorization_code' +
      '&redirect_uri=' + this.redirectUri, null).subscribe((data: any) => {
        console.log(data);
        this.accessToken = data.access_token;
        const expiresIn = data.expires_in;
        this.refreshToken = data.refresh_token;
    });
  }

  getLoginUrl() {
    return 'https://id.twitch.tv/oauth2/authorize?client_id=' + this.clientId + '' +
      '&redirect_uri=' + this.redirectUri + '' +
      '&response_type=code&scope=chat:read+chat:edit';
  }

  async start() {
    const clientSecret = this.clientSecret;
    const refreshToken = this.refreshToken;
    const accessToken = this.accessToken;
    const clientId = this.clientId;
    const tokenData = {
      'accessToken': this.accessToken,
      'refreshToken': this.refreshToken,
      'expiryTimestamp': 1000
    };
    const auth = new ClientCredentialsAuthProvider(clientId, clientSecret);

    const chatClient = new ChatClient(auth, {channels: ['leagle87']});
    await chatClient.connect();
    //
    // chatClient.onMessage((channel, user, message) => {
    //   console.log(channel);
    //   console.log(user);
    //   console.log(message);
    // });

  }
}

import { Injectable } from '@angular/core';
import * as tmi from 'tmi.js';
import { EventEmitter } from 'events';
import {Message} from '../model/message';
import {LoadingService} from './loading.service';

export const CONNECT = 'tmijs_service_connect';
export const DISCONNECT = 'tmijs_service_disconnect';
export const MESSAGE_SENT = 'tmijs_service_message_sent';

@Injectable()
export class TmijsService {
  messages: Array<Message> = [];
  client: tmi.Client;
  currentChannel = '';
  on = false;
  connected = false;
  eventEmitter: EventEmitter = new EventEmitter();

  constructor(private loadingService: LoadingService) {
  }

  /**
   * Starts the tmijs service.
   * Emits an event when it connects.
   */
  async start(userName: string, pass: string) {
    this.loadingService.loadingOn();
    const devOptions: tmi.Options = {
      connection: {
        maxReconnectAttempts: 2,
        maxReconnectInverval: 10,
        reconnect: true,
        reconnectDecay: 20,
        reconnectInterval: 10,
        secure: true,
        timeout: 20
      },
      identity: {
        username: userName,
        password: pass
      },
      logger: {
        warn: message => {
          console.log(message);
        },
        error: message => {
          console.log(message);
        },
        info: message => {}
      },
      // options: {
      //   clientId: environment.twitch_clientId,
      //   debug: true
      // }
    };
    this.client = tmi.Client(devOptions);

    await this.client
      .connect()
      .then(data => {
        // Connected
        this.on = true;
        this.eventEmitter.emit(CONNECT);
        this.client.on('message', (channel, userstate, messageText, self) => {
          // Don't listen to my own messages..
          if (self) {return; }
          const message: Message = {
            user: userstate['username'],
            message: messageText
          };
          // Handle different message types..
          switch (userstate['message-type']) {
            case 'action':
              // This is an action message..
              // this.addMessage(message);
              // console.log(this.messages); // Keep this commented unless you want to see a ton of messages.
              break;
            case 'chat':
              this.addMessage(message);
              // console.log(this.messages); // Keep this commented unless you want to see a ton of messages.
              break;
            case 'whisper':
              // This is a whisper..
              break;
            default:
              // Something else ?
              break;
          }
        });
        this.client.on('join', (channel, username, self) => {
          if (this.client.getUsername() === username) {
            !this.currentChannel ? (this.currentChannel = channel) : ''; // Set current channel to the first one joined on first connection.
            console.log(`${username} (You) joined ${channel}`);
          }
        });
        this.client.on('logon', () => {
          console.log(`You are logged in as ${this.client.getUsername()}`);
        });
        this.client.on('connected', (address, port) => {
          console.log(address);
          // const m: Message = {
          //   channel: `_root`,
          //   message: `Connected to${address}:${port}`
          // };
          // this.addMessage(m); // e.g _root: Disconnected, _root: Connected toirc-ws.chat.twitch.tv:443
        });
        this.client.on('disconnected', reason => {
          console.log(reason);
          // let m: Message;
          // reason
          //   ? (m = {
          //       channel: `_root`,
          //       message: `Disconnected. Reason: ${reason}`
          //     })
          //   : (m = {
          //       channel: `_root`,
          //       message: `Disconnected.`
          //     });

          // this.addMessage(m); // e.g _root: Disconnected, _root: Connected toirc-ws.chat.twitch.tv:443
        });
        this.client.on('hosted', (channel, username, viewers, autohost) => {
          console.log(channel, username, viewers, autohost);
          // Do your stuff.
        });
        this.client.on('hosting', (channel, target, viewers) => {
          console.log(
            `${channel} is hosting #${target} for ${viewers} viewers`
          );
          // Do your stuff.
        });
        this.loadingService.loadingOff();
        // console.log(data);
        // return data;
      })
      .catch(err => {
        console.error(err);
        this.on = false;
        // return err;
      });
  }

  /**
   * Stops the tmijs service and disconnects the client.
   * Emits an event when it disconnects and stops.
   */
  stop(): void {
    this.loadingService.loadingOn();
    this.client
      .disconnect()
      .then(data => {
        console.log(data);
        this.on = false;
        this.connected = false;
        this.eventEmitter.emit(DISCONNECT);
        this.loadingService.loadingOff();
      })
      .catch(err => {
        console.log(err);
        this.on = false;
        this.connected = false;
        this.loadingService.loadingOff();
      });
  }

  /**
   * Send message to channel.
   *
   * @param channel
   * @param message
   */
  // say(channel: string, message: string) {
  //   this.client
  //     .say(channel, message)
  //     .then(data => {
  //       const m: Message = {
  //         channel: channel,
  //         username: this.client.getUsername(),
  //         message: message
  //       };
  //       this.addMessage(m);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
  // }

  /**
   * Adds message to the messages array and emits an event attached with the message.
   *
   * @param message
   */
  addMessage(message: Message) {
    console.log(message);
    this.eventEmitter.emit(MESSAGE_SENT, message);
  }

  /**
   * Join a channel. E.g #Goati_
   *
   * @param channel
   */
  joinChannel(channel: string) {
    this.currentChannel = channel;
    this.loadingService.loadingOn();
    if (this.client) {
      this.client
        .join(channel)
        .then(data => {
          console.log(`Joined channel ${channel}.`);
          this.connected = true;
          this.loadingService.loadingOff();
          return true;
        })
        .catch(err => {
          console.error(err);
          this.loadingService.loadingOff();
          return false;
        });
    }
  }

  /**
   * Leave channel.
   *
   * @param channel
   */
  leaveChannel() {
    this.loadingService.loadingOn();
    if (this.client) {
      this.client
        .part(this.currentChannel)
        .then(data => {
          console.log(`Left channel ${this.currentChannel}.`);
          this.connected = false;
          this.currentChannel = '';
          this.loadingService.loadingOff();
          return true;
        })
        .catch(err => {
          console.error(err);
          this.currentChannel = '';
          this.loadingService.loadingOff();
          return false;
        });
    }
  }

  /**
   * Get channels.
   *
   */
  // getChannels(): string[] {
  //   return this.client.getChannels();
  // }

  /**
   * Set current channel to chat in.
   *
   * @param channel
   */
  // setCurrentChannel(channel: string): void {
  //   this.currentChannel = channel;
  // }

  /**
   * Get messages.
   *
   */
  // getMessages(): Array<Message> {
  //   return this.messages;
  // }

  /**
   * Clear messages
   *
   */
  // clear() {
  //   this.messages = [];
  // }
}

// import { IRabbitMQAdapter } from 'app/abstract/generic.rabbit';

// class RabbitMQAdapter implements IRabbitMQAdapter {
//   private readonly connection: amqp.Connection;
//   private readonly channel: amqp.Channel;

//   constructor(private readonly config: RabbitMQConfig) {}

//   async connect(): Promise<void> {
//     this.connection = await amqp.connect(this.config.url);
//     this.channel = await this.connection.createChannel();
//   }

//   async publish(queue: string, message: any): Promise<void> {
//     await this.channel.publish(queue, '', message);
//   }

//   subscribe(queue: string, callback: (message: any) => void): void {
//     this.channel.consume(queue, callback);
//   }

//   async disconnect(): Promise<void> {
//     await this.channel.close();
//     await this.connection.close();
//   }
// }

// interface RabbitMQConfig {
//   url: string;
// }

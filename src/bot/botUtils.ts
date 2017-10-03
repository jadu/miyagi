// import { Member, Channel, UserResponse, ImOpenResponse, SentimentExtract } from '../types';
// import { WebClient } from '@slack/client';
// import { LoggerInstance } from 'winston';

// /**
//  * Get #general channel
//  * @param client
//  * @param logger
//  */
// export async function getGeneralChannel (client, logger): Promise<Channel> {
//     return new Promise(async (
//         resolve: (value: Channel) => void,
//         reject: (value: string) => void
//     ) => {
//         let channels: Channel[];

//         try {
//             channels = (await client.channels.list()).channels;
//         } catch (error) {
//             logger.error(error);
//         }

//         logger.debug(`Got ${channels.length} channels`);

//         const general: Channel|undefined = channels.find(channel => channel.name === 'general');

//         if (general !== undefined) {
//             logger.debug('Found #general!')
//             resolve(general);
//         } else {
//             reject('Could not get the #general channel')
//         }
//     });
// }

// /**
//  * Get all Humans invited to #general
//  * @param client
//  * @param logger
//  */
// export async function getHumansFromChannel (client: WebClient, logger: LoggerInstance, channel: Channel): Promise<Member[]> {
//     return new Promise(async (
//         resolve: (value: Member[]) => void,
//         reject: (value: string) => void
//     ) => {
//         const general: Channel = await getGeneralChannel(client, logger);
//         const humans: Member[] = [];
//         const members: Promise<UserResponse>[] = [];

//         logger.info(`There are ${channel.members.length} members in #general`);

//         for (let userId of channel.members) {
//             members.push(client.users.info(userId));
//         }

//         Promise.all(members).then((response: UserResponse[]) => {
//             response.forEach(({ user }: { user: Member }) => {
//                 if (!user.is_bot && user.name !== 'slackbot') {
//                     humans.push(user);
//                 }
//             });

//             resolve(humans);
//         });
//     });
// }

// export async function sendDirectMessage (client: WebClient, logger: LoggerInstance, userId: string, sentimentExtract: SentimentExtract) {
//     return new Promise(async (
//         resolve: (value: any) => void,
//         reject: (value: string) => void
//     ) => {
//         try {
//             const { channel }: ImOpenResponse = await client.im.open(userId);
//             const { text, attachments } = buildSentimentQuestion(sentimentExtract, userId);
//             const directMessage = await client.chat.postMessage(channel.id, text, { attachments });

//             resolve(directMessage);
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

// /**
//  * Build the sentiment question object
//  * @param sentimentExtract
//  * @param userId
//  */
// export function buildSentimentQuestion (sentimentExtract: SentimentExtract, userId: string): { text: string, attachments: any[] } {
//     const text: string = "Have you got 5 minutes to help us train our Machine Learning platform? Read the extract below and let me know if you think it is *Positive*, *Negative* or *Neutral*";
//     const attachments: any[] = [
//         {
//             text: `"${sentimentExtract.text}"`,
//             callback_id: `${sentimentExtract._id}:${userId}`,
//             color: '#3AA3E3',
//             actions: [
//                 {
//                     name: "sentiment",
//                     text: ":smile:  Positive",
//                     type: "button",
//                     value: "positive"
//                 },
//                 {
//                     name: "sentiment",
//                     text: ":neutral_face:  Neutral",
//                     type: "button",
//                     value: "neutral"
//                 },
//                 {
//                     name: "sentiment",
//                     text: ":angry:  Negative",
//                     type: "button",
//                     value: "negative"
//                 }
//             ]
//         }
//     ];

//     return { text, attachments };
// }

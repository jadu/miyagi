// import { WebClient } from '@slack/client';
// import { Member } from './types';
// /**
//  * Get channel list
//  * @param client 
//  */
// export function getChannels (client: WebClient): Promise<any[]>  {
//     return new Promise(async (
//         resolve: (value: any[]) => void, 
//         reject: (value: string) => void
//     ) => {
//         try {
//             const { channels }: { channels: any[] } = await client.channels.list();
//             resolve(channels)
//         } catch (error) {
//             reject(error);
//         }
//     });
// }
// /**
//  * Get a user's info
//  * @param client 
//  * @param userId 
//  */
// export function getUserInfo (client: WebClient, userId: string): Promise<Member>  {
//     return new Promise(async (
//         resolve: (value: Member) => void, 
//         reject: (value: string) => void
//     ) => {
//         try {
//             const { user }: { user: Member } = await client.users.info(userId);
//             resolve(user)
//         } catch (error) {
//             reject(error);
//         }
//     });
// }
// /**
//  * Post Message
//  * @param client 
//  * @param userId 
//  */
// export function getUserInfo (client: WebClient, userId: string): Promise<Member>  {
//     return new Promise(async (
//         resolve: (value: Member) => void, 
//         reject: (value: string) => void
//     ) => {
//         try {
//             const { user }: { user: Member } = await client.users.info(userId);
//             resolve(user)
//         } catch (error) {
//             reject(error);
//         }
//     });
// }
// /**
//  * openDirectMessage
//  * @param client 
//  * @param userId 
//  */
// export function openDirectMessage (client: WebClient, userId: string): Promise<string>  {
//     return new Promise(async (
//         resolve: (value: string) => void, 
//         reject: (value: string) => void
//     ) => {
//         try {
//             const { channel }: {  channel: { id: string } } = await client.im.open(userId);
//             resolve(channel.id);
//         } catch (error) {
//             reject(error);
//         }
//     });
// } 
//# sourceMappingURL=slack.js.map
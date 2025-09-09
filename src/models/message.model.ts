export interface MessageModel{
    messageId: number,
    userId: number,
    content: string,
    title: string,
    createdAt: string,
    updatedAt: string | null
}
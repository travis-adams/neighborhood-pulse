export default interface Comment {
    id: number;
    userId: number;
    eventId: number;
    text: string;
    timestamp: Date;
    username: string;
}

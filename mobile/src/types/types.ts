export interface User {
    photoUrl?: string;
    title?: string;
    username: string;
    firstName: string;
    lastName: string;
    birthDate: string | Date;
    email: string;
}